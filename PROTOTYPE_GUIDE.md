# 🌾 Waffle Agri - AI-Driven Farm Management System

## Overview

Waffle Agri is an intelligent farm management platform that leverages AI and cloud technologies to help farmers optimize their agricultural operations through:

- **AI-Driven Daily Guidance** - Personalized task recommendations based on weather, crop conditions, and farm data
- **Weather Forecasting** - Integration with Huawei Pangu-Weather API for accurate predictions
- **Profit Forecasting** - AI-powered cost-yield analysis and market predictions
- **Farm Logbook** - Digital activity tracking with resource planning
- **Gamification** - Points, streaks, badges, and rewards to encourage consistent farm management
- **Analytics Dashboard** - Visual insights into farm performance and market trends

## Tech Stack

- **Frontend**: Next.js 15, React, TypeScript, TailwindCSS
- **AI/ML**: Huawei ModelArts for predictions and recommendations
- **Weather Data**: Pangu-Weather API
- **Backend**: Next.js API Routes
- **Cloud Infrastructure** (Production):
  - Huawei ECS (Elastic Cloud Server)
  - RDS (Relational Database Service)
  - OBS (Object Storage Service)
  - FunctionGraph (Serverless)
  - SMN (Simple Message Notification)
  - DLI (Data Lake Insight)

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── weather/route.ts          # Pangu-Weather integration
│   │   ├── ai/guidance/route.ts      # AI daily guidance generation
│   │   └── analytics/
│   │       ├── profit-forecast/route.ts
│   │       └── market-prediction/route.ts
│   ├── analytics/page.tsx            # Analytics dashboard route
│   ├── logbook/page.tsx              # Farm logbook route
│   ├── rewards/page.tsx              # Gamification route
│   └── page.tsx                      # Main dashboard
├── components/
│   ├── ui/                           # Reusable UI components
│   ├── dashboard/                    # Dashboard components
│   ├── logbook/                      # Logbook components
│   ├── analytics/                    # Analytics components
│   └── gamification/                 # Gamification components
├── lib/
│   ├── constants.ts                  # App constants and configs
│   └── utils.ts                      # Utility functions
└── types/
    └── index.ts                      # TypeScript type definitions
```

## Features Implementation

### 1. User & Farm Management (FR1.1, FR1.3)

- User profiles with subscription tiers (Free, Starter, Pro, Enterprise)
- Multiple farm management
- Role-based feature access

### 2. Farm Logbook & Resource Planning (FR2.1, FR2.2, FR2.3)

- Digital activity logging (watering, fertilizing, harvesting, etc.)
- Automatic resource requirement calculation
- Cost-yield and profit forecasting

### 3. AI-Driven Daily Guidance (FR3.1-3.4)

- Personalized daily task recommendations
- Real-time weather alerts via SMN
- Integration with Pangu-Weather API
- Automated daily updates via FunctionGraph

### 4. Gamification & Rewards (FR4.1-4.3)

- Points system for completed tasks
- Streak tracking and bonuses
- Badges and achievements
- Reward redemption (subscription upgrades, discounts)

### 5. Data Collection & Analytics (FR6.1, FR6.3, FR6.4)

- Activity and resource tracking
- Performance reports
- Visual analytics dashboards
- Big data processing ready (DLI/MRS)

### 6. Notifications & Communication (FR7.1)

- Push notifications via SMN
- Weather warnings
- Crop milestones
- Subscription reminders

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm (or npm/yarn)

### Installation

1. Clone the repository:

```bash
git clone https://github.com/Mysterioucz/Waffle-Agri.git
cd hcd-2025
```

2. Install dependencies:

```bash
pnpm install
```

3. Create a `.env.local` file:

```env
# Huawei Cloud API Configuration
PANGU_WEATHER_API_URL=your_pangu_weather_url
MODEL_ARTS_API_URL=your_modelarts_url
FUNCTION_GRAPH_API_URL=your_functiongraph_url
SMN_API_URL=your_smn_url
OBS_API_URL=your_obs_url
RDS_API_URL=your_rds_url
DLI_API_URL=your_dli_url
HUAWEI_API_KEY=your_api_key
```

4. Run the development server:

```bash
pnpm dev
```

5. Open [http://localhost:3000](http://localhost:3000)

## Available Routes

- `/` - Main Dashboard (Weather, AI Guidance, Tasks, Crops)
- `/logbook` - Farm Activity Logbook
- `/analytics` - Profit Forecast & Market Predictions
- `/rewards` - Gamification & Rewards Store

## API Endpoints

### Weather

- `GET /api/weather?lat={lat}&lon={lon}` - Get weather forecast

### AI Guidance

- `POST /api/ai/guidance` - Generate daily AI recommendations

### Analytics

- `POST /api/analytics/profit-forecast` - Get profit forecast
- `GET /api/analytics/market-prediction?crop={crop}` - Get market predictions

## Non-Functional Requirements

### Performance (NFR1.1-1.3)

- Supports 10,000 concurrent users (via ECS auto-scaling)
- AI guidance generation < 5 minutes
- Daily data refresh

### Availability (NFR2.1-2.3)

- 99.5% uptime target
- Automatic daily backups to OBS
- Fault-tolerant architecture

### Security (NFR3.1-3.2)

- TLS 1.3 encryption
- AES-256 data encryption
- Role-based access control

### Usability (NFR4.1-4.2)

- Mobile-first responsive design
- Multi-language support (Thai, English, Chinese)
- Task completion within 3 clicks
- Offline logbook sync capability

### Maintainability (NFR5.1-5.3)

- Modular architecture
- CI/CD with Huawei DevCloud
- Serverless cost optimization

## Subscription Tiers

| Feature            | Free | Starter | Pro | Enterprise |
| ------------------ | ---- | ------- | --- | ---------- |
| Max Farms          | 1    | 3       | 10  | Unlimited  |
| AI Guidance        | ❌   | ✅      | ✅  | ✅         |
| Weather Alerts     | ✅   | ✅      | ✅  | ✅         |
| Profit Forecasting | ❌   | ✅      | ✅  | ✅         |
| Market Predictions | ❌   | ❌      | ✅  | ✅         |
| Advanced Analytics | ❌   | ❌      | ✅  | ✅         |
| Priority Support   | ❌   | ❌      | ✅  | ✅         |
| Offline Mode       | ❌   | ✅      | ✅  | ✅         |

## Gamification System

### Points Earning

- Daily Login: 10 points
- Task Completed: 20 points
- Activity Logged: 15 points
- Crop Harvested: 100 points
- Streak Bonuses: 50-500 points

### Badges

- 🌱 First Steps (Common)
- 🔥 Dedicated Farmer (Rare)
- 👍 Green Thumb (Epic)
- 🌤️ Weather Wise (Rare)
- 💰 Profit Master (Legendary)
- ♻️ Eco Warrior (Epic)

## Deployment (Production)

### Huawei Cloud Infrastructure

1. **ECS Deployment**

   - Deploy Next.js app on Huawei ECS
   - Configure auto-scaling groups
   - Set up load balancing

2. **Database Setup**

   - Configure RDS for structured data
   - Set up OBS for file storage
   - Implement daily backups

3. **Serverless Functions**

   - Deploy FunctionGraph for daily AI guidance generation
   - Configure time triggers (6 AM daily)
   - Set up SMN for notifications

4. **Data Analytics**
   - Configure DLI for data lake processing
   - Set up MRS for large-scale analytics
   - Implement data pipeline

## Future Enhancements

- [ ] Mobile app (iOS/Android)
- [ ] Community marketplace
- [ ] Expert consultation booking
- [ ] IoT sensor integration
- [ ] Satellite imagery analysis
- [ ] Multi-farm collaboration
- [ ] Supply chain integration

## Contributing

This is a competition project for HCD 2025. For contributions or questions, please contact the development team.

## License

Copyright © 2025 Waffle Agri Team

## Contact

- Repository: https://github.com/Mysterioucz/Waffle-Agri
- Email: support@waffleagri.com

---

Built with ❤️ using Huawei Cloud Technologies
