/*
  # Allow public access to property listings

  1. Security Changes
    - Allow public access to read properties table
    - Allow public access to read rooms table
    - Maintain existing policies for authenticated users
    
  2. Notes
    - Public users can only view properties and rooms
    - All other operations still require authentication
*/

-- Allow public read access to properties
CREATE POLICY "Allow public to view properties" 
ON properties 
FOR SELECT 
TO public 
USING (true);

-- Allow public read access to rooms
CREATE POLICY "Allow public to view rooms" 
ON rooms 
FOR SELECT 
TO public 
USING (true);