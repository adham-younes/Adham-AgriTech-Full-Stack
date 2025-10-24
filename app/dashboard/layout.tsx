import type React from "react"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { DashboardSidebar } from "@/components/dashboard/sidebar"
import { DashboardHeader } from "@/components/dashboard/header"
import { SubscriptionProvider } from "@/components/dashboard/subscription-provider"
import { FeatureAccessBoundary } from "@/components/dashboard/feature-access-boundary"
import { DEFAULT_PLAN_ID, type BillingPlanId } from "@/lib/domain/types/billing"

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  // Fetch user profile
  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  const subscriptionPlan = (profile?.subscription_plan as BillingPlanId | null) ?? DEFAULT_PLAN_ID
  const featureOverrides = Array.isArray(profile?.feature_overrides) ? profile.feature_overrides : []
  const workspaceId =
    (profile?.workspace_id as string | undefined) ??
    (profile?.default_workspace_id as string | undefined) ??
    undefined

  return (
    <SubscriptionProvider
      userId={user.id}
      planId={subscriptionPlan}
      workspaceId={workspaceId}
      featureOverrides={featureOverrides}
    >
      <div className="flex h-screen overflow-hidden bg-background">
        <div className="hidden md:flex md:w-64 md:flex-col">
          <DashboardSidebar user={user} profile={profile} />
        </div>
        <div className="flex flex-1 flex-col overflow-hidden">
          <DashboardHeader user={user} profile={profile} />
          <main className="flex-1 overflow-y-auto p-3 sm:p-4 md:p-6">
            <FeatureAccessBoundary>{children}</FeatureAccessBoundary>
          </main>
        </div>
      </div>
    </SubscriptionProvider>
  )
}
