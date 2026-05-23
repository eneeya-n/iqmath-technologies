import { Router } from "express";
import { prisma } from "../lib/prisma";
import { requireAuth } from "../middleware/auth";

const router = Router();

router.get("/", async (_req, res) => {
  const products = await prisma.product.findMany({ orderBy: { createdAt: "desc" } });
  return res.json(products);
});

router.post("/", requireAuth, async (req, res) => {
  const { name, description } = req.body;
  if (!name || !description) return res.status(400).json({ message: "name and description required" });
  const product = await prisma.product.create({ data: { name, description } });
  return res.status(201).json(product);
});

export default router;
