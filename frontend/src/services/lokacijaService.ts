import apiClient from '../config/api';

// Types
export interface Lokacija {
  id: number;
  naziv: string;
  adresa: string;
  firma_id: number;
  gps_latitude?: number | null;
  gps_longitude?: number | null;
  createdAt?: string;
  updatedAt?: string;
  firma?: {
    id: number;
    naziv: string;
  };
}

export interface CreateLokacijaDto {
  naziv: string;
  adresa: string;
  firma_id: number;
  gps_latitude?: number | null;
  gps_longitude?: number | null;
}

export interface UpdateLokacijaDto extends Partial<CreateLokacijaDto> {}

// API service functions
const lokacijaService = {
  // Get all locations
  getAll: async (): Promise<Lokacija[]> => {
    const response = await apiClient.get<{ status: string; data: { lokacije: Lokacija[] } }>('/lokacije');
    return response.data.data.lokacije;
  },

  // Get locations by firm ID
  getByFirmaId: async (firmaId: number): Promise<Lokacija[]> => {
    const response = await apiClient.get<{ status: string; data: { lokacije: Lokacija[] } }>(`/lokacije?firma_id=${firmaId}`);
    return response.data.data.lokacije;
  },

  // Get a single location by ID
  getById: async (id: number): Promise<Lokacija> => {
    const response = await apiClient.get<{ status: string; data: { lokacija: Lokacija } }>(`/lokacije/${id}`);
    return response.data.data.lokacija;
  },

  // Create a new location
  create: async (data: CreateLokacijaDto): Promise<Lokacija> => {
    const response = await apiClient.post<{ status: string; data: { lokacija: Lokacija } }>('/lokacije', data);
    return response.data.data.lokacija;
  },

  // Update an existing location
  update: async (id: number, data: UpdateLokacijaDto): Promise<Lokacija> => {
    const response = await apiClient.put<{ status: string; data: { lokacija: Lokacija } }>(`/lokacije/${id}`, data);
    return response.data.data.lokacija;
  },

  // Delete a location
  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/lokacije/${id}`);
  }
};

export default lokacijaService; 