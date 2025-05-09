import apiClient from '../config/api';

// Types
export interface VoziloOprema {
  id: number;
  naziv_vozila_usluge: string;
  firma_id: number;
  broj_tablica_vozila_opreme: string;
  lokacija_id: number;
  status: 'Aktivan' | 'Neaktivan' | 'Na servisu' | 'Čeka dijelove';
  godisnja_inspekcija_datum?: string | null;
  datum_ugradnje_filtera?: string | null;
  datum_isteka_filtera_rucno?: string | null;
  period_vazenja_filtera_mjeseci?: number | null;
  zamjena_crijeva_hd_63_datum?: string | null;
  zamjena_crijeva_hd_38_datum?: string | null;
  zamjena_crijeva_tw_75_datum?: string | null;
  ispitivanje_crijeva_nepropusnost_datum?: string | null;
  ugradjena_servisirana_senzor_datum?: string | null;
  kalibraza_volumetra_datum?: string | null;
  umjeravanje_manometara_datum?: string | null;
  ispitivanje_hecpv_ilcpv_datum?: string | null;
  komentar?: string | null;
  firma?: {
    id: number;
    naziv: string;
  };
  lokacija?: {
    id: number;
    naziv: string;
  };
  // izračunata polja
  datum_isteka_filtera_izracunat?: string | null;
  dana_do_zamjene_filtera?: number | null;
  dana_do_godisnje_inspekcije?: number | null;
  dana_do_zamjene_crijeva_hd_63?: number | null;
  dana_do_zamjene_crijeva_hd_38?: number | null;
  dana_do_zamjene_crijeva_tw_75?: number | null;
  dana_do_ispitivanja_crijeva_nepropusnost?: number | null;
  dana_do_kalibracije_senzora?: number | null;
  dana_do_kalibracije_volumetra?: number | null;
  dana_do_umjeravanja_manometara?: number | null;
  dana_do_ispitivanja_hecpv_ilcpv?: number | null;
  createdAt?: string;
  updatedAt?: string;
}

// DTO for creating a new vehicle/equipment
export interface CreateVoziloOpremaDto {
  naziv_vozila_usluge: string;
  firma_id: number;
  broj_tablica_vozila_opreme: string;
  lokacija_id: number;
  status?: 'Aktivan' | 'Neaktivan' | 'Na servisu' | 'Čeka dijelove';
  godisnja_inspekcija_datum?: string | null;
  datum_ugradnje_filtera?: string | null;
  datum_isteka_filtera_rucno?: string | null;
  period_vazenja_filtera_mjeseci?: number | null;
  zamjena_crijeva_hd_63_datum?: string | null;
  zamjena_crijeva_hd_38_datum?: string | null;
  zamjena_crijeva_tw_75_datum?: string | null;
  ispitivanje_crijeva_nepropusnost_datum?: string | null;
  ugradjena_servisirana_senzor_datum?: string | null;
  kalibraza_volumetra_datum?: string | null;
  umjeravanje_manometara_datum?: string | null;
  ispitivanje_hecpv_ilcpv_datum?: string | null;
  komentar?: string | null;
}

// DTO for updating an existing vehicle/equipment (all fields optional)
export interface UpdateVoziloOpremaDto extends Partial<CreateVoziloOpremaDto> {}

// API service functions
const voziloOpremaService = {
  // Get all vehicles/equipment
  getAll: async (): Promise<VoziloOprema[]> => {
    const response = await apiClient.get<{ status: string; data: { vozilaOprema: VoziloOprema[] } }>('/vozila-oprema');
    return response.data.data.vozilaOprema;
  },

  // Get a single vehicle/equipment by ID
  getById: async (id: number): Promise<VoziloOprema> => {
    const response = await apiClient.get<{ status: string; data: { voziloOprema: VoziloOprema } }>(`/vozila-oprema/${id}`);
    return response.data.data.voziloOprema;
  },

  // Create a new vehicle/equipment
  create: async (data: CreateVoziloOpremaDto): Promise<VoziloOprema> => {
    const response = await apiClient.post<{ status: string; data: { voziloOprema: VoziloOprema } }>('/vozila-oprema', data);
    return response.data.data.voziloOprema;
  },

  // Update an existing vehicle/equipment
  update: async (id: number, data: UpdateVoziloOpremaDto): Promise<VoziloOprema> => {
    const response = await apiClient.put<{ status: string; data: { voziloOprema: VoziloOprema } }>(`/vozila-oprema/${id}`, data);
    return response.data.data.voziloOprema;
  },

  // Delete a vehicle/equipment
  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/vozila-oprema/${id}`);
  }
};

export default voziloOpremaService; 