-- Migration: 0013_update_categories_podcasts_tables.sql
-- Apply changes to categories and podcasts tables

-- Schema updates for 'categories' table
ALTER TABLE categories RENAME COLUMN prompt_template_to_gen_description TO prompt_template_to_gen_article_metadata;
ALTER TABLE categories RENAME COLUMN prompt_template_to_gen_short_description TO prompt_template_to_gen_podcast_script;
ALTER TABLE categories ADD COLUMN first_comment_template TEXT NOT NULL DEFAULT '';
ALTER TABLE categories ADD COLUMN show_title TEXT NOT NULL DEFAULT '';
ALTER TABLE categories ADD COLUMN custom_url TEXT NOT NULL DEFAULT '';
ALTER TABLE categories RENAME COLUMN prompt_template_to_gen_tag_list TO prompt_template_to_gen_video_bg;
ALTER TABLE categories RENAME COLUMN prompt_template_to_gen_video_thumbnail TO prompt_template_to_gen_bg_music;
ALTER TABLE categories RENAME COLUMN prompt_template_to_gen_article_image TO prompt_template_to_gen_intro_music;
ALTER TABLE categories ADD COLUMN default_source_background_music_bucket_key TEXT NOT NULL DEFAULT '';
ALTER TABLE categories ADD COLUMN default_source_intro_music_bucket_key TEXT NOT NULL DEFAULT '';

-- Schema updates for 'podcasts' table - Add new columns first
ALTER TABLE podcasts ADD COLUMN script TEXT NOT NULL DEFAULT '[]' CHECK (json_valid(script));
ALTER TABLE podcasts ADD COLUMN source_background_music_bucket_key TEXT;
ALTER TABLE podcasts ADD COLUMN source_intro_music_bucket_key TEXT;
ALTER TABLE podcasts ADD COLUMN thumbnail_gen_prompt TEXT;
ALTER TABLE podcasts ADD COLUMN article_image_gen_prompt TEXT;
ALTER TABLE podcasts ADD COLUMN status_on_youtube TEXT CHECK (status_on_youtube IN ('none', 'scheduled', 'public', 'private', 'deleted'));
ALTER TABLE podcasts ADD COLUMN status_on_website TEXT CHECK (status_on_website IN ('none', 'scheduled', 'public', 'private', 'deleted'));
ALTER TABLE podcasts ADD COLUMN status_on_x TEXT CHECK (status_on_x IN ('none', 'scheduled', 'public', 'private', 'deleted'));
ALTER TABLE podcasts ADD COLUMN freezeStatus BOOLEAN DEFAULT TRUE;

-- Status values will be transformed during the data copy to podcasts_new.
-- The original CHECK constraint on 'podcasts' prevents direct UPDATEs to new status values.

-- Recreate 'podcasts' table to modify the 'status' CHECK constraint
-- SQLite does not support altering CHECK constraints directly.

CREATE TABLE podcasts_new (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT,
    markdown_content TEXT,
    source_audio_bucket_key TEXT,
    source_background_bucket_key TEXT, -- Existing column for general background
    video_bucket_key TEXT,
    thumbnail_bucket_key TEXT,
    category_id INTEGER NOT NULL,
    series_id INTEGER,
    tags TEXT DEFAULT '[]' CHECK (json_valid(tags)),
    first_comment TEXT,
    type TEXT NOT NULL CHECK (type IN ('evergreen', 'news')),
    scheduled_publish_at DATETIME,
    status TEXT NOT NULL CHECK (status IN (
        'draft', 'draftApproved', 'researching', 'researched',
        'generatingThumbnail', 'thumbnailGenerated', 'generatingAudio', 'audioGenerated',
        'generatedApproved', 'published', 'unpublished', 
        'generatingSources', 'sourcesGenerated', 'generatingVideo', 'videoGenerated'
    )),
    last_status_change_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    -- New columns added above via ALTER TABLE are included here
    script TEXT CHECK (json_valid(script)),
    source_background_music_bucket_key TEXT, -- New column for background music
    source_intro_music_bucket_key TEXT,
    thumbnail_gen_prompt TEXT,
    article_image_gen_prompt TEXT,
    status_on_youtube TEXT CHECK (status_on_youtube IN ('none', 'scheduled', 'public', 'private', 'deleted')),
    status_on_website TEXT CHECK (status_on_website IN ('none', 'scheduled', 'public', 'private', 'deleted')),
    status_on_x TEXT CHECK (status_on_x IN ('none', 'scheduled', 'public', 'private', 'deleted')),
    freezeStatus BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (category_id) REFERENCES categories(id),
    FOREIGN KEY (series_id) REFERENCES series(id)
);

-- Copy data from the old 'podcasts' table to 'podcasts_new'
-- All columns, including those added by ALTER TABLE, are selected.
INSERT INTO podcasts_new (
    id, title, description, markdown_content, source_audio_bucket_key, 
    source_background_bucket_key, -- existing general background key
    video_bucket_key, thumbnail_bucket_key, category_id, series_id, tags, 
    first_comment, type, scheduled_publish_at, status, last_status_change_at, 
    created_at, updated_at,
    -- new columns
    script, source_background_music_bucket_key, source_intro_music_bucket_key, 
    thumbnail_gen_prompt, article_image_gen_prompt, 
    status_on_youtube, status_on_website, status_on_x, freezeStatus
)
SELECT 
    id, title, description, markdown_content, source_audio_bucket_key, 
    source_background_bucket_key, -- existing general background key
    video_bucket_key, thumbnail_bucket_key, category_id, series_id, tags, 
    first_comment, type, scheduled_publish_at, 
    CASE status
        WHEN 'generated' THEN 'videoGenerated'
        WHEN 'uploaded' THEN 'videoGenerated' -- As per original attempted update logic
        WHEN 'generating' THEN 'generatingVideo'
        WHEN 'uploading' THEN 'videoGenerated' -- As per original attempted update logic
        ELSE status
    END AS status, -- Apply transformation here
    last_status_change_at, 
    created_at, updated_at,
    -- new columns
    script, source_background_music_bucket_key, source_intro_music_bucket_key, 
    thumbnail_gen_prompt, article_image_gen_prompt, 
    status_on_youtube, status_on_website, status_on_x, freezeStatus
FROM podcasts;

-- Drop the old 'podcasts' table
-- Drop trigger that references podcasts table before dropping the table
DROP TRIGGER IF EXISTS prevent_series_category_change_if_has_podcasts;

DROP TABLE podcasts;

-- Rename 'podcasts_new' to 'podcasts'
ALTER TABLE podcasts_new RENAME TO podcasts;

-- Recreate triggers associated with the 'podcasts' table
CREATE TRIGGER IF NOT EXISTS podcast_category_match_series_insert
BEFORE INSERT ON podcasts
FOR EACH ROW
WHEN NEW.series_id IS NOT NULL AND NEW.category_id != (SELECT category_id FROM series WHERE id = NEW.series_id)
BEGIN
    SELECT RAISE(ABORT, 'Podcast category_id must match the category_id of the series.');
END;

CREATE TRIGGER IF NOT EXISTS podcast_category_match_series_update
BEFORE UPDATE ON podcasts
FOR EACH ROW
WHEN NEW.series_id IS NOT NULL AND NEW.category_id != (SELECT category_id FROM series WHERE id = NEW.series_id)
BEGIN
    SELECT RAISE(ABORT, 'Podcast category_id must match the category_id of the series.');
END;

-- Recreate trigger for series table that references podcasts table
CREATE TRIGGER IF NOT EXISTS prevent_series_category_change_if_has_podcasts
BEFORE UPDATE OF category_id ON series
FOR EACH ROW
WHEN OLD.category_id != NEW.category_id AND EXISTS (SELECT 1 FROM podcasts WHERE series_id = NEW.id)
BEGIN
    SELECT RAISE(ABORT, 'Cannot change category of a series with podcasts. Update or move podcasts first.');
END;
