import type React from "react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Calendar, User, Tag, ArrowRight } from "lucide-react"

export default function BlogPage() {
  const blogPosts = [
    {
      id: 1,
      title: "How AI is Revolutionizing Modern Agriculture",
      excerpt: "Explore how artificial intelligence is transforming farming practices and increasing productivity across the globe.",
      date: "2025-10-15",
      author: "Dr. Ahmed Hassan",
      tags: ["AI", "Technology", "Innovation"],
      readTime: "5 min read"
    },
    {
      id: 2,
      title: "Maximizing Water Efficiency with Smart Irrigation Systems",
      excerpt: "Learn how smart irrigation technology can reduce water usage by up to 50% while improving crop yields.",
      date: "2025-10-10",
      author: "Sarah Khalil",
      tags: ["Water Management", "Sustainability", "Irrigation"],
      readTime: "7 min read"
    },
    {
      id: 3,
      title: "Understanding NDVI for Crop Health Monitoring",
      excerpt: "A comprehensive guide to using Normalized Difference Vegetation Index for precision agriculture.",
      date: "2025-10-05",
      author: "Prof. Omar Farouk",
      tags: ["Satellite", "Crop Monitoring", "Analytics"],
      readTime: "6 min read"
    },
    {
      id: 4,
      title: "Blockchain Technology in Agriculture: Ensuring Transparency",
      excerpt: "Discover how blockchain is creating trust and transparency in agricultural supply chains.",
      date: "2025-09-28",
      author: "Layla Mahmoud",
      tags: ["Blockchain", "Supply Chain", "Transparency"],
      readTime: "8 min read"
    },
    {
      id: 5,
      title: "Soil Health: The Foundation of Successful Farming",
      excerpt: "Essential practices for maintaining and improving soil health for sustainable agriculture.",
      date: "2025-09-20",
      author: "Dr. Youssef Nasser",
      tags: ["Soil Health", "Sustainability", "Best Practices"],
      readTime: "6 min read"
    },
    {
      id: 6,
      title: "Weather Forecasting for Precision Agriculture",
      excerpt: "How hyper-local weather data is helping farmers make better decisions.",
      date: "2025-09-15",
      author: "Mariam Saeed",
      tags: ["Weather", "Planning", "Forecasting"],
      readTime: "5 min read"
    }
  ]

  return (
    <div className="flex min-h-screen flex-col bg-black">
      <section className="relative px-6 py-20">
        <div className="mx-auto max-w-6xl">
          <div className="mb-16 text-center">
            <h1 className="mb-6 text-5xl font-bold sm:text-6xl bg-gradient-to-b from-white via-white to-white/60 bg-clip-text text-transparent drop-shadow-2xl">
              Agricultural Insights & News
            </h1>
            <p className="mx-auto max-w-2xl text-xl text-gray-400">
              Expert articles on smart farming, technology trends, and agricultural best practices
            </p>
          </div>
          
          <div className="grid gap-8 lg:grid-cols-2 mb-16">
            {blogPosts.map((post) => (
              <BlogCard key={post.id} post={post} />
            ))}
          </div>
          
          <div className="text-center">
            <Button
              size="lg"
              variant="outline"
              className="text-lg glass-card border-primary/30 hover:border-primary/60 hover:scale-105 transition-all duration-300 bg-transparent"
            >
              Load More Articles
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}

function BlogCard({ post }: { post: any }) {
  return (
    <div className="glass-card rounded-2xl overflow-hidden hover:shadow-3d-lg transition-all duration-300 hover:scale-105">
      <div className="p-6">
        <div className="mb-4 flex flex-wrap gap-2">
          {post.tags.map((tag: string, index: number) => (
            <span key={index} className="glass-card px-3 py-1 text-xs rounded-full text-primary border border-primary/30">
              {tag}
            </span>
          ))}
        </div>
        
        <h2 className="mb-3 text-xl font-bold text-white">{post.title}</h2>
        <p className="mb-4 text-gray-400">{post.excerpt}</p>
        
        <div className="flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              <span>{new Date(post.date).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center gap-1">
              <User className="h-4 w-4" />
              <span>{post.author}</span>
            </div>
          </div>
          <span>{post.readTime}</span>
        </div>
        
        <Button asChild variant="ghost" className="mt-4 p-0 text-primary hover:text-primary/80">
          <Link href={`/blog/${post.id}`}>
            Read More
            <ArrowRight className="mr-2 h-4 w-4" />
          </Link>
        </Button>
      </div>
    </div>
  )
}
