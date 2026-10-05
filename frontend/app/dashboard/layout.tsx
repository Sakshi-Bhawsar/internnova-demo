"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth-context";
import { DashboardSidebar } from "@/components/dashboard/sidebar";
import { Loader } from "@/components/states/loader";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login?redirect=/dashboard");
    } else if (!loading && user && user.role !== "STUDENT") {
      router.replace("/");
    }
  }, [user, loading, router]);

  if (loading) return <Loader fullScreen message="Loading dashboard…" />;
  if (!user || user.role !== "STUDENT") return null;

  return (
    <div className="flex min-h-screen flex-col lg:flex-row">
      <DashboardSidebar />
      <main className="flex-1 overflow-y-auto bg-background">
        {children}
      </main>
    </div>
  );
}
