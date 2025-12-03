import { PrismaClient } from "@prisma/client";

declare global {
  var prisma: PrismaClient | undefined;
}

const isDev = process.env.NODE_ENV === "development";
const isTest = process.env.NODE_ENV === "test";

// Default behavior:
// 🧪 test  -> no query logs
// 🚀 production -> no query logs
// 🛠 dev -> show query logs unless disabled
const shouldLogQuery = isDev && !isTest && process.env.LOG_QUERIES !== "false";

export const prisma =
  global.prisma ??
  new PrismaClient({
    log: shouldLogQuery ? ["query", "error", "warn"] : ["error", "warn"],
  });

if (process.env.NODE_ENV !== "production") {
  global.prisma = prisma;
}
