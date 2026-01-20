import { sentryVitePlugin } from "@sentry/vite-plugin";
import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig, normalizePath } from "vite";
import { analyzer } from "vite-bundle-analyzer";
import { viteStaticCopy } from "vite-plugin-static-copy";

const host = process.env.TAURI_DEV_HOST;
const runBundleAnalyzer = process.env.BUNDLE_ANALYZER_DEBUG === "true";

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
    runBundleAnalyzer &&
      analyzer({
        openAnalyzer: false,
        fileName: "bundle-report.html",
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
  },
}));
