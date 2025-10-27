import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './components/AuthProvider';
import LandingPage from './components/LandingPage';
import AuthPage from './components/AuthPage';
import Dashboard from './components/Dashboard';
import TicketManagement from './components/TicketManagement';

// Main App Component with Routing Logic
function AppContent() {
  const [currentPage, setCurrentPage] = useState('landing');
  const { user, loading } = useAuth();

  // Handle authentication-based redirects
  useEffect(() => {
    if (!loading) {
      // If user is logged in and on landing page, redirect to dashboard
      if (user && currentPage === 'landing') {
        setCurrentPage('dashboard');
      } 
      // If user is not logged in and trying to access protected pages
      else if (!user && ['dashboard', 'tickets'].includes(currentPage)) {
        setCurrentPage('login');
      }
    }
  }, [user, loading, currentPage]);

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-xl text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Render appropriate page based on current route
  const renderPage = () => {
    switch(currentPage) {
      case 'landing':
        return <LandingPage onNavigate={setCurrentPage} />;
      
      case 'login':
        return <AuthPage mode="login" onNavigate={setCurrentPage} />;
      
      case 'signup':
        return <AuthPage mode="signup" onNavigate={setCurrentPage} />;
      
      case 'dashboard':
        // Protected route: redirect to login if not authenticated
        return user ? (
          <Dashboard onNavigate={setCurrentPage} />
        ) : (
          <AuthPage mode="login" onNavigate={setCurrentPage} />
        );
      
      case 'tickets':
        // Protected route: redirect to login if not authenticated
        return user ? (
          <TicketManagement onNavigate={setCurrentPage} />
        ) : (
          <AuthPage mode="login" onNavigate={setCurrentPage} />
        );
      
      default:
        return <LandingPage onNavigate={setCurrentPage} />;
    }
  };

  return renderPage();
}

// Main App Wrapper with AuthProvider
function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;