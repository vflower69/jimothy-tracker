import { bigint, double, index, int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/** Public, community-submitted sightings of Jimothy the raccoon. */
export const sightings = mysqlTable(
  "sightings",
  {
    id: int("id").autoincrement().primaryKey(),
    location: varchar("location", { length: 500 }).notNull(),
    latitude: double("latitude").notNull(),
    longitude: double("longitude").notNull(),
    /** UTC epoch milliseconds supplied by the sighting form. */
    sightedAt: bigint("sightedAt", { mode: "number" }).notNull(),
    note: text("note"),
    /** Optional S3 storage key for the uploaded sighting photo. */
    imageKey: varchar("imageKey", { length: 500 }),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
  },
  table => [
    index("sightings_sightedAt_idx").on(table.sightedAt),
    index("sightings_createdAt_idx").on(table.createdAt),
  ],
);

export type Sighting = typeof sightings.$inferSelect;
export type InsertSighting = typeof sightings.$inferInsert;
