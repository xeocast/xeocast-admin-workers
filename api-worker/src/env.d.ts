/// <reference types="astro/client" />

import type { D1Database, R2Bucket } from '@cloudflare/workers-types';

// Remove the separate Runtime type alias if no longer needed elsewhere
// type Runtime = import("@astrojs/cloudflare").Runtime<CloudflareEnv>; 

// Define the shape of your Cloudflare bindings
interface CloudflareEnv {
	// D1 Database
	DB: D1Database;
	// R2 Buckets
	PODCAST_PROJECTS_BUCKET: R2Bucket; // For episode projects
	// Add other bindings like KV namespaces, etc.
	// MY_KV_NAMESPACE: KVNamespace;
}

// Define the shape of your User object (adjust based on your user schema)
interface UserSessionData {
	id: number;
	email: string;
	name: string; // Ensure name exists or make optional if needed
	role: string;
}

// Get the base Runtime type, potentially omitting 'env' if it exists but is wrongly typed
type BaseRuntime = import("@astrojs/cloudflare").Runtime<CloudflareEnv>;

// Import the actions type
import type { Actions } from 'astro:actions';

declare namespace App {
	// Define Locals explicitly
	interface Locals {
		// Define runtime property with an explicitly typed env field
		runtime: import("@astrojs/cloudflare").Runtime<CloudflareEnv>;
		user?: UserSessionData; // Keep our custom user property
		actions: Actions; // Use the imported Actions type, make non-optional
	}
} 