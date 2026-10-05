import type { Metadata } from "next";
import { Suspense } from "react";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LoginForm } from "@/components/auth/login-form";

export const metadata: Metadata = { title: "Log in" };

export default function LoginPage() {
  return (
    <div className="mx-auto flex max-w-md flex-1 flex-col justify-center px-4 py-12 sm:px-6">
      <PageHeader title="Welcome back" description="Sign in to your Internova account." />
      <Card className="mt-8">
        <CardContent className="py-8 space-y-6">
          <Suspense>
            <LoginForm />
          </Suspense>
          <p className="text-center text-sm text-muted">
            No account?{" "}
            <Button href="/register" variant="ghost" size="sm" className="px-1">
              Register
            </Button>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
