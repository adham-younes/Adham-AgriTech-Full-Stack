import type { NextApiRequest, NextApiResponse } from "next"
import {
  createCheckoutSession,
  createBillingInvoice,
  createBillingReceipt,
  getPricingMatrix,
  getRevenueSummary,
  listBillingInvoices,
  listBillingReceipts,
} from "@/lib/services/billing"
import type {
  CheckoutSessionRequest,
  InvoiceCreationPayload,
  PaymentProvider,
  ReceiptCreationPayload,
} from "@/lib/domain/types/billing"

function parseProvider(value: any): PaymentProvider {
  if (value === "stripe" || value === "paytabs") {
    return value
  }
  return "stripe"
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method === "GET") {
      const { type = "pricing", from, to, provider } = req.query

      if (type === "pricing") {
        return res.status(200).json(getPricingMatrix())
      }

      if (type === "invoices") {
        const invoices = await listBillingInvoices()
        return res.status(200).json({ invoices })
      }

      if (type === "receipts") {
        const receipts = await listBillingReceipts()
        return res.status(200).json({ receipts })
      }

      if (type === "revenue") {
        const summary = await getRevenueSummary({
          from: typeof from === "string" ? from : undefined,
          to: typeof to === "string" ? to : undefined,
          provider: typeof provider === "string" ? parseProvider(provider) : undefined,
        })
        return res.status(200).json(summary)
      }

      return res.status(400).json({ error: `Unsupported query type: ${type}` })
    }

    if (req.method === "POST") {
      const { action } = req.body ?? {}

      if (action === "create-checkout") {
        const payload = req.body as CheckoutSessionRequest & { provider?: PaymentProvider }

        if (!payload.planId || !payload.successUrl || !payload.cancelUrl) {
          return res.status(400).json({ error: "Missing planId, successUrl, or cancelUrl" })
        }

        const provider = parseProvider(payload.provider)
        const session = await createCheckoutSession(provider, payload)
        return res.status(200).json(session)
      }

      if (action === "create-invoice") {
        const payload = req.body.payload as InvoiceCreationPayload
        if (!payload) {
          return res.status(400).json({ error: "Missing invoice payload" })
        }
        const invoice = await createBillingInvoice(payload)
        return res.status(201).json(invoice)
      }

      if (action === "create-receipt") {
        const payload = req.body.payload as ReceiptCreationPayload
        if (!payload) {
          return res.status(400).json({ error: "Missing receipt payload" })
        }
        const receipt = await createBillingReceipt(payload)
        return res.status(201).json(receipt)
      }

      return res.status(400).json({ error: `Unsupported billing action: ${action}` })
    }

    res.setHeader("Allow", ["GET", "POST"])
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` })
  } catch (error: any) {
    console.error("/api/billing error", error)
    return res.status(500).json({ error: error?.message ?? "Unexpected billing error" })
  }
}
