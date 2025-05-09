import React, { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X } from 'lucide-react';
import type { Lokacija } from '../services/lokacijaService';
import type { Firma } from '../services/firmaService';

// Schema za validaciju forme
const schema = z.object({
  naziv: z.string()
    .min(1, "Naziv lokacije je obavezan")
    .max(100, "Naziv lokacije ne smije prelaziti 100 znakova"),
  adresa: z.string()
    .min(1, "Adresa je obavezna")
    .max(200, "Adresa ne smije prelaziti 200 znakova"),
  firma_id: z.number({
    required_error: "Odabir firme je obavezan",
    invalid_type_error: "Odabir firme je obavezan"
  }).min(1, "Odabir firme je obavezan"),
  gps_latitude: z.union([
    z.number().min(-90).max(90),
    z.null()
  ]).optional(),
  gps_longitude: z.union([
    z.number().min(-180).max(180),
    z.null()
  ]).optional()
});

type FormValues = z.infer<typeof schema>;

interface LokacijaFormProps {
  isOpen: boolean;
  initialData: Lokacija | null;
  firme: Firma[];
  onSubmit: (data: FormValues) => Promise<void>;
  onCancel: () => void;
}

const LokacijaForm: React.FC<LokacijaFormProps> = ({
  isOpen,
  initialData,
  firme,
  onSubmit,
  onCancel
}) => {
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting }
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      naziv: '',
      adresa: '',
      firma_id: 0,
      gps_latitude: null,
      gps_longitude: null
    }
  });

  // Reset forme kada se promijeni initialData ili kada se forma otvori/zatvori
  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        reset({
          naziv: initialData.naziv,
          adresa: initialData.adresa,
          firma_id: initialData.firma_id,
          gps_latitude: initialData.gps_latitude,
          gps_longitude: initialData.gps_longitude
        });
      } else {
        reset({
          naziv: '',
          adresa: '',
          firma_id: 0,
          gps_latitude: null,
          gps_longitude: null
        });
      }
    }
  }, [isOpen, initialData, reset]);

  // Handler za slanje forme
  const onFormSubmit = handleSubmit(async (data: FormValues) => {
    try {
      await onSubmit(data);
      reset();
    } catch (error) {
      console.error('Greška prilikom spremanja lokacije:', error);
      // Greška će biti obrađena u roditeljskoj komponenti
    }
  });

  // Ako forma nije otvorena, ne prikazujemo ništa
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-semibold">
            {initialData ? 'Uredi lokaciju' : 'Nova lokacija'}
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
            {/* Firma selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Firma *
              </label>
              <select
                {...register('firma_id', { valueAsNumber: true })}
                className={`block w-full border ${errors.firma_id ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm p-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
              >
                <option value={0} disabled>Odaberi firmu</option>
                {firme.map(firma => (
                  <option key={firma.id} value={firma.id}>
                    {firma.naziv}
                  </option>
                ))}
              </select>
              {errors.firma_id && (
                <p className="mt-1 text-sm text-red-600">{errors.firma_id.message}</p>
              )}
            </div>

            {/* Naziv */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Naziv lokacije *
              </label>
              <input
                type="text"
                {...register('naziv')}
                className={`block w-full border ${errors.naziv ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm p-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
                placeholder="Unesite naziv lokacije..."
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* GPS Latitude */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  GPS širina (latitude)
                </label>
                <Controller
                  name="gps_latitude"
                  control={control}
                  render={({ field }) => (
                    <input
                      type="number"
                      step="0.000001"
                      min="-90"
                      max="90"
                      onChange={(e) => {
                        const value = e.target.value;
                        field.onChange(value === '' ? null : Number(value));
                      }}
                      value={field.value === null ? '' : field.value}
                      className={`block w-full border ${errors.gps_latitude ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm p-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
                      placeholder="Npr. 45.814912"
                    />
                  )}
                />
                {errors.gps_latitude && (
                  <p className="mt-1 text-sm text-red-600">{errors.gps_latitude.message}</p>
                )}
              </div>

              {/* GPS Longitude */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  GPS dužina (longitude)
                </label>
                <Controller
                  name="gps_longitude"
                  control={control}
                  render={({ field }) => (
                    <input
                      type="number"
                      step="0.000001"
                      min="-180"
                      max="180"
                      onChange={(e) => {
                        const value = e.target.value;
                        field.onChange(value === '' ? null : Number(value));
                      }}
                      value={field.value === null ? '' : field.value}
                      className={`block w-full border ${errors.gps_longitude ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm p-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
                      placeholder="Npr. 15.977895"
                    />
                  )}
                />
                {errors.gps_longitude && (
                  <p className="mt-1 text-sm text-red-600">{errors.gps_longitude.message}</p>
                )}
              </div>
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
              {isSubmitting ? 'Spremanje...' : initialData ? 'Spremi izmjene' : 'Spremi lokaciju'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LokacijaForm; 