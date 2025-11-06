// lib/prisma.ts
import { PrismaClient } from "@prisma/client";

// TypeScript'in global nesnesini genişletiyoruz
const globalForPrisma = global as unknown as {
  prisma: PrismaClient | undefined;
};

// Globalde mevcut bir client varsa onu kullan, yoksa yeni bir client oluştur
export const prisma =
  globalForPrisma.prisma ?? new PrismaClient({
    log: ["query"], // Çalışan sorguları terminalde görmek için
  });

// Geliştirme ortamında hot reload (hızlı yenileme) sorunlarını önlemek için
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;