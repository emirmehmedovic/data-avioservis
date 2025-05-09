import * as React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X } from 'lucide-react';
import type { ServisniNalog } from '../services/servisniNalogService';
import type { VoziloOprema } from '../services/voziloOpremaService';

// Schema for validating the form
const schema = z.object({
  vozilo_oprema_id: z.number({
    required_error: "Molimo odaberite vozilo/opremu",
    invalid_type_error: "Molimo odaberite vozilo/opremu",
  }),
  opis_servisa: z.string()
    .min(3, "Opis servisa mora imati barem 3 znaka")
    .max(500, "Opis servisa ne smije prelaziti 500 znakova"),
  datum: z.string().refine(val => !isNaN(Date.parse(val)), {
    message: "Molimo unesite ispravan datum",
  }),
  kilometraza: z.number().optional().nullable(),
  racun_broj: z.string().optional().nullable(),
  iznos: z.number().optional().nullable(),
  novi_datum_godisnje_inspekcije: z.string().optional().nullable()
    .refine(val => val === null || val === "" || !isNaN(Date.parse(val as string)), {
      message: "Molimo unesite ispravan datum",
    }),
  promjena_ulja: z.boolean(),
  promjena_filtera: z.boolean(),
  napomena: z.string().optional().nullable(),
});

type FormValues = z.infer<typeof schema>;

interface ServisniNalogFormProps {
  isOpen: boolean;
  initialData: ServisniNalog | null;
  vozila: VoziloOprema[];
  onSubmit: (data: FormValues) => Promise<void>;
  onCancel: () => void;
}

const ServisniNalogForm: React.FC<ServisniNalogFormProps> = ({
  isOpen,
  initialData,
  vozila,
  onSubmit,
  onCancel
}) => {
  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      vozilo_oprema_id: 0,
      opis_servisa: '',
      datum: new Date().toISOString().split('T')[0],
      kilometraza: null,
      racun_broj: null,
      iznos: null,
      novi_datum_godisnje_inspekcije: null,
      promjena_ulja: false,
      promjena_filtera: false,
      napomena: null,
    }
  });

  // Reset form when initialData changes or form opens/closes
  React.useEffect(() => {
    if (isOpen) {
      if (initialData) {
        // Format the dates for the form
        const formatDate = (dateStr: string | null | undefined) => {
          if (!dateStr) return null;
          return new Date(dateStr).toISOString().split('T')[0];
        };

        reset({
          vozilo_oprema_id: initialData.vozilo_oprema_id,
          opis_servisa: initialData.opis_servisa,
          datum: formatDate(initialData.datum) || '',
          kilometraza: initialData.kilometraza,
          racun_broj: initialData.racun_broj,
          iznos: initialData.iznos,
          novi_datum_godisnje_inspekcije: formatDate(initialData.novi_datum_godisnje_inspekcije),
          promjena_ulja: initialData.promjena_ulja || false,
          promjena_filtera: initialData.promjena_filtera || false,
          napomena: initialData.napomena,
        });
      } else {
        // Reset to default values
        reset({
          vozilo_oprema_id: 0,
          opis_servisa: '',
          datum: new Date().toISOString().split('T')[0],
          kilometraza: null,
          racun_broj: null,
          iznos: null,
          novi_datum_godisnje_inspekcije: null,
          promjena_ulja: false,
          promjena_filtera: false,
          napomena: null,
        });
      }
    }
  }, [isOpen, initialData, reset]);

  // Handle the form submission
  const onFormSubmit = (data: FormValues) => {
    try {
      void onSubmit(data);
      reset();
    } catch (error) {
      console.error('Error submitting form:', error);
      // Error will be handled by the parent component
    }
  };

  // If the form is not open, don't render anything
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-semibold">
            {initialData ? 'Uredi servisni nalog' : 'Novi servisni nalog'}
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Vozilo selection */}
            <div className="col-span-1 md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Vozilo/Oprema *
              </label>
              <select
                {...register('vozilo_oprema_id', { valueAsNumber: true })}
                className={`block w-full border ${errors.vozilo_oprema_id ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm p-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
              >
                <option value={0} disabled>Odaberi vozilo/opremu</option>
                {vozila.map(vozilo => (
                  <option key={vozilo.id} value={vozilo.id}>
                    {vozilo.naziv_vozila_usluge} {vozilo.broj_tablica_vozila_opreme ? `(${vozilo.broj_tablica_vozila_opreme})` : ''}
                  </option>
                ))}
              </select>
              {errors.vozilo_oprema_id && errors.vozilo_oprema_id.message && (
                <p className="mt-1 text-sm text-red-600">{errors.vozilo_oprema_id.message.toString()}</p>
              )}
            </div>
            
            {/* Opis servisa */}
            <div className="col-span-1 md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Opis servisa *
              </label>
              <textarea
                {...register('opis_servisa')}
                rows={3}
                className={`block w-full border ${errors.opis_servisa ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm p-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
                placeholder="Unesite opis servisa..."
              />
              {errors.opis_servisa && errors.opis_servisa.message && (
                <p className="mt-1 text-sm text-red-600">{errors.opis_servisa.message.toString()}</p>
              )}
            </div>
            
            {/* Datum */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Datum servisa *
              </label>
              <input
                type="date"
                {...register('datum')}
                className={`block w-full border ${errors.datum ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm p-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
              />
              {errors.datum && errors.datum.message && (
                <p className="mt-1 text-sm text-red-600">{errors.datum.message.toString()}</p>
              )}
            </div>

            {/* Kilometraža */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Kilometraža
              </label>
              <Controller
                name="kilometraza"
                control={control}
                render={({ field }) => (
                  <input
                    type="number"
                    onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : null)}
                    value={field.value === null ? '' : field.value}
                    className={`block w-full border ${errors.kilometraza ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm p-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
                    placeholder="Unesite kilometražu..."
                  />
                )}
              />
              {errors.kilometraza && errors.kilometraza.message && (
                <p className="mt-1 text-sm text-red-600">{errors.kilometraza.message.toString()}</p>
              )}
            </div>

            {/* Račun broj */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Broj računa
              </label>
              <input
                type="text"
                {...register('racun_broj')}
                className={`block w-full border ${errors.racun_broj ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm p-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
                placeholder="Unesite broj računa..."
              />
              {errors.racun_broj && errors.racun_broj.message && (
                <p className="mt-1 text-sm text-red-600">{errors.racun_broj.message.toString()}</p>
              )}
            </div>

            {/* Iznos */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Iznos (EUR)
              </label>
              <Controller
                name="iznos"
                control={control}
                render={({ field }) => (
                  <input
                    type="number"
                    step="0.01"
                    onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : null)}
                    value={field.value === null ? '' : field.value}
                    className={`block w-full border ${errors.iznos ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm p-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
                    placeholder="Unesite iznos..."
                  />
                )}
              />
              {errors.iznos && errors.iznos.message && (
                <p className="mt-1 text-sm text-red-600">{errors.iznos.message.toString()}</p>
              )}
            </div>

            {/* Novi datum godišnje inspekcije */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Novi datum godišnje inspekcije
              </label>
              <Controller
                name="novi_datum_godisnje_inspekcije"
                control={control}
                render={({ field }) => (
                  <input
                    type="date"
                    onChange={(e) => field.onChange(e.target.value || null)}
                    value={field.value || ''}
                    className={`block w-full border ${errors.novi_datum_godisnje_inspekcije ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm p-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
                  />
                )}
              />
              {errors.novi_datum_godisnje_inspekcije && errors.novi_datum_godisnje_inspekcije.message && (
                <p className="mt-1 text-sm text-red-600">{errors.novi_datum_godisnje_inspekcije.message.toString()}</p>
              )}
            </div>

            {/* Servisne opcije */}
            <div className="col-span-1 md:col-span-2">
              <fieldset className="mt-4">
                <legend className="text-sm font-medium text-gray-700">Servisne opcije</legend>
                <div className="mt-2 space-y-2">
                  <div className="flex items-center">
                    <input
                      id="promjena_ulja"
                      type="checkbox"
                      {...register('promjena_ulja')}
                      className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                    />
                    <label htmlFor="promjena_ulja" className="ml-2 text-sm text-gray-700">
                      Promjena ulja
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      id="promjena_filtera"
                      type="checkbox"
                      {...register('promjena_filtera')}
                      className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                    />
                    <label htmlFor="promjena_filtera" className="ml-2 text-sm text-gray-700">
                      Promjena filtera
                    </label>
                  </div>
                </div>
              </fieldset>
            </div>

            {/* Napomena */}
            <div className="col-span-1 md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Napomena
              </label>
              <textarea
                {...register('napomena')}
                rows={2}
                className={`block w-full border ${errors.napomena ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm p-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
                placeholder="Unesite napomenu..."
              />
              {errors.napomena && errors.napomena.message && (
                <p className="mt-1 text-sm text-red-600">{errors.napomena.message.toString()}</p>
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
              {isSubmitting ? 'Spremanje...' : initialData ? 'Spremi izmjene' : 'Spremi nalog'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ServisniNalogForm; 