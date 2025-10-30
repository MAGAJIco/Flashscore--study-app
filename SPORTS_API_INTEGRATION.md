# Sports API Integration - Complete Setup Guide

## 🎯 Overview
Successfully connected the Python ML Sports API (`sport-api.py`) with the TypeScript backend and created a beautiful filtered predictions display page with live matches integration.

## 📁 Files Created/Modified

### 1. Backend Integration (`apps/api/src/modules/predictions/routes.ts`)
**Added Routes:**
- `/api/predictions/matches` - Get all live matches
- `/api/predictions/sports/filtered` - Get filtered predictions with confidence levels
- `/api/predictions/nfl` - ESPN NFL matches
- `/api/predictions/nba` - ESPN NBA matches  
- `/api/predictions/mlb` - ESPN MLB matches

**Features:**
- Connects to Python ML service on port 8000
- Filters by sport and minimum confidence
- Error handling and logging
- RESTful API design

### 2. Frontend Predictions Page (`apps/web/src/app/[locale]/predictions/filtered/page.tsx`)
**Features:**
- 🎯 **Dual View Modes:**
  - Predictions view with AI-powered recommendations
  - Live matches view with real-time scores
  
- 🎨 **Interactive Filters:**
  - Sport selection (All, Soccer, NFL, NBA, MLB)
  - Confidence slider (50-95%)
  - Auto-refresh capability
  
- 📊 **Beautiful UI:**
  - Color-coded confidence levels (green/blue/yellow)
  - Responsive grid layout
  - Sport-specific icons
  - Gradient backgrounds
  - Hover effects and animations

- ⚡ **Real-time Data:**
  - Fetches from backend API
  - Shows match status and scores
  - Displays confidence percentages
  - Live match times

### 3. Main Page Integration (`apps/web/src/app/[locale]/page.tsx`)
**Added:**
- Prominent prediction button in hero section
- Gradient purple button design
- Hover animations
- Direct link to `/en/predictions/filtered`

## 🔌 Python ML Sports API Features

The Python service (`apps/api/ml/sport-api.py`) provides:

### Data Sources:
1. **Free APIs (No key required):**
   - ESPN NFL, NBA, MLB scoreboards
   
2. **Premium APIs (Require keys):**
   - RapidAPI (NFL, NBA, MLB)
   - The Odds API (betting odds)
   - Football-Data.org (Soccer/Premier League)

3. **Web Scraping:**
   - MyBetsToday predictions (soccer)
   - StatArea predictions  
   - FlashScore live scores

### Available Endpoints:
- `GET /api/matches` - All live matches across sports
- `GET /api/espn/nfl` - NFL matches (free)
- `GET /api/espn/nba` - NBA matches (free)
- `GET /api/espn/mlb` - MLB matches (free)
- `GET /api/predictions/soccer?min_confidence=86` - Soccer predictions
- `GET /api/predictions/statarea?min_odds=1.5` - StatArea predictions
- `GET /api/odds/{sport}?bookmaker=draftkings` - Betting odds

## 🚀 How to Use

### 1. Start the Services

**Python ML Service** (if not running):
```bash
cd apps/api/ml
uvicorn api:app --host 0.0.0.0 --port 8000
```

**TypeScript Backend** (already running):
- Port: 3001
- Auto-configured in workflow

**Next.js Frontend** (already running):
- Port: 5000
- Auto-configured in workflow

### 2. Access the Predictions Page

**From the main page:**
1. Visit `http://localhost:5000/en`
2. Click the purple "🎯 View AI Predictions & Live Matches" button
3. OR directly visit: `http://localhost:5000/en/predictions/filtered`

### 3. Use the Filters

**Predictions View:**
- Select sport from dropdown (All/Soccer/NFL/NBA/MLB)
- Adjust confidence slider (50-95%)
- Click "Refresh" to update

**Live Matches View:**
- Toggle to "Live Matches" tab
- Select sport
- See real-time scores and status

## 📊 Data Flow

```
User Request
    ↓
Next.js Frontend (/en/predictions/filtered)
    ↓
TypeScript API (:3001/api/predictions/...)
    ↓
Python ML Service (:8000/api/...)
    ↓
External APIs (ESPN, RapidAPI, etc.)
    ↓
Data returned to frontend
    ↓
Beautiful display with filters
```

## 🎨 UI Features

### Confidence Color Coding:
- **Green (≥85%)**: Very safe predictions
- **Blue (75-84%)**: Safe predictions  
- **Yellow (<75%)**: Moderate confidence

### Sport Icons:
- 🏈 NFL
- 🏀 NBA
- ⚾ MLB
- ⚽ Soccer
- 🎯 All Sports

## 🔧 Environment Variables

Optional API keys for premium features (set in `.env`):

```bash
# Python ML Service
RAPIDAPI_KEY=your_rapidapi_key
ODDS_API_KEY=your_odds_api_key
FOOTBALL_DATA_API_KEY=your_football_data_key

# TypeScript Backend
PYTHON_ML_URL=http://localhost:8000
```

## ✅ What's Working

1. ✅ Backend routes connected to Python ML service
2. ✅ Frontend predictions page with dual views
3. ✅ Sport and confidence filtering
4. ✅ Live matches display
5. ✅ Main page button integration
6. ✅ Color-coded confidence levels
7. ✅ Responsive design
8. ✅ Error handling
9. ✅ Loading states
10. ✅ Auto-refresh functionality

## 🚀 Next Steps (Optional Enhancements)

1. **Add More Filters:**
   - Date range selection
   - Specific leagues
   - Bookmaker preferences

2. **Real-time Updates:**
   - WebSocket integration
   - Auto-refresh every 30 seconds
   - Live score ticker

3. **User Features:**
   - Save favorite predictions
   - Bet slip builder
   - Results tracking

4. **Analytics:**
   - Prediction accuracy tracking
   - Win/loss statistics
   - ROI calculator

## 📝 API Documentation

Full API documentation available at:
- Python ML Service: `http://localhost:8000/docs`
- TypeScript Backend: Check routes in `apps/api/src/modules/predictions/routes.ts`

## 🎉 Summary

You now have a fully functional AI-powered sports predictions platform that:
- Fetches live data from multiple sources
- Displays filtered predictions with confidence levels
- Shows live match scores
- Has a beautiful, responsive UI
- Is easily accessible from the main page

Just click the purple button on the homepage to start exploring predictions!
