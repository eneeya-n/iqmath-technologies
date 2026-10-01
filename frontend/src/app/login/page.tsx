"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const onLogin = () => {
    setError("Sign-in is not available on this site.");
  };

  return (
    <main className="mx-auto flex min-h-[80vh] max-w-4xl items-center px-6 py-14">
      <Card className="w-full">
        <h1 className="text-3xl font-semibold text-white">Secure Login</h1>
        <p className="mt-2 text-slate-300">Student sign-in is not open on this site.</p>
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
