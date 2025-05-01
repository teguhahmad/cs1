/*
  # Add marketplace fields to properties table

  1. Changes
    - Add photos array column to store property images
    - Add rules array column to store property rules
    - Add amenities array column to store property amenities
    - Add description text column for detailed property description
    - Add marketplace_enabled boolean to control listing visibility
    - Add marketplace_price numeric for listing base price
    - Add marketplace_status for listing status (draft/published)

  2. Notes
    - Photos will be stored as array of URLs
    - Rules and amenities will be stored as array of strings
    - Description supports markdown formatting
*/

-- Add new columns to properties table
ALTER TABLE properties
ADD COLUMN IF NOT EXISTS photos text[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS rules text[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS amenities text[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS description text,
ADD COLUMN IF NOT EXISTS marketplace_enabled boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS marketplace_price numeric DEFAULT 0,
ADD COLUMN IF NOT EXISTS marketplace_status text DEFAULT 'draft'
CHECK (marketplace_status IN ('draft', 'published'));

-- Add comment to explain the columns
COMMENT ON COLUMN properties.photos IS 'Array of photo URLs for the property';
COMMENT ON COLUMN properties.rules IS 'Array of house rules';
COMMENT ON COLUMN properties.amenities IS 'Array of available amenities';
COMMENT ON COLUMN properties.description IS 'Detailed property description';
COMMENT ON COLUMN properties.marketplace_enabled IS 'Whether property is listed in marketplace';
COMMENT ON COLUMN properties.marketplace_price IS 'Base price for marketplace listing';
COMMENT ON COLUMN properties.marketplace_status IS 'Status of marketplace listing';