"use node";

import { internalAction } from "./_generated/server";
import { v } from "convex/values";
import { internal } from "./_generated/api";
import { Client } from "pg";

export const fetchAndSyncFromPostgres = internalAction({
  args: {
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const dbUrl = process.env.DATABASE_URL;
    if (!dbUrl) {
      throw new Error("DATABASE_URL not set in Convex environment");
    }

    const client = new Client({
      connectionString: dbUrl,
      ssl: {
        rejectUnauthorized: false
      }
    });

    try {
      await client.connect();
      console.log("Connected to legacy PostgreSQL");

      const limit = args.limit || 50;
      const res = await client.query(
        "SELECT * FROM trigger_events ORDER BY timestamp DESC LIMIT $1",
        [limit]
      );

      console.log(`Fetched ${res.rowCount} events from PG`);

      for (const row of res.rows) {
        // Map PG fields to Convex fields
        await ctx.runMutation(internal.sync.upsertTrigger, {
          type: row.trigger_type,
          zoneId: row.zone_id,
          status: row.status,
          currentValue: row.actual_value,
          threshold: row.threshold_value,
          timestamp: new Date(row.timestamp).getTime(),
          workersAffected: row.affected_worker_count,
          payout: row.metadata?.estimatedPayoutLakhs || 0
        });
      }

      return { success: true, count: res.rowCount };
    } catch (error: any) {
      console.error("Postgres Sync Error:", error);
      throw new Error(`Sync failed: ${error.message}`);
    } finally {
      await client.end();
    }
  },
});
