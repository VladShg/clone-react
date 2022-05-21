import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

const rootDir = resolve(__dirname)

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [react()],
	resolve: {
		alias: [
			{ find: '@store', replacement: resolve(rootDir, './src/store') },
			{ find: '@services', replacement: resolve(rootDir, './src/services') },
			{ find: '@utils', replacement: resolve(rootDir, './src/utils') },
			{ find: '@hooks', replacement: resolve(rootDir, './src/hooks') },
		],
	},
})
