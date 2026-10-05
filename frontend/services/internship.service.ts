import { apiClient } from '@/lib/api';
import type { InternshipDetail, InternshipListParams, InternshipSummary } from '@/types/internship';

export interface InternshipListResponse {
  data: InternshipSummary[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export async function fetchInternships(
  params: InternshipListParams = {}
): Promise<InternshipListResponse> {
  const qs = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== '') qs.set(k, String(v));
  });
  const res = await apiClient<InternshipSummary[]>(
    `/internships?${qs.toString()}`,
    {},
    false
  );
  return {
    data: (res.data as unknown as InternshipSummary[]) ?? [],
    pagination: res.pagination ?? { page: 1, limit: 12, total: 0, totalPages: 0 },
  };
}

export async function fetchInternship(slugOrId: string): Promise<InternshipDetail> {
  const res = await apiClient<InternshipDetail>(`/internships/${slugOrId}`, {}, false);
  return res.data!;
}
