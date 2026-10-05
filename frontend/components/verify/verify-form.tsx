"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export function VerifyForm() {
  const router = useRouter();
  const [value, setValue] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const id = value.trim();
    if (!id) {
      setError("Please enter a certificate ID");
      return;
    }
    router.push(`/verify/${encodeURIComponent(id)}`);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor="certId" required>Certificate ID</Label>
        <Input
          id="certId"
          placeholder="UM-2026-000001"
          value={value}
          onChange={(e) => { setValue(e.target.value); setError(""); }}
          error={!!error}
          aria-describedby={error ? "certId-error" : undefined}
        />
        {error && <p id="certId-error" className="text-xs text-red-600">{error}</p>}
      </div>
      <Button type="submit" className="w-full">Verify certificate</Button>
    </form>
  );
}
