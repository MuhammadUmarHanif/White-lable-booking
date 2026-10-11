import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { BrandProvider } from './context/BrandContext';
import { AuthProvider } from './context/AuthContext';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';

// Public Pages
import { HomePage } from './pages/public/HomePage';
import { PackagesPage } from './pages/public/PackagesPage';
import { CalculatorPage } from './pages/public/CalculatorPage';
import { BookingRequestPage } from './pages/public/BookingRequestPage';
import { QuotationViewPage } from './pages/public/QuotationViewPage';
import { GalleryPage } from './pages/public/GalleryPage';
import { ContactPage } from './pages/public/ContactPage';
import { NotFoundPage } from './pages/public/NotFoundPage';

// Admin Pages
import { AdminLoginPage } from './pages/admin/AdminLoginPage';
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage';
import { AdminBookingsPage } from './pages/admin/AdminBookingsPage';
import { AdminBookingDetailPage } from './pages/admin/AdminBookingDetailPage';
import { AdminCalendarPage } from './pages/admin/AdminCalendarPage';
import { AdminVenuesPage } from './pages/admin/AdminVenuesPage';
import { AdminMenuPage } from './pages/admin/AdminMenuPage';
import { AdminDecorationPage } from './pages/admin/AdminDecorationPage';
import { AdminPricingSettingsPage } from './pages/admin/AdminPricingSettingsPage';
import { AdminCustomizationPage } from './pages/admin/AdminCustomizationPage';
import { AdminSettingsPage } from './pages/admin/AdminSettingsPage';

// Scroll to top or anchor hash on route navigation
const ScrollToTop = () => {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (hash) {
      setTimeout(() => {
        const element = document.querySelector(hash);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } else {
      window.scrollTo(0, 0);
    }
  }, [pathname, hash]);
  return null;
};

// Layout switcher based on route
const AppRoutes = () => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');
  const isQuotationPrintRoute = location.pathname.startsWith('/quotation');

  return (
    <div className="flex flex-col min-h-screen">
      <ScrollToTop />
      {/* Show public navbar unless inside admin portal */}
      {!isAdminRoute && !isQuotationPrintRoute && <Navbar />}

      <div className="flex-1">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/packages" element={<PackagesPage />} />
          <Route path="/calculator" element={<CalculatorPage />} />
          <Route path="/booking-request" element={<BookingRequestPage />} />
          <Route path="/quotation/:id" element={<QuotationViewPage />} />
          <Route path="/gallery" element={<GalleryPage />} />
          <Route path="/contact" element={<ContactPage />} />

          {/* Admin Routes */}
          <Route path="/admin/login" element={<AdminLoginPage />} />
          <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
          <Route path="/admin/bookings" element={<AdminBookingsPage />} />
          <Route path="/admin/bookings/:id" element={<AdminBookingDetailPage />} />
          <Route path="/admin/calendar" element={<AdminCalendarPage />} />
          <Route path="/admin/venues" element={<AdminVenuesPage />} />
          <Route path="/admin/menus" element={<AdminMenuPage />} />
          <Route path="/admin/decor" element={<AdminDecorationPage />} />
          <Route path="/admin/pricing" element={<AdminPricingSettingsPage />} />
          <Route path="/admin/customization" element={<AdminCustomizationPage />} />
          <Route path="/admin/settings" element={<AdminSettingsPage />} />

          {/* Catch-all 404 */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </div>

      {/* Show public footer unless inside admin portal */}
      {!isAdminRoute && !isQuotationPrintRoute && <Footer />}
    </div>
  );
};

export function App() {
  return (
    <BrandProvider>
      <AuthProvider>
        <Router>
          <AppRoutes />
        </Router>
      </AuthProvider>
    </BrandProvider>
  );
}

export default App;
