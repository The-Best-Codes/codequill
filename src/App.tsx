import { SidebarProvider } from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/sonner";
import Home from "@/routes/home";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";

function App() {
  return (
    <Router>
      <SidebarProvider className="w-full">
        <Toaster />
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
      </SidebarProvider>
    </Router>
  );
}

export default App;
