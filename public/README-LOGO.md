# Logo Placement Instructions

## Required File
Place your logo file as: `public/logo.png`

## Logo Specifications
- **Format**: PNG (preferred) or SVG
- **Size**: The logo will be displayed at:
  - Header: 24x24px (h-6 w-6)
  - Footer: 20x20px (h-5 w-5)  
  - API Docs: 32x32px (h-8 w-8)
- **Background**: Should work well on gradient background (blue to purple)
- **Style**: White/light colored logo recommended for visibility

## Current Usage
The logo is used in:
- `/src/components/Header.tsx` - Navigation header
- `/src/components/Footer.tsx` - Footer brand section
- `/src/app/api/docs/page.tsx` - API documentation header

## CSS Classes Applied
- `object-contain` - Maintains aspect ratio
- `h-6 w-6` (header), `h-5 w-5` (footer), `h-8 w-8` (docs) - Size constraints

The logo will automatically scale and maintain its aspect ratio within the gradient containers. 