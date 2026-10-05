import Link from 'next/link';
import { Clock, MapPin } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { InternshipSummary } from '@/types/internship';

const levelVariant: Record<string, 'default' | 'accent' | 'warning'> = {
  BEGINNER: 'default',
  INTERMEDIATE: 'accent',
  ADVANCED: 'warning',
};

const modeLabel: Record<string, string> = {
  REMOTE: 'Remote',
  HYBRID: 'Hybrid',
  ONSITE: 'On-site',
};

export function InternshipCard({ internship }: { internship: InternshipSummary }) {
  const deadline = new Date(internship.applicationDeadline);
  const deadlineStr = deadline.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  return (
    <Link
      href={`/internships/${internship.slug}`}
      className="group block rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
    >
      <Card className="h-full transition-shadow group-hover:shadow-md">
        <CardHeader>
          <div className="mb-2 flex flex-wrap items-center gap-2">
            <Badge variant={levelVariant[internship.level] ?? 'default'}>{internship.level}</Badge>
            <Badge variant="muted">{modeLabel[internship.mode] ?? internship.mode}</Badge>
            {internship.isPaid ? (
              <Badge variant="warning">Paid · ₹{internship.price}</Badge>
            ) : (
              <Badge variant="success">Free</Badge>
            )}
          </div>
          <CardTitle className="text-base leading-snug transition-colors group-hover:text-primary">
            {internship.title}
          </CardTitle>
          <CardDescription className="line-clamp-2">{internship.description}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex flex-wrap gap-1.5">
            {internship.technologies.slice(0, 4).map((t) => (
              <span
                key={t}
                className="rounded-md bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary"
              >
                {t}
              </span>
            ))}
            {internship.technologies.length > 4 && (
              <span className="rounded-md bg-primary/10 px-2 py-0.5 text-xs text-muted">
                +{internship.technologies.length - 4}
              </span>
            )}
          </div>
          <div className="flex items-center gap-4 text-xs text-muted">
            <span className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" aria-hidden="true" />
              {internship.durationWeeks}w
            </span>
            <span className="flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
              {internship.category}
            </span>
          </div>
          <p className="text-xs text-muted">Deadline: {deadlineStr}</p>
        </CardContent>
      </Card>
    </Link>
  );
}
