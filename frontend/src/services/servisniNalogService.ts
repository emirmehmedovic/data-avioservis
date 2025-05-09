import api from '../config/api';

export interface ServisniNalog {
  id: number;
  vozilo_oprema_id: number;
  opis_servisa: string;
  datum: string;
  kilometraza?: number | null;
  racun_broj?: string | null;
  iznos?: number | null;
  novi_datum_godisnje_inspekcije?: string | null; 
  promjena_ulja?: boolean;
  promjena_filtera?: boolean;
  napomena?: string | null;
  createdAt: string;
  updatedAt: string;
  voziloOprema?: {
    id: number;
    naziv_vozila_usluge: string;
    broj_tablica_vozila_opreme: string;
    firma?: {
      id: number;
      naziv: string;
    };
    lokacija?: {
      id: number;
      naziv: string;
    };
  };
}

export interface CreateServisniNalogDto {
  vozilo_oprema_id?: number;
  broj_tablica_vozila_opreme?: string;
  opis_servisa: string;
  datum: string;
  kilometraza?: number | null;
  racun_broj?: string | null;
  iznos?: number | null;
  novi_datum_godisnje_inspekcije?: string | null;
  promjena_ulja?: boolean;
  promjena_filtera?: boolean;
  napomena?: string | null;
}

export interface UpdateServisniNalogDto {
  opis_servisa?: string;
  datum?: string;
  kilometraza?: number | null;
  racun_broj?: string | null;
  iznos?: number | null;
  novi_datum_godisnje_inspekcije?: string | null;
  promjena_ulja?: boolean;
  promjena_filtera?: boolean;
  napomena?: string | null;
}

export interface GetAllServisniNaloziOptions {
  voziloOpremaId?: number;
}

const servisniNalogService = {
  getAll: async (options: GetAllServisniNaloziOptions = {}): Promise<ServisniNalog[]> => {
    let url = '/servisni-nalozi';
    
    // Add query parameters if options are provided
    if (options.voziloOpremaId) {
      url += `?voziloOpremaId=${options.voziloOpremaId}`;
    }
    
    const response = await api.get(url);
    
    // Provjerimo strukturu odgovora i izvučemo niz naloga
    if (response.data && response.data.data && Array.isArray(response.data.data.servisniNalozi)) {
      return response.data.data.servisniNalozi;
    } else if (response.data && Array.isArray(response.data)) {
      return response.data;
    } else if (response.data && response.data.data && Array.isArray(response.data.data)) {
      return response.data.data;
    } else {
      console.error('Unexpected response format:', response.data);
      return []; // Vratimo prazan niz ako nemamo podatke u očekivanom formatu
    }
  },

  getById: async (id: number): Promise<ServisniNalog> => {
    const response = await api.get(`/servisni-nalozi/${id}`);
    return response.data.data?.servisniNalog || response.data;
  },

  create: async (data: CreateServisniNalogDto): Promise<ServisniNalog> => {
    const response = await api.post('/servisni-nalozi', data);
    return response.data.data?.servisniNalog || response.data;
  },

  update: async (id: number, data: UpdateServisniNalogDto): Promise<ServisniNalog> => {
    const response = await api.put(`/servisni-nalozi/${id}`, data);
    return response.data.data?.servisniNalog || response.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/servisni-nalozi/${id}`);
  }
};

export default servisniNalogService; 