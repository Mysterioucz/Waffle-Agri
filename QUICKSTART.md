# 🚀 Quick Start Guide - Waffle Agri Prototype

## Prerequisites

- Node.js 18 or higher
- pnpm (recommended) or npm

## Installation

1. **Install dependencies**

   ```bash
   pnpm install
   # or
   npm install
   ```

2. **Run development server**

   ```bash
   pnpm dev
   # or
   npm run dev
   ```

3. **Open in browser**
   - Navigate to: http://localhost:3000

## What to Explore

### 🏠 Dashboard (/)

- View current weather conditions
- See AI-generated daily tasks
- Check farming tips
- Monitor crop health

### 📖 Logbook (/logbook)

- Log new farming activities
- View activity history
- Track resource usage
- See cost summaries

### 📊 Analytics (/analytics)

- View profit forecasts
- See market predictions
- Analyze cost breakdowns
- Get AI recommendations

### 🏆 Rewards (/rewards)

- Track your level and points
- View earned badges
- Monitor achievement progress
- Redeem rewards

## Mock Data

This prototype uses simulated data to demonstrate functionality:

- Weather data simulates Pangu-Weather API
- AI guidance uses rule-based logic
- Market predictions use algorithmic simulation
- All data resets on page refresh

## Features Implemented

✅ AI-Driven Daily Guidance
✅ Weather Forecasting Integration
✅ Farm Activity Logbook
✅ Profit & Market Forecasting
✅ Gamification System
✅ Multi-tier Subscription Model
✅ Responsive Mobile Design
✅ Real-time Notifications
✅ Resource Planning
✅ Analytics Dashboard

## Production Deployment

For production deployment on Huawei Cloud:

1. Set up environment variables (see PROTOTYPE_GUIDE.md)
2. Configure Huawei Cloud services
3. Deploy to ECS
4. Set up FunctionGraph for scheduled tasks
5. Configure SMN for notifications

## Need Help?

- See PROTOTYPE_GUIDE.md for detailed documentation
- See FEATURES_GUIDE.md for feature walkthroughs
- Check the code comments for implementation details

## Tech Stack

- **Framework**: Next.js 15
- **Language**: TypeScript
- **Styling**: TailwindCSS
- **Cloud**: Huawei Cloud (ECS, RDS, OBS, FunctionGraph, SMN, DLI)
- **AI/ML**: ModelArts, Pangu-Weather API

---

Built for HCD 2025 🌾
