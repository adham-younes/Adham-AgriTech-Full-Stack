import type React from "react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Calendar, User, Tag, ArrowLeft, Share2, Bookmark } from "lucide-react"

export default function BlogPostPage() {
  // This would typically be dynamic based on the ID
  const post = {
    id: 1,
    title: "How AI is Revolutionizing Modern Agriculture",
    date: "2025-10-15",
    author: "Dr. Ahmed Hassan",
    readTime: "5 min read",
    tags: ["AI", "Technology", "Innovation"],
    content: `
      <p>Artificial Intelligence (AI) is transforming the agricultural landscape at an unprecedented pace. From precision farming to predictive analytics, AI technologies are helping farmers increase productivity, reduce costs, and make more informed decisions.</p>
      
      <h2 class="text-2xl font-bold text-white mt-8 mb-4">The Rise of Precision Agriculture</h2>
      
      <p>Precision agriculture, powered by AI, allows farmers to monitor and manage their crops with incredible accuracy. By analyzing data from satellites, drones, and ground sensors, AI systems can identify variations in soil composition, moisture levels, and crop health across a field. This enables farmers to apply fertilizers, water, and pesticides only where needed, reducing waste and environmental impact.</p>
      
      <p>Machine learning algorithms can process vast amounts of data to detect patterns that would be impossible for humans to identify. For example, AI can predict pest outbreaks before they occur by analyzing weather patterns, historical data, and current crop conditions.</p>
      
      <h2 class="text-2xl font-bold text-white mt-8 mb-4">AI-Powered Decision Making</h2>
      
      <p>One of the most significant advantages of AI in agriculture is its ability to support decision-making processes. AI systems can analyze multiple variables simultaneously, including weather forecasts, market prices, soil conditions, and crop growth stages, to recommend optimal planting, fertilizing, and harvesting times.</p>
      
      <p>Robotic systems equipped with AI can perform tasks such as planting, weeding, and harvesting with precision and efficiency. These robots can work around the clock, reducing labor costs and increasing productivity.</p>
      
      <h2 class="text-2xl font-bold text-white mt-8 mb-4">Predictive Analytics for Crop Management</h2>
      
      <p>Predictive analytics, a subset of AI, uses historical data and current conditions to forecast future outcomes. In agriculture, this can mean predicting crop yields, identifying potential disease outbreaks, or anticipating market demand.</p>
      
      <p>By analyzing satellite imagery and sensor data, AI can predict crop yields with remarkable accuracy weeks or even months before harvest. This allows farmers to make informed decisions about storage, transportation, and sales.</p>
      
      <h2 class="text-2xl font-bold text-white mt-8 mb-4">Challenges and Future Outlook</h2>
      
      <p>Despite its potential, AI adoption in agriculture faces several challenges. High implementation costs, lack of technical expertise, and concerns about data privacy are significant barriers for many farmers. Additionally, the effectiveness of AI systems depends heavily on the quality and quantity of data available.</p>
      
      <p>However, as technology continues to advance and become more accessible, we can expect to see widespread adoption of AI in agriculture. The integration of AI with other emerging technologies such as blockchain, IoT, and 5G connectivity will further enhance its capabilities.</p>
      
      <p>The future of agriculture lies in the intelligent integration of technology and traditional farming practices. AI will play a crucial role in creating a more sustainable, efficient, and productive agricultural system that can feed a growing global population while minimizing environmental impact.</p>
    `
  }

  return (
    <div className="flex min-h-screen flex-col bg-black">
      <section className="relative px-6 py-20">
        <div className="mx-auto max-w-4xl">
          <Button asChild variant="ghost" className="mb-8 text-primary hover:text-primary/80">
            <Link href="/blog">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Blog
            </Link>
          </Button>
          
          <article className="glass-card rounded-3xl p-8 md:p-12">
            <div className="mb-6 flex flex-wrap gap-2">
              {post.tags.map((tag: string, index: number) => (
                <span key={index} className="glass-card px-3 py-1 text-sm rounded-full text-primary border border-primary/30">
                  {tag}
                </span>
              ))}
            </div>
            
            <h1 className="mb-6 text-4xl font-bold text-white">{post.title}</h1>
            
            <div className="mb-8 flex flex-wrap items-center gap-6 text-gray-400">
              <div className="flex items-center gap-2">
                <User className="h-5 w-5" />
                <span>{post.author}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                <span>{new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
              </div>
              <div>{post.readTime}</div>
            </div>
            
            <div className="prose prose-invert max-w-none mb-8">
              <div dangerouslySetInnerHTML={{ __html: post.content }} />
            </div>
            
            <div className="flex flex-wrap items-center justify-between gap-4 pt-8 border-t border-primary/20">
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="glass-card border-primary/30 hover:border-primary/60">
                  <Bookmark className="h-4 w-4" />
                  Save Article
                </Button>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-gray-400">Share:</span>
                <Button variant="outline" size="sm" className="glass-card border-primary/30 hover:border-primary/60">
                  <Share2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </article>
          
          <div className="glass-card rounded-3xl p-8 md:p-12 mt-8">
            <h2 className="mb-6 text-2xl font-bold text-white">About the Author</h2>
            <div className="flex items-start gap-4">
              <div className="h-16 w-16 rounded-full bg-primary/20 flex items-center justify-center">
                <User className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">{post.author}</h3>
                <p className="text-gray-400 mt-2">Dr. Ahmed Hassan is a leading agricultural technology expert with over 15 years of experience in precision farming and AI applications in agriculture. He holds a Ph.D. in Agricultural Engineering and has published numerous research papers on smart farming technologies.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
