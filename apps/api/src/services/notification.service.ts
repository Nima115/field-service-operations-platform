import type { NotificationType } from "@prisma/client";
import { prisma } from "../config/prisma.js";

export async function createNotification(input: {
  userId: string;
  type: NotificationType;
  message: string;
}) {
  return prisma.notification.create({
    data: input
  });
}

export async function listNotifications(userId: string) {
  return prisma.notification.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take: 50
  });
}
