"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRef } from "react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { registerApi } from "@/services/auth.service";
import { setSession, getPostLoginPath } from "@/lib/auth";

// graduationYear excluded from schema — read from ref to avoid z.coerce type inference issue
// with @hookform/resolvers v5 + zod v4
const schema = z.object({
  fullName: z.string().min(2, "Full name is required").max(120),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters").max(128),
  phone: z.string().min(10).max(15).optional(),
  college: z.string().max(120).optional(),
  role: z.enum(["STUDENT", "MENTOR"]),
});

type FormData = z.infer<typeof schema>;

export function RegisterForm() {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const [role, setRole] = useState<"STUDENT" | "MENTOR">("STUDENT");
  const gradYearRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { role: "STUDENT" },
  });

  function selectRole(r: "STUDENT" | "MENTOR") {
    setRole(r);
    setValue("role", r);
  }

  async function onSubmit(data: FormData) {
    setServerError(null);
    try {
      const gradYear = gradYearRef.current?.value;
      const result = await registerApi({
        ...data,
        college: data.college || undefined,
        phone: data.phone || undefined,
        graduationYear: gradYear ? Number(gradYear) : undefined,
      });
      setSession(result.token, result.user);
      router.push(getPostLoginPath(result.user));
    } catch (err: unknown) {
      setServerError(err instanceof Error ? err.message : "Registration failed");
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Role toggle */}
      <div className="flex overflow-hidden rounded-lg border border-border">
        {(["STUDENT", "MENTOR"] as const).map((r) => (
          <button
            key={r}
            type="button"
            onClick={() => selectRole(r)}
            className={`flex-1 py-2 text-sm font-semibold transition-colors ${
              role === r
                ? "bg-primary text-primary-foreground"
                : "bg-card text-muted hover:bg-background"
            }`}
          >
            {r === "STUDENT" ? "Student" : "Mentor"}
          </button>
        ))}
      </div>
      {role === "MENTOR" && (
        <p className="rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-700">
          Mentor accounts require admin approval before you can access the platform.
        </p>
      )}

      <div className="space-y-1.5">
        <Label htmlFor="fullName" required>Full name</Label>
        <Input
          id="fullName"
          placeholder="Arjun Sharma"
          error={!!errors.fullName}
          {...register("fullName")}
        />
        {errors.fullName && <p className="text-xs text-red-600">{errors.fullName.message}</p>}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="email" required>Email</Label>
        <Input
          id="email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          error={!!errors.email}
          {...register("email")}
        />
        {errors.email && <p className="text-xs text-red-600">{errors.email.message}</p>}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="password" required>Password</Label>
        <Input
          id="password"
          type="password"
          autoComplete="new-password"
          placeholder="Min. 8 characters"
          error={!!errors.password}
          {...register("password")}
        />
        {errors.password && <p className="text-xs text-red-600">{errors.password.message}</p>}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label htmlFor="college">College</Label>
          <Input id="college" placeholder="IIT Delhi" {...register("college")} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="graduationYear">Grad year</Label>
          <input
            id="graduationYear"
            type="number"
            placeholder="2026"
            min={1990}
            max={2040}
            ref={gradYearRef}
            className="flex h-11 w-full rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground shadow-sm placeholder:text-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
          />
        </div>
      </div>

      {serverError && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{serverError}</p>
      )}

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? "Creating account…" : "Create account"}
      </Button>
    </form>
  );
}
