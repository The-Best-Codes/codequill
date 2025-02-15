import Home from "@/routes/home";
import Settings from "@/routes/settings";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { Toaster } from "sonner";

function App() {
  return (
    <Router>
      <Toaster richColors />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </Router>
  );
}

export default App;
