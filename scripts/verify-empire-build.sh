
#!/bin/bash

set -e

echo "🏗️ Empire Architecture Build Verification"
echo "=========================================="
echo ""

# Color codes
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

print_status() {
    if [ $2 -eq 0 ]; then
        echo -e "${GREEN}✅ $1${NC}"
    else
        echo -e "${RED}❌ $1${NC}"
        exit 1
    fi
}

echo "🔍 Step 1: Verify Empire components exist"
REQUIRED_COMPONENTS=(
    "apps/frontend/src/app/components/GoogleStyleNav.tsx"
    "apps/frontend/src/app/components/layout/AppDrawer.tsx"
    "apps/frontend/src/app/components/carousels/LiveCarousel.tsx"
    "apps/frontend/src/app/components/carousels/NewsCarousel.tsx"
    "apps/frontend/src/app/components/cards/FeatureCard.tsx"
    "apps/frontend/src/app/components/cards/CarouselCard.tsx"
    "apps/frontend/src/lib/constant/features.ts"
    "apps/frontend/src/lib/constant/apps.ts"
    "apps/frontend/src/lib/constant/mockData.ts"
)

for component in "${REQUIRED_COMPONENTS[@]}"; do
    if [ -f "$component" ]; then
        echo "  ✓ Found: $(basename $component)"
    else
        echo -e "${RED}  ✗ Missing: $component${NC}"
        exit 1
    fi
done
print_status "All components found" 0

echo ""
echo "🔍 Step 2: Check for route conflicts"
DOCS_ROUTES=$(find apps/frontend/src/app/[locale] -name "page.tsx" -path "*/docs/*" 2>/dev/null | wc -l)
if [ "$DOCS_ROUTES" -gt 1 ]; then
    echo -e "${RED}Found multiple docs routes - this will cause conflicts${NC}"
    find apps/frontend/src/app/[locale] -name "page.tsx" -path "*/docs/*"
    exit 1
fi
print_status "No route conflicts detected" 0

echo ""
echo "🔍 Step 3: Verify CSS syntax"
if grep -q "export default function" apps/frontend/src/app/globals.css 2>/dev/null; then
    echo -e "${RED}Found TypeScript code in CSS file${NC}"
    exit 1
fi
print_status "CSS syntax is clean" 0

echo ""
echo "🔍 Step 4: Clear cache and build shared package"
rm -rf apps/frontend/.next
npm run build --workspace=packages/shared
print_status "Shared package built" $?

echo ""
echo "🔍 Step 5: Build frontend"
cd apps/frontend
npm run build
BUILD_STATUS=$?
cd ../..

if [ $BUILD_STATUS -eq 0 ]; then
    print_status "Frontend build successful" 0
    echo ""
    echo "📊 Build Summary:"
    ls -lh apps/frontend/.next | head -10
    echo ""
    echo -e "${GREEN}✅ Empire Architecture verified and ready for deployment!${NC}"
else
    print_status "Frontend build failed" 1
fi
