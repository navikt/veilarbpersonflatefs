import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import legacy from '@vitejs/plugin-legacy';

export default defineConfig({
	// config options,
	plugins: [react(), legacy()],
	build: {
		outDir: 'build',
		sourcemap: true
	},
	server: {
		port: 3000
	}
});
