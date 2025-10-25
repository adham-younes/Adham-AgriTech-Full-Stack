import type React from "react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import {
  Sprout,
  Leaf,
  Droplets,
  Cloud,
  BarChart3,
  MessageSquare,
  Sparkles,
  Shield,
  Zap,
  Smartphone,
  Satellite,
  Globe,
  BrainCircuit,
  ArrowUpRight,
} from "lucide-react"
import LanguageToggle from "@/components/language-toggle"
import { BetaSignupForm } from "@/components/beta-signup-form"

// Force redeploy trigger for DNS update
export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Header with language toggle */}
      <header className="sticky top-0 z-50 border-b border-primary/20 bg-background/80 backdrop-blur-xl px-4 sm:px-6 py-4">
        <div className="mx-auto max-w-7xl flex items-center justify-between">
          <div className="text-xl sm:text-2xl font-bold text-primary">Adham AgriTech</div>
          <LanguageToggle />
        </div>
      </header>

      <section className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 sm:px-6 py-12 sm:py-20">
        {/* Animated background grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#0a4d0a_1px,transparent_1px),linear-gradient(to_bottom,#0a4d0a_1px,transparent_1px)] bg-[size:2rem_2rem] sm:bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]" />

        {/* Glowing orbs */}
        <div className="absolute top-1/4 left-1/4 h-48 w-48 sm:h-96 sm:w-96 rounded-full bg-primary/20 blur-[80px] sm:blur-[120px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 h-48 w-48 sm:h-96 sm:w-96 rounded-full bg-emerald-500/20 blur-[80px] sm:blur-[120px] animate-pulse delay-1000" />

        <div className="relative z-10 mx-auto max-w-5xl text-center">
          <div className="mb-6 sm:mb-8 flex justify-center">
            <div className="glass-card flex h-16 w-16 sm:h-24 sm:w-24 items-center justify-center rounded-3xl shadow-3d shadow-primary/50 hover:shadow-primary/70 transition-all duration-300 hover:scale-110">
              <Sprout className="h-8 w-8 sm:h-12 sm:w-12 text-primary drop-shadow-glow" />
            </div>
          </div>

          <h1 className="mb-4 sm:mb-6 text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight bg-gradient-to-b from-white via-white to-white/60 bg-clip-text text-transparent drop-shadow-2xl">
            Adham AgriTech
          </h1>
          <p className="mb-3 sm:mb-4 text-xl sm:text-3xl font-bold text-primary drop-shadow-glow">
            Smart Agriculture Platform
          </p>
          <p className="mx-auto mb-8 sm:mb-12 max-w-2xl text-base sm:text-lg text-gray-400 leading-relaxed">
            Comprehensive farm management system using AI, satellite technology, and blockchain to improve productivity and optimize resources
          </p>

          <div className="flex flex-col gap-3 sm:gap-4 sm:flex-row sm:justify-center">
            <Button
              asChild
              size="lg"
              className="text-base sm:text-lg shadow-3d shadow-primary/50 hover:shadow-primary/70 hover:scale-105 transition-all duration-300"
            >
              <Link href="/dashboard">
                <Sparkles className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                Explore Platform
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="text-base sm:text-lg glass-card border-primary/30 hover:border-primary/60 hover:scale-105 transition-all duration-300 bg-transparent"
            >
              <Link href="/dashboard/satellite">View Satellite Map</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="px-4 sm:px-6 py-12 sm:py-20 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-primary/5 to-background" />
        <div className="mx-auto max-w-6xl relative z-10">
          <div className="mb-12 sm:mb-16 text-center">
            <h2 className="mb-3 sm:mb-4 text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-b from-white to-gray-400 bg-clip-text text-transparent">
              Platform Features
            </h2>
            <p className="text-base sm:text-lg text-gray-400">Advanced solutions for efficient farm management</p>
          </div>
          <div className="grid gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <FeatureCard
              icon={<Leaf className="h-6 w-6 sm:h-8 sm:w-8" />}
              title="Crop Monitoring"
              description="Track crop health using satellite imagery and NDVI/EVI indicators"
            />
            <FeatureCard
              icon={<Droplets className="h-6 w-6 sm:h-8 sm:w-8" />}
              title="Smart Irrigation"
              description="Control irrigation systems and schedule watering based on soil and weather data"
            />
            <FeatureCard
              icon={<Cloud className="h-6 w-6 sm:h-8 sm:w-8" />}
              title="Weather Forecast"
              description="Accurate 7-day weather forecasts for better agricultural activity planning"
            />
            <FeatureCard
              icon={<BarChart3 className="h-6 w-6 sm:h-8 sm:w-8" />}
              title="Soil Analysis"
              description="Comprehensive soil analysis with smart fertilizer and irrigation recommendations"
            />
            <FeatureCard
              icon={<MessageSquare className="h-6 w-6 sm:h-8 sm:w-8" />}
              title="AI Assistant"
              description="Smart agricultural assistant that answers your questions and provides personalized advice"
            />
            <FeatureCard
              icon={<Shield className="h-6 w-6 sm:h-8 sm:w-8" />}
              title="Blockchain"
              description="Smart contracts and NFTs for land ownership and complete transparency"
            />
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden px-4 sm:px-6 py-12 sm:py-20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(34,197,94,0.18),transparent_55%)]" />
        <div className="absolute inset-y-0 left-1/2 w-px bg-gradient-to-b from-transparent via-primary/40 to-transparent opacity-60" />
        <div className="relative z-10 mx-auto max-w-6xl">
          <div className="mb-12 sm:mb-16 text-center">
            <p className="mx-auto mb-3 sm:mb-4 w-fit rounded-full border border-primary/30 bg-primary/10 px-4 py-1 text-xs sm:text-sm uppercase tracking-[0.3em] text-primary">
              Global Vision 2025
            </p>
            <h2 className="mb-4 text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-b from-white to-gray-400 bg-clip-text text-transparent">
              Towards a Planet-Scale Agritech Companion
            </h2>
            <p className="text-base sm:text-lg text-gray-400 max-w-3xl mx-auto">
              We are scaling Adham AgriTech into a holistic service that mirrors the Agrio experience—combining immersive design, AI copilots, and orbital intelligence with actionable agronomy guidance in every language.
            </p>
          </div>
          <div className="grid gap-6 sm:gap-8 lg:grid-cols-3">
            <FutureCard
              icon={<Smartphone className="h-6 w-6 sm:h-8 sm:w-8" />}
              title="AI Mobile Lab"
              description="Capture plant diseases with guided camera workflows, instant edge inference, and offline-first syncing."
              highlights={[
                "Augmented reality framing for leaf, fruit, and canopy scans",
                "Disease diagnostics trained on regional crop datasets",
                "Prescription reports that sync back to farmer dashboards",
              ]}
            />
            <FutureCard
              icon={<Satellite className="h-6 w-6 sm:h-8 sm:w-8" />}
              title="Orbital Intelligence"
              description="Fuse high-resolution satellite feeds, NDVI, and chlorophyll analytics into live agronomic alerts."
              highlights={[
                "Daily NDVI/NDWI composites with anomaly detection",
                "True-color and infrared layers delivered inside interactive 3D maps",
                "Soil moisture and fertigation forecasting via physics-informed AI",
              ]}
            />
            <FutureCard
              icon={<Globe className="h-6 w-6 sm:h-8 sm:w-8" />}
              title="Global Cooperative"
              description="Launch localized agronomy marketplaces, multilingual coaches, and verified input supply chains."
              highlights={[
                "Geo-routed agronomists and extension officers for live support",
                "Tokenized traceability for produce and regenerative credits",
                "Localized playbooks co-created with farmer communities",
              ]}
            />
          </div>
        </div>
      </section>

      <section className="relative px-4 sm:px-6 py-12 sm:py-20">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-background to-primary/5" />
        <div className="relative z-10 mx-auto max-w-6xl">
          <div className="glass-card overflow-hidden rounded-3xl border border-primary/20 px-6 py-8 sm:px-10 sm:py-12 shadow-3d transition-all duration-300 hover:shadow-3d-lg">
            <div className="grid gap-8 lg:grid-cols-[1.15fr,0.85fr] lg:items-start">
              <div className="space-y-5 sm:space-y-6 text-center lg:text-left">
                <div className="mx-auto lg:mx-0 flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-2xl bg-primary/20 text-primary shadow-inner">
                  <BrainCircuit className="h-7 w-7 sm:h-9 sm:w-9" />
                </div>
                <div className="space-y-4">
                  <h3 className="text-2xl sm:text-3xl font-semibold text-white">
                    Mobile Diagnostic Studio — Beta Launch
                  </h3>
                  <p className="text-sm sm:text-base text-gray-400 leading-relaxed">
                    We are prototyping a smartphone app that pairs camera-based disease detection, soil nutrient scans, and satellite overlays into a single immersive 3D control center. Join the beta to co-create the future of agronomy intelligence.
                  </p>
                  <div className="grid gap-3 text-left sm:grid-cols-2 text-xs sm:text-sm text-primary/80">
                    <div className="glass-card rounded-2xl border border-primary/30 bg-primary/5 p-3">
                      <p className="font-semibold text-white/90">Edge AI toolkit</p>
                      <p className="mt-1 text-primary/70">Offline CNN inference, AR-guided framing, rapid sharepacks.</p>
                    </div>
                    <div className="glass-card rounded-2xl border border-primary/30 bg-primary/5 p-3">
                      <p className="font-semibold text-white/90">Orbital sync</p>
                      <p className="mt-1 text-primary/70">NDVI, NDWI, and chlorophyll overlays stream to scouting missions.</p>
                    </div>
                    <div className="glass-card rounded-2xl border border-primary/30 bg-primary/5 p-3">
                      <p className="font-semibold text-white/90">Collaborative triage</p>
                      <p className="mt-1 text-primary/70">Agronomist huddles, case history timelines, bilingual support.</p>
                    </div>
                    <div className="glass-card rounded-2xl border border-primary/30 bg-primary/5 p-3">
                      <p className="font-semibold text-white/90">Geospatial insights</p>
                      <p className="mt-1 text-primary/70">Soil, canopy, and fertigation anomalies surfaced in 3D terrain.</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2 text-xs sm:text-sm text-primary/80">
                    <span className="rounded-full border border-primary/30 bg-primary/10 px-3 py-1">NDVI & Chlorophyll Live Layers</span>
                    <span className="rounded-full border border-primary/30 bg-primary/10 px-3 py-1">Guided Field Scouting</span>
                    <span className="rounded-full border border-primary/30 bg-primary/10 px-3 py-1">Offline Agronomist Chat</span>
                  </div>
                  <Button
                    asChild
                    variant="outline"
                    size="lg"
                    className="glass-card border-primary/30 hover:border-primary/60 hover:scale-105 transition-all duration-300 bg-transparent"
                  >
                    <Link href="/dashboard/insights">
                      Learn More
                      <ArrowUpRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
                    </Link>
                  </Button>
                </div>
              </div>
              <div className="flex flex-col items-stretch gap-5">
                <div className="mx-auto flex w-full max-w-[11rem] sm:max-w-[14rem] justify-center">
                  <div className="relative">
                    <div className="absolute inset-0 rounded-3xl bg-primary/20 blur-2xl opacity-70" />
                    <div className="relative flex h-40 w-24 sm:h-48 sm:w-28 items-end justify-center rounded-[2rem] border border-primary/30 bg-gradient-to-br from-black via-primary/10 to-black p-4 shadow-3d">
                      <div className="h-full w-full rounded-[1.5rem] bg-black/80 p-3">
                        <div className="flex h-full flex-col justify-between rounded-2xl bg-gradient-to-b from-primary/20 via-black/70 to-black p-4 text-left text-xs text-gray-300">
                          <p className="font-semibold text-white/90">Field Scan</p>
                          <div className="space-y-1 text-[0.65rem]">
                            <p>• Capture leaf imagery</p>
                            <p>• Auto-detect stress zones</p>
                            <p>• Sync with satellite feed</p>
                          </div>
                          <p className="text-[0.65rem] text-primary/80">Realtime recommendations</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <BetaSignupForm />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 sm:px-6 py-12 sm:py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-emerald-500/10 to-primary/10" />
        <div className="mx-auto max-w-6xl relative z-10">
          <div className="grid gap-6 sm:gap-8 sm:grid-cols-3">
            <StatCard number="10,000+" label="Active Farms" />
            <StatCard number="50,000+" label="Hectares Managed" />
            <StatCard number="30%" label="Productivity Increase" />
          </div>
        </div>
      </section>

      <section className="px-4 sm:px-6 py-12 sm:py-20 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-primary/10 to-background" />
        <div className="mx-auto max-w-4xl text-center relative z-10">
          <div className="glass-card p-8 sm:p-12 rounded-3xl shadow-3d">
            <Zap className="h-12 w-12 sm:h-16 sm:w-16 text-primary mx-auto mb-4 sm:mb-6 drop-shadow-glow" />
            <h2 className="mb-4 sm:mb-6 text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-b from-white to-gray-400 bg-clip-text text-transparent">
              Ready to Improve Your Farm's Productivity?
            </h2>
            <p className="mb-6 sm:mb-8 text-base sm:text-lg text-gray-400">
              Join thousands of farmers using Adham AgriTech to manage their farms
            </p>
            <Button
              asChild
              size="lg"
              className="text-base sm:text-lg shadow-3d shadow-primary/50 hover:shadow-primary/70 hover:scale-105 transition-all duration-300"
            >
              <Link href="/dashboard">
                <Sparkles className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                Get Started
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <footer className="border-t border-primary/20 bg-background/50 backdrop-blur-xl px-4 sm:px-6 py-6 sm:py-8">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
            <p className="text-xs sm:text-sm text-gray-400">© 2025 Adham AgriTech. All rights reserved.</p>
            <Link href="/partners" className="text-xs sm:text-sm text-primary hover:text-primary/80 transition-colors">
              Our Partners
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode
  title: string
  description: string
}) {
  return (
    <div className="group glass-card rounded-2xl p-4 sm:p-6 shadow-3d hover:shadow-3d-lg transition-all duration-300 hover:scale-105 hover:border-primary/50">
      <div className="mb-3 sm:mb-4 flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-xl bg-primary/20 text-primary shadow-inner transition-all duration-300 group-hover:bg-primary group-hover:text-black group-hover:shadow-glow">
        {icon}
      </div>
      <h3 className="mb-2 text-lg sm:text-xl font-semibold text-white">{title}</h3>
      <p className="text-sm sm:text-base text-gray-400 leading-relaxed">{description}</p>
    </div>
  )
}

function FutureCard({
  icon,
  title,
  description,
  highlights,
}: {
  icon: React.ReactNode
  title: string
  description: string
  highlights: string[]
}) {
  return (
    <div className="group relative">
      <div className="absolute inset-0 rounded-3xl bg-primary/30 opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-60" />
      <div className="relative glass-card h-full overflow-hidden rounded-3xl border border-primary/20 p-6 sm:p-8 shadow-3d transition-all duration-500 transform-gpu group-hover:-translate-y-2 group-hover:rotate-[0.75deg] group-hover:scale-[1.02]">
        <div className="flex items-center justify-between">
          <div className="flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-2xl bg-primary/20 text-primary shadow-inner">
            {icon}
          </div>
          <span className="rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-[0.65rem] uppercase tracking-[0.3em] text-primary/80">
            Vision
          </span>
        </div>
        <h3 className="mt-6 text-xl sm:text-2xl font-semibold text-white">{title}</h3>
        <p className="mt-3 text-sm sm:text-base text-gray-400 leading-relaxed">{description}</p>
        <ul className="mt-6 space-y-3 text-left text-sm sm:text-base text-gray-300">
          {highlights.map((highlight) => (
            <li key={highlight} className="flex items-start gap-3">
              <span className="mt-1 h-2 w-2 rounded-full bg-primary/70" aria-hidden />
              <span>{highlight}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

function StatCard({ number, label }: { number: string; label: string }) {
  return (
    <div className="glass-card rounded-2xl p-6 sm:p-8 text-center shadow-3d hover:shadow-3d-lg transition-all duration-300 hover:scale-105">
      <p className="text-3xl sm:text-5xl font-bold text-primary drop-shadow-glow mb-2">{number}</p>
      <p className="text-sm sm:text-base text-gray-400">{label}</p>
    </div>
  )
}
