"use client"

import { useMemo, useState, useTransition } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"

const betaSignupSchema = z.object({
  name: z
    .string()
    .min(2, "Please enter your full name")
    .max(80, "Name is too long"),
  email: z.string().email("Please provide a valid email address"),
  organization: z
    .string()
    .min(2, "Tell us your organization or role")
    .max(120, "Organization name is too long"),
  focusAreas: z
    .string()
    .min(2, "Share the crops or focus areas you work with")
    .max(240, "Please keep this under 240 characters"),
  goals: z
    .string()
    .min(10, "Let us know what you'd like to achieve")
    .max(500, "Please keep this under 500 characters"),
})

type BetaSignupValues = z.infer<typeof betaSignupSchema>

export function BetaSignupForm() {
  const [isPending, startTransition] = useTransition()
  const [hasSubmitted, setHasSubmitted] = useState(false)
  const form = useForm<BetaSignupValues>({
    resolver: zodResolver(betaSignupSchema),
    defaultValues: {
      name: "",
      email: "",
      organization: "",
      focusAreas: "",
      goals: "",
    },
    mode: "onBlur",
  })

  const disabled = useMemo(() => isPending || hasSubmitted, [isPending, hasSubmitted])

  const handleSubmit = (values: BetaSignupValues) => {
    startTransition(async () => {
      try {
        const response = await fetch("/api/beta-signup", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(values),
        })

        if (!response.ok) {
          const error = await response.json().catch(() => null)
          throw new Error(error?.message ?? "Unable to register right now. Please try again later.")
        }

        setHasSubmitted(true)
        toast.success("You're on the beta waitlist! We'll reach out soon.")
      } catch (error) {
        const message = error instanceof Error ? error.message : "Unexpected error. Please try email instead."
        toast.error(message)
      }
    })
  }

  return (
    <form
      onSubmit={form.handleSubmit(handleSubmit)}
      className="glass-card w-full rounded-2xl border border-primary/20 bg-black/40 p-5 sm:p-6 shadow-3d"
    >
      <fieldset className="space-y-4" disabled={disabled}>
        <div className="grid gap-2">
          <Label htmlFor="name" className="text-xs uppercase tracking-[0.2em] text-primary/80">
            Full name
          </Label>
          <Input
            id="name"
            placeholder="Sara Elshamy"
            {...form.register("name")}
            className="bg-black/40"
          />
          {form.formState.errors.name && (
            <p className="text-xs text-red-400">{form.formState.errors.name.message}</p>
          )}
        </div>
        <div className="grid gap-2">
          <Label htmlFor="email" className="text-xs uppercase tracking-[0.2em] text-primary/80">
            Work email
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="you@farmcoop.com"
            {...form.register("email")}
            className="bg-black/40"
          />
          {form.formState.errors.email && (
            <p className="text-xs text-red-400">{form.formState.errors.email.message}</p>
          )}
        </div>
        <div className="grid gap-2">
          <Label htmlFor="organization" className="text-xs uppercase tracking-[0.2em] text-primary/80">
            Organization / Role
          </Label>
          <Input
            id="organization"
            placeholder="Delta Valley Growers Cooperative"
            {...form.register("organization")}
            className="bg-black/40"
          />
          {form.formState.errors.organization && (
            <p className="text-xs text-red-400">{form.formState.errors.organization.message}</p>
          )}
        </div>
        <div className="grid gap-2">
          <Label htmlFor="focusAreas" className="text-xs uppercase tracking-[0.2em] text-primary/80">
            Primary crops or focus areas
          </Label>
          <Input
            id="focusAreas"
            placeholder="Tomatoes, wheat, precision irrigation"
            {...form.register("focusAreas")}
            className="bg-black/40"
          />
          {form.formState.errors.focusAreas && (
            <p className="text-xs text-red-400">{form.formState.errors.focusAreas.message}</p>
          )}
        </div>
        <div className="grid gap-2">
          <Label htmlFor="goals" className="text-xs uppercase tracking-[0.2em] text-primary/80">
            What outcome are you targeting?
          </Label>
          <Textarea
            id="goals"
            rows={4}
            placeholder="We need fast, offline disease triage for our tomato greenhouses and NDVI-driven fertigation alerts."
            {...form.register("goals")}
            className="resize-none bg-black/40"
          />
          {form.formState.errors.goals && (
            <p className="text-xs text-red-400">{form.formState.errors.goals.message}</p>
          )}
        </div>
      </fieldset>
      <div className="mt-5 flex flex-col gap-2">
        <Button type="submit" size="lg" disabled={disabled} className="shadow-3d shadow-primary/50">
          {hasSubmitted ? "Request received" : isPending ? "Submitting..." : "Join the beta waitlist"}
        </Button>
        <p className="text-[0.7rem] text-gray-400">
          Prefer email? Contact us at
          {" "}
          <a
            className="text-primary underline-offset-4 hover:underline"
            href="mailto:innovation@adham-agritech.com?subject=Mobile%20Diagnostic%20Studio%20Beta"
          >
            innovation@adham-agritech.com
          </a>
          .
        </p>
      </div>
    </form>
  )
}
