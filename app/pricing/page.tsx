import type React from "react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Check, Zap, Leaf, Droplets, Cloud, BarChart3, MessageSquare, Shield } from "lucide-react"

export default function PricingPage() {
  const plans = [
    {
      name: "Starter",
      price: "$29",
      period: "/month",
      description: "Perfect for small farms and individual farmers",
      features: [
        "Up to 10 hectares monitoring",
        "Basic crop health analysis",
        "7-day weather forecast",
        "Email support",
        "Mobile app access"
      ],
      icon: <Leaf className="h-6 w-6" />,
      popular: false
    },
    {
      name: "Professional",
      price: "$79",
      period: "/month",
      description: "Ideal for medium-sized farms and agricultural cooperatives",
      features: [
        "Up to 50 hectares monitoring",
        "Advanced crop health analysis",
        "14-day weather forecast",
        "Soil analysis (2x/year)",
        "Smart irrigation control",
        "Priority support",
        "API access"
      ],
      icon: <BarChart3 className="h-6 w-6" />,
      popular: true
    },
    {
      name: "Enterprise",
      price: "Custom",
      period: "",
      description: "For large agricultural operations and agribusinesses",
      features: [
        "Unlimited hectares monitoring",
        "Premium crop analytics",
        "Advanced weather modeling",
        "Weekly soil analysis",
        "Full irrigation automation",
        "24/7 dedicated support",
        "Custom API integration",
        "Supply chain tracking"
      ],
      icon: <Shield className="h-6 w-6" />,
      popular: false
    }
  ]

  const addons = [
    {
      name: "AI Agricultural Assistant",
      price: "$39/month",
      description: "24/7 AI-powered farming expert"
    },
    {
      name: "Blockchain Land Management",
      price: "$59/month",
      description: "Secure land records and smart contracts"
    },
    {
      name="Additional Soil Analysis",
      price: "$99/analysis",
      description: "Comprehensive soil composition testing"
    },
    {
      name: "Custom Reporting",
      price: "$49/month",
      description: "Personalized analytics and insights"
    }
  ]

  return (
    <div className="flex min-h-screen flex-col bg-black">
      <section className="relative px-6 py-20">
        <div className="mx-auto max-w-6xl">
          <div className="mb-16 text-center">
            <h1 className="mb-6 text-5xl font-bold sm:text-6xl bg-gradient-to-b from-white via-white to-white/60 bg-clip-text text-transparent drop-shadow-2xl">
              Simple, Transparent Pricing
            </h1>
            <p className="mx-auto max-w-2xl text-xl text-gray-400">
              Choose the perfect plan for your agricultural needs
            </p>
          </div>
          
          <div className="grid gap-8 lg:grid-cols-3 mb-16">
            {plans.map((plan) => (
              <PricingCard key={plan.name} plan={plan} />
            ))}
          </div>
          
          <div className="glass-card rounded-3xl p-8 md:p-12 mb-16">
            <h2 className="mb-8 text-3xl font-bold text-white text-center">Popular Add-ons</h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {addons.map((addon) => (
                <AddonCard key={addon.name} addon={addon} />
              ))}
            </div>
          </div>
          
          <div className="glass-card rounded-3xl p-8 md:p-12 text-center">
            <Zap className="h-16 w-16 text-primary mx-auto mb-6 drop-shadow-glow" />
            <h2 className="mb-6 text-3xl font-bold text-white">Ready to Transform Your Farming?</h2>
            <p className="mb-8 text-xl text-gray-400 max-w-2xl mx-auto">
              Start your 14-day free trial today. No credit card required.
            </p>
            <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
              <Button
                asChild
                size="lg"
                className="text-lg shadow-3d shadow-primary/50 hover:shadow-primary/70 hover:scale-105 transition-all duration-300"
              >
                <Link href="/auth/signup">
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

function PricingCard({ plan }: { plan: any }) {
  return (
    <div className={`glass-card rounded-2xl p-6 shadow-3d hover:shadow-3d-lg transition-all duration-300 ${plan.popular ? 'border-2 border-primary ring-2 ring-primary/30' : ''}`}>
      {plan.popular && (
        <div className="mb-4 -mx-6 -mt-6 rounded-t-2xl bg-primary py-2 text-center">
          <span className="text-sm font-semibold text-black">MOST POPULAR</span>
        </div>
      )}
      <div className="mb-6 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-xl bg-primary/20 text-primary shadow-inner">
          {plan.icon}
        </div>
        <h3 className="mb-2 text-2xl font-bold text-white">{plan.name}</h3>
        <p className="text-gray-400">{plan.description}</p>
      </div>
      
      <div className="mb-6 text-center">
        <span className="text-4xl font-bold text-white">{plan.price}</span>
        <span className="text-xl text-gray-400">{plan.period}</span>
      </div>
      
      <ul className="mb-8 space-y-3">
        {plan.features.map((feature: string, index: number) => (
          <li key={index} className="flex items-start text-gray-300">
            <Check className="mr-3 mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />
            <span>{feature}</span>
          </li>
        ))}
      </ul>
      
      <Button
        asChild
        size="lg"
        className={`w-full ${plan.popular ? 'shadow-3d shadow-primary/50 hover:shadow-primary/70' : ''}`}
      >
        <Link href="/auth/signup">Get Started</Link>
      </Button>
    </div>
  )
}

function AddonCard({ addon }: { addon: any }) {
  return (
    <div className="glass-card rounded-xl p-4 hover:shadow-3d-lg transition-all duration-300 hover:scale-105">
      <h3 className="mb-2 font-semibold text-white">{addon.name}</h3>
      <p className="mb-3 text-sm text-gray-400">{addon.description}</p>
      <p className="text-lg font-semibold text-primary">{addon.price}</p>
    </div>
  )
}
