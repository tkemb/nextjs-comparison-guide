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