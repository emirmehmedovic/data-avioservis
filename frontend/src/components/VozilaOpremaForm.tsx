import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import type { VoziloOprema, CreateVoziloOpremaDto } from '../services/voziloOpremaService';
import { X } from 'lucide-react';

// Define schemas for validation
const voziloOpremaSchema = z.object({
  naziv_vozila_usluge: z.string().min(3, 'Naziv je obavezan (min. 3 znaka)'),
  firma_id: z.number({
    required_error: 'Firma je obavezna',
    invalid_type_error: 'Firma je obavezna',
  }),
  broj_tablica_vozila_opreme: z.string().min(1, 'Broj tablica je obavezan'),
  lokacija_id: z.number({
    required_error: 'Lokacija je obavezna',
    invalid_type_error: 'Lokacija je obavezna',
  }),
  status: z.enum(['Aktivan', 'Neaktivan', 'Na servisu', 'Čeka dijelove'], {
    required_error: 'Status je obavezan',
  }),
  godisnja_inspekcija_datum: z.string().nullable().optional(),
  datum_ugradnje_filtera: z.string().nullable().optional(),
  datum_isteka_filtera_rucno: z.string().nullable().optional(),
  period_vazenja_filtera_mjeseci: z.number().nullable().optional(),
  zamjena_crijeva_hd_63_datum: z.string().nullable().optional(),
  zamjena_crijeva_hd_38_datum: z.string().nullable().optional(),
  zamjena_crijeva_tw_75_datum: z.string().nullable().optional(),
  ispitivanje_crijeva_nepropusnost_datum: z.string().nullable().optional(),
  ugradjena_servisirana_senzor_datum: z.string().nullable().optional(),
  kalibraza_volumetra_datum: z.string().nullable().optional(),
  umjeravanje_manometara_datum: z.string().nullable().optional(),
  ispitivanje_hecpv_ilcpv_datum: z.string().nullable().optional(),
  komentar: z.string().nullable().optional(),
});

// Type for form values
type VoziloOpremaFormValues = z.infer<typeof voziloOpremaSchema>;

// Interface for firm and location data
interface FirmaOption {
  id: number;
  naziv: string;
}

interface LokacijaOption {
  id: number;
  naziv: string;
}

// Props interface
interface VozilaOpremaFormProps {
  onSubmit: (data: CreateVoziloOpremaDto) => Promise<void>;
  onCancel: () => void;
  initialData?: VoziloOprema | null;
  firme: FirmaOption[];
  lokacije: LokacijaOption[];
  isOpen: boolean;
}

const VozilaOpremaForm: React.FC<VozilaOpremaFormProps> = ({
  onSubmit,
  onCancel,
  initialData,
  firme,
  lokacije,
  isOpen
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Configure form with validation
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control,
    setValue
  } = useForm<VoziloOpremaFormValues>({
    resolver: zodResolver(voziloOpremaSchema),
    defaultValues: {
      status: 'Aktivan',
      firma_id: undefined,
      lokacija_id: undefined,
    }
  });

  // Set initial form values when editing
  useEffect(() => {
    if (initialData) {
      // Set each field from initialData
      setValue('naziv_vozila_usluge', initialData.naziv_vozila_usluge);
      setValue('firma_id', initialData.firma_id);
      setValue('lokacija_id', initialData.lokacija_id);
      setValue('broj_tablica_vozila_opreme', initialData.broj_tablica_vozila_opreme);
      setValue('status', initialData.status);
      
      // Optional fields - need to handle null/undefined values
      if (initialData.godisnja_inspekcija_datum) {
        // Convert date string to YYYY-MM-DD format for input[type="date"]
        setValue('godisnja_inspekcija_datum', initialData.godisnja_inspekcija_datum.split('T')[0]);
      }
      if (initialData.datum_ugradnje_filtera) {
        setValue('datum_ugradnje_filtera', initialData.datum_ugradnje_filtera.split('T')[0]);
      }
      if (initialData.datum_isteka_filtera_rucno) {
        setValue('datum_isteka_filtera_rucno', initialData.datum_isteka_filtera_rucno.split('T')[0]);
      }
      setValue('period_vazenja_filtera_mjeseci', initialData.period_vazenja_filtera_mjeseci);
      
      if (initialData.zamjena_crijeva_hd_63_datum) {
        setValue('zamjena_crijeva_hd_63_datum', initialData.zamjena_crijeva_hd_63_datum.split('T')[0]);
      }
      if (initialData.zamjena_crijeva_hd_38_datum) {
        setValue('zamjena_crijeva_hd_38_datum', initialData.zamjena_crijeva_hd_38_datum.split('T')[0]);
      }
      if (initialData.zamjena_crijeva_tw_75_datum) {
        setValue('zamjena_crijeva_tw_75_datum', initialData.zamjena_crijeva_tw_75_datum.split('T')[0]);
      }
      if (initialData.ispitivanje_crijeva_nepropusnost_datum) {
        setValue('ispitivanje_crijeva_nepropusnost_datum', initialData.ispitivanje_crijeva_nepropusnost_datum.split('T')[0]);
      }
      if (initialData.ugradjena_servisirana_senzor_datum) {
        setValue('ugradjena_servisirana_senzor_datum', initialData.ugradjena_servisirana_senzor_datum.split('T')[0]);
      }
      if (initialData.kalibraza_volumetra_datum) {
        setValue('kalibraza_volumetra_datum', initialData.kalibraza_volumetra_datum.split('T')[0]);
      }
      if (initialData.umjeravanje_manometara_datum) {
        setValue('umjeravanje_manometara_datum', initialData.umjeravanje_manometara_datum.split('T')[0]);
      }
      if (initialData.ispitivanje_hecpv_ilcpv_datum) {
        setValue('ispitivanje_hecpv_ilcpv_datum', initialData.ispitivanje_hecpv_ilcpv_datum.split('T')[0]);
      }
      setValue('komentar', initialData.komentar);
    } else {
      // Reset form for new record
      reset({
        status: 'Aktivan',
        firma_id: undefined,
        lokacija_id: undefined,
      });
    }
  }, [initialData, reset, setValue]);

  // Handle form submission
  const handleFormSubmit = async (data: VoziloOpremaFormValues) => {
    setIsSubmitting(true);
    setError(null);
    
    try {
      await onSubmit(data);
      reset();
    } catch (err: any) {
      console.error('Error submitting form:', err);
      setError(err.message || 'Došlo je do greške prilikom spremanja podataka.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex justify-between items-center px-6 py-4 border-b">
          <h2 className="text-xl font-semibold text-gray-800">
            {initialData ? 'Uredi vozilo/opremu' : 'Dodaj novo vozilo/opremu'}
          </h2>
          <button 
            onClick={onCancel}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="p-6 flex-1 overflow-y-auto">
          {error && (
            <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Osnovni podaci */}
              <div className="space-y-4">
                <h3 className="font-medium text-gray-900 border-b pb-2">Osnovni podaci</h3>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Naziv vozila/usluge*
                  </label>
                  <input
                    type="text"
                    {...register('naziv_vozila_usluge')}
                    className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 ${errors.naziv_vozila_usluge ? 'border-red-500' : ''}`}
                  />
                  {errors.naziv_vozila_usluge && (
                    <p className="mt-1 text-sm text-red-600">{errors.naziv_vozila_usluge.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Broj tablica*
                  </label>
                  <input
                    type="text"
                    {...register('broj_tablica_vozila_opreme')}
                    className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 ${errors.broj_tablica_vozila_opreme ? 'border-red-500' : ''}`}
                  />
                  {errors.broj_tablica_vozila_opreme && (
                    <p className="mt-1 text-sm text-red-600">{errors.broj_tablica_vozila_opreme.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Firma*
                  </label>
                  <Controller
                    control={control}
                    name="firma_id"
                    render={({ field }) => (
                      <select
                        onChange={(e) => field.onChange(Number(e.target.value))}
                        value={field.value}
                        className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 ${errors.firma_id ? 'border-red-500' : ''}`}
                      >
                        <option value="">-- Odaberite firmu --</option>
                        {firme.map(firma => (
                          <option key={firma.id} value={firma.id}>
                            {firma.naziv}
                          </option>
                        ))}
                      </select>
                    )}
                  />
                  {errors.firma_id && (
                    <p className="mt-1 text-sm text-red-600">{String(errors.firma_id.message)}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Lokacija*
                  </label>
                  <Controller
                    control={control}
                    name="lokacija_id"
                    render={({ field }) => (
                      <select
                        onChange={(e) => field.onChange(Number(e.target.value))}
                        value={field.value}
                        className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 ${errors.lokacija_id ? 'border-red-500' : ''}`}
                      >
                        <option value="">-- Odaberite lokaciju --</option>
                        {lokacije.map(lokacija => (
                          <option key={lokacija.id} value={lokacija.id}>
                            {lokacija.naziv}
                          </option>
                        ))}
                      </select>
                    )}
                  />
                  {errors.lokacija_id && (
                    <p className="mt-1 text-sm text-red-600">{String(errors.lokacija_id.message)}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Status*
                  </label>
                  <select
                    {...register('status')}
                    className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 ${errors.status ? 'border-red-500' : ''}`}
                  >
                    <option value="Aktivan">Aktivno</option>
                    <option value="Neaktivan">Neaktivno</option>
                    <option value="Na servisu">U servisu</option>
                    <option value="Čeka dijelove">Čeka dijelove</option>
                  </select>
                  {errors.status && (
                    <p className="mt-1 text-sm text-red-600">{errors.status.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Komentar
                  </label>
                  <textarea
                    {...register('komentar')}
                    rows={3}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  ></textarea>
                </div>
              </div>

              {/* Datumi servisa i održavanja */}
              <div className="space-y-4">
                <h3 className="font-medium text-gray-900 border-b pb-2">Datumi servisa i održavanja</h3>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Datum godišnje inspekcije
                  </label>
                  <input
                    type="date"
                    {...register('godisnja_inspekcija_datum')}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Datum ugradnje filtera
                  </label>
                  <input
                    type="date"
                    {...register('datum_ugradnje_filtera')}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Datum isteka filtera (ručno)
                  </label>
                  <input
                    type="date"
                    {...register('datum_isteka_filtera_rucno')}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Period važenja filtera (mjeseci)
                  </label>
                  <input
                    type="number"
                    {...register('period_vazenja_filtera_mjeseci', { valueAsNumber: true })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Datum zamjene cijevi HD 63
                  </label>
                  <input
                    type="date"
                    {...register('zamjena_crijeva_hd_63_datum')}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Datum zamjene cijevi HD 38
                  </label>
                  <input
                    type="date"
                    {...register('zamjena_crijeva_hd_38_datum')}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Datum ispitivanja cijevi na nepropusnost
                  </label>
                  <input
                    type="date"
                    {...register('ispitivanje_crijeva_nepropusnost_datum')}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-4 border-t">
              <button
                type="button"
                onClick={onCancel}
                className="px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                disabled={isSubmitting}
              >
                Odustani
              </button>
              <button
                type="submit"
                className="px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Spremanje...' : (initialData ? 'Spremi promjene' : 'Dodaj vozilo/opremu')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default VozilaOpremaForm; 