import apiClient from '../config/api';
import { z } from 'zod';

// Tip za login payload - možemo koristiti isti Zod shemu kao na LoginPage ili definirati jednostavniji
// Za sada, koristit ćemo jednostavne tipove, ali Zod se može integrirati i ovdje za runtime provjeru odgovora.
export interface LoginPayload {
  email: string;
  password: string;
}

// Tip za očekivani uspješan odgovor s servera (prilagoditi prema stvarnom odgovoru vašeg backend-a)
export interface LoginResponse {
  token: string;
  user: {
    id: number;
    ime: string;
    prezime: string;
    email: string;
    uloga: 'admin' | 'korisnik'; // Prilagoditi prema ulogama u vašem sustavu
    // Dodati ostala relevantna polja korisnika ako je potrebno
  };
}

// Tip za grešku pri prijavi (opcionalno, za bolji error handling)
export interface LoginErrorResponse {
  message: string;
  //statusCode?: number; // Može se dodati ako backend šalje specifične kodove grešaka
}

export const loginUser = async (credentials: LoginPayload): Promise<LoginResponse> => {
  try {
    const response = await apiClient.post<LoginResponse>('/auth/login', credentials);
    // Ovdje možemo spremiti token (npr. u localStorage) i podatke o korisniku (npr. u state management ili context)
    // Za sada, samo vraćamo podatke
    console.log('Odgovor od servera:', response.data);
    return response.data;
  } catch (error: any) {
    // Poboljšano rukovanje greškama
    if (error.response && error.response.data) {
      // Ako backend vrati strukturiranu grešku
      const apiError = error.response.data as LoginErrorResponse;
      console.error('Greška pri prijavi (API):', apiError);
      throw new Error(apiError.message || 'Došlo je do greške prilikom prijave.');
    } else {
      // Generička greška (npr. mrežni problem)
      console.error('Greška pri prijavi (Mreža/Server):', error.message);
      throw new Error('Nije moguće uspostaviti vezu sa serverom. Molimo pokušajte kasnije.');
    }
  }
}; 