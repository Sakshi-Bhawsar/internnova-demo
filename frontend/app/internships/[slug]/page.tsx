import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CheckCircle2, Clock, MapPin, Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { fetchInternship } from "@/services/internship.service";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  try {
    const internship = await fetchInternship(slug);
    return {
      title: internship.title,
      description: internship.description.slice(0, 160),
    };
  } catch {
    return { title: "Internship not found" };
  }
}

const modeLabel: Record<string, string> = {
  REMOTE: "Remote",
  HYBRID: "Hybrid",
  ONSITE: "On-site",
};

export default async function InternshipDetailPage({ params }: PageProps) {
  const { slug } = await params;

  let internship;
  try {
    internship = await fetchInternship(slug);
  } catch {
    notFound();
  }

  const deadline = new Date(internship.applicationDeadline).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 sm:py-16">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex flex-wrap gap-2">
          <Badge>{internship.level}</Badge>
          <Badge variant="muted">{modeLabel[internship.mode] ?? internship.mode}</Badge>
          {internship.isPaid ? (
            <Badge variant="warning">Paid · ₹{internship.price}</Badge>
          ) : (
            <Badge variant="success">Free</Badge>
          )}
          <Badge variant="muted">{internship.category}</Badge>
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          {internship.title}
        </h1>
        <p className="text-lg text-muted leading-relaxed">{internship.description}</p>
        <div className="flex flex-wrap items-center gap-5 text-sm text-muted">
          <span className="flex items-center gap-1.5">
            <Clock className="h-4 w-4" aria-hidden="true" />
            {internship.durationWeeks} weeks
          </span>
          <span className="flex items-center gap-1.5">
            <MapPin className="h-4 w-4" aria-hidden="true" />
            {modeLabel[internship.mode] ?? internship.mode}
          </span>
          <span className="flex items-center gap-1.5">
            <Calendar className="h-4 w-4" aria-hidden="true" />
            Apply by {deadline}
          </span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {internship.technologies.map((t) => (
            <span
              key={t}
              className="rounded-md bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary"
            >
              {t}
            </span>
          ))}
        </div>
        {/* Apply CTA */}
        <div className="flex gap-3 pt-2">
          <Button href="/register" size="lg">
            Apply now
          </Button>
          <Button href="/login" variant="outline" size="lg">
            Log in to apply
          </Button>
        </div>
      </div>

      <div className="mt-12 grid gap-8 lg:grid-cols-3">
        {/* Main content */}
        <div className="space-y-8 lg:col-span-2">
          {internship.whatYouLearn.length > 0 && (
            <section aria-labelledby="learn-heading">
              <h2 id="learn-heading" className="text-xl font-semibold text-foreground">
                What you will learn
              </h2>
              <ul className="mt-4 space-y-2">
                {internship.whatYouLearn.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm text-foreground">
                    <CheckCircle2
                      className="mt-0.5 h-4 w-4 shrink-0 text-accent"
                      aria-hidden="true"
                    />
                    {item}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {internship.weeklyCurriculum.length > 0 && (
            <section aria-labelledby="curriculum-heading">
              <h2 id="curriculum-heading" className="text-xl font-semibold text-foreground">
                Weekly curriculum
              </h2>
              <div className="mt-4 space-y-3">
                {internship.weeklyCurriculum.map((w) => (
                  <Card key={w.week}>
                    <CardHeader>
                      <CardTitle className="text-sm">
                        Week {w.week}: {w.title}
                      </CardTitle>
                    </CardHeader>
                    {w.topics.length > 0 && (
                      <CardContent>
                        <div className="flex flex-wrap gap-1.5">
                          {w.topics.map((t) => (
                            <span
                              key={t}
                              className="rounded bg-background px-2 py-0.5 text-xs text-muted border border-border"
                            >
                              {t}
                            </span>
                          ))}
                        </div>
                      </CardContent>
                    )}
                  </Card>
                ))}
              </div>
            </section>
          )}

          {internship.faqs.length > 0 && (
            <section aria-labelledby="faq-heading">
              <h2 id="faq-heading" className="text-xl font-semibold text-foreground">
                FAQs
              </h2>
              <div className="mt-4 space-y-3">
                {internship.faqs.map((faq) => (
                  <Card key={faq.question}>
                    <CardHeader>
                      <CardTitle className="text-sm">{faq.question}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted">{faq.answer}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Sidebar */}
        <aside className="space-y-5">
          {internship.skillsRequired.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Skills required</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-1.5">
                  {internship.skillsRequired.map((s) => (
                    <span
                      key={s}
                      className="rounded-md border border-border px-2 py-0.5 text-xs text-foreground"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {internship.eligibility && (
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Eligibility</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted">{internship.eligibility}</p>
              </CardContent>
            </Card>
          )}

          {internship.projectInfo && (
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Capstone project</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted">{internship.projectInfo}</p>
              </CardContent>
            </Card>
          )}

          {internship.mentorshipInfo && (
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Mentorship</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted">{internship.mentorshipInfo}</p>
              </CardContent>
            </Card>
          )}

          {internship.assessmentInfo && (
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Assessment</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted">{internship.assessmentInfo}</p>
              </CardContent>
            </Card>
          )}
        </aside>
      </div>
    </div>
  );
}
