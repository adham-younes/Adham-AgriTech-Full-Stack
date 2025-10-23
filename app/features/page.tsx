import type React from "react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Leaf, Droplets, Cloud, BarChart3, MessageSquare, Shield, Zap, Satellite, Microscope, Truck } from "lucide-react"

export default function FeaturesPage() {
  return (
    <div className="flex min-h-screen flex-col bg-black">
      <section className="relative px-6 py-20">
        <div className="mx-auto max-w-6xl">
          <div className="mb-16 text-center">
            <h1 className="mb-6 text-5xl font-bold sm:text-6xl bg-gradient-to-b from-white via-white to-white/60 bg-clip-text text-transparent drop-shadow-2xl">
              Advanced Platform Features
            </h1>
            <p className="mx-auto max-w-2xl text-xl text-gray-400">
              Comprehensive agricultural solutions powered by cutting-edge technology
            </p>
          </div>
          
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            <FeatureDetailCard
              icon={<Satellite className="h-10 w-10" />}
              title="Advanced Crop Monitoring"
              description="Our satellite technology provides real-time monitoring of crop health using NDVI and EVI indicators. Get detailed insights into vegetation density, growth patterns, and potential issues before they become critical problems."
              benefits={["95% accuracy in yield prediction", "Early disease detection", "Growth optimization recommendations"]}
            />
            
            <FeatureDetailCard
              icon={<Droplets className="h-10 w-10" />}
              title="AI-Powered Irrigation"
              description="Smart irrigation systems that automatically adjust watering schedules based on soil moisture, weather forecasts, and crop requirements. Reduce water waste by up to 50% while maximizing crop yield."
              benefits={["Water savings up to 50%", "Automated scheduling", "Soil moisture optimization"]}
            />
            
            <FeatureDetailCard
              icon={<Cloud className="h-10 w-10" />}
              title="Hyper-Local Weather Forecasting"
              description="14-day hyper-local weather predictions with precision data on precipitation, temperature, humidity, and wind patterns. Make informed decisions about planting, harvesting, and field operations."
              benefits={["14-day forecast accuracy", "Field-specific predictions", "Severe weather alerts"]}
            />
            
            <FeatureDetailCard
              icon={<Microscope className="h-10 w-10" />}
              title="Comprehensive Soil Analysis"
              description="Advanced soil composition analysis with detailed nutrient profiling, pH levels, and organic matter content. Receive personalized fertilizer recommendations and soil improvement strategies."
              benefits={["Complete nutrient profiling", "Custom fertilizer plans", "Soil health tracking"]}
            />
            
            <FeatureDetailCard
              icon={<MessageSquare className="h-10 w-10" />}
              title="24/7 AI Agricultural Assistant"
              description="Our AI-powered assistant provides instant answers to agricultural questions, pest identification, treatment recommendations, and best practices. Available around the clock to support your farming operations."
              benefits={["Instant expert advice", "Pest & disease identification", "Personalized recommendations"]}
            />
            
            <FeatureDetailCard
              icon={<Shield className="h-10 w-10" />}
              title="Blockchain Technology"
              description="Secure land ownership records, transparent supply chain tracking, and smart contracts for automated operations. Ensure complete transparency and security for all your agricultural transactions."
              benefits={["Immutable land records", "Supply chain transparency", "Automated smart contracts"]}
            />
          </div>
        </div>
      </section>
      
      <section className="px-6 py-20 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-primary/10 to-black" />
        <div className="mx-auto max-w-4xl text-center relative z-10">
          <div className="glass-card p-12 rounded-3xl shadow-3d">
            <Zap className="h-16 w-16 text-primary mx-auto mb-6 drop-shadow-glow" />
            <h2 className="mb-6 text-4xl font-bold sm:text-5xl bg-gradient-to-b from-white to-gray-400 bg-clip-text text-transparent">
              Ready to Transform Your Farming Operations?
            </h2>
            <p className="mb-8 text-lg text-gray-400">
              Join 15,000+ farmers already using Adham AgriTech to increase productivity by up to 40%
            </p>
            <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
              <Button
                asChild
                size="lg"
                className="text-lg shadow-3d shadow-primary/50 hover:shadow-primary/70 hover:scale-105 transition-all duration-300"
              >
                <Link href="/auth/signup">
                  <Sparkles className="mr-2 h-5 w-5" />
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

function FeatureDetailCard({
  icon,
  title,
  description,
  benefits,
}: {
  icon: React.ReactNode
  title: string
  description: string
  benefits: string[]
}) {
  return (
    <div className="group glass-card rounded-2xl p-6 shadow-3d hover:shadow-3d-lg transition-all duration-300 hover:scale-105 hover:border-primary/50">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-xl bg-primary/20 text-primary shadow-inner transition-all duration-300 group-hover:bg-primary group-hover:text-black group-hover:shadow-glow">
        {icon}
      </div>
      <h3 className="mb-3 text-2xl font-semibold text-white">{title}</h3>
      <p className="mb-4 text-gray-400 leading-relaxed">{description}</p>
      <ul className="space-y-2">
        {benefits.map((benefit, index) => (
          <li key={index} className="flex items-start text-gray-300">
            <span className="mr-2 text-primary">✓</span>
            <span>{benefit}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
