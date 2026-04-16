"use client";

import { useUser } from "@clerk/nextjs";
import { useMutation, useConvexAuth } from "convex/react";
import { useEffect, useState } from "react";
import { api } from "convex/_generated/api";

/**
 * Component to sync Clerk user with Convex database.
 * Place inside ConvexClientProvider.
 */
export function ConvexUserSync() {
  const { user } = useUser();
  const { isAuthenticated } = useConvexAuth();
  const storeUser = useMutation(api.users.storeUser);
  const [synced, setSynced] = useState(false);

  useEffect(() => {
    if (isAuthenticated && user && !synced) {
      storeUser()
        .then(() => setSynced(true))
        .catch((err) => console.error("Error syncing user to Convex:", err));
    }
  }, [isAuthenticated, user, storeUser, synced]);

  return null;
}
