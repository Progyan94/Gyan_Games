# Gyan Games Studio — Online WebRTC Multiplayer Arcade

A serverless peer-to-peer multiplayer web gaming studio featuring classic schoolyard and tabletop games, built with **Three.js**, **Cannon.js**, **PeerJS WebRTC**, and **Pure CSS Hand Animations**.

Live Production Site: **[https://gyan-games.vercel.app](https://gyan-games.vercel.app)**

---

## 🎮 Included Games

### 1. 🖊️ Pen Fight 3D (`pen-fight.html`)
* **Real-time 3D Tabletop Physics**: Rigid-body Cannon.js edge tumbles and dry Coulomb wood friction.
* **Multi-Pen Arena**: 2 to 6 pens on desk simultaneously (Free-For-All Rumble).
* **8 Authentic Pen Archetypes**: VRT Mod, Parker Vector, Hauser XO, Reynolds 045, Linc Pentonic, Nataraj 621, Cello Gripper, Monami 153.
* **Tournament System**: 4-player and 8-player bracket cups, plus "Best of 1, 3, 5, 7" formats.
* **Strict Pen Ownership**: Dedicated device-slot mapping with zero turn conflicts.

---

### 2. ✂️ Rock Paper Scissors (`rps.html`)
* **Pure CSS Hand Gestures**: Beautiful vector-smooth CSS hands for Rock, Paper, and Scissors.
* **Instant Resolution (Zero Countdown)**: As soon as both players lock in their gesture, the clash resolves immediately with dynamic throw bounce animations.
* **Match Modes**: Best of 1, Best of 3, Best of 5, Best of 7, and Single-Elimination Knockout Tournaments.
* **WebRTC Multiplayer & Smart Bot**: Duel remote friends via room codes or practice against an adaptive bot.

---

### 3. 🏏 Hand Cricket Championship (`hand-cricket.html`)
* **11 Pure CSS Hand Gestures (0 to 10)**:
  * `0`: Closed Fist (all fingers tucked)
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

## 🌐 Universal Room Routing & Quick Join
* The main landing page (`index.html`) includes an instant room code join bar.
* Code prefix auto-routing:
  * `PF-XXXX` $\to$ Automatically launches **Pen Fight 3D** (`pen-fight.html?room=PF-XXXX`)
  * `RPS-XXXX` $\to$ Automatically launches **Rock Paper Scissors** (`rps.html?room=RPS-XXXX`)
  * `HC-XXXX` $\to$ Automatically launches **Hand Cricket** (`hand-cricket.html?room=HC-XXXX`)
* Live QR codes generated in-browser for instant mobile camera joining.

---

## 🚀 How to Run Locally

### Option 1: Quick Launch (Windows)
Double-click [`start_game.bat`](file:///c:/Users/gyanc/OneDrive/Desktop/CodeWorld/AntiGravity/Gyan%20Games%20Studio/start_game.bat). It opens the local server and launches your browser.

### Option 2: Python HTTP Server
```bash
python -m http.server 8080
```
Open `http://localhost:8080` in your browser.

---

## 📜 License
This project is open-source under the GNU General Public License v3.0.  
Created with passion by Progyan & Gyan Games Studio.
