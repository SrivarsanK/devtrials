"use server";

import { auth, clerkClient } from "@clerk/nextjs/server";

export async function completeOnboarding(onboardingData?: { zones: string[], partner: string }) {
  const { userId } = await auth();

  if (!userId) {
    return { error: "No user found" };
  }

  try {
    const client = await clerkClient();
    await client.users.updateUser(userId, {
      publicMetadata: {
        onboardingComplete: true,
        selectedZones: onboardingData?.zones || [],
        partner: onboardingData?.partner || "",
      },
    });
    return { success: true };
  } catch (err) {
    return { error: "Error updating user metadata" };
  }
}
