# Deployment Guide - Destination Delusion

## Easiest Options (No Installation Required on Server)

### Option 1: Railway.app (RECOMMENDED - Easiest)
**Why**: Free tier, automatic deploys, zero config needed

1. Go to https://railway.app
2. Sign up with GitHub
3. Click "New Project" → "Deploy from GitHub repo"
4. Connect your GitHub account and select the repo
5. Railway auto-detects Node.js and deploys
6. You get a URL like: `your-app.railway.app`
7. Done! 🎉

**Cost**: Free tier includes $5 credit/month (plenty for this app)

---

### Option 2: Render.com (Also Very Easy)
**Why**: Free tier, simple UI, good performance

1. Go to https://render.com
2. Sign up (GitHub login recommended)
3. Click "New +" → "Web Service"
4. Connect your GitHub repo
5. Settings:
   - **Name**: destination-delusion
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
6. Click "Create Web Service"
7. Wait 2-3 minutes for build
8. You get a URL like: `your-app.onrender.com`

**Cost**: Free tier available (spins down after inactivity, but fine for occasional use)

---

### Option 3: Vercel (Good for Static + API)
**Why**: Super fast, good for frontend

1. Install Vercel CLI:
   ```bash
   npm install -g vercel
   ```

2. In your project folder:
   ```bash
   vercel
   ```

3. Follow prompts:
   - Login with GitHub/Email
   - Confirm project settings
   - Deploy!

4. You get a URL like: `your-app.vercel.app`

**Note**: Vercel works best with serverless functions. For real-time Socket.io, Railway or Render are better.

---

### Option 4: Fly.io (For Advanced Users)
**Why**: Good global performance

1. Install Fly CLI:
   ```bash
   curl -L https://fly.io/install.sh | sh
   ```

2. Login:
   ```bash
   fly auth login
   ```

3. Launch:
   ```bash
   fly launch
   ```

4. Follow prompts and deploy

---

## Local Testing First

Before deploying, test locally:

```bash
# Install dependencies
npm install

# Start server
npm start

# Open browser
# Go to: http://localhost:3000
```

Test with multiple browser windows/tabs to simulate multiple users.

---

## Environment Variables

The app automatically uses `process.env.PORT` for the port.

Most platforms (Railway, Render, Heroku) set this automatically.

---

## Post-Deployment Checklist

✅ Open the deployed URL  
✅ Test submission with your name  
✅ Test submission with "Mäsi" to get admin controls  
✅ Open in multiple devices/browsers to test real-time sync  
✅ Test the slot machine animation  
✅ Test the reset button (as Mäsi)  
✅ Test on mobile (portrait mode)  

---

## Troubleshooting

### "Cannot connect to server"
- Check if server is running
- Check WebSocket support (some platforms require config)
- Railway and Render support WebSockets by default

### "Submissions not appearing in real-time"
- Check browser console for Socket.io errors
- Try refreshing the page
- Check if server restarted (in-memory data is lost)

### "Slot machine not showing"
- Make sure you're logged in as "Mäsi"
- Check browser console for errors
- Try on different browser

---

## Recommended: Railway.app

For this app, **Railway** is the best choice because:
- Zero configuration needed
- WebSocket support out of the box
- Free tier is generous
- Auto-deploys on git push
- Easy to monitor logs
- No credit card required for free tier

---

## Share with Your Group

Once deployed, just share the URL with your guys' group:

```
🍺 Destination Delusion is live! 🍺

Submit your dream city and get roasted:
https://your-app.railway.app

First person to enter "Mäsi" becomes the admin!
```

---

Built with chaos and beer 🍺
