export const tsrStartManifest = () =>
  (globalThis as any).__TSR_START_MANIFEST__ ?? { routes: {} };
