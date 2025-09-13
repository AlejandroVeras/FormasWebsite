# Featured Properties Migration

## Overview
This migration adds featured properties functionality to the FormasWebsite real estate platform.

## Database Changes
The migration script `006_add_featured_properties.sql` adds:
- `featured` boolean column to properties table (default: false)
- `featured_order` integer column for ordering featured properties
- Database indexes for performance
- Updated RLS policies for admin access

## Running the Migration

### Option 1: Supabase Dashboard
1. Go to your Supabase project dashboard
2. Navigate to SQL Editor
3. Copy and paste the contents of `scripts/006_add_featured_properties.sql`
4. Run the script

### Option 2: CLI
```bash
# Using Supabase CLI
supabase db push

# Or using psql directly
psql -h your-supabase-host -U postgres -d postgres < scripts/006_add_featured_properties.sql
```

## Features Enabled After Migration

### Admin Dashboard
- Featured properties management section
- Mark/unmark properties as featured
- Reorder featured properties with drag controls
- Visual indication of featured status

### Public Website
- Dynamic featured properties section on homepage
- Automatic ordering based on `featured_order`
- Fallback to sample properties when none are featured

## Usage Instructions

### Setting Featured Properties
1. Go to Admin Dashboard (`/admin/dashboard`)
2. Scroll to "Propiedades Destacadas" section
3. Use "Destacar" button to mark properties as featured
4. Use arrow buttons to reorder featured properties
5. Changes reflect immediately on the public website

### Frontend Integration
The featured properties are automatically loaded on the homepage:
```typescript
// This query will work after migration
const { data: featuredProperties } = await supabase
  .from("properties")
  .select("*")
  .eq("featured", true)
  .eq("status", "disponible")
  .order("featured_order")
  .limit(3)
```

## Rollback Instructions
If you need to rollback this migration:
```sql
-- Remove the added columns
ALTER TABLE public.properties 
DROP COLUMN IF EXISTS featured,
DROP COLUMN IF EXISTS featured_order;

-- Remove the index
DROP INDEX IF EXISTS idx_properties_featured;

-- Remove the admin policy
DROP POLICY IF EXISTS "properties_admin_select" ON public.properties;
```

## Code Changes Required
After running the migration, update the code to enable featured properties:

1. **Main Page** (`app/inmobiliaria/page.tsx`):
   - Uncomment the featured properties query
   - Comment out the temporary fallback query

2. **Featured Properties Component** (`components/admin/featured-properties-section.tsx`):
   - Uncomment the actual featured properties logic
   - Remove temporary disabled state

## Testing
1. Run the migration
2. Go to `/admin/dashboard`
3. Mark some properties as featured
4. Visit `/inmobiliaria` to see featured properties on homepage
5. Test reordering functionality in admin