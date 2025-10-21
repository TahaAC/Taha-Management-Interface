# How to Replace the Logo

The management interface currently uses an SVG logo with "TA Center" text. To use your own logo:

## Option 1: Replace the SVG Logo (Recommended)

Replace the file: `public/logo.svg`

The SVG logo should be:
- Square dimensions (recommended 200x200 or larger)
- Use colors that match your brand (currently #4F46E5 to #7C3AED gradient)

## Option 2: Use a PNG Logo

1. Create or obtain your logo in PNG format
2. Create the following sizes:
   - `logo.png` - 200x200px (for header display)
   - `icon-192.png` - 192x192px (for PWA)
   - `icon-512.png` - 512x512px (for PWA)
   - `apple-touch-icon.png` - 180x180px (for iOS)

3. Place them in the `public/` folder

4. Update `index.html`:
   ```html
   <link rel="icon" type="image/png" href="/logo.png" />
   <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
   ```

5. Update `public/manifest.json`:
   ```json
   "icons": [
     {
       "src": "/icon-192.png",
       "sizes": "192x192",
       "type": "image/png"
     },
     {
       "src": "/icon-512.png",
       "sizes": "512x512",
       "type": "image/png"
     }
   ]
   ```

6. Update `vite.config.js`:
   ```javascript
   includeAssets: ['logo.png', 'icon-192.png', 'icon-512.png', 'apple-touch-icon.png'],
   ```

## Logo Color Scheme

If you want to match the UI colors to your logo:

1. Open `src/index.css`
2. Update the CSS variables:
   ```css
   :root {
     --primary-color: #YourColor1;
     --secondary-color: #YourColor2;
     --accent-color: #YourColor3;
   }
   ```

3. Update `index.html` theme color:
   ```html
   <meta name="theme-color" content="#YourPrimaryColor" />
   ```

4. Update `public/manifest.json`:
   ```json
   "theme_color": "#YourPrimaryColor",
   "background_color": "#YourPrimaryColor"
   ```

## Current Colors

- Primary: `#4F46E5` (Indigo)
- Secondary: `#7C3AED` (Purple)
- Accent: `#8B5CF6` (Violet)

These create a professional purple gradient theme throughout the interface.
