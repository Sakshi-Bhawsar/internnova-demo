"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";

const CATEGORIES = [
  "Web Development",
  "Backend & APIs",
  "Data & Analytics",
  "UI/UX Design",
  "Digital Marketing",
  "Cloud & DevOps",
];

export function InternshipFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const update = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
      params.delete("page");
      router.push(`${pathname}?${params.toString()}`);
    },
    [router, pathname, searchParams]
  );

  return (
    <div className="flex flex-wrap gap-3">
      <Input
        placeholder="Search internships…"
        defaultValue={searchParams.get("search") ?? ""}
        className="w-full sm:w-64"
        onChange={(e) => {
          const v = e.target.value;
          const t = setTimeout(() => update("search", v), 400);
          return () => clearTimeout(t);
        }}
        aria-label="Search internships"
      />
      <Select
        defaultValue={searchParams.get("category") ?? ""}
        onChange={(e) => update("category", e.target.value)}
        className="w-full sm:w-48"
        aria-label="Filter by category"
      >
        <option value="">All categories</option>
        {CATEGORIES.map((c) => (
          <option key={c} value={c}>{c}</option>
        ))}
      </Select>
      <Select
        defaultValue={searchParams.get("mode") ?? ""}
        onChange={(e) => update("mode", e.target.value)}
        className="w-full sm:w-36"
        aria-label="Filter by mode"
      >
        <option value="">Any mode</option>
        <option value="REMOTE">Remote</option>
        <option value="HYBRID">Hybrid</option>
        <option value="ONSITE">On-site</option>
      </Select>
      <Select
        defaultValue={searchParams.get("level") ?? ""}
        onChange={(e) => update("level", e.target.value)}
        className="w-full sm:w-40"
        aria-label="Filter by level"
      >
        <option value="">Any level</option>
        <option value="BEGINNER">Beginner</option>
        <option value="INTERMEDIATE">Intermediate</option>
        <option value="ADVANCED">Advanced</option>
      </Select>
      <Select
        defaultValue={searchParams.get("paid") ?? ""}
        onChange={(e) => update("paid", e.target.value)}
        className="w-full sm:w-32"
        aria-label="Filter by cost"
      >
        <option value="">Free &amp; paid</option>
        <option value="false">Free only</option>
        <option value="true">Paid only</option>
      </Select>
      <Select
        defaultValue={searchParams.get("sort") ?? "newest"}
        onChange={(e) => update("sort", e.target.value)}
        className="w-full sm:w-36"
        aria-label="Sort by"
      >
        <option value="newest">Newest</option>
        <option value="oldest">Oldest</option>
        <option value="deadline">Deadline</option>
      </Select>
    </div>
  );
}
