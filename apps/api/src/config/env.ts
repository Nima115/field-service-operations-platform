import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.string().default("development"),
  PORT: z.coerce.number().default(4000),
  DATABASE_URL: z.string().optional(),
  JWT_ACCESS_SECRET: z.string().default("demo-access-secret"),
  JWT_REFRESH_SECRET: z.string().default("demo-refresh-secret"),
  ACCESS_TOKEN_TTL: z.string().default("15m"),
  REFRESH_TOKEN_TTL: z.string().default("7d"),
  WEB_ORIGIN: z.string().default("http://localhost:3000"),
  SMTP_FROM: z.string().default("Operations Platform <notifications@demo.local>")
});

export const env = envSchema.parse(process.env);
