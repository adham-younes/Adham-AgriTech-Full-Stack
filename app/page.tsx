import type React from "react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Sprout, Leaf, Droplets, Cloud, BarChart3, MessageSquare } from "lucide-react"

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Hero Section */}
      <section className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-background via-primary/5 to-secondary/10 px-6 py-20">
        <div className="absolute inset-0 bg-grid-white/5 [mask-image:radial-gradient(white,transparent_85%)]" />
        <div className="relative z-10 mx-auto max-w-5xl text-center">
          <div className="mb-8 flex justify-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-primary shadow-lg shadow-primary/20">
              <Sprout className="h-10 w-10 text-primary-foreground" />
            </div>
          </div>
          <h1 className="mb-6 text-5xl font-bold tracking-tight sm:text-6xl md:text-7xl">Adham AgriTech</h1>
          <p className="mb-4 text-2xl font-semibold text-primary sm:text-3xl">منصة الزراعة الذكية</p>
          <p className="mx-auto mb-12 max-w-2xl text-lg text-muted-foreground sm:text-xl">
            نظام متكامل لإدارة المزارع باستخدام الذكاء الاصطناعي والأقمار الصناعية لتحسين الإنتاجية وتوفير الموارد
          </p>
          <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Button asChild size="lg" className="text-lg">
              <Link href="/auth/signup">ابدأ الآن مجاناً</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="text-lg bg-transparent">
              <Link href="/auth/login">تسجيل الدخول</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-6 py-20 bg-card">
        <div className="mx-auto max-w-6xl">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-3xl font-bold sm:text-4xl">مميزات المنصة</h2>
            <p className="text-lg text-muted-foreground">حلول متقدمة لإدارة مزرعتك بكفاءة عالية</p>
          </div>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <FeatureCard
              icon={<Leaf className="h-8 w-8" />}
              title="مراقبة المحاصيل"
              description="تتبع صحة المحاصيل باستخدام صور الأقمار الصناعية ومؤشرات NDVI و EVI"
            />
            <FeatureCard
              icon={<Droplets className="h-8 w-8" />}
              title="إدارة الري الذكي"
              description="التحكم في أنظمة الري وجدولة الري بناءً على بيانات التربة والطقس"
            />
            <FeatureCard
              icon={<Cloud className="h-8 w-8" />}
              title="توقعات الطقس"
              description="توقعات دقيقة للطقس لمدة 7 أيام لتخطيط أفضل للأنشطة الزراعية"
            />
            <FeatureCard
              icon={<BarChart3 className="h-8 w-8" />}
              title="تحليل التربة"
              description="تحليل شامل للتربة مع توصيات ذكية للأسمدة والري"
            />
            <FeatureCard
              icon={<MessageSquare className="h-8 w-8" />}
              title="مساعد ذكي"
              description="مساعد زراعي ذكي يجيب على أسئلتك ويقدم نصائح مخصصة"
            />
            <FeatureCard
              icon={<Sprout className="h-8 w-8" />}
              title="سوق زراعي"
              description="منصة لبيع وشراء المنتجات والمعدات الزراعية"
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-6 py-20 bg-gradient-to-br from-primary/10 via-background to-secondary/10">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="mb-6 text-3xl font-bold sm:text-4xl">جاهز لتحسين إنتاجية مزرعتك؟</h2>
          <p className="mb-8 text-lg text-muted-foreground">
            انضم إلى آلاف المزارعين الذين يستخدمون Adham AgriTech لإدارة مزارعهم
          </p>
          <Button asChild size="lg" className="text-lg">
            <Link href="/auth/signup">ابدأ الآن</Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-card px-6 py-8">
        <div className="mx-auto max-w-6xl text-center text-sm text-muted-foreground">
          <p>© 2025 Adham AgriTech. جميع الحقوق محفوظة.</p>
        </div>
      </footer>
    </div>
  )
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode
  title: string
  description: string
}) {
  return (
    <div className="group rounded-xl border bg-card p-6 transition-all hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
        {icon}
      </div>
      <h3 className="mb-2 text-xl font-semibold">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  )
}
