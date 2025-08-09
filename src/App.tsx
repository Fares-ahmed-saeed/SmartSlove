
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CalculatorPage } from "./pages/CalculatorPage";
import { ProgrammerCalculator } from "./pages/ProgrammerCalculator";
import { UnitConverter } from "./pages/UnitConverter";
import { GraphingCalculator } from "./pages/GraphingCalculator";
import { SettingsPage } from "./pages/SettingsPage";
import { AICalculator } from "./pages/AICalculator";
import { CurrencyConverter } from "./pages/CurrencyConverter";
import { InvestmentCalculator } from "./pages/InvestmentCalculator";
import { BottomNav } from "./components/Navigation/BottomNav";
import { SettingsProvider } from "./components/SettingsProvider";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <SettingsProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <div className="relative">
            <Routes>
              <Route path="/" element={<CalculatorPage />} />
              <Route path="/programmer" element={<ProgrammerCalculator />} />
              <Route path="/converter" element={<UnitConverter />} />
              <Route path="/graphing" element={<GraphingCalculator />} />
              <Route path="/settings" element={<SettingsPage />} />
              <Route path="/ai" element={<AICalculator />} />
              <Route path="/currency" element={<CurrencyConverter />} />
              <Route path="/investment" element={<InvestmentCalculator />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
            <BottomNav />
          </div>
        </BrowserRouter>
      </TooltipProvider>
    </SettingsProvider>
  </QueryClientProvider>
);

export default App;
