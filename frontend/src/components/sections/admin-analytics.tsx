"use client";

import { Card } from "@/components/ui/card";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";

const engagementData = [
  { month: "Jan", sessions: 4.2 },
  { month: "Feb", sessions: 5.1 },
  { month: "Mar", sessions: 6.8 },
  { month: "Apr", sessions: 7.4 },
  { month: "May", sessions: 8.3 }
];

const studentsData = [
  { name: "India", students: 2400 },
  { name: "Malaysia", students: 900 },
  { name: "USA", students: 1100 },
  { name: "Australia", students: 700 }
];

export function AdminAnalytics() {
  return (
    <section className="mx-auto max-w-7xl space-y-4 px-6 py-12">
      <h2 className="text-3xl font-semibold text-white">Stripe-like Admin Dashboard</h2>
      <div className="grid gap-4 md:grid-cols-4">
        {[
          "Total Students: 5000+",
          "Active Courses: 120+",
          "Live Sessions: 850+",
          "Countries: 4"
        ].map((item) => (
          <Card key={item} className="text-slate-200">
            {item}
          </Card>
        ))}
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <p className="mb-4 font-medium text-cyan-200">Learning Engagement Trend</p>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={engagementData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="month" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip />
                <Line type="monotone" dataKey="sessions" stroke="#22d3ee" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
        <Card>
          <p className="mb-4 font-medium text-cyan-200">Country Usage</p>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={studentsData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="name" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip />
                <Bar dataKey="students" fill="#38bdf8" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </section>
  );
}
