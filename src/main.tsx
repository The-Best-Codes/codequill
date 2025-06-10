import * as Sentry from "@sentry/react";
import { loader } from '@monaco-editor/react';
import React from "react";
import ReactDOM from "react-dom/client";
import "./i18n";

import "./index.css";

import App from "./App";

// Configure the loader to use local assets from the 'public/vs' directory
loader.config({
  paths: {
    vs: '/vs'
  }
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

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
