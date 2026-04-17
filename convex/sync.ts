import { v } from "convex/values";
import { internalMutation } from "./_generated/server";

export const upsertTrigger = internalMutation({
  args: {
    type: v.string(),
    zoneId: v.string(),
    status: v.string(),
    currentValue: v.number(),
    threshold: v.number(),
    timestamp: v.number(),
    workersAffected: v.optional(v.number()),
    payout: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    // Basic deduplication based on type, zone and timestamp
    const existing = await ctx.db
      .query("triggers")
      .withIndex("by_timestamp", (q) => q.eq("timestamp", args.timestamp))
      .filter((q) => q.and(
        q.eq(q.field("type"), args.type),
        q.eq(q.field("zoneId"), args.zoneId)
      ))
      .unique();

    if (existing) {
      await ctx.db.patch(existing._id, {
        status: args.status,
        currentValue: args.currentValue,
        workersAffected: args.workersAffected,
        payout: args.payout,
      });
      return existing._id;
    }

    return await ctx.db.insert("triggers", {
      ...args
    });
  },
});
