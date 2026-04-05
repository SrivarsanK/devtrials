# Production Stabilization & Deployment Guide

This guide outlines the steps needed to resolve the **Internal Server Error (500)** in production and ensure overall stability for the RideSuraksha suite.

## 1. Resolving Internal Server Error (500)
The primary cause of the 500 error in `app-dashboard` is the **Backend Proxy URL** being misconfigured.

### The Cause
*   The dashboard uses a "Rewrite" feature in `next.config.ts` to proxy `/api/` requests to your backend.
*   By default, this points to `http://localhost:3005`.
*   In production on Vercel, `localhost` does not exist, so the proxy fails with a network error, causing Next.js to return a **500 ISE**.

### The Fix
1.  **Deploy the backend** first (if not already live). Get its Vercel URL (e.g., `https://ridesuraksha-backend.vercel.app`).
2.  Go to the **Vercel Dashboard** for your `app-dashboard` project.
3.  Navigate to **Settings > Environment Variables**.
4.  Add a new variable:
    *   **Key**: `NEXT_PUBLIC_API_URL`
    *   **Value**: `https://ridesuraksha-backend.vercel.app` (your actual backend URL)
5.  **Redeploy** the `app-dashboard`.
    > [!IMPORTANT]
    > Do the same for `user-dashboard`.

## 2. Global Port Standard (Local Dev)
To prevent `EADDRINUSE` errors, use the following standardized ports:

| Project | Port | Description |
| :--- | :--- | :--- |
| `web` | `3000` | Landing Page & Auth |
| `app-dashboard` | `3001` | Insurer Portal |
| `user-dashboard` | `3002` | Policyholder Portal |
| `backend` | `3005` | Core API |

### Port Reset Utility
If you see "Port already in use", run:
```bash
pnpm kill-ports
```

## 3. Monorepo Cleanliness
I have unified the dependency management across the monorepo:
*   Removed redundant `pnpm-lock.yaml` and `package-lock.json` from subfolders.
*   Harmonized Next.js (`16.2.2`) and TypeScript (`^5`) versions.
*   Running `pnpm install` in the **root** folder is now the only required step to sync all apps.

## 4. Environment Variables Checklist
Ensure these are set in Vercel for the respective dashboards:

| Variable | Recommended Value |
| :--- | :--- |
| `NEXT_PUBLIC_API_URL` | Live Backend URL |
| `NEXT_PUBLIC_SOCKET_URL` | Live Backend URL |
| `NEXT_PUBLIC_USE_MOCK` | `false` (set to `true` to test UI without backend) |

---
> [!TIP]
> If you encounter build failures related to "frozen lockfile", I have updated the `pnpm-lock.yaml` locally. Ensure you commit this file to your repository before the next deployment.
