import type React from "react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Mail, MapPin, Calendar, Zap, Leaf, Users, Target } from "lucide-react"

export default function CareersPage() {
  const positions = [
    {
      id: 1,
      title: "Senior AI Engineer",
      department: "Technology",
      location: "Amman, Jordan (Remote Available)",
      type: "Full-time",
      experience: "5+ years",
      posted: "2025-10-15",
      description: "We're looking for an experienced AI engineer to help develop our next-generation agricultural intelligence platform.",
      responsibilities: [
        "Design and implement machine learning models for crop analysis",
        "Develop computer vision algorithms for satellite imagery processing",
        "Collaborate with agricultural experts to solve real-world farming challenges",
        "Optimize AI models for edge computing in agricultural environments"
      ],
      requirements: [
        "MSc or PhD in Computer Science, AI, or related field",
        "5+ years of experience in machine learning and deep learning",
        "Proficiency in Python, TensorFlow, and PyTorch",
        "Experience with satellite imagery and geospatial data"
      ]
    },
    {
      id: 2,
      title: "Agricultural Specialist",
      department: "Agricultural Solutions",
      location: "Cairo, Egypt",
      type: "Full-time",
      experience: "3+ years",
      posted: "2025-10-10",
      description: "Join our team of agricultural experts to help farmers adopt our innovative technology solutions.",
      responsibilities: [
        "Provide technical support to farmers using our platform",
        "Conduct field trials and collect performance data",
        "Develop training materials and conduct workshops",
        "Collaborate with product team to improve user experience"
      ],
      requirements: [
        "Bachelor's degree in Agriculture, Agronomy, or related field",
        "3+ years of experience in agricultural consulting or extension services",
        "Strong understanding of modern farming practices",
        "Excellent communication and training skills"
      ]
    },
    {
      id: 3,
      title: "Frontend Developer",
      department: "Engineering",
      location: "Remote",
      type: "Full-time",
      experience: "3+ years",
      posted: "2025-10-05",
      description: "Help us build intuitive and powerful user interfaces for our agricultural technology platform.",
      responsibilities: [
        "Develop responsive web applications using React and Next.js",
        "Create data visualization components for agricultural metrics",
        "Implement UI/UX designs with attention to performance",
        "Collaborate with design and product teams to deliver exceptional user experiences"
      ],
      requirements: [
        "Bachelor's degree in Computer Science or related field",
        "3+ years of experience in frontend development",
        "Expertise in React, TypeScript, and modern CSS frameworks",
        "Experience with data visualization libraries"
      ]
    }
  ]

  const benefits = [
    {
      title: "Competitive Salary",
      description: "We offer market-leading compensation packages",
      icon: <Zap className="h-6 w-6" />
    },
    {
      title: "Impactful Work",
      description: "Contribute to solving global food security challenges",
      icon: <Leaf className="h-6 w-6" />
    },
    {
      title: "Professional Growth",
      description: "Continuous learning and career development opportunities",
      icon: <Target className="h-6 w-6" />
    },
    {
      title: "Flexible Work",
      description: "Remote work options and flexible schedules",
      icon: <Users className="h-6 w-6" />
    }
  ]

  return (
    <div className="flex min-h-screen flex-col bg-black">
      <section className="relative px-6 py-20">
        <div className="mx-auto max-w-6xl">
          <div className="mb-16 text-center">
            <h1 className="mb-6 text-5xl font-bold sm:text-6xl bg-gradient-to-b from-white via-white to-white/60 bg-clip-text text-transparent drop-shadow-2xl">
              Join Our Team
            </h1>
            <p className="mx-auto max-w-2xl text-xl text-gray-400">
              Help us revolutionize agriculture through cutting-edge technology
            </p>
          </div>
          
          <div className="glass-card rounded-3xl p-8 md:p-12 mb-16">
            <div className="grid gap-8 lg:grid-cols-2 items-center">
              <div>
                <h2 className="mb-6 text-3xl font-bold text-white">Our Mission</h2>
                <p className="mb-6 text-lg text-gray-300 leading-relaxed">
                  At Adham AgriTech, we're on a mission to transform agriculture through innovative technology solutions. We believe that by empowering farmers with precise data and intelligent insights, we can create a more sustainable and food-secure world.
                </p>
                <p className="text-lg text-gray-300 leading-relaxed">
                  Our team is passionate about both technology and agriculture. We work at the intersection of these fields to solve real-world challenges faced by farmers around the globe.
                </p>
              </div>
              <div className="flex justify-center">
                <div className="relative">
                  <div className="glass-card rounded-2xl p-8 w-64 h-64 flex items-center justify-center">
                    <Users className="h-24 w-24 text-primary" />
                  </div>
                  <div className="absolute -top-4 -right-4 glass-card rounded-full p-4">
                    <Target className="h-8 w-8 text-primary" />
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4 mb-16">
            {benefits.map((benefit, index) => (
              <div key={index} className="glass-card rounded-2xl p-6 text-center hover:shadow-3d-lg transition-all duration-300 hover:scale-105">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-xl bg-primary/20 text-primary shadow-inner">
                  {benefit.icon}
                </div>
                <h3 className="mb-2 text-lg font-semibold text-white">{benefit.title}</h3>
                <p className="text-gray-400 text-sm">{benefit.description}</p>
              </div>
            ))}
          </div>
          
          <div className="mb-16">
            <h2 className="mb-8 text-3xl font-bold text-white text-center">Open Positions</h2>
            <div className="space-y-6">
              {positions.map((position) => (
                <PositionCard key={position.id} position={position} />
              ))}
            </div>
          </div>
          
          <div className="glass-card rounded-3xl p-8 md:p-12 text-center">
            <h2 className="mb-6 text-3xl font-bold text-white">Don't See the Right Position?</h2>
            <p className="mb-8 text-xl text-gray-400 max-w-2xl mx-auto">
              We're always interested in hearing from talented individuals passionate about agriculture and technology
            </p>
            <Button
              asChild
              size="lg"
              className="text-lg shadow-3d shadow-primary/50 hover:shadow-primary/70 hover:scale-105 transition-all duration-300"
            >
              <Link href="mailto:careers@adham-agritech.com">
                <Mail className="mr-2 h-5 w-5" />
                Send Us Your Resume
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}

function PositionCard({ position }: { position: any }) {
  return (
    <div className="glass-card rounded-2xl p-6 hover:shadow-3d-lg transition-all duration-300 hover:scale-105">
      <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
        <div>
          <h3 className="text-xl font-bold text-white">{position.title}</h3>
          <p className="text-primary">{position.department}</p>
        </div>
        <Button asChild>
          <Link href={`/careers/${position.id}`}>View Details</Link>
        </Button>
      </div>
      
      <div className="flex flex-wrap gap-4 mb-4 text-sm text-gray-400">
        <div className="flex items-center gap-1">
          <MapPin className="h-4 w-4" />
          <span>{position.location}</span>
        </div>
        <div className="flex items-center gap-1">
          <Calendar className="h-4 w-4" />
          <span>{position.type}</span>
        </div>
        <div>
          <span>{position.experience} experience</span>
        </div>
      </div>
      
      <p className="text-gray-400 mb-4">{position.description}</p>
      
      <div className="flex flex-wrap gap-2">
        {position.requirements.slice(0, 3).map((req: string, index: number) => (
          <span key={index} className="glass-card px-3 py-1 text-xs rounded-full text-primary border border-primary/30">
            {req.split(' ')[0]}
          </span>
        ))}
      </div>
    </div>
  )
}
