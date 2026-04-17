import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    // Auth identity
    tokenIdentifier: v.string(),
    clerkId: v.optional(v.string()),

    // Profile (from Clerk)
    name: v.optional(v.string()),
    email: v.optional(v.string()),
    phone: v.optional(v.string()),
    pictureUrl: v.optional(v.string()),

    // Onboarding — Partner
    partner: v.optional(v.string()), // swiggy, zomato, uber, rapido, zepto, porter
    partnerId: v.optional(v.string()),

    // Onboarding — Identity & Permissions
    mobile: v.optional(v.string()),
    permissions: v.optional(
      v.object({
        location: v.boolean(),
        notification: v.boolean(),
      })
    ),

    // Onboarding — KYC
    aadhar: v.optional(v.string()),
    pancardStorageId: v.optional(v.id("_storage")),
    selfieStorageId: v.optional(v.id("_storage")),

    // Onboarding — Coverage
    zones: v.optional(v.array(v.string())),
    policy: v.optional(
      v.object({
        zonesCovered: v.optional(v.number()),
        days: v.optional(v.number()),
        premium: v.optional(v.number()),
        planName: v.optional(v.string()),
      })
    ),

    // Onboarding — Payment
    upiId: v.optional(v.string()),

    // Status
    onboardingComplete: v.optional(v.boolean()),
    language: v.optional(v.string()), // "en" | "ta"

    // Timestamps
    createdAt: v.optional(v.number()),
    updatedAt: v.optional(v.number()),
  })
    .index("by_tokenIdentifier", ["tokenIdentifier"])
    .index("by_clerkId", ["clerkId"])
    .index("by_partner", ["partner"])
    .index("by_email", ["email"]),

  payments: defineTable({
    userId: v.string(),
    amount: v.number(),
    status: v.string(), // PENDING, SUCCESS, FAILED
    merchantTransactionId: v.string(),
    phonepeTransactionId: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_merchantTransactionId", ["merchantTransactionId"])
    .index("by_userId", ["userId"]),

  triggers: defineTable({
    type: v.string(), // RAINFALL, AQI, HEAT
    zoneId: v.string(),
    status: v.string(), // WATCH, TRIGGERED, NORMAL
    currentValue: v.number(),
    threshold: v.number(),
    timestamp: v.number(),
    workersAffected: v.optional(v.number()),
    payout: v.optional(v.number()),
  })
    .index("by_type", ["type"])
    .index("by_zoneId", ["zoneId"])
    .index("by_timestamp", ["timestamp"]),

  zones: defineTable({
    slug: v.string(), // chennai-south
    name: v.string(),
    geometry: v.any(), // GeoJSON
    activeTriggers: v.array(v.string()),
  }).index("by_slug", ["slug"]),
});
