import { NextRequest, NextResponse } from 'next/server';
import { generateTwiML } from '@/lib/call/twilio-client';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

/**
 * Handle incoming calls from Twilio
 * This endpoint is configured as the webhook URL in Twilio phone number settings
 */
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const from = formData.get('From') as string;
    const callSid = formData.get('CallSid') as string;

    console.log('📞 Incoming call from:', from, '| Call SID:', callSid);

    // Log the call (in production, save to database)
    const callData = {
      callSid,
      from,
      status: 'received',
      timestamp: new Date().toISOString(),
    };

    console.log('📝 Call data:', callData);

    // Generate IVR greeting in Hindi and English
    const greetingText = `Welcome to Indore Voice Connect, आपकी आवाज़, आपका शहर. 
      Please speak your complaint clearly in Hindi, English, or Malwi after the beep. 
      Indore नगर निगम में आपका स्वागत है। कृपया अपनी शिकायत स्पष्ट रूप से बोलें।`;

    const twimlResponse = generateTwiML({
      action: `${BASE_URL}/api/call/recording`,
      method: 'POST',
      speech: {
        language: 'hi-IN',
        hints: ['water', 'road', 'electricity', 'drainage', 'garbage', 'street light', 'sanitation'],
      },
      sayText: greetingText,
    });

    // Return TwiML response
    return new NextResponse(twimlResponse, {
      headers: {
        'Content-Type': 'text/xml',
      },
    });
  } catch (error) {
    console.error('❌ Error handling incoming call:', error);
    
    // Fallback TwiML for errors
    const errorTwiML = `<?xml version="1.0" encoding="UTF-8"?>
      <Response>
        <Say voice="Polly.Aditi">We are experiencing technical difficulties. Please call back later. क्षमा करें, कृपया बाद में कॉल करें।</Say>
      </Response>`;

    return new NextResponse(errorTwiML, {
      headers: {
        'Content-Type': 'text/xml',
      },
    });
  }
}

// Also handle GET requests for testing
export async function GET(request: NextRequest) {
  return POST(request);
}
