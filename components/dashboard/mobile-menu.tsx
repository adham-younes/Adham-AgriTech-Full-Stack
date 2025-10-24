"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  Sprout,
  MapPin,
  Droplets,
  Cloud,
  MessageSquare,
  Bell,
  FileText,
  ShoppingCart,
  Users,
  Settings,
  Wallet,
  Handshake,
  Activity,
  Menu,
  X,
} from "lucide-react"
import { Button } from "@/components/ui/button"

interface MobileMenuProps {
  user: any
  profile: any
}

const navigation = [
  { name: "لوحة التحكم", nameEn: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "المزارع", nameEn: "Farms", href: "/dashboard/farms", icon: Sprout },
  { name: "الحقول", nameEn: "Fields", href: "/dashboard/fields", icon: MapPin },
  { name: "تحليل التربة", nameEn: "Soil Analysis", href: "/dashboard/soil-analysis", icon: Droplets },
  { name: "مراقبة المحاصيل", nameEn: "Crop Monitoring", href: "/dashboard/crop-monitoring", icon: Sprout },
  { name: "الطقس", nameEn: "Weather", href: "/dashboard/weather", icon: Cloud },
  { name: "الري", nameEn: "Irrigation", href: "/dashboard/irrigation", icon: Droplets },
  { name: "المساعد الذكي", nameEn: "AI Assistant", href: "/dashboard/ai-assistant", icon: MessageSquare },
  { name: "البلوكتشين", nameEn: "Blockchain", href: "/dashboard/blockchain", icon: Wallet },
  { name: "التقارير", nameEn: "Reports", href: "/dashboard/reports", icon: FileText },
  { name: "الإشعارات", nameEn: "Notifications", href: "/dashboard/notifications", icon: Bell },
  { name: "السوق", nameEn: "Marketplace", href: "/dashboard/marketplace", icon: ShoppingCart },
  { name: "المنتدى", nameEn: "Forum", href: "/dashboard/forum", icon: Users },
  { name: "حالة الخدمات", nameEn: "Services", href: "/dashboard/services", icon: Activity },
  { name: "الشركاء", nameEn: "Partners", href: "/partners", icon: Handshake },
]

export function MobileMenu({ user, profile }: MobileMenuProps) {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden hover:bg-white/5 transition-all duration-300"
      >
        {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm md:hidden" onClick={() => setIsOpen(false)} />
      )}

      {/* Mobile Menu */}
      <div
        className={cn(
          "fixed right-0 top-16 z-50 h-[calc(100vh-4rem)] w-64 border-l border-sidebar-border bg-sidebar overflow-y-auto transition-transform duration-300 md:hidden",
          isOpen ? "translate-x-0" : "translate-x-full",
        )}
      >
        <nav className="space-y-1 p-4">
          {navigation.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all",
                  isActive
                    ? "bg-primary text-primary-foreground shadow-lg glow-primary"
                    : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-accent-foreground",
                )}
              >
                <item.icon className="h-5 w-5" />
                <span>{item.name}</span>
              </Link>
            )
          })}
        </nav>

        <div className="border-t border-sidebar-border p-4">
          <Link
            href="/dashboard/settings"
            onClick={() => setIsOpen(false)}
            className={cn(
              "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all",
              pathname === "/dashboard/settings"
                ? "bg-primary text-primary-foreground shadow-lg glow-primary"
                : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-accent-foreground",
            )}
          >
            <Settings className="h-5 w-5" />
            <span>الإعدادات</span>
          </Link>
        </div>
      </div>
    </>
  )
}
