# Adham AgriTech - Smart Agriculture Platform 🌾

*Advanced agricultural management system for Egyptian farmers*

[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com/adhamlouxors-projects/v0-new-project-uafhyhnniqx)
[![Built with v0](https://img.shields.io/badge/Built%20with-v0.app-black?style=for-the-badge)](https://v0.app/chat/projects/UaFHyHNnIQx)

## Overview

Adham AgriTech is a comprehensive smart agriculture platform designed specifically for Egyptian farmers. It combines AI-powered insights, real-time weather data, soil analysis, and crop monitoring to help farmers optimize their agricultural practices and increase yields.

## 🚀 Recent Improvements

### Performance Enhancements
- **Optimized Image Loading**: Implemented Next.js image optimization with proper sizing and lazy loading
- **API Response Caching**: Added 10-minute cache for weather data to reduce API calls
- **Database Query Optimization**: Created indexes for frequently accessed data and materialized views for dashboard statistics

### Security & Reliability
- **Rate Limiting**: Implemented comprehensive rate limiting for all API endpoints
- **Error Handling**: Added robust error handling with detailed logging and monitoring
- **API Key Management**: Improved configuration for multiple AI providers (OpenAI/Groq)

### Developer Experience
- **Environment Documentation**: Created detailed `.env.example` with all required variables
- **API Documentation**: Comprehensive API docs with examples and SDK snippets
- **Deployment Guide**: Step-by-step deployment instructions for multiple platforms
- **Database Connection Pooling**: Optimized database connections with retry logic

## 🌟 Features

### Core Functionality
- **🤖 AI Agricultural Assistant**: Multi-language support (Arabic/English) with context-aware advice
- **🌤️ Weather Integration**: Real-time weather data and 7-day forecasts with caching
- **🧪 Soil Analysis**: AI-powered recommendations based on soil test results
- **📊 Crop Monitoring**: Track crop health, growth stages, and satellite imagery
- **💧 Irrigation Management**: Smart scheduling based on weather and soil moisture
- **🏪 Marketplace**: Buy/sell agricultural products and equipment
- **👥 Community Forum**: Connect with other farmers and experts

### Technical Features
- **Real-time Notifications**: Get alerts for weather changes, irrigation schedules
- **Multi-language Support**: Full Arabic and English interface
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Dark Mode**: Modern dark theme optimized for readability
- **Secure Authentication**: Supabase Auth with role-based access control

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Supabase
- **Database**: PostgreSQL (Supabase)
- **AI/ML**: OpenAI GPT-4, Groq Llama 3.3
- **External APIs**: OpenWeatherMap, Google Earth Engine
- **Deployment**: Vercel, Docker support

## 📚 Documentation

- [API Documentation](./docs/API.md) - Complete API reference with examples
- [Deployment Guide](./docs/DEPLOYMENT.md) - Step-by-step deployment instructions
- [Database Schema](./scripts/) - SQL migration scripts

## 🚀 Quick Start

1. **Clone the repository**:
```bash
git clone https://github.com/yourusername/agritech-platform.git
cd agritech-platform
```

2. **Install dependencies**:
```bash
pnpm install
```

3. **Set up environment variables**:
```bash
cp .env.example .env.local
# Edit .env.local with your API keys
```

4. **Run development server**:
```bash
pnpm dev
```

5. **Open browser**:
Navigate to [http://localhost:3000](http://localhost:3000)

## 🔧 Configuration

### Required Environment Variables

```env
# Supabase (Required)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# AI Service (Choose one)
AI_PROVIDER=groq # or 'openai'
GROQ_API_KEY=your_groq_key
OPENAI_API_KEY=your_openai_key # if using OpenAI

# Weather Service (Required)
OPENWEATHER_API_KEY=your_openweather_key
```

See [.env.example](./.env.example) for all available options.

## 📈 Performance Optimizations

- **Caching Strategy**: Weather data cached for 10 minutes, dashboard stats using materialized views
- **Image Optimization**: Automatic format conversion (WebP/AVIF) and responsive sizing
- **Database Indexes**: Optimized queries with proper indexing on all foreign keys and search fields
- **Rate Limiting**: Prevents API abuse with configurable limits per endpoint
- **Connection Pooling**: Efficient database connection management with retry logic

## 🔒 Security Features

- **Row Level Security (RLS)**: Database-level access control
- **API Rate Limiting**: Configurable limits to prevent abuse
- **Input Validation**: Comprehensive validation on all API endpoints
- **Error Handling**: Detailed logging without exposing sensitive information
- **HTTPS Only**: Enforced secure connections in production

## 🤝 Contributing

We welcome contributions! Please see our contributing guidelines for more details.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Built with [v0.app](https://v0.app) for rapid prototyping
- Weather data provided by [OpenWeatherMap](https://openweathermap.org)
- AI capabilities powered by [Groq](https://groq.com) and [OpenAI](https://openai.com)
- Database and authentication by [Supabase](https://supabase.com)

## 📞 Support

- Documentation: [/docs](./docs/)
- Issues: [GitHub Issues](https://github.com/yourusername/agritech-platform/issues)
- Email: support@adham-agritech.com

---

*Built with ❤️ for Egyptian farmers*
