# 🍺 Destination Delusion 🍺

A real-time web application for guys' groups to randomly select their next trip destination with brutal humor and slot machine drama.

## Features

- Real-time submissions visible to all participants
- Context-aware insults that roast old guys about their destination choices
- Slot machine animation for winner selection
- Dark, bold, beer-themed aesthetic
- Mobile-responsive (portrait mode)
- Scattered card layout on desktop, list view on mobile
- Admin controls for the user named "Mäsi"

## Quick Start

### Install Dependencies
```bash
npm install
```

### Run Locally
```bash
npm start
```

Then open `http://localhost:3000` in your browser.

## Deployment

This app is designed for easy deployment to serverless platforms:

### Deploy to Vercel
1. Install Vercel CLI: `npm i -g vercel`
2. Run: `vercel`
3. Follow the prompts

### Deploy to Railway
1. Create account at railway.app
2. Click "New Project" → "Deploy from GitHub"
3. Connect your repo
4. Railway will auto-detect Node.js and deploy

### Deploy to Render
1. Create account at render.com
2. Click "New" → "Web Service"
3. Connect your repo
4. Set build command: `npm install`
5. Set start command: `npm start`

### Deploy to Heroku
```bash
heroku create your-app-name
git push heroku main
```

## How It Works

1. **Submit**: Everyone enters their name and dream city
2. **Get Roasted**: Receive a brutal, context-aware insult about your chances
3. **Watch**: See all submissions appear in real-time with scattered cards
4. **Select**: Only "Mäsi" can trigger the slot machine selection
5. **Winner**: Random city is chosen and highlighted in gold
6. **Reset**: Mäsi can reset everything for the next trip

## Admin Controls

The first person to submit with the name "Mäsi" becomes the admin and gets:
- "Start Selection" button (triggers slot machine)
- "Reset" button (clears all data for new session)
- Admin privileges persist even if they disconnect

## Technical Stack

- **Backend**: Node.js + Express + Socket.io
- **Frontend**: React (via CDN) + Vanilla CSS
- **Real-time**: WebSocket communication
- **Storage**: In-memory (no database needed)

## Browser Support

- Chrome/Edge (recommended)
- Firefox
- Safari
- Mobile browsers (portrait mode only)

## Notes

- Data is stored in memory - server restart clears everything
- No authentication required
- Designed for single group usage
- Names must be unique per session
- Submissions are final (no editing)

---

Built with chaos and beer 🍺
