import type { Metadata } from "next";
import { CheckCircle2 } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "About",
  description:
    "Internova helps students gain practical experience through structured internships, real projects, and verifiable proof of work.",
};

const values = [
  {
    title: "Honesty over hype",
    body: "We do not guarantee jobs or placements. We focus on skills, accountability, and honest evaluation.",
  },
  {
    title: "Work that speaks",
    body: "Every certificate is backed by tasks, a project, an assessment, and mentor evaluation — not just attendance.",
  },
  {
    title: "Student-first",
    body: "Pricing, structure, and support are designed around students in India — not corporate sales funnels.",
  },
  {
    title: "Transparent evaluation",
    body: "Scores, feedback, and criteria are visible to students. No black-box grading.",
  },
];

const principles = [
  "No fake placement statistics",
  "No certificate-selling without completion",
  "No undisclosed paid partnerships",
  "Mentor credentials verified before approval",
];

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 sm:py-16">
      <PageHeader
        eyebrow="Our story"
        title="About Internova"
        description="We help students gain practical experience through structured internships, real projects, and verifiable proof of work."
      />

      <section className="mt-14 grid gap-5 sm:grid-cols-2" aria-labelledby="values-heading">
        <h2 id="values-heading" className="sr-only">Our values</h2>
        {values.map((v) => (
          <Card key={v.title}>
            <CardHeader>
              <CardTitle className="text-base">{v.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted leading-relaxed">{v.body}</p>
            </CardContent>
          </Card>
        ))}
      </section>

      <section className="mt-14" aria-labelledby="principles-heading">
        <h2 id="principles-heading" className="text-xl font-semibold text-foreground">
          What we commit to
        </h2>
        <ul className="mt-5 space-y-3">
          {principles.map((p) => (
            <li key={p} className="flex items-start gap-2 text-sm text-foreground">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-accent" aria-hidden="true" />
              {p}
            </li>
          ))}
        </ul>
      </section>

      <div className="mt-12 flex flex-wrap gap-3">
        <Button href="/internships">Browse internships</Button>
        <Button href="/contact" variant="outline">Get in touch</Button>
      </div>
    </div>
  );
}
