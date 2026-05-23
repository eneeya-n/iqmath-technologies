import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";
import { z } from "zod";
import { UserRole } from "@prisma/client";
import { prisma } from "../lib/prisma";

const router = Router();

const registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8),
  role: z.nativeEnum(UserRole).optional()
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8)
});

function createToken(payload: { userId: string; email: string; role: UserRole }) {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("JWT_SECRET not configured");
  return jwt.sign(payload, secret, { expiresIn: "7d" });
}

router.post("/register", async (req, res) => {
  try {
    const body = registerSchema.parse(req.body);
    const exists = await prisma.user.findUnique({ where: { email: body.email } });
    if (exists) return res.status(409).json({ message: "Email already registered" });

    const passwordHash = await bcrypt.hash(String(body.password), 10);
    const user = await prisma.user.create({
      data: {
        name: body.name,
        email: body.email,
        passwordHash,
        role: body.role ?? UserRole.STUDENT
      }
    });

    const token = createToken({ userId: user.id, email: user.email, role: user.role });
    return res.status(201).json({ token, user });
  } catch (error) {
    return res.status(400).json({ message: "Invalid request", error });
  }
});

router.post("/login", async (req, res) => {
  try {
    const body = loginSchema.parse(req.body);
    const user = await prisma.user.findUnique({ where: { email: body.email } });
    if (!user?.passwordHash) return res.status(401).json({ message: "Invalid credentials" });
    const validPassword = await bcrypt.compare(body.password, user.passwordHash);
    if (!validPassword) return res.status(401).json({ message: "Invalid credentials" });

    const token = createToken({ userId: user.id, email: user.email, role: user.role });
    return res.json({ token, user });
  } catch (error) {
    return res.status(400).json({ message: "Invalid request", error });
  }
});

router.post("/google", async (req, res) => {
  try {
    const idToken = String(req.body?.idToken || "");
    if (!idToken) return res.status(400).json({ message: "idToken is required" });
    const googleClientId = process.env.GOOGLE_CLIENT_ID;
    if (!googleClientId) return res.status(500).json({ message: "GOOGLE_CLIENT_ID not configured" });

    const client = new OAuth2Client(googleClientId);
    const ticket = await client.verifyIdToken({
      idToken,
      audience: googleClientId
    });
    const payload = ticket.getPayload();
    if (!payload?.email) return res.status(401).json({ message: "Invalid Google token" });

    const user = await prisma.user.upsert({
      where: { email: payload.email },
      update: {
        name: payload.name ?? "Google User",
        googleId: payload.sub
      },
      create: {
        email: payload.email,
        name: payload.name ?? "Google User",
        googleId: payload.sub,
        role: UserRole.STUDENT
      }
    });

    const token = createToken({ userId: user.id, email: user.email, role: user.role });
    return res.json({ token, user });
  } catch (error) {
    return res.status(401).json({ message: "Google login failed", error });
  }
});

export default router;
