import Home from "@/routes/home";
import Settings from "@/routes/settings";
import { AnimatePresence, motion } from "motion/react";
import { ThemeProvider } from "next-themes";
import {
  Route,
  BrowserRouter as Router,
  Routes,
  useLocation,
} from "react-router-dom";
import { Toaster } from "sonner";

function App() {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem={true}
      storageKey="vite-react-theme"
    >
      <Router>
        <AppContent />
      </Router>
    </ThemeProvider>
  );
}

function AppContent() {
  const location = useLocation();

  const pageVariants = {
    initial: { opacity: 0, filter: "blur(10px)" },
    in: {
      opacity: 1,
      filter: "blur(0px)",
      transition: { duration: 0.15, ease: "easeInOut" },
    },
    out: {
      opacity: 0,
      filter: "blur(10px)",
      transition: { duration: 0.15, ease: "easeInOut" },
    },
  };

  const AnimatedRoute = ({ children }: { children: React.ReactNode }) => (
    <motion.div
      className="absolute top-0 left-0 w-full h-full"
      variants={pageVariants}
      initial="initial"
      animate="in"
      exit="out"
    >
      {children}
    </motion.div>
  );

  return (
    <>
      <Toaster richColors />
      <AnimatePresence mode="wait" initial={false}>
        <Routes location={location} key={location.pathname}>
          <Route
            path="/"
            element={
              <AnimatedRoute>
                <Home />
              </AnimatedRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <AnimatedRoute>
                <Settings />
              </AnimatedRoute>
            }
          />
        </Routes>
      </AnimatePresence>
    </>
  );
}

export default App;
