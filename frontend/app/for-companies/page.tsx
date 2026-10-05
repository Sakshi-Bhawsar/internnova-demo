import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CompanyInterestForm } from "@/components/contact/company-interest-form";

export const metadata: Metadata = {
  title: "For Companies",
  description:
    "Internova's employer platform is in development. Register your interest to access trained, project-ready talent.",
};

const benefits = [
  "Access to trained, project-ready talent",
  "Pre-screened candidates from structured programs",
  "Verifiable certificates backed by real work",
  "Internship programs and project-based hiring",
];

export default function ForCompaniesPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
      <PageHeader
        eyebrow="Coming soon"
        title="For Companies"
        description="Our employer platform is in development. Register your interest below."
      />

      <div className="mt-10 grid gap-6 sm:grid-cols-2">
        <Card>
          <CardHeader>
            <Badge variant="warning" className="w-fit mb-2">Employer portal — not in V1</Badge>
            <CardTitle className="text-base">Future benefits</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-muted">
              {benefits.map((b) => (
                <li key={b} className="flex items-start gap-2">
                  <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" aria-hidden="true" />
                  {b}
                </li>
              ))}
            </ul>
            <p className="mt-4 text-xs text-muted font-medium">
              No company dashboards or fake hiring flows in V1.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Register interest</CardTitle>
          </CardHeader>
          <CardContent>
            <CompanyInterestForm />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
