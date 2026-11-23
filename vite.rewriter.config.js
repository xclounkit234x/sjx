import { defineConfig } from 'vite';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('.', import.meta.url));

export default defineConfig({
    root,
    base: './',
    build: {
        target: 'es2022',
        assetsInlineLimit: 10_000_000,
        lib: {
            entry: `${root}src/regust-rewriter.js`,
            name: 'regustRewriter',
            formats: ['iife'],
            fileName: 'regust-rewriter'
        },
        outDir: `${root}dist/rewriter`,
        emptyOutDir: true
    }
});
