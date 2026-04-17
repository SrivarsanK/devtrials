import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const getPaymentStatus = query({
  args: { merchantTransactionId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("payments")
      .withIndex("by_merchantTransactionId", (q) =>
        q.eq("merchantTransactionId", args.merchantTransactionId)
      )
      .unique();
  },
});

export const listUserPayments = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("payments")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .order("desc")
      .collect();
  },
});

export const createPayment = mutation({
  args: {
    userId: v.string(),
    amount: v.number(),
    merchantTransactionId: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("payments", {
      userId: args.userId,
      amount: args.amount,
      status: "PENDING",
      merchantTransactionId: args.merchantTransactionId,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
  },
});

export const updatePaymentStatus = mutation({
  args: {
    merchantTransactionId: v.string(),
    status: v.string(),
    phonepeTransactionId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const payment = await ctx.db
      .query("payments")
      .withIndex("by_merchantTransactionId", (q) =>
        q.eq("merchantTransactionId", args.merchantTransactionId)
      )
      .unique();

    if (!payment) {
      throw new Error("Payment not found");
    }

    await ctx.db.patch(payment._id, {
      status: args.status,
      phonepeTransactionId: args.phonepeTransactionId,
      updatedAt: Date.now(),
    });

    return payment._id;
  },
});
