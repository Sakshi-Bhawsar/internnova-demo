import type { Metadata } from "next";

export const metadata: Metadata = { title: "Mentor Dashboard" };

export default function MentorDashboardPage() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">Mentor Dashboard</h1>
      <p className="mt-2 text-muted">Mentor dashboard — Phase 5</p>
    </div>
  );
}
