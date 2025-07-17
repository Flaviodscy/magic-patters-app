import React, { useEffect, useState } from 'react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { MobileMenu } from './components/MobileMenu';
import { BottomDock } from './components/BottomDock';
import { ConnectionStatus } from './components/ConnectionStatus';
import { PWAInstallPrompt } from './components/PWAInstallPrompt';
import { WelcomePage } from './pages/WelcomePage';
import { MeasurementPage } from './pages/MeasurementPage';
import { RecommendationPage } from './pages/RecommendationPage';
import { CatalogPage } from './pages/CatalogPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { SettingsPage } from './pages/SettingsPage';
import { AdminPanel } from './pages/AdminPanel';
import { LoginSignupPage } from './pages/LoginSignupPage';
import { UserProfilePage } from './pages/UserProfilePage';
import { EditProfilePage } from './pages/EditProfilePage';
import { CartPage } from './pages/CartPage';
import { ChatPage } from './pages/ChatPage';
import { PasswordResetPage } from './pages/PasswordResetPage';
import { motion, AnimatePresence } from 'framer-motion';
import { CartProvider } from './contexts/CartContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider } from './contexts/AuthContext';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate, useNavigate } from 'react-router-dom';
const AppContent = () => {
  const [currentPage, setCurrentPage] = useState('welcome');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [measurements, setMeasurements] = useState({
    neckLength: 0,
    neckWidth: 0,
    sleepPosition: 'back'
  });
  const location = useLocation();
  const navigate = useNavigate();
  // Update currentPage based on location
  useEffect(() => {
    if (location.pathname === '/') {
      setCurrentPage('welcome');
    } else if (location.pathname === '/measurement') {
      setCurrentPage('measurement');
    } else if (location.pathname === '/recommendation') {
      setCurrentPage('recommendation');
    } else if (location.pathname === '/catalog') {
      setCurrentPage('catalog');
    } else if (location.pathname === '/profile') {
      setCurrentPage('profile');
    } else if (location.pathname === '/chat') {
      setCurrentPage('chat');
    } else if (location.pathname === '/cart') {
      setCurrentPage('cart');
    }
  }, [location.pathname]);
  const handleMeasurementsSubmit = data => {
    setMeasurements(data);
    setCurrentPage('recommendation');
    navigate('/recommendation');
  };
  const handleNavigate = page => {
    setCurrentPage(page);
    // Map page ID to URL path
    const pathMap = {
      welcome: '/',
      measurement: '/measurement',
      recommendation: '/recommendation',
      catalog: '/catalog',
      profile: '/profile',
      chat: '/chat',
      cart: '/cart',
      login: '/login',
      admin: '/admin',
      settings: '/settings'
    };
    if (pathMap[page]) {
      navigate(pathMap[page]);
    }
  };
  const pageTransition = {
    initial: {
      opacity: 0,
      y: 20
    },
    animate: {
      opacity: 1,
      y: 0
    },
    exit: {
      opacity: 0,
      y: -20
    }
  };
  // Main content that should have header, footer, and bottom dock
  const MainLayout = ({
    children
  }) => <>
      <Header currentPage={currentPage} onNavigate={handleNavigate} onOpenMenu={() => setIsMobileMenuOpen(true)} />
      <MobileMenu isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} onNavigate={handleNavigate} />
      <motion.main initial="initial" animate="animate" exit="exit" variants={pageTransition} transition={{
      duration: 0.3
    }} className="w-full max-w-4xl mx-auto px-4 py-12 sm:py-16 pb-24">
        {children}
      </motion.main>
      <ConnectionStatus />
      <PWAInstallPrompt />
      <BottomDock currentPage={currentPage} onNavigate={handleNavigate} />
      <Footer />
    </>;
  return <div className="min-h-screen bg-gradient-to-b from-blue-50 to-indigo-50 relative">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-50/30 to-indigo-50/30" />
      <div className="relative">
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/login" element={<LoginSignupPage />} />
            <Route path="/reset-password" element={<PasswordResetPage />} />
            <Route path="/profile" element={<UserProfilePage />} />
            <Route path="/edit-profile" element={<EditProfilePage />} />
            <Route path="/" element={<MainLayout>
                  <WelcomePage onGetStarted={() => handleNavigate('measurement')} />
                </MainLayout>} />
            <Route path="/measurement" element={<MainLayout>
                  <MeasurementPage onSubmit={handleMeasurementsSubmit} />
                </MainLayout>} />
            <Route path="/recommendation" element={<MainLayout>
                  <RecommendationPage measurements={measurements} onReset={() => handleNavigate('measurement')} />
                </MainLayout>} />
            <Route path="/catalog" element={<MainLayout>
                  <CatalogPage />
                </MainLayout>} />
            <Route path="/product" element={<MainLayout>
                  <ProductDetailPage onBack={() => handleNavigate('catalog')} />
                </MainLayout>} />
            <Route path="/settings" element={<MainLayout>
                  <SettingsPage />
                </MainLayout>} />
            <Route path="/admin" element={<MainLayout>
                  <AdminPanel />
                </MainLayout>} />
            <Route path="/cart" element={<MainLayout>
                  <CartPage />
                </MainLayout>} />
            <Route path="/chat" element={<MainLayout>
                  <ChatPage />
                </MainLayout>} />
            {/* Redirect any other path to home */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AnimatePresence>
      </div>
    </div>;
};
export function App() {
  return <ThemeProvider>
      <AuthProvider>
        <CartProvider>
          <Router>
            <AppContent />
          </Router>
        </CartProvider>
      </AuthProvider>
    </ThemeProvider>;
}