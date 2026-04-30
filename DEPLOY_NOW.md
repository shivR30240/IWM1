# 🚀 Quick Deploy to Vercel

## Automated Deploy (5 minutes)

### Step 1: Install Vercel CLI
```bash
npm install -g vercel
```

### Step 2: Login to Vercel
```bash
vercel login
```

### Step 3: Deploy
```bash
# From project root
cd e:\indore-voice-connect
vercel
```

### Step 4: Configure
- **Set up and deploy?** Yes
- **Which scope?** Choose your account
- **Link to existing project?** No
- **Project name?** indore-voice-connect
- **Directory?** ./
- **Override settings?** No

### Step 5: Add Environment Variables
```bash
vercel env add TWILIO_ACCOUNT_SID
vercel env add TWILIO_AUTH_TOKEN
vercel env add TWILIO_PHONE_NUMBER
vercel env add SPEECH_TO_TEXT_PROVIDER
vercel env add SPEECH_TO_TEXT_API_KEY
vercel env add WHATSAPP_BUSINESS_ID
vercel env add WHATSAPP_TOKEN
vercel env add WHATSAPP_PHONE_NUMBER_ID
vercel env add WHATSAPP_VERIFY_TOKEN
vercel env add WHATSAPP_API_VERSION
vercel env add NEXT_PUBLIC_BASE_URL
```

### Step 6: Deploy to Production
```bash
vercel --prod
```

**Done!** Your app is now live at: `https://your-project.vercel.app`

---

## Manual Deploy via GitHub

### Step 1: Push to GitHub
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/indore-voice-connect.git
git push -u origin main
```

### Step 2: Connect to Vercel
1. Go to [vercel.com/new](https://vercel.com/new)
2. Import your GitHub repository
3. Add environment variables
4. Click Deploy

---

## Environment Variables for Production

Copy these to your Vercel/Netlify/Railway dashboard:

```env
# Twilio (Get from console.twilio.com)
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=your_auth_token
TWILIO_PHONE_NUMBER=+18001234567

# Speech-to-Text
SPEECH_TO_TEXT_PROVIDER=google
SPEECH_TO_TEXT_API_KEY=your_api_key

# WhatsApp (Get from developers.facebook.com)
WHATSAPP_BUSINESS_ID=your_business_id
WHATSAPP_TOKEN=your_access_token
WHATSAPP_PHONE_NUMBER_ID=your_phone_number_id
WHATSAPP_VERIFY_TOKEN=your_custom_verify_token
WHATSAPP_API_VERSION=v17.0

# Application
NEXT_PUBLIC_BASE_URL=https://your-domain.vercel.app
NODE_ENV=production
```

---

## Post-Deployment

### 1. Update Twilio Webhook
Go to Twilio Console → Phone Numbers → Your Number
Set webhook to:
```
https://your-domain.vercel.app/api/call/incoming
```

### 2. Update WhatsApp Webhook
Go to Meta Developer Console → WhatsApp → Configuration
Set callback URL to:
```
https://your-domain.vercel.app/api/whatsapp/webhook
```

### 3. Test Your App
Visit: `https://your-domain.vercel.app`

---

## Deploy to Other Platforms

### Netlify
```bash
npm install -g netlify-cli
netlify login
netlify deploy --prod
```

### Railway
1. Go to [railway.app](https://railway.app)
2. New Project → Deploy from GitHub
3. Add environment variables
4. Auto-deploys on push

---

## Troubleshooting

### Build Fails
```bash
# Clear cache and rebuild
rm -rf .next
npm run build
```

### Environment Variables Not Working
- Redeploy after adding variables
- Check variable names match exactly

### Webhooks Not Working
- Must use HTTPS
- Verify URLs are correct
- Check webhook logs

---

**Need help?** See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed guides.
