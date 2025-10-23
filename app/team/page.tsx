import type React from "react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Linkedin, Twitter, Mail, Leaf, Users, Target, Zap } from "lucide-react"

export default function TeamPage() {
  const teamMembers = [
    {
      id: 1,
      name: "Dr. Adham Younes",
      role: "Founder & CEO",
      bio: "Agricultural engineer with 15+ years of experience in precision farming and agricultural technology. PhD in Smart Agriculture from Cairo University.",
      expertise: ["Precision Agriculture", "AI Applications", "Sustainable Farming"],
      image: "/placeholder-user.jpg",
      linkedin: "#",
      twitter: "#"
    },
    {
      id: 2,
      name: "Dr. Sarah Khalil",
      role: "Chief Technology Officer",
      bio: "Former Google AI researcher with expertise in computer vision and machine learning. Leads our AI and satellite technology development.",
      expertise: ["Machine Learning", "Computer Vision", "Satellite Analytics"],
      image: "/placeholder-user.jpg",
      linkedin: "#",
      twitter: "#"
    },
    {
      id: 3,
      name: "Mohamed Farouk",
      role: "Head of Agricultural Solutions",
      bio: "Third-generation farmer with deep understanding of traditional and modern farming practices. Bridges technology with practical agriculture.",
      expertise: ["Crop Management", "Soil Science", "Farm Operations"],
      image: "/placeholder-user.jpg",
      linkedin: "#",
      twitter: "#"
    },
    {
      id: 4,
      name: "Dr. Layla Mahmoud",
      role: "Blockchain & Data Security Lead",
      bio: "Cybersecurity expert with focus on agricultural data protection. Implements blockchain solutions for supply chain transparency.",
      expertise: ["Blockchain", "Data Security", "Supply Chain"],
      image: "/placeholder-user.jpg",
      linkedin: "#",
      twitter: "#"
    },
    {
      id: 5,
      name: "Ahmed Hassan",
      role: "Head of Product Development",
      bio: "User experience designer with passion for agricultural technology. Ensures our solutions are intuitive and valuable for farmers.",
      expertise: ["Product Design", "User Experience", "AgriTech"],
      image: "/placeholder-user.jpg",
      linkedin: "#",
      twitter: "#"
    },
    {
      id: 6,
      name: "Yasmine Nasser",
      role: "Customer Success Director",
      bio: "Agricultural extension specialist with experience training thousands of farmers on new technologies. Ensures customer success.",
      expertise: ["Farmer Training", "Customer Support", "Adoption Strategies"],
      image: "/placeholder-user.jpg",
      linkedin: "#",
      twitter: "#"
    }
  ]

  const advisors = [
    {
      id: 1,
      name: "Prof. Hassan Ali",
      role: "Agricultural Economics Advisor",
      affiliation: "Cairo University",
      bio: "Leading expert in agricultural economics and policy. Provides strategic guidance on market development.",
      image: "/placeholder-user.jpg"
    },
    {
      id: 2,
      name: "Dr. Omar Saeed",
      role: "Sustainable Agriculture Advisor",
      affiliation: "Agricultural Research Center",
      bio: "Specialist in sustainable farming practices and environmental impact reduction.",
      image: "/placeholder-user.jpg"
    }
  ]

  return (
    <div className="flex min-h-screen flex-col bg-black">
      <section className="relative px-6 py-20">
        <div className="mx-auto max-w-6xl">
          <div className="mb-16 text-center">
            <h1 className="mb-6 text-5xl font-bold sm:text-6xl bg-gradient-to-b from-white via-white to-white/60 bg-clip-text text-transparent drop-shadow-2xl">
              Our Team
            </h1>
            <p className="mx-auto max-w-2xl text-xl text-gray-400">
              Passionate experts dedicated to revolutionizing agriculture through technology
            </p>
          </div>
          
          <div className="mb-16">
            <h2 className="mb-8 text-3xl font-bold text-white text-center">Leadership Team</h2>
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {teamMembers.map((member) => (
                <TeamMemberCard key={member.id} member={member} />
              ))}
            </div>
          </div>
          
          <div className="mb-16">
            <h2 className="mb-8 text-3xl font-bold text-white text-center">Advisory Board</h2>
            <div className="grid gap-8 sm:grid-cols-2">
              {advisors.map((advisor) => (
                <AdvisorCard key={advisor.id} advisor={advisor} />
              ))}
            </div>
          </div>
          
          <div className="glass-card rounded-3xl p-8 md:p-12 text-center">
            <h2 className="mb-6 text-3xl font-bold text-white">Join Our Team</h2>
            <p className="mb-8 text-xl text-gray-400 max-w-2xl mx-auto">
              We're always looking for talented individuals passionate about agriculture and technology
            </p>
            <Button
              asChild
              size="lg"
              className="text-lg shadow-3d shadow-primary/50 hover:shadow-primary/70 hover:scale-105 transition-all duration-300"
            >
              <Link href="/careers">
                View Open Positions
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}

function TeamMemberCard({ member }: { member: any }) {
  return (
    <div className="glass-card rounded-2xl p-6 text-center hover:shadow-3d-lg transition-all duration-300 hover:scale-105">
      <div className="mx-auto mb-4 h-32 w-32 rounded-full bg-gradient-to-br from-primary/20 to-emerald-500/20 flex items-center justify-center">
        <Users className="h-16 w-16 text-primary" />
      </div>
      <h3 className="mb-1 text-xl font-bold text-white">{member.name}</h3>
      <p className="mb-3 text-primary">{member.role}</p>
      <p className="mb-4 text-sm text-gray-400">{member.bio}</p>
      <div className="mb-4 flex flex-wrap justify-center gap-2">
        {member.expertise.map((skill: string, index: number) => (
          <span key={index} className="glass-card px-2 py-1 text-xs rounded-full text-primary border border-primary/30">
            {skill}
          </span>
        ))}
      </div>
      <div className="flex justify-center gap-3">
        <Button variant="ghost" size="sm" className="text-gray-400 hover:text-primary">
          <Linkedin className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="sm" className="text-gray-400 hover:text-primary">
          <Twitter className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="sm" className="text-gray-400 hover:text-primary">
          <Mail className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}

function AdvisorCard({ advisor }: { advisor: any }) {
  return (
    <div className="glass-card rounded-2xl p-6 hover:shadow-3d-lg transition-all duration-300 hover:scale-105">
      <div className="flex items-start gap-4">
        <div className="h-16 w-16 rounded-full bg-gradient-to-br from-primary/20 to-emerald-500/20 flex items-center justify-center flex-shrink-0">
          <Target className="h-8 w-8 text-primary" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-white">{advisor.name}</h3>
          <p className="text-primary">{advisor.role}</p>
          <p className="text-sm text-gray-400 mb-2">{advisor.affiliation}</p>
          <p className="text-sm text-gray-400">{advisor.bio}</p>
        </div>
      </div>
    </div>
  )
}
