
# Internationalization (i18n) Guide

## Overview

Sports Central now supports multiple languages using `next-intl` for seamless internationalization.

## Supported Languages

- 🇬🇧 English (en) - Default
- 🇪🇸 Spanish (es)
- 🇫🇷 French (fr)
- 🇩🇪 German (de)
- 🇵🇹 Portuguese (pt)

## Translation Coverage

Current coverage: **~65%** of core screens

### Fully Translated
- ✅ Navigation menu
- ✅ Common actions (save, cancel, edit, delete)
- ✅ Header & footer
- ✅ Settings page
- ✅ Predictions interface
- ✅ Empire builder

### Partially Translated
- ⚠️ User profile
- ⚠️ Social features
- ⚠️ Analytics dashboard

### Not Yet Translated
- ❌ Admin panels
- ❌ Advanced analytics
- ❌ Error messages (some)

## How to Use Translations in Components

```tsx
'use client';
import { useTranslations } from 'next-intl';

export default function MyComponent() {
  const t = useTranslations('common');
  
  return <button>{t('save')}</button>;
}
```

## Adding New Languages

1. Create new translation file: `src/messages/{locale}.json`
2. Add locale to `src/i18n.ts`:
   ```ts
   export const locales = ['en', 'es', 'fr', 'de'] as const;
   export const localeNames = {
     // ... existing
     de: 'Deutsch'
   };
   ```
3. Add flag emoji to LanguageSwitcher component

## Adding New Translations

1. Add key to all language files in `src/messages/`
2. Use in component: `t('newKey')`

## Language Detection

The app automatically detects user language from:
1. URL prefix (e.g., `/es/predictions`)
2. Browser's Accept-Language header
3. Stored preference in localStorage
4. Falls back to English

## Testing

```bash
# Test English (default)
http://localhost:5000

# Test Spanish
http://localhost:5000/es

# Test French
http://localhost:5000/fr
```

## Roadmap

- [ ] Arabic (RTL support)
- [ ] Portuguese
- [ ] German
- [ ] Italian
- [ ] Chinese
- [ ] Japanese
