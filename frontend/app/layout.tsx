import type { Metadata } from "next";
import "./globals.css";
import { SiteShell } from "@/components/layout/site-shell";
import { AuthProvider } from "@/context/auth-context";

export const metadata: Metadata = {
  title: {
    default: "Internova — Learn. Build. Intern. Get Career Ready.",
    template: "%s | Internova",
  },
  description:
    "Practical internships, real-world projects, mentorship and verified proof of your skills for students in India.",
  openGraph: {
    title: "Internova — Learn. Build. Intern. Get Career Ready.",
    description:
      "Practical internships, real-world projects, mentorship and verified proof of your skills.",
    type: "website",
    locale: "en_IN",
    siteName: "Internova",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="flex min-h-full flex-col">
        <AuthProvider>
          <SiteShell>{children}</SiteShell>
        </AuthProvider>
      </body>
    </html>
  );
}
