

# Recycled Frontend Routes

This directory contains frontend routes that have been moved from the main application for archival purposes.

## Moved Routes

### Deprecated Routes (Replaced by Empire)
- `portal/` - Replaced by `/empire` (2025-01-XX)
- `(portal)/` - Legacy route group, now redirects to Empire

### Feature Routes (Moved to Route Groups)
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
- `docs-route-group/` - Full (docs) route group with dedicated layout (moved 2025-01-XX)
  - Standalone documentation route that was at /docs
  - Now consolidated into InteractiveDocsComponent used in main page.tsx

## Documentation Consolidation (January 2025)

All documentation features have been consolidated into:
- **Component**: `apps/frontend/src/app/components/InteractiveDocsComponent.tsx`
- **Usage**: Main portal page (`apps/frontend/src/app/[locale]/page.tsx`) now uses this component
- **Archived HTML docs**: `recyclebin/UnifiedSportsHub_docs.html` and `recyclebin/DIYF_docs.html`

## Recovery

If you need to restore any of these routes:
1. Copy the route folder to `apps/frontend/src/app/[locale]/`
2. Update any imports and navigation references
3. Test thoroughly before deploying

Last Updated: January 2025
