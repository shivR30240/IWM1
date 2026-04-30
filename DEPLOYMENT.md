# 🚀 Deployment Guide - Indore Voice Connect

## Quick Deploy Options

Choose one of the following deployment platforms:

1. **Vercel** (Recommended - Easiest)
2. **Netlify**
3. **AWS**
4. **DigitalOcean**
5. **Railway**

---

## Option 1: Deploy to Vercel (Recommended) ⭐

### Why Vercel?
- ✅ Free tier available
- ✅ Automatic deployments from Git
- ✅ Built for Next.js
- ✅ HTTPS included
- ✅ Easy environment variables setup

### Steps:

#### 1. Push to GitHub
```bash
cd e:\indore-voice-connect
git init
git add .
git commit -m "Initial commit - Indore Voice Connect"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/indore-voice-connect.git
git push -u origin main
```

#### 2. Deploy on Vercel
1. Go to [vercel.com](https://vercel.com)
2. Sign up/Login with GitHub
3. Click "Add New Project"
4. Import your repository
5. Configure:
   - **Project Name**: indore-voice-connect
   - **Framework**: Next.js (auto-detected)
   - **Root Directory**: ./
6. Add Environment Variables (see below)
7. Click "Deploy"

#### 3. Add Environment Variables
In Vercel Dashboard → Settings → Environment Variables:

```env
# Twilio
TWILIO_ACCOUNT_SID=your_account_sid
TWILIO_AUTH_TOKEN=your_auth_token
TWILIO_PHONE_NUMBER=+18001234567

# Speech-to-Text
SPEECH_TO_TEXT_PROVIDER=google
SPEECH_TO_TEXT_API_KEY=your_api_key

# WhatsApp
WHATSAPP_BUSINESS_ID=your_business_id
WHATSAPP_TOKEN=your_token
WHATSAPP_PHONE_NUMBER_ID=your_phone_number_id
WHATSAPP_VERIFY_TOKEN=your_verify_token
WHATSAPP_API_VERSION=v17.0

# App
NEXT_PUBLIC_BASE_URL=https://your-domain.vercel.app
NODE_ENV=production
```

#### 4. Configure Twilio Webhook
After deployment, update Twilio webhook URL:
```
https://your-app.vercel.app/api/call/incoming
```

#### 5. Configure WhatsApp Webhook
In Meta Developer Console:
```
https://your-app.vercel.app/api/whatsapp/webhook
```

---

## Option 2: Deploy to Netlify

### Steps:

#### 1. Push to GitHub
(Same as Vercel Step 1)

#### 2. Deploy on Netlify
1. Go to [netlify.com](https://www.netlify.com)
2. Click "Add new site" → Import from Git
3. Select your repository
4. Configure build settings:
   - **Build command**: `npm run build`
   - **Publish directory**: `.next`
   - **Node version**: 18+
5. Add environment variables
6. Click "Deploy site"

#### 3. Add netlify.toml
Create `netlify.toml` in project root:

```toml
[build]
  command = "npm run build"
  publish = ".next"

[[plugins]]
  package = "@netlify/plugin-nextjs"

[build.environment]
  NODE_VERSION = "18"
```

---

## Option 3: Deploy to Railway

### Steps:

#### 1. Connect to Railway
1. Go to [railway.app](https://railway.app)
2. Sign up with GitHub
3. Click "New Project" → "Deploy from GitHub repo"
4. Select your repository

#### 2. Configure
Railway auto-detects Next.js and configures automatically.

#### 3. Add Environment Variables
In Railway Dashboard → Variables:
(Add same variables as Vercel)

#### 4. Deploy
Railway deploys automatically on push.

---

## Option 4: Deploy to AWS (Advanced)

### Using AWS Amplify:

#### 1. Push to GitHub
(Same as Vercel Step 1)

#### 2. Setup Amplify
1. Go to AWS Amplify Console
2. Click "New App" → "Host web app"
3. Connect your GitHub repo
4. Build settings auto-detected
5. Add environment variables
6. Deploy

### Using EC2:

#### 1. Launch EC2 Instance
```bash
# Choose Amazon Linux 2 or Ubuntu
# t2.micro (free tier eligible)
```

#### 2. Install Dependencies
```bash
ssh -i your-key.pem ec2-user@your-ip

# Install Node.js
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
source ~/.bashrc
nvm install 18

# Install PM2
npm install -g pm2
```

#### 3. Deploy App
```bash
# Clone repository
git clone https://github.com/YOUR_USERNAME/indore-voice-connect.git
cd indore-voice-connect

# Install dependencies
npm install

# Build
npm run build

# Start with PM2
pm2 start npm --name "indore-voice" -- start
pm2 save
pm2 startup
```

#### 4. Setup Nginx (Optional)
```bash
sudo yum install nginx -y

sudo nano /etc/nginx/conf.d/indore-voice.conf
```

Add:
```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
sudo systemctl start nginx
sudo systemctl enable nginx
```

---

## Option 5: Deploy to DigitalOcean

### Using App Platform:

#### 1. Push to GitHub
(Same as Vercel Step 1)

#### 2. Create App
1. Go to DigitalOcean → Create → App
2. Connect GitHub repository
3. Configure:
   - **Source**: Your repo
   - **Branch**: main
   - **Build command**: `npm run build`
   - **Run command**: `npm start`
4. Add environment variables
5. Deploy

### Using Droplet:
(Similar to AWS EC2 steps)

---

## 📋 Pre-Deployment Checklist

### ✅ Code Preparation
- [ ] All features tested locally
- [ ] No console errors
- [ ] Environment variables documented
- [ ] `.env.local` added to `.gitignore`
- [ ] Build succeeds: `npm run build`

### ✅ Security
- [ ] No hardcoded secrets
- [ ] API routes protected
- [ ] CORS configured
- [ ] Rate limiting added (optional)

### ✅ Performance
- [ ] Images optimized
- [ ] Code splitting enabled
- [ ] Caching configured
- [ ] CDN enabled (optional)

### ✅ Monitoring
- [ ] Error tracking (Sentry)
- [ ] Analytics configured
- [ ] Logging setup
- [ ] Health checks added

---

## 🔧 Post-Deployment Configuration

### 1. Update Twilio Webhook
```
Production URL: https://your-domain.com/api/call/incoming
```

In Twilio Console:
- Phone Numbers → Your Number
- Configure webhook URL
- Set to HTTPS

### 2. Update WhatsApp Webhook
```
Production URL: https://your-domain.com/api/whatsapp/webhook
```

In Meta Developer Console:
- WhatsApp → Configuration
- Update Callback URL
- Verify token matches

### 3. Update BASE_URL
```env
NEXT_PUBLIC_BASE_URL=https://your-domain.com
```

### 4. Setup Custom Domain (Optional)

**Vercel:**
- Settings → Domains
- Add your domain
- Configure DNS as instructed

**Netlify:**
- Domain Settings → Add custom domain
- Update DNS records

### 5. Enable HTTPS
All platforms provide HTTPS automatically.

---

## 📊 Monitoring & Maintenance

### 1. Setup Error Tracking

**Install Sentry:**
```bash
npm install @sentry/nextjs
```

**Configure:**
```javascript
// sentry.client.config.js
import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: "your-sentry-dsn",
  tracesSampleRate: 1.0,
});
```

### 2. Setup Analytics
- Google Analytics
- Vercel Analytics (if on Vercel)
- Custom event tracking

### 3. Backup Strategy
- Database backups (if using DB)
- Environment variables backup
- Code repository backups

### 4. Update Deployment
```bash
# Make changes
git add .
git commit -m "Update description"
git push

# Auto-deploys on Vercel/Netlify/Railway
```

---

## 🐛 Troubleshooting

### Build Fails
```bash
# Clear cache
rm -rf .next
npm run build

# Check Node version
node -v  # Should be 18+
```

### Environment Variables Not Working
- Check variable names match exactly
- Redeploy after adding variables
- Check for typos

### Webhook Not Receiving
- Verify HTTPS URL
- Check webhook logs
- Verify token matches

### 500 Errors
- Check server logs
- Verify all env vars set
- Check API credentials

---

## 🎯 Recommended: Vercel Deployment

**Estimated Time**: 10 minutes

**Steps:**
1. Push to GitHub (2 min)
2. Connect to Vercel (3 min)
3. Add environment variables (3 min)
4. Deploy & configure webhooks (2 min)

**Cost**: FREE (Hobby tier)

**Benefits:**
- Automatic deployments
- Preview deployments
- Edge network (fast globally)
- Built-in analytics
- Easy rollback

---

## 📞 Need Help?

- **Vercel Docs**: https://vercel.com/docs
- **Next.js Deploy**: https://nextjs.org/docs/deployment
- **Twilio Setup**: https://www.twilio.com/docs
- **WhatsApp API**: https://developers.facebook.com/docs/whatsapp

---

**Ready to deploy?** Choose your platform and follow the steps! 🚀
