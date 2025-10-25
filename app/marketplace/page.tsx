import type { Metadata } from "next"
import Link from "next/link"
import { Suspense } from "react"
import { ArrowUpRight, Boxes, Factory, Globe2, Leaf, Loader2, ShoppingCart, Warehouse } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import LanguageToggle from "@/components/language-toggle"
import { getMarketplaceCatalog } from "@/lib/marketplace/catalog"

export const metadata: Metadata = {
  title: "Marketplace | Adham AgriTech",
  description:
    "Unified agri-inputs marketplace sourcing catalog that bridges Alibaba, Amazon, and localized suppliers into Adham AgriTech.",
}

type MarketplacePageProps = {
  searchParams?: {
    q?: string
    category?: string
  }
}

export default async function MarketplacePage({ searchParams }: MarketplacePageProps) {
  const filters = {
    query: searchParams?.q?.trim() || undefined,
    category: searchParams?.category?.trim() || undefined,
  }

  const catalog = await getMarketplaceCatalog(filters)

  const categories = Array.from(
    new Set(
      catalog.items
        .flatMap((product) => product.tags ?? [])
        .filter(Boolean)
        .map((tag) => tag.toLowerCase()),
    ),
  )

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="sticky top-0 z-50 border-b border-primary/20 bg-background/80 backdrop-blur-xl px-4 sm:px-6 py-4">
        <div className="mx-auto max-w-7xl flex items-center justify-between gap-4">
          <div className="flex items-center gap-6">
            <Link href="/" className="text-xl sm:text-2xl font-bold text-primary hover:text-primary/80 transition-colors">
              Adham AgriTech
            </Link>
            <nav className="hidden lg:flex items-center gap-5 text-sm text-gray-300">
              <Link href="/dashboard" className="hover:text-white transition-colors">
                Platform
              </Link>
              <Link href="/marketplace" className="text-primary font-semibold">
                Marketplace
              </Link>
              <Link href="/docs" className="hover:text-white transition-colors">
                Knowledge
              </Link>
              <Link href="/dashboard/satellite" className="hover:text-white transition-colors">
                Satellites
              </Link>
            </nav>
          </div>
          <div className="flex items-center gap-3">
            <Button asChild size="sm" variant="outline" className="glass-card border-primary/30 bg-transparent">
              <Link href="/">Back to Overview</Link>
            </Button>
            <LanguageToggle />
          </div>
        </div>
      </header>

      <main className="flex-1">
        <section className="relative overflow-hidden px-4 sm:px-6 py-12 sm:py-20">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(34,197,94,0.18),_transparent_60%)]" />
          <div className="absolute inset-0 bg-[linear-gradient(to_right,_rgba(15,76,27,0.4),_transparent_55%)]" />
          <div className="relative z-10 mx-auto flex max-w-5xl flex-col gap-8 text-center">
            <Badge variant="secondary" className="mx-auto border border-primary/40 bg-primary/20 text-primary">
              Global Inputs Exchange
            </Badge>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight bg-gradient-to-b from-white to-gray-400 bg-clip-text text-transparent">
              Supply orchestration for every agronomy mission
            </h1>
            <p className="mx-auto max-w-3xl text-base sm:text-lg text-gray-300">
              Connect growers to vetted suppliers, live pricing, and logistics intelligence. The marketplace synthesizes Alibaba, Amazon Business, and localized cooperatives into a single purchasing lane with traceability and fulfilment telemetry.
            </p>
            <form className="glass-card mx-auto flex w-full flex-col gap-3 rounded-3xl border border-primary/30 bg-black/30 p-4 sm:p-6 shadow-3d sm:flex-row sm:items-center">
              <div className="flex-1">
                <label htmlFor="search" className="sr-only">
                  Search inputs
                </label>
                <Input
                  id="search"
                  name="q"
                  defaultValue={filters.query ?? ""}
                  placeholder="Search for seeds, fertigation systems, drones, sensors..."
                  className="h-12 rounded-2xl border-primary/30 bg-black/40 text-sm sm:text-base"
                />
              </div>
              <div className="flex flex-1 flex-col gap-3 sm:flex-row">
                <Input
                  id="category"
                  name="category"
                  defaultValue={filters.category ?? ""}
                  placeholder="Category (e.g. irrigation, greenhouse, AI)"
                  className="h-12 rounded-2xl border-primary/30 bg-black/40 text-sm sm:text-base"
                />
                <Button type="submit" size="lg" className="h-12 rounded-2xl shadow-3d shadow-primary/50 hover:shadow-primary/70">
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  Fetch Offers
                </Button>
              </div>
            </form>
            <div className="flex flex-wrap items-center justify-center gap-2 text-xs sm:text-sm text-primary/70">
              <span className="rounded-full border border-primary/30 bg-primary/10 px-3 py-1">Alibaba + Amazon connectors</span>
              <span className="rounded-full border border-primary/30 bg-primary/10 px-3 py-1">Live logistics telemetry</span>
              <span className="rounded-full border border-primary/30 bg-primary/10 px-3 py-1">Smart agronomy bundling</span>
            </div>
          </div>
        </section>

        <section className="px-4 sm:px-6 py-10 sm:py-16">
          <div className="mx-auto flex max-w-6xl flex-col gap-8">
            <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h2 className="text-3xl sm:text-4xl font-semibold text-white">Live sourcing matrix</h2>
                <p className="text-sm sm:text-base text-gray-400">
                  Provider health, capabilities, and deployment requirements at a glance.
                </p>
              </div>
              <p className="text-xs sm:text-sm text-primary/70">
                Generated {new Date(catalog.generatedAt).toLocaleString()} with {catalog.items.length} available offers
              </p>
            </header>
            <div className="grid gap-4 sm:gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {catalog.providers.map((provider) => (
                <Card
                  key={provider.name}
                  className="glass-card border-primary/20 bg-black/40 backdrop-blur">
                  <CardHeader className="flex flex-col gap-3">
                    <div className="flex items-center justify-between gap-3">
                      <CardTitle className="text-lg sm:text-xl text-white">{provider.label}</CardTitle>
                      <Badge
                        variant={provider.status === "ok" ? "default" : provider.status === "error" ? "destructive" : "secondary"}
                        className="capitalize"
                      >
                        {provider.status}
                      </Badge>
                    </div>
                    <CardDescription className="text-xs text-primary/70">
                      Latency: {provider.latencyMs} ms
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex flex-wrap gap-2">
                      {provider.capabilities.map((capability) => (
                        <Badge key={capability} variant="outline" className="border-primary/30 text-primary/80">
                          {capability.replace(/-/g, " ")}
                        </Badge>
                      ))}
                    </div>
                    {provider.message && (
                      <p className="text-xs text-amber-400/80">
                        {provider.message}
                      </p>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="relative overflow-hidden px-4 sm:px-6 py-12 sm:py-20">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/10 to-transparent" />
          <div className="relative z-10 mx-auto max-w-6xl">
            <div className="mb-8 sm:mb-12 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h2 className="text-3xl sm:text-4xl font-semibold text-white">Curated offers</h2>
                <p className="text-sm sm:text-base text-gray-400">
                  Normalized pricing, availability, and fulfilment windows ready for farmer checkouts.
                </p>
              </div>
              {categories.length > 0 && (
                <div className="flex flex-wrap gap-2 text-xs sm:text-sm text-primary/70">
                  {categories.slice(0, 8).map((category) => (
                    <Badge key={category} variant="outline" className="border-primary/30 bg-primary/5 text-primary/80">
                      {category}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {catalog.items.length === 0 && (
                <Card className="glass-card border-primary/20 bg-black/50 text-center">
                  <CardHeader>
                    <CardTitle className="text-xl text-white">No offers yet</CardTitle>
                    <CardDescription className="text-gray-400">
                      Try adjusting the query or connect provider credentials to unlock enterprise feeds.
                    </CardDescription>
                  </CardHeader>
                </Card>
              )}
              {catalog.items.map((product) => {
                const formattedPrice = new Intl.NumberFormat("en-US", {
                  style: "currency",
                  currency: product.currency,
                  maximumFractionDigits: 2,
                }).format(product.price)

                const availabilityLabel =
                  product.availability === "in_stock"
                    ? "In stock"
                    : product.availability === "limited"
                      ? "Limited"
                      : "Out of stock"

                const availabilityVariant =
                  product.availability === "in_stock"
                    ? "default"
                    : product.availability === "limited"
                      ? "secondary"
                      : "destructive"

                return (
                  <Card key={product.id} className="glass-card flex flex-col border-primary/20 bg-black/50">
                    <div className="relative aspect-[4/3] overflow-hidden rounded-b-[2.5rem] rounded-t-3xl bg-gradient-to-br from-primary/10 via-black/40 to-black">
                      {product.image ? (
                        <div
                          className="absolute inset-0 bg-cover bg-center opacity-80"
                          style={{ backgroundImage: `url(${product.image})` }}
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center text-primary/60">
                          <Leaf className="h-12 w-12" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/10 to-transparent" />
                      <div className="absolute bottom-3 left-3 flex gap-2">
                        <Badge variant="outline" className="border-primary/40 bg-primary/10 text-primary">
                          {product.providerLabel}
                        </Badge>
                        <Badge variant={availabilityVariant} className="backdrop-blur">
                          {availabilityLabel}
                        </Badge>
                      </div>
                    </div>
                    <CardContent className="flex flex-1 flex-col gap-4 py-6">
                      <div className="space-y-2">
                        <h3 className="text-lg font-semibold text-white">{product.title}</h3>
                        <p className="text-sm text-gray-400 line-clamp-3">{product.description}</p>
                      </div>
                      <div className="mt-auto space-y-3">
                        <div className="flex items-center justify-between text-sm text-primary/80">
                          <span className="text-xl font-semibold text-white">{formattedPrice}</span>
                          {typeof product.rating !== "undefined" && (
                            <span className="rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs">
                              Rating {product.rating}
                            </span>
                          )}
                        </div>
                        <div className="flex flex-wrap gap-2 text-xs text-primary/70">
                          {product.tags?.slice(0, 4).map((tag) => (
                            <Badge key={tag} variant="outline" className="border-primary/30 bg-transparent text-primary/70">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                        {product.shippingEstimateDays && (
                          <p className="text-xs text-gray-400">
                            Ships in {product.shippingEstimateDays[0]}–{product.shippingEstimateDays[1]} days
                          </p>
                        )}
                        <Button
                          asChild
                          variant="outline"
                          className="w-full justify-center rounded-2xl border-primary/40 bg-transparent hover:border-primary/70"
                        >
                          <Link href={product.url} target="_blank" rel="noreferrer">
                            View supplier
                            <ArrowUpRight className="ml-2 h-4 w-4" />
                          </Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>
        </section>

        <section className="px-4 sm:px-6 py-12 sm:py-20">
          <div className="mx-auto max-w-6xl space-y-10">
            <div className="text-center">
              <h2 className="text-3xl sm:text-4xl font-semibold text-white">Operational playbooks</h2>
              <p className="mx-auto mt-3 max-w-3xl text-sm sm:text-base text-gray-400">
                Best practices distilled from top agritech applications ensure resilient commerce, cross-platform delivery, and data integrity.
              </p>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              <Card className="glass-card border-primary/20 bg-black/40">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-white">
                    <Factory className="h-5 w-5 text-primary" />
                    Composable supply rails
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm text-gray-400">
                  <p>
                    Mirror Agrio-scale resilience with domain-driven services: catalogue orchestration, order lifecycle, quality assurance, and compliance audits live in isolated bounded contexts with contract tests.
                  </p>
                  <ul className="list-disc space-y-1 pl-5 text-xs text-primary/70">
                    <li>Adopt event sourcing for fulfilment milestones and telemetry.</li>
                    <li>Leverage background jobs for label generation, customs docs, and cold chain tracking.</li>
                    <li>Expose GraphQL + REST surfaces with strict schema governance.</li>
                  </ul>
                </CardContent>
              </Card>
              <Card className="glass-card border-primary/20 bg-black/40">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-white">
                    <Globe2 className="h-5 w-5 text-primary" />
                    Cross-platform experiences
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm text-gray-400">
                  <p>
                    Ship the web app as a Progressive Web App with offline bundles, background sync, and push notifications while sharing UI primitives with the forthcoming React Native client.
                  </p>
                  <ul className="list-disc space-y-1 pl-5 text-xs text-primary/70">
                    <li>Design tokens unify typography, color, and spatial rhythm.</li>
                    <li>Leverage Expo Router + Next.js shared packages for device parity.</li>
                    <li>Bundle agronomy models via TensorFlow.js & on-device WASM for offline diagnostics.</li>
                  </ul>
                </CardContent>
              </Card>
              <Card className="glass-card border-primary/20 bg-black/40">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-white">
                    <Warehouse className="h-5 w-5 text-primary" />
                    Monetization & trust
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm text-gray-400">
                  <p>
                    Layer transparent pricing with modular subscriptions: scouting credits, satellite hectares, and agronomist consults. Integrate Stripe, Paymob, or regional PSPs via PCI-compliant webhooks.
                  </p>
                  <ul className="list-disc space-y-1 pl-5 text-xs text-primary/70">
                    <li>Offer smart bundles that auto-include logistics and agronomy support.</li>
                    <li>Issue blockchain-backed provenance certificates per shipment.</li>
                    <li>Automate tax/compliance via localized rate engines.</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <section className="px-4 sm:px-6 py-12 sm:py-20">
          <div className="mx-auto max-w-5xl">
            <div className="glass-card overflow-hidden rounded-3xl border border-primary/20 bg-black/40 shadow-3d">
              <div className="grid gap-6 lg:grid-cols-[1.2fr,0.8fr]">
                <div className="space-y-4 p-8 sm:p-10">
                  <h2 className="text-3xl font-semibold text-white">Education, simulations, and 3D agronomy labs</h2>
                  <p className="text-sm sm:text-base text-gray-400">
                    Publish bilingual masterclasses, NDVI storytelling, and volumetric crop stress simulations. Each learning pack doubles as onboarding for the diagnostic mobile app, paving the way toward an Agrio-class ecosystem.
                  </p>
                  <ul className="list-disc space-y-2 pl-5 text-xs sm:text-sm text-primary/70">
                    <li>Stream photorealistic canopy reconstructions and moisture heatmaps.</li>
                    <li>Bundle disease encyclopedias with AI copilots for instant remediation guidance.</li>
                    <li>Localize content through community agronomists and voice interfaces.</li>
                  </ul>
                  <Button asChild size="lg" className="rounded-2xl shadow-3d shadow-primary/50 hover:shadow-primary/70">
                    <Link href="/dashboard/insights">
                      Launch knowledge hub
                      <ArrowUpRight className="ml-2 h-5 w-5" />
                    </Link>
                  </Button>
                </div>
                <div className="relative flex items-center justify-center bg-gradient-to-br from-primary/10 via-black/50 to-black">
                  <div className="absolute h-40 w-40 rounded-full bg-primary/20 blur-3xl" />
                  <div className="relative flex h-56 w-56 items-center justify-center rounded-[3rem] border border-primary/20 bg-black/60 shadow-3d">
                    <Suspense fallback={<Loader2 className="h-10 w-10 animate-spin text-primary" />}>
                      <div className="glass-card flex h-48 w-48 flex-col items-center justify-center gap-3 rounded-[2.5rem] border border-primary/20 bg-black/50 text-center text-primary/80">
                        <Boxes className="h-10 w-10 text-primary" />
                        <p className="text-sm font-semibold text-white">Immersive 3D modules</p>
                        <p className="px-6 text-xs text-primary/70">
                          WebXR-ready experiences guide farmers through canopy scans, soil augers, and nutrient labs.
                        </p>
                      </div>
                    </Suspense>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-primary/20 bg-background/60 px-4 sm:px-6 py-6">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 text-xs sm:flex-row sm:text-sm">
          <p className="text-gray-400">© {new Date().getFullYear()} Adham AgriTech Marketplace Initiative</p>
          <div className="flex items-center gap-3 text-primary/80">
            <Link href="/docs" className="hover:text-primary">
              Documentation
            </Link>
            <Link href="/beta" className="hover:text-primary">
              Join the beta
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
