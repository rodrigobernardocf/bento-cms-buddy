// Patches @tanstack/start-server-core/router-manifest.js after npm/bun install.
// The module IDs "tanstack-start-manifest:v" and "tanstack-start-injected-head-scripts:v"
// contain colons, which esbuild cannot resolve as bare specifiers or via wrangler aliases.
// This script replaces those strings with relative paths to local stub files.
const fs = require('fs');
const path = require('path');

const cwd = process.cwd();

const targetFile = path.join(cwd, 'node_modules/@tanstack/start-server-core/dist/esm/router-manifest.js');

if (!fs.existsSync(targetFile)) {
  console.log('[patch-tanstack] File not found, skipping:', targetFile);
  process.exit(0);
}

const targetDir = path.dirname(targetFile);
const rel = (stub) => './' + path.relative(targetDir, path.join(cwd, stub)).replace(/\\/g, '/');

const manifestPath = rel('src/stubs/tanstack-start-manifest.js');
const headScriptsPath = rel('src/stubs/tanstack-start-head-scripts.js');

let content = fs.readFileSync(targetFile, 'utf-8');
const original = content;

content = content.replace(/["']tanstack-start-manifest:v["']/g, JSON.stringify(manifestPath));
content = content.replace(/["']tanstack-start-injected-head-scripts:v["']/g, JSON.stringify(headScriptsPath));

if (content === original) {
  console.log('[patch-tanstack] Already patched or pattern not found.');
} else {
  fs.writeFileSync(targetFile, content);
  console.log('[patch-tanstack] Patched router-manifest.js ✓');
}
