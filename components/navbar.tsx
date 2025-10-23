'use client'

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu, X, Leaf } from "lucide-react"

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  
  const navItems = [
    { name: "Home", href: "/" },
    { name: "Features", href: "/features" },
    { name: "Services", href: "/services" },
    { name: "Pricing", href: "/pricing" },
    { name: "Case Studies", href: "/case-studies" },
    { name: "Blog", href: "/blog" },
    { name: "Team", href: "/team" },
    { name: "FAQ", href: "/faq" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
  ]

  return (
    <header className="sticky top-0 z-50 w-full border-b border-primary/20 bg-black/80 backdrop-blur-xl">
      <div className="container flex h-16 items-center px-6">
        <div className="mr-6 flex items-center space-x-2">
          <Leaf className="h-6 w-6 text-primary" />
          <span className="text-xl font-bold text-white">Adham AgriTech</span>
        </div>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="text-gray-300 transition-colors hover:text-white"
            >
              {item.name}
            </Link>
          ))}
        </nav>
        
        <div className="flex flex-1 items-center justify-end space-x-4">
          <nav className="hidden md:flex items-center space-x-2">
            <Button variant="ghost" asChild className="text-gray-300 hover:text-white">
              <Link href="/auth/login">Sign In</Link>
            </Button>
            <Button asChild className="shadow-3d shadow-primary/50 hover:shadow-primary/70 hover:scale-105 transition-all duration-300">
              <Link href="/auth/signup">Get Started</Link>
            </Button>
          </nav>
          
          {/* Mobile Navigation */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                className="md:hidden px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
                size="icon"
              >
                <Menu className="h-6 w-6 text-gray-300" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="glass-card border-l border-primary/20 w-[300px] sm:w-[400px]">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center space-x-2">
                  <Leaf className="h-6 w-6 text-primary" />
                  <span className="text-xl font-bold text-white">Adham AgriTech</span>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsOpen(false)}
                  className="h-8 w-8"
                >
                  <X className="h-5 w-5 text-gray-300" />
                </Button>
              </div>
              <div className="my-6 h-px bg-primary/20" />
              <div className="flex flex-col space-y-4">
                {navItems.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="text-lg font-medium text-gray-300 hover:text-white py-2"
                    onClick={() => setIsOpen(false)}
                  >
                    {item.name}
                  </Link>
                ))}
                <div className="my-4 h-px bg-primary/20" />
                <Link href="/auth/login" className="text-lg font-medium text-gray-300 hover:text-white py-2">
                  Sign In
                </Link>
                <Button asChild className="shadow-3d shadow-primary/50 hover:shadow-primary/70 hover:scale-105 transition-all duration-300">
                  <Link href="/auth/signup" onClick={() => setIsOpen(false)}>
                    Get Started
                  </Link>
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
