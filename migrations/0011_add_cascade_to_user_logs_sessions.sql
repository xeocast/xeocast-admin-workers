-- Migration: Add ON DELETE CASCADE to user_logs and user_sessions tables

-- Disable foreign key checks for this transaction (SQLite specific)
PRAGMA foreign_keys=OFF;

BEGIN TRANSACTION;

-- For user_logs table
CREATE TABLE IF NOT EXISTS new_user_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    activity_type TEXT NOT NULL,
    details TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE -- Added ON DELETE CASCADE
);

INSERT INTO new_user_logs (id, user_id, activity_type, details, created_at)
SELECT id, user_id, activity_type, details, created_at FROM user_logs;

DROP TABLE IF EXISTS user_logs;

ALTER TABLE new_user_logs RENAME TO user_logs;

-- For user_sessions table
CREATE TABLE IF NOT EXISTS new_user_sessions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    session_token TEXT NOT NULL UNIQUE,
    expires_at DATETIME NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE -- Added ON DELETE CASCADE
);

INSERT INTO new_user_sessions (id, user_id, session_token, expires_at, created_at)
SELECT id, user_id, session_token, expires_at, created_at FROM user_sessions;

DROP TABLE IF EXISTS user_sessions;

ALTER TABLE new_user_sessions RENAME TO user_sessions;

COMMIT;

-- Re-enable foreign key checks (SQLite specific)
PRAGMA foreign_keys=ON;
