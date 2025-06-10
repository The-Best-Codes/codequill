import Home from "@/routes/home";
import Settings from "@/routes/settings";
import { Route, Routes } from "react-router-dom";
import { Toaster } from "sonner";

export default function AppContent() {
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
