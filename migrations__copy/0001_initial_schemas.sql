-- Migration: Initial schema for: users, categories, roles, user_roles, user_logs, user_sessions, series, podcasts, youtube_channels, youtube_playlists

CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    name TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS roles (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE,
    description TEXT NOT NULL,
    permissions TEXT DEFAULT '[]' CHECK (json_valid(permissions)),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS user_roles (
    user_id INTEGER NOT NULL,
    role_id INTEGER NOT NULL,
    PRIMARY KEY (user_id, role_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS user_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    activity_type TEXT NOT NULL,
    details TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS user_sessions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    session_token TEXT NOT NULL UNIQUE,
    expires_at DATETIME NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE,
    description TEXT NOT NULL,
    default_source_background_bucket_key TEXT NOT NULL,
    youtube_channel_id INTEGER,
    prompt_template_to_gen_evergreen_titles TEXT NOT NULL,
    prompt_template_to_gen_news_titles TEXT NOT NULL,
    prompt_template_to_gen_series_titles TEXT NOT NULL,
    prompt_template_to_gen_article_content TEXT NOT NULL,
    prompt_template_to_gen_description TEXT NOT NULL,
    prompt_template_to_gen_short_description TEXT NOT NULL,
    prompt_template_to_gen_tag_list TEXT NOT NULL,
    prompt_template_to_gen_audio_podcast TEXT NOT NULL,
    prompt_template_to_gen_video_thumbnail TEXT NOT NULL,
    prompt_template_to_gen_article_image TEXT NOT NULL,
    language_code TEXT CHECK (LENGTH(language_code) = 2) NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (youtube_channel_id) REFERENCES youtube_channels(id)
);

CREATE TABLE IF NOT EXISTS series (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT,
    category_id INTEGER NOT NULL,
    youtube_playlist_id INTEGER,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(id),
    FOREIGN KEY (youtube_playlist_id) REFERENCES youtube_playlists(id)
);

CREATE TABLE IF NOT EXISTS podcasts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT,
    markdown_content TEXT,
    source_audio_bucket_key TEXT,
    source_background_bucket_key TEXT,
    video_bucket_key TEXT,
    thumbnail_bucket_key TEXT,
    category_id INTEGER NOT NULL,
    series_id INTEGER,
    tags TEXT DEFAULT '[]' CHECK (json_valid(tags)),
    first_comment TEXT,
    type TEXT NOT NULL CHECK (type IN ('evergreen', 'news')),
    scheduled_publish_at DATETIME,
    status TEXT NOT NULL CHECK (status IN ('draft', 'pending', 'generating', 'generated', 'uploading', 'uploaded', 'published', 'unpublished')),
    last_status_change_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(id),
    FOREIGN KEY (series_id) REFERENCES series(id)
);

CREATE TABLE IF NOT EXISTS youtube_channels (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    youtube_platform_id TEXT NOT NULL UNIQUE,
    youtube_platform_category_id TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    video_description_template TEXT NOT NULL,
    first_comment_template TEXT NOT NULL,
    language_code TEXT CHECK (LENGTH(language_code) = 2) NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS youtube_playlists (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    youtube_platform_id TEXT NOT NULL UNIQUE,
    title TEXT NOT NULL,
    description TEXT,
    channel_id INTEGER NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (channel_id) REFERENCES youtube_channels(id)
);

CREATE TABLE IF NOT EXISTS external_service_tasks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    external_task_id TEXT NOT NULL,
    type TEXT NOT NULL,
    data TEXT CHECK (json_valid(data)) NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('pending', 'processing', 'completed', 'error')),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_external_service_tasks_external_task_id ON external_service_tasks (external_task_id);

-- Triggers to ensure podcasts in a series belong to the same category as the series

-- On podcast insert: if podcast is in a series, its category must match the series' category
CREATE TRIGGER IF NOT EXISTS podcast_category_match_series_insert
BEFORE INSERT ON podcasts
FOR EACH ROW
WHEN NEW.series_id IS NOT NULL AND NEW.category_id != (SELECT category_id FROM series WHERE id = NEW.series_id)
BEGIN
    SELECT RAISE(ABORT, 'Podcast category_id must match the category_id of the series.');
END;

-- On podcast update: if podcast is in a series, its category must match the series' category
CREATE TRIGGER IF NOT EXISTS podcast_category_match_series_update
BEFORE UPDATE ON podcasts
FOR EACH ROW
WHEN NEW.series_id IS NOT NULL AND NEW.category_id != (SELECT category_id FROM series WHERE id = NEW.series_id)
BEGIN
    SELECT RAISE(ABORT, 'Podcast category_id must match the category_id of the series.');
END;

-- On series category update: prevent if series has any podcasts
CREATE TRIGGER IF NOT EXISTS prevent_series_category_change_if_has_podcasts
BEFORE UPDATE OF category_id ON series
FOR EACH ROW
WHEN OLD.category_id != NEW.category_id AND EXISTS (SELECT 1 FROM podcasts WHERE series_id = NEW.id)
BEGIN
    SELECT RAISE(ABORT, 'Cannot change category of a series with podcasts. Update or move podcasts first.');
END;
