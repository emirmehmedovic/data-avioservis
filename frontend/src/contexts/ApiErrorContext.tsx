import * as React from 'react';
import { X } from 'lucide-react';

interface ApiError {
  id: string;
  message: string;
  statusCode?: number;
  timestamp: Date;
}

interface ApiErrorContextType {
  errors: ApiError[];
  addError: (message: string, statusCode?: number) => void;
  removeError: (id: string) => void;
  clearErrors: () => void;
}

const ApiErrorContext = React.createContext<ApiErrorContextType | undefined>(undefined);

export const useApiErrors = () => {
  const context = React.useContext(ApiErrorContext);
  if (context === undefined) {
    throw new Error('useApiErrors must be used within an ApiErrorProvider');
  }
  return context;
};

export const ApiErrorProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [errors, setErrors] = React.useState<ApiError[]>([]);

  const addError = React.useCallback((message: string, statusCode?: number) => {
    const newError: ApiError = {
      id: Math.random().toString(36).substring(2, 9),
      message,
      statusCode,
      timestamp: new Date(),
    };
    setErrors((prevErrors) => [...prevErrors, newError]);

    // Auto-remove error after 5 seconds
    setTimeout(() => {
      removeError(newError.id);
    }, 5000);
  }, []);

  const removeError = React.useCallback((id: string) => {
    setErrors((prevErrors) => prevErrors.filter((error) => error.id !== id));
  }, []);

  const clearErrors = React.useCallback(() => {
    setErrors([]);
  }, []);

  const value = React.useMemo(
    () => ({
      errors,
      addError,
      removeError,
      clearErrors,
    }),
    [errors, addError, removeError, clearErrors]
  );

  return (
    <ApiErrorContext.Provider value={value}>
      {children}
      {errors.length > 0 && (
        <div className="fixed bottom-0 right-0 p-4 space-y-2 z-50">
          {errors.map((error) => (
            <div
              key={error.id}
              className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded shadow-md flex justify-between items-start max-w-md"
              role="alert"
            >
              <div>
                {error.statusCode && (
                  <div className="font-bold mb-1">
                    Greška {error.statusCode}
                  </div>
                )}
                <p>{error.message}</p>
                <div className="text-xs text-gray-500 mt-1">
                  {error.timestamp.toLocaleTimeString()}
                </div>
              </div>
              <button
                onClick={() => removeError(error.id)}
                className="text-red-500 hover:text-red-700 ml-2"
                aria-label="Zatvori"
              >
                <X size={18} />
              </button>
            </div>
          ))}
        </div>
      )}
    </ApiErrorContext.Provider>
  );
};

export default ApiErrorContext; 