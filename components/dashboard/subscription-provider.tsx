"use client"

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react"
import {
  BILLING_PLANS,
  type BillingPlanId,
  type BillingPlan,
  FEATURE_ENTITLEMENTS,
  type FeatureAccessResult,
  DEFAULT_PLAN_ID,
} from "@/lib/domain/types/billing"
import type { UsageSummary } from "@/lib/analytics"
import { getUsageSummary, trackUsageEvent } from "@/lib/analytics"

interface SubscriptionContextValue {
  planId: BillingPlanId
  plan: BillingPlan
  featureOverrides: string[]
  usage: UsageSummary | null
  loadingUsage: boolean
  refreshUsage: () => Promise<void>
  checkFeatureAccess: (featureId: string) => FeatureAccessResult
  trackFeatureUsage: (
    featureId: string,
    action?: "view" | "generate" | "update" | "export",
    units?: number,
    metadata?: Record<string, any>,
  ) => Promise<void>
}

const SubscriptionContext = createContext<SubscriptionContextValue | null>(null)

const PLAN_ORDER: Record<BillingPlanId, number> = {
  freemium: 0,
  pro: 1,
  enterprise: 2,
}

interface SubscriptionProviderProps {
  userId: string
  planId?: BillingPlanId | null
  workspaceId?: string
  featureOverrides?: string[]
  children: React.ReactNode
}

export function SubscriptionProvider({
  userId,
  planId = DEFAULT_PLAN_ID,
  workspaceId,
  featureOverrides = [],
  children,
}: SubscriptionProviderProps) {
  const resolvedPlanId = (planId ?? DEFAULT_PLAN_ID) as BillingPlanId
  const plan = BILLING_PLANS[resolvedPlanId]

  const [usage, setUsage] = useState<UsageSummary | null>(null)
  const [loadingUsage, setLoadingUsage] = useState(false)

  const refreshUsage = useCallback(async () => {
    setLoadingUsage(true)
    try {
      const summary = await getUsageSummary({ userId, planId: resolvedPlanId })
      setUsage(summary)
    } catch (error) {
      console.error("subscription-provider:refreshUsage", error)
    } finally {
      setLoadingUsage(false)
    }
  }, [userId, resolvedPlanId])

  useEffect(() => {
    void refreshUsage()
  }, [refreshUsage])

  const checkFeatureAccess = useCallback(
    (featureId: string): FeatureAccessResult => {
      const entitlement = FEATURE_ENTITLEMENTS[featureId]

      if (!entitlement) {
        return { enabled: true }
      }

      if (featureOverrides.includes(featureId)) {
        return { enabled: true }
      }

      const availablePlans = entitlement.availableOn
      const isIncluded = availablePlans.includes(resolvedPlanId)

      if (!isIncluded) {
        const sorted = [...availablePlans].sort((a, b) => PLAN_ORDER[a] - PLAN_ORDER[b])
        const requiredPlan =
          sorted.find((planOption) => PLAN_ORDER[planOption] > PLAN_ORDER[resolvedPlanId]) ??
          sorted[sorted.length - 1]
        return {
          enabled: false,
          requiredPlan,
          reason: "plan",
          upgradeHint: entitlement.upgradeHint,
        }
      }

      const limit = entitlement.usageLimits?.[resolvedPlanId]
      const featureUsage = usage?.byFeature?.[featureId]
      const usedUnits = featureUsage?.count ?? 0

      if (limit && limit.limit !== "unlimited" && usedUnits >= limit.limit) {
        return {
          enabled: false,
          requiredPlan: resolvedPlanId,
          reason: "limit",
          usageLimit: limit,
          usage: {
            count: usedUnits,
            limit: limit.limit,
            unit: limit.unit,
          },
          upgradeHint: entitlement.upgradeHint,
        }
      }

      return {
        enabled: true,
        usageLimit: limit,
        usage: limit
          ? {
              count: usedUnits,
              limit: limit.limit,
              unit: limit.unit,
            }
          : featureUsage
            ? {
                count: featureUsage.count,
                limit: undefined,
                unit: featureUsage.unit,
                metadata: featureUsage.metadata,
              }
            : undefined,
        upgradeHint: entitlement.upgradeHint,
      }
    },
    [featureOverrides, resolvedPlanId, usage],
  )

  const trackFeatureUsage = useCallback(
    async (
      featureId: string,
      action: "view" | "generate" | "update" | "export" = "view",
      units = 1,
      metadata?: Record<string, any>,
    ) => {
      await trackUsageEvent({
        userId,
        workspaceId,
        featureId,
        action,
        planId: resolvedPlanId,
        units,
        metadata,
      })

      setUsage((previous) => {
        const next = previous ?? {
          totalEvents: 0,
          totalUnits: 0,
          byFeature: {},
        }

        next.totalEvents += 1
        next.totalUnits += units
        const featureUsage = next.byFeature[featureId] ?? {
          featureId,
          count: 0,
          unit: metadata?.unit,
          lastUsedAt: undefined,
          metadata: undefined,
        }

        featureUsage.count += units
        featureUsage.lastUsedAt = new Date().toISOString()
        featureUsage.metadata = metadata ?? featureUsage.metadata
        next.byFeature[featureId] = featureUsage
        return { ...next, byFeature: { ...next.byFeature } }
      })
    },
    [resolvedPlanId, userId, workspaceId],
  )

  const value = useMemo<SubscriptionContextValue>(
    () => ({
      planId: resolvedPlanId,
      plan,
      featureOverrides,
      usage,
      loadingUsage,
      refreshUsage,
      checkFeatureAccess,
      trackFeatureUsage,
    }),
    [resolvedPlanId, plan, featureOverrides, usage, loadingUsage, refreshUsage, checkFeatureAccess, trackFeatureUsage],
  )

  return <SubscriptionContext.Provider value={value}>{children}</SubscriptionContext.Provider>
}

export function useSubscription() {
  const context = useContext(SubscriptionContext)
  if (!context) {
    throw new Error("useSubscription must be used within a SubscriptionProvider")
  }
  return context
}
