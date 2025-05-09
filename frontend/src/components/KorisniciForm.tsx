import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X } from 'lucide-react';
import { UserRole } from '../services/userService';
import type { User } from '../services/userService';

// Schema za validaciju forme
const schema = z.object({
  username: z.string()
    .min(3, "Korisničko ime mora sadržavati najmanje 3 znaka")
    .max(50, "Korisničko ime ne smije prelaziti 50 znakova"),
  email: z.string()
    .email("Unesite valjanu email adresu")
    .max(100, "Email ne smije prelaziti 100 znakova"),
  password: z.string()
    .min(6, "Lozinka mora sadržavati najmanje 6 znakova")
    .max(100, "Lozinka ne smije prelaziti 100 znakova")
    .optional()
    .or(z.literal('')),
  role: z.nativeEnum(UserRole, {
    errorMap: () => ({ message: "Odaberite važeću ulogu korisnika" }),
  }),
});

// Definiramo posebnu schemu za kreiranje korisnika koja zahtijeva password
const createSchema = schema.extend({
  password: z.string()
    .min(6, "Lozinka mora sadržavati najmanje 6 znakova")
    .max(100, "Lozinka ne smije prelaziti 100 znakova"),
});

type FormValues = z.infer<typeof schema>;

interface KorisniciFormProps {
  isOpen: boolean;
  initialData: User | null;
  onSubmit: (data: FormValues) => Promise<void>;
  onCancel: () => void;
}

const KorisniciForm: React.FC<KorisniciFormProps> = ({
  isOpen,
  initialData,
  onSubmit,
  onCancel
}) => {
  // Koristimo različite scheme za validaciju ovisno o tome je li riječ o novom korisniku ili izmjeni
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }
  } = useForm<FormValues>({
    resolver: zodResolver(initialData ? schema : createSchema),
    defaultValues: {
      username: '',
      email: '',
      password: '',
      role: UserRole.PREGLEDNIK
    }
  });

  // Reset forme kada se promijeni initialData ili kada se forma otvori/zatvori
  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        reset({
          username: initialData.username,
          email: initialData.email,
          password: '',  // Ne prikazujemo lozinku
          role: initialData.role
        });
      } else {
        reset({
          username: '',
          email: '',
          password: '',
          role: UserRole.PREGLEDNIK
        });
      }
    }
  }, [isOpen, initialData, reset]);

  // Handler za slanje forme
  const onFormSubmit = handleSubmit(async (data: FormValues) => {
    try {
      // Ako uređujemo korisnika i nije unesena nova lozinka, uklonimo je iz podataka
      if (initialData && (!data.password || data.password === '')) {
        const { password, ...dataWithoutPassword } = data;
        await onSubmit(dataWithoutPassword as FormValues);
      } else {
        await onSubmit(data);
      }
      reset();
    } catch (error) {
      console.error('Greška prilikom spremanja korisnika:', error);
      // Greška će biti obrađena u roditeljskoj komponenti
    }
  });

  // Ako forma nije otvorena, ne prikazujemo ništa
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-semibold">
            {initialData ? 'Uredi korisnika' : 'Novi korisnik'}
          </h2>
          <button
            onClick={onCancel}
            className="text-gray-500 hover:text-gray-700"
            aria-label="Close"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={onFormSubmit} className="p-6">
          <div className="space-y-4">
            {/* Korisničko ime */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Korisničko ime *
              </label>
              <input
                type="text"
                {...register('username')}
                className={`block w-full border ${errors.username ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm p-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
                placeholder="Unesite korisničko ime..."
              />
              {errors.username && (
                <p className="mt-1 text-sm text-red-600">{errors.username.message}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email *
              </label>
              <input
                type="email"
                {...register('email')}
                className={`block w-full border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm p-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
                placeholder="Unesite email adresu..."
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>

            {/* Lozinka */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Lozinka {initialData ? '(ostavite prazno za zadržavanje trenutne)' : '*'}
              </label>
              <input
                type="password"
                {...register('password')}
                className={`block w-full border ${errors.password ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm p-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
                placeholder={initialData ? "Unesite novu lozinku..." : "Unesite lozinku..."}
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
              )}
            </div>

            {/* Uloga */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Uloga *
              </label>
              <select
                {...register('role')}
                className={`block w-full border ${errors.role ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm p-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
              >
                {Object.values(UserRole).map(role => (
                  <option key={role} value={role}>
                    {role}
                  </option>
                ))}
              </select>
              {errors.role && (
                <p className="mt-1 text-sm text-red-600">{errors.role.message}</p>
              )}
            </div>
          </div>

          <div className="mt-6 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Odustani
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Spremanje...' : initialData ? 'Spremi izmjene' : 'Spremi korisnika'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default KorisniciForm; 