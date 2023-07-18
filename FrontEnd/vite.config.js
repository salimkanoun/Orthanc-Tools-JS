import svgr from 'vite-plugin-svgr'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import eslint from 'vite-plugin-eslint'

export default defineConfig({
    assetsInclude: ['**/*.md'],
    plugins: [
        svgr(),
        react(),
        //eslint(),
    ],
    server: {
        proxy: {
            '/api': {
                target: 'http://localhost:4000',
                changeOrigin: false
            }
        }
    },
    build: {
        sourcemap: true,
        target: 'es2018'
    }
})