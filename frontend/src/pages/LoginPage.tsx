import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import type { SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { loginUser } from '../services/authService';
import type { LoginPayload } from '../services/authService';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Truck, AlertCircle, Mail, Lock, LogIn } from 'lucide-react';

// 1. Definicija Zod sheme za validaciju
const loginSchema = z.object({
  email: z.string().email({ message: "Molimo unesite valjanu email adresu." }),
  password: z.string().min(6, { message: "Lozinka mora imati najmanje 6 znakova." }),
});

// TypeScript tip izveden iz Zod sheme
type LoginFormInputs = z.infer<typeof loginSchema>;

const LoginPage: React.FC = () => {
  const [loginError, setLoginError] = useState<string | null>(null);
  const { login } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormInputs>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit: SubmitHandler<LoginFormInputs> = async (data: LoginPayload) => {
    setLoginError(null);
    try {
      const response = await loginUser(data);
      
      // Save auth state using the context
      login(response);
      
      // Redirect to dashboard
      navigate('/dashboard');
    } catch (error: any) {
      console.error("Greška prilikom prijave:", error);
      const errorMessage = error.message || "Došlo je do neočekivane greške.";
      setLoginError(errorMessage);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left side - Image and branding */}
      <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-indigo-800 to-indigo-900 text-white p-10 flex-col justify-between">
        <div>
          <div className="flex items-center mb-8">
            <div className="bg-white rounded-lg p-2 mr-3">
              <Truck size={24} className="text-indigo-600" />
            </div>
            <h1 className="text-2xl font-bold">Data Avioservis</h1>
          </div>
          
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Aplikacija za evidenciju stanja vozila</h2>
          <p className="text-indigo-200 mb-8 text-lg">
            Jednostavno i učinkovito pratite status vaših vozila i opreme, planirajte servise i održavajte evidenciju.
          </p>
          
          <img 
            src="/dataavioservis.jpg" 
            alt="Data Avioservis" 
            className="rounded-[15px] w-full mb-8 shadow-lg" 
          />
        </div>
        
        <div className="space-y-6">
          <div className="flex items-start">
            <div className="bg-indigo-700 rounded-full p-2 mr-4">
              <svg className="w-5 h-5 text-indigo-200" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-lg">Potpuni pregled voznog parka</h3>
              <p className="text-indigo-200 text-sm">U svakom trenutku znate status svih vozila</p>
            </div>
          </div>
          
          <div className="flex items-start">
            <div className="bg-indigo-700 rounded-full p-2 mr-4">
              <svg className="w-5 h-5 text-indigo-200" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-lg">Upravljanje servisima</h3>
              <p className="text-indigo-200 text-sm">Pratite sve servise i održavanja</p>
            </div>
          </div>
          
          <div className="flex items-start">
            <div className="bg-indigo-700 rounded-full p-2 mr-4">
              <svg className="w-5 h-5 text-indigo-200" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-lg">Izvještaji i analitika</h3>
              <p className="text-indigo-200 text-sm">Dobijte detaljne uvide u performanse vozila</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Right side - Login form */}
      <div className="w-full md:w-1/2 bg-gray-50 p-6 md:p-10 flex items-center justify-center">
        <div className="w-full max-w-md">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Dobrodošli natrag</h2>
            <p className="text-gray-600">Prijavite se za nastavak rada</p>
          </div>
          
          {loginError && (
            <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-md flex items-start">
              <AlertCircle size={20} className="text-red-500 mr-3 mt-0.5 flex-shrink-0" />
              <span className="text-red-800">{loginError}</span>
            </div>
          )}
          
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)} noValidate>
            <div className="form-group">
              <label htmlFor="email" className="form-label">
                Email adresa
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail size={18} className="text-gray-400" />
                </div>
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  required
                  disabled={isSubmitting}
                  {...register("email")}
                  className={`form-input pl-10 ${errors.email ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}`}
                  placeholder="vasa.adresa@email.com"
                />
              </div>
              {errors.email && (
                <p className="form-error">{errors.email.message}</p>
              )}
            </div>
            
            <div className="form-group">
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="form-label">
                  Lozinka
                </label>
                <a href="#" className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
                  Zaboravili ste lozinku?
                </a>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock size={18} className="text-gray-400" />
                </div>
                <input
                  id="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  disabled={isSubmitting}
                  {...register("password")}
                  className={`form-input pl-10 ${errors.password ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}`}
                  placeholder="••••••••"
                />
              </div>
              {errors.password && (
                <p className="form-error">{errors.password.message}</p>
              )}
            </div>

            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                Zapamti me
              </label>
            </div>

            <div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-primary w-full py-2.5"
              >
                <LogIn size={18} />
                {isSubmitting ? 'Prijava u tijeku...' : 'Prijava'}
              </button>
            </div>
          </form>
          
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Nemate račun? <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500">Kontaktirajte administratora</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage; 