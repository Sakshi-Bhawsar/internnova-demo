"use client";

import { useEffect, useState, useRef, KeyboardEvent } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { X, Upload, FileText } from "lucide-react";
import { fetchStudentProfile, updateStudentProfile, uploadResume } from "@/services/student.service";
import type { StudentProfileResponse } from "@/types/student";
import { ProgressBar } from "@/components/ui/progress-bar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader } from "@/components/states/loader";
import { ErrorState } from "@/components/states/error-state";

const schema = z.object({
  fullName: z.string().min(2).max(120),
  phone: z.string().min(10).max(15).optional().or(z.literal("")),
  college: z.string().max(120).optional().or(z.literal("")),
  education: z.string().max(120).optional().or(z.literal("")),
  degree: z.string().max(120).optional().or(z.literal("")),
  location: z.string().max(120).optional().or(z.literal("")),
  bio: z.string().max(2000).optional().or(z.literal("")),
  github: z.string().url("Invalid URL").optional().or(z.literal("")),
  linkedin: z.string().url("Invalid URL").optional().or(z.literal("")),
  portfolio: z.string().url("Invalid URL").optional().or(z.literal("")),
});

type FormData = z.infer<typeof schema>;

export default function ProfilePage() {
  const [profileData, setProfileData] = useState<StudentProfileResponse | null>(null);
  const [loadError, setLoadError] = useState(false);
  const [skills, setSkills] = useState<string[]>([]);
  const [skillInput, setSkillInput] = useState("");
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [resumeStatus, setResumeStatus] = useState<"idle" | "uploading" | "done" | "error">("idle");
  const [resumeUrl, setResumeUrl] = useState<string | undefined>();
  const gradYearRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  useEffect(() => {
    fetchStudentProfile()
      .then((data) => {
        setProfileData(data);
        setSkills(data.profile.skills);
        setResumeUrl(data.profile.resumeUrl ?? undefined);
        reset({
          fullName: data.user.fullName,
          phone: data.user.phone ?? "",
          college: data.user.college ?? "",
          education: data.user.education ?? "",
          degree: data.profile.degree ?? "",
          location: data.profile.location ?? "",
          bio: data.profile.bio ?? "",
          github: data.profile.github ?? "",
          linkedin: data.profile.linkedin ?? "",
          portfolio: data.profile.portfolio ?? "",
        });
        if (gradYearRef.current && data.user.graduationYear) {
          gradYearRef.current.value = String(data.user.graduationYear);
        }
      })
      .catch(() => setLoadError(true));
  }, [reset]);

  function addSkill() {
    const s = skillInput.trim();
    if (s && !skills.includes(s) && skills.length < 30) {
      setSkills((prev) => [...prev, s]);
    }
    setSkillInput("");
  }

  function handleSkillKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addSkill();
    }
  }

  async function onSubmit(data: FormData) {
    setSaveStatus("saving");
    try {
      const gradYear = gradYearRef.current?.value;
      const updated = await updateStudentProfile({
        ...data,
        phone: data.phone || undefined,
        college: data.college || undefined,
        education: data.education || undefined,
        degree: data.degree || undefined,
        location: data.location || undefined,
        bio: data.bio || undefined,
        github: data.github || undefined,
        linkedin: data.linkedin || undefined,
        portfolio: data.portfolio || undefined,
        skills,
        graduationYear: gradYear ? Number(gradYear) : undefined,
      });
      setProfileData(updated);
      setSaveStatus("saved");
      setTimeout(() => setSaveStatus("idle"), 3000);
    } catch {
      setSaveStatus("error");
    }
  }

  async function handleResumeChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setResumeStatus("uploading");
    try {
      const result = await uploadResume(file);
      setResumeUrl(result.resumeUrl);
      setProfileData((prev) =>
        prev
          ? {
              ...prev,
              completionPercentage: result.completionPercentage,
              profile: { ...prev.profile, resumeUrl: result.resumeUrl, completionPercentage: result.completionPercentage },
            }
          : prev
      );
      setResumeStatus("done");
    } catch {
      setResumeStatus("error");
    }
  }

  if (!profileData && !loadError) return <Loader fullScreen message="Loading profile…" />;
  if (loadError) return <ErrorState message="Could not load profile. Is the backend running?" className="m-8" />;

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-10">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">My Profile</h1>
        <p className="mt-1 text-sm text-muted">Keep your profile up to date to improve application visibility.</p>
      </div>

      {profileData && (
        <Card className="mb-6">
          <CardContent className="py-5">
            <ProgressBar
              value={profileData.completionPercentage}
              label="Profile completion"
            />
          </CardContent>
        </Card>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Personal info */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Personal information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="fullName" required>Full name</Label>
                <Input id="fullName" error={!!errors.fullName} {...register("fullName")} />
                {errors.fullName && <p className="text-xs text-red-600">{errors.fullName.message}</p>}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="phone">Phone</Label>
                <Input id="phone" type="tel" placeholder="+91 98765 43210" {...register("phone")} />
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="college">College / University</Label>
                <Input id="college" placeholder="IIT Delhi" {...register("college")} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="graduationYear">Graduation year</Label>
                <input
                  id="graduationYear"
                  type="number"
                  placeholder="2026"
                  min={1990}
                  max={2040}
                  ref={gradYearRef}
                  className="flex h-11 w-full rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground shadow-sm placeholder:text-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                />
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="education">Degree / Programme</Label>
                <Input id="education" placeholder="B.Tech Computer Science" {...register("education")} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="degree">Specialisation</Label>
                <Input id="degree" placeholder="AI & ML" {...register("degree")} />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="location">Location</Label>
              <Input id="location" placeholder="Bengaluru, India" {...register("location")} />
            </div>
          </CardContent>
        </Card>

        {/* Bio */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">About you</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-1.5">
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                rows={4}
                placeholder="Tell mentors and admins a bit about yourself, your goals, and what you are working on…"
                {...register("bio")}
              />
              <p className="text-xs text-muted">Max 2000 characters</p>
            </div>
          </CardContent>
        </Card>

        {/* Skills */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Skills</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex gap-2">
              <Input
                placeholder="Type a skill and press Enter"
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={handleSkillKeyDown}
                aria-label="Add skill"
              />
              <Button type="button" variant="outline" onClick={addSkill}>
                Add
              </Button>
            </div>
            {skills.length > 0 && (
              <div className="flex flex-wrap gap-2" role="list" aria-label="Skills">
                {skills.map((s) => (
                  <span
                    key={s}
                    role="listitem"
                    className="flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary"
                  >
                    {s}
                    <button
                      type="button"
                      onClick={() => setSkills((prev) => prev.filter((x) => x !== s))}
                      className="ml-0.5 rounded-full hover:text-red-600 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary"
                      aria-label={`Remove ${s}`}
                    >
                      <X className="h-3 w-3" aria-hidden="true" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Links */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Links</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {(
              [
                { id: "github", label: "GitHub", placeholder: "https://github.com/username" },
                { id: "linkedin", label: "LinkedIn", placeholder: "https://linkedin.com/in/username" },
                { id: "portfolio", label: "Portfolio", placeholder: "https://yoursite.com" },
              ] as const
            ).map(({ id, label, placeholder }) => (
              <div key={id} className="space-y-1.5">
                <Label htmlFor={id}>{label}</Label>
                <Input
                  id={id}
                  type="url"
                  placeholder={placeholder}
                  error={!!errors[id]}
                  {...register(id)}
                />
                {errors[id] && <p className="text-xs text-red-600">{errors[id]?.message}</p>}
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Save */}
        <div className="flex items-center gap-3">
          <Button type="submit" disabled={saveStatus === "saving"}>
            {saveStatus === "saving" ? "Saving…" : "Save profile"}
          </Button>
          {saveStatus === "saved" && (
            <p className="text-sm text-emerald-600 font-medium">Saved ✓</p>
          )}
          {saveStatus === "error" && (
            <p className="text-sm text-red-600">Save failed. Please try again.</p>
          )}
        </div>
      </form>

      {/* Resume upload — separate from main form */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="text-base">Resume</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {resumeUrl && (
            <div className="flex items-center gap-2 rounded-lg border border-border bg-card/50 px-4 py-3">
              <FileText className="h-4 w-4 text-primary shrink-0" aria-hidden="true" />
              <a
                href={`http://localhost:5000${resumeUrl}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-primary hover:underline truncate"
              >
                {resumeUrl.split("/").pop()}
              </a>
            </div>
          )}
          <div>
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.doc,.docx"
              className="sr-only"
              onChange={handleResumeChange}
              aria-label="Upload resume"
            />
            <Button
              type="button"
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              disabled={resumeStatus === "uploading"}
            >
              <Upload className="mr-2 h-4 w-4" aria-hidden="true" />
              {resumeStatus === "uploading"
                ? "Uploading…"
                : resumeUrl
                ? "Replace resume"
                : "Upload resume"}
            </Button>
            {resumeStatus === "done" && (
              <p className="mt-2 text-sm text-emerald-600">Resume uploaded ✓</p>
            )}
            {resumeStatus === "error" && (
              <p className="mt-2 text-sm text-red-600">Upload failed. PDF, DOC, DOCX only (max {process.env.NEXT_PUBLIC_MAX_FILE_MB ?? 5}MB).</p>
            )}
            <p className="mt-1.5 text-xs text-muted">PDF, DOC, or DOCX. Max 5 MB.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
