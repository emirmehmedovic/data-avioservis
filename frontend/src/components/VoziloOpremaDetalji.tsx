import React, { useState, useEffect } from 'react';
import { X, Truck, FileText, Clock, Download } from 'lucide-react';
import type { VoziloOprema } from '../services/voziloOpremaService';
import type { ServisniNalog } from '../services/servisniNalogService';
import servisniNalogService from '../services/servisniNalogService';
import izvjestajService from '../services/izvjestajService';
import TablePagination from './TablePagination';

interface VoziloOpremaDetaljiProps {
  vozilo: VoziloOprema | null;
  isOpen: boolean;
  onClose: () => void;
}

type TabType = 'info' | 'servisi' | 'povijest' | 'izvjestaji';

const VoziloOpremaDetalji: React.FC<VoziloOpremaDetaljiProps> = ({ vozilo, isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<TabType>('info');
  const [servisniNalozi, setServisniNalozi] = useState<ServisniNalog[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  // Stanje za paginaciju servisnih naloga
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(5);
  const [totalItems, setTotalItems] = useState<number>(0);
  
  // Novi state za izvještaje
  const [datumOd, setDatumOd] = useState<string>('');
  const [datumDo, setDatumDo] = useState<string>('');
  const [isGeneratingReport, setIsGeneratingReport] = useState<boolean>(false);
  const [reportError, setReportError] = useState<string | null>(null);
  
  // Učitaj servisne naloge za vozilo kad se otvori modal
  useEffect(() => {
    if (isOpen && vozilo) {
      fetchServisniNalozi();
    }
  }, [isOpen, vozilo, currentPage, pageSize]);
  
  const fetchServisniNalozi = async () => {
    if (!vozilo) return;
    
    try {
      setLoading(true);
      const options = { voziloOpremaId: vozilo.id };
      const nalozi = await servisniNalogService.getAll(options);
      
      setServisniNalozi(nalozi.slice((currentPage - 1) * pageSize, currentPage * pageSize));
      setTotalItems(nalozi.length);
      setError(null);
    } catch (err: any) {
      console.error('Error fetching servisni nalozi:', err);
      setError(err.message || 'Došlo je do greške prilikom dohvaćanja servisnih naloga.');
    } finally {
      setLoading(false);
    }
  };

  // Helper za formatiranje datuma
  const formatDate = (dateStr: string | null | undefined): string => {
    if (!dateStr) return '-';
    return new Date(dateStr).toLocaleDateString('hr-HR');
  };
  
  // Računamo ukupan broj stranica
  const totalPages = Math.ceil(totalItems / pageSize);
  
  // Function to handle PDF report generation
  const handleGeneratePdf = async () => {
    if (!vozilo) return;
    
    try {
      setIsGeneratingReport(true);
      setReportError(null);
      
      const params = {
        voziloOpremaId: vozilo.id,
        datumOd: datumOd || undefined,
        datumDo: datumDo || undefined
      };
      
      const izvjestaj = await izvjestajService.dohvatiPdfIzvjestaj(params);
      
      // U stvarnoj implementaciji, ovdje bismo otvorili PDF u novom tabu ili ga preuzeli
      // Za sada samo simuliramo preuzimanje
      alert('PDF izvještaj generiran i spreman za preuzimanje!');
      console.log('PDF izvještaj:', izvjestaj);
      
    } catch (err: any) {
      console.error('Error generating PDF report:', err);
      setReportError(err.message || 'Došlo je do greške prilikom generiranja PDF izvještaja.');
    } finally {
      setIsGeneratingReport(false);
    }
  };
  
  // Function to handle Excel report generation
  const handleGenerateExcel = async () => {
    if (!vozilo) return;
    
    try {
      setIsGeneratingReport(true);
      setReportError(null);
      
      const params = {
        voziloOpremaId: vozilo.id,
        datumOd: datumOd || undefined,
        datumDo: datumDo || undefined
      };
      
      const izvjestaj = await izvjestajService.dohvatiExcelIzvjestaj(params);
      
      // U stvarnoj implementaciji, ovdje bismo preuzeli Excel datoteku
      // Za sada samo simuliramo preuzimanje
      alert('Excel izvještaj generiran i spreman za preuzimanje!');
      console.log('Excel izvještaj:', izvjestaj);
      
    } catch (err: any) {
      console.error('Error generating Excel report:', err);
      setReportError(err.message || 'Došlo je do greške prilikom generiranja Excel izvještaja.');
    } finally {
      setIsGeneratingReport(false);
    }
  };

  if (!isOpen || !vozilo) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-5xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-bold flex items-center">
            <Truck className="mr-2" /> 
            {vozilo.naziv_vozila_usluge} - {vozilo.broj_tablica_vozila_opreme}
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>
        
        {/* Tabs */}
        <div className="border-b">
          <nav className="flex">
            <button 
              className={`px-4 py-3 font-medium ${activeTab === 'info' 
                ? 'border-b-2 border-indigo-600 text-indigo-600' 
                : 'text-gray-500 hover:text-gray-700'}`}
              onClick={() => setActiveTab('info')}
            >
              Osnovne informacije
            </button>
            <button 
              className={`px-4 py-3 font-medium ${activeTab === 'servisi' 
                ? 'border-b-2 border-indigo-600 text-indigo-600' 
                : 'text-gray-500 hover:text-gray-700'}`}
              onClick={() => setActiveTab('servisi')}
            >
              Servisni nalozi
            </button>
            <button 
              className={`px-4 py-3 font-medium ${activeTab === 'povijest' 
                ? 'border-b-2 border-indigo-600 text-indigo-600' 
                : 'text-gray-500 hover:text-gray-700'}`}
              onClick={() => setActiveTab('povijest')}
            >
              Povijest održavanja
            </button>
            <button 
              className={`px-4 py-3 font-medium ${activeTab === 'izvjestaji' 
                ? 'border-b-2 border-indigo-600 text-indigo-600' 
                : 'text-gray-500 hover:text-gray-700'}`}
              onClick={() => setActiveTab('izvjestaji')}
            >
              Izvještaji
            </button>
          </nav>
        </div>
        
        {/* Content */}
        <div className="p-6 overflow-y-auto">
          {activeTab === 'info' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold mb-4">Osnovni podaci</h3>
                <table className="w-full">
                  <tbody>
                    <tr className="border-b">
                      <td className="py-2 font-medium text-gray-600">Naziv:</td>
                      <td className="py-2">{vozilo.naziv_vozila_usluge}</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2 font-medium text-gray-600">Broj tablica:</td>
                      <td className="py-2">{vozilo.broj_tablica_vozila_opreme}</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2 font-medium text-gray-600">Firma:</td>
                      <td className="py-2">{vozilo.firma?.naziv || '-'}</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2 font-medium text-gray-600">Lokacija:</td>
                      <td className="py-2">{vozilo.lokacija?.naziv || '-'}</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2 font-medium text-gray-600">Status:</td>
                      <td className="py-2">
                        <span className={`inline-block rounded-full px-3 py-1 text-xs ${
                          vozilo.status === 'Aktivan' ? 'bg-green-100 text-green-800' :
                          vozilo.status === 'Neaktivan' ? 'bg-gray-100 text-gray-800' :
                          vozilo.status === 'Na servisu' ? 'bg-yellow-100 text-yellow-800' :
                          vozilo.status === 'Čeka dijelove' ? 'bg-red-100 text-red-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {vozilo.status}
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-4">Datumi i održavanje</h3>
                <table className="w-full">
                  <tbody>
                    <tr className="border-b">
                      <td className="py-2 font-medium text-gray-600">Godišnja inspekcija:</td>
                      <td className="py-2">
                        {formatDate(vozilo.godisnja_inspekcija_datum)}
                        {vozilo.dana_do_godisnje_inspekcije !== undefined && vozilo.dana_do_godisnje_inspekcije !== null && (
                          <span className={`ml-2 text-sm ${
                            vozilo.dana_do_godisnje_inspekcije < 0 ? 'text-red-600' :
                            vozilo.dana_do_godisnje_inspekcije < 30 ? 'text-orange-600' :
                            'text-green-600'
                          }`}>
                            ({vozilo.dana_do_godisnje_inspekcije} dana)
                          </span>
                        )}
                      </td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2 font-medium text-gray-600">Datum ugradnje filtera:</td>
                      <td className="py-2">{formatDate(vozilo.datum_ugradnje_filtera)}</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2 font-medium text-gray-600">Istek filtera:</td>
                      <td className="py-2">
                        {formatDate(vozilo.datum_isteka_filtera_izracunat)}
                        {vozilo.dana_do_zamjene_filtera !== undefined && vozilo.dana_do_zamjene_filtera !== null && (
                          <span className={`ml-2 text-sm ${
                            vozilo.dana_do_zamjene_filtera < 0 ? 'text-red-600' :
                            vozilo.dana_do_zamjene_filtera < 30 ? 'text-orange-600' :
                            'text-green-600'
                          }`}>
                            ({vozilo.dana_do_zamjene_filtera} dana)
                          </span>
                        )}
                      </td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2 font-medium text-gray-600">Period važenja filtera:</td>
                      <td className="py-2">{vozilo.period_vazenja_filtera_mjeseci || '-'} mjeseci</td>
                    </tr>
                  </tbody>
                </table>
                
                <h3 className="text-lg font-semibold mt-6 mb-4">Crijeva i kalibracija</h3>
                <table className="w-full">
                  <tbody>
                    <tr className="border-b">
                      <td className="py-2 font-medium text-gray-600">Zamjena crijeva HD-63:</td>
                      <td className="py-2">{formatDate(vozilo.zamjena_crijeva_hd_63_datum)}</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2 font-medium text-gray-600">Zamjena crijeva HD-38:</td>
                      <td className="py-2">{formatDate(vozilo.zamjena_crijeva_hd_38_datum)}</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2 font-medium text-gray-600">Zamjena crijeva TW-75:</td>
                      <td className="py-2">{formatDate(vozilo.zamjena_crijeva_tw_75_datum)}</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2 font-medium text-gray-600">Ispitivanje crijeva:</td>
                      <td className="py-2">{formatDate(vozilo.ispitivanje_crijeva_nepropusnost_datum)}</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2 font-medium text-gray-600">Kalibracija volumetra:</td>
                      <td className="py-2">{formatDate(vozilo.kalibraza_volumetra_datum)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}
          
          {activeTab === 'servisi' && (
            <div>
              <h3 className="text-lg font-semibold mb-4">Servisni nalozi</h3>
              
              {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                  {error}
                </div>
              )}
              
              {loading ? (
                <div className="flex justify-center items-center py-8">
                  <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
                </div>
              ) : (
                <>
                  <div className="overflow-x-auto rounded-lg shadow border">
                    <table className="min-w-full bg-white">
                      <thead className="bg-gray-100 text-gray-700">
                        <tr>
                          <th className="py-3 px-4 text-left">Datum</th>
                          <th className="py-3 px-4 text-left">Opis servisa</th>
                          <th className="py-3 px-4 text-left">Kilometraža</th>
                          <th className="py-3 px-4 text-left">Broj računa</th>
                          <th className="py-3 px-4 text-left">Iznos</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {servisniNalozi.length === 0 ? (
                          <tr>
                            <td colSpan={5} className="py-4 px-4 text-center text-gray-500">
                              Nema servisnih naloga za prikaz
                            </td>
                          </tr>
                        ) : (
                          servisniNalozi.map(nalog => (
                            <tr key={nalog.id} className="hover:bg-gray-50">
                              <td className="py-3 px-4">{formatDate(nalog.datum)}</td>
                              <td className="py-3 px-4">{nalog.opis_servisa}</td>
                              <td className="py-3 px-4">{nalog.kilometraza || '-'}</td>
                              <td className="py-3 px-4">{nalog.racun_broj || '-'}</td>
                              <td className="py-3 px-4">
                                {nalog.iznos ? `${nalog.iznos.toFixed(2)} KM` : '-'}
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                  
                  {servisniNalozi.length > 0 && (
                    <div className="mt-4">
                      <TablePagination 
                        currentPage={currentPage}
                        totalPages={totalPages}
                        totalItems={totalItems}
                        pageSize={pageSize}
                        onPageChange={setCurrentPage}
                        onPageSizeChange={setPageSize}
                      />
                    </div>
                  )}
                </>
              )}
            </div>
          )}
          
          {activeTab === 'povijest' && (
            <div>
              <h3 className="text-lg font-semibold mb-4">Povijest održavanja</h3>
              {loading ? (
                <div className="flex justify-center items-center py-8">
                  <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
                </div>
              ) : servisniNalozi.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  Nema povijesti održavanja za prikaz
                </div>
              ) : (
                <div className="relative">
                  <div className="absolute left-4 top-0 h-full w-0.5 bg-gray-200"></div>
                  
                  {servisniNalozi.map((nalog, index) => (
                    <div key={nalog.id} className="relative pl-10 pb-8">
                      <div className="absolute left-2 top-5 w-8 h-8 bg-indigo-100 border-2 border-indigo-600 rounded-full flex items-center justify-center z-10">
                        <Clock size={16} className="text-indigo-600" />
                      </div>
                      
                      <div className="bg-white p-4 rounded-lg shadow border">
                        <div className="font-semibold text-indigo-600 mb-1">
                          {formatDate(nalog.datum)}
                          {nalog.kilometraza && <span className="ml-2 text-gray-600">{nalog.kilometraza} km</span>}
                        </div>
                        <div className="font-medium">{nalog.opis_servisa}</div>
                        {(nalog.racun_broj || nalog.iznos) && (
                          <div className="text-sm text-gray-600 mt-1">
                            {nalog.racun_broj && <span>Račun: {nalog.racun_broj}</span>}
                            {nalog.racun_broj && nalog.iznos && <span> | </span>}
                            {nalog.iznos && <span>Iznos: {nalog.iznos.toFixed(2)} KM</span>}
                          </div>
                        )}
                        {nalog.napomena && (
                          <div className="text-sm text-gray-600 mt-1 italic">
                            Napomena: {nalog.napomena}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
          
          {activeTab === 'izvjestaji' && (
            <div>
              <h3 className="text-lg font-semibold mb-4">Izvještaji održavanja</h3>
              
              {reportError && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                  {reportError}
                </div>
              )}
              
              <div className="bg-gray-50 p-6 rounded-lg border mb-6">
                <h4 className="font-medium mb-4">Generiši izvještaj održavanja</h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Datum od:
                    </label>
                    <input 
                      type="date" 
                      className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                      value={datumOd}
                      onChange={(e) => setDatumOd(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Datum do:
                    </label>
                    <input 
                      type="date" 
                      className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                      value={datumDo}
                      onChange={(e) => setDatumDo(e.target.value)}
                    />
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  <button 
                    className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={handleGeneratePdf}
                    disabled={isGeneratingReport}
                  >
                    {isGeneratingReport ? (
                      <span className="flex items-center">
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Generiranje...
                      </span>
                    ) : (
                      <>
                        <Download size={16} className="mr-1" /> Preuzmi PDF
                      </>
                    )}
                  </button>
                  <button 
                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={handleGenerateExcel}
                    disabled={isGeneratingReport}
                  >
                    {isGeneratingReport ? (
                      <span className="flex items-center">
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Generiranje...
                      </span>
                    ) : (
                      <>
                        <Download size={16} className="mr-1" /> Preuzmi Excel
                      </>
                    )}
                  </button>
                </div>
              </div>
              
              <div className="text-sm text-gray-600">
                <p>Napomena: Izvještaj će sadržavati sve servisne naloge i podatke o održavanju za izabrani period.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VoziloOpremaDetalji; 