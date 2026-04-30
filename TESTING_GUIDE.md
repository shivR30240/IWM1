# Call Automation Testing Guide

## Testing the Call Automation System

This guide provides comprehensive testing scenarios for the call automation system.

## 1. API Endpoint Testing

### Test Call Statistics API
```bash
# Get overall statistics
curl http://localhost:3000/api/call/stats

# Expected Response:
{
  "success": true,
  "data": {
    "totalCalls": 247,
    "successfulConversions": 218,
    "failedConversions": 29,
    "conversionRate": 88.26,
    ...
  }
}
```

### Test Call Logs API
```bash
# Get first page of logs
curl http://localhost:3000/api/call/logs?page=1&pageSize=10

# Filter by status
curl http://localhost:3000/api/call/logs?status=completed

# Expected Response:
{
  "success": true,
  "data": [...],
  "pagination": {
    "page": 1,
    "pageSize": 10,
    "totalItems": 100,
    "totalPages": 10
  }
}
```

### Test Ticket Creation API
```bash
# Create a ticket from call data
curl -X POST http://localhost:3000/api/call/create-ticket \
  -H "Content-Type: application/json" \
  -d '{
    "callerPhone": "+919876543210",
    "transcript": "There is no water supply in ward number 15, Vijay Nagar area for the past 3 days",
    "processedData": {
      "category": "water_supply",
      "priority": "high",
      "location": {
        "wardNumber": 15,
        "wardName": "Vijay Nagar",
        "area": "Vijay Nagar",
        "fullAddress": "Ward 15, Vijay Nagar"
      },
      "summary": "Water supply complaint in Vijay Nagar",
      "summaryHi": "जल आपूर्ति शिकायत",
      "confidence": 0.9
    },
    "callSid": "CA123456",
    "recordingUrl": "https://example.com/recording.mp3",
    "recordingSid": "RE123456"
  }'

# Expected Response:
{
  "success": true,
  "data": {
    "ticketId": "IVC-2026-12345",
    "message": "Ticket created successfully"
  }
}
```

## 2. NLU Processor Testing

### Test Category Classification

Create a test script to verify NLU accuracy:

```javascript
// test-nlu.js
const complaints = [
  {
    text: "No water supply in our area for 2 days",
    expected: "water_supply"
  },
  {
    text: "Road is full of potholes near Rajwada",
    expected: "roads"
  },
  {
    text: "Street lights not working in Sapna Sangeeta",
    expected: "street_lights"
  },
  {
    text: "Garbage not collected for one week",
    expected: "garbage_collection"
  },
  {
    text: "Drainage is clogged and water overflowing",
    expected: "drainage"
  }
];

complaints.forEach(c => {
  console.log(`Input: ${c.text}`);
  console.log(`Expected: ${c.expected}`);
  // Test with your NLU processor
});
```

### Test Location Extraction

```javascript
const locationTests = [
  "Ward number 15, Vijay Nagar",
  "Near Rajwada main road",
  "Sapna Sangeeta area",
  "Bhawarkuan ward 12",
  "Palasia square"
];

locationTests.forEach(text => {
  console.log(`Extracting from: ${text}`);
  // Test location extraction
});
```

## 3. Speech-to-Text Testing

### Test with Real Audio Files

If you have Twilio configured:

```bash
# Upload a test recording
# The system will process it through speech-to-text

# Check console logs for:
🎤 Processing speech-to-text with provider: google
✅ Speech-to-text complete (confidence: 0.95)
✅ Transcript: [recognized text]
```

### Test Mock Mode

Mock mode automatically activates without API keys:

```bash
# No configuration needed
# Just trigger the recording endpoint
# You'll get random realistic complaints
```

## 4. IVR Flow Testing

### Test TwiML Generation

```bash
# Test incoming call endpoint
curl -X POST http://localhost:3000/api/call/incoming \
  -d "From=+919876543210" \
  -d "CallSid=CA123456"

# Expected: XML response with TwiML
<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Gather input="speech" action="...">
    <Say voice="Polly.Aditi">Welcome to Indore Voice Connect...</Say>
  </Gather>
</Response>
```

### Test Recording Callback

```bash
# Simulate recording completion
curl -X POST http://localhost:3000/api/call/recording \
  -d "RecordingUrl=https://example.com/audio.mp3" \
  -d "RecordingSid=RE123456" \
  -d "CallSid=CA123456" \
  -d "From=+919876543210" \
  -d "RecordingDuration=45"

# Expected: Processing through STT → NLU → Ticket Creation
```

## 5. Admin Dashboard Testing

### Visual Testing Checklist

#### Call Statistics Page (`/admin/call-stats`)
- [ ] Overview cards display correctly
- [ ] Total calls count shows
- [ ] Success rate percentage accurate
- [ ] Category bar chart renders
- [ ] Ward grid displays
- [ ] 30-day trend visualization works
- [ ] All data loads without errors

#### Call Logs Page (`/admin/call-logs`)
- [ ] Table displays call data
- [ ] Pagination works
- [ ] Status filter functions
- [ ] Date formatting correct
- [ ] Ticket IDs link properly
- [ ] Play button visible
- [ ] Transcript button shows when available

#### IVR Config Page (`/admin/ivr-config`)
- [ ] Toggle switch works
- [ ] Text areas editable
- [ ] Number inputs validate
- [ ] Language checkboxes function
- [ ] Business hours toggle works
- [ ] Save button triggers
- [ ] Reset button confirms

## 6. End-to-End Testing

### Complete Call Flow Test

**Scenario**: Citizen calls to report water issue

1. **Incoming Call**
   ```
   Trigger: POST /api/call/incoming
   Data: From=+919876543210
   Expected: TwiML response with greeting
   ```

2. **Recording**
   ```
   Trigger: POST /api/call/recording
   Data: Recording URL and metadata
   Expected: Processing starts
   ```

3. **Speech-to-Text**
   ```
   Process: Audio → Text
   Expected: "There is no water supply in ward 15..."
   ```

4. **NLU Processing**
   ```
   Input: Transcript text
   Expected:
   - Category: water_supply
   - Priority: high
   - Location: Ward 15, Vijay Nagar
   ```

5. **Ticket Creation**
   ```
   Process: Create ticket in system
   Expected: Ticket ID IVC-2026-XXXXX
   ```

6. **SMS Notification**
   ```
   Process: Send SMS to caller
   Expected: Console log or actual SMS
   ```

7. **Confirmation**
   ```
   Response: TwiML with ticket ID
   Expected: Caller hears confirmation
   ```

## 7. Load Testing

### Simulate Multiple Calls

```javascript
// load-test.js
async function simulateCalls(count) {
  for (let i = 0; i < count; i++) {
    fetch('http://localhost:3000/api/call/create-ticket', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        callerPhone: `+919876543${String(i).padStart(3, '0')}`,
        transcript: `Test complaint number ${i}`,
        processedData: {
          category: 'water_supply',
          priority: 'high',
          location: { wardNumber: 15, wardName: 'Vijay Nagar' }
        }
      })
    });
  }
}

simulateCalls(50); // Simulate 50 calls
```

## 8. Error Handling Testing

### Test Invalid Inputs

```bash
# Missing required fields
curl -X POST http://localhost:3000/api/call/create-ticket \
  -H "Content-Type: application/json" \
  -d '{}'

# Expected: 400 error with MISSING_REQUIRED_FIELDS

# Invalid ticket ID
curl http://localhost:3000/api/call/create-ticket?ticketId=INVALID

# Expected: 404 error with TICKET_NOT_FOUND
```

### Test System Failures

1. **Network Timeout**
   - Simulate slow API responses
   - Verify timeout handling

2. **Invalid Audio**
   - Send corrupted audio URL
   - Verify graceful fallback

3. **Speech API Down**
   - Use invalid API key
   - Verify mock mode fallback

## 9. Performance Testing

### Measure Response Times

```bash
# Test API response times
time curl http://localhost:3000/api/call/stats
time curl http://localhost:3000/api/call/logs
time curl -X POST http://localhost:3000/api/call/create-ticket ...
```

**Expected Performance:**
- Stats API: < 100ms
- Logs API: < 200ms
- Ticket Creation: < 500ms (mock mode)
- Full Call Flow: < 2 seconds

## 10. Integration Testing with Twilio

### Prerequisites
- Twilio account with phone number
- Ngrok for local testing
- Real speech-to-text API key

### Setup
```bash
# Start ngrok
ngrok http 3000

# Configure Twilio webhook
# URL: https://your-ngrok-url.ngrok.io/api/call/incoming
# Method: POST
```

### Test Call
1. Call your Twilio number
2. Listen to IVR greeting
3. Speak a complaint clearly
4. Wait for processing
5. Receive ticket ID
6. Check SMS notification
7. Verify ticket in database

### Verify in Dashboard
1. Check call logs - should show new call
2. View call statistics - counts should update
3. Verify ticket created with correct data

## Testing Checklist

### Unit Tests
- [ ] Speech-to-text processing
- [ ] NLU category classification
- [ ] Location extraction
- [ ] Priority determination
- [ ] Ticket ID generation
- [ ] SMS message formatting

### Integration Tests
- [ ] Twilio webhook handling
- [ ] Recording processing
- [ ] Complete call flow
- [ ] Database operations (when implemented)

### UI Tests
- [ ] Call statistics dashboard
- [ ] Call logs table
- [ ] IVR configuration form
- [ ] Pagination controls
- [ ] Filter functionality

### Performance Tests
- [ ] API response times
- [ ] Concurrent call handling
- [ ] Database query performance
- [ ] Page load times

## Bug Reporting

When reporting issues, include:
1. Steps to reproduce
2. Expected vs actual behavior
3. Console logs
4. Network request details
5. Environment (mock mode vs production)

---

**Testing is crucial for reliability!** Make sure to test all scenarios before deploying to production.
