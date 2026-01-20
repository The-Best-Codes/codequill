import { sentryVitePlugin } from "@sentry/vite-plugin";
import react from "@vitejs/plugin-react";
import path from "path";
import { visualizer } from "rollup-plugin-visualizer";
import { defineConfig, normalizePath } from "vite";
import { viteStaticCopy } from "vite-plugin-static-copy";

const host = process.env.TAURI_DEV_HOST;

const vendorManualChunks = {
  react: ["react", "react-dom", "react-dom/client"],
  reactRouter: ["react-router"],
  radixUi: [
    "@radix-ui/react-accordion",
    "@radix-ui/react-context-menu",
    "@radix-ui/react-dialog",
    "@radix-ui/react-dropdown-menu",
    "@radix-ui/react-label",
    "@radix-ui/react-popover",
    "@radix-ui/react-radio-group",
    "@radix-ui/react-scroll-area",
    "@radix-ui/react-separator",
    "@radix-ui/react-slot",
    "@radix-ui/react-tooltip",
  ],
  miscUi: ["vaul", "tailwind-merge"],
};

export default defineConfig(async () => ({
  plugins: [
    react({
      babel: {
        plugins: [["babel-plugin-react-compiler", { target: "19" }]],
      },
    }),
    sentryVitePlugin({
      authToken: process.env.SENTRY_AUTH_TOKEN,
      org: "bestcodes-official",
      project: "codequill-react",
      telemetry: false,
    }),
    viteStaticCopy({
      targets: [
        {
          src: normalizePath(
            path.resolve(__dirname, "node_modules/monaco-editor/min/vs"),
          ),
          dest: ".",
        },
      ],
    }),
    visualizer({
      open: false,
      emitFile: false,
      filename: "dist/stats.html",
    }),
  ],

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },

  clearScreen: false,
  server: {
    port: 1420,
    strictPort: true,
    host: host || false,
    hmr: host
      ? {
          protocol: "ws",
          host,
          port: 1421,
        }
      : undefined,
    watch: {
      ignored: ["**/src-tauri/**"],
    },
  },

  build: {
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks(id: string) {
          // Normalize to POSIX-style paths so checks work on Windows too
          const normalizedId = id.replace(/\\/g, "/");

          if (normalizedId.includes("/node_modules/")) {
            for (const [chunkName, packages] of Object.entries(
              vendorManualChunks,
            )) {
              if (
                packages.some((pkg) =>
                  normalizedId.includes(`/node_modules/${pkg}/`),
                )
              ) {
                return chunkName;
              }
            }
          }
        },
      },
    },
  },
}));
