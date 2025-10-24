"use client"

import { useCallback } from "react"
import type { FeatureAccessResult } from "@/lib/domain/types/billing"
import { useSubscription } from "@/components/dashboard/subscription-provider"

export function useFeatureAccess() {
  const { planId, plan, checkFeatureAccess, trackFeatureUsage, usage, loadingUsage, refreshUsage } = useSubscription()

  const isFeatureEnabled = useCallback(
    (featureId: string): FeatureAccessResult => checkFeatureAccess(featureId),
    [checkFeatureAccess],
  )

  return {
    planId,
    plan,
    usage,
    loadingUsage,
    refreshUsage,
    checkAccess: isFeatureEnabled,
    trackUsage: trackFeatureUsage,
  }
}
