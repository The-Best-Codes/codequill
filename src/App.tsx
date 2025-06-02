import Home from "@/routes/home";
import Settings from "@/routes/settings";
import { ThemeProvider } from "next-themes";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { Toaster } from "sonner";

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
        <AppContent />
      </Router>
    </ThemeProvider>
  );
}

function AppContent() {
  return (
    <>
      <Toaster richColors />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </>
  );
}

export default App;
