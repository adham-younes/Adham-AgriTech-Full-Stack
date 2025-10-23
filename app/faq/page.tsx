import type React from "react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ChevronDown, Mail, Phone, MessageCircle } from "lucide-react"

export default function FAQPage() {
  const faqs = [
    {
      question: "How does the satellite crop monitoring work?",
      answer: "Our system uses high-resolution satellite imagery combined with NDVI (Normalized Difference Vegetation Index) and EVI (Enhanced Vegetation Index) to monitor crop health. Images are updated daily, and our AI analyzes changes in vegetation density to detect issues like pest infestations, disease outbreaks, or nutrient deficiencies before they become visible to the human eye."
    },
    {
      question: "What types of farms can benefit from Adham AgriTech?",
      answer: "Our platform is designed for all types of agricultural operations, from small family farms to large commercial operations. We support crop farming, orchards, vineyards, and greenhouse operations. Our modular approach allows you to choose the services that best fit your specific needs."
    },
    {
      question: "How accurate are the weather forecasts?",
      answer: "Our hyper-local weather forecasting system provides 95% accuracy for 7-day predictions and 90% accuracy for 14-day forecasts. We combine satellite data, ground-based sensors, and advanced meteorological models to deliver field-specific predictions that are significantly more accurate than general weather services."
    },
    {
      question: "Can I integrate Adham AgriTech with my existing farm equipment?",
      answer: "Yes, our Enterprise plan includes custom API integration that allows you to connect with most modern farm equipment and existing management systems. We support major agricultural technology standards and can work with your equipment manufacturer to ensure seamless integration."
    },
    {
      question: "How does the smart irrigation system save water?",
      answer: "Our smart irrigation system reduces water usage by an average of 30-50% by using soil moisture sensors, weather forecasts, and crop-specific requirements to determine optimal watering schedules. The system automatically adjusts watering duration and frequency based on real-time conditions, preventing both under and over-watering."
    },
    {
      question: "What security measures protect my farm data?",
      answer: "We use bank-level encryption for all data transmission and storage. Our blockchain technology ensures that sensitive information like land ownership records cannot be tampered with. We comply with all agricultural data privacy regulations and never sell or share your data with third parties without your explicit consent."
    },
    {
      question: "How quickly can I see results after implementing Adham AgriTech?",
      answer: "Most farmers see improvements in resource efficiency within the first month. Crop yield increases typically become noticeable within 2-3 growing seasons as our system optimizes your farming practices. Our AI assistant provides immediate value by answering agricultural questions and providing recommendations 24/7."
    },
    {
      question: "Do you offer training for using the platform?",
      answer: "Yes, we provide comprehensive onboarding and training for all new customers. This includes online tutorials, live webinars, and one-on-one sessions with our agricultural specialists. Our support team is available 24/7 to help you get the most from our platform."
    }
  ]

  return (
    <div className="flex min-h-screen flex-col bg-black">
      <section className="relative px-6 py-20">
        <div className="mx-auto max-w-4xl">
          <div className="mb-16 text-center">
            <h1 className="mb-6 text-5xl font-bold sm:text-6xl bg-gradient-to-b from-white via-white to-white/60 bg-clip-text text-transparent drop-shadow-2xl">
              Frequently Asked Questions
            </h1>
            <p className="mx-auto max-w-2xl text-xl text-gray-400">
              Everything you need to know about Adham AgriTech
            </p>
          </div>
          
          <div className="space-y-4 mb-16">
            {faqs.map((faq, index) => (
              <FAQItem key={index} question={faq.question} answer={faq.answer} />
            ))}
          </div>
          
          <div className="glass-card rounded-3xl p-8 md:p-12 text-center">
            <h2 className="mb-6 text-3xl font-bold text-white">Still Have Questions?</h2>
            <p className="mb-8 text-xl text-gray-400 max-w-2xl mx-auto">
              Our agricultural technology experts are ready to help you
            </p>
            <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
              <Button
                asChild
                size="lg"
                className="text-lg shadow-3d shadow-primary/50 hover:shadow-primary/70 hover:scale-105 transition-all duration-300"
              >
                <Link href="/contact">
                  <Mail className="mr-2 h-5 w-5" />
                  Email Us
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="text-lg glass-card border-primary/30 hover:border-primary/60 hover:scale-105 transition-all duration-300 bg-transparent"
              >
                <Link href="tel:+962777777777">
                  <Phone className="mr-2 h-5 w-5" />
                  Call Us
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="text-lg glass-card border-primary/30 hover:border-primary/60 hover:scale-105 transition-all duration-300 bg-transparent"
              >
                <Link href="#">
                  <MessageCircle className="mr-2 h-5 w-5" />
                  Live Chat
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = React.useState(false)
  
  return (
    <div className="glass-card rounded-2xl overflow-hidden">
      <button
        className="flex w-full items-center justify-between p-6 text-left"
        onClick={() => setIsOpen(!isOpen)}
      >
        <h3 className="text-lg font-semibold text-white">{question}</h3>
        <ChevronDown
          className={`h-5 w-5 text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>
      {isOpen && (
        <div className="px-6 pb-6 pt-0 text-gray-400 border-t border-primary/20">
          <p>{answer}</p>
        </div>
      )}
    </div>
  )
}
