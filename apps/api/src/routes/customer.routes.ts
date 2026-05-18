import { Router } from "express";
import { requireAuth, requireRole } from "../middleware/auth.js";
import { asyncHandler } from "../utils/http.js";
import { createCustomer, listCustomers } from "../services/customer.service.js";

export const customerRouter = Router();

customerRouter.use(requireAuth, requireRole("ADMIN", "EMPLOYEE"));

customerRouter.get(
  "/",
  asyncHandler(async (_req, res) => {
    res.json(await listCustomers());
  })
);

customerRouter.post(
  "/",
  requireRole("ADMIN"),
  asyncHandler(async (req, res) => {
    res.status(201).json(await createCustomer(req.body));
  })
);
