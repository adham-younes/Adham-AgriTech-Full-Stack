"use client"

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
  Satellite,
  Code,
} from "lucide-react"

interface SidebarProps {
  user: any
  profile: any
}

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Farms", href: "/dashboard/farms", icon: Sprout },
  { name: "Fields", href: "/dashboard/fields", icon: MapPin },
  { name: "Soil Analysis", href: "/dashboard/soil-analysis", icon: Droplets },
  { name: "Crop Monitoring", href: "/dashboard/crop-monitoring", icon: Sprout },
  { name: "Weather", href: "/dashboard/weather", icon: Cloud },
  { name: "Irrigation", href: "/dashboard/irrigation", icon: Droplets },
  { name: "AI Assistant", href: "/dashboard/ai-assistant", icon: MessageSquare },
  { name: "Blockchain", href: "/dashboard/blockchain", icon: Wallet },
  { name: "Reports", href: "/dashboard/reports", icon: FileText },
  { name: "Notifications", href: "/dashboard/notifications", icon: Bell },
  { name: "Marketplace", href: "/dashboard/marketplace", icon: ShoppingCart },
  { name: "Forum", href: "/dashboard/forum", icon: Users },
  { name: "Services", href: "/dashboard/services", icon: Activity },
  { name: "Satellite", href: "/dashboard/satellite", icon: Satellite },
  { name: "Features", href: "/dashboard/features", icon: Code },
  { name: "Partners", href: "/partners", icon: Handshake },
]

export function DashboardSidebar({ user, profile }: SidebarProps) {
  const pathname = usePathname()

  return (
    <aside className="flex w-full flex-col border-l bg-sidebar">
      {/* Logo */}
      <div className="flex h-16 items-center gap-3 border-b border-sidebar-border px-6">
        <div className="glow-primary flex h-10 w-10 items-center justify-center rounded-xl bg-primary shadow-lg">
          <Sprout className="h-5 w-5 text-primary-foreground" />
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-semibold">Adham AgriTech</span>
          <span className="text-xs text-muted-foreground">Smart Agriculture Platform</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 overflow-y-auto p-4">
        {navigation.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all",
                isActive
                  ? "bg-primary text-primary-foreground shadow-lg glow-primary"
                  : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-accent-foreground",
              )}
            >
              <item.icon className="h-5 w-5 flex-shrink-0" />
              <span>{item.name}</span>
            </Link>
          )
        })}
      </nav>

      {/* Settings */}
      <div className="border-t border-sidebar-border p-4">
        <Link
          href="/dashboard/settings"
          className={cn(
            "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all",
            pathname === "/dashboard/settings"
              ? "bg-primary text-primary-foreground shadow-lg glow-primary"
              : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-accent-foreground",
          )}
        >
          <Settings className="h-5 w-5 flex-shrink-0" />
          <span>Settings</span>
        </Link>
      </div>
    </aside>
  )
}
