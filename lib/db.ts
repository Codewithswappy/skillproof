import { neonConfig } from "@neondatabase/serverless";
import { PrismaNeon } from "@prisma/adapter-neon";
// Force client refresh: 3
import { PrismaClient } from "@prisma/client";
import ws from "ws";

// Set up WebSocket for Neon serverless driver
neonConfig.webSocketConstructor = ws;

const globalForPrisma = globalThis as unknown as {
  prisma_Profilebase: PrismaClient | undefined;
};

function createPrismaClient() {
  const connectionString = process.env.DATABASE_URL!;
  
  // Instantiate the Prisma adapter using the connection string directly
  // The PrismaNeon adapter in newer versions expects PoolConfig, not a Pool instance
  const adapter = new PrismaNeon({ connectionString });

  return new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });
}

export const db = globalForPrisma.prisma_Profilebase ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma_Profilebase = db;
