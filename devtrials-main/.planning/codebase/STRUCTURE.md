# Structure: apps/web

## Directory Map

```
apps/web/
├── public/                 # Static assets (images, fonts, favicons)
├── src/
│   ├── app/                # Next.js App Router (16.2.1)
│   │   ├── (auth)/         # Authentication route group (SignIn, SignUp)
│   │   ├── (dashboard)/    # Main logged-in application shell
│   │   │   ├── dashboard/   # Raju's core view (Metrics, Triggers)
│   │   │   ├── triggers/    # Detailed parametric trigger history
│   │   │   ├── zones/       # Geographical monitor & registration
│   │   │   └── layout.tsx   # Dashboard-specific navigation and sidebar
│   │   ├── globals.css     # Global styles, Tailwind, and CSS variables
│   │   ├── layout.tsx      # Root layout, ClerkProvider, TooltipProvider
│   │   └── page.tsx        # Public landing page (Hero, Stats, CTA)
│   ├── components/
│   │   ├── ui/             # Radix/Shadcn primitive components
│   │   ├── app-header.tsx  # Dashboard top navigation
│   │   ├── app-sidebar.tsx # Dashboard left navigation
│   │   ├── HeroShield.tsx  # Three.js hero section
│   │   ├── StatsCard.tsx   # Metric display card
│   │   └── RiskMap.tsx     # Leaflet map container
│   ├── hooks/              # Custom React hooks (useTriggers, useZones)
│   ├── lib/
│   │   ├── api.ts          # Central API fetcher with mock resilience
│   │   └── utils.ts        # Tailwind merge and classname utilities
│   └── proxy.ts            # (Optional) proxy or server-side utility
├── components.json         # Shadcn UI configuration
├── next.config.ts          # Next.js configuration
├── package.json            # Tooling and dependencies
└── tsconfig.json           # TypeScript configuration
```

## Naming Conventions
- **Pages**: `page.tsx` (standard App Router).
- **Components**: PascalCase (e.g., `RiskMap.tsx`).
- **Styles**: `globals.css` (centralized style sheet).
- **Route Groups**: Parentheses (e.g., `(dashboard)`).
