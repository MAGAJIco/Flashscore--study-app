# Legacy Frontend Routes - Moved to Recyclebin

**Date Moved:** October 27, 2025
**Reason:** These routes have been superseded by the new feature-based route group architecture

## Routes Moved

### Duplicate Routes (superseded by route groups)
- `predictions/` - Replaced by `(predictions)/` route group
- `live/` - Replaced by `(live)/` route group  
- `social/` - Replaced by `(social)/` route group
- `rewards/` - Replaced by `(rewards)/` route group

### Test Pages (development only)
- `test-features/` - Feature testing page
- `test-kids-mode/` - Kids mode testing page
- `test-news-author/` - News author testing page

### Demo/Sample Pages
- `unified/` - Unified demo page
- `simple/` - Simple template/demo
- `portal/` - Portal demo (superseded by root page)
- `micro-interactions/` - Micro-interactions demo

## New Route Structure

The new feature-based architecture uses route groups:
- `(predictions)/` - AI Predictions & ML Features
- `(live)/` - Live Sports Tracking
- `(social)/` - Social & Community
- `(rewards)/` - Rewards & Achievements
- `(kids)/` - Kids Mode
- `(docs)/` - Documentation

## Benefits of New Structure
✅ Better code organization with clear feature boundaries
✅ Improved performance through route-based code splitting
✅ Easier maintenance and navigation
✅ Team scalability with feature ownership

## Restoration
If you need to restore any of these routes, they can be found in this directory.
However, it's recommended to use the new route group architecture instead.
