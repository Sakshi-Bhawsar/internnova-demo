"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Briefcase, FileText, User } from "lucide-react";
import { useAuth } from "@/context/auth-context";
import { fetchStudentProfile } from "@/services/student.service";
import type { StudentProfileResponse } from "@/types/student";
import { ProgressBar } from "@/components/ui/progress-bar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader } from "@/components/states/loader";
import { ErrorState } from "@/components/states/error-state";

export default function DashboardPage() {
  const { user } = useAuth();
  const [data, setData] = useState<StudentProfileResponse | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetchStudentProfile()
      .then(setData)
      .catch(() => setError(true));
  }, []);

  if (!data && !error) return <Loader fullScreen message="Loading…" />;

  const completion = data?.completionPercentage ?? 0;
  const firstName = user?.fullName?.split(" ")[0] ?? "there";

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 sm:py-10">
      {/* Welcome */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground sm:text-3xl">
          Welcome back, {firstName} 👋
        </h1>
        <p className="mt-1 text-muted">Here is a summary of your Internova activity.</p>
      </div>

      {error && (
        <ErrorState
          message="Could not load profile data. Is the backend running?"
          className="mb-8"
        />
      )}

      {/* Profile completion */}
      {data && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-base">Profile completion</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <ProgressBar value={completion} label="Profile completion" />
            {completion < 100 && (
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted">
                  Complete your profile to improve your application visibility.
                </p>
                <Button href="/dashboard/profile" variant="outline" size="sm">
                  Complete profile
                  <ArrowRight className="ml-1.5 h-3.5 w-3.5" aria-hidden="true" />
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Quick stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-primary" aria-hidden="true" />
              <CardTitle className="text-sm">Profile</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-foreground">{completion}%</p>
            <p className="text-xs text-muted mt-1">Complete</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Briefcase className="h-4 w-4 text-accent" aria-hidden="true" />
              <CardTitle className="text-sm">Applications</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-foreground">—</p>
            <p className="text-xs text-muted mt-1">
              <Link href="/internships" className="text-primary hover:underline">
                Browse internships
              </Link>
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-muted" aria-hidden="true" />
              <CardTitle className="text-sm">Active internships</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-foreground">—</p>
            <p className="text-xs text-muted mt-1">Phase 7+</p>
          </CardContent>
        </Card>
      </div>

      {/* Profile snapshot */}
      {data && (
        <Card className="mt-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Profile snapshot</CardTitle>
              <Button href="/dashboard/profile" variant="ghost" size="sm">
                Edit
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <dl className="grid gap-3 sm:grid-cols-2 text-sm">
              {[
                { label: "Name", value: data.user.fullName },
                { label: "Email", value: data.user.email },
                { label: "College", value: data.user.college },
                { label: "Graduation year", value: data.user.graduationYear?.toString() },
                { label: "Location", value: data.profile.location },
                { label: "Degree", value: data.profile.degree },
              ].map(({ label, value }) => (
                <div key={label}>
                  <dt className="text-muted">{label}</dt>
                  <dd className="font-medium text-foreground">{value ?? <span className="text-muted italic">Not set</span>}</dd>
                </div>
              ))}
            </dl>
            {data.profile.skills.length > 0 && (
              <div className="mt-4">
                <p className="text-sm text-muted mb-2">Skills</p>
                <div className="flex flex-wrap gap-1.5">
                  {data.profile.skills.map((s) => (
                    <span
                      key={s}
                      className="rounded-md bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
