---
trigger: always_on
---

About this project:

- Is a admin dashboard for a website of podcasts organized in categories.
- Has CRUD operations for users, categories and podcasts.
- Is protected with user athentication and a RBAC system.

About Astro usage:

- Always use Astro 5.7 or above.
- For Astro code always follow the more updated official Astro docs.
- Always use Astro Actions, never Astro Endpoints unless explicitly specified
- Store all Astro Actions inside the src/actions/ directory

About TypeScript usage:

- Always use pnpm as package manager
- Always check that new npm dependencies to be installed are not deprecated
- You can see [package.json](mdc:package.json) for packages already installed

About Cloudflare usage:

- Always use Cloudflare's native way to code and avoid using third-party packages unless absolutely necessary

About Tailwind usage:

- Always use Tailwind 4.1 or above for styling.
- Always create new pages and components with a @index.astro page similar style.
- For Tailwind CSS code always follow the more updated official Tailwind CSS docs.


About technologies in general:

- This project doploys to Cloudflare Pages and use Cloudflare Workers integrated with Pages, Cloudflare D1 and Cloudflare R2 to store the podcasts files such as Podcast audio file, Podcast video file and Podcast Thumbnails.
- The code is hosted in a GitHub repository.
- Uses GitHub Action to deploy Cloudflare D1 migrations.
- Doesn't need GitHub Action to deploy static content to Cloudflare Pages.