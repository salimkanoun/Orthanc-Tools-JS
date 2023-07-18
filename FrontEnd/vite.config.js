import svgr from 'vite-plugin-svgr'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { nodePolyfills } from 'vite-plugin-node-polyfills'

export default defineConfig({
    assetsInclude: ['**/*.md'],
    plugins: [
        svgr(),
        react(),
        //eslint(),
        nodePolyfills({
            // To exclude specific polyfills, add them to this list.
            exclude: [
              'fs', // Excludes the polyfill for `fs` and `node:fs`.
            ],
            // Whether to polyfill specific globals.
            globals: {
              Buffer: true, // can also be 'build', 'dev', or false
              global: true,
              process: true,
            },
            // Whether to polyfill `node:` protocol imports.
            protocolImports: true,
          }),
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