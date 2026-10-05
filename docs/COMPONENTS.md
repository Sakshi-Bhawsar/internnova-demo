# Internova Frontend — Design System (Phase 2)

## Tokens

Defined in `frontend/app/globals.css`:

- **Primary:** indigo `#3730a3`
- **Accent:** teal `#0d9488`
- **Background / card / border / muted** for surfaces and text hierarchy

## Utilities

- `cn()` — `frontend/lib/utils.ts` (clsx + tailwind-merge)

## UI (`components/ui/`)

| Component | Usage |
|-----------|--------|
| `Button` | Variants: primary, secondary, outline, ghost, destructive. Use `href` for links. |
| `Input`, `Textarea`, `Select`, `Label` | Forms; pass `error` for validation state |
| `Card` | Content containers with header/title/description |
| `Badge` | Tags and labels |
| `ProgressBar` | `value` 0–100, optional label |
| `Spinner` / `Loader` | Loading states |
| `Modal` | Client component; controlled with `open` / `onClose` |

## Layout (`components/layout/`)

- `Navbar` — sticky header, mobile menu (hidden on dashboard routes)
- `Footer` — site footer
- `SiteShell` — wraps public pages with navbar + footer
- `PageHeader` — inner page titles

## States (`components/states/`)

- `Loader`, `EmptyState`, `ErrorState`

## Shared (`components/shared/`)

- `StatusBadge` — application/task status mapping
- `Pagination` — client-side page controls
- `SearchBar` — controlled search input

## Icons

Lucide React (`lucide-react`)
