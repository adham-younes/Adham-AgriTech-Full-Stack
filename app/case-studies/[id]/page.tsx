import type React from "react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Leaf, Droplets, BarChart3, MapPin, Calendar, ArrowLeft, Users, Target, TrendingUp } from "lucide-react"

export default function CaseStudyDetailPage() {
  // This would typically be dynamic based on the ID
  const study = {
    id: 1,
    title: "Increasing Wheat Yield by 35% in Egyptian Farms",
    company: "Al-Farouk Agricultural Co.",
    location: "Alexandria, Egypt",
    crop: "Wheat",
    challenge: "Low yield due to inefficient irrigation and pest management",
    solution: "Implemented satellite monitoring, smart irrigation, and AI pest detection",
    results: "35% increase in yield, 40% water savings, 25% cost reduction",
    duration: "12 months",
    date: "2025-09-15",
    author: "Dr. Sarah Khalil",
    metrics: [
      { label: "Yield Increase", value: "+35%", icon: <TrendingUp className="h-5 w-5" /> },
      { label: "Water Savings", value: "40%", icon: <Droplets className="h-5 w-5" /> },
      { label: "Cost Reduction", value: "25%", icon: <BarChart3 className="h-5 w-5" /> },
      { label: "Farmers Impacted", value: "1,200", icon: <Users className="h-5 w-5" /> }
    ],
    content: `
      <h2 class="text-2xl font-bold text-white mt-8 mb-4">Background</h2>
      
      <p>Al-Farouk Agricultural Co. is one of Egypt's leading wheat producers, operating across 2,500 hectares in the fertile Nile Delta region. Despite favorable growing conditions, the company was facing significant challenges with yield consistency and resource management.</p>
      
      <p>The farm was experiencing an average yield of 6.2 tons per hectare, which was below the regional potential of 8.5 tons per hectare. Water usage was excessive at 8,500 cubic meters per hectare, and pest infestations were causing periodic crop losses of up to 15%.</p>
      
      <h2 class="text-2xl font-bold text-white mt-8 mb-4">The Challenge</h2>
      
      <p>The primary challenges identified were:</p>
      
      <ul class="list-disc pl-6 mb-6 text-gray-300 space-y-2">
        <li>Inefficient irrigation scheduling leading to water waste and uneven crop growth</li>
        <li>Late detection of pest infestations resulting in significant crop losses</li>
        <li>Lack of real-time data for informed decision-making</li>
        <li>High operational costs due to over-application of fertilizers and pesticides</li>
      </ul>
      
      <h2 class="text-2xl font-bold text-white mt-8 mb-4">Our Solution</h2>
      
      <p>Adham AgriTech implemented a comprehensive precision agriculture solution:</p>
      
      <div class="glass-card rounded-xl p-6 mb-6">
        <h3 class="text-xl font-semibold text-white mb-4">Satellite Crop Monitoring</h3>
        <p>Daily satellite imagery analysis using NDVI and EVI indicators to monitor crop health and detect issues before they become visible.</p>
      </div>
      
      <div class="glass-card rounded-xl p-6 mb-6">
        <h3 class="text-xl font-semibold text-white mb-4">Smart Irrigation System</h3>
        <p>Installation of soil moisture sensors and weather stations to optimize irrigation scheduling based on real-time data and weather forecasts.</p>
      </div>
      
      <div class="glass-card rounded-xl p-6 mb-6">
        <h3 class="text-xl font-semibold text-white mb-4">AI Pest Detection</h3>
        <p>Implementation of AI-powered pest identification and early warning system using image recognition technology.</p>
      </div>
      
      <h2 class="text-2xl font-bold text-white mt-8 mb-4">Implementation Process</h2>
      
      <p>The implementation was carried out in three phases over 12 months:</p>
      
      <div class="mb-6">
        <h3 class="text-lg font-semibold text-white mb-2">Phase 1 (Months 1-3): Assessment and Setup</h3>
        <p>Initial soil analysis, installation of monitoring equipment, and baseline data collection.</p>
      </div>
      
      <div class="mb-6">
        <h3 class="text-lg font-semibold text-white mb-2">Phase 2 (Months 4-8): System Integration</h3>
        <p>Integration of all technologies, staff training, and gradual implementation of new practices.</p>
      </div>
      
      <div class="mb-6">
        <h3 class="text-lg font-semibold text-white mb-2">Phase 3 (Months 9-12): Optimization</h3>
        <p>Continuous monitoring, system fine-tuning, and full operational deployment.</p>
      </div>
      
      <h2 class="text-2xl font-bold text-white mt-8 mb-4">Results and Impact</h2>
      
      <p>After 12 months of implementation, the results exceeded expectations:</p>
      
      <ul class="list-disc pl-6 mb-6 text-gray-300 space-y-2">
        <li>Yield increased from 6.2 to 8.4 tons per hectare (35% increase)</li>
        <li>Water usage reduced from 8,500 to 5,100 cubic meters per hectare (40% savings)</li>
        <li>Operational costs decreased by 25% due to optimized input usage</li>
        <li>Pest-related crop losses reduced to less than 2%</li>
        <li>1,200 farmers in the region benefited from knowledge sharing</li>
      </ul>
      
      <h2 class="text-2xl font-bold text-white mt-8 mb-4">Lessons Learned</h2>
      
      <p>This project demonstrated the transformative potential of precision agriculture technologies:</p>
      
      <ul class="list-disc pl-6 mb-6 text-gray-300 space-y-2">
        <li>Data-driven decision making is crucial for modern agriculture</li>
        <li>Staff training and change management are essential for successful technology adoption</li>
        <li>Integration of multiple technologies provides synergistic benefits</li>
        <li>Continuous monitoring and optimization lead to sustained improvements</li>
      </ul>
      
      <h2 class="text-2xl font-bold text-white mt-8 mb-4">Future Outlook</h2>
      
      <p>Al-Farouk Agricultural Co. plans to expand the implementation to their remaining 5,000 hectares and integrate additional technologies such as drone monitoring and blockchain-based supply chain tracking. The success of this project has inspired neighboring farms to adopt similar precision agriculture solutions.</p>
    `
  }

  return (
    <div className="flex min-h-screen flex-col bg-black">
      <section className="relative px-6 py-20">
        <div className="mx-auto max-w-4xl">
          <Button asChild variant="ghost" className="mb-8 text-primary hover:text-primary/80">
            <Link href="/case-studies">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Case Studies
            </Link>
          </Button>
          
          <article className="glass-card rounded-3xl p-8 md:p-12">
            <div className="mb-6">
              <span className="text-sm font-medium text-primary">{study.crop} • {study.duration}</span>
              <h1 className="mt-2 text-4xl font-bold text-white">{study.title}</h1>
              <p className="mt-2 text-xl text-gray-400">{study.company}</p>
              <p className="mt-1 flex items-center text-gray-400">
                <MapPin className="mr-2 h-4 w-4" />
                {study.location}
              </p>
            </div>
            
            <div className="mb-8 flex flex-wrap items-center gap-6 text-gray-400 border-b border-primary/20 pb-8">
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                <span>{new Date(study.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                <span>{study.author}</span>
              </div>
            </div>
            
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-12">
              {study.metrics.map((metric, index) => (
                <div key={index} className="glass-card rounded-xl p-6 text-center">
                  <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/20 text-primary">
                    {metric.icon}
                  </div>
                  <p className="text-2xl font-bold text-white">{metric.value}</p>
                  <p className="text-sm text-gray-400">{metric.label}</p>
                </div>
              ))}
            </div>
            
            <div className="prose prose-invert max-w-none">
              <div dangerouslySetInnerHTML={{ __html: study.content }} />
            </div>
          </article>
          
          <div className="glass-card rounded-3xl p-8 md:p-12 mt-8 text-center">
            <h2 className="mb-6 text-2xl font-bold text-white">Transform Your Agricultural Operations</h2>
            <p className="mb-8 text-xl text-gray-400 max-w-2xl mx-auto">
              See how Adham AgriTech can help you achieve similar results
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
                <Link href="/contact">Contact Our Experts</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
