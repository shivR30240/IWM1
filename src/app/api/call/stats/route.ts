import { NextRequest, NextResponse } from 'next/server';
import { CallStats } from '@/types';

/**
 * API endpoint for call statistics
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const dateFrom = searchParams.get('dateFrom');
    const dateTo = searchParams.get('dateTo');

    // In production, query database for actual stats
    // For now, return mock data
    const mockStats: CallStats = {
      totalCalls: 247,
      successfulConversions: 218,
      failedConversions: 29,
      conversionRate: 88.26,
      avgCallDuration: 95, // seconds
      totalTicketsCreated: 218,
      callsByDate: generateMockCallsByDate(),
      callsByCategory: {
        water_supply: 67,
        drainage: 34,
        roads: 45,
        electricity: 28,
        sanitation: 19,
        garbage_collection: 15,
        street_lights: 12,
        parks: 5,
        building_permits: 8,
        other: 7,
      },
      callsByWard: {
        'Vijay Nagar': 32,
        'Rajwada': 18,
        'Sapna Sangeeta': 25,
        'Bhawarkuan': 21,
        'Palasia': 19,
        'New Market': 15,
        'Saket': 14,
        'Sudama Nagar': 12,
        'Niranjanpur': 11,
        'Other': 96,
      },
    };

    return NextResponse.json({
      success: true,
      data: mockStats,
    });
  } catch (error) {
    console.error('❌ Error fetching call stats:', error);
    
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

function generateMockCallsByDate() {
  const data = [];
  const now = new Date();
  
  for (let i = 29; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    
    const calls = Math.floor(Math.random() * 15) + 5;
    const tickets = Math.floor(calls * (Math.random() * 0.2 + 0.75));
    
    data.push({
      date: date.toISOString().split('T')[0],
      calls,
      tickets,
    });
  }
  
  return data;
}
