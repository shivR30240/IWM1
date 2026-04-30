import twilio from 'twilio';

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;

// Only initialize Twilio if we have valid credentials
const isValidTwilioConfig = accountSid?.startsWith('AC') && authToken && accountSid !== 'mock_account_sid';

if (!isValidTwilioConfig && process.env.NODE_ENV === 'production') {
  console.warn('⚠️  Twilio credentials not configured. Call features will use mock mode.');
}

const twilioClient = isValidTwilioConfig 
  ? twilio(accountSid, authToken)
  : null;

/**
 * Send SMS notification to citizen
 */
export async function sendSMS(
  to: string,
  message: string
): Promise<{ success: boolean; messageId?: string; error?: string }> {
  if (!twilioClient || !twilioPhoneNumber) {
    console.log('📱 [MOCK SMS] To:', to, '| Message:', message);
    return { success: true, messageId: 'mock_' + Date.now() };
  }

  try {
    const messageResponse = await twilioClient.messages.create({
      body: message,
      to,
      from: twilioPhoneNumber,
    });

    return {
      success: true,
      messageId: messageResponse.sid,
    };
  } catch (error) {
    console.error('❌ Failed to send SMS:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Send ticket confirmation SMS
 */
export async function sendTicketConfirmationSMS(
  to: string,
  ticketId: string,
  citizenName: string
): Promise<{ success: boolean; messageId?: string; error?: string }> {
  const message = `Dear ${citizenName}, your complaint has been registered successfully.\n\nTicket ID: ${ticketId}\n\nTrack status at: ${process.env.NEXT_PUBLIC_BASE_URL}/check-status\n\nThank you for helping improve Indore!`;

  return sendSMS(to, message);
}

/**
 * Make an outbound call (for follow-ups, escalations, etc.)
 */
export async function makeOutboundCall(
  to: string,
  twimlUrl: string
): Promise<{ success: boolean; callSid?: string; error?: string }> {
  if (!twilioClient || !twilioPhoneNumber) {
    console.log('📞 [MOCK CALL] To:', to, '| TwiML URL:', twimlUrl);
    return { success: true, callSid: 'mock_' + Date.now() };
  }

  try {
    const call = await twilioClient.calls.create({
      to,
      from: twilioPhoneNumber,
      url: twimlUrl,
    });

    return {
      success: true,
      callSid: call.sid,
    };
  } catch (error) {
    console.error('❌ Failed to make outbound call:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Generate TwiML response for IVR
 */
export function generateTwiML(gatherInput: {
  action: string;
  method?: string;
  speech?: {
    language: string;
    hints?: string[];
  };
  sayText: string;
  playUrl?: string;
}): string {
  const method = gatherInput.method || 'POST';
  const speechConfig = gatherInput.speech
    ? `<SpeechModel>default</SpeechModel>
       <Language>${gatherInput.speech.language}</Language>
       ${gatherInput.speech.hints ? `<Hints>${gatherInput.speech.hints.join(', ')}</Hints>` : ''}`
    : '';

  return `<?xml version="1.0" encoding="UTF-8"?>
    <Response>
      <Gather 
        input="speech" 
        action="${gatherInput.action}" 
        method="${method}"
        speechTimeout="auto"
        language="${gatherInput.speech?.language || 'en-IN'}"
        ${gatherInput.speech?.hints ? `speechHints="${gatherInput.speech.hints.join(',')}"` : ''}
      >
        <Say voice="Polly.Aditi">${gatherInput.sayText}</Say>
        ${gatherInput.playUrl ? `<Play>${gatherInput.playUrl}</Play>` : ''}
      </Gather>
      <Say voice="Polly.Aditi">We did not receive your response. Please call back to register your complaint.</Say>
    </Response>`;
}

/**
 * Generate TwiML for recording complaint
 */
export function generateRecordTwiML(action: string, playBeep = true): string {
  return `<?xml version="1.0" encoding="UTF-8"?>
    <Response>
      <Record 
        action="${action}" 
        method="POST"
        maxLength="180"
        transcribe="false"
        playBeep="${playBeep}"
        trim="trim-silence"
      />
      <Say voice="Polly.Aditi">Thank you. Your complaint is being processed. You will receive a confirmation SMS shortly.</Say>
    </Response>`;
}

export { twilioClient, twilioPhoneNumber };
