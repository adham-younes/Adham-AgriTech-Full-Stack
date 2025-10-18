// Sentinel Hub Integration for Real Satellite Imagery
// يتطلب حساب على https://www.sentinel-hub.com/

interface SentinelHubConfig {
  clientId: string
  clientSecret: string
  instanceId: string
}

interface BBox {
  minLng: number
  minLat: number
  maxLng: number
  maxLat: number
}

export class SentinelHubService {
  private config: SentinelHubConfig
  private accessToken: string | null = null
  private tokenExpiry: Date | null = null

  constructor() {
    this.config = {
      clientId: process.env.SENTINEL_HUB_CLIENT_ID || "",
      clientSecret: process.env.SENTINEL_HUB_CLIENT_SECRET || "",
      instanceId: process.env.SENTINEL_HUB_INSTANCE_ID || "",
    }
  }

  // الحصول على رمز الوصول
  private async getAccessToken(): Promise<string> {
    if (this.accessToken && this.tokenExpiry && this.tokenExpiry > new Date()) {
      return this.accessToken
    }

    const tokenUrl = "https://services.sentinel-hub.com/oauth/token"
    const params = new URLSearchParams({
      grant_type: "client_credentials",
      client_id: this.config.clientId,
      client_secret: this.config.clientSecret,
    })

    try {
      const response = await fetch(tokenUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: params.toString(),
      })

      if (!response.ok) {
        throw new Error("Failed to get access token")
      }

      const data = await response.json()
      this.accessToken = data.access_token
      this.tokenExpiry = new Date(Date.now() + data.expires_in * 1000)

      return this.accessToken
    } catch (error) {
      console.error("Error getting Sentinel Hub access token:", error)
      throw error
    }
  }

  // حساب NDVI
  private getNDVIScript(): string {
    return `
    //VERSION=3
    function setup() {
      return {
        input: [{
          bands: ["B04", "B08"],
        }],
        output: {
          bands: 3
        }
      };
    }
    
    function evaluatePixel(sample) {
      let ndvi = (sample.B08 - sample.B04) / (sample.B08 + sample.B04);
      
      // تدرج الألوان حسب قيمة NDVI
      if (ndvi < -0.5) return [0.05, 0.05, 0.05];
      else if (ndvi < 0) return [0.75, 0.75, 0.75];
      else if (ndvi < 0.1) return [0.86, 0.86, 0.86];
      else if (ndvi < 0.2) return [0.92, 0.92, 0.92];
      else if (ndvi < 0.3) return [1, 0.98, 0.8];
      else if (ndvi < 0.4) return [0.93, 0.91, 0.71];
      else if (ndvi < 0.5) return [0.87, 0.85, 0.61];
      else if (ndvi < 0.6) return [0.8, 0.78, 0.51];
      else if (ndvi < 0.7) return [0.74, 0.72, 0.42];
      else return [0.69, 0.76, 0.38];
    }
    `
  }

  // الحصول على صورة True Color
  private getTrueColorScript(): string {
    return `
    //VERSION=3
    function setup() {
      return {
        input: [{
          bands: ["B04", "B03", "B02"],
        }],
        output: {
          bands: 3
        }
      };
    }
    
    function evaluatePixel(sample) {
      return [sample.B04*2.5, sample.B03*2.5, sample.B02*2.5];
    }
    `
  }

  // الحصول على صورة القمر الصناعي
  async getSatelliteImage(
    bbox: BBox,
    width: number = 512,
    height: number = 512,
    imageType: "NDVI" | "TRUE_COLOR" = "NDVI",
    fromDate?: string,
    toDate?: string
  ): Promise<string | null> {
    try {
      if (!this.config.clientId || !this.config.clientSecret) {
        console.log("Sentinel Hub credentials not configured")
        return null
      }

      const token = await this.getAccessToken()

      const evalscript = imageType === "NDVI" ? this.getNDVIScript() : this.getTrueColorScript()

      const requestBody = {
        input: {
          bounds: {
            bbox: [bbox.minLng, bbox.minLat, bbox.maxLng, bbox.maxLat],
            properties: {
              crs: "http://www.opengis.net/def/crs/EPSG/0/4326",
            },
          },
          data: [
            {
              type: "sentinel-2-l2a",
              dataFilter: {
                timeRange: {
                  from: fromDate || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
                  to: toDate || new Date().toISOString(),
                },
                maxCloudCoverage: 30,
              },
            },
          ],
        },
        output: {
          width: width,
          height: height,
          responses: [
            {
              identifier: "default",
              format: {
                type: "image/png",
              },
            },
          ],
        },
        evalscript: evalscript,
      }

      const response = await fetch(
        `https://services.sentinel-hub.com/api/v1/process`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestBody),
        }
      )

      if (!response.ok) {
        throw new Error(`Sentinel Hub error: ${response.status}`)
      }

      const blob = await response.blob()
      const base64 = await this.blobToBase64(blob)
      
      return base64
    } catch (error) {
      console.error("Error fetching satellite image:", error)
      return null
    }
  }

  // تحويل Blob إلى Base64
  private async blobToBase64(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onloadend = () => {
        if (typeof reader.result === "string") {
          resolve(reader.result)
        } else {
          reject(new Error("Failed to convert blob to base64"))
        }
      }
      reader.onerror = reject
      reader.readAsDataURL(blob)
    })
  }

  // حساب إحصائيات NDVI لمنطقة معينة
  async calculateNDVIStats(bbox: BBox): Promise<{
    mean: number
    min: number
    max: number
    stdDev: number
  } | null> {
    try {
      const token = await this.getAccessToken()

      const statsScript = `
      //VERSION=3
      function setup() {
        return {
          input: [{
            bands: ["B04", "B08"],
          }],
          output: [
            {
              id: "ndvi",
              bands: 1
            },
            {
              id: "dataMask",
              bands: 1
            }
          ]
        };
      }
      
      function evaluatePixel(sample) {
        let ndvi = (sample.B08 - sample.B04) / (sample.B08 + sample.B04);
        return {
          ndvi: [ndvi],
          dataMask: [sample.dataMask]
        };
      }
      `

      const requestBody = {
        input: {
          bounds: {
            bbox: [bbox.minLng, bbox.minLat, bbox.maxLng, bbox.maxLat],
            properties: {
              crs: "http://www.opengis.net/def/crs/EPSG/0/4326",
            },
          },
          data: [
            {
              type: "sentinel-2-l2a",
              dataFilter: {
                timeRange: {
                  from: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
                  to: new Date().toISOString(),
                },
                maxCloudCoverage: 20,
              },
            },
          ],
        },
        aggregation: {
          timeRange: {
            from: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
            to: new Date().toISOString(),
          },
          aggregationInterval: {
            of: "P1D",
          },
          evalscript: statsScript,
        },
        calculations: {
          ndvi: {
            histograms: {
              default: {
                nBins: 20,
                lowEdge: -1,
                highEdge: 1,
              },
            },
            statistics: {
              default: {
                percentiles: {
                  k: [25, 50, 75],
                },
              },
            },
          },
        },
      }

      const response = await fetch(
        `https://services.sentinel-hub.com/api/v1/statistics`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestBody),
        }
      )

      if (!response.ok) {
        throw new Error(`Sentinel Hub statistics error: ${response.status}`)
      }

      const data = await response.json()
      
      // استخراج الإحصائيات من البيانات
      if (data.data && data.data.length > 0) {
        const stats = data.data[0].outputs.ndvi.bands.B0.statistics
        return {
          mean: stats.mean || 0,
          min: stats.min || 0,
          max: stats.max || 1,
          stdDev: stats.stDev || 0,
        }
      }

      return null
    } catch (error) {
      console.error("Error calculating NDVI stats:", error)
      return null
    }
  }
}

// خدمة بديلة مجانية باستخدام NASA Worldview
export class NASAWorldviewService {
  private baseUrl = "https://gibs.earthdata.nasa.gov/wms/epsg4326/best/wms.cgi"

  // الحصول على صورة MODIS NDVI
  async getNDVIImage(
    bbox: BBox,
    width: number = 512,
    height: number = 512,
    date?: Date
  ): Promise<string> {
    const dateStr = (date || new Date()).toISOString().split("T")[0]
    
    const params = new URLSearchParams({
      SERVICE: "WMS",
      REQUEST: "GetMap",
      VERSION: "1.3.0",
      LAYERS: "MODIS_Terra_NDVI_8Day",
      STYLES: "",
      FORMAT: "image/png",
      TRANSPARENT: "false",
      HEIGHT: height.toString(),
      WIDTH: width.toString(),
      TIME: dateStr,
      CRS: "EPSG:4326",
      BBOX: `${bbox.minLat},${bbox.minLng},${bbox.maxLat},${bbox.maxLng}`,
    })

    return `${this.baseUrl}?${params.toString()}`
  }

  // الحصول على صورة True Color
  async getTrueColorImage(
    bbox: BBox,
    width: number = 512,
    height: number = 512,
    date?: Date
  ): Promise<string> {
    const dateStr = (date || new Date()).toISOString().split("T")[0]
    
    const params = new URLSearchParams({
      SERVICE: "WMS",
      REQUEST: "GetMap",
      VERSION: "1.3.0",
      LAYERS: "MODIS_Terra_CorrectedReflectance_TrueColor",
      STYLES: "",
      FORMAT: "image/jpeg",
      TRANSPARENT: "false",
      HEIGHT: height.toString(),
      WIDTH: width.toString(),
      TIME: dateStr,
      CRS: "EPSG:4326",
      BBOX: `${bbox.minLat},${bbox.minLng},${bbox.maxLat},${bbox.maxLng}`,
    })

    return `${this.baseUrl}?${params.toString()}`
  }
}

// استخدام الخدمة المناسبة حسب التوفر
export const satelliteService = process.env.SENTINEL_HUB_CLIENT_ID
  ? new SentinelHubService()
  : new NASAWorldviewService()