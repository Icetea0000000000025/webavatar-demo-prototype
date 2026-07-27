import { useState, useEffect, useLayoutEffect } from 'react';
import type { ReactNode } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { LanguageProvider } from './lib/LanguageContext';
import { ThemeProvider } from './lib/ThemeContext';
import { MotionConfig } from 'framer-motion';
import AppNavbar from './components/AppNavbar';
import PersistentBackground from './components/PersistentBackground';
import SpaNavListener from './components/SpaNavListener';
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import FlightDemo from './pages/FlightDemo';
import FlightAdmin from './pages/FlightAdmin';
import OrderDemo from './pages/OrderDemo';
import FoodOrderDemo from './pages/FoodOrderDemo';
import OrderAdmin from './pages/OrderAdmin';
import ITStoreDemo from './pages/ITStoreDemo';
import ITStoreAdmin from './pages/ITStoreAdmin';
import NiaSite2026 from './pages/NiaSite2026';
import { pagesConfig } from './config/pages';
import './App.css';

const pageComponents: Record<string, ReactNode> = {
  '/': <Home />,
  '/about': <About />,
  '/contact': <Contact />,
  '/flight-demo': <FlightDemo />,
  '/all-demo': <OrderDemo />,
  '/it-store-demo': <ITStoreDemo />,
  '/nia-site-2026': <NiaSite2026 />,
};

function ScrollToTop() {
  const { pathname } = useLocation();

  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

function App() {
  const [isMobileOrTablet, setIsMobileOrTablet] = useState(false);

  useEffect(() => {
    const checkDevice = () => {
      const mobileOrTablet = window.innerWidth < 1024 || /Mobi|Android|iPhone|iPad|Macintosh/i.test(navigator.userAgent) && 'ontouchend' in document;
      setIsMobileOrTablet(mobileOrTablet);
    };
    checkDevice();
    window.addEventListener('resize', checkDevice);
    return () => window.removeEventListener('resize', checkDevice);
  }, []);

  return (
    <ThemeProvider>
      <LanguageProvider>
        <MotionConfig reducedMotion={isMobileOrTablet ? "always" : "user"}>
          <BrowserRouter>
            <ScrollToTop />
            <div className="app-container">
              <PersistentBackground />
              <AppNavbar />

              <main className="main-content">
                <Routes>
                  {/* Static admin/support routes */}
                  <Route path="/flight-demo/admin" element={<FlightAdmin />} />
                  <Route path="/food-demo" element={<FoodOrderDemo />} />
                  <Route path="/food-demo/admin" element={<OrderAdmin />} />
                  <Route path="/it-store-demo/admin" element={<ITStoreAdmin />} />

                  {/* Dynamic pages based on pagesConfig */}
                  {pagesConfig.map(page => (
                    page.enabled && pageComponents[page.path] ? (
                      <Route key={page.path} path={page.path} element={pageComponents[page.path]} />
                    ) : null
                  ))}
                </Routes>
              </main>

              <SpaNavListener />
            </div>
          </BrowserRouter>
        </MotionConfig>
      </LanguageProvider>
    </ThemeProvider>
  );
}

export default App;
