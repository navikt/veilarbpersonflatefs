import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { sentryVitePlugin } from '@sentry/vite-plugin';

export default defineConfig({
	// config options,
	plugins: [
		react(),
		sentryVitePlugin({
			org: 'nav',
			project: 'veilarbpersonflate',
			url: 'https://sentry.gc.nav.no',
			// Auth tokens can be obtained from https://sentry.io/orgredirect/organizations/:orgslug/settings/auth-tokens/
			authToken: process.env.SENTRY_AUTH_TOKEN
		})
	],
	build: {
		outDir: 'build',
		sourcemap: true
	},
	server: {
		port: 3000
	}
});
