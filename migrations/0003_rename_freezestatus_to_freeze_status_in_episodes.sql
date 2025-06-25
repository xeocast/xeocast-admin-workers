-- Migration to rename the column 'freezeStatus' to 'freeze_status' in the 'episodes' table.

-- Step 0: Drop dependent trigger from 'series' table
DROP TRIGGER IF EXISTS prevent_series_show_change_if_has_episodes;

-- Step 1: Create a new table with the desired schema
CREATE TABLE episodes_new (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    show_id INTEGER NOT NULL,
    series_id INTEGER,
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description TEXT NOT NULL,
    markdown_content TEXT NOT NULL,
    tags TEXT DEFAULT '[]' CHECK (json_valid(tags)),
    type TEXT NOT NULL CHECK (type IN ('evergreen', 'news')),
    first_comment TEXT,
    script TEXT NOT NULL DEFAULT '[]' CHECK (json_valid(script)),
    audio_bucket_key TEXT,
    background_bucket_key TEXT,
    background_music_bucket_key TEXT,
    intro_music_bucket_key TEXT,
    video_bucket_key TEXT,
    thumbnail_bucket_key TEXT,
    article_image_bucket_key TEXT,
    thumbnail_gen_prompt TEXT,
    article_image_gen_prompt TEXT,
    scheduled_publish_at DATETIME,
    status_on_youtube TEXT CHECK (status_on_youtube IN ('none', 'scheduled', 'public', 'private', 'deleted')),
    status_on_website TEXT CHECK (status_on_website IN ('none', 'scheduled', 'public', 'private', 'deleted')),
    status_on_x TEXT CHECK (status_on_x IN ('none', 'scheduled', 'public', 'private', 'deleted')),
    freeze_status BOOLEAN DEFAULT TRUE,
    status TEXT NOT NULL CHECK (status IN (
        'draft', 'researching', 'researched', 'generatingMaterial', 'materialGenerated', 'generatingVideo', 'videoGenerated'
    )),
    last_status_change_at DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
    FOREIGN KEY (show_id) REFERENCES shows(id),
    FOREIGN KEY (series_id) REFERENCES series(id)
);

-- Step 2: Copy data from the old table to the new table, renaming the column
INSERT INTO episodes_new (
    id, show_id, series_id, title, slug, description, markdown_content, tags, type, 
    first_comment, script, audio_bucket_key, background_bucket_key, background_music_bucket_key, 
    intro_music_bucket_key, video_bucket_key, thumbnail_bucket_key, article_image_bucket_key, 
    thumbnail_gen_prompt, article_image_gen_prompt, scheduled_publish_at, status_on_youtube, 
    status_on_website, status_on_x, freeze_status, status, last_status_change_at, 
    created_at, updated_at
)
SELECT 
    id, show_id, series_id, title, slug, description, markdown_content, tags, type, 
    first_comment, script, audio_bucket_key, background_bucket_key, background_music_bucket_key, 
    intro_music_bucket_key, video_bucket_key, thumbnail_bucket_key, article_image_bucket_key, 
    thumbnail_gen_prompt, article_image_gen_prompt, scheduled_publish_at, status_on_youtube, 
    status_on_website, status_on_x, freezeStatus, status, last_status_change_at, 
    created_at, updated_at
FROM episodes;

-- Step 3: Drop the old table
DROP TABLE episodes;

-- Step 4: Rename the new table to the original table name
ALTER TABLE episodes_new RENAME TO episodes;

-- Step 5: Recreate indexes for the episodes table
CREATE INDEX IF NOT EXISTS idx_episodes_status_freeze_sched_created ON episodes (status, freeze_status, scheduled_publish_at, updated_at);
CREATE INDEX IF NOT EXISTS idx_episodes_category_id ON episodes (show_id);

-- Step 6: Recreate triggers for the episodes table
CREATE TRIGGER IF NOT EXISTS episode_show_match_series_insert
BEFORE INSERT ON episodes
FOR EACH ROW
WHEN NEW.series_id IS NOT NULL AND NEW.show_id != (SELECT show_id FROM series WHERE id = NEW.series_id)
BEGIN
    SELECT RAISE(ABORT, 'episode show_id must match the show_id of the series.');
END;

CREATE TRIGGER IF NOT EXISTS episode_show_match_series_update
BEFORE UPDATE ON episodes
FOR EACH ROW
WHEN NEW.series_id IS NOT NULL AND NEW.show_id != (SELECT show_id FROM series WHERE id = NEW.series_id)
BEGIN
    SELECT RAISE(ABORT, 'episode show_id must match the show_id of the series.');
END;

-- Step 7: Recreate dependent trigger on 'series' table
CREATE TRIGGER IF NOT EXISTS prevent_series_show_change_if_has_episodes
BEFORE UPDATE OF show_id ON series
FOR EACH ROW
WHEN OLD.show_id != NEW.show_id AND EXISTS (SELECT 1 FROM episodes WHERE series_id = NEW.id)
BEGIN
    SELECT RAISE(ABORT, 'Cannot change show of a series with episodes. Update or move episodes first.');
END;
