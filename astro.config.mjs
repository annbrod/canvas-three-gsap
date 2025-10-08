import { defineConfig } from "astro/config";

export default defineConfig({
    build: {
        format: 'file'
    },
    vite: {
        build: {
            rollupOptions: {
                output: {
                  entryFileNames: '_astro/entry.js',
                  chunkFileNames: '_astro/chunks/chunk.[name].js',
                  assetFileNames: '_astro/assets/asset.[name][extname]',
                },
            },
        },
    },
});
