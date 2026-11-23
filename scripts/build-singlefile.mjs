import { mkdir, readFile, rmdir, unlink, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const output = resolve(root, 'dist/index.html');
let html = await readFile(resolve(root, 'index.html'), 'utf8');

function replaceOnce(source, pattern, replacement, label) {
    const matches = source.match(pattern);
    if (!matches || matches.length !== 1) {
        throw new Error(`Expected exactly one ${label} reference; found ${matches?.length ?? 0}`);
    }
    return source.replace(pattern, () => replacement);
}

function replaceExact(source, text, replacement, label) {
    const first = source.indexOf(text);
    if (first === -1 || source.indexOf(text, first + text.length) !== -1) {
        const count = first === -1 ? 0 : 2;
        throw new Error(`Expected exactly one ${label} reference; found at least ${count}`);
    }
    return source.replace(text, () => replacement);
}

function inlineScript(source) {
    return `<script>${source.replace(/<\/script/gi, '<\\/script')}</script>`;
}

async function sourceFile(path) {
    return readFile(resolve(root, path), 'utf8');
}

for (const name of ['shell', 'skins']) {
    const css = await sourceFile(`src/${name}.css`);
    const tag = `<link rel="stylesheet" href="./src/${name}.css">`;
    html = replaceExact(html, tag, `<style>${css.replace(/<\/style/gi, '<\\/style')}</style>`, `${name}.css`);
}

const tailCss = await sourceFile('src/tail.css');
const tailData = `data:text/css;charset=utf-8;base64,${Buffer.from(tailCss).toString('base64')}`;
html = replaceOnce(
    html,
    /<link rel="stylesheet" href="\.\/src\/tail\.css">/,
    `<link rel="stylesheet" href="${tailData}">`,
    'tail.css'
);

for (const name of ['acorn', 'libcurl', 'app']) {
    const js = await sourceFile(`src/${name}.js`);
    const tag = `<script src="./src/${name}.js"></script>`;
    html = replaceExact(html, tag, inlineScript(js), `${name}.js`);
}

const rewriterPath = resolve(root, 'dist/rewriter/regust-rewriter.iife.js');
const rewriter = await readFile(rewriterPath, 'utf8');
await unlink(rewriterPath);
await rmdir(dirname(rewriterPath));
html = replaceOnce(
    html,
    /<script type="module" src="\.\/src\/regust-rewriter\.js"[\s\S]*?><\/script>/,
    inlineScript(rewriter),
    'Scramjet rewriter'
);

if (html.includes('\0')) {
    throw new Error('The single-file HTML source still contains raw NUL bytes');
}
const remainingAssetReference = html.match(/(?:src|href)=["']\.\/src\/(?:acorn|libcurl|app|shell|skins|tail|regust-rewriter)\.(?:js|css)/);
if (remainingAssetReference) {
    throw new Error(`The output still references an external GUST source asset: ${remainingAssetReference[0]}`);
}

await mkdir(dirname(output), { recursive: true });
await writeFile(output, html);
console.log(`Built standalone reGUST browser: ${output}`);
