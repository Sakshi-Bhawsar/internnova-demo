"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

const schema = z.object({
  name: z.string().min(2, "Name is required").max(120),
  email: z.string().email("Invalid email"),
  companyName: z.string().min(2, "Company name is required").max(200),
});

type FormData = z.infer<typeof schema>;

export function CompanyInterestForm() {
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  async function onSubmit(data: FormData) {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000/api"}/contact`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...data,
            type: "COMPANY_INTEREST",
            subject: "Company interest registration",
            message: `Company: ${data.companyName}`,
          }),
        }
      );
      if (!res.ok) throw new Error();
      setStatus("success");
      reset();
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <p className="rounded-lg bg-emerald-50 px-4 py-4 text-sm text-emerald-700">
        Thanks! We will be in touch when the employer platform launches.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
      <div className="space-y-1.5">
        <Label htmlFor="ci-name" required>Your name</Label>
        <Input id="ci-name" placeholder="Priya Mehta" error={!!errors.name} {...register("name")} />
        {errors.name && <p className="text-xs text-red-600">{errors.name.message}</p>}
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="ci-email" required>Work email</Label>
        <Input id="ci-email" type="email" placeholder="priya@company.com" error={!!errors.email} {...register("email")} />
        {errors.email && <p className="text-xs text-red-600">{errors.email.message}</p>}
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="ci-company" required>Company name</Label>
        <Input id="ci-company" placeholder="Acme Corp" error={!!errors.companyName} {...register("companyName")} />
        {errors.companyName && <p className="text-xs text-red-600">{errors.companyName.message}</p>}
      </div>
      {status === "error" && (
        <p className="text-xs text-red-600">Failed to submit. Please try again.</p>
      )}
      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? "Submitting…" : "Register interest"}
      </Button>
    </form>
  );
}
