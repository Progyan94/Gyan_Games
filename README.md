# Gyan Games Studio — Online WebRTC Multiplayer Nostalgia Arcade

A serverless peer-to-peer multiplayer web gaming studio featuring classic schoolyard, classroom, and tabletop games, built with **Three.js**, **Cannon.js**, **HTML5 Canvas**, **Web Audio API**, **PeerJS WebRTC**, and **Pure Vector Line Art / CSS Hand Gestures**.

Live Production Site: **[https://gyan-games.vercel.app](https://gyan-games.vercel.app)**

---

## 🎮 The Complete 9-Game Nostalgia Collection

### 1. 🖊️ Pen Fight 3D (`pen-fight.html`) &bull; Prefix `PF-*`
* **Real-time 3D Tabletop Physics**: Rigid-body Cannon.js edge tumbles and dry Coulomb wood friction.
* **Multi-Pen Arena**: 2 to 6 pens on desk simultaneously (Free-For-All Rumble).
* **8 Authentic Pen Archetypes**: VRT Mod, Parker Vector, Hauser XO, Reynolds 045, Linc Pentonic, Nataraj 621, Cello Gripper, Monami 153.
* **Tournament System**: 4-player and 8-player bracket cups, plus "Best of 1, 3, 5, 7" formats.
* **Strict Pen Ownership**: Dedicated device-slot mapping with zero turn conflicts.

---

### 2. 🏏 Hand Cricket Championship (`hand-cricket.html`) &bull; Prefix `HC-*`
* **11 Connected Line Art Hand Gestures (0 to 10)**:
  * `0`: Closed Fist
  * `1`: Index finger up
  * `2`: Index + Middle fingers up
  * `3`: Index + Middle + Ring fingers up
  * `4`: Index + Middle + Ring + Pinky up (thumb folded)
  * `5`: All 5 fingers extended open
  * `6`: Thumb only (fingers folded into fist)
  * `7`: Thumb + Index up (gun/L-shape)
  * `8`: Thumb + Index + Middle up
  * `9`: Thumb + Middle + Ring + Pinky up (index folded down!)
  * `10`: Thumb + Pinky up (Shaka / Hang Loose)
* **Game Modes**:
  * **Crazy Mode (0-10)**:
    * Range: 0 to 10.
    * **Successor / Predecessor = OUT!** If bowler throws $N-1$ or $N+1$ of batter's throw (e.g. Batter 5 vs Bowler 4 or 6 $\to$ OUT!).
    * **Same Number = Multiplier Slam!** Both throw same number $\to$ Runs are multiplied ($N \times N$) and added to total!
    * **Different Numbers**: Batter adds their thrown number to total score.
  * **Normal Mode (1-6)**:
    * Range: 1 to 6.
    * **Same Number = OUT!**
    * **Different Numbers**: Batter scores their thrown number.
* **Instant Ball Resolution**: No countdown timer; delivery executes as soon as both players lock in!
* **Full Match Flow**: Coin toss (Bat/Bowl selection), 1st and 2nd innings target chasing, scoreboard HUD, and WebRTC multiplayer.

---

### 3. ✂️ Rock Paper Scissors (`rps.html`) &bull; Prefix `RPS-*`
* **Connected Black Line Art Hand Gestures**: Clean vector hand outlines for Rock, Paper, and Scissors with rapid 3-beat delivery shake animation.
* **Instant Resolution (Zero Countdown)**: As soon as both players lock in their gesture, the clash resolves immediately with dynamic throw bounce animations.
* **Match Modes**: Best of 1, Best of 3, Best of 5, Best of 7, and Single-Elimination Knockout Tournaments.
* **WebRTC Multiplayer & Smart Bot**: Duel remote friends via room codes or practice against an adaptive bot.

---

### 4. 📖 Book Cricket 3D (`book-cricket.html`) &bull; Prefix `BC-*`
* **Interactive 3D Textbook Page Physics**: Smooth 3D page flip animation with real paper fluttering audio synthesized via Web Audio API.
* **Authentic Last-Digit Scoring**:
  * `1, 2, 3, 4, 5, 6`: Single, double, and boundary runs.
  * `8`: Four runs boundary!
  * `0`: OUT! (Wicket falls).
  * `7`: Wide ball (+1 run & free ball).
  * `9`: No ball (+1 run & Free Hit on the next page flip!).
* **Match Formats**: 1, 2, 5, or 10 Overs per innings, 10 wickets, 2nd innings target chase, and WebRTC multiplayer.

---

### 5. ⚛️ Chain Reaction (`chain-reaction.html`) &bull; Prefix `CR-*`
* **Radioactive Orb Grid ($6\times9$)**: Place colored atoms that build up unstable energy inside cells.
* **Critical Mass Explosions**:
  * Corners: Critical Mass = 2 (explodes into 2 orthogonal neighbors).
  * Edges: Critical Mass = 3 (explodes into 3 orthogonal neighbors).
  * Inner Cells: Critical Mass = 4 (explodes into 4 orthogonal neighbors).
* **Cascading Chain Reactions**: Exploding orbs convert adjacent enemy orbs into the current player's color, triggering domino reactions across the board.
* **2 to 8 Player Customization**: Multi-color player slots with WebRTC and greedy chain AI bot.

---

### 6. ✏️ Dots and Boxes (`dots-and-boxes.html`) &bull; Prefix `DB-*`
* **Classroom Grid Paper Aesthetic**: Crisp lined notebook paper with red margin and blue ruling.
* **Line Claiming Mechanics**: Click or tap horizontal and vertical line segments between grid dots.
* **Box Capture & Bonus Turns**: Completing the 4th side of any $1\times1$ box claims it with your initials/color and rewards you an immediate extra turn (chaining streaks!).
* **Configurable Board Sizes**: $4\times4$, $5\times5$, and $6\times6$ grids.
* **Greedy Minimax Bot & WebRTC**: Practice solo against an AI that spots open boxes or play multiplayer with friends.

---

### 7. 🧠 Ultimate Tic-Tac-Toe (`ultimate-ttt.html`) &bull; Prefix `UTTT-*`
* **81 Cells Across 9 Nested Boards**: A giant $3\times3$ master board composed of nine individual $3\times3$ local games.
* **Tactical Quadrant Routing**: Whichever cell index you play within a small board forces your opponent to make their next move in the corresponding large quadrant!
* **Free-Move Fallback**: If sent to a board that is already won or full, the player may pick any open cell anywhere on the board.
* **Master Victory Condition**: Win 3 local boards in a row (horizontal, vertical, or diagonal) to conquer the match.

---

### 8. 🎯 Name, Place, Animal, Thing (`npat.html`) &bull; Prefix `NPAT-*`
* **Classroom Notebook Ruled Paper**: Handwritten style columns for Name, Place, Animal, and Thing.
* **Mechanical Alphabet Spinner**: Spin letter wheel with ticking audio to select a random letter from A to Z.
* **The "STOP!" Buzzer**: Filling all 4 categories unlocks the urgent STOP button, triggering a 10-second buzzer for all other players!
* **Peer Review & Challenge Scoring Table**:
  * Word starts with target letter and is unique: **+10 points**.
  * Word starts with target letter but matches another player: **+5 points**.
  * Word blank or rejected: **0 points**.
  * Interactive challenge toggle: players can challenge questionable submissions.
* **Smart Bot Dictionary**: Comprehensive offline vocabulary database for all letters A-Z.

---

### 9. 🔴 Carrom Board 2D (`carrom.html`) &bull; Prefix `CARROM-*`
* **Realistic Wooden Board Physics**: Continuous 2D rigid-body elastic collisions with restitution, smooth boric powder friction ($0.984$), and 4 corner pocket nets.
* **Traditional Pieces**:
  * 1 Large Acrylic Striker (mass $3.2\times$, player controllable).
  * 9 White Pieces (+10 pts).
  * 9 Black Pieces (+5 pts).
  * 1 Queen Piece (+25 pts with cover).
* **Official Rules**:
  * Baseline slider positioning and drag-to-aim power meter.
  * Queen Cover: pocketing the Queen requires pocketing another coin on the same or next turn.
  * Striker Foul: pocketing the striker returns 1 coin to center and ends the turn.
  * Streak Turns: pocketing your coin gives you another shot.
* **AI Bot & WebRTC**: Solo player mode with an aiming AI or 2-player P2P multiplayer.

---

## 🌐 Universal Room Routing & Quick Join

The main landing page (`index.html`) features a universal room code join bar that automatically routes to the appropriate game:

| Room Code Prefix | Target Game | Target File |
| :--- | :--- | :--- |
| `PF-XXXX` | Pen Fight 3D | [`pen-fight.html`](file:///c:/Users/gyanc/OneDrive/Desktop/CodeWorld/AntiGravity/Gyan%20Games%20Studio/pen-fight.html) |
| `HC-XXXX` | Hand Cricket Championship | [`hand-cricket.html`](file:///c:/Users/gyanc/OneDrive/Desktop/CodeWorld/AntiGravity/Gyan%20Games%20Studio/hand-cricket.html) |
| `RPS-XXXX` | Rock Paper Scissors | [`rps.html`](file:///c:/Users/gyanc/OneDrive/Desktop/CodeWorld/AntiGravity/Gyan%20Games%20Studio/rps.html) |
| `BC-XXXX` | Book Cricket 3D | [`book-cricket.html`](file:///c:/Users/gyanc/OneDrive/Desktop/CodeWorld/AntiGravity/Gyan%20Games%20Studio/book-cricket.html) |
| `CR-XXXX` | Chain Reaction | [`chain-reaction.html`](file:///c:/Users/gyanc/OneDrive/Desktop/CodeWorld/AntiGravity/Gyan%20Games%20Studio/chain-reaction.html) |
| `DB-XXXX` | Dots and Boxes | [`dots-and-boxes.html`](file:///c:/Users/gyanc/OneDrive/Desktop/CodeWorld/AntiGravity/Gyan%20Games%20Studio/dots-and-boxes.html) |
| `UTTT-XXXX` | Ultimate Tic-Tac-Toe | [`ultimate-ttt.html`](file:///c:/Users/gyanc/OneDrive/Desktop/CodeWorld/AntiGravity/Gyan%20Games%20Studio/ultimate-ttt.html) |
| `NPAT-XXXX` | Name, Place, Animal, Thing | [`npat.html`](file:///c:/Users/gyanc/OneDrive/Desktop/CodeWorld/AntiGravity/Gyan%20Games%20Studio/npat.html) |
| `CARROM-XXXX` | Carrom Board 2D | [`carrom.html`](file:///c:/Users/gyanc/OneDrive/Desktop/CodeWorld/AntiGravity/Gyan%20Games%20Studio/carrom.html) |

Live QR codes and one-click copy invite links are generated in-browser for effortless phone-to-phone and phone-to-laptop pairing.

---

## 🚀 How to Run Locally

### Option 1: Quick Launch (Windows)
Double-click [`start_game.bat`](file:///c:/Users/gyanc/OneDrive/Desktop/CodeWorld/AntiGravity/Gyan%20Games%20Studio/start_game.bat). It starts a local HTTP server and opens your default browser.

### Option 2: Python HTTP Server
```bash
python -m http.server 8080
```
Open `http://localhost:8080` in your web browser.

### Option 3: Node.js `npx serve`
```bash
npx serve .
```

---

## 🛠️ Architecture & Tech Stack

* **Zero External Media Dependencies**: All graphics are rendered in real time using Three.js 3D WebGL, 2D HTML5 Canvas, SVG paths, or Pure CSS. All sound effects are generated algorithmically using the Web Audio API synthesizer.
* **Pure P2P Multiplayer**: Built on PeerJS WebRTC DataChannels. Direct peer connections mean 0 server hosting costs and ultra-low latency.
* **Fully Responsive**: Optimized for touchscreens, mobile portrait/landscape, and desktop mouse/keyboard inputs.

---

## 📜 License
This project is open-source under the GNU General Public License v3.0.  
Created with passion by Progyan & Gyan Games Studio.
