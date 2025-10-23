import type React from "react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft, MapPin, Calendar, Clock, DollarSign, Mail } from "lucide-react"

export default function JobDetailPage() {
  // This would typically be dynamic based on the ID
  const position = {
    id: 1,
    title: "Senior AI Engineer",
    department: "Technology",
    location: "Amman, Jordan (Remote Available)",
    type: "Full-time",
    experience: "5+ years",
    posted: "2025-10-15",
    salary: "$80,000 - $120,000",
    description: "We're looking for an experienced AI engineer to help develop our next-generation agricultural intelligence platform.",
    responsibilities: [
      "Design and implement machine learning models for crop analysis",
      "Develop computer vision algorithms for satellite imagery processing",
      "Collaborate with agricultural experts to solve real-world farming challenges",
      "Optimize AI models for edge computing in agricultural environments",
      "Research and implement state-of-the-art AI techniques in agriculture",
      "Mentor junior engineers and contribute to team knowledge sharing"
    ],
    requirements: [
      "MSc or PhD in Computer Science, AI, or related field",
      "5+ years of experience in machine learning and deep learning",
      "Proficiency in Python, TensorFlow, and PyTorch",
      "Experience with satellite imagery and geospatial data",
      "Strong understanding of computer vision and image processing",
      "Experience with cloud platforms (AWS, GCP, or Azure)",
      "Excellent problem-solving and analytical skills"
    ],
    niceToHave: [
      "Experience in agricultural or environmental applications",
      "Knowledge of remote sensing technologies",
      "Familiarity with Kubernetes and Docker",
      "Experience with time series analysis",
      "Contributions to open-source AI projects"
    ]
  }

  return (
    <div className="flex min-h-screen flex-col bg-black">
      <section className="relative px-6 py-20">
        <div className="mx-auto max-w-4xl">
          <Button asChild variant="ghost" className="mb-8 text-primary hover:text-primary/80">
            <Link href="/careers">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Careers
            </Link>
          </Button>
          
          <div className="glass-card rounded-3xl p-8 md:p-12">
            <div className="mb-6">
              <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                <div>
                  <h1 className="text-4xl font-bold text-white mb-2">{position.title}</h1>
                  <p className="text-xl text-primary">{position.department}</p>
                </div>
                <Button size="lg" className="text-lg shadow-3d shadow-primary/50 hover:shadow-primary/70 hover:scale-105 transition-all duration-300">
                  Apply Now
                </Button>
              </div>
              
              <p className="text-xl text-gray-400 mb-6">{position.description}</p>
              
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
                <div className="flex items-center gap-2 text-gray-400">
                  <MapPin className="h-5 w-5" />
                  <span>{position.location}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-400">
                  <Calendar className="h-5 w-5" />
                  <span>{position.type}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-400">
                  <Clock className="h-5 w-5" />
                  <span>{position.experience} experience</span>
                </div>
                <div className="flex items-center gap-2 text-gray-400">
                  <DollarSign className="h-5 w-5" />
                  <span>{position.salary}</span>
                </div>
              </div>
            </div>
            
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-white mb-6">Responsibilities</h2>
              <ul className="space-y-3">
                {position.responsibilities.map((responsibility, index) => (
                  <li key={index} className="flex items-start text-gray-300">
                    <span className="mr-3 mt-1 h-2 w-2 rounded-full bg-primary"></span>
                    <span>{responsibility}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-white mb-6">Requirements</h2>
              <ul className="space-y-3">
                {position.requirements.map((requirement, index) => (
                  <li key={index} className="flex items-start text-gray-300">
                    <span className="mr-3 mt-1 h-2 w-2 rounded-full bg-primary"></span>
                    <span>{requirement}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-white mb-6">Nice to Have</h2>
              <ul className="space-y-3">
                {position.niceToHave.map((item, index) => (
                  <li key={index} className="flex items-start text-gray-300">
                    <span className="mr-3 mt-1 h-2 w-2 rounded-full bg-primary/50"></span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="glass-card rounded-2xl p-6 mb-8">
              <h2 className="text-2xl font-bold text-white mb-4">How to Apply</h2>
              <p className="text-gray-400 mb-4">Please send your resume and a cover letter to <a href="mailto:careers@adham-agritech.com" className="text-primary hover:underline">careers@adham-agritech.com</a> with the subject line "Application for {position.title}".</p>
              <p className="text-gray-400">In your cover letter, please include:</p>
              <ul className="mt-2 space-y-2 text-gray-400">
                <li>• Why you're interested in working at Adham AgriTech</li>
                <li>• How your experience aligns with this role</li>
                <li>• A project or achievement you're particularly proud of</li>
              </ul>
            </div>
            
            <div className="text-center">
              <Button
                asChild
                size="lg"
                className="text-lg shadow-3d shadow-primary/50 hover:shadow-primary/70 hover:scale-105 transition-all duration-300"
              >
                <Link href="mailto:careers@adham-agritech.com?subject=Application for {position.title}">
                  <Mail className="mr-2 h-5 w-5" />
                  Apply for this Position
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
