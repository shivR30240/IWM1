import { NextRequest, NextResponse } from 'next/server';
import { whatsAppClient } from '@/lib/whatsapp/client';

/**
 * POST /api/whatsapp/send
 * Send WhatsApp message to a number
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { to, message, type, imageUrl, caption, buttons, header } = body;

    // Validate required fields
    if (!to) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'MISSING_PHONE_NUMBER',
            message: 'Phone number (to) is required'
          }
        },
        { status: 400 }
      );
    }

    let result;

    // Send based on type
    if (type === 'image' && imageUrl) {
      result = await whatsAppClient.sendImageMessage(to, imageUrl, caption || '');
    } else if (type === 'buttons' && buttons) {
      result = await whatsAppClient.sendButtonMessage(to, header || 'Menu', message, buttons);
    } else {
      result = await whatsAppClient.sendTextMessage(to, message);
    }

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'SEND_FAILED',
            message: result.error
          }
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        messageId: result.messageId,
        message: 'Message sent successfully'
      }
    });
  } catch (error) {
    console.error('❌ Error in WhatsApp send endpoint:', error);
    
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
