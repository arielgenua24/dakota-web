# Product URLs Implementation for Google Merchant Center

## Problem
Previously, when users clicked "Ver producto", a modal would open without changing the URL. This meant:
- Each product didn't have a unique URL
- Google Merchant Center couldn't reference individual products
- Products weren't shareable via direct links

## Solution
Implemented dynamic product pages with unique URLs for each product.

## Changes Made

### 1. Created Dynamic Product Page Route
**File:** `/app/producto/[id]/page.tsx`
- New dynamic route that accepts product IDs
- Fetches product data from Firestore based on the ID
- Displays the product in the existing ProductModal component
- Each product now has a unique URL: `/producto/{product-id}`

**Example URLs:**
- `https://yourdomain.com/producto/abc123`
- `https://yourdomain.com/producto/xyz789`

### 2. Updated Product Grid Navigation
**File:** `/components/product-grid.tsx`
- Changed "Ver producto" button to navigate to `/producto/{id}` instead of opening a modal
- Changed "Modificar" button to also navigate to the product page
- Removed unused modal state and functions
- Product grid now uses Next.js router for navigation

### 3. Fixed Firebase Initialization Error
**File:** `/lib/firebase-client.ts`
- Added check to prevent Firebase from being initialized multiple times
- Fixes "duplicate-app" error during development and production
- Uses `getApps()` to check if Firebase is already initialized

## Benefits for Google Merchant Center

Now you can use these product URLs in your Google Merchant Center feed:

```xml
<item>
  <g:id>abc123</g:id>
  <g:title>Product Name</g:title>
  <g:link>https://yourdomain.com/producto/abc123</g:link>
  <g:image_link>https://yourdomain.com/images/product.jpg</g:image_link>
  ...
</item>
```

## How It Works

1. **User clicks "Ver producto"** → Navigates to `/producto/{product-id}`
2. **Product page loads** → Fetches product data from Firestore using the ID
3. **Modal displays** → Shows product in the same modal interface
4. **User closes modal** → Navigates back to previous page

## URL Structure

- **Product Grid/Store:** `/Store` or `/` (home)
- **Individual Product:** `/producto/{product-id}`
- **Example:** `/producto/abc123def456`

## Testing

To test the implementation:
1. Navigate to your store page
2. Click "Ver producto" on any product
3. Note the URL changes to `/producto/{id}`
4. Share this URL - it should open directly to the product
5. Use these URLs in your Google Merchant Center feed

## Next Steps for Google Merchant Center

1. Get the list of product IDs from your Firestore database
2. Create a product feed (XML or CSV) with the URLs
3. Upload to Google Merchant Center
4. Each product will link to: `https://yourdomain.com/producto/{product-id}`
