import api from '../config/api';

export interface IzvjestajOdrzavanjaParams {
  voziloOpremaId: number;
  datumOd?: string;
  datumDo?: string;
}

export interface Izvjestaj {
  vozilo: {
    id: number;
    naziv: string;
    brojTablica: string;
    firma: string | null;
    lokacija: string | null;
    status: string;
    godisnjaInspekcija: string | null;
    datumUgradnjeFiltera: string | null;
    datumIstekaFiltera: string | null;
    periodVazenjaFiltera: number | null;
  };
  servisniNalozi: Array<{
    id: number;
    datum: string;
    opisServisa: string;
    kilometraza: number | null;
    racunBroj: string | null;
    iznos: number | null;
    promjenaUlja: boolean;
    promjenaFiltera: boolean;
    napomena: string | null;
    createdAt: string;
  }>;
  ukupnaStatistika: {
    brojServisa: number;
    ukupnoTroskovi: number;
    datumPrvogServisa: string | null;
    datumZadnjegServisa: string | null;
  };
  metapodaci: {
    datumGenerisanja: string;
    parametriIzvjestaja: {
      datumOd: string | null;
      datumDo: string | null;
    };
  };
  format?: 'pdf' | 'excel';
}

const izvjestajService = {
  /**
   * Dohvaća izvještaj o održavanju vozila/opreme u JSON formatu
   */
  dohvatiIzvjestajOdrzavanja: async (params: IzvjestajOdrzavanjaParams): Promise<Izvjestaj> => {
    // Kreiraj query string za datume
    let queryParams = '';
    if (params.datumOd || params.datumDo) {
      queryParams = '?';
      if (params.datumOd) {
        queryParams += `datumOd=${params.datumOd}`;
      }
      if (params.datumDo) {
        queryParams += queryParams.length > 1 ? `&datumDo=${params.datumDo}` : `datumDo=${params.datumDo}`;
      }
    }
    
    const response = await api.get(`/izvjestaji/vozilo/${params.voziloOpremaId}/odrzavanje${queryParams}`);
    return response.data.data.izvjestaj;
  },
  
  /**
   * Dohvaća PDF izvještaj o održavanju vozila/opreme
   */
  dohvatiPdfIzvjestaj: async (params: IzvjestajOdrzavanjaParams): Promise<Izvjestaj> => {
    // Kreiraj query string za datume
    let queryParams = '';
    if (params.datumOd || params.datumDo) {
      queryParams = '?';
      if (params.datumOd) {
        queryParams += `datumOd=${params.datumOd}`;
      }
      if (params.datumDo) {
        queryParams += queryParams.length > 1 ? `&datumDo=${params.datumDo}` : `datumDo=${params.datumDo}`;
      }
    }
    
    const response = await api.get(`/izvjestaji/vozilo/${params.voziloOpremaId}/odrzavanje/pdf${queryParams}`);
    return response.data.data.izvjestaj;
  },
  
  /**
   * Dohvaća Excel izvještaj o održavanju vozila/opreme
   */
  dohvatiExcelIzvjestaj: async (params: IzvjestajOdrzavanjaParams): Promise<Izvjestaj> => {
    // Kreiraj query string za datume
    let queryParams = '';
    if (params.datumOd || params.datumDo) {
      queryParams = '?';
      if (params.datumOd) {
        queryParams += `datumOd=${params.datumOd}`;
      }
      if (params.datumDo) {
        queryParams += queryParams.length > 1 ? `&datumDo=${params.datumDo}` : `datumDo=${params.datumDo}`;
      }
    }
    
    const response = await api.get(`/izvjestaji/vozilo/${params.voziloOpremaId}/odrzavanje/excel${queryParams}`);
    return response.data.data.izvjestaj;
  }
};

export default izvjestajService; 