import { NextRequest, NextResponse } from 'next/server';
import { processSpeechToText } from '@/lib/call/speech-to-text';
import { processComplaint } from '@/lib/call/nlu-processor';
import { createTicketFromCall } from '@/lib/call/ticket-workflow';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

/**
 * Handle recording callback from Twilio
 * Receives the recorded audio and processes it through the pipeline
 */
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    
    const recordingUrl = formData.get('RecordingUrl') as string;
    const recordingSid = formData.get('RecordingSid') as string;
    const callSid = formData.get('CallSid') as string;
    const from = formData.get('From') as string;
    const duration = formData.get('RecordingDuration') as string;

    console.log('🎙️ Recording received:', {
      recordingUrl,
      recordingSid,
      callSid,
      from,
      duration: duration ? `${duration} seconds` : 'unknown',
    });

    // Step 1: Convert speech to text
    console.log('🔄 Step 1: Converting speech to text...');
    const transcript = await processSpeechToText(recordingUrl);
    
    if (!transcript || transcript.trim().length === 0) {
      console.warn('⚠️  Empty transcript received');
      const errorTwiML = `<?xml version="1.0" encoding="UTF-8"?>
        <Response>
          <Say voice="Polly.Aditi">We could not understand your complaint. Please call back and speak clearly. क्षमा करें, हमें आपकी शिकायत समझ नहीं आई।</Say>
        </Response>`;

      return new NextResponse(errorTwiML, {
        headers: {
          'Content-Type': 'text/xml',
        },
      });
    }

    console.log('✅ Transcript:', transcript);

    // Step 2: Process complaint with NLU
    console.log('🔄 Step 2: Processing complaint with NLU...');
    const processedComplaint = await processComplaint(transcript);

    console.log('✅ Processed complaint:', processedComplaint);

    // Step 3: Create ticket
    console.log('🔄 Step 3: Creating ticket...');
    const ticketResult = await createTicketFromCall({
      callerPhone: from,
      transcript,
      processedData: processedComplaint,
      callSid,
      recordingUrl,
      recordingSid,
    });

    if (!ticketResult.success || !ticketResult.ticketId) {
      console.error('❌ Failed to create ticket:', ticketResult.error);
      const errorTwiML = `<?xml version="1.0" encoding="UTF-8"?>
        <Response>
          <Say voice="Polly.Aditi">We encountered an error processing your complaint. Please call back later. शिकायत प्रसंस्करण में त्रुटि हुई।</Say>
        </Response>`;

      return new NextResponse(errorTwiML, {
        headers: {
          'Content-Type': 'text/xml',
        },
      });
    }

    console.log('✅ Ticket created:', ticketResult.ticketId);

    // Step 4: Generate confirmation TwiML
    const ticketId = ticketResult.ticketId;
    const confirmationText = `Your complaint has been registered successfully. Your ticket ID is ${ticketId}. 
      You will receive an SMS confirmation shortly. 
      आपकी शिकायत दर्ज कर ली गई है। आपका टिकट आईडी है ${ticketId}। 
      Thank you for helping improve Indore.`;

    const confirmationTwiML = `<?xml version="1.0" encoding="UTF-8"?>
      <Response>
        <Say voice="Polly.Aditi">${confirmationText}</Say>
        <Hangup />
      </Response>`;

    return new NextResponse(confirmationTwiML, {
      headers: {
        'Content-Type': 'text/xml',
      },
    });
  } catch (error) {
    console.error('❌ Error processing recording:', error);
    
    const errorTwiML = `<?xml version="1.0" encoding="UTF-8"?>
      <Response>
        <Say voice="Polly.Aditi">We encountered an error. Please call back later. त्रुटि हुई। कृपया बाद में कॉल करें।</Say>
      </Response>`;

    return new NextResponse(errorTwiML, {
      headers: {
        'Content-Type': 'text/xml',
      },
    });
  }
}

// Handle GET for testing
export async function GET(request: NextRequest) {
  return new NextResponse('Recording endpoint is active', {
    status: 200,
  });
}
