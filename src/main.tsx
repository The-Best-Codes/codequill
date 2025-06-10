import { loader } from "@monaco-editor/react";
import * as Sentry from "@sentry/react";
import React from "react";
import ReactDOM from "react-dom/client";
import "./i18n";

import App from "./App";

// Import Monaco Editor workers using Vite's worker syntax
import editorWorker from "monaco-editor/esm/vs/editor/editor.worker?worker";
import cssWorker from "monaco-editor/esm/vs/language/css/css.worker?worker";
import htmlWorker from "monaco-editor/esm/vs/language/html/html.worker?worker";
import jsonWorker from "monaco-editor/esm/vs/language/json/json.worker?worker";
import tsWorker from "monaco-editor/esm/vs/language/typescript/ts.worker?worker";

import "./index.css";

loader.config({
  paths: {
    vs: "/vs",
  },
});

try {
  Sentry.init({
    dsn: "https://cffe540e38313f6e71bcca722906b654@o4508483919609856.ingest.us.sentry.io/4508854105210880",
    integrations: [
      Sentry.browserTracingIntegration(),
      Sentry.replayIntegration(),
    ],
    tracesSampleRate: 1.0,
    tracePropagationTargets: ["localhost"],
    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 1.0,
  });
} catch (error) {
  console.error("Error initializing Sentry:", error);
}

// Configure Monaco Editor web workers for Tauri environment
window.MonacoEnvironment = {
  getWorker(_: any, label: string) {
    if (label === "json") {
      return new jsonWorker();
    }
    if (label === "css" || label === "scss" || label === "less") {
      return new cssWorker();
    }
    if (label === "html" || label === "handlebars" || label === "razor") {
      return new htmlWorker();
    }
    if (label === "typescript" || label === "javascript") {
      return new tsWorker();
    }
    return new editorWorker();
  },
};

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
