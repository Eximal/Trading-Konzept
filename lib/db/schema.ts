import { bigint, boolean, integer, jsonb, numeric, pgTable, primaryKey, text, timestamp } from 'drizzle-orm/pg-core'

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

export const walletProfiles = pgTable('wallet_profiles', {
  walletAddress: text('wallet_address').primaryKey(),
  displayName: text('display_name').notNull().default('Anonymous Miner'),
  bio: text('bio').notNull().default(''),
  avatarId: text('avatar_id').notNull().default('neon-pioneer'),
  isPublic: boolean('is_public').notNull().default(true),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
})

export const avatarInventory = pgTable('avatar_inventory', {
  walletAddress: text('wallet_address').notNull(),
  avatarId: text('avatar_id').notNull(),
  acquiredAt: timestamp('acquired_at', { withTimezone: true }).notNull().defaultNow(),
}, (table) => ({ primaryKey: primaryKey({ columns: [table.walletAddress, table.avatarId] }) }))

export const avatarPurchases = pgTable('avatar_purchases', {
  id: bigint('id', { mode: 'number' }).primaryKey().generatedAlwaysAsIdentity(),
  walletAddress: text('wallet_address').notNull(),
  avatarId: text('avatar_id').notNull(),
  price: numeric('price', { precision: 30, scale: 8 }).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
})

export type ParticipationProfile = typeof participationProfiles.$inferSelect
export type WalletProfile = typeof walletProfiles.$inferSelect
export type AvatarInventory = typeof avatarInventory.$inferSelect
export type ParticipationCycle = typeof participationCycles.$inferSelect
export type ParticipationEvent = typeof participationEvents.$inferSelect

export const participationSchema = {
  participationProfiles,
  participationCycles,
  participationEvents,
}
