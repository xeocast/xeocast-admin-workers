-- Add slug to categories table
-- Step 1: Add the column, allowing NULLs initially
ALTER TABLE categories ADD COLUMN slug TEXT;
-- Step 2: Populate the slug for existing rows (using the 'temp-slug-category-' prefix you added)
UPDATE categories SET slug = 'temp-slug-category-' || id;
-- Step 3: Create a unique index on the slug column
CREATE UNIQUE INDEX idx_categories_slug ON categories (slug);

-- Add slug to series table
-- Step 1: Add the column, allowing NULLs initially
ALTER TABLE series ADD COLUMN slug TEXT;
-- Step 2: Populate the slug for existing rows
UPDATE series SET slug = 'temp-slug-series-' || id;
-- Step 3: Create a unique index on the slug column
CREATE UNIQUE INDEX idx_series_slug ON series (slug);

-- Add slug to podcasts table
-- Step 1: Add the column, allowing NULLs initially
ALTER TABLE podcasts ADD COLUMN slug TEXT;
-- Step 2: Populate the slug for existing rows
UPDATE podcasts SET slug = 'temp-slug-podcast-' || id;
-- Step 3: Create a unique index on the slug column
CREATE UNIQUE INDEX idx_podcasts_slug ON podcasts (slug);
