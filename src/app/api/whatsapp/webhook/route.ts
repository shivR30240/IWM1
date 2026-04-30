import { NextRequest, NextResponse } from 'next/server';
import { whatsAppClient } from '@/lib/whatsapp/client';
import { processIncomingMessage } from '@/lib/whatsapp/webhook';

/**
 * GET /api/whatsapp/webhook
 * Verify webhook for WhatsApp Business API
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const mode = searchParams.get('hub.mode');
  const token = searchParams.get('hub.verify_token');
  const challenge = searchParams.get('hub.challenge');

  if (!mode || !token || !challenge) {
    return NextResponse.json(
      { error: 'Missing verification parameters' },
      { status: 400 }
    );
  }

  const response = whatsAppClient.verifyWebhookToken(mode, token, challenge);

  if (response) {
    return new NextResponse(response, { status: 200 });
  }

  return NextResponse.json({ error: 'Verification failed' }, { status: 403 });
}

/**
 * POST /api/whatsapp/webhook
 * Receive incoming WhatsApp messages
 */
export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    // Process the incoming message
    const message = whatsAppClient.processWebhookMessage(data);

    if (!message) {
      console.log('⚠️  No message found in webhook data');
      return NextResponse.json({ success: true });
    }

    console.log('💬 Received WhatsApp message:', message);

    // Process and generate response
    const responseText = await processIncomingMessage(message);

    // Send auto-reply if we have a response
    if (responseText) {
      await whatsAppClient.sendTextMessage(message.from, responseText);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('❌ Error processing WhatsApp webhook:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: error instanceof Error ? error.message : 'Unknown error'
        }
      },
      { status: 500 }
    );
  }
}
