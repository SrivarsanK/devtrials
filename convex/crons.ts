import { cronJobs } from "convex/server";
import { internal } from "./_generated/api";

const crons = cronJobs();

crons.interval(
  "Sync from legacy Postgres",
  { minutes: 1 },
  internal.postgres.fetchAndSyncFromPostgres,
  { limit: 100 }
);

export default crons;
