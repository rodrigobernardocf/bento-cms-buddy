// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - tanstackStart, viteReact, tailwindcss, tsConfigPaths, cloudflare (build-only),
//     componentTagger (dev-only), VITE_* env injection, @ path alias, React/TanStack dedupe,
//     error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... } }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";
import type { Plugin } from "vite";

// Fallback stubs for TanStack Start virtual modules that Wrangler/esbuild can't
// resolve on its own (module names with colons aren't valid bare specifiers for
// esbuild aliases). The Cloudflare Vite plugin runs the worker build through
// Vite's Rollup pipeline, so this resolveId/load pair covers that path.
const tanstackVirtualModulesFallback: Plugin = {
  name: "tanstack-virtual-modules-fallback",
  enforce: "pre",
  resolveId(id) {
    if (id === "tanstack-start-manifest:v") return `\0tanstack-start-manifest-v`;
    if (id === "tanstack-start-injected-head-scripts:v") return `\0tanstack-start-head-scripts-v`;
  },
  load(id) {
    if (id === "\0tanstack-start-manifest-v") {
      return `export const tsrStartManifest = (globalThis).__TSR_START_MANIFEST__ ?? {};`;
    }
    if (id === "\0tanstack-start-head-scripts-v") {
      return `export default undefined;\nexport const tsrHeadScripts = undefined;`;
    }
  },
};

export default defineConfig({
  tanstackStart: {
    server: { entry: "server" },
  },
  nitro: true,
  vite: {
    plugins: [tanstackVirtualModulesFallback],
  },
});
