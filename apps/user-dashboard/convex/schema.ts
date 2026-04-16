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
});
