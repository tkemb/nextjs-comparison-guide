import { pgTable, text, timestamp, jsonb, index, serial } from 'drizzle-orm/pg-core';

// Clicks table for storing all click tracking data
export const clicks = pgTable('clicks', {
  id: serial('id').primaryKey(),
  clickId: text('click_id').notNull().unique(), // Our unique identifier
  source: text('source').notNull(), // zeropark, direct, etc.
  providerId: text('provider_id').notNull(), // destination provider
  status: text('status').notNull().default('received'), // received, intermediate, forwarded, failed
  
  // Request data
  ipAddress: text('ip_address'),
  userAgent: text('user_agent'),
  referrer: text('referrer'),
  requestUrl: text('request_url'),
  
  // Tracking parameters (flexible JSON storage)
  params: jsonb('params').default({}), // campaign, country, device, etc.
  
  // Provider forwarding data
  providerUrl: text('provider_url'),
  forwardedAt: timestamp('forwarded_at'),
  
  // Metadata
  metadata: jsonb('metadata').default({}), // response times, errors, etc.
  
  // Timestamps
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull()
}, (table) => ({
  // Indexes for performance
  clicksClickIdIdx: index('clicks_click_id_idx').on(table.clickId),
  clicksSourceIdx: index('clicks_source_idx').on(table.source),
  clicksProviderIdIdx: index('clicks_provider_id_idx').on(table.providerId),
  clicksStatusIdx: index('clicks_status_idx').on(table.status),
  clicksCreatedAtIdx: index('clicks_created_at_idx').on(table.createdAt)
}));

// Providers configuration table
export const providers = pgTable('providers', {
  id: serial('id').primaryKey(),
  providerId: text('provider_id').notNull().unique(),
  name: text('name').notNull(),
  baseUrl: text('base_url').notNull(),
  
  // Configuration
  authType: text('auth_type').default('none'), // none, bearer, api_key, custom
  authCredentials: jsonb('auth_credentials').default({}),
  customHeaders: jsonb('custom_headers').default({}),
  customParams: jsonb('custom_params').default({}),
  
  // Settings
  isActive: text('is_active').default('true'),
  timeout: text('timeout').default('5000'),
  retryAttempts: text('retry_attempts').default('3'),
  
  // Metadata
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull()
}, (table) => ({
  providersProviderIdIdx: index('providers_provider_id_idx').on(table.providerId)
}));

// Analytics aggregation table (optional - for faster queries)
export const clickStats = pgTable('click_stats', {
  id: serial('id').primaryKey(),
  date: text('date').notNull(), // YYYY-MM-DD format
  hour: text('hour'), // HH format (null for daily stats)
  source: text('source').notNull(),
  providerId: text('provider_id').notNull(),
  
  // Counts
  totalClicks: text('total_clicks').default('0'),
  successfulForwards: text('successful_forwards').default('0'),
  failedForwards: text('failed_forwards').default('0'),
  
  // Performance metrics
  avgResponseTime: text('avg_response_time').default('0'),
  uniqueVisitors: text('unique_visitors').default('0'),
  
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull()
}, (table) => ({
  clickStatsDateIdx: index('click_stats_date_idx').on(table.date),
  clickStatsDateHourIdx: index('click_stats_date_hour_idx').on(table.date, table.hour),
  clickStatsSourceProviderIdx: index('click_stats_source_provider_idx').on(table.source, table.providerId)
}));