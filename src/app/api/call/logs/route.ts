import { NextRequest, NextResponse } from 'next/server';
import { CallLog } from '@/types';

/**
 * API endpoint for call logs
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = parseInt(searchParams.get('pageSize') || '20');
    const status = searchParams.get('status');

    // Generate mock call logs
    const mockLogs = generateMockCallLogs(100);

    // Filter by status if provided
    const filteredLogs = status
      ? mockLogs.filter(log => log.status === status)
      : mockLogs;

    // Paginate
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedLogs = filteredLogs.slice(startIndex, endIndex);

    return NextResponse.json({
      success: true,
      data: paginatedLogs,
      pagination: {
        page,
        pageSize,
        totalItems: filteredLogs.length,
        totalPages: Math.ceil(filteredLogs.length / pageSize),
        hasNext: endIndex < filteredLogs.length,
        hasPrev: page > 1,
      },
    });
  } catch (error) {
    console.error('❌ Error fetching call logs:', error);
    
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

function generateMockCallLogs(count: number): CallLog[] {
  const logs: CallLog[] = [];
  const statuses: CallLog['status'][] = ['completed', 'completed', 'completed', 'processing', 'failed'];
  
  for (let i = 0; i < count; i++) {
    const date = new Date();
    date.setMinutes(date.getMinutes() - i * 15);
    
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const hasTicket = status === 'completed';
    
    logs.push({
      id: `call_${i + 1}`,
      callSid: `CA${Math.random().toString(36).substring(2, 15).toUpperCase()}`,
      recordingSid: `RE${Math.random().toString(36).substring(2, 15).toUpperCase()}`,
      recordingUrl: 'https://example.com/recording.mp3',
      from: `+91${Math.floor(Math.random() * 9000000000 + 1000000000)}`,
      to: '+18001234567',
      duration: Math.floor(Math.random() * 120) + 30,
      status,
      transcript: hasTicket ? 'Sample complaint transcript about water supply issue in ward 15...' : null,
      ticketId: hasTicket ? `IVC-2026-${String(i + 1).padStart(5, '0')}` : null,
      createdAt: date.toISOString(),
      updatedAt: date.toISOString(),
    });
  }
  
  return logs;
}
