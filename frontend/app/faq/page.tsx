import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "FAQ",
  description:
    "Frequently asked questions about Internova internships, certificates, mentorship, and refund policy.",
};

const faqs = [
  {
    q: "Is a job guaranteed after completion?",
    a: "No. Internova does not guarantee jobs or placement. We focus on skills, projects, and verifiable proof of work.",
  },
  {
    q: "How do certificates work?",
    a: "Certificates are issued when you meet program criteria — tasks approved, project submitted, assessment passed, and evaluation completed. Each has a unique ID and a public verification page.",
  },
  {
    q: "Who can apply?",
    a: "Students and recent graduates who meet each internship's eligibility requirements. Open to applicants across India.",
  },
  {
    q: "What is the refund policy?",
    a: "Refund terms depend on the specific program. Details will be published before any paid checkout is enabled.",
    id: "refund",
  },
  {
    q: "How does mentor approval work?",
    a: "Mentors register publicly and are reviewed by our admin team. Only approved mentors can access the platform and be assigned to programs.",
  },
  {
    q: "Can I apply to multiple internships?",
    a: "Yes. You can apply to multiple programs, but active enrollment is subject to program capacity and admin review.",
  },
  {
    q: "Is Internova free to use?",
    a: "Most programs are free. Paid programs will clearly display pricing before you apply. No hidden fees.",
  },
];

export default function FaqPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
      <PageHeader title="Frequently asked questions" />
      <div className="mt-10 space-y-4">
        {faqs.map((faq) => (
          <Card key={faq.q} id={faq.id}>
            <CardHeader>
              <CardTitle className="text-base">{faq.q}</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted leading-relaxed">{faq.a}</CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
