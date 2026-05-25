import { Router } from "express";
import { requireAuth, requireRole } from "../middleware/auth.js";
import { asyncHandler } from "../utils/http.js";
import { z } from "zod";
import { buildInvoicePdf, createInvoice, listInvoices, updateInvoiceStatus } from "../services/invoice.service.js";

export const invoiceRouter = Router();

invoiceRouter.use(requireAuth);

invoiceRouter.get(
  "/",
  asyncHandler(async (_req, res) => {
    res.json(await listInvoices(_req.user!));
  })
);

invoiceRouter.post(
  "/",
  requireRole("ADMIN"),
  asyncHandler(async (req, res) => {
    res.status(201).json(await createInvoice(req.body, req.user!));
  })
);

invoiceRouter.patch(
  "/:id",
  requireRole("ADMIN"),
  asyncHandler(async (req, res) => {
    const body = z.object({ status: z.enum(["DRAFT", "SENT", "PAID", "OVERDUE", "VOID"]) }).parse(req.body);
    res.json(await updateInvoiceStatus(String(req.params.id), body.status, req.user!));
  })
);

invoiceRouter.get(
  "/:id/pdf",
  asyncHandler(async (req, res) => {
    const invoiceId = String(req.params.id);
    const pdf = await buildInvoicePdf(invoiceId, req.user!);
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename=invoice-${invoiceId}.pdf`);
    res.send(pdf);
  })
);

