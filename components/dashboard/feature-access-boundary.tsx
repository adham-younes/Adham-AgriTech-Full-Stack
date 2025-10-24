"use client"

import { useEffect, useMemo, useRef } from "react"
import { usePathname } from "next/navigation"
import { PaywallNotice } from "@/components/dashboard/paywall-notice"
import { ROUTE_FEATURE_MAP } from "@/lib/domain/types/billing"
import { useFeatureAccess } from "@/lib/domain/hooks/useFeatureAccess"

interface FeatureAccessBoundaryProps {
  children: React.ReactNode
}

export function FeatureAccessBoundary({ children }: FeatureAccessBoundaryProps) {
  const pathname = usePathname()
  const { checkAccess, trackUsage } = useFeatureAccess()
  const lastTrackedFeature = useRef<string | null>(null)

  const featureId = useMemo(() => {
    if (!pathname) return null
    if (ROUTE_FEATURE_MAP[pathname]) return ROUTE_FEATURE_MAP[pathname]
    const matchedEntry = Object.entries(ROUTE_FEATURE_MAP).find(([route]) => pathname.startsWith(route))
    return matchedEntry ? matchedEntry[1] : null
  }, [pathname])

  const access = featureId ? checkAccess(featureId) : { enabled: true }

  useEffect(() => {
    if (!featureId || !access.enabled) return
    if (lastTrackedFeature.current === featureId) return
    lastTrackedFeature.current = featureId
    void trackUsage(featureId, "view")
  }, [featureId, access.enabled, trackUsage])

  if (!featureId) {
    return <>{children}</>
  }

  if (!access.enabled) {
    return (
      <div className="mx-auto max-w-3xl py-12">
        <PaywallNotice
          featureId={featureId}
          requiredPlan={access.requiredPlan}
          upgradeHint={access.upgradeHint}
        />
      </div>
    )
  }

  return <>{children}</>
}
