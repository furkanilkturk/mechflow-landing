import adapter from '@sveltejs/adapter-vercel';
import { sveltekit } from '@sveltejs/kit/vite';
import { paraglideVitePlugin } from '@inlang/paraglide-js';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [
		tailwindcss(),
		// i18n — compiles ./messages/{locale}.json into $lib/paraglide.
		// No URL routing (site is statically prerendered as the base locale);
		// the chosen locale is remembered in localStorage / cookie and applied
		// reactively on the client.
		paraglideVitePlugin({
			project: './project.inlang',
			outdir: './src/lib/paraglide',
			strategy: ['localStorage', 'cookie', 'baseLocale']
		}),
		sveltekit({
			compilerOptions: {
				// Force runes mode for the project, except for libraries. Can be removed in svelte 6.
				runes: ({ filename }) =>
					filename.split(/[/\\]/).includes('node_modules') ? undefined : true
			},

			// Vercel deploy — every route is prerendered (see +layout.ts), so this
			// ships as static prerendered output with no serverless functions.
			adapter: adapter()
		})
	]
});
