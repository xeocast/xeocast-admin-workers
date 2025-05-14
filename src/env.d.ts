export interface Env {
	// If you set another name in wrangler.toml as the value for 'database_id',
	// replace this list with the variable name you chose.
	DB: D1Database;

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

	// Example binding to a Worker secret. Learn more at https://developers.cloudflare.com/workers/configuration/secrets/
	VIDEO_SERVICE_API_KEY: string;
	ENVIRONMENT: string; // Added to distinguish between prod/dev environments
}
