"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { clearSession } from "@/lib/auth";

export default function MentorPendingPage() {
  const router = useRouter();

  function handleLogout() {
    clearSession();
    router.push("/login");
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
      <div className="max-w-md space-y-4">
        <div className="text-5xl">⏳</div>
        <h1 className="text-2xl font-bold">Application under review</h1>
        <p className="text-muted">
          Your mentor application has been submitted and is awaiting admin approval.
          You will be notified once your account is approved.
        </p>
        <p className="text-sm text-muted">
          Questions? Email{" "}
          <a href="mailto:support@internova.in" className="text-primary underline">
            support@internova.in
          </a>
        </p>
        <Button variant="outline" onClick={handleLogout}>
          Sign out
        </Button>
      </div>
    </div>
  );
}
