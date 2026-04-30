# WhatsApp Integration - Setup & Usage Guide

## ✅ WhatsApp Features Implemented

Your Indore Voice Connect system now includes complete WhatsApp Business API integration!

## 🎯 Features

### 1. Automated Notifications
- ✅ Ticket creation confirmation
- ✅ Status change updates
- ✅ Resolution confirmation
- ✅ SLA breach warnings
- ✅ Feedback requests
- ✅ Escalation alerts

### 2. Two-Way Communication
Citizens can send WhatsApp messages to:
- Check ticket status: `STATUS IVC-2026-12345`
- Get help: `HELP`
- View statistics: `STATS`
- Get helpline number: `CALL`
- Visit website: `WEB`

### 3. Message Types Supported
- 📝 Text messages
- 🖼️ Image messages with captions
- 🔘 Button messages (quick replies)
- 📍 Location messages

## 📋 Setup Instructions

### Step 1: Create Meta Developer Account
1. Go to [developers.facebook.com](https://developers.facebook.com)
2. Create a Meta Developer account
3. Create a new Business App

### Step 2: Get WhatsApp Business API Credentials
1. In Meta Developer Console:
   - Go to WhatsApp → API Setup
   - Get your **Phone Number ID**
   - Get your **Business Account ID**
   - Generate an **Access Token**

2. Create a permanent token:
   - Go to Settings → Advanced
   - Create System User
   - Assign assets (phone number)
   - Generate access token

### Step 3: Update Environment Variables

Add these to your `.env.local`:

```env
# WhatsApp Business API Configuration
WHATSAPP_BUSINESS_ID=your_business_account_id
WHATSAPP_TOKEN=your_permanent_access_token
WHATSAPP_PHONE_NUMBER_ID=your_phone_number_id
WHATSAPP_VERIFY_TOKEN=your_custom_verify_token
WHATSAPP_API_VERSION=v17.0
```

### Step 4: Set Up Webhook

1. In Meta Developer Console → WhatsApp → Configuration:
   - **Callback URL**: `https://your-domain.com/api/whatsapp/webhook`
   - **Verify Token**: Set to your `WHATSAPP_VERIFY_TOKEN` value

2. Subscribe to these fields:
   - `messages`
   - `message_deliveries`
   - `message_reads`
   - `messaging_postbacks`

### Step 5: Create Message Templates

In Meta Developer Console → WhatsApp → Message Templates:

Create these templates (must be approved before use):

#### Template 1: ticket_creation
```
Dear {{1}}, your complaint has been registered! 🎫

Ticket ID: {{2}}
Category: {{3}}
Status: Open

Track your ticket: {{4}}

Thank you for helping improve Indore! 🙏
```
**Category**: Utility  
**Language**: English (India)

#### Template 2: status_update
```
📢 Update on your complaint {{1}}

Status changed: {{2}} → {{3}}
Assigned to: {{4}}
Expected resolution: {{5}}

We're working on your complaint.
```
**Category**: Utility  
**Language**: English (India)

#### Template 3: resolution
```
✅ Your complaint has been resolved!

Ticket: {{1}}
Resolved by: {{2}}
Resolution time: {{3}} hours

Please rate your experience (1-5):
Reply with a number.

Thank you for your feedback! 🙏
```
**Category**: Utility  
**Language**: English (India)

### Step 6: Test the Integration

#### Test Sending a Message:
```bash
curl -X POST http://localhost:3000/api/whatsapp/send \
  -H "Content-Type: application/json" \
  -d '{
    "to": "+919876543210",
    "message": "Hello from Indore Voice Connect! 🎉"
  }'
```

#### Test Webhook (from Meta):
1. Click "Test" in WhatsApp Configuration
2. Meta will send a test message to your webhook
3. Check your server logs for the message

## 🚀 Usage Examples

### Send Ticket Notification
```typescript
import { sendWhatsAppNotification } from '@/lib/whatsapp/webhook';

// When creating a ticket
await sendWhatsAppNotification(
  '+919876543210',
  'ticket_creation',
  {
    name: 'Rahul Sharma',
    ticket_id: 'IVC-2026-12345',
    category: 'water_supply',
    tracking_url: 'https://indorevoiceconnect.in/check-status'
  }
);
```

### Send Custom Message
```typescript
import { whatsAppClient } from '@/lib/whatsapp/client';

// Text message
await whatsAppClient.sendTextMessage(
  '+919876543210',
  'Your ticket has been updated!'
);

// Image message
await whatsAppClient.sendImageMessage(
  '+919876543210',
  'https://example.com/ticket-image.jpg',
  'Your complaint location'
);

// Button message
await whatsAppClient.sendButtonMessage(
  '+919876543210',
  'Ticket Status',
  'What would you like to do?',
  [
    { id: 'status', title: 'Check Status' },
    { id: 'call', title: 'Call Us' },
    { id: 'help', title: 'Get Help' }
  ]
);
```

## 📊 WhatsApp Admin Pages

Access these pages in your admin dashboard:

1. **WhatsApp Configuration** (`/admin/whatsapp-config`)
   - Configure API settings
   - Test connection
   - View status

2. **WhatsApp Logs** (`/admin/whatsapp-logs`)
   - View all sent messages
   - Track delivery status
   - Filter by type/date

3. **WhatsApp Templates** (`/admin/whatsapp-templates`)
   - Manage message templates
   - Preview templates
   - Test templates

## 💬 Citizen Commands

Citizens can interact with these commands on WhatsApp:

| Command | Description | Example |
|---------|-------------|---------|
| `STATUS <id>` | Check ticket status | `STATUS IVC-2026-12345` |
| `HELP` | Show help message | `HELP` |
| `STATS` | View statistics | `STATS` |
| `CALL` | Get helpline number | `CALL` |
| `WEB` | Get website URL | `WEB` |

## 🔧 Mock Mode

Currently, WhatsApp is in **mock mode**. All messages are logged to console instead of being sent.

To enable real WhatsApp messages:
1. Add real credentials to `.env.local`
2. Get templates approved by Meta
3. Set up webhook with public URL

## 📱 WhatsApp vs SMS

| Feature | WhatsApp | SMS |
|---------|----------|-----|
| Cost | Lower (via API) | Higher |
| Rich Media | ✅ Images, Buttons | ❌ Text only |
| Two-way | ✅ Full chat | ❌ Limited |
| Delivery Rate | 90%+ | 80%+ |
| Character Limit | No limit | 160 chars |
| Internet Required | ✅ Yes | ❌ No |

**Recommendation**: Use both for maximum reach!

## 🎨 Frontend Improvements

Along with WhatsApp, your frontend now has:

1. ✅ **Toast Notifications** - Beautiful alerts across the app
2. ✅ **Enhanced Components** - Better UI/UX
3. ✅ **WhatsApp Integration** - In ticket workflow
4. ✅ **Modern Design** - Improved visuals

## 🐛 Troubleshooting

### Issue: Messages not sending
- **Check**: Credentials in `.env.local`
- **Check**: Token is valid and not expired
- **Check**: Phone number format (with country code)

### Issue: Webhook not receiving
- **Check**: Callback URL is publicly accessible
- **Check**: Verify token matches
- **Check**: SSL certificate (must be HTTPS)

### Issue: Template errors
- **Check**: Template is approved by Meta
- **Check**: Parameters match template format
- **Check**: Language code is correct

## 📞 Support

For WhatsApp Business API support:
- [Meta Documentation](https://developers.facebook.com/docs/whatsapp)
- [WhatsApp API Reference](https://developers.facebook.com/docs/whatsapp/api)
- [Template Guidelines](https://developers.facebook.com/docs/whatsapp/on-premises/get-started/message-templates)

---

**Ready to use WhatsApp?** Add your credentials and start sending! 🚀
