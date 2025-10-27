
# Recycled Frontend Routes

This directory contains frontend routes that have been moved from the main application for archival purposes.

## Moved Routes

### Feature Routes (Moved to Route Groups)
- `portal/` - Moved to `(portal)` route group
- `predictions/` - Moved to `(predictions)` route group
- `live/` - Moved to `(live)` route group
- `social/feed/` - Moved to `(social)/feed` route group
- `rewards/achievements/` - Moved to `(rewards)/achievements` route group

### Test/Experimental Routes
- `simple/` - Simplified test layout (archived)
- `test-features/` - Feature testing page (archived)
- `test-kids-mode/` - Kids mode testing (archived)
- `test-news-author/` - News author testing (archived)
- `micro-interactions/` - Micro-interactions demo (archived)
- `unified/` - Early unified dashboard concept (archived)

### Documentation Routes
- `docs-embedded/` - Embedded documentation page that was previously in locale/page.tsx (moved 2025-01-XX)
  - Contains full interactive docs with Google-style navigation
  - Feature apps showcase
  - Architecture documentation
  - API reference
  - Migration guide

## Why These Were Moved

1. **Route Groups Migration**: Routes moved to feature-based route groups for better organization
2. **Testing Routes**: Experimental routes no longer needed in production
3. **Embedded Docs**: Docs content was embedded in main page.tsx, now extracted to dedicated component for cleaner separation

## Recovery

If you need to restore any of these routes:
1. Copy the route folder to `apps/frontend/src/app/[locale]/`
2. Update any imports and navigation references
3. Test thoroughly before deploying

Last Updated: January 2025
