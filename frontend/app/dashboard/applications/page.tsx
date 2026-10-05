import { EmptyState } from "@/components/states/empty-state";
import { Briefcase } from "lucide-react";

export default function ApplicationsPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 sm:py-10">
      <h1 className="mb-6 text-2xl font-bold text-foreground">Applications</h1>
      <EmptyState
        title="Applications coming in Phase 7"
        description="Your internship applications will appear here once the applications system is built."
        icon={<Briefcase className="h-6 w-6" aria-hidden="true" />}
        actionLabel="Browse internships"
        actionHref="/internships"
      />
    </div>
  );
}
