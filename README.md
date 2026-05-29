# RPS AI Chat Widget — Deployment Guide

## What's in this folder

```
rps-chat/
├── api/
│   └── chat.js              ← Vercel serverless proxy (keeps API key secret)
├── widget/
│   ├── rps-chat-widget.js   ← The chat widget (loads on your website)
│   └── embed-snippet.html   ← The one line to paste into WordPress
├── vercel.json              ← Vercel configuration
├── package.json
└── README.md
```

---

## Step 1 — Get an Anthropic API key

1. Go to https://console.anthropic.com
2. Sign up / log in
3. Click **API Keys** → **Create Key**
4. Copy the key (starts with `sk-ant-...`) — you'll need it in Step 3

---

## Step 2 — Deploy to Vercel

1. Go to https://vercel.com and sign up for free (use GitHub login if you have one)
2. Click **Add New → Project**
3. Choose **"Deploy from your computer"** or upload this folder
   - Easiest: drag the `rps-chat` folder into Vercel's upload area
4. Click **Deploy** — Vercel will give you a URL like `https://rps-chat-abc123.vercel.app`

---

## Step 3 — Add your API key to Vercel (keeps it secret)

1. In your Vercel project, go to **Settings → Environment Variables**
2. Add a new variable:
   - **Name:** `ANTHROPIC_API_KEY`
   - **Value:** your key from Step 1 (e.g. `sk-ant-api03-...`)
   - **Environment:** Production, Preview, Development (tick all)
3. Click **Save**
4. Go to **Deployments** and click **Redeploy** so the key takes effect

---

## Step 4 — Update the widget URL

Open `widget/rps-chat-widget.js` and find line 9:

```js
const PROXY_URL = 'https://YOUR-APP.vercel.app/api/chat';
```

Replace `YOUR-APP` with your actual Vercel project name, e.g.:

```js
const PROXY_URL = 'https://rps-chat-abc123.vercel.app/api/chat';
```

Save the file and redeploy (drag the folder to Vercel again, or use the Vercel CLI).

---

## Step 5 — Host the widget file

The widget JS file also needs to be accessible via URL. Easiest options:

**Option A — Host it on Vercel too (recommended)**
- Create a `public/` folder inside `rps-chat/`
- Move `rps-chat-widget.js` into `public/`
- Vercel serves files in `public/` automatically at `https://your-app.vercel.app/rps-chat-widget.js`

**Option B — Upload to your WordPress media library**
- Upload `rps-chat-widget.js` via WordPress → Media → Add New
- Copy the file URL

---

## Step 6 — Add to WordPress

1. Install the free plugin **"Insert Headers and Footers"** (or "WPCode")
2. Go to **Settings → Insert Headers and Footers**
3. Paste this into the **Footer** section:

```html
<script src="https://YOUR-APP.vercel.app/rps-chat-widget.js" defer></script>
```

4. Click **Save**
5. Visit your website — you should see the blue chat button in the bottom-right corner

---

## Optional — Connect to a CRM or email alert

In `rps-chat-widget.js`, find the `sendLeadToWebhook` function and add your webhook URL:

```js
const WEBHOOK_URL = 'https://hooks.zapier.com/hooks/catch/YOUR/HOOK/';
```

You can create a free Zapier workflow that:
- Receives the lead data (name, email, intent, budget, score)
- Adds it to a Google Sheet
- Sends you an email alert for hot leads
- Creates a contact in HubSpot or your CRM

---

## Troubleshooting

| Problem | Fix |
|---|---|
| Chat button doesn't appear | Check browser console for JS errors; make sure the script URL is correct |
| "Connection error" in chat | Check Vercel logs; make sure ANTHROPIC_API_KEY is set and redeployed |
| API key exposed warning | Make sure you're using the proxy URL, not calling Anthropic directly |
| CORS error | Add your domain to `allowedOrigins` in `api/chat.js` |

---

## Estimated time to deploy: 30–45 minutes

No coding experience needed for Steps 2–6. If you get stuck, share the error message and a developer can help in minutes.
