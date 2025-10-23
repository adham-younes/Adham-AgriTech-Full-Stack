import type React from "react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Sprout, Leaf, Droplets, Cloud, BarChart3, MessageSquare, Sparkles, Shield, Zap } from "lucide-react"

// Force redeploy trigger v2
export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col bg-black">
      <section className="relative flex min-h-screen items-center justify-center overflow-hidden px-6 py-20">
        {/* Animated background grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#0a4d0a_1px,transparent_1px),linear-gradient(to_bottom,#0a4d0a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]" />

        {/* Glowing orbs */}
        <div className="absolute top-1/4 left-1/4 h-96 w-96 rounded-full bg-primary/20 blur-[120px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 h-96 w-96 rounded-full bg-emerald-500/20 blur-[120px] animate-pulse delay-1000" />

        <div className="relative z-10 mx-auto max-w-5xl text-center">
          <div className="mb-8 flex justify-center">
            <div className="glass-card flex h-24 w-24 items-center justify-center rounded-3xl shadow-3d shadow-primary/50 hover:shadow-primary/70 transition-all duration-300 hover:scale-110">
              <Sprout className="h-12 w-12 text-primary drop-shadow-glow" />
            </div>
          </div>

          <h1 className="mb-6 text-6xl font-bold tracking-tight sm:text-7xl md:text-8xl bg-gradient-to-b from-white via-white to-white/60 bg-clip-text text-transparent drop-shadow-2xl">
            Adham AgriTech
          </h1>
          <p className="mb-4 text-3xl font-bold text-primary drop-shadow-glow sm:text-4xl">Smart Agriculture Platform</p>
          <p className="mx-auto mb-12 max-w-2xl text-lg text-gray-400 sm:text-xl leading-relaxed">
            Comprehensive farm management system using AI, satellite technology, and blockchain to improve productivity and optimize resources
          </p>

          <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Button
              asChild
              size="lg"
              className="text-lg shadow-3d shadow-primary/50 hover:shadow-primary/70 hover:scale-105 transition-all duration-300"
            >
              <Link href="/auth/signup">
                <Sparkles className="mr-2 h-5 w-5" />
                Start Free Now
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="text-lg glass-card border-primary/30 hover:border-primary/60 hover:scale-105 transition-all duration-300 bg-transparent"
            >
              <Link href="/auth/login">Sign In</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="px-6 py-20 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-primary/5 to-black" />
        <div className="mx-auto max-w-6xl relative z-10">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-4xl font-bold sm:text-5xl bg-gradient-to-b from-white to-gray-400 bg-clip-text text-transparent">
              Platform Features
            </h2>
            <p className="text-lg text-gray-400">Advanced solutions for efficient farm management</p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <FeatureCard
              icon={<Leaf className="h-8 w-8" />}
              title="Crop Monitoring"
              description="Advanced satellite imagery with NDVI/EVI indicators for real-time crop health tracking and yield prediction"
            />
            <FeatureCard
              icon={<Droplets className="h-8 w-8" />}
              title="Smart Irrigation"
              description="AI-powered irrigation control with soil moisture sensors and weather-based scheduling for optimal water usage"
            />
            <FeatureCard
              icon={<Cloud className="h-8 w-8" />}
              title="Weather Forecasts"
              description="Hyper-local 14-day weather predictions with precipitation, temperature, and wind patterns for precise planning"
            />
            <FeatureCard
              icon={<BarChart3 className="h-8 w-8" />}
              title="Soil Analysis"
              description="Comprehensive soil composition analysis with smart fertilizer recommendations and irrigation optimization"
            />
            <FeatureCard
              icon={<MessageSquare className="h-8 w-8" />}
              title="AI Assistant"
              description="24/7 agricultural AI expert that provides personalized advice, pest identification, and treatment recommendations"
            />
            <FeatureCard
              icon={<Shield className="h-8 w-8" />}
              title="Blockchain Technology"
              description="Secure land ownership records, transparent supply chain tracking, and smart contracts for automated operations"
            />
          </div>
        </div>
      </section>

      <section className="px-6 py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-emerald-500/10 to-primary/10" />
        <div className="mx-auto max-w-6xl relative z-10">
          <div className="grid gap-8 sm:grid-cols-3">
            <StatCard number="15,000+" label="Active Farms" />
            <StatCard number="75,000+" label="Hectares Managed" />
            <StatCard number="40%" label="Avg. Productivity Increase" />
          </div>
        </div>
      </section>

      <section className="px-6 py-20 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-primary/10 to-black" />
        <div className="mx-auto max-w-4xl text-center relative z-10">
          <div className="glass-card p-12 rounded-3xl shadow-3d">
            <Zap className="h-16 w-16 text-primary mx-auto mb-6 drop-shadow-glow" />
            <h2 className="mb-6 text-4xl font-bold sm:text-5xl bg-gradient-to-b from-white to-gray-400 bg-clip-text text-transparent">
              Transform Your Farming Operations Today
            </h2>
            <p className="mb-8 text-lg text-gray-400">
              Join 15,000+ farmers already using Adham AgriTech to increase productivity by up to 40%
            </p>
            <Button
              asChild
              size="lg"
              className="text-lg shadow-3d shadow-primary/50 hover:shadow-primary/70 hover:scale-105 transition-all duration-300"
            >
              <Link href="/auth/signup">
                <Sparkles className="mr-2 h-5 w-5" />
                Get Started
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <footer className="border-t border-primary/20 bg-black/50 backdrop-blur-xl px-6 py-8">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-gray-400">© 2025 Adham AgriTech. All rights reserved.</p>
            <Link href="/partners" className="text-sm text-primary hover:text-primary/80 transition-colors">
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
    <div className="group glass-card rounded-2xl p-6 shadow-3d hover:shadow-3d-lg transition-all duration-300 hover:scale-105 hover:border-primary/50">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-primary/20 text-primary shadow-inner transition-all duration-300 group-hover:bg-primary group-hover:text-black group-hover:shadow-glow">
        {icon}
      </div>
      <h3 className="mb-2 text-xl font-semibold text-white">{title}</h3>
      <p className="text-gray-400 leading-relaxed">{description}</p>
    </div>
  )
}

function StatCard({ number, label }: { number: string; label: string }) {
  return (
    <div className="glass-card rounded-2xl p-8 text-center shadow-3d hover:shadow-3d-lg transition-all duration-300 hover:scale-105">
      <p className="text-5xl font-bold text-primary drop-shadow-glow mb-2">{number}</p>
      <p className="text-gray-400">{label}</p>
    </div>
  )
}
