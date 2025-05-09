import apiClient from '../config/api';

// Types
export interface Firma {
  id: number;
  naziv: string;
  adresa: string;
  oib: string;
  kontakt_osoba: string;
  broj_telefona: string;
  email: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateFirmaDto {
  naziv: string;
  adresa: string;
  oib: string;
  kontakt_osoba: string;
  broj_telefona: string;
  email: string;
}

export interface UpdateFirmaDto extends Partial<CreateFirmaDto> {}

// API service functions
const firmaService = {
  // Get all firms
  getAll: async (): Promise<Firma[]> => {
    const response = await apiClient.get<{ status: string; data: { firme: Firma[] } }>('/firme');
    return response.data.data.firme;
  },

  // Get a single firm by ID
  getById: async (id: number): Promise<Firma> => {
    const response = await apiClient.get<{ status: string; data: { firma: Firma } }>(`/firme/${id}`);
    return response.data.data.firma;
  },

  // Create a new firm
  create: async (data: CreateFirmaDto): Promise<Firma> => {
    const response = await apiClient.post<{ status: string; data: { firma: Firma } }>('/firme', data);
    return response.data.data.firma;
  },

  // Update an existing firm
  update: async (id: number, data: UpdateFirmaDto): Promise<Firma> => {
    const response = await apiClient.put<{ status: string; data: { firma: Firma } }>(`/firme/${id}`, data);
    return response.data.data.firma;
  },

  // Delete a firm
  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/firme/${id}`);
  }
};

export default firmaService; 