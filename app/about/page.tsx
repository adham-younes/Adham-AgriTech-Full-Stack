import type React from "react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Users, Target, Eye, Zap, Leaf, Award } from "lucide-react"

export default function AboutPage() {
  return (
    <div className="flex min-h-screen flex-col bg-black">
      <section className="relative px-6 py-20">
        <div className="mx-auto max-w-6xl">
          <div className="mb-16 text-center">
            <h1 className="mb-6 text-5xl font-bold sm:text-6xl bg-gradient-to-b from-white via-white to-white/60 bg-clip-text text-transparent drop-shadow-2xl">
              About Adham AgriTech
            </h1>
            <p className="mx-auto max-w-2xl text-xl text-gray-400">
              Revolutionizing agriculture through cutting-edge technology
            </p>
          </div>
          
          <div className="glass-card rounded-3xl p-8 md:p-12 mb-16">
            <div className="grid gap-8 lg:grid-cols-2 items-center">
              <div>
                <h2 className="mb-6 text-3xl font-bold text-white">Our Mission</h2>
                <p className="mb-6 text-lg text-gray-300 leading-relaxed">
                  At Adham AgriTech, we're committed to transforming traditional farming through innovative technology solutions. Our platform combines artificial intelligence, satellite imagery, and blockchain technology to help farmers maximize productivity while minimizing resource waste.
                </p>
                <p className="text-lg text-gray-300 leading-relaxed">
                  We believe that sustainable agriculture is the key to feeding our growing world population. By providing farmers with precise data and intelligent insights, we're building a future where farming is more efficient, profitable, and environmentally responsible.
                </p>
              </div>
              <div className="flex justify-center">
                <div className="relative">
                  <div className="glass-card rounded-2xl p-8 w-64 h-64 flex items-center justify-center">
                    <Leaf className="h-24 w-24 text-primary" />
                  </div>
                  <div className="absolute -top-4 -right-4 glass-card rounded-full p-4">
                    <Zap className="h-8 w-8 text-primary" />
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="grid gap-8 md:grid-cols-3 mb-16">
            <ValueCard
              icon={<Target className="h-10 w-10" />}
              title="Precision Agriculture"
              description="We leverage cutting-edge technology to provide precise insights for optimal farming decisions."
            />
            <ValueCard
              icon={<Eye className="h-10 w-10" />}
              title="Sustainability Focus"
              description="Our solutions help farmers reduce resource waste and implement eco-friendly practices."
            />
            <ValueCard
              icon={<Users className="h-10 w-10" />}
              title="Farmer Empowerment"
              description="We provide tools and knowledge to help farmers succeed in the modern agricultural landscape."
            />
          </div>
          
          <div className="glass-card rounded-3xl p-8 md:p-12 mb-16">
            <div className="text-center mb-12">
              <h2 className="mb-4 text-3xl font-bold text-white">Our Achievements</h2>
              <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                Making a real impact in the agricultural industry
              </p>
            </div>
            
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              <AchievementCard
                number="15,000+"
                label="Active Farms"
                description="Farmers trusting our platform"
              />
              <AchievementCard
                number="75,000+"
                label="Hectares"
                description="Land under management"
              />
              <AchievementCard
                number="40%"
                label="Avg. Increase"
                description="In crop productivity"
              />
              <AchievementCard
                number="25M+"
                label="Data Points"
                description="Processed daily"
              />
            </div>
          </div>
          
          <div className="text-center">
            <h2 className="mb-6 text-3xl font-bold text-white">Ready to Join Our Community?</h2>
            <p className="mb-8 text-xl text-gray-400 max-w-2xl mx-auto">
              Transform your farming operations with our advanced technology platform
            </p>
            <Button
              asChild
              size="lg"
              className="text-lg shadow-3d shadow-primary/50 hover:shadow-primary/70 hover:scale-105 transition-all duration-300"
            >
              <Link href="/auth/signup">
                <Award className="mr-2 h-5 w-5" />
                Start Your Journey
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}

function ValueCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode
  title: string
  description: string
}) {
  return (
    <div className="glass-card rounded-2xl p-6 text-center hover:shadow-3d-lg transition-all duration-300 hover:scale-105">
      <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-xl bg-primary/20 text-primary shadow-inner">
        {icon}
      </div>
      <h3 className="mb-3 text-xl font-semibold text-white">{title}</h3>
      <p className="text-gray-400">{description}</p>
    </div>
  )
}

function AchievementCard({
  number,
  label,
  description,
}: {
  number: string
  label: string
  description: string
}) {
  return (
    <div className="glass-card rounded-2xl p-6 text-center hover:shadow-3d-lg transition-all duration-300 hover:scale-105">
      <p className="text-4xl font-bold text-primary mb-2">{number}</p>
      <p className="text-xl font-semibold text-white mb-2">{label}</p>
      <p className="text-gray-400">{description}</p>
    </div>
  )
}
