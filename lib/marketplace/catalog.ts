import { cache } from "react"

export type MarketplaceFilters = {
  query?: string
  category?: string
  limit?: number
}

export type MarketplaceProduct = {
  id: string
  title: string
  description: string
  price: number
  currency: string
  provider: string
  providerLabel: string
  availability: "in_stock" | "limited" | "out_of_stock"
  url: string
  image?: string
  tags?: string[]
  rating?: number
  stock?: number
  shippingEstimateDays?: [number, number]
  relevance?: number
}

export type ProviderCapability =
  | "realtime-pricing"
  | "logistics-tracking"
  | "bulk-orders"
  | "localized-compliance"
  | "wholesale-discounts"
  | "direct-fulfilment"

export type ProviderStatus = {
  name: string
  label: string
  enabled: boolean
  status: "ok" | "error" | "disabled"
  latencyMs: number
  capabilities: ProviderCapability[]
  message?: string
}

type MarketplaceProvider = {
  name: string
  label: string
  enabled: boolean
  disabledReason?: string
  capabilities: ProviderCapability[]
  fetchProducts: (filters: MarketplaceFilters) => Promise<MarketplaceProduct[]>
}

type CatalogResult = {
  filters: MarketplaceFilters
  generatedAt: string
  items: MarketplaceProduct[]
  providers: ProviderStatus[]
}

const providers: MarketplaceProvider[] = [
  createAmazonProvider(),
  createAlibabaProvider(),
  createDemoProvider(),
]

export const getMarketplaceCatalog = cache(async (filters: MarketplaceFilters = {}): Promise<CatalogResult> => {
  const tasks = providers.map(async (provider) => {
    const start = performance.now()

    if (!provider.enabled) {
      return {
        provider,
        items: [] as MarketplaceProduct[],
        latencyMs: 0,
        status: "disabled" as const,
        message: provider.disabledReason ?? "Provider disabled",
      }
    }

    try {
      const items = await provider.fetchProducts(filters)
      const latencyMs = Math.round(performance.now() - start)
      return {
        provider,
        items,
        latencyMs,
        status: "ok" as const,
      }
    } catch (error) {
      const latencyMs = Math.round(performance.now() - start)
      return {
        provider,
        items: [] as MarketplaceProduct[],
        latencyMs,
        status: "error" as const,
        message: error instanceof Error ? error.message : "Unknown provider error",
      }
    }
  })

  const results = await Promise.all(tasks)

  const items = results
    .flatMap((result) => result.items)
    .sort((a, b) => (b.relevance ?? 0) - (a.relevance ?? 0))
    .slice(0, filters.limit ?? 36)

  const providersStatus: ProviderStatus[] = results.map((result) => ({
    name: result.provider.name,
    label: result.provider.label,
    enabled: result.provider.enabled,
    status: result.status,
    latencyMs: result.latencyMs,
    capabilities: result.provider.capabilities,
    message: result.message,
  }))

  return {
    filters,
    generatedAt: new Date().toISOString(),
    items,
    providers: providersStatus,
  }
})

function createAmazonProvider(): MarketplaceProvider {
  const endpoint = process.env.AMAZON_ASSOCIATE_API_ENDPOINT
  const accessKey = process.env.AMAZON_ASSOCIATE_API_KEY
  const secret = process.env.AMAZON_ASSOCIATE_API_SECRET
  const partnerTag = process.env.AMAZON_ASSOCIATE_PARTNER_TAG

  const enabled = Boolean(endpoint && accessKey && secret && partnerTag)

  return {
    name: "amazon",
    label: "Amazon Business",
    enabled,
    disabledReason: enabled
      ? undefined
      : "Set AMAZON_ASSOCIATE_API_ENDPOINT, AMAZON_ASSOCIATE_API_KEY, AMAZON_ASSOCIATE_API_SECRET and AMAZON_ASSOCIATE_PARTNER_TAG environment variables to activate the Amazon provider.",
    capabilities: ["realtime-pricing", "direct-fulfilment", "logistics-tracking"],
    async fetchProducts() {
      if (!enabled) {
        throw new Error("Amazon provider is disabled")
      }

      // The official Amazon Product Advertising API requires request signing.
      // Implementors should wire an internal API gateway or Lambda function that
      // performs the signed request and returns normalized payloads to this layer.
      throw new Error("Amazon provider requires upstream integration gateway")
    },
  }
}

function createAlibabaProvider(): MarketplaceProvider {
  const appKey = process.env.ALIBABA_API_KEY
  const appSecret = process.env.ALIBABA_API_SECRET
  const endpoint = process.env.ALIBABA_API_ENDPOINT ?? "https://api-sandbox.aliexpress.com"

  const enabled = Boolean(appKey && appSecret)

  return {
    name: "alibaba",
    label: "Alibaba Global Sourcing",
    enabled,
    disabledReason: enabled
      ? undefined
      : "Set ALIBABA_API_KEY and ALIBABA_API_SECRET environment variables to activate the Alibaba provider.",
    capabilities: ["bulk-orders", "wholesale-discounts", "localized-compliance"],
    async fetchProducts(filters) {
      if (!enabled) {
        throw new Error("Alibaba provider is disabled")
      }

      const query = filters.query ?? "agriculture"
      const searchUrl = new URL("/itemService/search", endpoint)
      searchUrl.searchParams.set("keywords", query)
      if (filters.category) {
        searchUrl.searchParams.set("category", filters.category)
      }

      const response = await fetch(searchUrl, {
        headers: {
          "x-api-key": appKey,
          "x-api-secret": appSecret,
        },
        next: { revalidate: 900 },
      })

      if (!response.ok) {
        throw new Error(`Alibaba API error: ${response.status} ${response.statusText}`)
      }

      const payload = (await response.json()) as {
        result?: Array<{
          productId: string
          subject: string
          description?: string
          imageUrl?: string
          price?: string
          salePrice?: string
          originalPrice?: string
          currency?: string
          volume?: number
          score?: number
          productUrl?: string
        }>
      }

      const catalog = payload.result ?? []

      return catalog.map<MarketplaceProduct>((product, index) => {
        const price = Number(product.salePrice ?? product.price ?? product.originalPrice ?? 0)
        const currency = product.currency ?? "USD"

        return {
          id: `alibaba-${product.productId}`,
          title: product.subject,
          description: product.description ?? "",
          price,
          currency,
          provider: "alibaba",
          providerLabel: "Alibaba Global Sourcing",
          availability: "in_stock",
          url: product.productUrl ?? `https://www.alibaba.com/product-detail/${product.productId}.html`,
          image: product.imageUrl,
          tags: [filters.category ?? "general"],
          rating: product.score ? Math.min(5, Math.max(0, Number(product.score) / 20)) : undefined,
          shippingEstimateDays: [14, 30],
          relevance: product.score ?? Math.max(1, catalog.length - index),
        }
      })
    },
  }
}

function createDemoProvider(): MarketplaceProvider {
  return {
    name: "demo",
    label: "Global Agri Inputs Demo",
    enabled: true,
    capabilities: ["realtime-pricing", "direct-fulfilment", "logistics-tracking"],
    async fetchProducts(filters) {
      const query = filters.query?.trim()
      const category = filters.category?.trim()

      const endpoint = new URL("https://dummyjson.com/products")
      if (query) {
        endpoint.pathname = "/products/search"
        endpoint.searchParams.set("q", query)
      }

      const response = await fetch(endpoint, { next: { revalidate: 600 } })
      if (!response.ok) {
        throw new Error(`Demo provider failed: ${response.status}`)
      }

      const payload = (await response.json()) as {
        products?: Array<{
          id: number
          title: string
          description: string
          price: number
          rating: number
          stock: number
          category: string
          brand?: string
          tags?: string[]
          thumbnail?: string
        }>
      }

      const products = payload.products ?? []

      return products
        .filter((product) => {
          if (!category) return true
          return product.category.toLowerCase().includes(category.toLowerCase())
        })
        .map<MarketplaceProduct>((product, index) => {
          const tags = new Set<string>()
          product.tags?.forEach((tag) => tags.add(tag))
          if (product.brand) tags.add(product.brand)
          if (category) tags.add(category)

          return {
            id: `demo-${product.id}`,
            title: product.title,
            description: product.description,
            price: product.price,
            currency: "USD",
            provider: "demo",
            providerLabel: "Global Agri Inputs Demo",
            availability: product.stock > 10 ? "in_stock" : product.stock > 0 ? "limited" : "out_of_stock",
            url: `https://dummyjson.com/products/${product.id}`,
            image: product.thumbnail,
            tags: Array.from(tags),
            rating: Number(product.rating.toFixed(1)),
            stock: product.stock,
            shippingEstimateDays: [3, 10],
            relevance: Math.max(1, products.length - index),
          }
        })
    },
  }
}
