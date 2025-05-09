import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X } from 'lucide-react';
import type { Firma } from '../services/firmaService';

// Schema za validaciju forme
const schema = z.object({
  naziv: z.string()
    .min(1, "Naziv firme je obavezan")
    .max(100, "Naziv firme ne smije prelaziti 100 znakova"),
  adresa: z.string()
    .min(1, "Adresa je obavezna")
    .max(200, "Adresa ne smije prelaziti 200 znakova"),
  oib: z.string()
    .min(11, "OIB mora imati 11 znamenki")
    .max(11, "OIB mora imati 11 znamenki")
    .regex(/^\d+$/, "OIB mora sadržavati samo brojeve"),
  kontakt_osoba: z.string()
    .min(1, "Ime kontakt osobe je obavezno")
    .max(100, "Ime kontakt osobe ne smije prelaziti 100 znakova"),
  broj_telefona: z.string()
    .min(1, "Broj telefona je obavezan"),
  email: z.string()
    .min(1, "Email je obavezan")
    .email("Unesite ispravan email format")
});

type FormValues = z.infer<typeof schema>;

interface FirmaFormProps {
  isOpen: boolean;
  initialData: Firma | null;
  onSubmit: (data: FormValues) => Promise<void>;
  onCancel: () => void;
}

const FirmaForm: React.FC<FirmaFormProps> = ({
  isOpen,
  initialData,
  onSubmit,
  onCancel
}) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      naziv: '',
      adresa: '',
      oib: '',
      kontakt_osoba: '',
      broj_telefona: '',
      email: ''
    }
  });

  // Reset forme kada se promijeni initialData ili kada se forma otvori/zatvori
  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        reset({
          naziv: initialData.naziv,
          adresa: initialData.adresa,
          oib: initialData.oib,
          kontakt_osoba: initialData.kontakt_osoba,
          broj_telefona: initialData.broj_telefona,
          email: initialData.email
        });
      } else {
        reset({
          naziv: '',
          adresa: '',
          oib: '',
          kontakt_osoba: '',
          broj_telefona: '',
          email: ''
        });
      }
    }
  }, [isOpen, initialData, reset]);

  // Handler za slanje forme
  const onFormSubmit = async (data: FormValues) => {
    try {
      await onSubmit(data);
      reset();
    } catch (error) {
      console.error('Greška prilikom spremanja firme:', error);
      // Greška će biti obrađena u roditeljskoj komponenti
    }
  };

  // Ako forma nije otvorena, ne prikazujemo ništa
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-semibold">
            {initialData ? 'Uredi firmu' : 'Nova firma'}
          </h2>
          <button
            onClick={onCancel}
            className="text-gray-500 hover:text-gray-700"
            aria-label="Close"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit(onFormSubmit)} className="p-6">
          <div className="space-y-4">
            {/* Naziv */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Naziv firme *
              </label>
              <input
                type="text"
                {...register('naziv')}
                className={`block w-full border ${errors.naziv ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm p-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
                placeholder="Unesite naziv firme..."
              />
              {errors.naziv && (
                <p className="mt-1 text-sm text-red-600">{errors.naziv.message}</p>
              )}
            </div>

            {/* Adresa */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Adresa *
              </label>
              <input
                type="text"
                {...register('adresa')}
                className={`block w-full border ${errors.adresa ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm p-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
                placeholder="Unesite adresu..."
              />
              {errors.adresa && (
                <p className="mt-1 text-sm text-red-600">{errors.adresa.message}</p>
              )}
            </div>

            {/* OIB */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                OIB *
              </label>
              <input
                type="text"
                {...register('oib')}
                className={`block w-full border ${errors.oib ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm p-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
                placeholder="Unesite OIB (11 znamenki)..."
                maxLength={11}
              />
              {errors.oib && (
                <p className="mt-1 text-sm text-red-600">{errors.oib.message}</p>
              )}
            </div>

            {/* Kontakt osoba */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Kontakt osoba *
              </label>
              <input
                type="text"
                {...register('kontakt_osoba')}
                className={`block w-full border ${errors.kontakt_osoba ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm p-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
                placeholder="Unesite ime kontakt osobe..."
              />
              {errors.kontakt_osoba && (
                <p className="mt-1 text-sm text-red-600">{errors.kontakt_osoba.message}</p>
              )}
            </div>

            {/* Broj telefona */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Broj telefona *
              </label>
              <input
                type="text"
                {...register('broj_telefona')}
                className={`block w-full border ${errors.broj_telefona ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm p-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
                placeholder="Unesite broj telefona..."
              />
              {errors.broj_telefona && (
                <p className="mt-1 text-sm text-red-600">{errors.broj_telefona.message}</p>
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
              {isSubmitting ? 'Spremanje...' : initialData ? 'Spremi izmjene' : 'Spremi firmu'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FirmaForm; 