import { Router } from "express";
import { UserRole } from "@prisma/client";
import { prisma } from "../lib/prisma";
import { AuthRequest, requireAuth, requireRole } from "../middleware/auth";

const router = Router();

router.get("/me", requireAuth, async (req: AuthRequest, res) => {
  const user = await prisma.user.findUnique({
    where: { id: req.user!.userId }
  });
  return res.json(user);
});

router.get("/", requireAuth, requireRole([UserRole.ADMIN]), async (_req, res) => {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true
    },
    orderBy: { createdAt: "desc" }
  });
  return res.json(users);
});

export default router;
