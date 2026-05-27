import { NextRequest, NextResponse } from 'next/server';
import { createTicketFromCall, getTicketById } from '@/lib/call/ticket-workflow';

/**
 * API endpoint for creating tickets from voice calls
 * Can be called directly or used as part of the call workflow
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const {
      callerPhone,
      transcript,
      processedData,
      callSid,
      recordingUrl,
      recordingSid,
    } = body;

    // Validate required fields
    if (!callerPhone || !transcript || !processedData) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'MISSING_REQUIRED_FIELDS',
            message: 'callerPhone, transcript, and processedData are required',
          },
        },
        { status: 400 }
      );
    }

    // Create ticket
    const result = await createTicketFromCall({
      callerPhone,
      transcript,
      processedData,
      callSid: callSid || 'manual_' + Date.now(),
      recordingUrl: recordingUrl || '',
      recordingSid: recordingSid || '',
    });

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'TICKET_CREATION_FAILED',
            message: result.error,
          },
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        ticketId: result.ticketId,
        message: 'Ticket created successfully',
      },
    });
  } catch (error) {
    console.error('❌ Error in create-ticket endpoint:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: error instanceof Error ? error.message : 'Unknown error',
        },
      },
      { status: 500 }
    );
  }
}

/**
 * GET endpoint to retrieve ticket by ID
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const ticketId = searchParams.get('ticketId');

    if (!ticketId) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'MISSING_TICKET_ID',
            message: 'ticketId query parameter is required',
          },
        },
        { status: 400 }
      );
    }

    const ticket = await getTicketById(ticketId);

    if (!ticket) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'TICKET_NOT_FOUND',
            message: `Ticket ${ticketId} not found`,
          },
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: ticket,
    });
  } catch (error) {
    console.error('❌ Error retrieving ticket:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: error instanceof Error ? error.message : 'Unknown error',
        },
      },
      { status: 500 }
    );
  }
}
