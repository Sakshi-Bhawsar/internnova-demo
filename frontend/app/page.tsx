import {
  BookOpen,
  Briefcase,
  CheckCircle2,
  Code2,
  LineChart,
  ShieldCheck,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ProgressBar } from "@/components/ui/progress-bar";
import { InternshipCard } from "@/components/internships/internship-card";
import { fetchInternships } from "@/services/internship.service";

export const metadata = {
  title: "Internova — Learn. Build. Intern. Get Career Ready.",
  description:
    "Practical internships, real-world projects, mentorship and verified proof of your skills — for students and recent graduates in India.",
};

const steps = [
  {
    title: "Learn",
    description: "Structured curriculum and resources aligned to real industry skills.",
    icon: BookOpen,
  },
  {
    title: "Build",
    description: "Hands-on tasks and a capstone project you can show employers.",
    icon: Code2,
  },
  {
    title: "Intern",
    description: "Guided internship experience with milestones and mentor feedback.",
    icon: Briefcase,
  },
  {
    title: "Get verified",
    description: "Earn a verifiable certificate backed by your completed work.",
    icon: ShieldCheck,
  },
];

const categories = [
  "Web Development",
  "Backend & APIs",
  "Data & Analytics",
  "UI/UX Design",
  "Digital Marketing",
  "Cloud & DevOps",
];

const faqs = [
  {
    q: "Is a job guaranteed?",
    a: "No. Internova focuses on skills, projects, and verifiable proof of work — not placement guarantees.",
  },
  {
    q: "Who can apply?",
    a: "Students and recent graduates in India who meet each program's eligibility requirements.",
  },
  {
    q: "How do certificates work?",
    a: "Certificates are issued when you meet program criteria and carry a unique public verification ID.",
  },
];

async function FeaturedInternships() {
  try {
    const { data } = await fetchInternships({ featured: "true", limit: 3 });
    if (data.length === 0) return null;
    return (
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
        <h2 className="text-center text-2xl font-bold text-foreground sm:text-3xl">
          Featured programs
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-center text-muted">
          Structured internships with real deliverables, mentor feedback, and verifiable certificates.
        </p>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {data.map((i) => (
            <InternshipCard key={i._id} internship={i} />
          ))}
        </div>
        <p className="mt-8 text-center">
          <Button href="/internships" variant="secondary">
            View all programs
          </Button>
        </p>
      </section>
    );
  } catch {
    return null;
  }
}

export default function Home() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border bg-gradient-to-b from-primary/5 via-background to-background">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24 lg:py-28">
          <div className="mx-auto max-w-3xl text-center">
            <Badge variant="accent" className="mb-6">
              Practical careers, not certificates for sale
            </Badge>
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              Learn. Build. Intern.
              <span className="mt-2 block text-primary">Get Career Ready.</span>
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-muted sm:text-xl">
              Practical internships, real-world projects, mentorship and verified proof of your
              skills — for students and recent graduates in India.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Button href="/internships" size="lg">
                Explore Internships
              </Button>
              <Button href="/register" variant="outline" size="lg">
                Get Started
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Value prop */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
        <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
          <div>
            <h2 className="text-2xl font-bold text-foreground sm:text-3xl">
              Build real skills. Prove what you can do.
            </h2>
            <p className="mt-4 leading-relaxed text-muted">
              Internova is built for students who want more than theory — structured internships
              with tasks, projects, assessments, and mentor feedback so your portfolio speaks for
              itself.
            </p>
            <ul className="mt-6 space-y-3 text-sm text-foreground">
              {[
                "Real project deliverables, not filler assignments",
                "Progress tracking across every internship stage",
                "Public certificate verification with unique IDs",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <CheckCircle2
                    className="mt-0.5 h-5 w-5 shrink-0 text-accent"
                    aria-hidden="true"
                  />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <Card className="border-primary/10 bg-gradient-to-br from-card to-primary/[0.03]">
            <CardHeader>
              <CardTitle>Your internship journey</CardTitle>
              <CardDescription>Example progress on an active program</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <ProgressBar label="Overall progress" value={70} />
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="rounded-lg bg-background p-3">
                  <p className="text-muted">Pending tasks</p>
                  <p className="text-2xl font-bold text-foreground">3</p>
                </div>
                <div className="rounded-lg bg-background p-3">
                  <p className="text-muted">Project</p>
                  <p className="font-semibold text-accent">In progress</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* How it works */}
      <section className="border-y border-border bg-card/50 py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <h2 className="text-center text-2xl font-bold text-foreground sm:text-3xl">
            How it works
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-center text-muted">
            From signup to verified certificate — a clear path designed for learning and
            accountability.
          </p>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((step, index) => (
              <Card key={step.title} className="relative">
                <span className="absolute -top-3 left-4 flex h-7 w-7 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                  {index + 1}
                </span>
                <CardHeader className="pt-4">
                  <step.icon className="mb-2 h-8 w-8 text-primary" aria-hidden="true" />
                  <CardTitle className="text-base">{step.title}</CardTitle>
                  <CardDescription>{step.description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
        <h2 className="text-center text-2xl font-bold text-foreground sm:text-3xl">
          Internship categories
        </h2>
        <div className="mt-10 flex flex-wrap justify-center gap-3">
          {categories.map((cat) => (
            <Button key={cat} href={`/internships?category=${encodeURIComponent(cat)}`} variant="outline" size="sm">
              {cat}
            </Button>
          ))}
        </div>
      </section>

      {/* Featured internships from API */}
      <FeaturedInternships />

      {/* Mentorship CTA */}
      <section className="border-t border-border bg-primary py-16 text-primary-foreground sm:py-20">
        <div className="mx-auto max-w-6xl px-4 text-center sm:px-6">
          <Users className="mx-auto h-10 w-10 opacity-90" aria-hidden="true" />
          <h2 className="mt-4 text-2xl font-bold sm:text-3xl">
            Mentorship that focuses on your work
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-primary-foreground/85">
            Get feedback on tasks and projects, guidance on problem-solving, and honest career
            advice — without inflated placement claims.
          </p>
          <Button
            href="/mentorship"
            variant="outline"
            className="mt-8 border-white/30 bg-white/10 text-white hover:bg-white/20"
          >
            Learn about mentorship
          </Button>
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
        <div className="grid gap-8 lg:grid-cols-3">
          {[
            {
              icon: LineChart,
              title: "Track progress",
              text: "See where you are across orientation, tasks, project, and assessment stages.",
            },
            {
              icon: ShieldCheck,
              title: "Verified certificates",
              text: "Unique certificate IDs and a public verification page — share proof employers can trust.",
            },
            {
              icon: Briefcase,
              title: "Career readiness",
              text: "Finish with skills, a project, and evidence of work — not empty promises.",
            },
          ].map((item) => (
            <Card key={item.title}>
              <CardHeader>
                <item.icon className="h-8 w-8 text-accent" aria-hidden="true" />
                <CardTitle className="text-lg">{item.title}</CardTitle>
                <CardDescription>{item.text}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </section>

      {/* FAQ teaser */}
      <section className="border-y border-border bg-card/50 py-16 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <h2 className="text-center text-2xl font-bold text-foreground sm:text-3xl">
            Common questions
          </h2>
          <div className="mt-8 space-y-4">
            {faqs.map((faq) => (
              <Card key={faq.q}>
                <CardHeader>
                  <CardTitle className="text-base">{faq.q}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted">{faq.a}</p>
                </CardContent>
              </Card>
            ))}
          </div>
          <p className="mt-6 text-center">
            <Button href="/faq" variant="outline">
              View all FAQs
            </Button>
          </p>
        </div>
      </section>

      {/* Final CTA */}
      <section className="border-t border-border bg-card py-16 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
          <h2 className="text-2xl font-bold text-foreground sm:text-3xl">
            Ready to start building?
          </h2>
          <p className="mt-4 text-muted">
            Create your student profile, explore internships, and apply when you find the right
            fit. No job guarantees — just a serious path to grow.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Button href="/register" size="lg">
              Create free account
            </Button>
            <Button href="/faq" variant="outline" size="lg">
              Read FAQ
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
