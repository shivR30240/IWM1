# 🚀 Quick Start - Call Automation System

## Getting Started in 5 Minutes

### 1. The System is Already Running! ✅
Your development server is running at: **http://localhost:3000**

### 2. Explore the Call Automation Features

#### Option A: View Admin Dashboard (Recommended)
1. Navigate to: **http://localhost:3000/admin**
2. Login with super_admin credentials
3. Check out these new pages:
   - **Call Statistics** (`/admin/call-stats`) - See analytics
   - **Call Logs** (`/admin/call-logs`) - View call history
   - **IVR Config** (`/admin/ivr-config`) - Configure IVR settings

#### Option B: Test the API
Open your terminal and run:

```bash
# View call statistics
curl http://localhost:3000/api/call/stats | json

# View call logs
curl http://localhost:3000/api/call/logs | json

# Create a test ticket from a voice call
curl -X POST http://localhost:3000/api/call/create-ticket ^
  -H "Content-Type: application/json" ^
  -d "{\"callerPhone\":\"+919876543210\",\"transcript\":\"Water supply issue in ward 15 Vijay Nagar\",\"processedData\":{\"category\":\"water_supply\",\"priority\":\"high\",\"location\":{\"wardNumber\":15,\"wardName\":\"Vijay Nagar\",\"area\":\"Vijay Nagar\",\"fullAddress\":\"Ward 15, Vijay Nagar\"},\"summary\":\"Water supply complaint in Vijay Nagar\",\"summaryHi\":\"जल आपूर्ति शिकायत\",\"confidence\":0.9}}"
```

### 3. See It in Action

The system is currently in **Mock Mode** which means:
- ✅ All features work without Twilio credentials
- ✅ Simulated speech-to-text with realistic complaints
- ✅ Mock SMS sending (check console logs)
- ✅ Sample data for testing

#### What Happens When a Call Comes In:

1. **Call Received** → System logs the incoming call
2. **IVR Greeting** → Plays bilingual welcome message
3. **Recording** → Records citizen's complaint (up to 3 minutes)
4. **Speech-to-Text** → Converts audio to text (mock: random complaint)
5. **NLU Processing** → Extracts category, location, priority
6. **Ticket Creation** → Creates ticket with ID like `IVC-2026-12345`
7. **SMS Sent** → Sends confirmation (logged to console)
8. **Confirmation** → Announces ticket ID to caller

### 4. Check the Console Logs

While testing, watch your terminal for logs like:
```
📞 Incoming call from: +919876543210
🎙️ Recording received
🎤 Processing speech-to-text with provider: google
🎭 Mock mode: Using simulated transcript
✅ Transcript: There is no water supply in ward number 15...
🧠 Processing complaint with NLU...
🎫 Creating ticket from call...
✅ Ticket stored: IVC-2026-12345
📱 Sending confirmation SMS...
📱 [MOCK SMS] To: +919876543210 | Message: Dear Citizen...
✅ SMS sent successfully
```

## Going to Production

When you're ready to use real Twilio and speech-to-text:

### Step 1: Get Twilio Credentials
1. Sign up at [twilio.com](https://www.twilio.com)
2. Get a phone number
3. Copy Account SID and Auth Token from Console
4. Update `.env.local`:
   ```
   TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxx
   TWILIO_AUTH_TOKEN=your_auth_token
   TWILIO_PHONE_NUMBER=+18001234567
   ```

### Step 2: Configure Speech-to-Text
Choose one:

**Google Cloud Speech-to-Text:**
```bash
npm install @google-cloud/speech
```
- Enable Speech-to-Text API in Google Cloud Console
- Download service account JSON
- Set `GOOGLE_APPLICATION_CREDENTIALS=./google-credentials.json`

**OR AssemblyAI:**
```
ASSEMBLYAI_API_KEY=your_api_key
```
- Sign up at [assemblyai.com](https://www.assemblyai.com)
- Get API key from dashboard

### Step 3: Set Up Webhook
For production:
```
https://your-domain.com/api/call/incoming
```

For local testing with ngrok:
```bash
ngrok http 3000
# Use the https URL provided by ngrok
```

Then in Twilio Console → Phone Numbers → Your Number → Voice Configuration:
- Set "A call comes in" webhook to your URL
- Method: HTTP POST

### Step 4: Test with Real Call
1. Call your Twilio number
2. Listen to the IVR greeting
3. Speak your complaint
4. Wait for ticket ID confirmation
5. Check SMS on your phone
6. View the ticket in your dashboard

## File Reference

### Core Files
- `src/lib/call/twilio-client.ts` - Twilio integration
- `src/lib/call/speech-to-text.ts` - Speech recognition
- `src/lib/call/nlu-processor.ts` - AI classification
- `src/lib/call/ticket-workflow.ts` - Ticket creation

### API Routes
- `src/app/api/call/incoming/route.ts` - Incoming calls
- `src/app/api/call/recording/route.ts` - Recording processing
- `src/app/api/call/create-ticket/route.ts` - Ticket creation
- `src/app/api/call/stats/route.ts` - Statistics
- `src/app/api/call/logs/route.ts` - Call logs

### Admin Pages
- `src/app/admin/call-stats/page.tsx` - Analytics dashboard
- `src/app/admin/call-logs/page.tsx` - Call history
- `src/app/admin/ivr-config/page.tsx` - IVR settings

### Documentation
- `CALL_AUTOMATION.md` - Complete guide (setup, API, troubleshooting)
- `IMPLEMENTATION_SUMMARY.md` - What was built
- `QUICK_START.md` - This file

## Need Help?

### Common Issues

**Problem**: Can't see admin pages
- **Solution**: Login as super_admin role

**Problem**: API returns errors
- **Solution**: Check console for error messages, verify .env.local exists

**Problem**: Mock mode not working
- **Solution**: Mock mode is automatic when no real API keys are set

**Problem**: Want to disable mock mode
- **Solution**: Add real Twilio and Speech-to-Text credentials

### Next Steps

1. ✅ Test the mock system (you're here)
2. 📝 Get Twilio credentials
3. 🎤 Configure speech-to-text API
4. 🌐 Set up webhook with ngrok
5. 📞 Test with real phone call
6. 🗄️ Connect to production database
7. 🚀 Deploy to production

## Resources

- **Twilio Docs**: https://www.twilio.com/docs
- **Google Speech-to-Text**: https://cloud.google.com/speech-to-text
- **AssemblyAI**: https://www.assemblyai.com/docs
- **Next.js**: https://nextjs.org/docs

---

**Ready to test?** Head to http://localhost:3000/admin/call-stats and see the dashboard! 🎉
