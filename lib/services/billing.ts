// ===========================================
// Adham AgriTech - Billing Service Helpers
// ===========================================

import Stripe from "stripe"
import { createClient as createSupabaseClient, type SupabaseClient } from "@supabase/supabase-js"
import {
  BILLING_PLANS,
  SERVICE_PRICING,
  SERVICE_PRICING_BY_ID,
  FEATURE_ENTITLEMENTS,
  type BillingPlan,
  type CheckoutAddonRequest,
  type CheckoutSessionRequest,
  type PaymentProvider,
  type BillingInterval,
  type BillingInvoice,
  type InvoiceCreationPayload,
  type BillingReceipt,
  type ReceiptCreationPayload,
  type RevenueSummary,
  type InvoiceLineItem,
  type ServicePricing,
} from "@/lib/domain/types/billing"

const stripeApiVersion: Stripe.StripeConfig["apiVersion"] = "2023-10-16"

const globalClients = globalThis as unknown as {
  __stripeBillingClient?: Stripe
  __supabaseBillingClient?: SupabaseClient
}

function getStripeClient(): Stripe {
  if (globalClients.__stripeBillingClient) {
    return globalClients.__stripeBillingClient
  }

  const stripeSecret = process.env.STRIPE_SECRET_KEY
  if (!stripeSecret) {
    throw new Error("Missing STRIPE_SECRET_KEY environment variable")
  }

  globalClients.__stripeBillingClient = new Stripe(stripeSecret, {
    apiVersion: stripeApiVersion,
  })

  return globalClients.__stripeBillingClient
}

function getSupabaseServiceClient(): SupabaseClient | null {
  if (globalClients.__supabaseBillingClient) {
    return globalClients.__supabaseBillingClient
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !serviceKey) {
    return null
  }

  globalClients.__supabaseBillingClient = createSupabaseClient(supabaseUrl, serviceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })

  return globalClients.__supabaseBillingClient
}

const PAYTABS_ENDPOINT = process.env.PAYTABS_API_URL ?? "https://secure-global.paytabs.com/payment/request"
const PAYTABS_PROFILE_ID = process.env.PAYTABS_PROFILE_ID ?? ""
const PAYTABS_SERVER_KEY = process.env.PAYTABS_SERVER_KEY ?? ""

const DEFAULT_CHECKOUT_CURRENCY = "USD"

function normaliseCurrencyCode(value?: string): string {
  const trimmed = value?.trim()
  if (!trimmed) {
    return DEFAULT_CHECKOUT_CURRENCY
  }
  return trimmed.toUpperCase()
}

function toStripeCurrency(value?: string): Stripe.Checkout.SessionCreateParams.LineItem.PriceData["currency"] {
  return normaliseCurrencyCode(value).toLowerCase() as Stripe.Checkout.SessionCreateParams.LineItem.PriceData["currency"]
}

function toPayTabsCurrency(value?: string): string {
  return normaliseCurrencyCode(value)
}

function stringifyMetadata(metadata?: Record<string, any>): Stripe.MetadataParam {
  if (!metadata) {
    return {}
  }

  return Object.fromEntries(
    Object.entries(metadata).map(([key, rawValue]) => {
      if (rawValue === undefined || rawValue === null) {
        return [key, ""]
      }

      if (typeof rawValue === "string") {
        return [key, rawValue]
      }

      try {
        return [key, JSON.stringify(rawValue)]
      } catch (error) {
        console.warn("billing:stringifyMetadata", error)
        return [key, String(rawValue)]
      }
    }),
  ) as Stripe.MetadataParam
}

function resolvePlanCheckoutAmount(
  plan: BillingPlan,
  interval: BillingInterval,
  currencyOverride?: string,
  customUnitAmount?: number,
  allowMissingAmount = false,
): { amountCents: number | null; currency: string } {
  const currency = normaliseCurrencyCode(currencyOverride ?? plan.currency ?? DEFAULT_CHECKOUT_CURRENCY)
  const price = interval === "year" ? plan.annualPrice : plan.monthlyPrice

  if (typeof price === "number") {
    return { amountCents: Math.round(price * 100), currency }
  }

  if (typeof customUnitAmount === "number") {
    return { amountCents: Math.round(customUnitAmount * 100), currency }
  }

  if (allowMissingAmount) {
    return { amountCents: null, currency }
  }

  throw new Error(
    `Plan ${plan.id} requires a Stripe price ID or customUnitAmount when creating a ${interval} checkout session`,
  )
}

function normaliseQuantity(quantity?: number): number {
  if (typeof quantity !== "number" || Number.isNaN(quantity) || quantity < 1) {
    return 1
  }

  return Math.floor(quantity)
}

function ensureCurrencyCompatibility(baseCurrency: string, candidateCurrency: string, context: string) {
  if (normaliseCurrencyCode(candidateCurrency) !== normaliseCurrencyCode(baseCurrency)) {
    throw new Error(
      `${context} currency mismatch: expected ${baseCurrency}, received ${candidateCurrency}. ` +
        "Mixing currencies within a single checkout is not supported.",
    )
  }
}

function resolveAddonPricing(
  addon: CheckoutAddonRequest,
  fallbackCurrency: string,
): {
  service: ServicePricing
  quantity: number
  unitAmountCents: number
  currency: string
  metadata?: Record<string, any>
} {
  const service = SERVICE_PRICING_BY_ID[addon.sku]

  if (!service) {
    throw new Error(`Unknown add-on SKU: ${addon.sku}`)
  }

  const currency = normaliseCurrencyCode(service.currency ?? fallbackCurrency)
  ensureCurrencyCompatibility(fallbackCurrency, currency, `Add-on ${addon.sku}`)

  return {
    service,
    quantity: normaliseQuantity(addon.quantity),
    unitAmountCents: Math.round(service.overagePrice * 100),
    currency,
    metadata: addon.metadata,
  }
}

const memoryStore: {
  invoices: BillingInvoice[]
  receipts: BillingReceipt[]
} = {
  invoices: [
    {
      id: "inv_demo_001",
      invoiceNumber: "INV-2025-001",
      customerId: "cust_demo",
      workspaceId: "ws_demo",
      status: "paid",
      total: 79,
      currency: "USD",
      dueDate: "2025-02-01",
      issuedAt: "2025-01-01",
      provider: "stripe",
      hostedInvoiceUrl: "https://billing.adham-agritech.com/invoices/INV-2025-001",
      pdfUrl: undefined,
      lineItems: [
        {
          id: "li_demo_001",
          sku: "plan_pro_monthly",
          description: "Adham AgriTech Pro Plan",
          quantity: 1,
          unitAmount: 79,
          currency: "USD",
          subtotal: 79,
        },
      ],
      metadata: {
        planId: "pro",
        cycle: "2025-02",
      },
    },
    {
      id: "inv_demo_002",
      invoiceNumber: "INV-2025-002",
      customerId: "cust_enterprise",
      workspaceId: "ws_enterprise",
      status: "open",
      total: 12500,
      currency: "AED",
      dueDate: "2025-02-10",
      issuedAt: "2025-01-25",
      provider: "paytabs",
      hostedInvoiceUrl: "https://billing.adham-agritech.com/invoices/INV-2025-002",
      pdfUrl: undefined,
      lineItems: [
        {
          id: "li_demo_002",
          sku: "plan_enterprise_retainer",
          description: "Enterprise Success Retainer",
          quantity: 1,
          unitAmount: 9500,
          currency: "AED",
          subtotal: 9500,
        },
        {
          id: "li_demo_003",
          sku: "addon_satellite_tasking",
          description: "Satellite Tasking - 120 hectares",
          quantity: 12,
          unitAmount: 250,
          currency: "AED",
          subtotal: 3000,
        },
      ],
      metadata: {
        planId: "enterprise",
        cycle: "2025-Q1",
      },
    },
  ],
  receipts: [
    {
      id: "rcpt_demo_001",
      invoiceId: "inv_demo_001",
      paymentIntentId: "pi_demo_001",
      amountPaid: 79,
      currency: "USD",
      paidAt: "2025-01-01T08:45:00.000Z",
      provider: "stripe",
      paymentMethod: "card_visa",
      receiptUrl: "https://billing.adham-agritech.com/receipts/rcpt_demo_001",
    },
  ],
}

function cloneInvoices(): BillingInvoice[] {
  return JSON.parse(JSON.stringify(memoryStore.invoices))
}

function cloneReceipts(): BillingReceipt[] {
  return JSON.parse(JSON.stringify(memoryStore.receipts))
}

function generateInvoiceNumber(): string {
  const sequence = memoryStore.invoices.length + 1
  return `INV-${new Date().getFullYear()}-${sequence.toString().padStart(3, "0")}`
}

function normaliseInvoiceRecord(record: any): BillingInvoice {
  return {
    id: record.id,
    invoiceNumber: record.invoice_number ?? record.invoiceNumber ?? generateInvoiceNumber(),
    customerId: record.customer_id ?? record.customerId,
    workspaceId: record.workspace_id ?? record.workspaceId ?? "",
    status: record.status ?? "open",
    total: record.total ?? 0,
    currency: record.currency ?? "USD",
    dueDate: record.due_date ?? record.dueDate ?? new Date().toISOString(),
    issuedAt: record.issued_at ?? record.issuedAt ?? new Date().toISOString(),
    provider: record.provider ?? "stripe",
    hostedInvoiceUrl: record.hosted_invoice_url ?? record.hostedInvoiceUrl ?? undefined,
    pdfUrl: record.pdf_url ?? record.pdfUrl ?? undefined,
    lineItems: (record.line_items ?? record.lineItems ?? []) as InvoiceLineItem[],
    metadata: record.metadata ?? undefined,
  }
}

function normaliseReceiptRecord(record: any): BillingReceipt {
  return {
    id: record.id,
    invoiceId: record.invoice_id ?? record.invoiceId,
    paymentIntentId: record.payment_intent_id ?? record.paymentIntentId ?? "",
    amountPaid: record.amount_paid ?? record.amountPaid ?? 0,
    currency: record.currency ?? "USD",
    paidAt: record.paid_at ?? record.paidAt ?? new Date().toISOString(),
    provider: record.provider ?? "stripe",
    paymentMethod: record.payment_method ?? record.paymentMethod ?? "card",
    receiptUrl: record.receipt_url ?? record.receiptUrl ?? undefined,
    metadata: record.metadata ?? undefined,
  }
}

const STRIPE_CHECKOUT_LOCALES: Set<Stripe.Checkout.SessionCreateParams.Locale> = new Set([
  "auto",
  "bg",
  "cs",
  "da",
  "de",
  "el",
  "en",
  "en-GB",
  "es",
  "es-419",
  "et",
  "fi",
  "fil",
  "fr",
  "fr-CA",
  "hr",
  "hu",
  "id",
  "it",
  "ja",
  "ko",
  "lt",
  "lv",
  "ms",
  "mt",
  "nb",
  "nl",
  "pl",
  "pt",
  "pt-BR",
  "ro",
  "ru",
  "sk",
  "sl",
  "sv",
  "th",
  "tr",
  "vi",
  "zh",
  "zh-HK",
  "zh-TW",
])

export async function createStripeCheckoutSession(request: CheckoutSessionRequest) {
  const stripe = getStripeClient()
  const plan = BILLING_PLANS[request.planId]

  if (!plan) {
    throw new Error(`Unknown plan: ${request.planId}`)
  }

  const billingInterval: BillingInterval = request.billingInterval ?? "month"
  const locale = request.locale && STRIPE_CHECKOUT_LOCALES.has(request.locale) ? request.locale : undefined

  const derivedPriceId =
    request.priceId ?? (billingInterval === "year" ? plan.stripePriceIdAnnual : plan.stripePriceIdMonthly)
  const { amountCents, currency } = resolvePlanCheckoutAmount(
    plan,
    billingInterval,
    request.currency,
    request.customUnitAmount,
    Boolean(derivedPriceId),
  )

  const addons = (request.addons ?? []).map((addon) => resolveAddonPricing(addon, currency))

  const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = []

  if (derivedPriceId) {
    lineItems.push({ price: derivedPriceId, quantity: 1 })
  } else {
    if (amountCents === null) {
      throw new Error("Plan amount could not be resolved for Stripe checkout")
    }

    lineItems.push({
      quantity: 1,
      price_data: {
        currency: toStripeCurrency(currency),
        unit_amount: amountCents,
        recurring: {
          interval: billingInterval,
        },
        product_data: {
          name: `${plan.name} Plan`,
          metadata: stringifyMetadata({
            planId: request.planId,
            interval: billingInterval,
            type: "plan",
          }),
        },
      },
    })
  }

  addons.forEach((addon) => {
    lineItems.push({
      quantity: addon.quantity,
      price_data: {
        currency: toStripeCurrency(addon.currency),
        unit_amount: addon.unitAmountCents,
        recurring: {
          interval: billingInterval,
        },
        product_data: {
          name: `${addon.service.name} Add-on`,
          metadata: stringifyMetadata({
            sku: addon.service.id,
            unit: addon.service.unit,
            type: "addon",
            ...addon.metadata,
          }),
        },
      },
    })
  })

  const subscriptionMetadataSource = {
    planId: request.planId,
    interval: billingInterval,
    addons: addons.length ? addons.map((addon) => addon.service.id).join(",") : undefined,
    ...request.metadata,
  }

  const sessionParams: Stripe.Checkout.SessionCreateParams = {
    mode: "subscription",
    success_url: request.successUrl,
    cancel_url: request.cancelUrl,
    customer_email: request.customerEmail,
    allow_promotion_codes: true,
    locale,
    subscription_data: {
      metadata: stringifyMetadata(subscriptionMetadataSource),
    },
    line_items: lineItems,
  }

  const session = await stripe.checkout.sessions.create(sessionParams)

  return {
    id: session.id,
    url: session.url,
    customerId: session.customer,
  }
}

export async function createPayTabsPaymentPage(request: CheckoutSessionRequest & { language?: string }) {
  if (!PAYTABS_PROFILE_ID || !PAYTABS_SERVER_KEY) {
    throw new Error("Missing PayTabs credentials")
  }

  const plan = BILLING_PLANS[request.planId]
  if (!plan) {
    throw new Error(`Unknown plan: ${request.planId}`)
  }

  const billingInterval: BillingInterval = request.billingInterval ?? "month"
  const { amountCents, currency } = resolvePlanCheckoutAmount(
    plan,
    billingInterval,
    request.currency,
    request.customUnitAmount,
    false,
  )

  const addons = (request.addons ?? []).map((addon) => resolveAddonPricing(addon, currency))

  const planUnitPrice = amountCents ? Number((amountCents / 100).toFixed(2)) : 0
  const addonItems = addons.map((addon) => ({
    sku: addon.service.id,
    description: `${addon.service.name} (${addon.service.unit})`,
    quantity: addon.quantity,
    unit_price: Number((addon.unitAmountCents / 100).toFixed(2)),
  }))

  const cartItems = [
    planUnitPrice > 0
      ? {
          sku: `plan_${request.planId}_${billingInterval}`,
          description: `${plan.name} Plan - ${billingInterval === "year" ? "Annual" : "Monthly"}`,
          quantity: 1,
          unit_price: planUnitPrice,
        }
      : null,
    ...addonItems,
  ].filter(Boolean) as Array<{
    sku: string
    description: string
    quantity: number
    unit_price: number
  }>

  const totalAmount = cartItems.reduce((sum, item) => sum + item.unit_price * item.quantity, 0)

  if (totalAmount <= 0) {
    return {
      id: `paytabs_nocharge_${Date.now()}`,
      url: request.successUrl,
      provider: "paytabs" as const,
      status: "no-charge",
    }
  }

  const payTabsCurrency = toPayTabsCurrency(currency)
  const metadataSource = {
    planId: request.planId,
    interval: billingInterval,
    addons: addons.length ? addons.map((addon) => addon.service.id).join(",") : undefined,
    ...request.metadata,
  }

  const payload = {
    profile_id: PAYTABS_PROFILE_ID,
    tran_type: "sale",
    tran_class: "subscription",
    cart_description: `${plan.name} Plan Subscription`,
    cart_id: `plan_${request.planId}_${Date.now()}`,
    cart_currency: payTabsCurrency,
    cart_amount: Number(totalAmount.toFixed(2)),
    hide_shipping: true,
    callback: `${request.successUrl}?provider=paytabs`,
    return: request.cancelUrl ?? request.successUrl,
    customer_details: {
      email: request.customerEmail ?? "billing@adham-agritech.com",
      name: request.metadata?.customerName ?? "Adham AgriTech Customer",
      phone: request.metadata?.phone ?? "",
      country: request.metadata?.country ?? "EG",
      city: request.metadata?.city ?? "Cairo",
      street1: request.metadata?.address ?? "",
    },
    language: request.language ?? "en",
    cart_items: cartItems.map((item) => ({
      sku: item.sku,
      description: item.description,
      quantity: item.quantity,
      price: item.unit_price,
    })),
    user_defined: stringifyMetadata(metadataSource),
  }

  const response = await fetch(PAYTABS_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      authorization: PAYTABS_SERVER_KEY,
    },
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    const errorBody = await response.text()
    throw new Error(`PayTabs error: ${response.status} - ${errorBody}`)
  }

  const data = await response.json()
  return {
    id: data.tran_ref ?? `paytabs_${Date.now()}`,
    url: data.redirect_url,
    provider: "paytabs" as const,
    payload,
  }
}

export async function createBillingInvoice(payload: InvoiceCreationPayload): Promise<BillingInvoice> {
  const supabase = getSupabaseServiceClient()
  const invoice: BillingInvoice = {
    id: payload.metadata?.invoice_id ?? `inv_${Date.now()}`,
    invoiceNumber: payload.metadata?.invoice_number ?? generateInvoiceNumber(),
    customerId: payload.customerId,
    workspaceId: payload.workspaceId,
    status: "open",
    total: payload.lineItems.reduce((sum, item) => sum + item.subtotal, 0),
    currency: payload.lineItems[0]?.currency ?? "USD",
    dueDate: payload.dueDate,
    issuedAt: new Date().toISOString(),
    provider: payload.provider,
    lineItems: payload.lineItems,
    metadata: payload.metadata,
  }

  if (!supabase) {
    memoryStore.invoices.unshift(invoice)
    return invoice
  }

  try {
    const { data, error } = await supabase.from("billing_invoices").insert([
      {
        id: invoice.id,
        invoice_number: invoice.invoiceNumber,
        customer_id: invoice.customerId,
        workspace_id: invoice.workspaceId,
        status: invoice.status,
        total: invoice.total,
        currency: invoice.currency,
        due_date: invoice.dueDate,
        issued_at: invoice.issuedAt,
        provider: invoice.provider,
        line_items: invoice.lineItems,
        metadata: invoice.metadata,
      },
    ]).select().single()

    if (error) {
      console.warn("billing:createBillingInvoice", error)
      memoryStore.invoices.unshift(invoice)
      return invoice
    }

    return normaliseInvoiceRecord(data)
  } catch (error) {
    console.error("billing:createBillingInvoice", error)
    memoryStore.invoices.unshift(invoice)
    return invoice
  }
}

export async function createBillingReceipt(payload: ReceiptCreationPayload): Promise<BillingReceipt> {
  const supabase = getSupabaseServiceClient()
  const receipt: BillingReceipt = {
    id: payload.metadata?.receipt_id ?? `rcpt_${Date.now()}`,
    invoiceId: payload.invoiceId,
    paymentIntentId: payload.paymentIntentId,
    amountPaid: payload.amountPaid,
    currency: payload.currency,
    paidAt: payload.paidAt,
    provider: payload.provider,
    paymentMethod: payload.paymentMethod,
    metadata: payload.metadata,
  }

  if (!supabase) {
    memoryStore.receipts.unshift(receipt)
    return receipt
  }

  try {
    const { data, error } = await supabase.from("billing_receipts").insert([
      {
        id: receipt.id,
        invoice_id: receipt.invoiceId,
        payment_intent_id: receipt.paymentIntentId,
        amount_paid: receipt.amountPaid,
        currency: receipt.currency,
        paid_at: receipt.paidAt,
        provider: receipt.provider,
        payment_method: receipt.paymentMethod,
        metadata: receipt.metadata,
      },
    ]).select().single()

    if (error) {
      console.warn("billing:createBillingReceipt", error)
      memoryStore.receipts.unshift(receipt)
      return receipt
    }

    return normaliseReceiptRecord(data)
  } catch (error) {
    console.error("billing:createBillingReceipt", error)
    memoryStore.receipts.unshift(receipt)
    return receipt
  }
}

export async function listBillingInvoices(limit = 50): Promise<BillingInvoice[]> {
  const supabase = getSupabaseServiceClient()
  if (!supabase) {
    return cloneInvoices().slice(0, limit)
  }

  try {
    const { data, error } = await supabase
      .from("billing_invoices")
      .select("*")
      .order("issued_at", { ascending: false })
      .limit(limit)

    if (error || !data) {
      console.warn("billing:listBillingInvoices", error)
      return cloneInvoices().slice(0, limit)
    }

    return data.map(normaliseInvoiceRecord)
  } catch (error) {
    console.error("billing:listBillingInvoices", error)
    return cloneInvoices().slice(0, limit)
  }
}

export async function listBillingReceipts(limit = 50): Promise<BillingReceipt[]> {
  const supabase = getSupabaseServiceClient()
  if (!supabase) {
    return cloneReceipts().slice(0, limit)
  }

  try {
    const { data, error } = await supabase
      .from("billing_receipts")
      .select("*")
      .order("paid_at", { ascending: false })
      .limit(limit)

    if (error || !data) {
      console.warn("billing:listBillingReceipts", error)
      return cloneReceipts().slice(0, limit)
    }

    return data.map(normaliseReceiptRecord)
  } catch (error) {
    console.error("billing:listBillingReceipts", error)
    return cloneReceipts().slice(0, limit)
  }
}

export async function getRevenueSummary(options?: {
  from?: string
  to?: string
  provider?: PaymentProvider
}): Promise<RevenueSummary> {
  const invoices = await listBillingInvoices()
  const receipts = await listBillingReceipts()

  const filteredInvoices = invoices.filter((invoice) => {
    const issued = new Date(invoice.issuedAt)
    if (options?.from && issued < new Date(options.from)) return false
    if (options?.to && issued > new Date(options.to)) return false
    if (options?.provider && invoice.provider !== options.provider) return false
    return true
  })

  const filteredReceipts = receipts.filter((receipt) => {
    const paid = new Date(receipt.paidAt)
    if (options?.from && paid < new Date(options.from)) return false
    if (options?.to && paid > new Date(options.to)) return false
    if (options?.provider && receipt.provider !== options.provider) return false
    return true
  })

  const totalInvoiced = filteredInvoices.reduce((sum, invoice) => sum + invoice.total, 0)
  const totalPaid = filteredReceipts.reduce((sum, receipt) => sum + receipt.amountPaid, 0)
  const totalOutstanding = filteredInvoices
    .filter((invoice) => invoice.status !== "paid")
    .reduce((sum, invoice) => sum + invoice.total, 0)

  const breakdownByProvider = ["stripe", "paytabs"].map((provider) => {
    const providerInvoices = filteredInvoices.filter((invoice) => invoice.provider === provider)
    const providerReceipts = filteredReceipts.filter((receipt) => receipt.provider === provider)

    return {
      provider: provider as PaymentProvider,
      totalInvoiced: providerInvoices.reduce((sum, invoice) => sum + invoice.total, 0),
      totalPaid: providerReceipts.reduce((sum, receipt) => sum + receipt.amountPaid, 0),
      totalRefunded: 0,
    }
  })

  return {
    periodStart: options?.from ?? new Date(new Date().setMonth(new Date().getMonth() - 1)).toISOString(),
    periodEnd: options?.to ?? new Date().toISOString(),
    totalInvoiced,
    totalPaid,
    totalOutstanding,
    totalRefunded: 0,
    invoices: filteredInvoices,
    receipts: filteredReceipts,
    breakdownByProvider,
  }
}

export function getPricingMatrix() {
  return {
    plans: BILLING_PLANS,
    services: SERVICE_PRICING,
    entitlements: FEATURE_ENTITLEMENTS,
  }
}

export async function createCheckoutSession(provider: PaymentProvider, request: CheckoutSessionRequest) {
  if (provider === "stripe") {
    return createStripeCheckoutSession(request)
  }

  if (provider === "paytabs") {
    return createPayTabsPaymentPage(request)
  }

  throw new Error(`Unsupported payment provider: ${provider}`)
}
