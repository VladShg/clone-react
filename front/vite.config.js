import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import macrosPlugin from 'vite-plugin-babel-macros'
import { resolve } from 'path'

const root = resolve(__dirname)
const components = resolve(__dirname, './src/components/')

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [react(), macrosPlugin()],
	resolve: {
		alias: [
			{ find: '@store', replacement: resolve(root, './src/store') },
			{ find: '@services', replacement: resolve(root, './src/services') },
			{ find: '@utils', replacement: resolve(root, './src/utils') },
			{ find: '@hooks', replacement: resolve(root, './src/hooks') },
			{ find: '@shared', replacement: resolve(components, './shared') },
			{ find: '@pages', replacement: resolve(components, './pages') },
		],
	},
})
