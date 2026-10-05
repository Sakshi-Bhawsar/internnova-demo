import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { VerifyForm } from "@/components/verify/verify-form";

export const metadata: Metadata = {
  title: "Verify Certificate",
  description: "Verify the authenticity of an Internova certificate using its unique ID.",
};

export default function VerifyPage() {
  return (
    <div className="mx-auto max-w-xl px-4 py-12 sm:px-6 sm:py-16">
      <PageHeader
        title="Verify a certificate"
        description="Enter a certificate ID to confirm its authenticity. Example format: UM-2026-000001"
      />
      <Card className="mt-10">
        <CardContent className="py-8">
          <VerifyForm />
        </CardContent>
      </Card>
    </div>
  );
}
