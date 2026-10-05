import type { Metadata } from "next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface PageProps {
  params: Promise<{ certificateId: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { certificateId } = await params;
  return {
    title: `Certificate ${certificateId}`,
    description: `Verify Internova certificate ${certificateId}`,
  };
}

export default async function VerifyCertificatePage({ params }: PageProps) {
  const { certificateId } = await params;

  return (
    <div className="mx-auto max-w-xl px-4 py-12 sm:px-6 sm:py-16">
      <Card>
        <CardHeader>
          <Badge variant="muted" className="w-fit">Certificate verification</Badge>
          <CardTitle className="mt-2">Certificate ID: {certificateId}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted">
            Full certificate verification is available in Phase 10. The certificate lookup API
            will confirm authenticity, student name, program, and issue date.
          </p>
          <Button href="/verify" variant="outline">
            Search another certificate
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
