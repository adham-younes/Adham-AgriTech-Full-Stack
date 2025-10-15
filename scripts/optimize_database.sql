-- Database Optimization Script for Adham AgriTech Platform
-- This script adds indexes and optimizations for better query performance

-- Indexes for profiles table
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_created_at ON profiles(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);

-- Indexes for farms table
CREATE INDEX IF NOT EXISTS idx_farms_owner_id ON farms(owner_id);
CREATE INDEX IF NOT EXISTS idx_farms_created_at ON farms(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_farms_location ON farms USING GIST(location);

-- Indexes for fields table
CREATE INDEX IF NOT EXISTS idx_fields_farm_id ON fields(farm_id);
CREATE INDEX IF NOT EXISTS idx_fields_crop_type ON fields(crop_type);
CREATE INDEX IF NOT EXISTS idx_fields_planting_date ON fields(planting_date);
CREATE INDEX IF NOT EXISTS idx_fields_harvest_date ON fields(expected_harvest_date);
CREATE INDEX IF NOT EXISTS idx_fields_status ON fields(status);

-- Indexes for soil_analysis table
CREATE INDEX IF NOT EXISTS idx_soil_analysis_field_id ON soil_analysis(field_id);
CREATE INDEX IF NOT EXISTS idx_soil_analysis_date ON soil_analysis(analysis_date DESC);
CREATE INDEX IF NOT EXISTS idx_soil_analysis_ph ON soil_analysis(ph_level);

-- Indexes for crop_monitoring table
CREATE INDEX IF NOT EXISTS idx_crop_monitoring_field_id ON crop_monitoring(field_id);
CREATE INDEX IF NOT EXISTS idx_crop_monitoring_date ON crop_monitoring(monitoring_date DESC);
CREATE INDEX IF NOT EXISTS idx_crop_monitoring_health ON crop_monitoring(health_status);

-- Indexes for weather_data table
CREATE INDEX IF NOT EXISTS idx_weather_field_id ON weather_data(field_id);
CREATE INDEX IF NOT EXISTS idx_weather_date ON weather_data(recorded_at DESC);
CREATE INDEX IF NOT EXISTS idx_weather_temp ON weather_data(temperature);

-- Indexes for irrigation_schedules table
CREATE INDEX IF NOT EXISTS idx_irrigation_field_id ON irrigation_schedules(field_id);
CREATE INDEX IF NOT EXISTS idx_irrigation_date ON irrigation_schedules(scheduled_date);
CREATE INDEX IF NOT EXISTS idx_irrigation_status ON irrigation_schedules(status);

-- Indexes for notifications table
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON notifications(is_read);
CREATE INDEX IF NOT EXISTS idx_notifications_created ON notifications(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_notifications_user_unread ON notifications(user_id, is_read) WHERE is_read = false;

-- Indexes for ai_chat_sessions table
CREATE INDEX IF NOT EXISTS idx_ai_chat_user_id ON ai_chat_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_chat_created ON ai_chat_sessions(created_at DESC);

-- Indexes for marketplace_listings table
CREATE INDEX IF NOT EXISTS idx_marketplace_seller ON marketplace_listings(seller_id);
CREATE INDEX IF NOT EXISTS idx_marketplace_category ON marketplace_listings(category);
CREATE INDEX IF NOT EXISTS idx_marketplace_status ON marketplace_listings(status);
CREATE INDEX IF NOT EXISTS idx_marketplace_price ON marketplace_listings(price);
CREATE INDEX IF NOT EXISTS idx_marketplace_created ON marketplace_listings(created_at DESC);

-- Indexes for forum_posts table
CREATE INDEX IF NOT EXISTS idx_forum_author ON forum_posts(author_id);
CREATE INDEX IF NOT EXISTS idx_forum_category ON forum_posts(category);
CREATE INDEX IF NOT EXISTS idx_forum_created ON forum_posts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_forum_search ON forum_posts USING GIN(to_tsvector('arabic', title || ' ' || content));

-- Indexes for forum_comments table
CREATE INDEX IF NOT EXISTS idx_forum_comments_post ON forum_comments(post_id);
CREATE INDEX IF NOT EXISTS idx_forum_comments_author ON forum_comments(author_id);
CREATE INDEX IF NOT EXISTS idx_forum_comments_created ON forum_comments(created_at DESC);

-- Create materialized view for dashboard statistics
CREATE MATERIALIZED VIEW IF NOT EXISTS dashboard_stats AS
SELECT 
    p.id as user_id,
    p.role,
    COUNT(DISTINCT f.id) as total_farms,
    COUNT(DISTINCT fi.id) as total_fields,
    SUM(fi.area_hectares) as total_area,
    COUNT(DISTINCT cm.id) as monitoring_records,
    COUNT(DISTINCT sa.id) as soil_analyses,
    AVG(cm.health_score) as avg_health_score
FROM profiles p
LEFT JOIN farms f ON p.id = f.owner_id
LEFT JOIN fields fi ON f.id = fi.farm_id
LEFT JOIN crop_monitoring cm ON fi.id = cm.field_id
LEFT JOIN soil_analysis sa ON fi.id = sa.field_id
GROUP BY p.id, p.role;

-- Create index on materialized view
CREATE UNIQUE INDEX IF NOT EXISTS idx_dashboard_stats_user ON dashboard_stats(user_id);

-- Refresh materialized view function
CREATE OR REPLACE FUNCTION refresh_dashboard_stats()
RETURNS void AS $$
BEGIN
    REFRESH MATERIALIZED VIEW CONCURRENTLY dashboard_stats;
END;
$$ LANGUAGE plpgsql;

-- Create a scheduled job to refresh the materialized view (requires pg_cron extension)
-- SELECT cron.schedule('refresh-dashboard-stats', '0 */6 * * *', 'SELECT refresh_dashboard_stats();');

-- Optimize table statistics
ANALYZE profiles;
ANALYZE farms;
ANALYZE fields;
ANALYZE soil_analysis;
ANALYZE crop_monitoring;
ANALYZE weather_data;
ANALYZE irrigation_schedules;
ANALYZE notifications;
ANALYZE ai_chat_sessions;
ANALYZE marketplace_listings;
ANALYZE forum_posts;
ANALYZE forum_comments;

-- Add comments for documentation
COMMENT ON INDEX idx_profiles_role IS 'Index for filtering users by role';
COMMENT ON INDEX idx_farms_location IS 'Spatial index for location-based queries';
COMMENT ON INDEX idx_notifications_user_unread IS 'Partial index for unread notifications';
COMMENT ON INDEX idx_forum_search IS 'Full-text search index for forum posts';
COMMENT ON MATERIALIZED VIEW dashboard_stats IS 'Pre-aggregated statistics for dashboard performance';