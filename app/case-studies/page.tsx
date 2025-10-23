import type React from "react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Leaf, Droplets, BarChart3, MapPin, Calendar, ArrowRight } from "lucide-react"

export default function CaseStudiesPage() {
  const caseStudies = [
    {
      id: 1,
      title: "Increasing Wheat Yield by 35% in Egyptian Farms",
      company: "Al-Farouk Agricultural Co.",
      location: "Alexandria, Egypt",
      crop: "Wheat",
      challenge: "Low yield due to inefficient irrigation and pest management",
      solution: "Implemented satellite monitoring, smart irrigation, and AI pest detection",
      results: "35% increase in yield, 40% water savings, 25% cost reduction",
      duration: "12 months",
      image: "/placeholder.svg"
    },
    {
      id: 2,
      title: "Optimizing Date Palm Production in Oasis Farms",
      company: "Oasis Green Agriculture",
      location: "Siwa Oasis, Egypt",
      crop: "Date Palms",
      challenge: "Water scarcity and soil salinity issues affecting production",
      solution: "Soil analysis, drip irrigation optimization, and salinity management",
      results: "50% improvement in fruit quality, 30% water savings, extended growing season",
      duration: "18 months",
      image: "/placeholder.svg"
    },
    {
      id: 3,
      title: "Precision Cotton Farming in Delta Region",
      company: "Delta Cotton Industries",
      location: "Damietta, Egypt",
      crop: "Cotton",
      challenge: "Pest infestations and inconsistent fiber quality",
      solution: "AI pest detection, targeted pesticide application, and growth monitoring",
      results: "60% reduction in pesticide use, 28% improvement in fiber quality, 20% yield increase",
      duration: "15 months",
      image: "/placeholder.svg"
    },
    {
      id: 4,
      title: "Sustainable Rice Cultivation in Nile Delta",
      company: "Nile Valley Rice Co.",
      location: "Kafr El Sheikh, Egypt",
      crop: "Rice",
      challenge: "Flooding management and methane emissions reduction",
      solution: "Water level monitoring, alternate wetting and drying technique, emissions tracking",
      results: "45% reduction in water usage, 35% decrease in methane emissions, maintained yield",
      duration: "24 months",
      image: "/placeholder.svg"
    }
  ]

  return (
    <div className="flex min-h-screen flex-col bg-black">
      <section className="relative px-6 py-20">
        <div className="mx-auto max-w-6xl">
          <div className="mb-16 text-center">
            <h1 className="mb-6 text-5xl font-bold sm:text-6xl bg-gradient-to-b from-white via-white to-white/60 bg-clip-text text-transparent drop-shadow-2xl">
              Success Stories
            </h1>
            <p className="mx-auto max-w-2xl text-xl text-gray-400">
              Real-world examples of how Adham AgriTech transforms agricultural operations
            </p>
          </div>
          
          <div className="grid gap-8 lg:grid-cols-2 mb-16">
            {caseStudies.map((study) => (
              <CaseStudyCard key={study.id} study={study} />
            ))}
          </div>
          
          <div className="glass-card rounded-3xl p-8 md:p-12 text-center">
            <h2 className="mb-6 text-3xl font-bold text-white">Ready to Write Your Success Story?</h2>
            <p className="mb-8 text-xl text-gray-400 max-w-2xl mx-auto">
              Join thousands of farmers already using Adham AgriTech to transform their operations
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
                <Link href="/contact">Contact Our Team</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

function CaseStudyCard({ study }: { study: any }) {
  return (
    <div className="glass-card rounded-2xl overflow-hidden hover:shadow-3d-lg transition-all duration-300 hover:scale-105">
      <div className="h-48 bg-gradient-to-r from-primary/20 to-emerald-500/20 flex items-center justify-center">
        <Leaf className="h-16 w-16 text-primary" />
      </div>
      <div className="p-6">
        <div className="mb-4 flex items-center justify-between">
          <span className="text-sm font-medium text-primary">{study.crop}</span>
          <span className="text-sm text-gray-400">{study.duration}</span>
        </div>
        
        <h2 className="mb-3 text-xl font-bold text-white">{study.title}</h2>
        <p className="mb-2 flex items-center text-gray-400">
          <MapPin className="mr-2 h-4 w-4" />
          {study.location}
        </p>
        <p className="mb-4 text-gray-400">{study.company}</p>
        
        <div className="mb-4">
          <h3 className="mb-2 font-semibold text-white">Challenge:</h3>
          <p className="text-gray-400 text-sm">{study.challenge}</p>
        </div>
        
        <div className="mb-4">
          <h3 className="mb-2 font-semibold text-white">Solution:</h3>
          <p className="text-gray-400 text-sm">{study.solution}</p>
        </div>
        
        <div className="mb-6">
          <h3 className="mb-2 font-semibold text-white">Results:</h3>
          <p className="text-gray-400 text-sm">{study.results}</p>
        </div>
        
        <Button asChild variant="ghost" className="p-0 text-primary hover:text-primary/80">
          <Link href={`/case-studies/${study.id}`}>
            Read Full Case Study
            <ArrowRight className="mr-2 h-4 w-4" />
          </Link>
        </Button>
      </div>
    </div>
  )
}
