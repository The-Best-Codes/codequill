import { ThemeProvider } from "next-themes";
import { lazy, Suspense } from "react";
import { BrowserRouter as Router } from "react-router-dom";

const SuspenseLoader = () => (
  <div className="w-screen h-screen flex justify-center items-center bg-accent">
    <img
      src="/icon.svg"
      alt="CodeQuill App Icon"
      className="w-full h-full max-w-40 max-h-40 animate-bounce"
    />
  </div>
);

const LazyAppContent = lazy(() => import("./AppContent"));

function App() {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem={true}
      themes={["light", "dark", "dim", "system"]}
      storageKey="vite-react-theme"
    >
      <Router>
        <Suspense fallback={<SuspenseLoader />}>
          <LazyAppContent />
        </Suspense>
      </Router>
    </ThemeProvider>
  );
}

export default App;
