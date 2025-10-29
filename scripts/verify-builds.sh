
#!/bin/bash

echo "🔍 Build Verification Script"
echo "=============================="
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

print_status() {
    if [ $2 -eq 0 ]; then
        echo -e "${GREEN}✓${NC} $1"
    else
        echo -e "${RED}✗${NC} $1"
    fi
}

# Step 1: Install dependencies
echo "📦 Installing dependencies..."
npm install
INSTALL_STATUS=$?
print_status "Dependencies installed" $INSTALL_STATUS

# Step 2: Build shared package
echo ""
echo "🔨 Building shared package..."
npm run build --workspace=packages/shared
SHARED_STATUS=$?
print_status "Shared package built" $SHARED_STATUS

# Step 3: Build API
echo ""
echo "🔨 Building API..."
npm run build --workspace=apps/api
API_STATUS=$?
print_status "API built" $API_STATUS

# Step 4: Build Web
echo ""
echo "🔨 Building Web..."
npm run build --workspace=apps/web
WEB_STATUS=$?
print_status "Web built" $WEB_STATUS

# Summary
echo ""
echo "=============================="
if [ $SHARED_STATUS -eq 0 ] && [ $API_STATUS -eq 0 ] && [ $WEB_STATUS -eq 0 ]; then
    echo -e "${GREEN}✅ All builds successful!${NC}"
    exit 0
else
    echo -e "${RED}❌ Some builds failed${NC}"
    exit 1
fi
