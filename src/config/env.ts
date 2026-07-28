// src/config/env.ts

import dotenv from "dotenv";

dotenv.config();

function getEnv(key: string): string {
  const value = process.env[key];

  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }

  return value;
}

export const env = {
  PORT: Number(process.env.PORT) || 5000,
  NODE_ENV: process.env.NODE_ENV || "development",

  MONGODB_URI: getEnv("MONGODB_URI"),

  REDIS_HOST: getEnv("REDIS_HOST"),
  REDIS_PORT: Number(getEnv("REDIS_PORT")),
};