"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { apiRequest } from "@/lib/api";

type LoginResponse = {
  token: string;
  user: {
    role: string;
  };
};

export default function LoginPage() {
  const [email, setEmail] = useState("admin@iqmath.example");
  const [password, setPassword] = useState("Admin@123456");
  const [error, setError] = useState("");
  const router = useRouter();

  const onLogin = async () => {
    try {
      setError("");
      const data = await apiRequest<LoginResponse>("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password })
      });
      localStorage.setItem("iqmath_token", data.token);
      localStorage.setItem("iqmath_role", data.user.role.toLowerCase());
      router.push(`/dashboard/${data.user.role.toLowerCase().replace("_client", "").replace("_admin", "")}`);
    } catch {
      setError("Login failed. Check credentials and backend status.");
    }
  };

  return (
    <main className="mx-auto flex min-h-[80vh] max-w-4xl items-center px-6 py-14">
      <Card className="w-full">
        <h1 className="text-3xl font-semibold text-white">Secure Login</h1>
        <p className="mt-2 text-slate-300">
          JWT authentication with role-based dashboard routing.
        </p>
        <div className="mt-6 space-y-3">
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-lg border border-white/20 bg-slate-900/70 px-3 py-2 text-white"
            placeholder="Email"
          />
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-lg border border-white/20 bg-slate-900/70 px-3 py-2 text-white"
            placeholder="Password"
            type="password"
          />
          <div className="flex gap-3">
            <Button onClick={onLogin}>Login</Button>
            <Button variant="outline">Google Login (wire client SDK)</Button>
          </div>
          {error ? <p className="text-sm text-red-300">{error}</p> : null}
        </div>
      </Card>
    </main>
  );
}
