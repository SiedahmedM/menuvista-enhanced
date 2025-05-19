# MenuVista Implementation Plan

Steps to implement the fixes from the copy project to the original MenuVista project:
## 1. Fix Package Dependencies

Update your `package.json` file:

```json
{
  "dependencies": {
    "next": "15.3.2",
    "react": "^18.2.0",
    "react-dom": "^18.2.0"
  },
  "devDependencies": {
    "@eslint/eslintrc": "^3",
    "autoprefixer": "^10.4.21",
    "eslint": "^8.45.0",
    "eslint-config-next": "15.3.2",
    "postcss": "^8.4.27",
    "postcss-import": "^15.1.0",
    "tailwindcss": "^3.3.3"
  }
}
```

Key changes:
- Downgrade React from v19 to v18.2.0
- Remove `@tailwindcss/postcss`
- Add proper Tailwind dependencies

## 2. Update Scripts in package.json

Remove the turbopack flag from the dev script:

```json
"scripts": {
  "dev": "next dev",
  "build": "next build",
  "start": "next start",
  "lint": "next lint"
}
```

## 3. Fix CSS Issues

Update `src/app/globals.css`:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --background: #ffffff;
  --foreground: #171717;
}

/* Custom variables */
:root {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --font-sans: var(--font-geist-sans);
  --font-mono: var(--font-geist-mono);
}

/* @media (prefers-color-scheme: dark) {
  :root {
    --background: #0a0a0a;
    --foreground: #ededed;
  }
} */

body {
  background: var(--background);
  color: var(--foreground);
  font-family: Arial, Helvetica, sans-serif;
  background-color: #fdfcf9;
}
```

Key changes:
- Replace `@import "tailwindcss"` with proper Tailwind directives
- Replace `@theme inline` with proper CSS variables

## 4. Create Tailwind Configuration Files

### Create tailwind.config.js:

```js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-geist-sans)'],
        mono: ['var(--font-geist-mono)'],
        display: ['var(--font-playfair-display)'],
      },
    },
  },
  plugins: [],
}
```

### Create postcss.config.js:

```js
module.exports = {
  plugins: {
    'postcss-import': {},
    tailwindcss: {},
    autoprefixer: {},
  },
}
```

## 5. Fix Directory Structure

Make sure you don't have a duplicate `app` directory at the root level:

```bash
# Check if duplicate app directory exists
ls -la /path/to/original/menuvista/app

# If it exists and contains files, check if they need to be merged with src/app
ls -la /path/to/original/menuvista/app/api/menu-optimization/heat-map-data/route.js

# Remove the duplicate app directory after ensuring content is preserved
rm -rf /path/to/original/menuvista/app
```

## 6. Clean and Reinstall Dependencies

```bash
# Clean up existing build artifacts and dependencies
cd /path/to/original/menuvista
rm -rf .next
rm -rf node_modules

# Install dependencies fresh
npm install

# Start the development server
npm run dev
```

## 7. Verify Project Structure

Ensure your project structure follows the Next.js App Router convention:
- All pages should be in `/src/app/`
- API routes should be in `/src/app/api/`

## 8. Test the Application

After implementing all changes, make sure to test:
1. Homepage loads correctly
2. Navigation between pages works
3. API endpoints return expected responses
4. CSS styling is applied correctly
5. Menu optimization features function properly