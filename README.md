# 🎮 Gamezop Arcade Website

A high-performance, responsive HTML5 web gaming hub powered by the **Gamezop All Games API** (`GET https://api.gamezop.com/v3/games`).

![Status](https://img.shields.io/badge/Status-Live%20Ready-brightgreen)
![Node](https://img.shields.io/badge/Node.js-v18%2B-blue)
![API](https://img.shields.io/badge/API-Gamezop%20v3-purple)

---

## 🚀 Quick Start

The server is currently running in the background at **[http://localhost:3000](http://localhost:3000)**!

To start it manually at any time:

```bash
# 1. Install dependencies (already installed)
npm install

# 2. Run the application
npm start
```

Then open your browser and navigate to:
👉 **`http://localhost:3000`**

---

## 🔑 How to Use Your Gamezop API Token

The app connects to Gamezop via:

```bash
curl --request GET \
  --url https://api.gamezop.com/v3/games \
  --header 'Authorization: Bearer <token>'
```

You can provide your token in two convenient ways:

### Option A: From the Web UI (Recommended)
1. Open the website at `http://localhost:3000`.
2. Click the **Demo Mode / API Settings** button (with the gear icon `⚙️`) in the top navigation bar.
3. Paste your **Bearer Token** into the input field and click **Verify & Connect Token**.
4. The system tests your token with Gamezop, saves it to `.env`, and automatically updates the catalog in real time!

### Option B: Via `.env` File
1. Open `.env` in the project root:
   ```env
   GAMEZOP_TOKEN=your_actual_token_here
   PORT=3000
   ```
2. Restart the server (`npm start`).

> **Note:** If no token is provided, the site automatically runs in **Demo Mode** with 250+ instant playable Gamezop games (including *Hextris*, *Bubble Shooter Classic*, *Ludo With Friends*, *Solitaire Gold*, and more).

---

## 🕹️ Features

* **Direct Gamezop API Integration**: Queries `https://api.gamezop.com/v3/games`, with automatic in-memory caching to optimize API rate limits.
* **Cinema & Smartphone Game Player**:
  * 📱 **Phone Frame Simulator**: Automatic responsive smartphone frame for vertical/portrait games.
  * 🖥️ **Widescreen / Screen Fit**: Optimized for horizontal desktop games.
  * 🎬 **Theater Mode**: Expands the game to full viewport width.
  * ⛶ **Native Fullscreen**: Press `F` or click fullscreen.
  * 🔄 **Reload Game**: Quick restart button.
  * ↗️ **Pop-out**: Opens the game in an unconstrained standalone browser tab.
* **Smart Catalog & Discovery**:
  * **Instant Search**: Filter 250+ games by title, category, or description (Press `/` to focus search).
  * **Category Navigation**: Arcade, Puzzle & Brain, Action, Board & Card, Sports & Racing, Strategy, and Casual.
  * **Orientation Filter**: Filter specifically for Mobile Portrait or Desktop Landscape games.
  * **Sort Options**: Most Popular, Top Rated, Title A-Z, Title Z-A.
  * **Spotlight Hero**: Featured game with high-res cover backdrop and quick play.
* **Favorites & Play History**:
  * ❤️ Bookmark games to your favorites list (saved locally in your browser).
  * 🕒 "Continue Playing" shelf to resume recently played games.
* **Clean Dark Cyberpunk UI**: Built with Tailwind CSS, custom glassmorphism, responsive grid layout, and zero heavy build step requirements.

---

## 📂 Project Structure

```text
├── public/
│   ├── index.html       # Single-page gaming hub interface
│   ├── style.css        # Cyber aesthetic, phone frame mockup, glassmorphism
│   └── app.js           # Client application, player state, catalog filters
├── data/
│   └── sample-games.json # High-fidelity 258-game demo fallback catalog
├── server.js            # Express API proxy, token manager & caching engine
├── .env                 # Environment variables (GAMEZOP_TOKEN, PORT)
├── .env.example         # Template for configuration
└── package.json         # Scripts and dependencies
```
