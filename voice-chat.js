/**
 * Gyan Games Studio — WebRTC Peer-to-Peer Voice Chat Engine
 * Universal zero-dependency Voice Chat with audio level meters, speaking visualizers,
 * microphone mute/unmute, deafen, participant management, and tournament callouts.
 * Built on native WebRTC (getUserMedia & PeerJS MediaConnection).
 */

class GyanVoiceChatEngine {
    constructor() {
        this.peer = null;
        this.localStream = null;
        this.isHost = false;
        this.roomCode = null;
        this.localPlayerName = 'Player';
        this.localPeerId = null;

        this.isMicMuted = false;
        this.isDeafened = false;
        this.isVoiceEnabled = false;

        // Active peer calls: peerId -> { call, stream, audioEl, isSpeaking, name, isHost, volume }
        this.remotePeers = new Map();

        // Audio Context & Analyser for speaking detection
        this.audioCtx = null;
        this.localAnalyser = null;
        this.localDataArray = null;
        this.isLocalSpeaking = false;
        this.analysisAnimFrame = null;

        // Custom callbacks for in-game HUDs (e.g. 3D nametag glow)
        this.onSpeakingChange = null; // (peerId, isSpeaking) => {}
        this.onPeersUpdated = null;   // (peersList) => {}

        // UI Widget Elements
        this.widgetEl = null;
        this.isWidgetMinimized = false;

        // Sound Chimes (AudioContext synthesizer)
        this.sfxCtx = null;
    }

    /**
     * Play synthesizer notification chimes for voice actions
     */
    playChime(type) {
        try {
            if (!this.sfxCtx) {
                const AudioCtx = window.AudioContext || window.webkitAudioContext;
                if (AudioCtx) this.sfxCtx = new AudioCtx();
            }
            if (!this.sfxCtx) return;
            const now = this.sfxCtx.currentTime;
            const osc = this.sfxCtx.createOscillator();
            const gain = this.sfxCtx.createGain();
            osc.connect(gain);
            gain.connect(this.sfxCtx.destination);

            if (type === 'unmute') {
                // Happy ascending two-tone
                osc.type = 'sine';
                osc.frequency.setValueAtTime(440, now);
                osc.frequency.exponentialRampToValueAtTime(880, now + 0.12);
                gain.gain.setValueAtTime(0.12, now);
                gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);
                osc.start(now);
                osc.stop(now + 0.18);
            } else if (type === 'mute') {
                // Descending two-tone
                osc.type = 'sine';
                osc.frequency.setValueAtTime(700, now);
                osc.frequency.exponentialRampToValueAtTime(350, now + 0.12);
                gain.gain.setValueAtTime(0.12, now);
                gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);
                osc.start(now);
                osc.stop(now + 0.18);
            } else if (type === 'join') {
                // Gentle ping
                osc.type = 'triangle';
                osc.frequency.setValueAtTime(587.33, now);
                osc.frequency.exponentialRampToValueAtTime(1174.66, now + 0.15);
                gain.gain.setValueAtTime(0.15, now);
                gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
                osc.start(now);
                osc.stop(now + 0.25);
            }
        } catch (e) {}
    }

    /**
     * Initialize or attach Voice Chat to an existing PeerJS instance
     */
    attachPeer(peer, config = {}) {
        if (!peer) return;
        this.peer = peer;
        this.isHost = !!config.isHost;
        this.roomCode = config.roomCode || null;
        this.localPlayerName = config.localName || localStorage.getItem('gyan_player_name') || 'Player';
        this.onSpeakingChange = config.onSpeakingChange || null;
        this.onPeersUpdated = config.onPeersUpdated || null;

        if (peer.id) {
            this.localPeerId = peer.id;
        } else {
            peer.on('open', (id) => {
                this.localPeerId = id;
            });
        }

        // Listen for incoming WebRTC audio calls
        peer.on('call', (mediaCall) => {
            console.log('[VoiceChat] Incoming audio call from:', mediaCall.peer);
            this.handleIncomingCall(mediaCall);
        });

        // Inject UI widget onto the page
        this.createVoiceUI();

        console.log('[VoiceChat] Voice engine initialized. Ready for calls.');
    }

    /**
     * Request microphone access and prepare local audio stream
     */
    async enableMicrophone() {
        if (this.localStream) return this.localStream;
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                audio: {
                    echoCancellation: true,
                    noiseSuppression: true,
                    autoGainControl: true,
                    sampleRate: 48000
                },
                video: false
            });

            this.localStream = stream;
            this.isVoiceEnabled = true;

            // Setup local audio analyzer for speaking detection
            this.setupLocalAnalyser(stream);

            this.updateWidgetUI();
            this.playChime('unmute');
            console.log('[VoiceChat] Microphone permission granted.');

            // Call all known remote peers who haven't been called yet
            this.callAllConnectedPeers();

            return stream;
        } catch (err) {
            console.warn('[VoiceChat] Microphone access denied or unavailable:', err);
            alert('Microphone access is needed for Voice Chat. Please allow microphone permissions in your browser bar.');
            return null;
        }
    }

    /**
     * Set up Web Audio AnalyserNode to detect speaking volume
     */
    setupLocalAnalyser(stream) {
        try {
            const AudioCtx = window.AudioContext || window.webkitAudioContext;
            if (!this.audioCtx) this.audioCtx = new AudioCtx();
            if (this.audioCtx.state === 'suspended') {
                this.audioCtx.resume();
            }

            const source = this.audioCtx.createMediaStreamSource(stream);
            this.localAnalyser = this.audioCtx.createAnalyser();
            this.localAnalyser.fftSize = 512;
            this.localAnalyser.smoothingTimeConstant = 0.4;
            source.connect(this.localAnalyser);

            this.localDataArray = new Uint8Array(this.localAnalyser.frequencyBinCount);
            this.startSpeakingDetectionLoop();
        } catch (e) {
            console.warn('[VoiceChat] Audio analyser setup failed:', e);
        }
    }

    /**
     * Loop analyzing mic and remote audio levels
     */
    startSpeakingDetectionLoop() {
        const checkLevels = () => {
            // Local mic level
            if (this.localAnalyser && this.localStream && !this.isMicMuted) {
                this.localAnalyser.getByteFrequencyData(this.localDataArray);
                let sum = 0;
                for (let i = 0; i < this.localDataArray.length; i++) {
                    sum += this.localDataArray[i];
                }
                const avg = sum / this.localDataArray.length;
                const isSpeaking = avg > 16; // Threshold for vocal energy

                if (isSpeaking !== this.isLocalSpeaking) {
                    this.isLocalSpeaking = isSpeaking;
                    this.updateLocalSpeakingIndicator(isSpeaking);
                    if (this.onSpeakingChange) {
                        this.onSpeakingChange('local', isSpeaking);
                    }
                }
            } else if (this.isLocalSpeaking) {
                this.isLocalSpeaking = false;
                this.updateLocalSpeakingIndicator(false);
                if (this.onSpeakingChange) {
                    this.onSpeakingChange('local', false);
                }
            }

            // Remote peers levels
            this.remotePeers.forEach((pData, peerId) => {
                if (pData.analyser && pData.dataArray && !this.isDeafened) {
                    pData.analyser.getByteFrequencyData(pData.dataArray);
                    let sum = 0;
                    for (let i = 0; i < pData.dataArray.length; i++) {
                        sum += pData.dataArray[i];
                    }
                    const avg = sum / pData.dataArray.length;
                    const isSpeaking = avg > 14;

                    if (isSpeaking !== pData.isSpeaking) {
                        pData.isSpeaking = isSpeaking;
                        this.updateRemoteSpeakingIndicator(peerId, isSpeaking);
                        if (this.onSpeakingChange) {
                            this.onSpeakingChange(peerId, isSpeaking);
                        }
                    }
                }
            });

            this.analysisAnimFrame = requestAnimationFrame(checkLevels);
        };

        if (this.analysisAnimFrame) cancelAnimationFrame(this.analysisAnimFrame);
        this.analysisAnimFrame = requestAnimationFrame(checkLevels);
    }

    /**
     * Connect an outgoing media call to a remote peer
     */
    async callPeer(remotePeerId, remoteName = 'Opponent') {
        if (!this.peer || !remotePeerId || remotePeerId === this.localPeerId) return;
        if (this.remotePeers.has(remotePeerId)) return; // Already connected

        // Ensure we have local stream (or create a silent one if user hasn't unmuted yet)
        if (!this.localStream) {
            await this.enableMicrophone();
        }
        if (!this.localStream) return;

        console.log('[VoiceChat] Calling remote peer for voice:', remotePeerId);
        try {
            const call = this.peer.call(remotePeerId, this.localStream, {
                metadata: {
                    name: this.localPlayerName,
                    isHost: this.isHost
                }
            });

            if (!call) return;
            this.handleMediaCall(call, remoteName);
        } catch (err) {
            console.warn('[VoiceChat] Failed to call peer:', remotePeerId, err);
        }
    }

    /**
     * Answer incoming media call from a remote peer
     */
    async handleIncomingCall(call) {
        if (!this.localStream) {
            await this.enableMicrophone();
        }

        const callerName = (call.metadata && call.metadata.name) ? call.metadata.name : 'Opponent';
        console.log('[VoiceChat] Answering voice call from:', call.peer, callerName);

        if (this.localStream) {
            call.answer(this.localStream);
        } else {
            // Answer with dummy/silent audio if mic denied
            call.answer();
        }

        this.handleMediaCall(call, callerName);
    }

    /**
     * Attach remote stream to HTML5 Audio element and Analyser
     */
    handleMediaCall(call, remoteName) {
        call.on('stream', (remoteStream) => {
            console.log('[VoiceChat] Received remote audio stream from:', call.peer);
            this.playChime('join');

            // Create Audio Element
            let audioEl = document.getElementById(`voice-audio-${call.peer}`);
            if (!audioEl) {
                audioEl = document.createElement('audio');
                audioEl.id = `voice-audio-${call.peer}`;
                audioEl.autoplay = true;
                audioEl.playsInline = true;
                document.body.appendChild(audioEl);
            }
            audioEl.srcObject = remoteStream;
            audioEl.muted = this.isDeafened;
            audioEl.volume = 1.0;
            audioEl.play().catch(e => console.warn('[VoiceChat] Autoplay waiting on user interaction:', e));

            // Setup Analyser for remote peer
            let analyser = null;
            let dataArray = null;
            try {
                const AudioCtx = window.AudioContext || window.webkitAudioContext;
                if (!this.audioCtx) this.audioCtx = new AudioCtx();
                const source = this.audioCtx.createMediaStreamSource(remoteStream);
                analyser = this.audioCtx.createAnalyser();
                analyser.fftSize = 512;
                analyser.smoothingTimeConstant = 0.4;
                source.connect(analyser);
                dataArray = new Uint8Array(analyser.frequencyBinCount);
            } catch (e) {}

            this.remotePeers.set(call.peer, {
                call: call,
                stream: remoteStream,
                audioEl: audioEl,
                name: (call.metadata && call.metadata.name) || remoteName,
                isHost: call.metadata ? !!call.metadata.isHost : false,
                isSpeaking: false,
                volume: 100,
                analyser: analyser,
                dataArray: dataArray
            });

            this.updateWidgetUI();
            if (this.onPeersUpdated) this.onPeersUpdated(this.getPeerList());
        });

        call.on('close', () => {
            console.log('[VoiceChat] Call closed with:', call.peer);
            this.cleanupPeer(call.peer);
        });

        call.on('error', (err) => {
            console.warn('[VoiceChat] Call error with:', call.peer, err);
            this.cleanupPeer(call.peer);
        });
    }

    cleanupPeer(peerId) {
        const pData = this.remotePeers.get(peerId);
        if (pData) {
            if (pData.audioEl) pData.audioEl.remove();
            this.remotePeers.delete(peerId);
        }
        this.updateWidgetUI();
        if (this.onPeersUpdated) this.onPeersUpdated(this.getPeerList());
    }

    /**
     * Trigger calls to all connected peers in mesh
     */
    callAllConnectedPeers() {
        if (!this.peer) return;

        // If we have access to the game's connections
        if (window.net && window.net.connections) {
            window.net.connections.forEach((conn, peerId) => {
                this.callPeer(peerId, conn.metadata ? conn.metadata.name : 'Peer');
            });
        }
        if (window.net && window.net.hostConn) {
            this.callPeer(window.net.hostConn.peer, 'Host');
        }
        if (window.gameState && window.gameState.players) {
            window.gameState.players.forEach(p => {
                if (p.peerId && p.peerId !== 'HOST' && p.peerId !== this.localPeerId) {
                    this.callPeer(p.peerId, p.name);
                }
            });
        }
    }

    /**
     * Mute / Unmute Local Microphone
     */
    toggleMute() {
        if (!this.localStream) {
            this.enableMicrophone();
            return;
        }

        this.isMicMuted = !this.isMicMuted;
        this.localStream.getAudioTracks().forEach(track => {
            track.enabled = !this.isMicMuted;
        });

        this.playChime(this.isMicMuted ? 'mute' : 'unmute');
        this.updateWidgetUI();
        console.log('[VoiceChat] Mic muted:', this.isMicMuted);
    }

    /**
     * Deafen / Undeafen (Mute incoming voices)
     */
    toggleDeafen() {
        this.isDeafened = !this.isDeafened;
        this.remotePeers.forEach(pData => {
            if (pData.audioEl) {
                pData.audioEl.muted = this.isDeafened;
            }
        });

        this.playChime(this.isDeafened ? 'mute' : 'unmute');
        this.updateWidgetUI();
        console.log('[VoiceChat] Deafened:', this.isDeafened);
    }

    setPeerVolume(peerId, volumePercent) {
        const p = this.remotePeers.get(peerId);
        if (p && p.audioEl) {
            p.volume = Math.max(0, Math.min(100, volumePercent));
            p.audioEl.volume = p.volume / 100;
        }
    }

    getPeerList() {
        const list = [];
        list.push({
            id: 'local',
            name: this.localPlayerName + ' (You)',
            isHost: this.isHost,
            isMe: true,
            isMuted: this.isMicMuted,
            isSpeaking: this.isLocalSpeaking
        });

        this.remotePeers.forEach((pData, peerId) => {
            list.push({
                id: peerId,
                name: pData.name,
                isHost: pData.isHost,
                isMe: false,
                isMuted: false,
                isSpeaking: pData.isSpeaking,
                volume: pData.volume
            });
        });

        return list;
    }

    /* -------------------------------------------------------------
       UI: Floating Glassmorphism Voice Controller
    ------------------------------------------------------------- */
    createVoiceUI() {
        if (document.getElementById('gyan-voice-widget')) return;

        const widget = document.createElement('div');
        widget.id = 'gyan-voice-widget';
        widget.className = 'fixed bottom-4 right-4 z-50 flex flex-col items-end gap-2 select-none font-sans pointer-events-auto transition-all';
        widget.innerHTML = `
            <!-- Expanded Voice Drawer / Participants -->
            <div id="voice-drawer" class="hidden w-72 bg-slate-900/90 backdrop-blur-md text-white rounded-3xl p-4 shadow-2xl border border-slate-700/60 transition-all flex flex-col gap-3">
                <div class="flex items-center justify-between border-b border-slate-800 pb-2">
                    <div class="flex items-center gap-2">
                        <span class="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
                        <h4 class="font-extrabold text-xs tracking-wide uppercase text-slate-200">WebRTC Voice Chat</h4>
                    </div>
                    <span id="voice-connected-count" class="text-[10px] font-mono font-bold bg-slate-800 text-slate-300 px-2 py-0.5 rounded-full">1 Online</span>
                </div>

                <!-- Participants List -->
                <div id="voice-participants-list" class="space-y-2 max-h-48 overflow-y-auto pr-1">
                    <!-- Populated dynamically via updateWidgetUI() -->
                </div>

                <!-- Info note -->
                <div class="text-[10px] text-slate-400 flex items-center justify-between border-t border-slate-800/80 pt-2">
                    <span>Press <kbd class="px-1.5 py-0.5 bg-slate-800 rounded font-mono text-white">M</kbd> to Mute</span>
                    <span class="text-emerald-400 font-bold">P2P Encrypted</span>
                </div>
            </div>

            <!-- Main Floating Controller Pill -->
            <div id="voice-pill" class="flex items-center gap-1.5 p-1.5 bg-slate-900/90 backdrop-blur-md rounded-full border border-slate-700/70 shadow-2xl transition-all">
                <!-- Speaking Pulse Wave -->
                <div id="voice-local-wave" class="w-8 h-8 rounded-full flex items-center justify-center transition-all bg-slate-800 text-slate-300">
                    <span class="material-symbols-rounded text-lg" id="voice-status-icon">mic</span>
                </div>

                <!-- Room / Tournament Label -->
                <button id="btn-toggle-voice-drawer" class="px-2.5 py-1 rounded-full text-xs font-bold text-slate-200 hover:text-white flex items-center gap-1 transition-all">
                    <span class="text-[11px] font-mono font-bold text-emerald-400" id="voice-pill-count">Voice (1)</span>
                    <span class="material-symbols-rounded text-sm text-slate-400">expand_less</span>
                </button>

                <!-- Mic Toggle Button -->
                <button id="btn-voice-mic" class="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-white flex items-center justify-center transition-all" title="Toggle Microphone (M)">
                    <span class="material-symbols-rounded text-base" id="icon-voice-mic">mic</span>
                </button>

                <!-- Deafen Button -->
                <button id="btn-voice-deafen" class="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-white flex items-center justify-center transition-all" title="Deafen / Mute Incoming Audio">
                    <span class="material-symbols-rounded text-base" id="icon-voice-deafen">headphones</span>
                </button>
            </div>
        `;

        document.body.appendChild(widget);
        this.widgetEl = widget;

        // Button Listeners
        const btnDrawer = widget.querySelector('#btn-toggle-voice-drawer');
        const drawer = widget.querySelector('#voice-drawer');
        btnDrawer.addEventListener('click', () => {
            drawer.classList.toggle('hidden');
        });

        const btnMic = widget.querySelector('#btn-voice-mic');
        btnMic.addEventListener('click', () => this.toggleMute());

        const btnDeafen = widget.querySelector('#btn-voice-deafen');
        btnDeafen.addEventListener('click', () => this.toggleDeafen());

        // Keyboard Shortcut 'M' for quick mic mute/unmute
        window.addEventListener('keydown', (e) => {
            // Ignore if typing in an input or textarea
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
            if (e.key === 'm' || e.key === 'M') {
                this.toggleMute();
            }
        });

        this.updateWidgetUI();
    }

    updateWidgetUI() {
        if (!this.widgetEl) return;

        const micBtn = this.widgetEl.querySelector('#btn-voice-mic');
        const micIcon = this.widgetEl.querySelector('#icon-voice-mic');
        const deafenBtn = this.widgetEl.querySelector('#btn-voice-deafen');
        const deafenIcon = this.widgetEl.querySelector('#icon-voice-deafen');
        const countLabel = this.widgetEl.querySelector('#voice-pill-count');
        const countHeader = this.widgetEl.querySelector('#voice-connected-count');
        const listContainer = this.widgetEl.querySelector('#voice-participants-list');

        const totalConnected = 1 + this.remotePeers.size;
        countLabel.textContent = `Voice (${totalConnected})`;
        countHeader.textContent = `${totalConnected} Online`;

        // Mic Button State
        if (this.isMicMuted) {
            micBtn.className = 'w-8 h-8 rounded-full bg-rose-600 hover:bg-rose-500 text-white flex items-center justify-center transition-all shadow-md';
            micIcon.textContent = 'mic_off';
        } else {
            micBtn.className = 'w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-emerald-400 flex items-center justify-center transition-all';
            micIcon.textContent = 'mic';
        }

        // Deafen Button State
        if (this.isDeafened) {
            deafenBtn.className = 'w-8 h-8 rounded-full bg-rose-600 hover:bg-rose-500 text-white flex items-center justify-center transition-all shadow-md';
            deafenIcon.textContent = 'headset_off';
        } else {
            deafenBtn.className = 'w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-200 flex items-center justify-center transition-all';
            deafenIcon.textContent = 'headphones';
        }

        // Populate Participants Drawer List
        if (listContainer) {
            listContainer.innerHTML = '';
            const peers = this.getPeerList();

            peers.forEach(p => {
                const item = document.createElement('div');
                item.className = 'flex items-center justify-between p-2 rounded-xl bg-slate-800/80 border border-slate-700/50 text-xs';

                const isTalking = p.isSpeaking;
                const waveClass = isTalking ? 'ring-2 ring-emerald-400 animate-pulse bg-emerald-500/20 text-emerald-300' : 'bg-slate-700 text-slate-300';

                item.innerHTML = `
                    <div class="flex items-center gap-2">
                        <div class="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${waveClass}" id="voice-avatar-${p.id}">
                            ${p.isHost ? '👑' : (p.isMe ? '👤' : '🎮')}
                        </div>
                        <div>
                            <div class="font-extrabold text-slate-200 text-xs flex items-center gap-1">
                                <span class="truncate max-w-[110px]">${p.name}</span>
                                ${p.isHost ? '<span class="text-[9px] font-bold bg-amber-400 text-amber-950 px-1 rounded">HOST</span>' : ''}
                                ${p.isMe ? '<span class="text-[9px] font-bold bg-blue-500 text-white px-1 rounded">YOU</span>' : ''}
                            </div>
                            <span class="text-[9px] text-slate-400">${p.isMuted ? 'Muted' : (p.isSpeaking ? 'Speaking...' : 'Connected')}</span>
                        </div>
                    </div>

                    ${!p.isMe ? `
                        <div class="flex items-center gap-1.5">
                            <input type="range" min="0" max="100" value="${p.volume || 100}" 
                                class="w-16 h-1.5 bg-slate-600 rounded-lg appearance-none cursor-pointer accent-emerald-400"
                                oninput="window.GyanVoice.setPeerVolume('${p.id}', this.value)" title="Volume">
                        </div>
                    ` : ''}
                `;
                listContainer.appendChild(item);
            });
        }
    }

    updateLocalSpeakingIndicator(isSpeaking) {
        if (!this.widgetEl) return;
        const wave = this.widgetEl.querySelector('#voice-local-wave');
        if (wave) {
            if (isSpeaking) {
                wave.className = 'w-8 h-8 rounded-full flex items-center justify-center transition-all bg-emerald-500 text-white shadow-lg shadow-emerald-500/50 ring-2 ring-emerald-300 scale-105';
            } else {
                wave.className = 'w-8 h-8 rounded-full flex items-center justify-center transition-all bg-slate-800 text-slate-300';
            }
        }
        const avatar = this.widgetEl.querySelector('#voice-avatar-local');
        if (avatar) {
            if (isSpeaking) {
                avatar.className = 'w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ring-2 ring-emerald-400 animate-pulse bg-emerald-500/30 text-emerald-300';
            } else {
                avatar.className = 'w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold bg-slate-700 text-slate-300';
            }
        }
    }

    updateRemoteSpeakingIndicator(peerId, isSpeaking) {
        if (!this.widgetEl) return;
        const avatar = this.widgetEl.querySelector(`#voice-avatar-${peerId}`);
        if (avatar) {
            if (isSpeaking) {
                avatar.className = 'w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ring-2 ring-emerald-400 animate-pulse bg-emerald-500/30 text-emerald-300';
            } else {
                avatar.className = 'w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold bg-slate-700 text-slate-300';
            }
        }
    }
}

// Global instance
window.GyanVoice = new GyanVoiceChatEngine();
