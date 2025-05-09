import { StrictMode, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { AuthProvider } from './contexts/AuthContext'
import { ApiErrorProvider, useApiErrors } from './contexts/ApiErrorContext'
import { setApiErrorHandler } from './config/api'

// Wrapper component to connect the API client with the ApiErrorContext
const ApiErrorConnector: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { addError } = useApiErrors();

  useEffect(() => {
    // Set the error handler function
    setApiErrorHandler(addError);
  }, [addError]);

  return <>{children}</>;
};

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ApiErrorProvider>
      <ApiErrorConnector>
        <AuthProvider>
          <App />
        </AuthProvider>
      </ApiErrorConnector>
    </ApiErrorProvider>
  </StrictMode>,
)
