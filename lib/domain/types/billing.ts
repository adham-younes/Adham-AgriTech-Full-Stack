// ===========================================
// Adham AgriTech - Billing & Pricing Types
// ===========================================

import type Stripe from "stripe"
export type BillingPlanId = "freemium" | "pro" | "enterprise"

export type BillingInterval = "month" | "year"

export interface BillingPlan {
  id: BillingPlanId
  name: string
  monthlyPrice: number | "custom"
  annualPrice: number | "custom"
  description: string
  highlights: string[]
  includedSeats: number | "unlimited"
  aiPromptAllowance: number | "unlimited"
  supportLevel: "standard" | "priority" | "dedicated"
  isRecommended?: boolean
  currency: string
  stripePriceIdMonthly?: string
  stripePriceIdAnnual?: string
}

export const BILLING_PLANS: Record<BillingPlanId, BillingPlan> = {
  freemium: {
    id: "freemium",
    name: "Freemium",
    monthlyPrice: 0,
    annualPrice: 0,
    description: "Get started with digital agronomy tools and community support.",
    highlights: [
      "Core farm & field management",
      "Community forum access",
      "Daily AI assistant prompts",
    ],
    includedSeats: 1,
    aiPromptAllowance: 5,
    supportLevel: "standard",
    currency: "USD",
  },
  pro: {
    id: "pro",
    name: "Pro",
    monthlyPrice: 79,
    annualPrice: 790,
    description: "Automation, collaboration, and premium analytics for growing farms.",
    highlights: [
      "Unlimited fields & collaborative workspace",
      "Irrigation optimization & soil analytics",
      "Satellite snapshots (4 per month)",
    ],
    includedSeats: 10,
    aiPromptAllowance: 100,
    supportLevel: "priority",
    isRecommended: true,
    currency: "USD",
    stripePriceIdMonthly: process.env.NEXT_PUBLIC_STRIPE_PRICE_PRO_MONTHLY,
    stripePriceIdAnnual: process.env.NEXT_PUBLIC_STRIPE_PRICE_PRO_ANNUAL,
  },
  enterprise: {
    id: "enterprise",
    name: "Enterprise",
    monthlyPrice: "custom",
    annualPrice: "custom",
    description: "Mission-critical operations, compliance, and dedicated success management.",
    highlights: [
      "Real-time satellite feeds & NDVI refresh",
      "Blockchain traceability & governance controls",
      "Dedicated success manager & 99.9% SLA",
    ],
    includedSeats: "unlimited",
    aiPromptAllowance: "unlimited",
    supportLevel: "dedicated",
    currency: "USD",
    stripePriceIdMonthly: process.env.NEXT_PUBLIC_STRIPE_PRICE_ENTERPRISE_MONTHLY,
    stripePriceIdAnnual: process.env.NEXT_PUBLIC_STRIPE_PRICE_ENTERPRISE_ANNUAL,
  },
}

export interface ServicePricing {
  id: string
  name: string
  includedIn: BillingPlanId[]
  baseAllowance: string
  basePrice: number
  overagePrice: number
  unit: string
  description: string
  currency: string
}

export const SERVICE_PRICING: ServicePricing[] = [
  {
    id: "ai-insight-packs",
    name: "AI Insight Packs",
    includedIn: ["pro", "enterprise"],
    baseAllowance: "20 insights",
    basePrice: 0,
    overagePrice: 2,
    unit: "insight",
    description: "Seasonal recommendations and market intelligence delivered on demand.",
    currency: "USD",
  },
  {
    id: "satellite-tasking",
    name: "Satellite Tasking",
    includedIn: ["enterprise"],
    baseAllowance: "50 hectares",
    basePrice: 0,
    overagePrice: 12,
    unit: "10 hectares",
    description: "High resolution tasking with orthomosaic export and vegetation indices.",
    currency: "USD",
  },
  {
    id: "irrigation-controller-integration",
    name: "Irrigation Controller Integration",
    includedIn: ["pro", "enterprise"],
    baseAllowance: "5 controllers",
    basePrice: 0,
    overagePrice: 15,
    unit: "controller",
    description: "Hardware activation, telemetry mapping, and remote diagnostics.",
    currency: "USD",
  },
  {
    id: "blockchain-certificates",
    name: "Blockchain Traceability Certificates",
    includedIn: ["enterprise"],
    baseAllowance: "200 certificates",
    basePrice: 0,
    overagePrice: 0.3,
    unit: "certificate",
    description: "Digitally signed produce provenance stored on the consortium ledger.",
    currency: "USD",
  },
  {
    id: "sms-alerts",
    name: "SMS Alerts Bundle",
    includedIn: ["freemium", "pro", "enterprise"],
    baseAllowance: "250 SMS",
    basePrice: 12.5,
    overagePrice: 0.05,
    unit: "sms",
    description: "Localized notifications with Arabic/English templates routed through regional carriers.",
    currency: "USD",
  },
]

export const SERVICE_PRICING_BY_ID: Record<string, ServicePricing> = SERVICE_PRICING.reduce(
  (acc, service) => {
    acc[service.id] = service
    return acc
  },
  {} as Record<string, ServicePricing>,
)

export interface FeatureEntitlement {
  featureId: string
  availableOn: BillingPlanId[]
  usageLimits?: Partial<Record<BillingPlanId, { limit: number | "unlimited"; unit: string }>>
  description?: string
  upgradeHint?: string
}

export const FEATURE_ENTITLEMENTS: Record<string, FeatureEntitlement> = {
  "dashboard": {
    featureId: "dashboard",
    availableOn: ["freemium", "pro", "enterprise"],
  },
  "farms-management": {
    featureId: "farms-management",
    availableOn: ["freemium", "pro", "enterprise"],
    usageLimits: {
      freemium: { limit: 1, unit: "farm" },
      pro: { limit: 10, unit: "farms" },
      enterprise: { limit: "unlimited", unit: "farms" },
    },
  },
  "fields-management": {
    featureId: "fields-management",
    availableOn: ["freemium", "pro", "enterprise"],
    usageLimits: {
      freemium: { limit: 3, unit: "fields" },
      pro: { limit: 100, unit: "fields" },
      enterprise: { limit: "unlimited", unit: "fields" },
    },
  },
  "weather-data": {
    featureId: "weather-data",
    availableOn: ["freemium", "pro", "enterprise"],
  },
  "ai-assistant": {
    featureId: "ai-assistant",
    availableOn: ["freemium", "pro", "enterprise"],
    usageLimits: {
      freemium: { limit: 5, unit: "prompts/day" },
      pro: { limit: 100, unit: "prompts/day" },
      enterprise: { limit: "unlimited", unit: "prompts" },
    },
    upgradeHint: "Unlock more AI prompts and seasonal playbooks with Pro or Enterprise.",
  },
  "satellite-imagery": {
    featureId: "satellite-imagery",
    availableOn: ["pro", "enterprise"],
    usageLimits: {
      pro: { limit: 4, unit: "captures/month" },
      enterprise: { limit: "unlimited", unit: "refresh" },
    },
    upgradeHint: "Satellite tasking requires a Pro subscription. Enterprise unlocks live refresh.",
  },
  "irrigation-optimization": {
    featureId: "irrigation-optimization",
    availableOn: ["pro", "enterprise"],
  },
  "crop-monitoring": {
    featureId: "crop-monitoring",
    availableOn: ["freemium", "pro", "enterprise"],
  },
  "soil-analysis": {
    featureId: "soil-analysis",
    availableOn: ["pro", "enterprise"],
  },
  "blockchain-traceability": {
    featureId: "blockchain-traceability",
    availableOn: ["enterprise"],
    upgradeHint: "Upgrade to Enterprise for blockchain-backed traceability and compliance exports.",
  },
  "marketplace": {
    featureId: "marketplace",
    availableOn: ["freemium", "pro", "enterprise"],
  },
  "forum": {
    featureId: "forum",
    availableOn: ["freemium", "pro", "enterprise"],
  },
  "services": {
    featureId: "services",
    availableOn: ["freemium", "pro", "enterprise"],
  },
  "satellite": {
    featureId: "satellite",
    availableOn: ["pro", "enterprise"],
  },
  "reports": {
    featureId: "reports",
    availableOn: ["freemium", "pro", "enterprise"],
    usageLimits: {
      freemium: { limit: 3, unit: "reports/month" },
      pro: { limit: 50, unit: "reports/month" },
      enterprise: { limit: "unlimited", unit: "reports" },
    },
  },
  "revenue-analytics": {
    featureId: "revenue-analytics",
    availableOn: ["pro", "enterprise"],
    upgradeHint: "Revenue dashboards require a Pro financial workspace or Enterprise license.",
  },
}

export type PaymentProvider = "stripe" | "paytabs"

export const DEFAULT_PLAN_ID: BillingPlanId = "freemium"

export const ROUTE_FEATURE_MAP: Record<string, string> = {
  "/dashboard": "dashboard",
  "/dashboard/farms": "farms-management",
  "/dashboard/fields": "fields-management",
  "/dashboard/weather": "weather-data",
  "/dashboard/ai-assistant": "ai-assistant",
  "/dashboard/satellite": "satellite-imagery",
  "/dashboard/irrigation": "irrigation-optimization",
  "/dashboard/soil-analysis": "soil-analysis",
  "/dashboard/blockchain": "blockchain-traceability",
  "/dashboard/marketplace": "marketplace",
  "/dashboard/forum": "forum",
  "/dashboard/services": "services",
  "/dashboard/reports": "reports",
  "/dashboard/reports/revenue": "revenue-analytics",
}

export interface InvoiceLineItem {
  id: string
  sku: string
  description: string
  quantity: number
  unitAmount: number
  currency: string
  subtotal: number
  metadata?: Record<string, any>
}

export type InvoiceStatus = "draft" | "open" | "paid" | "void" | "uncollectible"

export interface BillingInvoice {
  id: string
  invoiceNumber: string
  customerId: string
  workspaceId: string
  status: InvoiceStatus
  total: number
  currency: string
  dueDate: string
  issuedAt: string
  provider: PaymentProvider
  lineItems: InvoiceLineItem[]
  hostedInvoiceUrl?: string
  pdfUrl?: string
  metadata?: Record<string, any>
}

export interface BillingReceipt {
  id: string
  invoiceId: string
  paymentIntentId: string
  amountPaid: number
  currency: string
  paidAt: string
  provider: PaymentProvider
  paymentMethod: string
  receiptUrl?: string
  metadata?: Record<string, any>
}

export interface RevenueBreakdownByProvider {
  provider: PaymentProvider
  totalInvoiced: number
  totalPaid: number
  totalRefunded: number
}

export interface RevenueSummary {
  periodStart: string
  periodEnd: string
  totalInvoiced: number
  totalPaid: number
  totalOutstanding: number
  totalRefunded: number
  invoices: BillingInvoice[]
  receipts: BillingReceipt[]
  breakdownByProvider: RevenueBreakdownByProvider[]
}

export interface CheckoutSessionRequest {
  planId: BillingPlanId
  successUrl: string
  cancelUrl: string
  customerEmail?: string
  metadata?: Record<string, any>
  locale?: Stripe.Checkout.SessionCreateParams.Locale
  currency?: string
  billingInterval?: BillingInterval
  priceId?: string
  customUnitAmount?: number
  addons?: CheckoutAddonRequest[]
}

export interface CheckoutAddonRequest {
  sku: string
  quantity?: number
  metadata?: Record<string, any>
}

export interface InvoiceCreationPayload {
  workspaceId: string
  customerId: string
  lineItems: InvoiceLineItem[]
  provider: PaymentProvider
  dueDate: string
  metadata?: Record<string, any>
}

export interface ReceiptCreationPayload {
  invoiceId: string
  paymentIntentId: string
  amountPaid: number
  currency: string
  provider: PaymentProvider
  paidAt: string
  paymentMethod: string
  metadata?: Record<string, any>
}

export interface FeatureAccessResult {
  enabled: boolean
  requiredPlan?: BillingPlanId
  usageLimit?: { limit: number | "unlimited"; unit: string }
  usage?: { count: number; limit?: number | "unlimited"; unit?: string; metadata?: Record<string, any> }
  reason?: string
  upgradeHint?: string
}

export interface UsageMetricSummary {
  featureId: string
  count: number
  unit?: string
  lastUsedAt?: string
  metadata?: Record<string, any>
}
