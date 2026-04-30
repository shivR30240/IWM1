# Call Automation System - Implementation Guide

## Overview
The Indore Voice Connect Call Automation System enables citizens to report civic complaints via phone calls. The system uses AI-powered speech recognition and natural language processing to automatically create tickets from voice complaints.

## Architecture

```
Citizen Call → Twilio IVR → Speech Recording → AI Processing → Ticket Creation → SMS Confirmation
```

## Features Implemented

### 1. **Twilio Integration**
- Incoming call handling via webhooks
- IVR flow with Hindi/English greetings
- Call recording management
- SMS notifications for ticket confirmations

### 2. **Speech-to-Text Processing**
- Multi-language support (Hindi, English, Marathi)
- Integration with Google Cloud Speech-to-Text or AssemblyAI
- Mock mode for development/testing
- Automatic language detection

### 3. **NLU (Natural Language Understanding)**
- Automatic complaint classification into 10 categories:
  - Water Supply, Drainage, Roads, Electricity
  - Sanitation, Garbage Collection, Street Lights
  - Parks, Building Permits, Other
- Location extraction (ward number, area names)
- Priority determination based on keywords
- Summary generation in English and Hindi

### 4. **Automated Ticket Creation**
- Complete call-to-ticket workflow
- Unique ticket ID generation (Format: IVC-YYYY-XXXXX)
- SMS confirmation with ticket ID
- Call metadata attached to tickets

### 5. **Admin Dashboard**
- **Call Statistics**: Real-time analytics on call volume, conversion rates, categories, and wards
- **Call Logs**: View all calls, playback recordings, view transcripts
- **IVR Configuration**: Customize greetings, recording settings, languages, business hours

## File Structure

```
src/
├── app/
│   ├── api/
│   │   └── call/
│   │       ├── incoming/          # Webhook for incoming calls
│   │       ├── recording/         # Recording callback handler
│   │       ├── create-ticket/     # Ticket creation API
│   │       ├── stats/             # Call statistics API
│   │       └── logs/              # Call logs API
│   └── admin/
│       ├── call-stats/            # Call statistics dashboard
│       ├── call-logs/             # Call logs management
│       └── ivr-config/            # IVR configuration UI
├── lib/
│   └── call/
│       ├── twilio-client.ts       # Twilio SDK wrapper
│       ├── speech-to-text.ts      # Speech recognition
│       ├── nlu-processor.ts       # Complaint classification
│       └── ticket-workflow.ts     # Ticket creation orchestrator
└── types/
    └── index.ts                   # Call-related type definitions
```

## Setup Instructions

### 1. Install Dependencies
```bash
npm install twilio
```

### 2. Configure Environment Variables
Copy `.env.local.example` to `.env.local` and fill in your credentials:

```bash
TWILIO_ACCOUNT_SID=your_account_sid
TWILIO_AUTH_TOKEN=your_auth_token
TWILIO_PHONE_NUMBER=+18001234567
SPEECH_TO_TEXT_PROVIDER=google
SPEECH_TO_TEXT_API_KEY=your_api_key
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

### 3. Configure Twilio Webhook
In your Twilio Console, set the webhook URL for your phone number to:
```
https://your-domain.com/api/call/incoming
```

For local development, use ngrok:
```bash
ngrok http 3000
```
Then set the webhook to: `https://your-ngrok-url.ngrok.io/api/call/incoming`

### 4. Enable Speech-to-Text API

**Option A: Google Cloud Speech-to-Text**
1. Create a Google Cloud account
2. Enable Speech-to-Text API
3. Download service account credentials
4. Set `GOOGLE_APPLICATION_CREDENTIALS` path

**Option B: AssemblyAI**
1. Create an AssemblyAI account
2. Get your API key
3. Set `SPEECH_TO_TEXT_PROVIDER=assemblyai`
4. Set `ASSEMBLYAI_API_KEY`

### 5. Run the Application
```bash
npm run dev
```

## API Endpoints

### Call Webhooks
- **POST /api/call/incoming** - Handle incoming calls (Twilio webhook)
- **POST /api/call/recording** - Process recorded audio (Twilio callback)

### Management APIs
- **POST /api/call/create-ticket** - Create ticket from call data
- **GET /api/call/stats** - Get call statistics
- **GET /api/call/logs** - Get paginated call logs

## IVR Flow

1. **Incoming Call**: Citizen dials the toll-free number
2. **Welcome Greeting**: Bilingual greeting (Hindi/English)
3. **Record Complaint**: Citizen speaks their complaint (max 3 minutes)
4. **AI Processing**: 
   - Speech-to-text conversion
   - Category classification
   - Location extraction
   - Priority assignment
5. **Confirmation**: Ticket ID announced and SMS sent

## Mock Mode

For development without Twilio/Speech APIs, the system runs in mock mode:
- Simulated transcripts from predefined complaints
- Mock SMS sending (logged to console)
- Mock call statistics
- Test with sample data

## Admin Pages

### Call Statistics (`/admin/call-stats`)
- Total calls, tickets created, success rate
- Average call duration
- Calls by category (bar chart)
- Calls by ward (grid)
- 30-day trend visualization

### Call Logs (`/admin/call-logs`)
- Paginated list of all calls
- Filter by status (completed, processing, failed)
- Playback recordings
- View transcripts
- Link to created tickets

### IVR Configuration (`/admin/ivr-config`)
- Enable/disable IVR system
- Edit greeting messages (English/Hindi)
- Configure recording duration and timeout
- Select supported languages
- Set business hours (optional)
- Customize fallback messages

## Ticket Categories

The system automatically classifies complaints into:

| Category | Keywords |
|----------|----------|
| Water Supply | water, पानी, jal, supply, tanker |
| Drainage | drainage, drain, naali, sewage, clogged |
| Roads | road, sadak, pothole, damaged |
| Electricity | electricity, bijli, power, wire, light |
| Sanitation | sanitation, clean, safai, toilet |
| Garbage Collection | garbage, kachra, waste, trash |
| Street Lights | street light, dark, pole light |
| Parks | park, garden, udyan, playground |
| Building Permits | building, permit, construction, illegal |
| Other | (fallback) |

## Supported Wards

The system recognizes these Indore wards:
- Vijay Nagar (15), Rajwada (1), Sapna Sangeeta (23)
- Bhawarkuan (12), Palace Square (8), Palasia (18)
- New Market (25), Saket (30), Sudama Nagar (42)
- Niranjanpur (35), and more...

## Production Deployment

### 1. Database Integration
Replace mock data stores with actual database:
```typescript
// In ticket-workflow.ts
await db.tickets.create(ticket);
await db.callLogs.create(callData);
```

### 2. Cloud Storage
Store call recordings in AWS S3 or similar:
```typescript
const recordingUrl = await uploadToS3(recordingFile);
```

### 3. Error Handling & Monitoring
- Implement retry logic for failed API calls
- Set up logging with services like Sentry
- Monitor Twilio webhook failures
- Track speech-to-text accuracy

### 4. Scaling
- Use message queues (Redis/RabbitMQ) for processing
- Implement caching for frequently accessed data
- Use CDN for static assets

## Troubleshooting

### Twilio Webhook Not Receiving Calls
- Verify webhook URL is publicly accessible
- Check ngrok is running for local development
- Ensure webhook method is set to POST
- Verify Twilio credentials in `.env.local`

### Speech-to-Text Not Working
- Check API key is valid
- Verify audio format is supported (WAV, MP3)
- Review language codes match audio language
- Check network connectivity to API

### SMS Not Sending
- Verify Twilio phone number is SMS-enabled
- Check recipient number format (with country code)
- Review Twilio account balance
- Check SMS logs in Twilio console

### Tickets Not Creating
- Check NLU processor output
- Verify category extraction logic
- Review database connection (in production)
- Check error logs in console

## Future Enhancements

1. **Multi-level IVR**: Menu options for different departments
2. **Voice Biometrics**: Citizen identification by voice
3. **Real-time Translation**: Live translation during calls
4. **Callback System**: Citizens can request callbacks
5. **Call Queue Management**: Wait times and position announcements
6. **Advanced Analytics**: ML-powered insights and predictions
7. **WhatsApp Integration**: Voice message support
8. **Mobile App**: Companion app for call tracking

## Support

For issues or questions:
- Check the troubleshooting section
- Review API documentation
- Contact the development team

## License

This project is part of the Indore Voice Connect civic platform.
