-- ============================================
-- Adham AgriTech - Complete Database Setup
-- تنفيذ جميع جداول قاعدة البيانات دفعة واحدة
-- ============================================
-- Date: 7 October 2025
-- Execute this in Supabase SQL Editor
-- ============================================

-- Step 0: Create helper functions
-- ============================================

-- Function to handle updated_at automatically
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- Step 1: User Profiles
-- ============================================

CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  phone TEXT,
  role TEXT NOT NULL CHECK (role IN ('farmer', 'engineer', 'manager')) DEFAULT 'farmer',
  avatar_url TEXT,
  language TEXT DEFAULT 'ar' CHECK (language IN ('ar', 'en')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- Trigger for auto-creating profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'role', 'farmer')
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- ============================================
-- Step 2: Farms
-- ============================================

CREATE TABLE IF NOT EXISTS public.farms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  name_ar TEXT,
  location TEXT NOT NULL,
  area NUMERIC NOT NULL,
  latitude NUMERIC NOT NULL,
  longitude NUMERIC NOT NULL,
  description TEXT,
  description_ar TEXT,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.farms ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own farms"
  ON public.farms FOR SELECT
  USING (auth.uid() = owner_id);

CREATE POLICY "Users can insert their own farms"
  ON public.farms FOR INSERT
  WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Users can update their own farms"
  ON public.farms FOR UPDATE
  USING (auth.uid() = owner_id);

CREATE POLICY "Users can delete their own farms"
  ON public.farms FOR DELETE
  USING (auth.uid() = owner_id);

CREATE POLICY "Managers and engineers can view all farms"
  ON public.farms FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('manager', 'engineer')
    )
  );

DROP TRIGGER IF EXISTS handle_farms_updated_at ON public.farms;
CREATE TRIGGER handle_farms_updated_at
  BEFORE UPDATE ON public.farms
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- ============================================
-- Step 3: Fields
-- ============================================

CREATE TABLE IF NOT EXISTS public.fields (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  farm_id UUID NOT NULL REFERENCES public.farms(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  name_ar TEXT,
  area NUMERIC NOT NULL,
  crop_type TEXT,
  crop_type_ar TEXT,
  planting_date DATE,
  expected_harvest_date DATE,
  soil_type TEXT,
  irrigation_type TEXT CHECK (irrigation_type IN ('drip', 'sprinkler', 'flood', 'manual')),
  boundaries JSONB,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'fallow')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.fields ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view fields of their farms"
  ON public.fields FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.farms
      WHERE farms.id = fields.farm_id
      AND farms.owner_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert fields to their farms"
  ON public.fields FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.farms
      WHERE farms.id = farm_id
      AND farms.owner_id = auth.uid()
    )
  );

CREATE POLICY "Users can update fields of their farms"
  ON public.fields FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.farms
      WHERE farms.id = fields.farm_id
      AND farms.owner_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete fields of their farms"
  ON public.fields FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.farms
      WHERE farms.id = fields.farm_id
      AND farms.owner_id = auth.uid()
    )
  );

CREATE POLICY "Managers and engineers can view all fields"
  ON public.fields FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('manager', 'engineer')
    )
  );

DROP TRIGGER IF EXISTS handle_fields_updated_at ON public.fields;
CREATE TRIGGER handle_fields_updated_at
  BEFORE UPDATE ON public.fields
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- ============================================
-- Step 4: Soil Analysis
-- ============================================

CREATE TABLE IF NOT EXISTS public.soil_analysis (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  field_id UUID NOT NULL REFERENCES public.fields(id) ON DELETE CASCADE,
  analysis_date DATE NOT NULL DEFAULT CURRENT_DATE,
  ph_level NUMERIC,
  nitrogen NUMERIC,
  phosphorus NUMERIC,
  potassium NUMERIC,
  organic_matter NUMERIC,
  moisture NUMERIC,
  temperature NUMERIC,
  electrical_conductivity NUMERIC,
  ai_recommendations TEXT,
  ai_recommendations_ar TEXT,
  fertilizer_recommendations JSONB,
  irrigation_recommendations TEXT,
  irrigation_recommendations_ar TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.soil_analysis ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view soil analysis of their fields"
  ON public.soil_analysis FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.fields
      JOIN public.farms ON farms.id = fields.farm_id
      WHERE fields.id = soil_analysis.field_id
      AND farms.owner_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert soil analysis for their fields"
  ON public.soil_analysis FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.fields
      JOIN public.farms ON farms.id = fields.farm_id
      WHERE fields.id = field_id
      AND farms.owner_id = auth.uid()
    )
  );

CREATE POLICY "Managers and engineers can view all soil analysis"
  ON public.soil_analysis FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('manager', 'engineer')
    )
  );

DROP TRIGGER IF EXISTS handle_soil_analysis_updated_at ON public.soil_analysis;
CREATE TRIGGER handle_soil_analysis_updated_at
  BEFORE UPDATE ON public.soil_analysis
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- ============================================
-- Step 5: Crop Monitoring
-- ============================================

CREATE TABLE IF NOT EXISTS public.crop_monitoring (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  field_id UUID NOT NULL REFERENCES public.fields(id) ON DELETE CASCADE,
  monitoring_date DATE NOT NULL DEFAULT CURRENT_DATE,
  health_status TEXT CHECK (health_status IN ('excellent', 'good', 'fair', 'poor', 'critical')),
  ndvi_value NUMERIC,
  evi_value NUMERIC,
  ndwi_value NUMERIC,
  temperature_celsius NUMERIC,
  satellite_image_url TEXT,
  notes TEXT,
  notes_ar TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.crop_monitoring ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view crop monitoring of their fields"
  ON public.crop_monitoring FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.fields
      JOIN public.farms ON farms.id = fields.farm_id
      WHERE fields.id = crop_monitoring.field_id
      AND farms.owner_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert crop monitoring for their fields"
  ON public.crop_monitoring FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.fields
      JOIN public.farms ON farms.id = fields.farm_id
      WHERE fields.id = field_id
      AND farms.owner_id = auth.uid()
    )
  );

CREATE POLICY "Managers and engineers can view all crop monitoring"
  ON public.crop_monitoring FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('manager', 'engineer')
    )
  );

DROP TRIGGER IF EXISTS handle_crop_monitoring_updated_at ON public.crop_monitoring;
CREATE TRIGGER handle_crop_monitoring_updated_at
  BEFORE UPDATE ON public.crop_monitoring
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- ============================================
-- Step 6: Weather Data
-- ============================================

CREATE TABLE IF NOT EXISTS public.weather_data (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  farm_id UUID REFERENCES public.farms(id) ON DELETE CASCADE,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  temperature_min NUMERIC,
  temperature_max NUMERIC,
  temperature_avg NUMERIC,
  humidity NUMERIC,
  precipitation NUMERIC,
  wind_speed NUMERIC,
  wind_direction TEXT,
  weather_condition TEXT,
  weather_condition_ar TEXT,
  forecast_data JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.weather_data ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view weather data of their farms"
  ON public.weather_data FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.farms
      WHERE farms.id = weather_data.farm_id
      AND farms.owner_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert weather data for their farms"
  ON public.weather_data FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.farms
      WHERE farms.id = farm_id
      AND farms.owner_id = auth.uid()
    )
  );

-- ============================================
-- Step 7: Irrigation Systems
-- ============================================

CREATE TABLE IF NOT EXISTS public.irrigation_systems (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  field_id UUID NOT NULL REFERENCES public.fields(id) ON DELETE CASCADE,
  system_type TEXT NOT NULL CHECK (system_type IN ('drip', 'sprinkler', 'flood', 'manual')),
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'maintenance')),
  water_source TEXT,
  flow_rate NUMERIC,
  schedule JSONB,
  last_maintenance_date DATE,
  next_maintenance_date DATE,
  notes TEXT,
  notes_ar TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.irrigation_systems ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view irrigation systems of their fields"
  ON public.irrigation_systems FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.fields
      JOIN public.farms ON farms.id = fields.farm_id
      WHERE fields.id = irrigation_systems.field_id
      AND farms.owner_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert irrigation systems for their fields"
  ON public.irrigation_systems FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.fields
      JOIN public.farms ON farms.id = fields.farm_id
      WHERE fields.id = field_id
      AND farms.owner_id = auth.uid()
    )
  );

CREATE POLICY "Users can update irrigation systems of their fields"
  ON public.irrigation_systems FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.fields
      JOIN public.farms ON farms.id = fields.farm_id
      WHERE fields.id = irrigation_systems.field_id
      AND farms.owner_id = auth.uid()
    )
  );

DROP TRIGGER IF EXISTS handle_irrigation_systems_updated_at ON public.irrigation_systems;
CREATE TRIGGER handle_irrigation_systems_updated_at
  BEFORE UPDATE ON public.irrigation_systems
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- ============================================
-- Step 8: Notifications
-- ============================================

CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('alert', 'warning', 'info', 'success')),
  title TEXT NOT NULL,
  title_ar TEXT,
  message TEXT NOT NULL,
  message_ar TEXT,
  is_read BOOLEAN DEFAULT FALSE,
  link TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own notifications"
  ON public.notifications FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own notifications"
  ON public.notifications FOR UPDATE
  USING (auth.uid() = user_id);

-- ============================================
-- Step 9: AI Chat History
-- ============================================

CREATE TABLE IF NOT EXISTS public.ai_chat (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  response TEXT NOT NULL,
  language TEXT DEFAULT 'ar' CHECK (language IN ('ar', 'en')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.ai_chat ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own chat history"
  ON public.ai_chat FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own chat messages"
  ON public.ai_chat FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- ============================================
-- Step 10: Reports
-- ============================================

CREATE TABLE IF NOT EXISTS public.reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  report_type TEXT NOT NULL CHECK (report_type IN ('farm', 'field', 'crop', 'soil', 'irrigation', 'custom')),
  title TEXT NOT NULL,
  title_ar TEXT,
  content JSONB,
  file_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own reports"
  ON public.reports FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own reports"
  ON public.reports FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- ============================================
-- Step 11: Marketplace
-- ============================================

CREATE TABLE IF NOT EXISTS public.marketplace (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  seller_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  category TEXT NOT NULL CHECK (category IN ('seeds', 'fertilizers', 'equipment', 'services', 'produce')),
  title TEXT NOT NULL,
  title_ar TEXT,
  description TEXT,
  description_ar TEXT,
  price NUMERIC NOT NULL,
  currency TEXT DEFAULT 'EGP',
  quantity NUMERIC,
  unit TEXT,
  images JSONB,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'sold', 'inactive')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.marketplace ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active marketplace items"
  ON public.marketplace FOR SELECT
  USING (status = 'active');

CREATE POLICY "Users can insert their own marketplace items"
  ON public.marketplace FOR INSERT
  WITH CHECK (auth.uid() = seller_id);

CREATE POLICY "Users can update their own marketplace items"
  ON public.marketplace FOR UPDATE
  USING (auth.uid() = seller_id);

DROP TRIGGER IF EXISTS handle_marketplace_updated_at ON public.marketplace;
CREATE TRIGGER handle_marketplace_updated_at
  BEFORE UPDATE ON public.marketplace
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- ============================================
-- Step 12: Community Forum
-- ============================================

CREATE TABLE IF NOT EXISTS public.community_forum (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  author_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  title_ar TEXT,
  content TEXT NOT NULL,
  content_ar TEXT,
  category TEXT CHECK (category IN ('general', 'questions', 'tips', 'problems', 'success_stories')),
  replies_count INTEGER DEFAULT 0,
  likes_count INTEGER DEFAULT 0,
  views_count INTEGER DEFAULT 0,
  is_pinned BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.community_forum ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view forum posts"
  ON public.community_forum FOR SELECT
  USING (TRUE);

CREATE POLICY "Users can insert their own forum posts"
  ON public.community_forum FOR INSERT
  WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Users can update their own forum posts"
  ON public.community_forum FOR UPDATE
  USING (auth.uid() = author_id);

DROP TRIGGER IF EXISTS handle_community_forum_updated_at ON public.community_forum;
CREATE TRIGGER handle_community_forum_updated_at
  BEFORE UPDATE ON public.community_forum
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- ============================================
-- ✅ All Done! Database Setup Complete
-- ============================================

-- Verify tables created
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_type = 'BASE TABLE'
ORDER BY table_name;

-- Verify RLS enabled
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public'
ORDER BY tablename;
