import { apiClient } from '@/lib/api';
import type {
  StudentProfileResponse,
  UpdateStudentProfilePayload,
} from '@/types/student';

export async function fetchStudentProfile(): Promise<StudentProfileResponse> {
  const res = await apiClient<StudentProfileResponse>('/students/profile');
  return res.data!;
}

export async function updateStudentProfile(
  payload: UpdateStudentProfilePayload
): Promise<StudentProfileResponse> {
  const res = await apiClient<StudentProfileResponse>('/students/profile', {
    method: 'PUT',
    body: JSON.stringify(payload),
  });
  return res.data!;
}

export async function uploadResume(file: File): Promise<{ resumeUrl: string; completionPercentage: number }> {
  const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5000/api';
  const { getToken } = await import('@/lib/auth');
  const token = getToken();

  const form = new FormData();
  form.append('resume', file);

  const res = await fetch(`${API_BASE}/students/resume`, {
    method: 'POST',
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body: form,
    credentials: 'include',
  });

  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.message ?? 'Upload failed');
  }
  return data.data;
}
