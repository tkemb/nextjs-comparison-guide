import { db, schema } from './connection.js';
import { eq, desc, and, gte, count, sql } from 'drizzle-orm';

const { clicks } = schema;

// Create a new click record
export async function createClick(clickData) {
  try {
    const [newClick] = await db.insert(clicks).values({
      clickId: clickData.clickId,
      source: clickData.source || 'unknown',
      providerId: clickData.providerId || 'default',
      status: clickData.status || 'received',
      ipAddress: clickData.ipAddress,
      userAgent: clickData.userAgent,
      referrer: clickData.referrer,
      requestUrl: clickData.requestUrl,
      params: clickData.params || {},
      metadata: clickData.metadata || {}
    }).returning();

    return { success: true, click: newClick };
  } catch (error) {
    console.error('Error creating click:', error);
    return { success: false, error: error.message };
  }
}

// Get click by click ID
export async function getClick(clickId) {
  try {
    const [click] = await db.select()
      .from(clicks)
      .where(eq(clicks.clickId, clickId))
      .limit(1);

    return { success: true, click };
  } catch (error) {
    console.error('Error getting click:', error);
    return { success: false, error: error.message };
  }
}

// Update click status and metadata
export async function updateClick(clickId, updates) {
  try {
    const updateData = {
      ...updates,
      updatedAt: new Date()
    };

    const [updatedClick] = await db.update(clicks)
      .set(updateData)
      .where(eq(clicks.clickId, clickId))
      .returning();

    return { success: true, click: updatedClick };
  } catch (error) {
    console.error('Error updating click:', error);
    return { success: false, error: error.message };
  }
}

// Get clicks with filters and pagination
export async function getClicks(filters = {}, options = {}) {
  try {
    const {
      source,
      providerId,
      status,
      startDate,
      endDate,
      limit = 100,
      offset = 0
    } = { ...filters, ...options };

    let query = db.select().from(clicks);
    const conditions = [];

    if (source) conditions.push(eq(clicks.source, source));
    if (providerId) conditions.push(eq(clicks.providerId, providerId));
    if (status) conditions.push(eq(clicks.status, status));
    if (startDate) conditions.push(gte(clicks.createdAt, new Date(startDate)));
    if (endDate) conditions.push(gte(new Date(endDate), clicks.createdAt));

    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }

    const results = await query
      .orderBy(desc(clicks.createdAt))
      .limit(limit)
      .offset(offset);

    return { success: true, clicks: results };
  } catch (error) {
    console.error('Error getting clicks:', error);
    return { success: false, error: error.message };
  }
}

// Get click statistics
export async function getClickStats(timeframe = '24h', providerId = null) {
  try {
    let startDate = new Date();
    
    switch (timeframe) {
      case '1h':
        startDate.setHours(startDate.getHours() - 1);
        break;
      case '24h':
        startDate.setHours(startDate.getHours() - 24);
        break;
      case '7d':
        startDate.setDate(startDate.getDate() - 7);
        break;
      case '30d':
        startDate.setDate(startDate.getDate() - 30);
        break;
      default:
        startDate.setHours(startDate.getHours() - 24);
    }

    const conditions = [gte(clicks.createdAt, startDate)];
    if (providerId) {
      conditions.push(eq(clicks.providerId, providerId));
    }

    // Total counts
    const [totalResult] = await db.select({
      total: count(),
      received: count(sql`CASE WHEN ${clicks.status} = 'received' THEN 1 END`),
      intermediate: count(sql`CASE WHEN ${clicks.status} = 'intermediate' THEN 1 END`),
      forwarded: count(sql`CASE WHEN ${clicks.status} = 'forwarded' THEN 1 END`),
      failed: count(sql`CASE WHEN ${clicks.status} = 'failed' THEN 1 END`)
    })
    .from(clicks)
    .where(and(...conditions));

    // Provider breakdown
    const providerStats = await db.select({
      providerId: clicks.providerId,
      count: count()
    })
    .from(clicks)
    .where(and(...conditions))
    .groupBy(clicks.providerId)
    .orderBy(desc(count()));

    // Source breakdown
    const sourceStats = await db.select({
      source: clicks.source,
      count: count()
    })
    .from(clicks)
    .where(and(...conditions))
    .groupBy(clicks.source)
    .orderBy(desc(count()));

    return {
      success: true,
      stats: {
        timeframe,
        ...totalResult,
        successRate: totalResult.total > 0 
          ? ((totalResult.forwarded / totalResult.total) * 100).toFixed(2) 
          : 0,
        providerBreakdown: providerStats,
        sourceBreakdown: sourceStats
      }
    };

  } catch (error) {
    console.error('Error getting click stats:', error);
    return { success: false, error: error.message };
  }
}

// Delete old clicks (cleanup function)
export async function deleteOldClicks(daysOld = 30) {
  try {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysOld);

    const result = await db.delete(clicks)
      .where(gte(cutoffDate, clicks.createdAt));

    return { success: true, deletedCount: result.rowCount };
  } catch (error) {
    console.error('Error deleting old clicks:', error);
    return { success: false, error: error.message };
  }
}

// Get real-time clicks (last 5 minutes)
export async function getRealtimeClicks() {
  try {
    const fiveMinutesAgo = new Date();
    fiveMinutesAgo.setMinutes(fiveMinutesAgo.getMinutes() - 5);

    const recentClicks = await db.select({
      clickId: clicks.clickId,
      source: clicks.source,
      providerId: clicks.providerId,
      status: clicks.status,
      createdAt: clicks.createdAt
    })
    .from(clicks)
    .where(gte(clicks.createdAt, fiveMinutesAgo))
    .orderBy(desc(clicks.createdAt))
    .limit(50);

    return { success: true, clicks: recentClicks };
  } catch (error) {
    console.error('Error getting realtime clicks:', error);
    return { success: false, error: error.message };
  }
}