import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RegisterForm } from "@/components/auth/register-form";

export const metadata: Metadata = { title: "Register" };

export default function RegisterPage() {
  return (
    <div className="mx-auto flex max-w-md flex-1 flex-col justify-center px-4 py-12 sm:px-6">
      <PageHeader
        title="Create your account"
        description="Students and mentors can register. Mentor accounts require admin approval."
      />
      <Card className="mt-8">
        <CardContent className="py-8 space-y-6">
          <RegisterForm />
          <p className="text-center text-sm text-muted">
            Already have an account?{" "}
            <Button href="/login" variant="ghost" size="sm" className="px-1">
              Sign in
            </Button>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
