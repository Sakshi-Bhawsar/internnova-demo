import { EmptyState } from "@/components/states/empty-state";
import { FileText } from "lucide-react";

export default function MyInternshipsPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 sm:py-10">
      <h1 className="mb-6 text-2xl font-bold text-foreground">My Internships</h1>
      <EmptyState
        title="Active internships coming in Phase 7"
        description="Once you are accepted into a program, your active internship progress will appear here."
        icon={<FileText className="h-6 w-6" aria-hidden="true" />}
        actionLabel="Browse internships"
        actionHref="/internships"
      />
    </div>
  );
}
