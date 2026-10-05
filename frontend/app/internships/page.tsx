import type { Metadata } from "next";
import { Suspense } from "react";
import { Briefcase } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { EmptyState } from "@/components/states/empty-state";
import { ErrorState } from "@/components/states/error-state";
import { Loader } from "@/components/states/loader";
import { InternshipCard } from "@/components/internships/internship-card";
import { InternshipFilters } from "@/components/internships/internship-filters";
import { PaginationControls } from "@/components/internships/pagination-controls";
import { fetchInternships } from "@/services/internship.service";
import type { InternshipListParams } from "@/types/internship";

export const metadata: Metadata = {
  title: "Internships",
  description:
    "Browse practical internship programs on Internova — filter by category, mode, level, and more.",
};

interface PageProps {
  searchParams: Promise<Record<string, string>>;
}

async function InternshipGrid({ searchParams }: { searchParams: Record<string, string> }) {
  const params: InternshipListParams = {
    page: searchParams.page ? Number(searchParams.page) : 1,
    search: searchParams.search,
    category: searchParams.category,
    mode: searchParams.mode as InternshipListParams["mode"],
    level: searchParams.level as InternshipListParams["level"],
    paid: searchParams.paid as InternshipListParams["paid"],
    sort: (searchParams.sort as InternshipListParams["sort"]) ?? "newest",
  };

  let result;
  try {
    result = await fetchInternships(params);
  } catch {
    return <ErrorState message="Could not load internships. Is the backend running?" />;
  }

  const { data, pagination } = result;

  if (data.length === 0) {
    return (
      <EmptyState
        title="No internships found"
        description="Try adjusting your filters or check back soon."
        icon={<Briefcase className="h-6 w-6" aria-hidden="true" />}
        actionLabel="Clear filters"
        actionHref="/internships"
      />
    );
  }

  return (
    <>
      <p className="text-sm text-muted">
        {pagination.total} program{pagination.total !== 1 ? "s" : ""} found
      </p>
      <div className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {data.map((internship) => (
          <InternshipCard key={internship._id} internship={internship} />
        ))}
      </div>
      <PaginationControls
        page={pagination.page}
        totalPages={pagination.totalPages}
        className="mt-10"
      />
    </>
  );
}

export default async function InternshipsPage({ searchParams }: PageProps) {
  const sp = await searchParams;
  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
      <PageHeader
        eyebrow="Discover programs"
        title="Internship programs"
        description="Structured internships with tasks, projects, mentorship, and verifiable certificates."
      />
      <div className="mt-10">
        <Suspense>
          <InternshipFilters />
        </Suspense>
      </div>
      <div className="mt-8">
        <Suspense fallback={<Loader message="Loading internships…" />}>
          <InternshipGrid searchParams={sp} />
        </Suspense>
      </div>
    </div>
  );
}
