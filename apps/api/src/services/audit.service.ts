import { Prisma, Role } from "@prisma/client";
import { prisma } from "../config/prisma.js";

export async function recordAuditLog(input: {
  actorId?: string | null;
  action: string;
  entity: string;
  entityId: string;
  metadata?: Record<string, unknown>;
}) {
  return prisma.auditLog.create({
    data: {
      actorId: input.actorId ?? null,
      action: input.action,
      entity: input.entity,
      entityId: input.entityId,
      metadata: input.metadata as Prisma.InputJsonValue | undefined
    }
  });
}

export async function listAuditLogs(user: Express.User) {
  if (user.role !== Role.ADMIN) return [];

  return prisma.auditLog.findMany({
    include: { actor: { select: { id: true, name: true, email: true, role: true } } },
    orderBy: { createdAt: "desc" },
    take: 50
  });
}

