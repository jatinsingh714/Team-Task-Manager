import { AnimatePresence } from 'framer-motion';
import { Toaster } from 'react-hot-toast';
import { Route, Routes, useLocation } from 'react-router-dom';
import Dashboard from './pages/Dashboard.jsx';
import Home from './pages/Home.jsx';
import Login from './pages/Login.jsx';
import Signup from './pages/Signup.jsx';

function App() {
  const location = useLocation();

  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3500,
          style: {
            borderRadius: '10px',
            border: '1px solid #e2e8f0',
            boxShadow: '0 18px 45px rgba(15, 23, 42, 0.14)',
            color: '#0f172a',
            fontSize: '14px',
            fontWeight: 600
          },
          success: {
            iconTheme: {
              primary: '#059669',
              secondary: '#ecfdf5'
            }
          },
          error: {
            iconTheme: {
              primary: '#e11d48',
              secondary: '#fff1f2'
            }
          }
        }}
      />
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </AnimatePresence>
    </>
  );
}

export default App;
