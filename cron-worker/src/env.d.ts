export interface Env {
	// If you set another name in wrangler.toml as the value for 'database_id',
	// replace this list with the variable name you chose.
	DB: D1Database;

	// Variables for YouTube Uploads
	YOUTUBE_UPLOAD_CALLBACK_URL: string;
	PODCAST_PROJECTS_BUCKET: string;
	THUMBNAIL_BUCKET: string;

	// For Video Service API Key
	VIDEO_SERVICE_API_KEY: string;

	// General Environment Setting
	ENVIRONMENT: 'development' | 'production';

	// If you set another name in wrangler.toml as the value for 'binding',
	// replace this list with the variable name you chose.
	// MY_BUCKET: R2Bucket;

	// Example binding to KV. Learn more at https://developers.cloudflare.com/workers/runtime-apis/kv/
	// MY_KV_NAMESPACE: KVNamespace;

	// Example binding to Durable Object. Learn more at https://developers.cloudflare.com/workers/runtime-apis/durable-objects/
	// MY_DURABLE_OBJECT: DurableObjectNamespace;

	// Example binding to a Service. Learn more at https://developers.cloudflare.com/workers/runtime-apis/service-bindings/
	// MY_SERVICE: Fetcher;

	// Example binding to a Queue. Learn more at https://developers.cloudflare.com/queues/javascript-apis/
	// MY_QUEUE: Queue;
}
