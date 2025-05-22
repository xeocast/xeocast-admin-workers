# API Specification

This document outlines the API endpoints for the Xeocast Admin Dashboard, mirroring the functionality of the existing Astro Actions.

## Authentication

### POST /auth/login

Logs in a user by verifying their email and password, and establishing a session.

**Request Body:**

*   `email` (string, required): The user's email address.
*   `password` (string, required): The user's password.

**Example Request:**

```json
{
  "email": "user@example.com",
  "password": "yourpassword"
}
```

**Responses:**

*   **200 OK:** Login successful. A session cookie (`session_token`) is set.
    ```json
    {
      "success": true
    }
    ```
*   **400 Bad Request:** Missing email or password.
    ```json
    {
      "error": "missing",
      "message": "Email and password are required." 
    }
    ```
*   **401 Unauthorized:** Invalid credentials, user not found, or role configuration issue.
    ```json
    {
      "error": "invalid",
      "message": "User not found." 
    }
    ```
    ```json
    {
      "error": "invalid",
      "message": "Invalid password."
    }
    ```
    ```json
    {
      "error": "authentication_failed",
      "message": "User role configuration error."
    }
    ```
*   **500 Internal Server Error:** An unexpected error occurred during the login process.
    ```json
    {
      "error": "authentication_failed",
      "message": "An internal error occurred during login."
    }
    ```

### POST /auth/logout

Logs out the currently authenticated user by invalidating their session.

**Request Body:**

None. The session is identified by the `session_token` cookie.

**Responses:**

*   **200 OK:** Logout successful. The session cookie is cleared.
    ```json
    {
      "success": true,
      "message": "Logged out successfully."
    }
    ```
*   **500 Internal Server Error:** An unexpected error occurred during the logout process (e.g., database error when deleting the session).
    ```json
    {
      "error": "logout_failed",
      "message": "An internal error occurred during logout."
    }
    ```
---

## Categories

Endpoints for managing categories. Categories have several text fields for names, descriptions, and various prompt templates, along with default R2 bucket keys for background audio/thumbnails and a language code.

**Category Object Fields:**

*   `id` (integer): Unique identifier for the category.
*   `name` (string, required, max 255): Name of the category. Must be unique.
*   `description` (string, required, max 5000): Description of the category.
*   `default_source_background_bucket_key` (string, required): Default R2 bucket key for background audio source files.
*   `default_source_thumbnail_bucket_key` (string, required): Default R2 bucket key for thumbnail source files.
*   `prompt_template_to_gen_evergreen_titles` (string, required): Prompt template for generating evergreen titles.
*   `prompt_template_to_gen_news_titles` (string, required): Prompt template for generating news titles.
*   `prompt_template_to_gen_series_titles` (string, required): Prompt template for generating series titles.
*   `prompt_template_to_gen_article_content` (string, required): Prompt template for generating article content.
*   `prompt_template_to_gen_description` (string, required): Prompt template for generating podcast descriptions.
*   `prompt_template_to_gen_short_description` (string, required): Prompt template for generating short podcast descriptions.
*   `prompt_template_to_gen_tag_list` (string, required): Prompt template for generating tag lists.
*   `prompt_template_to_gen_audio_podcast` (string, required): Prompt template for generating audio podcast scripts or summaries.
*   `prompt_template_to_gen_video_thumbnail` (string, required): Prompt template for generating video thumbnail ideas/content.
*   `prompt_template_to_gen_article_image` (string, required): Prompt template for generating article images.
*   `language_code` (string, required, 2 chars): Language code (e.g., "en", "es").
*   `created_at` (string, ISO 8601 datetime): Timestamp of creation.
*   `updated_at` (string, ISO 8601 datetime): Timestamp of last update.

---

### POST /categories

Creates a new category.

**Request Body (`application/json`):**

All fields from the "Category Object Fields" except `id`, `created_at`, and `updated_at` are required.

```json
{
  "name": "Technology Updates",
  "description": "Latest news and discussions in the tech world.",
  "default_source_background_bucket_key": "defaults/tech_bg.mp3",
  "default_source_thumbnail_bucket_key": "defaults/tech_thumb.png",
  "prompt_template_to_gen_evergreen_titles": "Generate an evergreen title about {topic} in technology.",
  "prompt_template_to_gen_news_titles": "Create a news title for a recent event: {event_summary}.",
  "prompt_template_to_gen_series_titles": "Suggest a series title for a podcast about {series_theme} in tech.",
  "prompt_template_to_gen_article_content": "Write an article about {topic} focusing on {aspect}.",
  "prompt_template_to_gen_description": "Generate a detailed podcast description for an episode about {episode_topic}.",
  "prompt_template_to_gen_short_description": "Create a short, catchy description for a podcast on {episode_topic}.",
  "prompt_template_to_gen_tag_list": "List relevant tags for a podcast about {episode_topic}.",
  "prompt_template_to_gen_audio_podcast": "Draft a script segment for an audio podcast discussing {segment_topic}.",
  "prompt_template_to_gen_video_thumbnail": "Describe a compelling thumbnail for a video about {video_topic}.",
  "prompt_template_to_gen_article_image": "Suggest an image concept for an article on {article_topic}.",
  "language_code": "en"
}
```

**Responses:**

*   **201 Created:** Category created successfully.
    ```json
    {
      "success": true,
      "message": "Category created successfully.",
      "categoryId": 123 
    }
    ```
*   **400 Bad Request:** Invalid input (e.g., missing fields, validation errors, name already exists).
    ```json
    {
      "success": false,
      "message": "Category name already exists." 
    }
    ```
    ```json
    {
      "success": false,
      "message": "Failed to create category." 
      // Optionally, include field-specific errors:
      // "errors": { "name": "Name is required", "language_code": "Language code must be 2 characters" }
    }
    ```
*   **500 Internal Server Error:** An unexpected error occurred.
    ```json
    {
      "success": false,
      "message": "Failed to create category."
    }
    ```

---

### GET /categories

Lists all categories. Returns a summarized version (id, name, language_code).

**Query Parameters:**

None currently. Consider adding pagination (e.g., `page`, `limit`) for future scalability.

**Responses:**

*   **200 OK:** A list of categories.
    ```json
    {
      "success": true,
      "categories": [
        {
          "id": 1,
          "name": "Technology Updates",
          "language_code": "en"
        },
        {
          "id": 2,
          "name": "Business Insights",
          "language_code": "en"
        }
      ]
    }
    ```
*   **500 Internal Server Error:** An unexpected error occurred.
    ```json
    {
      "success": false,
      "message": "Failed to fetch categories: <error_details>",
      "categories": []
    }
    ```

---

### GET /categories/{id}

Retrieves a single category by its ID. Returns the full category object.

**Path Parameters:**

*   `id` (integer, required): The ID of the category to retrieve.

**Responses:**

*   **200 OK:** The requested category.
    ```json
    {
      "success": true,
      "category": {
        "id": 1,
        "name": "Technology Updates",
        "description": "Latest news and discussions in the tech world.",
        // ... all other category fields ...
        "language_code": "en",
        "created_at": "2023-01-15T10:00:00Z",
        "updated_at": "2023-01-16T12:30:00Z"
      }
    }
    ```
*   **404 Not Found:** Category with the given ID does not exist.
    ```json
    {
      "success": false,
      "message": "Category not found.",
      "category": null
    }
    ```
*   **500 Internal Server Error:** An unexpected error occurred.
    ```json
    {
      "success": false,
      "message": "Failed to fetch category.",
      "category": null
    }
    ```

---

### PUT /categories/{id}

Updates an existing category. All fields from the "Category Object Fields" (except `id`, `created_at`, `updated_at`) are required for the update, similar to creation.

**Path Parameters:**

*   `id` (integer, required): The ID of the category to update.

**Request Body (`application/json`):**

Same structure as the POST /categories request body.

```json
{
  "name": "Advanced Technology Updates",
  "description": "In-depth news and discussions in the advanced tech world.",
  // ... all other fields ...
  "language_code": "en"
}
```

**Responses:**

*   **200 OK:** Category updated successfully.
    ```json
    {
      "success": true,
      "message": "Category updated successfully."
    }
    ```
*   **400 Bad Request:** Invalid input (e.g., validation errors, name conflict).
    ```json
    {
      "success": false,
      "message": "Category name already exists." 
    }
    ```
    ```json
    {
      "success": false,
      "message": "Failed to update category."
      // Optionally, include field-specific errors
    }
    ```
*   **404 Not Found:** Category not found or no changes were made (e.g., data submitted was identical to existing data).
    ```json
    {
      "success": false,
      "message": "Category not found or no changes made."
    }
    ```
*   **500 Internal Server Error:** An unexpected error occurred.
    ```json
    {
      "success": false,
      "message": "Failed to update category."
    }
    ```

---

### DELETE /categories/{id}

Deletes a category by its ID.

**Path Parameters:**

*   `id` (integer, required): The ID of the category to delete.

**Responses:**

*   **200 OK:** Category deleted successfully.
    ```json
    {
      "success": true,
      "message": "Category deleted successfully."
    }
    ```
    Alternatively, **204 No Content** could be used.
*   **404 Not Found:** Category with the given ID does not exist.
    ```json
    {
      "success": false,
      "message": "Category not found."
    }
    ```
*   **409 Conflict:** Category cannot be deleted due to existing dependencies (e.g., assigned to podcasts or series).
    ```json
    {
      "success": false,
      "message": "Cannot delete category. It is currently assigned to one or more podcasts or series."
    }
    ```
*   **500 Internal Server Error:** An unexpected error occurred.
    ```json
    {
      "success": false,
      "message": "Failed to delete category."
    }
    ```
---

## Podcasts

Endpoints for managing podcasts, including their metadata, associated files, and lifecycle.

**Podcast Object Fields (Core):**

*   `id` (integer): Unique identifier for the podcast.
*   `title` (string, required, max 255): Title of the podcast.
*   `description` (string, optional, max 5000): Longer description of the podcast.
*   `markdown_content` (string, optional): Full content of the podcast in Markdown format.
*   `category_id` (integer, required): ID of the category this podcast belongs to.
*   `series_id` (integer, optional): ID of the series this podcast belongs to (if any).
*   `source_audio_bucket_key` (string, optional, max 2048): R2 bucket key for the source audio file.
*   `source_background_bucket_key` (string, optional, max 2048): R2 bucket key for the source background media (audio/video).
*   `video_bucket_key` (string, optional, max 2048): R2 bucket key for the generated video file.
*   `thumbnail_bucket_key` (string, optional, max 2048): R2 bucket key for the podcast thumbnail.
*   `tags` (array of strings, optional): Tags associated with the podcast. Stored as a JSON string array in the database, presented as a native JSON array in the API.
*   `first_comment` (string, optional): The first comment to be posted on platforms like YouTube.
*   `type` (enum string, required): Type of podcast. Allowed values: `evergreen`, `news`.
*   `status` (enum string, required): Current status of the podcast. Allowed values: `draft`, `draftApproved`, `researching`, `researched`, `generatingThumbnail`, `thumbnailGenerated`, `generatingAudio`, `audioGenerated`, `generating`, `generated`, `generatedApproved`, `uploading`, `uploaded`, `published`, `unpublished`.
*   `scheduled_publish_at` (string, optional, ISO 8601 datetime, e.g., "YYYY-MM-DD HH:MM:SS"): The date and time when the podcast is scheduled to be published.
*   `last_status_change_at` (string, ISO 8601 datetime): Timestamp of the last status change.
*   `created_at` (string, ISO 8601 datetime): Timestamp of creation.
*   `updated_at` (string, ISO 8601 datetime): Timestamp of last update.

**Podcast Object (Detailed View - includes associated names):**

*   All fields from "Podcast Object Fields (Core)".
*   `category_name` (string): Name of the associated category.
*   `series_title` (string, optional): Title of the associated series (if applicable and joined).

---

### POST /podcasts

Creates a new podcast.

**Request Body (`application/json`):**

All fields from "Podcast Object Fields (Core)" that are creatable (e.g., `title`, `category_id`, `type`, `status`, etc.). `id`, `created_at`, `updated_at`, `last_status_change_at` are auto-generated. `tags` should be an array of strings. `scheduled_publish_at` should be in "YYYY-MM-DD HH:MM:SS" format if provided.

```json
{
  "title": "My First Podcast Episode",
  "description": "An introduction to the series.",
  "markdown_content": "# Welcome\n\nThis is the content.",
  "category_id": 1,
  "series_id": null,
  "source_audio_bucket_key": null,
  "source_background_bucket_key": null,
  "video_bucket_key": null,
  "thumbnail_bucket_key": null,
  "tags": ["introduction", "tech"],
  "first_comment": "Welcome to the show!",
  "type": "evergreen",
  "status": "draft",
  "scheduled_publish_at": "2024-12-31 23:59:59"
}
```

**Responses:**

*   **201 Created:** Podcast created successfully.
    ```json
    {
      "success": true,
      "message": "Podcast created successfully.",
      "podcastId": 101
    }
    ```
*   **400 Bad Request:** Invalid input (e.g., missing required fields, invalid category/series ID, category mismatch for series).
    ```json
    {
      "success": false,
      "message": "Invalid Category ID." 
    }
    ```
    ```json
    {
      "success": false,
      "message": "Podcast category must match the series category."
    }
    ```
*   **500 Internal Server Error:** An unexpected error occurred.
    ```json
    {
      "success": false,
      "message": "Failed to create podcast."
    }
    ```

---

### GET /podcasts

Lists podcasts with filtering and pagination.

**Query Parameters:**

*   `searchText` (string, optional): Text to search in podcast titles or descriptions.
*   `categoryId` (integer, optional): Filter by category ID.
*   `seriesId` (integer, optional): Filter by series ID.
*   `type` (enum string, optional): Filter by type (`evergreen`, `news`).
*   `status` (enum string, optional): Filter by status (see allowed values above).
*   `dateFrom` (string, optional, ISO 8601 datetime): Filter podcasts created/updated from this date.
*   `dateTo` (string, optional, ISO 8601 datetime): Filter podcasts created/updated up to this date.
*   `page` (integer, optional, default 1): Page number for pagination.
*   `limit` (integer, optional, default 20): Number of items per page.

**Responses:**

*   **200 OK:** A paginated list of podcasts.
    ```json
    {
      "success": true,
      "podcasts": [
        {
          "id": 101,
          "title": "My First Podcast Episode",
          "category_id": 1,
          "category_name": "Technology",
          "series_id": null,
          "type": "evergreen",
          "status": "draft",
          "scheduled_publish_at": "2024-12-31 23:59:59",
          "created_at": "2024-01-01T10:00:00Z",
          "updated_at": "2024-01-01T10:00:00Z"
          // ... other summary fields ...
        }
      ],
      "pagination": {
        "totalItems": 1,
        "totalPages": 1,
        "currentPage": 1,
        "limit": 20
      }
    }
    ```
*   **400 Bad Request:** Invalid filter parameters.
*   **500 Internal Server Error:** An unexpected error occurred.

---

### GET /podcasts/{id}

Retrieves a single podcast by its ID.

**Path Parameters:**

*   `id` (integer, required): The ID of the podcast to retrieve.

**Responses:**

*   **200 OK:** The requested podcast (Detailed View).
    ```json
    {
      "success": true,
      "podcast": {
        "id": 101,
        "title": "My First Podcast Episode",
        "description": "An introduction to the series.",
        "markdown_content": "# Welcome\n\nThis is the content.",
        "category_id": 1,
        "category_name": "Technology", 
        "series_id": null,
        // "series_title": null, // if applicable
        "source_audio_bucket_key": null,
        "source_background_bucket_key": null,
        "video_bucket_key": null,
        "thumbnail_bucket_key": null,
        "tags": ["introduction", "tech"], // Parsed from JSON string
        "first_comment": "Welcome to the show!",
        "type": "evergreen",
        "status": "draft",
        "scheduled_publish_at": "2024-12-31 23:59:59",
        "last_status_change_at": "2024-01-01T10:00:00Z",
        "created_at": "2024-01-01T10:00:00Z",
        "updated_at": "2024-01-01T10:00:00Z"
      }
    }
    ```
*   **404 Not Found:** Podcast with the given ID does not exist.
*   **500 Internal Server Error:** An unexpected error occurred.

---

### PUT /podcasts/{id}

Updates an existing podcast.

**Path Parameters:**

*   `id` (integer, required): The ID of the podcast to update.

**Request Body (`application/json`):**

Fields from "Podcast Object Fields (Core)" that are updatable. `tags` should be an array of strings. `scheduled_publish_at` should be "YYYY-MM-DD HH:MM:SS" or null.

```json
{
  "title": "Updated Podcast Title",
  "description": "Updated description.",
  "status": "draftApproved",
  "tags": ["introduction", "tech", "updated"],
  "scheduled_publish_at": null 
}
```

**Responses:**

*   **200 OK:** Podcast updated successfully.
    ```json
    {
      "success": true,
      "message": "Podcast updated successfully."
    }
    ```
*   **400 Bad Request:** Invalid input (e.g., validation errors, invalid category/series ID).
*   **404 Not Found:** Podcast not found or no changes made.
*   **500 Internal Server Error:** An unexpected error occurred.

---

### POST /podcasts/{id}/audio

Uploads a source audio file for a podcast. The file is stored in R2, and the `source_audio_bucket_key` field on the podcast is updated.

**Path Parameters:**

*   `id` (integer, required): The ID of the podcast.

**Request Body (`multipart/form-data`):**

*   `audioFile` (file, required): The audio file to upload (e.g., MP3, WAV).

**Responses:**

*   **200 OK:** Audio uploaded and podcast updated successfully.
    ```json
    {
      "success": true,
      "message": "Audio file uploaded successfully.",
      "r2Key": "podcasts/101/audio/uniquesuffix_audiofilename.mp3"
    }
    ```
*   **400 Bad Request:** No file provided, invalid file type, or podcast ID missing/invalid.
*   **404 Not Found:** Podcast not found.
*   **500 Internal Server Error:** File upload or database update failed.

---

### POST /podcasts/{id}/background

Uploads a source background media file (image or video) for a podcast. The file is stored in R2, and the `source_background_bucket_key` field on the podcast is updated.

**Path Parameters:**

*   `id` (integer, required): The ID of the podcast.

**Request Body (`multipart/form-data`):**

*   `mediaFile` (file, required): The image or video file to upload.

**Responses:**

*   **200 OK:** Media uploaded and podcast updated successfully.
    ```json
    {
      "success": true,
      "message": "Background file uploaded successfully.",
      "r2Key": "podcasts/101/background/uniquesuffix_mediafilename.jpg"
    }
    ```
*   **400 Bad Request:** No file provided, invalid file type, or podcast ID missing/invalid.
*   **404 Not Found:** Podcast not found.
*   **500 Internal Server Error:** File upload or database update failed.

---

### DELETE /podcasts/{id}

Deletes a podcast and its associated files from R2 (source audio, background, video, thumbnail).

**Path Parameters:**

*   `id` (integer, required): The ID of the podcast to delete.

**Responses:**

*   **200 OK:** Podcast and associated files deleted successfully.
    ```json
    {
      "success": true,
      "message": "Podcast and associated files deleted successfully."
    }
    ```
*   **404 Not Found:** Podcast not found.
*   **500 Internal Server Error:** Deletion failed (database or R2).

---

## Files

Endpoints for general file operations, primarily streaming from R2.

### GET /files/download

Streams a file from an R2 bucket for download. This endpoint is based on the `streamR2Object` action.

**Query Parameters:**

*   `key` (string, required): The R2 object key (full path within the bucket).
*   `bucketType` (enum string, required): Specifies which R2 bucket to use. Allowed values:
    *   `VIDEO_OUTPUT_BUCKET`
    *   `VIDEO_SOURCE_BUCKET`
    *   `AUDIO_SOURCE_BUCKET`
    *   `BACKGROUND_SOURCE_BUCKET`
    *   `THUMBNAIL_OUTPUT_BUCKET`
*   `filename` (string, required): The desired filename for the download prompt (e.g., `myaudio.mp3`).

**Example Request:**

`/files/download?key=podcasts/101/audio/track.mp3&bucketType=AUDIO_SOURCE_BUCKET&filename=episode1_audio.mp3`

**Responses:**

*   **200 OK:** The file stream.
    *   Headers:
        *   `Content-Disposition: attachment; filename="<filename_param>"`
        *   `Content-Type: <mime_type_of_object>`
        *   `Content-Length: <size_of_object>`
*   **400 Bad Request:** Missing or invalid parameters.
*   **404 Not Found:** R2 object not found in the specified bucket.
*   **500 Internal Server Error:** Error accessing R2 or streaming the file.

---


## Users

Endpoints for managing user accounts and their roles.

**User Object Fields:**

*   `id` (integer): Unique identifier for the user.
*   `name` (string, optional, max 100): Name of the user.
*   `email` (string, required, email format, max 255): Email address of the user (must be unique).
*   `password` (string, write-only, min 8, max 255): User's password. Required for creation, optional for update. Not returned in responses.
*   `role` (enum string, required): Role of the user. Allowed values from `UserRoleEnum`: `admin`, `editor`, `viewer`.
*   `created_at` (string, ISO 8601 datetime): Timestamp of user creation.
*   `updated_at` (string, ISO 8601 datetime): Timestamp of last user update.

---

### POST /users

Creates a new user.

**Request Body (`application/json` or `form`):**

*   `name` (string, optional, max 100): User's name.
*   `email` (string, required, email format, max 255): User's email.
*   `password` (string, required, min 8, max 255): User's password.
*   `role` (enum string, required): User's role (`admin`, `editor`, `viewer`).

**Example Request:**

```json
{
  "name": "Jane Doe",
  "email": "jane.doe@example.com",
  "password": "securepassword123",
  "role": "editor"
}
```

**Responses:**

*   **201 Created:** User created successfully.
    ```json
    {
      "success": true,
      "message": "User created successfully."
      // "userId": 123 // Potentially return new user ID
    }
    ```
*   **400 Bad Request:** Invalid input (e.g., missing fields, validation errors, role not found).
    ```json
    {
      "success": false,
      "message": "Email already exists." 
    }
    ```
    ```json
    {
      "success": false,
      "message": "Role 'invalid_role' not found."
    }
    ```
    ```json
    {
      "success": false,
      "message": "Failed to create user record." // Or more specific Zod error messages
    }
    ```
*   **500 Internal Server Error:** An unexpected error occurred.
    ```json
    {
      "success": false,
      "message": "Failed to create user."
    }
    ```

---

### GET /users

Lists all users.

**Query Parameters:**

None currently. Consider adding pagination (e.g., `page`, `limit`) and sorting for future scalability.

**Responses:**

*   **200 OK:** A list of users.
    ```json
    {
      "success": true,
      "users": [
        {
          "id": 1,
          "email": "admin@example.com",
          "name": "Admin User",
          "role": "admin",
          "created_at": "2023-01-15T10:00:00Z",
          "updated_at": "2023-01-16T12:30:00Z"
        },
        {
          "id": 2,
          "email": "editor@example.com",
          "name": "Editor User",
          "role": "editor",
          "created_at": "2023-02-01T11:00:00Z",
          "updated_at": "2023-02-02T14:00:00Z"
        }
      ]
    }
    ```
*   **500 Internal Server Error:** An unexpected error occurred.
    ```json
    {
      "success": false,
      "message": "Failed to fetch users.",
      "users": []
    }
    ```

---

### GET /users/{id}

Retrieves a single user by their ID.

**Path Parameters:**

*   `id` (integer, required): The ID of the user to retrieve.

**Responses:**

*   **200 OK:** The requested user.
    ```json
    {
      "success": true,
      "user": {
        "id": 1,
        "email": "admin@example.com",
        "name": "Admin User",
        "role": "admin",
        "created_at": "2023-01-15T10:00:00Z",
        "updated_at": "2023-01-16T12:30:00Z"
      }
    }
    ```
*   **404 Not Found:** User with the given ID does not exist.
    ```json
    {
      "success": false,
      "message": "User not found.",
      "user": null
    }
    ```
*   **500 Internal Server Error:** An unexpected error occurred.
    ```json
    {
      "success": false,
      "message": "Failed to fetch user.",
      "user": null
    }
    ```

---

### PUT /users/{id}

Updates an existing user.

**Path Parameters:**

*   `id` (integer, required): The ID of the user to update.

**Request Body (`application/json` or `form`):**

*   `name` (string, optional, max 100): User's name.
*   `email` (string, required, email format, max 255): User's email.
*   `password` (string, optional, min 8, max 255): New password for the user. If not provided, password remains unchanged.
*   `role` (enum string, required): User's role (`admin`, `editor`, `viewer`).

**Example Request:**

```json
{
  "name": "Jane Doe Updated",
  "email": "jane.doe.updated@example.com",
  "role": "admin"
}
```

**Responses:**

*   **200 OK:** User updated successfully.
    ```json
    {
      "success": true,
      "message": "User updated successfully."
    }
    ```
*   **400 Bad Request:** Invalid input (e.g., validation errors, email conflict, role not found).
    ```json
    {
      "success": false,
      "message": "Email already exists."
    }
    ```
    ```json
    {
      "success": false,
      "message": "Role 'invalid_role' not found."
    }
    ```
*   **404 Not Found:** User not found.
    ```json
    {
      "success": false,
      "message": "User not found." // Or if no changes were made by the update
    }
    ```
*   **500 Internal Server Error:** An unexpected error occurred.
    ```json
    {
      "success": false,
      "message": "Failed to update user."
    }
    ```

---

### DELETE /users/{id}

Deletes a user by their ID.

**Path Parameters:**

*   `id` (integer, required): The ID of the user to delete.

**Responses:**

*   **200 OK:** User deleted successfully.
    ```json
    {
      "success": true,
      "message": "User deleted successfully."
    }
    ```
*   **404 Not Found:** User with the given ID does not exist.
    ```json
    {
      "success": false,
      "message": "User not found."
    }
    ```
*   **500 Internal Server Error:** An unexpected error occurred.
    ```json
    {
      "success": false,
      "message": "Failed to delete user."
    }
    ```
---


## Roles

Endpoints for managing roles. (Currently, only listing roles is supported).

---

### GET /roles

Lists all available roles in the system.

**Query Parameters:**

None.

**Responses:**

*   **200 OK:** A list of role names.
    ```json
    {
      "success": true,
      "roles": [
        { "name": "admin" },
        { "name": "editor" },
        { "name": "viewer" }
      ]
    }
    ```
*   **200 OK (No Roles Found):**
    ```json
    {
      "success": false, 
      "message": "No roles found or failed to fetch roles.",
      "roles": []
    }
    ```
    *(Note: The action currently returns `success: false` if no roles are found or if there's a fetch failure. Ideally, "no roles found" might be `success: true, roles: []`)*
*   **500 Internal Server Error:** An unexpected error occurred.
    ```json
    {
      "success": false,
      "message": "Failed to fetch roles due to an internal error.",
      "roles": []
    }
    ```

---


## Series

Endpoints for managing series within categories.

**Series Object Fields:**

*   `id` (integer): Unique identifier for the series.
*   `title` (string, required, max 255): Title of the series.
*   `description` (string, optional, nullable, max 5000): Description of the series.
*   `category_id` (integer, required): ID of the category this series belongs to.
*   `created_at` (string, ISO 8601 datetime): Timestamp of series creation.
*   `updated_at` (string, ISO 8601 datetime): Timestamp of last series update.

---

### POST /series

Creates a new series.

**Request Body (`application/json` or `form`):**

*   `title` (string, required, max 255): Series title.
*   `description` (string, optional, nullable, max 5000): Series description.
*   `category_id` (integer, required): ID of the category this series belongs to.

**Example Request:**

```json
{
  "title": "My First Podcast Series",
  "description": "A series about starting a podcast.",
  "category_id": 1
}
```

**Responses:**

*   **201 Created:** Series created successfully. Returns the new series object.
    ```json
    {
      "success": true,
      "message": "Series created successfully.",
      "series": {
        "id": 10,
        "title": "My First Podcast Series",
        "description": "A series about starting a podcast.",
        "category_id": 1,
        "created_at": "2023-03-10T10:00:00Z",
        "updated_at": "2023-03-10T10:00:00Z"
      }
    }
    ```
*   **400 Bad Request:** Invalid input (e.g., missing fields, validation errors, category not found, title conflict).
    ```json
    {
      "success": false,
      "message": "Category with ID 1 not found." 
    }
    ```
    ```json
    {
      "success": false,
      "message": "Series title already exists." 
    }
    ```
*   **500 Internal Server Error:** An unexpected error occurred.
    ```json
    {
      "success": false,
      "message": "Failed to create series."
    }
    ```

---

### GET /series

Lists all series. Can be filtered by category.

**Query Parameters:**

*   `categoryId` (integer, optional): ID of the category to filter series by.

**Example Request:**

`/series?categoryId=1`

**Responses:**

*   **200 OK:** A list of series.
    ```json
    {
      "success": true,
      "series": [
        {
          "id": 10,
          "title": "My First Podcast Series",
          "description": "A series about starting a podcast.",
          "category_id": 1,
          "created_at": "2023-03-10T10:00:00Z",
          "updated_at": "2023-03-10T10:00:00Z"
        },
        {
          "id": 11,
          "title": "Advanced Podcasting Techniques",
          "description": null,
          "category_id": 1,
          "created_at": "2023-03-11T11:00:00Z",
          "updated_at": "2023-03-11T11:00:00Z"
        }
      ]
    }
    ```
*   **500 Internal Server Error:** An unexpected error occurred.
    ```json
    {
      "success": false,
      "message": "Failed to fetch series.",
      "series": []
    }
    ```

---

### GET /series/{id}

Retrieves a single series by its ID.

**Path Parameters:**

*   `id` (integer, required): The ID of the series to retrieve.

**Responses:**

*   **200 OK:** The requested series.
    ```json
    {
      "success": true,
      "series": {
        "id": 10,
        "title": "My First Podcast Series",
        "description": "A series about starting a podcast.",
        "category_id": 1,
        "created_at": "2023-03-10T10:00:00Z",
        "updated_at": "2023-03-10T10:00:00Z"
      }
    }
    ```
*   **404 Not Found:** Series with the given ID does not exist.
    ```json
    {
      "success": false,
      "message": "Series not found.",
      "series": null
    }
    ```
*   **500 Internal Server Error:** An unexpected error occurred.
    ```json
    {
      "success": false,
      "message": "Failed to fetch series.",
      "series": null
    }
    ```

---

### PUT /series/{id}

Updates an existing series.

**Path Parameters:**

*   `id` (integer, required): The ID of the series to update.

**Request Body (`application/json` or `form`):**

*   `title` (string, required, max 255): Series title.
*   `description` (string, optional, nullable, max 5000): Series description.
*   `category_id` (integer, required): ID of the category this series belongs to.

**Example Request:**

```json
{
  "title": "My Updated Podcast Series",
  "description": "An updated series about podcasting.",
  "category_id": 2
}
```

**Responses:**

*   **200 OK:** Series updated successfully. Returns the updated series object or a "no changes" message.
    ```json
    {
      "success": true,
      "message": "Series updated successfully.",
      "series": {
        "id": 10,
        "title": "My Updated Podcast Series",
        "description": "An updated series about podcasting.",
        "category_id": 2,
        "created_at": "2023-03-10T10:00:00Z",
        "updated_at": "2023-03-12T15:30:00Z"
      }
    }
    ```
    ```json
    {
      "success": true,
      "message": "No changes made to the series."
    }
    ```
*   **400 Bad Request:** Invalid input (e.g., validation errors, category not found, title conflict, category change restricted).
    ```json
    {
      "success": false,
      "message": "Category with ID 99 not found."
    }
    ```
    ```json
    {
      "success": false,
      "message": "Series title already exists."
    }
    ```
    ```json
    {
      "success": false,
      "message": "Cannot change category of a series with podcasts." // Example specific trigger message
    }
    ```
*   **404 Not Found:** Series with the given ID does not exist.
    ```json
    {
      "success": false,
      "message": "Series with ID 999 not found."
    }
    ```
*   **500 Internal Server Error:** An unexpected error occurred.
    ```json
    {
      "success": false,
      "message": "Failed to update series."
    }
    ```

---

### DELETE /series/{id}

Deletes a series by its ID.

**Path Parameters:**

*   `id` (integer, required): The ID of the series to delete.

**Responses:**

*   **200 OK:** Series deleted successfully.
    ```json
    {
      "success": true,
      "message": "Series deleted successfully."
    }
    ```
*   **400 Bad Request:** Deletion failed due to constraints (e.g., series has associated podcasts).
    ```json
    {
      "success": false,
      "message": "Cannot delete series: it has associated podcasts." // Assuming a constraint
    }
    ```
*   **404 Not Found:** Series with the given ID does not exist.
    ```json
    {
      "success": false,
      "message": "Series not found."
    }
    ```
*   **500 Internal Server Error:** An unexpected error occurred.
    ```json
    {
      "success": false,
      "message": "Failed to delete series."
    }
    ```
---


## External Tasks

Endpoints for viewing the status and details of tasks processed by external services.

**External Task Object Fields:**

*   `id` (integer): Internal database ID of the task.
*   `external_task_id` (string): ID of the task as known by the external service.
*   `type` (string): The type or category of the external task (e.g., `YOUTUBE_VIDEO_IMPORT`, `TRANSCRIPTION_JOB`).
*   `data` (string, JSON format): A JSON string containing data relevant to the task.
*   `status` (enum string): The current status of the task. Allowed values: `pending`, `processing`, `completed`, `error`.
*   `created_at` (string, ISO 8601 datetime): Timestamp of when the task was created.
*   `updated_at` (string, ISO 8601 datetime): Timestamp of the last update to the task.

---

### GET /external-tasks

Lists external service tasks with pagination and filtering.

**Query Parameters:**

*   `page` (integer, optional, default: 1): The page number for pagination.
*   `limit` (integer, optional, default: 20): The number of tasks to return per page.
*   `status` (string, optional): Filter tasks by status (e.g., `pending`, `completed`).
*   `type` (string, optional): Filter tasks by type (e.g., `YOUTUBE_VIDEO_IMPORT`).

**Example Request:**

`/external-tasks?page=1&limit=10&status=completed&type=YOUTUBE_VIDEO_IMPORT`

**Responses:**

*   **200 OK:** A paginated list of external tasks.
    ```json
    {
      "success": true,
      "tasks": [
        {
          "id": 1,
          "external_task_id": "ext_abc123",
          "type": "YOUTUBE_VIDEO_IMPORT",
          "data": "{\"youtubeVideoId\":\"dQw4w9WgXcQ\", \"targetPodcastId\":101}",
          "status": "completed",
          "created_at": "2023-04-01T10:00:00Z",
          "updated_at": "2023-04-01T10:05:00Z"
        },
        {
          "id": 2,
          "external_task_id": "ext_def456",
          "type": "TRANSCRIPTION_JOB",
          "data": "{\"audioFileKey\":\"r2_bucket/audio.mp3\"}",
          "status": "processing",
          "created_at": "2023-04-02T11:00:00Z",
          "updated_at": "2023-04-02T11:02:00Z"
        }
      ],
      "total": 50,
      "page": 1,
      "limit": 10,
      "totalPages": 5
    }
    ```
*   **400 Bad Request:** Invalid input or validation error (e.g., tasks data fails validation).
    ```json
    {
      "success": false,
      "message": "Failed to validate tasks data.",
      "errors": {
        // Zod validation error details
      }
    }
    ```
*   **500 Internal Server Error:** An unexpected error occurred.
    ```json
    {
      "success": false,
      "message": "An unexpected error occurred." // Or a more specific D1 error
    }
    ```

---


## YouTube Channels

Endpoints for managing YouTube channels linked to categories. These channels store metadata and templates for content published to YouTube.

**YouTube Channel Object Fields:**

*   `id` (integer): Internal database ID of the YouTube channel entry.
*   `category_id` (integer, required): ID of the category this channel is associated with.
*   `youtube_platform_id` (string, required, max 255): The actual YouTube Channel ID (e.g., `UCXXXX...`). Must be unique.
*   `title` (string, required, max 255): Title of the YouTube channel.
*   `description` (string, required, max 5000): Description of the YouTube channel.
*   `youtube_platform_category_id` (string, required): YouTube's own category ID for the channel.
*   `video_description_template` (string, required, text): Template for video descriptions.
*   `first_comment_template` (string, required, text): Template for the first comment on videos.
*   `language_code` (string, required, length 2): Language code (e.g., "en", "es").
*   `created_at` (string, ISO 8601 datetime): Timestamp of creation in the database.
*   `updated_at` (string, ISO 8601 datetime): Timestamp of last update in the database.

---

### POST /youtube-channels

Creates a new YouTube channel entry.

**Request Body (`application/json` or `form`):**

*   `category_id` (integer, required): ID of the associated category.
*   `youtube_platform_id` (string, required): YouTube Channel ID.
*   `title` (string, required): Channel title.
*   `description` (string, required): Channel description.
*   `youtube_platform_category_id` (string, required): YouTube's category ID for the channel.
*   `video_description_template` (string, required): Template for video descriptions.
*   `first_comment_template` (string, required): Template for first comments.
*   `language_code` (string, required, length 2): Language code.

**Example Request:**

```json
{
  "category_id": 1,
  "youtube_platform_id": "UCmXmlB4-HJytD7wek0Uo97A",
  "title": "My Awesome Tech Channel",
  "description": "Covering all things tech and programming.",
  "youtube_platform_category_id": "28",
  "video_description_template": "Check out my latest video on {{video_title}}!\nFind more info at {{website_link}}",
  "first_comment_template": "Thanks for watching! What do you want to see next?",
  "language_code": "en"
}
```

**Responses:**

*   **201 Created:** YouTube channel created successfully.
    ```json
    {
      "success": true,
      "message": "YouTube Channel created successfully.",
      "channelDbId": 123 // Internal database ID of the new channel
    }
    ```
*   **400 Bad Request:** Invalid input (e.g., missing fields, validation errors, YouTube Channel ID already exists).
    ```json
    {
      "success": false,
      "message": "This YouTube Channel ID already exists." 
    }
    ```
*   **500 Internal Server Error:** An unexpected error occurred.
    ```json
    {
      "success": false,
      "message": "Failed to create YouTube channel."
    }
    ```

---

### GET /youtube-channels

Lists all configured YouTube channels.

**Query Parameters:**

None.

**Responses:**

*   **200 OK:** A list of YouTube channels.
    ```json
    {
      "success": true,
      "channels": [
        {
          "id": 1,
          "category_id": 1,
          "youtube_platform_id": "UCmXmlB4-HJytD7wek0Uo97A",
          "title": "My Awesome Tech Channel",
          "description": "Covering all things tech and programming.",
          "youtube_platform_category_id": "28",
          "video_description_template": "Check out my latest video on {{video_title}}!\nFind more info at {{website_link}}",
          "first_comment_template": "Thanks for watching! What do you want to see next?",
          "language_code": "en",
          "created_at": "2023-05-01T10:00:00Z",
          "updated_at": "2023-05-01T10:00:00Z"
        }
      ]
    }
    ```
*   **500 Internal Server Error:** An unexpected error occurred.
    ```json
    {
      "success": false,
      "message": "Failed to fetch YouTube channels.",
      "channels": []
    }
    ```

---

### GET /youtube-channels/{id}

Retrieves a specific YouTube channel by its internal database ID.

**Path Parameters:**

*   `id` (integer, required): The internal database ID of the YouTube channel.

**Responses:**

*   **200 OK:** The requested YouTube channel.
    ```json
    {
      "success": true,
      "channel": {
        "id": 1,
        "category_id": 1,
        "youtube_platform_id": "UCmXmlB4-HJytD7wek0Uo97A",
        // ... other fields
      }
    }
    ```
*   **404 Not Found:** YouTube channel with the given ID does not exist.
    ```json
    {
      "success": false,
      "message": "YouTube Channel not found.",
      "channel": null
    }
    ```
*   **500 Internal Server Error:** An unexpected error occurred.
    ```json
    {
      "success": false,
      "message": "Failed to fetch YouTube channel.",
      "channel": null
    }
    ```

---

### GET /youtube-channels/platform/{youtube_platform_id}

Retrieves a specific YouTube channel by its YouTube platform ID.

**Path Parameters:**

*   `youtube_platform_id` (string, required): The YouTube platform ID of the channel.

**Responses:**

*   **200 OK:** The requested YouTube channel.
    ```json
    {
      "success": true,
      "channel": {
        "id": 1,
        "category_id": 1,
        "youtube_platform_id": "UCmXmlB4-HJytD7wek0Uo97A",
        // ... other fields
      }
    }
    ```
*   **404 Not Found:** YouTube channel with the given platform ID does not exist.
    ```json
    {
      "success": false,
      "message": "YouTube Channel not found.",
      "channel": null
    }
    ```
*   **500 Internal Server Error:** An unexpected error occurred.
    ```json
    {
      "success": false,
      "message": "Failed to fetch YouTube channel.",
      "channel": null
    }
    ```

---

### PUT /youtube-channels/{id}

Updates an existing YouTube channel entry by its internal database ID.

**Path Parameters:**

*   `id` (integer, required): The internal database ID of the YouTube channel to update.

**Request Body (`application/json` or `form`):**

*   `category_id` (integer, required): ID of the associated category.
*   `youtube_platform_id` (string, required): YouTube Channel ID.
*   `title` (string, required): Channel title.
*   `description` (string, required): Channel description.
*   `youtube_platform_category_id` (string, required): YouTube's category ID for the channel.
*   `video_description_template` (string, required): Template for video descriptions.
*   `first_comment_template` (string, required): Template for first comments.
*   `language_code` (string, required, length 2): Language code.

**Responses:**

*   **200 OK:** YouTube channel updated successfully.
    ```json
    {
      "success": true,
      "message": "YouTube Channel updated successfully."
    }
    ```
    ```json
    {
      "success": true,
      "message": "No changes detected for the YouTube Channel."
    }
    ```
*   **400 Bad Request:** Invalid input (e.g., validation errors, YouTube Channel ID conflict).
    ```json
    {
      "success": false,
      "message": "This YouTube Channel ID already exists for another channel."
    }
    ```
*   **404 Not Found:** YouTube channel with the given ID does not exist.
    ```json
    {
      "success": false,
      "message": "YouTube Channel not found."
    }
    ```
*   **500 Internal Server Error:** An unexpected error occurred.
    ```json
    {
      "success": false,
      "message": "Failed to update YouTube channel."
    }
    ```

---

### DELETE /youtube-channels/{id}

Deletes a YouTube channel by its internal database ID.

**Path Parameters:**

*   `id` (integer, required): The internal database ID of the YouTube channel to delete.

**Responses:**

*   **200 OK:** YouTube channel deleted successfully.
    ```json
    {
      "success": true,
      "message": "YouTube Channel deleted successfully."
    }
    ```
*   **400 Bad Request:** Deletion failed due to constraints (e.g., channel has associated YouTube videos).
    ```json
    {
      "success": false,
      "message": "Cannot delete YouTube Channel: It is referenced by existing YouTube videos."
    }
    ```
*   **404 Not Found:** YouTube channel with the given ID does not exist.
    ```json
    {
      "success": false,
      "message": "YouTube Channel not found."
    }
    ```
*   **500 Internal Server Error:** An unexpected error occurred.
    ```json
    {
      "success": false,
      "message": "Failed to delete YouTube channel."
    }
    ```
---


## YouTube Playlists

Endpoints for managing YouTube playlists. These link a YouTube playlist to an internal YouTube channel and a series.

**YouTube Playlist Object Fields:**

*   `id` (integer): Internal database ID of the YouTube playlist entry.
*   `youtube_platform_id` (string, required, max 255): The actual YouTube Playlist ID (e.g., `PLXXXX...`). Must be unique.
*   `title` (string, required, max 255): Title of the YouTube playlist.
*   `description` (string, optional, max 5000): Description of the YouTube playlist.
*   `channel_id` (integer, required): ID of the `youtube_channels` entry this playlist belongs to.
*   `series_id` (integer, required): ID of the `series` entry this playlist is associated with.
*   `created_at` (string, ISO 8601 datetime): Timestamp of creation in the database.
*   `updated_at` (string, ISO 8601 datetime): Timestamp of last update in the database.

---

### POST /youtube-playlists

Creates a new YouTube playlist entry.

**Request Body (`application/json` or `form`):**

*   `youtube_platform_id` (string, required): The YouTube Playlist ID.
*   `title` (string, required): Playlist title.
*   `description` (string, optional): Playlist description.
*   `channel_id` (integer, required): ID of the associated YouTube channel (internal DB ID).
*   `series_id` (integer, required): ID of the associated series (internal DB ID).

**Example Request:**

```json
{
  "youtube_platform_id": "PLBC7320A39076749E",
  "title": "Learn Astro Development",
  "description": "A comprehensive series on building with Astro.",
  "channel_id": 1,
  "series_id": 5
}
```

**Responses:**

*   **201 Created:** YouTube playlist created successfully.
    ```json
    {
      "success": true,
      "message": "YouTube Playlist created successfully.",
      "playlistId": 42 
    }
    ```
*   **400 Bad Request:** Invalid input (e.g., missing fields, validation errors, non-existent `channel_id` or `series_id`, `youtube_platform_id` already exists).
    ```json
    {
      "success": false,
      "message": "YouTube Playlist with this Platform ID already exists." 
    }
    ```
    ```json
    {
      "success": false,
      "message": "YouTube Channel with ID 999 not found."
    }
    ```
*   **500 Internal Server Error:** An unexpected error occurred.
    ```json
    {
      "success": false,
      "message": "Failed to create YouTube Playlist."
    }
    ```

---

### GET /youtube-playlists

Lists all configured YouTube playlists.

**Query Parameters:**

None.

**Responses:**

*   **200 OK:** A list of YouTube playlists.
    ```json
    {
      "success": true,
      "playlists": [
        {
          "id": 1,
          "youtube_platform_id": "PLBC7320A39076749E",
          "title": "Learn Astro Development",
          "description": "A comprehensive series on building with Astro.",
          "channel_id": 1,
          "series_id": 5,
          "created_at": "2023-06-01T10:00:00Z",
          "updated_at": "2023-06-01T10:00:00Z"
        }
      ]
    }
    ```
*   **500 Internal Server Error:** An unexpected error occurred.
    ```json
    {
      "success": false,
      "message": "Failed to fetch YouTube Playlists.",
      "playlists": []
    }
    ```

---

### GET /youtube-playlists/{id}

Retrieves a specific YouTube playlist by its internal database ID.

**Path Parameters:**

*   `id` (integer, required): The internal database ID of the YouTube playlist.

**Responses:**

*   **200 OK:** The requested YouTube playlist.
    ```json
    {
      "success": true,
      "playlist": {
        "id": 1,
        "youtube_platform_id": "PLBC7320A39076749E",
        // ... other fields
      }
    }
    ```
*   **404 Not Found:** YouTube playlist with the given ID does not exist.
    ```json
    {
      "success": false,
      "message": "YouTube Playlist not found.",
      "playlist": null
    }
    ```
*   **500 Internal Server Error:** An unexpected error occurred.
    ```json
    {
      "success": false,
      "message": "Failed to fetch YouTube Playlist.",
      "playlist": null
    }
    ```

---

### PUT /youtube-playlists/{id}

Updates an existing YouTube playlist entry by its internal database ID.

**Path Parameters:**

*   `id` (integer, required): The internal database ID of the YouTube playlist to update.

**Request Body (`application/json` or `form`):**

*   `youtube_platform_id` (string, required): The YouTube Playlist ID.
*   `title` (string, required): Playlist title.
*   `description` (string, optional): Playlist description.
*   `channel_id` (integer, required): ID of the associated YouTube channel (internal DB ID).
*   `series_id` (integer, required): ID of the associated series (internal DB ID).

**Responses:**

*   **200 OK:** YouTube playlist updated successfully.
    ```json
    {
      "success": true,
      "message": "YouTube Playlist updated successfully."
    }
    ```
*   **400 Bad Request:** Invalid input (e.g., validation errors, non-existent `channel_id` or `series_id`, `youtube_platform_id` conflict).
    ```json
    {
      "success": false,
      "message": "YouTube Playlist with this Platform ID already exists for another playlist."
    }
    ```
*   **404 Not Found:** YouTube playlist with the given ID does not exist, or no changes were made.
    ```json
    {
      "success": false,
      "message": "YouTube Playlist not found or no changes made." 
    }
    ```
*   **500 Internal Server Error:** An unexpected error occurred.
    ```json
    {
      "success": false,
      "message": "Failed to update YouTube Playlist."
    }
    ```

---

### DELETE /youtube-playlists/{id}

Deletes a YouTube playlist by its internal database ID.

**Path Parameters:**

*   `id` (integer, required): The internal database ID of the YouTube playlist to delete.

**Responses:**

*   **200 OK:** YouTube playlist deleted successfully.
    ```json
    {
      "success": true,
      "message": "YouTube Playlist deleted successfully."
    }
    ```
*   **404 Not Found:** YouTube playlist with the given ID does not exist.
    ```json
    {
      "success": false,
      "message": "YouTube Playlist not found."
    }
    ```
*   **500 Internal Server Error:** An unexpected error occurred (e.g., foreign key constraint if other tables reference this playlist and the DB enforces it).
    ```json
    {
      "success": false,
      "message": "Failed to delete YouTube Playlist." 
    }
    ```
---

