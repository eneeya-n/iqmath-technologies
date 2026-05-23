import bcrypt from "bcryptjs";
import { PrismaClient, UserRole } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const adminPassword = await bcrypt.hash("Admin@123456", 10);
  const admin = await prisma.user.upsert({
    where: { email: "admin@iqmath.example" },
    update: {},
    create: {
      email: "admin@iqmath.example",
      name: "IQMath Admin",
      passwordHash: adminPassword,
      role: UserRole.ADMIN
    }
  });

  await prisma.product.createMany({
    data: [
      { name: "AI ToC Generator", description: "Generate curriculum table of contents from syllabus." },
      { name: "AI Proctored Exam Platform", description: "Monitor online exams with AI." },
      { name: "Coding Assessment Platform", description: "Run coding tests with auto-grading." },
      { name: "LMS Platform", description: "Learning management platform for institutions." }
    ],
    skipDuplicates: true
  });

  const course = await prisma.course.create({
    data: {
      title: "Enterprise AI Foundations",
      description: "Hands-on AI curriculum for higher education."
    }
  });

  await prisma.lesson.createMany({
    data: [
      { title: "Introduction", content: "Program orientation", courseId: course.id },
      { title: "Prompt Engineering", content: "Building practical prompts", courseId: course.id }
    ]
  });

  await prisma.assignment.create({
    data: {
      title: "AI Capstone Plan",
      description: "Design an institutional AI deployment strategy.",
      courseId: course.id
    }
  });

  await prisma.countryUsage.createMany({
    data: [
      { country: "India", activeUsers: 2400, activeCourses: 42, revenueINR: 2000000 },
      { country: "Malaysia", activeUsers: 900, activeCourses: 20, revenueINR: 800000 },
      { country: "USA", activeUsers: 1100, activeCourses: 30, revenueINR: 1300000 },
      { country: "Australia", activeUsers: 700, activeCourses: 18, revenueINR: 900000 }
    ],
    skipDuplicates: true
  });

  await prisma.trainingProgram.createMany({
    data: [
      { title: "Student AI Bootcamp", type: "STUDENT", country: "India", participants: 300, ownerId: admin.id },
      { title: "Corporate AI Upskilling", type: "CORPORATE", country: "Malaysia", participants: 120, ownerId: admin.id }
    ]
  });

  await prisma.corporateClient.createMany({
    data: [
      { name: "Nova FinTech", country: "India", contactName: "Ananya", contactEmail: "ops@novafin.example" },
      { name: "BlueBridge Systems", country: "Malaysia", contactName: "Rahim", contactEmail: "team@bluebridge.example" }
    ]
  });

  await prisma.college.createMany({
    data: [
      { name: "Global Tech College", country: "India", city: "Chennai" },
      { name: "Pacific Institute of Computing", country: "Australia", city: "Sydney" }
    ]
  });

  await prisma.certificate.create({
    data: {
      title: "AI Program Completion",
      issuedTo: "Sample Student",
      programName: "Student AI Bootcamp",
      issuedAt: new Date()
    }
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    // eslint-disable-next-line no-console
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
