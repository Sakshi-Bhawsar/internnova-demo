import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "Mentorship",
  description:
    "Internova mentors provide structured feedback on tasks and projects. Learn how mentorship works on our platform.",
};

const items = [
  {
    title: "Task & project review",
    description:
      "Mentors review your submissions with structured feedback — what works, what to improve, and why.",
  },
  {
    title: "Career guidance",
    description:
      "Practical advice on portfolios, interview preparation, and skill growth from practitioners.",
  },
  {
    title: "Milestone check-ins",
    description:
      "Mentors track your progress through internship stages and flag blockers early.",
  },
];

const faqs = [
  {
    q: "Are mentors from specific companies?",
    a: "We do not claim mentors are from specific companies unless independently verified. Mentor profiles show their background.",
  },
  {
    q: "How are mentors approved?",
    a: "Mentors register publicly and go through admin review before being approved. Pending mentors cannot access the platform.",
  },
  {
    q: "Can I choose my mentor?",
    a: "Mentor assignment is handled by admins based on program and availability. Direct selection is a future feature.",
  },
];

export default function MentorshipPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 sm:py-16">
      <PageHeader
        eyebrow="How it works"
        title="Industry-oriented mentorship"
        description="Mentors on Internova support your learning journey through structured reviews and feedback — not vague promises."
      />

      <section className="mt-14 grid gap-5 md:grid-cols-3" aria-labelledby="mentorship-heading">
        <h2 id="mentorship-heading" className="sr-only">Mentorship areas</h2>
        {items.map((item) => (
          <Card key={item.title}>
            <CardHeader>
              <CardTitle className="text-base">{item.title}</CardTitle>
              <CardDescription>{item.description}</CardDescription>
            </CardHeader>
          </Card>
        ))}
      </section>

      <section className="mt-14" aria-labelledby="mentor-faq-heading">
        <h2 id="mentor-faq-heading" className="text-xl font-semibold text-foreground">
          Mentorship FAQs
        </h2>
        <div className="mt-5 space-y-4">
          {faqs.map((faq) => (
            <div key={faq.q} className="rounded-xl border border-border p-5">
              <p className="font-medium text-foreground text-sm">{faq.q}</p>
              <p className="mt-2 text-sm text-muted">{faq.a}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-14 rounded-xl border border-border bg-card/50 p-8 text-center">
        <Badge variant="accent" className="mb-4">Become a mentor</Badge>
        <h2 className="text-xl font-semibold text-foreground">Want to mentor students?</h2>
        <p className="mt-3 text-sm text-muted max-w-md mx-auto">
          Register as a mentor. Your application will be reviewed by our admin team before approval.
        </p>
        <Button href="/register" className="mt-6">Apply as mentor</Button>
      </section>
    </div>
  );
}
