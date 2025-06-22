import { NextResponse } from 'next/server';
import { createClick, getClick, updateClick, getClicks, getClickStats } from '@/lib/db/clicks';
import { testConnection } from '@/lib/db/connection';

// Create new click
export async function POST(request) {
  try {
    // Test database connection
    const connectionTest = await testConnection();
    if (!connectionTest.success) {
      console.error('Database connection failed:', connectionTest.error);
      return NextResponse.json(
        { error: 'Database connection failed' },
        { status: 500 }
      );
    }

    const clickData = await request.json();
    const result = await createClick(clickData);

    if (result.success) {
      return NextResponse.json({
        success: true,
        click: result.click
      });
    } else {
      return NextResponse.json(
        { error: result.error },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Click creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create click' },
      { status: 500 }
    );
  }
}

// Get clicks or specific click
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const clickId = searchParams.get('clickId');
    const source = searchParams.get('source');
    const providerId = searchParams.get('providerId');
    const status = searchParams.get('status');
    const timeframe = searchParams.get('timeframe');
    const limit = parseInt(searchParams.get('limit') || '100');
    const offset = parseInt(searchParams.get('offset') || '0');

    // Get specific click
    if (clickId) {
      const result = await getClick(clickId);
      if (result.success) {
        return NextResponse.json(result.click);
      } else {
        return NextResponse.json(
          { error: result.error },
          { status: 500 }
        );
      }
    }

    // Get statistics
    if (timeframe) {
      const result = await getClickStats(timeframe, providerId);
      if (result.success) {
        return NextResponse.json(result.stats);
      } else {
        return NextResponse.json(
          { error: result.error },
          { status: 500 }
        );
      }
    }

    // Get clicks with filters
    const filters = { source, providerId, status };
    const options = { limit, offset };
    
    const result = await getClicks(filters, options);
    
    if (result.success) {
      return NextResponse.json({
        clicks: result.clicks,
        total: result.clicks.length,
        limit,
        offset
      });
    } else {
      return NextResponse.json(
        { error: result.error },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('Click retrieval error:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve clicks' },
      { status: 500 }
    );
  }
}

// Update click
export async function PUT(request) {
  try {
    const updateData = await request.json();
    const { clickId, ...updates } = updateData;

    if (!clickId) {
      return NextResponse.json(
        { error: 'Click ID is required' },
        { status: 400 }
      );
    }

    // Convert date strings to Date objects for database
    if (updates.forwardedAt) {
      updates.forwardedAt = new Date(updates.forwardedAt);
    }

    const result = await updateClick(clickId, updates);

    if (result.success) {
      return NextResponse.json({
        success: true,
        click: result.click
      });
    } else {
      return NextResponse.json(
        { error: result.error },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('Click update error:', error);
    return NextResponse.json(
      { error: 'Failed to update click' },
      { status: 500 }
    );
  }
}