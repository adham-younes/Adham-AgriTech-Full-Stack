"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import { RefreshCw, Download, Wallet, TrendingUp, PieChart, CalendarRange } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { RevenueSummary, BillingInvoice, BillingReceipt } from "@/lib/domain/types/billing"
import { useFeatureAccess } from "@/lib/domain/hooks/useFeatureAccess"

interface RevenueDashboardState {
  summary: RevenueSummary | null
  loading: boolean
  error: string | null
}

const currencyFormatter = (amount: number, currency: string) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency }).format(amount)

export default function RevenueDashboardPage() {
  const [state, setState] = useState<RevenueDashboardState>({ summary: null, loading: true, error: null })
  const { trackUsage } = useFeatureAccess()

  const fetchSummary = useCallback(async () => {
    setState((previous) => ({ ...previous, loading: true, error: null }))
    try {
      const response = await fetch("/api/billing?type=revenue")
      if (!response.ok) {
        throw new Error(`Failed to load revenue summary (${response.status})`)
      }
      const data = (await response.json()) as RevenueSummary
      setState({ summary: data, loading: false, error: null })
      void trackUsage("revenue-analytics", "update", 1, { source: "revenue-dashboard" })
    } catch (error: any) {
      console.error("revenue-dashboard:fetch", error)
      setState((previous) => ({ ...previous, loading: false, error: error?.message ?? "Unable to load revenue metrics" }))
    }
  }, [trackUsage])

  useEffect(() => {
    void fetchSummary()
  }, [fetchSummary])

  const currencyTotals = useMemo(() => {
    if (!state.summary) return []

    const totals = new Map<string, { invoiced: number; paid: number; outstanding: number }>()

    state.summary.invoices.forEach((invoice) => {
      const currency = invoice.currency
      const entry = totals.get(currency) ?? { invoiced: 0, paid: 0, outstanding: 0 }
      entry.invoiced += invoice.total
      if (invoice.status !== "paid") {
        entry.outstanding += invoice.total
      }
      totals.set(currency, entry)
    })

    state.summary.receipts.forEach((receipt) => {
      const currency = receipt.currency
      const entry = totals.get(currency) ?? { invoiced: 0, paid: 0, outstanding: 0 }
      entry.paid += receipt.amountPaid
      totals.set(currency, entry)
    })

    return Array.from(totals.entries()).map(([currency, value]) => ({ currency, ...value }))
  }, [state.summary])

  const renderInvoiceRow = (invoice: BillingInvoice) => (
    <tr key={invoice.id} className="border-b last:border-0">
      <td className="py-2 text-sm font-medium">{invoice.invoiceNumber}</td>
      <td className="py-2 text-sm text-muted-foreground">{new Date(invoice.issuedAt).toLocaleDateString()}</td>
      <td className="py-2 text-sm">{currencyFormatter(invoice.total, invoice.currency)}</td>
      <td className="py-2 text-sm capitalize">
        <Badge variant={invoice.status === "paid" ? "default" : "outline"} className={invoice.status === "paid" ? "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-300" : "border-border"}>
          {invoice.status}
        </Badge>
      </td>
      <td className="py-2 text-sm text-muted-foreground">{invoice.provider}</td>
    </tr>
  )

  const renderReceiptRow = (receipt: BillingReceipt) => (
    <tr key={receipt.id} className="border-b last:border-0">
      <td className="py-2 text-sm font-medium">{receipt.paymentIntentId}</td>
      <td className="py-2 text-sm text-muted-foreground">{new Date(receipt.paidAt).toLocaleDateString()}</td>
      <td className="py-2 text-sm">{currencyFormatter(receipt.amountPaid, receipt.currency)}</td>
      <td className="py-2 text-sm text-muted-foreground">{receipt.provider}</td>
      <td className="py-2 text-sm text-muted-foreground">{receipt.paymentMethod}</td>
    </tr>
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight">Revenue Intelligence</h1>
          <p className="text-sm text-muted-foreground">
            Monitor invoice status, receipts, and payment provider performance across Stripe & PayTabs.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => void fetchSummary()} disabled={state.loading} className="gap-2">
            <RefreshCw className={`h-4 w-4 ${state.loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
          <Button variant="secondary" className="gap-2" disabled>
            <Download className="h-4 w-4" />
            Export CSV
          </Button>
        </div>
      </div>

      {state.error && (
        <Card className="border-destructive/40 bg-destructive/10">
          <CardHeader>
            <CardTitle className="text-destructive">Billing data unavailable</CardTitle>
            <CardDescription>{state.error}</CardDescription>
          </CardHeader>
        </Card>
      )}

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {currencyTotals.map((entry) => (
          <Card key={entry.currency} className="border border-border/60">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Wallet className="h-4 w-4 text-primary" /> {entry.currency}
              </CardTitle>
              <CardDescription>Aggregated across all workspaces</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Invoiced</span>
                <span className="font-semibold">{currencyFormatter(entry.invoiced, entry.currency)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Paid</span>
                <span className="font-semibold text-green-600 dark:text-green-400">{currencyFormatter(entry.paid, entry.currency)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Outstanding</span>
                <span className="font-semibold text-amber-600 dark:text-amber-400">{currencyFormatter(entry.outstanding, entry.currency)}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {state.summary && (
        <div className="grid gap-4 lg:grid-cols-3">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <TrendingUp className="h-5 w-5 text-primary" /> Invoice Pipeline
              </CardTitle>
              <CardDescription>Automated invoices generated from subscriptions and usage-based billing.</CardDescription>
            </CardHeader>
            <CardContent className="overflow-x-auto">
              <table className="w-full min-w-[480px] text-left">
                <thead>
                  <tr className="border-b text-xs uppercase tracking-wide text-muted-foreground">
                    <th className="py-2">Invoice</th>
                    <th className="py-2">Issued</th>
                    <th className="py-2">Amount</th>
                    <th className="py-2">Status</th>
                    <th className="py-2">Provider</th>
                  </tr>
                </thead>
                <tbody>{state.summary.invoices.map(renderInvoiceRow)}</tbody>
              </table>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <PieChart className="h-5 w-5 text-primary" /> Provider Breakdown
              </CardTitle>
              <CardDescription>Stripe vs PayTabs settlements for the selected window.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {state.summary.breakdownByProvider.map((entry) => (
                <div key={entry.provider} className="space-y-1 rounded-lg border border-border/60 p-3">
                  <div className="flex items-center justify-between text-sm font-medium">
                    <span className="capitalize">{entry.provider}</span>
                    <Badge variant="outline" className="text-xs">{entry.totalPaid ? "Active" : "Pending"}</Badge>
                  </div>
                  <div className="text-xs text-muted-foreground">Invoices: {entry.totalInvoiced}</div>
                  <div className="text-xs text-muted-foreground">Paid: {entry.totalPaid}</div>
                  <div className="text-xs text-muted-foreground">Refunded: {entry.totalRefunded}</div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      )}

      {state.summary && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <CalendarRange className="h-5 w-5 text-primary" /> Receipts Ledger
            </CardTitle>
            <CardDescription>Receipts are generated instantly after payment confirmation and emailed to workspace admins.</CardDescription>
          </CardHeader>
          <CardContent className="overflow-x-auto">
            <table className="w-full min-w-[480px] text-left">
              <thead>
                <tr className="border-b text-xs uppercase tracking-wide text-muted-foreground">
                  <th className="py-2">Payment Intent</th>
                  <th className="py-2">Paid On</th>
                  <th className="py-2">Amount</th>
                  <th className="py-2">Provider</th>
                  <th className="py-2">Method</th>
                </tr>
              </thead>
              <tbody>{state.summary.receipts.map(renderReceiptRow)}</tbody>
            </table>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
