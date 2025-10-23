import type React from "react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Leaf, Droplets, Cloud, BarChart3, MessageSquare, Shield, Satellite, Microscope, Truck, Zap } from "lucide-react"

export default function ServicesPage() {
  return (
    <div className="flex min-h-screen flex-col bg-black">
      <section className="relative px-6 py-20">
        <div className="mx-auto max-w-6xl">
          <div className="mb-16 text-center">
            <h1 className="mb-6 text-5xl font-bold sm:text-6xl bg-gradient-to-b from-white via-white to-white/60 bg-clip-text text-transparent drop-shadow-2xl">
              Our Comprehensive Services
            </h1>
            <p className="mx-auto max-w-2xl text-xl text-gray-400">
              End-to-end agricultural solutions powered by advanced technology
            </p>
          </div>
          
          <div className="grid gap-8 lg:grid-cols-2 mb-16">
            <ServiceCard
              icon={<Satellite className="h-10 w-10" />}
              title="Satellite Crop Monitoring"
              description="Real-time satellite imagery analysis for crop health monitoring, yield prediction, and issue detection using NDVI and EVI indicators."
              features={["Daily satellite updates", "Growth pattern analysis", "Early problem detection", "Yield forecasting"]}
              price="$49/month per hectare"
            />
            
            <ServiceCard
              icon={<Droplets className="h-10 w-10" />}
              title="Smart Irrigation Management"
              description="AI-powered irrigation systems that optimize water usage based on soil moisture, weather forecasts, and crop requirements."
              features={["Automated scheduling", "Water usage optimization", "Soil moisture sensors", "Mobile alerts"]}
              price="$29/month per system"
            />
            
            <ServiceCard
              icon={<Cloud className="h-10 w-10" />}
              title="Precision Weather Forecasting"
              description="Hyper-local 14-day weather predictions with detailed precipitation, temperature, and wind pattern data for agricultural planning."
              features={["14-day forecasts", "Field-specific predictions", "Severe weather alerts", "Climate trend analysis"]}
              price="$19/month per farm"
            />
            
            <ServiceCard
              icon={<Microscope className="h-10 w-10" />}
              title="Advanced Soil Analysis"
              description="Comprehensive soil composition testing with detailed nutrient profiling and personalized fertilizer recommendations."
              features={["Complete nutrient analysis", "pH level testing", "Organic matter content", "Custom fertilizer plans"]}
              price="$99/analysis"
            />
          </div>
          
          <div className="grid gap-8 lg:grid-cols-2 mb-16">
            <ServiceCard
              icon={<MessageSquare className="h-10 w-10" />}
              title="24/7 AI Agricultural Assistant"
              description="Intelligent AI assistant providing instant answers to agricultural questions, pest identification, and treatment recommendations."
              features={["Instant expert advice", "Pest & disease identification", "Treatment recommendations", "Multilingual support"]}
              price="$39/month"
            />
            
            <ServiceCard
              icon={<Shield className="h-10 w-10" />}
              title="Blockchain Land Management"
              description="Secure land ownership records, transparent supply chain tracking, and smart contracts for automated agricultural operations."
              features={["Immutable land records", "Supply chain transparency", "Automated contracts", "Ownership verification"]}
              price="$59/month"
            />
          </div>
          
          <div className="glass-card rounded-3xl p-8 md:p-12 mb-16">
            <h2 className="mb-6 text-3xl font-bold text-white text-center">Enterprise Solutions</h2>
            <p className="mb-8 text-lg text-gray-400 text-center max-w-3xl mx-auto">
              Custom packages for large-scale agricultural operations, cooperatives, and agribusinesses
            </p>
            
            <div className="grid gap-8 md:grid-cols-3 mb-8">
              <EnterpriseFeature
                icon={<BarChart3 className="h-8 w-8" />}
                title="Analytics Dashboard"
                description="Comprehensive data visualization and reporting tools for multi-farm management"
              />
              <EnterpriseFeature
                icon={<Truck className="h-8 w-8" />}
                title="Supply Chain Integration"
                description="End-to-end tracking from farm to market with quality assurance protocols"
              />
              <EnterpriseFeature
                icon={<Zap className="h-8 w-8" />}
                title="Custom API Access"
                description="Direct integration with existing farm management systems and equipment"
              />
            </div>
            
            <div className="text-center">
              <Button
                asChild
                size="lg"
                className="text-lg shadow-3d shadow-primary/50 hover:shadow-primary/70 hover:scale-105 transition-all duration-300"
              >
                <Link href="/contact">
                  Request Custom Quote
                </Link>
              </Button>
            </div>
          </div>
          
          <div className="text-center">
            <h2 className="mb-6 text-3xl font-bold text-white">Ready to Transform Your Farming Operations?</h2>
            <p className="mb-8 text-xl text-gray-400 max-w-2xl mx-auto">
              Join 15,000+ farmers already using Adham AgriTech to increase productivity by up to 40%
            </p>
            <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
              <Button
                asChild
                size="lg"
                className="text-lg shadow-3d shadow-primary/50 hover:shadow-primary/70 hover:scale-105 transition-all duration-300"
              >
                <Link href="/auth/signup">
                  <Zap className="mr-2 h-5 w-5" />
                  Start Free Trial
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="text-lg glass-card border-primary/30 hover:border-primary/60 hover:scale-105 transition-all duration-300 bg-transparent"
              >
                <Link href="/contact">Contact Sales</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

function ServiceCard({
  icon,
  title,
  description,
  features,
  price,
}: {
  icon: React.ReactNode
  title: string
  description: string
  features: string[]
  price: string
}) {
  return (
    <div className="glass-card rounded-2xl p-6 shadow-3d hover:shadow-3d-lg transition-all duration-300 hover:scale-105 hover:border-primary/50">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-xl bg-primary/20 text-primary shadow-inner transition-all duration-300 group-hover:bg-primary group-hover:text-black group-hover:shadow-glow">
        {icon}
      </div>
      <h3 className="mb-3 text-2xl font-semibold text-white">{title}</h3>
      <p className="mb-4 text-gray-400 leading-relaxed">{description}</p>
      <ul className="mb-4 space-y-2">
        {features.map((feature, index) => (
          <li key={index} className="flex items-start text-gray-300">
            <span className="mr-2 text-primary">✓</span>
            <span>{feature}</span>
          </li>
        ))}
      </ul>
      <div className="mt-4 pt-4 border-t border-primary/20">
        <p className="text-lg font-semibold text-primary">{price}</p>
      </div>
    </div>
  )
}

function EnterpriseFeature({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode
  title: string
  description: string
}) {
  return (
    <div className="text-center">
      <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-xl bg-primary/20 text-primary shadow-inner">
        {icon}
      </div>
      <h3 className="mb-2 text-xl font-semibold text-white">{title}</h3>
      <p className="text-gray-400">{description}</p>
    </div>
  )
}
