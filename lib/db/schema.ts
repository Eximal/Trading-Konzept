import { bigint, integer, jsonb, numeric, pgTable, text, timestamp } from 'drizzle-orm/pg-core'

export const participationProfiles = pgTable('participation_profiles', {
  walletAddress: text('wallet_address').primaryKey(),
  chainId: integer('chain_id').notNull().default(8453),
  points: numeric('points', { precision: 30, scale: 8 }).notNull().default('0'),
  cyclesCompleted: integer('cycles_completed').notNull().default(0),
  totalClaimed: numeric('total_claimed', { precision: 30, scale: 8 }).notNull().default('0'),
  lastSeenAt: timestamp('last_seen_at', { withTimezone: true }).notNull().defaultNow(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
})

export const participationCycles = pgTable('participation_cycles', {
  id: bigint('id', { mode: 'number' }).primaryKey().generatedAlwaysAsIdentity(),
  walletAddress: text('wallet_address').notNull(),
  chainId: integer('chain_id').notNull(),
  startedAt: timestamp('started_at', { withTimezone: true }).notNull(),
  completedAt: timestamp('completed_at', { withTimezone: true }),
  pointsAwarded: numeric('points_awarded', { precision: 30, scale: 8 }).notNull().default('0'),
  status: text('status').notNull().default('active'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
})

export const participationEvents = pgTable('participation_events', {
  id: bigint('id', { mode: 'number' }).primaryKey().generatedAlwaysAsIdentity(),
  walletAddress: text('wallet_address').notNull(),
  chainId: integer('chain_id').notNull(),
  eventType: text('event_type').notNull(),
  points: numeric('points', { precision: 30, scale: 8 }).notNull().default('0'),
  metadata: jsonb('metadata').notNull().default({}),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
})

export type ParticipationProfile = typeof participationProfiles.$inferSelect
export type ParticipationCycle = typeof participationCycles.$inferSelect
export type ParticipationEvent = typeof participationEvents.$inferSelect

export const participationSchema = {
  participationProfiles,
  participationCycles,
  participationEvents,
}
