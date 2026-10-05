import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const statusMap: Record<
  string,
  { label: string; variant: React.ComponentProps<typeof Badge>["variant"] }
> = {
  APPLIED: { label: "Applied", variant: "default" },
  UNDER_REVIEW: { label: "Under review", variant: "warning" },
  ACCEPTED: { label: "Accepted", variant: "success" },
  REJECTED: { label: "Rejected", variant: "danger" },
  WITHDRAWN: { label: "Withdrawn", variant: "muted" },
  PENDING: { label: "Pending", variant: "warning" },
  IN_PROGRESS: { label: "In progress", variant: "accent" },
  SUBMITTED: { label: "Submitted", variant: "default" },
  APPROVED: { label: "Approved", variant: "success" },
  REVISION_REQUIRED: { label: "Revision required", variant: "warning" },
  VALID: { label: "Valid", variant: "success" },
  REVOKED: { label: "Revoked", variant: "danger" },
  DRAFT: { label: "Draft", variant: "muted" },
  PUBLISHED: { label: "Published", variant: "success" },
};

export interface StatusBadgeProps {
  status: string;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const key = status.toUpperCase().replace(/\s+/g, "_");
  const config = statusMap[key] ?? {
    label: status.replace(/_/g, " ").toLowerCase(),
    variant: "muted" as const,
  };

  return (
    <Badge variant={config.variant} className={cn("capitalize", className)}>
      {config.label}
    </Badge>
  );
}
