"use client"

import { useState } from "react"
import { Lock, ArrowUpRight, CreditCard, Globe2 } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { BillingPlanId, PaymentProvider } from "@/lib/domain/types/billing"
import { BILLING_PLANS } from "@/lib/domain/types/billing"
import { useFeatureAccess } from "@/lib/domain/hooks/useFeatureAccess"

interface PaywallNoticeProps {
  featureId: string
  requiredPlan?: BillingPlanId
  upgradeHint?: string
  className?: string
}

const PROVIDER_LABELS: Record<PaymentProvider, string> = {
  stripe: "Stripe Checkout",
  paytabs: "PayTabs Portal",
}

export function PaywallNotice({ featureId, requiredPlan = "pro", upgradeHint, className }: PaywallNoticeProps) {
  const { planId } = useFeatureAccess()
  const [loadingProvider, setLoadingProvider] = useState<PaymentProvider | null>(null)
  const [error, setError] = useState<string | null>(null)

  const targetPlan = BILLING_PLANS[requiredPlan]

  const initiateUpgrade = async (provider: PaymentProvider) => {
    if (typeof window === "undefined") return

    setLoadingProvider(provider)
    setError(null)

    try {
      const response = await fetch("/api/billing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "create-checkout",
          provider,
          planId: targetPlan.id,
          successUrl: window.location.href,
          cancelUrl: window.location.href,
          metadata: {
            featureId,
            currentPlan: planId,
          },
        }),
      })

      if (!response.ok) {
        throw new Error(`Upgrade failed: ${response.status}`)
      }

      const data = await response.json()
      if (data?.url) {
        window.location.href = data.url
      } else {
        setError("Unable to start checkout session. Please contact support.")
      }
    } catch (error: any) {
      console.error("paywall:initiateUpgrade", error)
      setError(error?.message ?? "Unexpected error initiating checkout.")
    } finally {
      setLoadingProvider(null)
    }
  }

  return (
    <Card className={`border-dashed border-primary/40 bg-primary/5 p-6 text-center space-y-4 ${className ?? ""}`}>
      <div className="flex justify-center">
        <div className="rounded-full bg-primary/10 p-3 text-primary">
          <Lock className="h-6 w-6" />
        </div>
      </div>
      <div className="space-y-2">
        <h3 className="text-xl font-semibold">Upgrade Required</h3>
        <p className="text-sm text-muted-foreground">
          {upgradeHint ?? "This feature is reserved for premium workspaces."}
        </p>
        <div className="flex items-center justify-center gap-2">
          <Badge variant="secondary" className="bg-primary/10 text-primary">
            Current plan: {BILLING_PLANS[planId].name}
          </Badge>
          <Badge className="bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300">
            Requires: {targetPlan.name}
          </Badge>
        </div>
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        {(((targetPlan.id === "enterprise") ? ["paytabs", "stripe"] : ["stripe", "paytabs"]) as PaymentProvider[]).map((provider) => (
          <Button
            key={provider}
            variant="outline"
            onClick={() => void initiateUpgrade(provider)}
            disabled={loadingProvider !== null && loadingProvider !== provider}
            className="w-full gap-2"
          >
            {provider === "stripe" ? <CreditCard className="h-4 w-4" /> : <Globe2 className="h-4 w-4" />}
            {loadingProvider === provider ? "Redirecting…" : PROVIDER_LABELS[provider]}
            <ArrowUpRight className="h-4 w-4" />
          </Button>
        ))}
      </div>
      {error && <p className="text-sm text-destructive">{error}</p>}
    </Card>
  )
}
