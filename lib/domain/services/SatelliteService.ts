// ===========================================
// Adham AgriTech - Satellite Service
// ===========================================

import { GeoCoordinate } from '../types';

export interface SatelliteImage {
  id: string;
  url: string;
  bounds: {
    north: number;
    south: number;
    east: number;
    west: number;
  };
  resolution: number;
  date: string;
  source: 'mapbox' | 'google' | 'copernicus';
  cloud_coverage?: number;
}

export interface NDVIImage {
  id: string;
  url: string;
  bounds: {
    north: number;
    south: number;
    east: number;
    west: number;
  };
  ndvi_value: number;
  vegetation_health: 'poor' | 'fair' | 'good' | 'excellent';
  date: string;
}

export class SatelliteService {
  private static readonly MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;
  private static readonly COPERNICUS_CLIENT_ID = process.env.COPERNICUS_CLIENT_ID;
  private static readonly COPERNICUS_CLIENT_SECRET = process.env.COPERNICUS_CLIENT_SECRET;
  private static readonly CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours

  private static cache = new Map<string, { data: any; timestamp: number }>();

  /**
   * الحصول على صورة أقمار صناعية
   */
  static async getSatelliteImage(
    center: GeoCoordinate,
    zoom: number = 15,
    size: { width: number; height: number } = { width: 512, height: 512 }
  ): Promise<SatelliteImage> {
    const cacheKey = `satellite_${center.latitude}_${center.longitude}_${zoom}`;
    
    // التحقق من التخزين المؤقت
    const cached = this.cache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < this.CACHE_DURATION) {
      return cached.data;
    }

    if (!this.MAPBOX_TOKEN) {
      throw new Error('Mapbox access token not configured');
    }

    try {
      // استخدام Mapbox Satellite imagery
      const imageUrl = this.buildMapboxImageUrl(center, zoom, size);
      
      const satelliteImage: SatelliteImage = {
        id: `sat_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        url: imageUrl,
        bounds: this.calculateBounds(center, zoom),
        resolution: this.calculateResolution(zoom),
        date: new Date().toISOString(),
        source: 'mapbox',
        cloud_coverage: 0 // Mapbox imagery is cloud-free
      };

      // حفظ في التخزين المؤقت
      this.cache.set(cacheKey, {
        data: satelliteImage,
        timestamp: Date.now()
      });

      return satelliteImage;
    } catch (error) {
      console.error('Satellite image error:', error);
      throw new Error('Failed to fetch satellite image');
    }
  }

  /**
   * بناء URL صورة Mapbox
   */
  private static buildMapboxImageUrl(
    center: GeoCoordinate,
    zoom: number,
    size: { width: number; height: number }
  ): string {
    const { latitude, longitude } = center;
    const { width, height } = size;
    
    return `https://api.mapbox.com/styles/v1/mapbox/satellite-v9/static/${longitude},${latitude},${zoom}/${width}x${height}@2x?access_token=${this.MAPBOX_TOKEN}`;
  }

  /**
   * حساب حدود الصورة
   */
  private static calculateBounds(
    center: GeoCoordinate,
    zoom: number
  ): SatelliteImage['bounds'] {
    const latRange = 180 / Math.pow(2, zoom);
    const lngRange = 360 / Math.pow(2, zoom);
    
    return {
      north: center.latitude + latRange / 2,
      south: center.latitude - latRange / 2,
      east: center.longitude + lngRange / 2,
      west: center.longitude - lngRange / 2
    };
  }

  /**
   * حساب دقة الصورة
   */
  private static calculateResolution(zoom: number): number {
    // دقة تقريبية بالمتر لكل بكسل
    const earthCircumference = 40075017; // متر
    return earthCircumference / Math.pow(2, zoom + 8);
  }

  /**
   * الحصول على صورة NDVI (مؤشر الغطاء النباتي)
   */
  static async getNDVIImage(
    center: GeoCoordinate,
    dateRange: { start: Date; end: Date }
  ): Promise<NDVIImage> {
    const cacheKey = `ndvi_${center.latitude}_${center.longitude}_${dateRange.start.getTime()}`;
    
    // التحقق من التخزين المؤقت
    const cached = this.cache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < this.CACHE_DURATION) {
      return cached.data;
    }

    try {
      // استخدام Copernicus أو خدمة أخرى للحصول على بيانات NDVI
      const ndviData = await this.fetchNDVIData(center, dateRange);
      
      const ndviImage: NDVIImage = {
        id: `ndvi_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        url: ndviData.url,
        bounds: ndviData.bounds,
        ndvi_value: ndviData.ndvi_value,
        vegetation_health: this.calculateVegetationHealth(ndviData.ndvi_value),
        date: ndviData.date
      };

      // حفظ في التخزين المؤقت
      this.cache.set(cacheKey, {
        data: ndviImage,
        timestamp: Date.now()
      });

      return ndviImage;
    } catch (error) {
      console.error('NDVI image error:', error);
      throw new Error('Failed to fetch NDVI image');
    }
  }

  /**
   * جلب بيانات NDVI من Copernicus
   */
  private static async fetchNDVIData(
    center: GeoCoordinate,
    dateRange: { start: Date; end: Date }
  ): Promise<{
    url: string;
    bounds: NDVIImage['bounds'];
    ndvi_value: number;
    date: string;
  }> {
    // هذا مثال مبسط - يحتاج تنفيذ كامل لـ Copernicus API
    if (!this.COPERNICUS_CLIENT_ID || !this.COPERNICUS_CLIENT_SECRET) {
      throw new Error('Copernicus credentials not configured');
    }

    // محاكاة بيانات NDVI
    const ndviValue = Math.random() * 0.8 + 0.1; // قيمة عشوائية بين 0.1 و 0.9
    
    return {
      url: `https://example.com/ndvi/${center.latitude}_${center.longitude}.png`,
      bounds: this.calculateBounds(center, 15),
      ndvi_value: Math.round(ndviValue * 100) / 100,
      date: new Date().toISOString()
    };
  }

  /**
   * حساب صحة الغطاء النباتي من قيمة NDVI
   */
  private static calculateVegetationHealth(ndviValue: number): NDVIImage['vegetation_health'] {
    if (ndviValue >= 0.7) return 'excellent';
    if (ndviValue >= 0.5) return 'good';
    if (ndviValue >= 0.3) return 'fair';
    return 'poor';
  }

  /**
   * الحصول على صور متعددة الأطياف
   */
  static async getMultispectralImages(
    center: GeoCoordinate,
    bands: string[] = ['red', 'green', 'blue', 'nir']
  ): Promise<Record<string, string>> {
    const images: Record<string, string> = {};
    
    for (const band of bands) {
      try {
        const imageUrl = await this.getBandImage(center, band);
        images[band] = imageUrl;
      } catch (error) {
        console.error(`Error fetching ${band} band:`, error);
      }
    }

    return images;
  }

  /**
   * الحصول على صورة لطيف معين
   */
  private static async getBandImage(
    center: GeoCoordinate,
    band: string
  ): Promise<string> {
    // هذا مثال مبسط - يحتاج تنفيذ كامل
    const { latitude, longitude } = center;
    return `https://example.com/${band}/${longitude},${latitude}.png`;
  }

  /**
   * تحليل التغير في الغطاء النباتي
   */
  static async analyzeVegetationChange(
    center: GeoCoordinate,
    period1: { start: Date; end: Date },
    period2: { start: Date; end: Date }
  ): Promise<{
    change_percentage: number;
    trend: 'improving' | 'declining' | 'stable';
    areas_of_concern: GeoCoordinate[];
  }> {
    try {
      const ndvi1 = await this.getNDVIImage(center, period1);
      const ndvi2 = await this.getNDVIImage(center, period2);
      
      const changePercentage = ((ndvi2.ndvi_value - ndvi1.ndvi_value) / ndvi1.ndvi_value) * 100;
      
      let trend: 'improving' | 'declining' | 'stable' = 'stable';
      if (changePercentage > 5) trend = 'improving';
      else if (changePercentage < -5) trend = 'declining';

      return {
        change_percentage: Math.round(changePercentage * 100) / 100,
        trend,
        areas_of_concern: [] // يحتاج تحليل أكثر تعقيداً
      };
    } catch (error) {
      console.error('Vegetation change analysis error:', error);
      throw new Error('Failed to analyze vegetation change');
    }
  }

  /**
   * تنظيف التخزين المؤقت
   */
  static clearCache(): void {
    this.cache.clear();
  }

  /**
   * التحقق من صحة المفاتيح
   */
  static validateCredentials(): {
    mapbox: boolean;
    copernicus: boolean;
  } {
    return {
      mapbox: !!this.MAPBOX_TOKEN,
      copernicus: !!(this.COPERNICUS_CLIENT_ID && this.COPERNICUS_CLIENT_SECRET)
    };
  }
}