import type React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Phone, Mail, MapPin, Clock } from "lucide-react"

export default function ContactPage() {
  return (
    <div className="flex min-h-screen flex-col bg-black">
      <section className="relative px-6 py-20">
        <div className="mx-auto max-w-6xl">
          <div className="mb-16 text-center">
            <h1 className="mb-6 text-5xl font-bold sm:text-6xl bg-gradient-to-b from-white via-white to-white/60 bg-clip-text text-transparent drop-shadow-2xl">
              Contact Us
            </h1>
            <p className="mx-auto max-w-2xl text-xl text-gray-400">
              Get in touch with our agricultural technology experts
            </p>
          </div>
          
          <div className="grid gap-12 lg:grid-cols-2">
            <div>
              <h2 className="mb-6 text-3xl font-bold text-white">Get In Touch</h2>
              <p className="mb-8 text-lg text-gray-400">
                Have questions about our smart agriculture platform? Our team of experts is ready to help you transform your farming operations.
              </p>
              
              <div className="space-y-6">
                <ContactInfo
                  icon={<Phone className="h-6 w-6" />}
                  title="Phone"
                  content="+962 7 7777 7777"
                />
                <ContactInfo
                  icon={<Mail className="h-6 w-6" />}
                  title="Email"
                  content="info@adham-agritech.com"
                />
                <ContactInfo
                  icon={<MapPin className="h-6 w-6" />}
                  title="Address"
                  content="Amman, Jordan"
                />
                <ContactInfo
                  icon={<Clock className="h-6 w-6" />}
                  title="Working Hours"
                  content="Sunday - Thursday: 8AM - 6PM"
                />
              </div>
            </div>
            
            <div className="glass-card rounded-2xl p-8">
              <h2 className="mb-6 text-2xl font-bold text-white">Send us a message</h2>
              <form className="space-y-6">
                <div className="grid gap-6 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="firstName" className="text-gray-300">First Name</Label>
                    <Input id="firstName" placeholder="Enter your first name" className="glass-card border-primary/30" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName" className="text-gray-300">Last Name</Label>
                    <Input id="lastName" placeholder="Enter your last name" className="glass-card border-primary/30" />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-gray-300">Email</Label>
                  <Input id="email" type="email" placeholder="Enter your email" className="glass-card border-primary/30" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="farmSize" className="text-gray-300">Farm Size (Hectares)</Label>
                  <Input id="farmSize" type="number" placeholder="Enter your farm size" className="glass-card border-primary/30" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="message" className="text-gray-300">Message</Label>
                  <Textarea id="message" placeholder="How can we help you?" className="glass-card border-primary/30 min-h-[140px]" />
                </div>
                
                <Button type="submit" size="lg" className="w-full text-lg shadow-3d shadow-primary/50 hover:shadow-primary/70 hover:scale-105 transition-all duration-300">
                  Send Message
                </Button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

function ContactInfo({
  icon,
  title,
  content,
}: {
  icon: React.ReactNode
  title: string
  content: string
}) {
  return (
    <div className="flex items-start">
      <div className="mr-4 mt-1 text-primary">{icon}</div>
      <div>
        <h3 className="text-lg font-semibold text-white">{title}</h3>
        <p className="text-gray-400">{content}</p>
      </div>
    </div>
  )
}
