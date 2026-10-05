import Link from "next/link";
import { GraduationCap } from "lucide-react";

const footerLinks = {
  Platform: [
    { href: "/internships", label: "Browse Internships" },
    { href: "/mentorship", label: "Mentorship" },
    { href: "/verify", label: "Verify Certificate" },
  ],
  Company: [
    { href: "/about", label: "About Us" },
    { href: "/for-companies", label: "For Companies" },
    { href: "/contact", label: "Contact" },
  ],
  Legal: [
    { href: "/faq", label: "FAQ" },
    { href: "/faq#refund", label: "Refund Policy" },
  ],
};

export function Footer() {
  return (
    <footer className="mt-auto border-t border-border bg-card">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div className="sm:col-span-2 lg:col-span-1">
            <Link href="/" className="inline-flex items-center gap-2 font-bold text-primary">
              <GraduationCap className="h-6 w-6" aria-hidden="true" />
              Internova
            </Link>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-muted">
              Build real skills. Work on real projects. Prove what you can do —
              practical internships for students in India.
            </p>
          </div>
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h3 className="text-sm font-semibold text-foreground">{title}</h3>
              <ul className="mt-3 space-y-2">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted transition-colors hover:text-primary"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-border pt-8 text-sm text-muted sm:flex-row">
          <p>&copy; {new Date().getFullYear()} Internova. All rights reserved.</p>
          <p className="text-center sm:text-right">
            No guaranteed placement. Honest learning and proof of work.
          </p>
        </div>
      </div>
    </footer>
  );
}
