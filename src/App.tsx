import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import HeroPage from "./pages/HeroPage";
import Dashboard from "./pages/Dashboard";
import Logs from "./pages/Logs";
import NotFound from "./pages/NotFound";

import ProtectedRoute from "@/components/ProtectedRoute";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />

      <BrowserRouter>
        <Routes>

          {/* Public route */}
          <Route path="/" element={<HeroPage />} />

          {/* Dashboard (Protected) */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                {(user) => <Dashboard user={user} />}
              </ProtectedRoute>
            }
          />

          {/* Email Logs (Protected) */}
          <Route
            path="/logs"
            element={
              <ProtectedRoute>
                {(user) => <Logs user={user} />}
              </ProtectedRoute>
            }
          />

          {/* Catch-all */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>

    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
