import { z } from "zod"

// Auth Schemas
export const loginSchema = z.object({
  email: z.string().email("البريد الإلكتروني غير صالح"),
  password: z.string().min(8, "كلمة المرور يجب أن تكون 8 أحرف على الأقل"),
})

export const signupSchema = z.object({
  email: z.string().email("البريد الإلكتروني غير صالح"),
  password: z.string()
    .min(8, "كلمة المرور يجب أن تكون 8 أحرف على الأقل")
    .regex(/[A-Z]/, "يجب أن تحتوي على حرف كبير واحد على الأقل")
    .regex(/[a-z]/, "يجب أن تحتوي على حرف صغير واحد على الأقل")
    .regex(/[0-9]/, "يجب أن تحتوي على رقم واحد على الأقل"),
  confirmPassword: z.string(),
  fullName: z.string().min(3, "الاسم يجب أن يكون 3 أحرف على الأقل"),
  phone: z.string().regex(/^(\+20|0)?1[0-2,5]{1}[0-9]{8}$/, "رقم الهاتف غير صالح"),
  role: z.enum(["farmer", "engineer", "manager"]),
}).refine((data) => data.password === data.confirmPassword, {
  message: "كلمات المرور غير متطابقة",
  path: ["confirmPassword"],
})

// Farm Schemas
export const farmSchema = z.object({
  name: z.string().min(3, "اسم المزرعة يجب أن يكون 3 أحرف على الأقل"),
  name_ar: z.string().optional(),
  location: z.string().min(3, "الموقع مطلوب"),
  area: z.number().positive("المساحة يجب أن تكون أكبر من صفر"),
  latitude: z.number().min(-90).max(90, "خط العرض غير صالح"),
  longitude: z.number().min(-180).max(180, "خط الطول غير صالح"),
  description: z.string().optional(),
  description_ar: z.string().optional(),
})

// Field Schemas
export const fieldSchema = z.object({
  farm_id: z.string().uuid("معرف المزرعة غير صالح"),
  name: z.string().min(3, "اسم الحقل يجب أن يكون 3 أحرف على الأقل"),
  name_ar: z.string().optional(),
  area: z.number().positive("المساحة يجب أن تكون أكبر من صفر"),
  crop_type: z.string().optional(),
  crop_type_ar: z.string().optional(),
  planting_date: z.string().optional(),
  expected_harvest_date: z.string().optional(),
  soil_type: z.string().optional(),
  irrigation_type: z.enum(["drip", "sprinkler", "flood", "manual"]).optional(),
  boundaries: z.array(z.tuple([z.number(), z.number()])).optional(),
})

// Soil Analysis Schema
export const soilAnalysisSchema = z.object({
  field_id: z.string().uuid("معرف الحقل غير صالح"),
  analysis_date: z.string(),
  ph_level: z.number().min(0).max(14, "مستوى pH يجب أن يكون بين 0 و 14"),
  nitrogen: z.number().min(0).optional(),
  phosphorus: z.number().min(0).optional(),
  potassium: z.number().min(0).optional(),
  organic_matter: z.number().min(0).max(100).optional(),
  moisture: z.number().min(0).max(100).optional(),
  temperature: z.number().optional(),
  electrical_conductivity: z.number().min(0).optional(),
})

// Crop Monitoring Schema
export const cropMonitoringSchema = z.object({
  field_id: z.string().uuid("معرف الحقل غير صالح"),
  monitoring_date: z.string(),
  health_status: z.enum(["excellent", "good", "fair", "poor", "critical"]),
  ndvi_value: z.number().min(-1).max(1).optional(),
  evi_value: z.number().min(-1).max(1).optional(),
  ndwi_value: z.number().min(-1).max(1).optional(),
  savi_value: z.number().min(-1).max(1).optional(),
  satellite_image_url: z.string().url().optional().or(z.literal("")),
  notes: z.string().optional(),
  notes_ar: z.string().optional(),
})

// Irrigation System Schema
export const irrigationSystemSchema = z.object({
  field_id: z.string().uuid("معرف الحقل غير صالح"),
  system_type: z.enum(["drip", "sprinkler", "flood", "manual"]),
  status: z.enum(["active", "inactive", "maintenance"]).default("active"),
  water_usage: z.number().min(0).optional(),
  schedule: z.string().optional(),
  flow_rate: z.number().min(0).optional(),
  pressure: z.number().min(0).optional(),
})

// AI Assistant Schema
export const aiAssistantSchema = z.object({
  messages: z.array(z.object({
    role: z.enum(["user", "assistant", "system"]),
    content: z.string().min(1, "الرسالة لا يمكن أن تكون فارغة"),
  })),
  language: z.enum(["ar", "en"]).default("ar"),
})

// Weather API Schema
export const weatherQuerySchema = z.object({
  location: z.string().default("Cairo,EG"),
  lang: z.enum(["ar", "en"]).default("en"),
})

// Soil Recommendations Schema
export const soilRecommendationsSchema = z.object({
  ph_level: z.number().min(0).max(14),
  nitrogen_ppm: z.number().min(0),
  phosphorus_ppm: z.number().min(0),
  potassium_ppm: z.number().min(0),
  organic_matter_percent: z.number().min(0).max(100).optional(),
  moisture_percent: z.number().min(0).max(100).optional(),
  language: z.enum(["ar", "en"]).default("ar"),
})

// Marketplace Product Schema
export const productSchema = z.object({
  name: z.string().min(3, "اسم المنتج يجب أن يكون 3 أحرف على الأقل"),
  name_ar: z.string().optional(),
  category: z.enum(["crops", "equipment", "fertilizers", "pesticides", "seeds", "other"]),
  price: z.number().positive("السعر يجب أن يكون أكبر من صفر"),
  quantity: z.number().positive("الكمية يجب أن تكون أكبر من صفر"),
  unit: z.enum(["kg", "ton", "piece", "liter", "bag"]),
  description: z.string().optional(),
  description_ar: z.string().optional(),
  location: z.string().min(3, "الموقع مطلوب"),
  contact_info: z.string().min(5, "معلومات الاتصال مطلوبة"),
  images: z.array(z.string().url()).optional(),
})

// Forum Post Schema
export const forumPostSchema = z.object({
  title: z.string().min(5, "العنوان يجب أن يكون 5 أحرف على الأقل"),
  title_ar: z.string().optional(),
  category: z.enum(["general", "crops", "soil", "irrigation", "pests", "equipment", "other"]),
  content: z.string().min(20, "المحتوى يجب أن يكون 20 حرف على الأقل"),
  content_ar: z.string().optional(),
})

// Report Schema
export const reportSchema = z.object({
  type: z.enum(["farm", "field", "crop", "financial", "comprehensive"]),
  entity_id: z.string().uuid().optional(),
  date_from: z.string(),
  date_to: z.string(),
  format: z.enum(["pdf", "excel", "json"]).default("pdf"),
})

// Satellite Image Request Schema
export const satelliteImageSchema = z.object({
  minLng: z.number().min(-180).max(180),
  minLat: z.number().min(-90).max(90),
  maxLng: z.number().min(-180).max(180),
  maxLat: z.number().min(-90).max(90),
  type: z.enum(["NDVI", "TRUE_COLOR"]).default("NDVI"),
  width: z.number().min(100).max(2048).default(512),
  height: z.number().min(100).max(2048).default(512),
  service: z.enum(["auto", "sentinel", "nasa"]).default("auto"),
})

// Helper function to validate data
export function validateData<T>(schema: z.ZodSchema<T>, data: unknown): {
  success: boolean
  data?: T
  errors?: z.ZodError
} {
  try {
    const validatedData = schema.parse(data)
    return { success: true, data: validatedData }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, errors: error }
    }
    throw error
  }
}

// Helper to format validation errors in Arabic
export function formatValidationErrors(errors: z.ZodError): string[] {
  return errors.errors.map(err => {
    const field = err.path.join(".")
    return `${field}: ${err.message}`
  })
}