## Overview
Sports Central is a premium monorepo sports prediction and community platform built with Next.js. It features AI-powered predictions, live scores, interactive experiences, and community rewards. The platform aims to provide a comprehensive multi-sport experience inspired by FlashScore, incorporating real-time data, personalized content, and engaging user interfaces. Key capabilities include multi-sport browsing, live scorecards with AI insights, an authentication system with age verification, and a Kids Mode for educational sports content.

## Recent Changes (October 24, 2025)
- **News CRUD & Advanced Filtering**: Implemented comprehensive CRUD operations for news management
  - Updated News model: Added fields (id, tags, imageUrl, viewCount, isActive, fullContent) with database indexes
  - Full CRUD endpoints: CREATE, READ (all/single), UPDATE, DELETE (soft delete)
  - Advanced filtering: Pagination, filter by tags/author, full-text search, date range, sorting
  - Utility endpoints: /tags/all, /authors/all, /latest
  - Member access control with view counting
  - All operations tested and verified working
- **Vercel Deployment Fixes**: Resolved module resolution issues for production deployment
  - Removed duplicate Next.js, React, and ReactDOM dependencies from root package.json
  - Updated vercel.json build commands for proper monorepo dependency installation
  - Fixed shared package build order in deployment pipeline
  - Fixed missing component imports (MatchList, PersonalAnalyticsPage exports)
  - Build configuration now properly handles workspace dependencies
