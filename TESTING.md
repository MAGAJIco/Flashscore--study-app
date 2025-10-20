# Testing Guide

Comprehensive testing setup for the MagajiCo monorepo with unit tests, E2E tests, and CI/CD integration.

## 🧪 Testing Stack

- **Unit Tests**: Vitest + React Testing Library
- **E2E Tests**: Playwright
- **CI/CD**: GitHub Actions

## 📦 What's Installed

### Backend Testing
- ✅ Vitest for unit testing
- ✅ Happy-dom for DOM environment
- ✅ Sample test file: `apps/backend/src/main.test.ts`

### Frontend Testing
- ✅ Vitest for unit testing
- ✅ React Testing Library for component testing
- ✅ Happy-dom for DOM environment
- ✅ Sample test file: `apps/frontend/src/components/__tests__/PredictiveAlertSystem.test.tsx`

### E2E Testing
- ✅ Playwright configured
- ✅ Test suite: `tests/e2e/home.spec.ts`
- ✅ Tests home page, navigation, and alert system

## 🚀 Running Tests

### Unit Tests

```bash
# Run all tests (backend + frontend)
pnpm test

# Run backend tests only
cd apps/backend && pnpm test

# Run frontend tests only
cd apps/frontend && pnpm test

# Watch mode (auto-rerun on changes)
cd apps/backend && pnpm test:watch
cd apps/frontend && pnpm test:watch

# Interactive UI
cd apps/backend && pnpm test:ui
cd apps/frontend && pnpm test:ui

# Coverage reports
cd apps/backend && pnpm test:coverage
cd apps/frontend && pnpm test:coverage
```

### E2E Tests (requires Playwright browser installation)

```bash
# Run E2E tests
pnpm test:e2e

# Run with UI mode
pnpm test:e2e:ui

# Debug mode
pnpm test:e2e:debug

# Run all tests (unit + E2E)
pnpm test:all
```

**Note**: Playwright browsers need to be installed first:
```bash
pnpm exec playwright install chromium
```

## 📁 Test File Structure

```
apps/
├── backend/
│   ├── vitest.config.ts          # Vitest configuration
│   └── src/
│       └── main.test.ts          # Sample backend test
├── frontend/
│   ├── vitest.config.ts          # Vitest configuration
│   ├── vitest.setup.ts           # Test setup file
│   └── src/
│       └── components/
│           └── __tests__/
│               └── PredictiveAlertSystem.test.tsx
tests/
└── e2e/
    └── home.spec.ts              # E2E tests
playwright.config.ts              # Playwright configuration
```

## ✍️ Writing Tests

### Backend Unit Test Example

```typescript
// apps/backend/src/services/__tests__/example.test.ts
import { describe, it, expect } from 'vitest';

describe('Example Service', () => {
  it('should do something', () => {
    expect(1 + 1).toBe(2);
  });
});
```

### Frontend Component Test Example

```typescript
// apps/frontend/src/components/__tests__/MyComponent.test.tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import MyComponent from '../../app/components/MyComponent';

describe('MyComponent', () => {
  it('renders correctly', () => {
    render(<MyComponent />);
    expect(screen.getByText('Hello')).toBeInTheDocument();
  });
});
```

### E2E Test Example

```typescript
// tests/e2e/example.spec.ts
import { test, expect } from '@playwright/test';

test('navigates to page', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('text=Welcome')).toBeVisible();
});
```

## 🔄 CI/CD Integration

GitHub Actions workflow is configured at `.github/workflows/ci.yml`:

- ✅ **Unit Tests**: Runs on every push/PR
- ✅ **E2E Tests**: Runs with Playwright
- ✅ **Type Checking**: Validates TypeScript
- ✅ **Coverage Reports**: Uploaded as artifacts

The CI runs automatically on:
- Push to `main` or `develop` branches
- Pull requests to `main` or `develop`

## 📊 Current Test Results

### ✅ All Tests Passing

**Backend**: 2/2 tests passing
- ✓ Backend Server > should have basic arithmetic working
- ✓ Backend Server > should validate environment setup

**Frontend**: 2/2 tests passing  
- ✓ PredictiveAlertSystem > renders alert button after mounting
- ✓ PredictiveAlertSystem > displays notification badge with correct count

## 🎯 Test Coverage Areas

### Recommended Testing Focus

1. **Authentication** (when implemented)
   - User login/logout
   - Session management
   - Protected routes

2. **API Endpoints**
   - Request/response validation
   - Error handling
   - Rate limiting

3. **UI Components**
   - User interactions
   - State management
   - Error boundaries

4. **Business Logic**
   - Predictions calculations
   - Scoring algorithms
   - Data transformations

## 🔧 Configuration Files

### Vitest Config (Backend)
```typescript
// apps/backend/vitest.config.ts
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'happy-dom',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html']
    }
  }
});
```

### Vitest Config (Frontend)
```typescript
// apps/frontend/vitest.config.ts
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'happy-dom',
    setupFiles: ['./vitest.setup.ts']
  }
});
```

## 📝 Best Practices

1. **Write tests alongside features** - Don't wait until the end
2. **Test user behavior, not implementation** - Focus on what users do
3. **Keep tests isolated** - Each test should be independent
4. **Use descriptive test names** - Make failures easy to understand
5. **Mock external dependencies** - Keep tests fast and reliable
6. **Aim for meaningful coverage** - Not just high percentages

## 🆘 Troubleshooting

### Tests not running?
```bash
# Clear cache and reinstall
rm -rf node_modules .next coverage
pnpm install
```

### Import errors?
Check that paths in `vitest.config.ts` match your project structure.

### Playwright issues?
Ensure browsers are installed:
```bash
pnpm exec playwright install
```

## 📚 Resources

- [Vitest Documentation](https://vitest.dev/)
- [React Testing Library](https://testing-library.com/react)
- [Playwright Documentation](https://playwright.dev/)
- [Testing Best Practices](https://testingjavascript.com/)
