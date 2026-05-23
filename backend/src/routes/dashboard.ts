import { Router } from "express";
import { UserRole } from "@prisma/client";
import { prisma } from "../lib/prisma";
import { requireAuth, requireRole } from "../middleware/auth";

const router = Router();

router.get(
  "/admin-overview",
  requireAuth,
  requireRole([UserRole.ADMIN, UserRole.COLLEGE_ADMIN, UserRole.CORPORATE_CLIENT]),
  async (_req, res) => {
    const [students, courses, countries, trainingPrograms] = await Promise.all([
      prisma.student.count(),
      prisma.course.count({ where: { isActive: true } }),
      prisma.countryUsage.findMany(),
      prisma.trainingProgram.count()
    ]);

    const revenue = countries.reduce((sum: number, item: { revenueINR: number }) => sum + item.revenueINR, 0);
    return res.json({
      totalStudents: students,
      activeCourses: courses,
      countriesUsingProducts: countries.length,
      revenueINR: revenue,
      trainingPrograms
    });
  }
);

router.get("/activity-feed", requireAuth, async (_req, res) => {
  const feed = [
    { type: "exam_alert", message: "Suspicious behavior detected in exam session #A102", at: new Date() },
    { type: "course", message: "New course published: AI for Universities", at: new Date() },
    { type: "training", message: "Corporate training completed for fintech cohort", at: new Date() }
  ];
  return res.json(feed);
});

router.get("/role/:role", requireAuth, async (req, res) => {
  const role = String(req.params.role);
  const widgets: Record<string, string[]> = {
    admin: ["Revenue Overview", "User Growth", "Global Product Health"],
    student: ["My Courses", "Upcoming Assignments", "AI Recommendations"],
    mentor: ["Mentor Sessions", "Student Queries", "Performance Insights"],
    corporate: ["Team Completion", "Skill Gap Map", "Program ROI"],
    college: ["Department Analytics", "Placement Readiness", "Semester Outcomes"]
  };
  return res.json({
    role,
    widgets: widgets[role] ?? ["Dashboard Overview", "Learning Analytics"]
  });
});

export default router;
