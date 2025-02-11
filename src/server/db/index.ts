import { neon } from "@neondatabase/serverless";
import { drizzle, NeonHttpDatabase } from "drizzle-orm/neon-http";
import * as schema from "./schema";

const sql = neon(
  "postgresql://neondb_owner:npg_Y8iEkyflMzH3@ep-misty-king-a1eofwfg-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require"
);
export const db: NeonHttpDatabase<typeof schema> = drizzle(sql);
