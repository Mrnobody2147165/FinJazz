import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import ErrorBoundary from './components/ErrorBoundary.jsx';
import { ThemeProvider } from '@/providers';
import { isFirebaseConfigured, initError } from '@/firebase/config';
import './index.css';

const FirebaseConfigError = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
    <div className="max-w-lg text-center space-y-4">
      <h1 className="text-2xl font-bold text-gray-900">Configuration Required</h1>
      <p className="text-gray-600">
        Firebase is not configured. Add your Firebase credentials to a <code>.env</code> file
        with <code>VITE_FIREBASE_API_KEY</code> and <code>VITE_FIREBASE_PROJECT_ID</code>.
      </p>
      {initError && (
        <p className="text-sm text-red-600">{initError.message}</p>
      )}
    </div>
  </div>
);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
      {isFirebaseConfigured && !initError ? (
        <ThemeProvider>
          <App />
        </ThemeProvider>
      ) : (
        <FirebaseConfigError />
      )}
    </ErrorBoundary>
  </StrictMode>
);
