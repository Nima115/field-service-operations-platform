import { z } from "zod";
import { prisma } from "../config/prisma.js";

export const serviceSchema = z.object({
  title: z.string().min(2),
  description: z.string().min(2),
  price: z.number().positive(),
  active: z.boolean().default(true)
});

export async function listServices() {
  return prisma.service.findMany({
    where: { active: true },
    orderBy: { title: "asc" }
  });
}

export async function createService(input: z.infer<typeof serviceSchema>) {
  return prisma.service.create({
    data: serviceSchema.parse(input)
  });
}
