# Pen Fight 3D — Online Multiplayer & Tournament Tabletop Arena

A real-time 3D rigid-body tabletop pen fight arena built with **Three.js**, **Cannon.js**, and **PeerJS WebRTC**.

---

## 🌟 What's New

### 1. 🌐 Serverless Online Multiplayer (Room Codes & QR Sharing)
* **P2P WebRTC Multiplayer**: Connect directly with friends across different devices (phones, tablets, laptops, PCs) without requiring any dedicated game servers!
* **Easy Room Codes**: Host creates a room and gets a 4-character code (e.g. `PF-7294`).
* **1-Tap Share Link & QR Code**: Friends can scan the live QR code with their mobile cameras or click the auto-generated link (`https://gyan-games.vercel.app/?room=PF-7294`) to jump right into the lobby.
* **Deterministic Synchronization**: Turn-based live drag vector sharing and high-frequency (30Hz) authoritative state sync ensure zero desync, even across diverse devices and network connections.

---

### 2. 🤼 Multi-Pen Arena (2 to 6 Pens on Desk)
* **Desk Rumble Chaos**: Fight with **2, 3, 4, 5, or 6 pens simultaneously** on the classroom wooden desk!
* **Symmetric Spawn Formations**: Pens spawn around the arena perimeter facing inward (Duel, Triangle, Cross, Pentagon, Hexagon).
* **Pairwise Rigid-Body Impulse Solver**: Exact 12-substep line-segment contact solver resolves simultaneous impacts, multi-pen chain collisions, and true Coulomb dry friction skids.
* **Quick HUD Toggle**: Click the **`4 Pens ▾`** pill in the top HUD anytime to cycle between 2, 3, 4, 5, and 6 active pens on the fly!
* **Surviving Pen Turn Cycle**: When a pen is knocked off the desk edge into a 3D Cannon.js tumble, it is eliminated for that round, and turns rotate among remaining survivors until only 1 pen stands!

---

### 3. 🏆 Tournament Bracket & "Best of _" System
* **"Best of _" Series Engine**:
  * Select **Best of 1**, **Best of 3**, **Best of 5**, or **Best of 7** directly from the top HUD or lobby.
  * Live round-win tracker with golden stars (★ ★ ☆).
* **Single-Elimination Tournament Knockout**:
  * Host a **4-Player** or **8-Player** Knockout Cup!
  * Visual interactive Tournament Bracket tree (Quarterfinals → Semifinals → Championship Grand Final).
  * Automatically seeds contestants, highlights active live duels, advances winners, and crowns the Ultimate Tournament Champion with golden trophies and canvas confetti!
* **Spectator Mode**: Non-participating tournament players can spectate live matches with multi-angle cameras (3D Orbit, Top Desk, Action Cam, Pen Follow).

---

### 4. 🖋️ Expanded 8-Pen Authentic Physics Roster
Every pen has grounded physical specs (3.1g – 5.0g mass, dry Coulomb friction $\mu$, moment of inertia $I$, and center-of-mass offset):

1. **VRT Tournament Mod (5.0g)**: Heavy symmetric dual-capped mod with metal momentum rings. Highest rotational inertia for spin stabilization.
2. **Parker Vector Metallix (4.6g)**: Brushed stainless steel barrel. Heavy linear ram with 80% grip anchor.
3. **Hauser XO (4.1g)**: Matte rubberized grip with 88% knockback resistance.
4. **Reynolds 045 Fine Carbure (3.5g)**: Iconic blue cap creating signature classroom pivot whip.
5. **Linc Pentonic (3.3g)**: Sleek charcoal monobody with blistering whip RPM.
6. **Nataraj 621 Classic (3.1g)**: Hexagonal crimson wood striker with crisp facet bounce and clacks.
7. **Cello Gripper Pro (3.6g)**: Textured elastic grip ring for agile counter-strikes.
8. **Monami 153 White (3.2g)**: Classic Korean clicker pen with light hexagonal desk glide.

---

### 5. 💬 Quick Emote Taunts & Synthesized Web Audio
* Tap the reaction button in the HUD to throw floating 3D emotes above your pen: 🔥 (Fire Shot), ⚡ (Whip Spin), 🎯 (Ram), 💀 (Ring-out), 😂 (Laugh), 👑 (Champion), 🛡️ (Grip Anchor), 🚀 (Rocket Skid)!
* Web Audio Synthesizer produces authentic plastic/metal contact cracks, dry wood friction skids, finger flick snaps, and victory fanfare without requiring external audio files.

---

## 🚀 How to Run

### Option 1: Quick Launch (Windows)
Double-click [`start_game.bat`](file:///c:/Users/gyanc/OneDrive/Desktop/CodeWorld/AntiGravity/Gyan%20Games%20Studio/start_game.bat). It automatically starts a local server on port 8080 and opens your browser.

### Option 2: Python HTTP Server
```bash
python -m http.server 8080
```
Open `http://localhost:8080` (or `http://<your-lan-ip>:8080` for other devices on the same Wi-Fi).

### Option 3: Double-Click File
You can also open [`index.html`](file:///c:/Users/gyanc/OneDrive/Desktop/CodeWorld/AntiGravity/Gyan%20Games%20Studio/index.html) directly in any modern browser (Chrome, Edge, Safari, Firefox).

---

## 📜 License & Open Source
This project is open-source under the GNU General Public License v3.0.  
Feel free to play, fork, and contribute!

*Created with passion by GyanXD25 & friends.*
