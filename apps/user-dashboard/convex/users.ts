import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Get current user identity from JWT
export const getMe = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.auth.getUserIdentity();
  },
});

// Get full user profile from DB
export const getProfile = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return null;

    return await ctx.db
      .query("users")
      .withIndex("by_tokenIdentifier", (q) =>
        q.eq("tokenIdentifier", identity.tokenIdentifier)
      )
      .unique();
  },
});

// Create or update user on login (called from ConvexUserSync)
export const storeUser = mutation({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const existing = await ctx.db
      .query("users")
      .withIndex("by_tokenIdentifier", (q) =>
        q.eq("tokenIdentifier", identity.tokenIdentifier)
      )
      .unique();

    if (existing !== null) {
      // Sync profile fields from Clerk
      await ctx.db.patch(existing._id, {
        name: identity.name,
        email: identity.email,
        phone: identity.phoneNumber,
        pictureUrl: identity.pictureUrl,
        updatedAt: Date.now(),
      });
      return existing._id;
    }

    return await ctx.db.insert("users", {
      tokenIdentifier: identity.tokenIdentifier,
      clerkId: identity.subject,
      name: identity.name,
      email: identity.email,
      phone: identity.phoneNumber,
      pictureUrl: identity.pictureUrl,
      onboardingComplete: false,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
  },
});

// Save onboarding data (called at end of enrollment wizard)
export const completeOnboarding = mutation({
  args: {
    partner: v.string(),
    partnerId: v.string(),
    mobile: v.string(),
    permissions: v.object({
      location: v.boolean(),
      notification: v.boolean(),
    }),
    zones: v.array(v.string()),
    aadhar: v.string(),
    upiId: v.string(),
    policy: v.optional(
      v.object({
        zonesCovered: v.optional(v.number()),
        days: v.optional(v.number()),
        premium: v.optional(v.number()),
        planName: v.optional(v.string()),
      })
    ),
    language: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const user = await ctx.db
      .query("users")
      .withIndex("by_tokenIdentifier", (q) =>
        q.eq("tokenIdentifier", identity.tokenIdentifier)
      )
      .unique();

    if (!user) throw new Error("User not found");

    await ctx.db.patch(user._id, {
      partner: args.partner,
      partnerId: args.partnerId,
      mobile: args.mobile,
      permissions: args.permissions,
      zones: args.zones,
      aadhar: args.aadhar,
      upiId: args.upiId,
      policy: args.policy,
      language: args.language,
      onboardingComplete: true,
      updatedAt: Date.now(),
    });

    return user._id;
  },
});

// Update individual profile fields
export const updateProfile = mutation({
  args: {
    mobile: v.optional(v.string()),
    upiId: v.optional(v.string()),
    language: v.optional(v.string()),
    permissions: v.optional(
      v.object({
        location: v.boolean(),
        notification: v.boolean(),
      })
    ),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const user = await ctx.db
      .query("users")
      .withIndex("by_tokenIdentifier", (q) =>
        q.eq("tokenIdentifier", identity.tokenIdentifier)
      )
      .unique();

    if (!user) throw new Error("User not found");

    const updates: Record<string, unknown> = { updatedAt: Date.now() };
    if (args.mobile !== undefined) updates.mobile = args.mobile;
    if (args.upiId !== undefined) updates.upiId = args.upiId;
    if (args.language !== undefined) updates.language = args.language;
    if (args.permissions !== undefined) updates.permissions = args.permissions;

    await ctx.db.patch(user._id, updates);
    return user._id;
  },
});
