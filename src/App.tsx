import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CompanyProvider } from "@/contexts/CompanyContext";
import { NotificationProvider } from "@/contexts/NotificationContext";
import { TicketProvider } from "@/contexts/TicketContext";
import { AppLayout } from "@/components/layout/AppLayout";
import Dashboard from "@/pages/Dashboard";
import Companies from "@/pages/Companies";
import Upload from "@/pages/Upload";
import Processing from "@/pages/Processing";
import Downloads from "@/pages/Downloads";
import Settings from "@/pages/Settings";
import Tickets from "@/pages/Tickets";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <CompanyProvider>
      <NotificationProvider>
        <TicketProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route element={<AppLayout />}>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/empresas" element={<Companies />} />
                  <Route path="/upload" element={<Upload />} />
                  <Route path="/processamento" element={<Processing />} />
                  <Route path="/downloads" element={<Downloads />} />
                  <Route path="/configuracoes" element={<Settings />} />
                  <Route path="/suporte" element={<Tickets />} />
                </Route>
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </TicketProvider>
      </NotificationProvider>
    </CompanyProvider>
  </QueryClientProvider>
);

export default App;
