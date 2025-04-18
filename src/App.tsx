import React from 'react';
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"

import Index from "./pages/Index";
import Patients from "./pages/Patients";
import Pharmacies from "./pages/Pharmacies";
import Invoices from "./pages/Invoices";
import Products from "./pages/Products";
import Orders from "./pages/Orders";
import Tasks from "./pages/Tasks";
import Tags from "./pages/Tags";
import Discounts from "./pages/Discounts";
import Sessions from "./pages/Sessions";
import Services from "./pages/Services";
import Providers from "./pages/Providers";
import Insurance from "./pages/Insurance";
import Consultations from "./pages/Consultations";
import Dashboard from "./pages/Dashboard";
import Messages from "./pages/Messages";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import AIInsights from "./pages/AIInsights";
import Forms from "./pages/Forms";
import FormBuilder from "./pages/FormBuilder";
import MainLayout from './components/layout/MainLayout';
import PatientDetails from "./pages/PatientDetails";
import PatientDashboard from "./pages/PatientDashboard";
import PatientsDashboard from "./pages/PatientsDashboard";
import Records from "./pages/Records";
import Programs from "./pages/Programs";
import Shop from "./pages/Shop";
import AIDashboard from "./pages/AIDashboard"; // Import the new component
import BoothwynTest from "./pages/AIDashboard/BoothwynTest"; // Import sub-page
import HallandaleTest from "./pages/AIDashboard/HallandaleTest"; // Import sub-page
import ShippingTest from "./pages/AIDashboard/ShippingTest"; // Import sub-page
import SendGridTest from "./pages/AIDashboard/SendGridTest"; // Import sub-page
import PracticeBetterTest from "./pages/AIDashboard/PracticeBetterTest"; // Import sub-page
import GeneralAITest from "./pages/AIDashboard/GeneralAITest"; // Import sub-page


const queryClient = new QueryClient();

function App() {
  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/*" element={
              <MainLayout>
                <Routes>
                  <Route path="/records" element={<Records />} />
                  <Route path="/programs" element={<Programs />} />
                  <Route path="/shop" element={<Shop />} />
                  
                  <Route path="/patients" element={<Patients />} />
                  <Route path="/pharmacies" element={<Pharmacies />} />
                  <Route path="/invoices" element={<Invoices />} />
                  <Route path="/products" element={<Products />} />
                  <Route path="/orders" element={<Orders />} />
                  <Route path="/tasks" element={<Tasks />} />
                  <Route path="/tags" element={<Tags />} />
                  <Route path="/discounts" element={<Discounts />} />
                  <Route path="/sessions" element={<Sessions />} />
                  <Route path="/services" element={<Services />} />
                  <Route path="/providers" element={<Providers />} />
                  <Route path="/insurance" element={<Insurance />} />
                  <Route path="/consultations" element={<Consultations />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/messages" element={<Messages />} />
                  <Route path="/settings" element={<Settings />} />
                  <Route path="/ai-insights" element={<AIInsights />} />
                  <Route path="/forms" element={<Forms />} />
                  <Route path="/forms/builder" element={<FormBuilder />} />
                  <Route path="/patients/:id" element={<PatientDetails />} />
                  <Route path="/patient-dashboard/:id" element={<PatientDashboard />} />
                  <Route path="/patients-dashboard" element={<PatientsDashboard />} />
                  
                  {/* AI Dashboard Routes */}
                  <Route path="/ai-dashboard" element={<AIDashboard />}> {/* Parent route with AIDashboard as element */}
                    {/* Nested routes for sub-pages */}
                    <Route path="boothwyn" element={<BoothwynTest />} />
                    <Route path="hallandale" element={<HallandaleTest />} />
                    <Route path="shipping" element={<ShippingTest />} />
                    <Route path="sendgrid" element={<SendGridTest />} />
                    <Route path="practice-better" element={<PracticeBetterTest />} />
                    <Route path="general-ai" element={<GeneralAITest />} />
                    {/* Add a default route for /ai-dashboard if needed */}
                     <Route index element={<div>Select a test from the sidebar</div>} /> {/* Added a default index route */}
                  </Route>

                  <Route path="*" element={<NotFound />} />
                </Routes>
              </MainLayout>
            } />
          </Routes>
          
          <Toaster />
        </ThemeProvider>
      </QueryClientProvider>
    </BrowserRouter>
  );
}

export default App;
