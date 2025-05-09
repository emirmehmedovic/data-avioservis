import React, { useState, useEffect, useMemo } from 'react';
import servisniNalogService from '../services/servisniNalogService';
import voziloOpremaService from '../services/voziloOpremaService';
import type { ServisniNalog, CreateServisniNalogDto } from '../services/servisniNalogService';
import type { VoziloOprema } from '../services/voziloOpremaService';
import { Wrench, Edit, Trash2, Plus, AlertCircle, FileText } from 'lucide-react';
import ServisniNalogForm from '../components/ServisniNalogForm';
import TablePagination from '../components/TablePagination';
import TableFilter from '../components/TableFilter';
import SortableHeader from '../components/SortableHeader';

// Definicija opcija za filtriranje
const filterOptions = [
  { key: 'opis_servisa', label: 'Opis servisa' },
  { key: 'voziloOprema.naziv_vozila_usluge', label: 'Vozilo/Oprema' },
  { key: 'voziloOprema.broj_tablica_vozila_opreme', label: 'Broj tablica' },
  { key: 'voziloOprema.firma.naziv', label: 'Firma' },
  { key: 'racun_broj', label: 'Broj računa' },
];

type SortDirection = 'asc' | 'desc' | null;

const ServisniNaloziPage: React.FC = () => {
  // Stanje za podatke
  const [nalozi, setNalozi] = useState<ServisniNalog[]>([]);
  const [vozila, setVozila] = useState<VoziloOprema[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState<boolean>(false);
  const [editingNalog, setEditingNalog] = useState<ServisniNalog | null>(null);

  // Stanje za paginaciju
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [totalItems, setTotalItems] = useState<number>(0);

  // Stanje za sortiranje
  const [sortField, setSortField] = useState<string | null>('datum');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  // Stanje za filtriranje
  const [filterField, setFilterField] = useState<string | null>(null);
  const [filterValue, setFilterValue] = useState<string>('');
  const [isFiltering, setIsFiltering] = useState<boolean>(false);

  // Fetch initial data on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch vehicles for the form
        const vozilaData = await voziloOpremaService.getAll();
        setVozila(vozilaData);
        
        // Fetch service orders will be done in the fetchNalozi function
        setError(null);
      } catch (err: any) {
        console.error('Error fetching data:', err);
        setError(err.message || 'Došlo je do greške prilikom dohvaćanja podataka.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Fetch service orders with current pagination, sorting, and filtering
  useEffect(() => {
    const fetchNalozi = async () => {
      try {
        setLoading(true);
        const naloziData = await servisniNalogService.getAll();
        
        // Uređujemo podatke prema trenutnim filterima i sortiranju
        let filteredData = [...naloziData];
        
        // Primjenjujemo filtriranje
        if (filterField && filterValue) {
          filteredData = filteredData.filter(nalog => {
            // Podržavamo filtriranje ugniježđenih polja (npr. voziloOprema.naziv_vozila_usluge)
            if (filterField.includes('.')) {
              const parts = filterField.split('.');
              let value = nalog;
              
              // Prolazimo kroz sve razine ugniježđenih objekata
              for (const part of parts) {
                // @ts-ignore - dinamički pristup
                if (!value || !value[part]) return false;
                // @ts-ignore - dinamički pristup
                value = value[part];
              }
              
              return String(value).toLowerCase().includes(filterValue.toLowerCase());
            }
            
            // @ts-ignore - dinamički pristup
            return nalog[filterField] && String(nalog[filterField]).toLowerCase().includes(filterValue.toLowerCase());
          });
        }
        
        // Čuvamo ukupan broj stavki nakon filtriranja
        setTotalItems(filteredData.length);
        
        // Primjenjujemo sortiranje
        if (sortField) {
          filteredData.sort((a, b) => {
            // Podržavamo sortiranje ugniježđenih polja (npr. voziloOprema.naziv_vozila_usluge)
            let valueA, valueB;
            
            if (sortField.includes('.')) {
              const parts = sortField.split('.');
              let objA = a;
              let objB = b;
              
              // Prolazimo kroz sve razine ugniježđenih objekata
              for (const part of parts) {
                // @ts-ignore - dinamički pristup
                objA = objA && objA[part];
                // @ts-ignore - dinamički pristup
                objB = objB && objB[part];
              }
              
              valueA = objA;
              valueB = objB;
            } else {
              // @ts-ignore - dinamički pristup
              valueA = a[sortField];
              // @ts-ignore - dinamički pristup
              valueB = b[sortField];
            }
            
            // Ako su podaci stringovi, pretvaramo ih u lowercase za usporedbu
            if (typeof valueA === 'string') valueA = valueA.toLowerCase();
            if (typeof valueB === 'string') valueB = valueB.toLowerCase();
            
            // Ako je jedan od vrijednosti null/undefined, tretiraj ih posebno
            if (valueA === null || valueA === undefined) return sortDirection === 'asc' ? -1 : 1;
            if (valueB === null || valueB === undefined) return sortDirection === 'asc' ? 1 : -1;
            
            if (valueA < valueB) return sortDirection === 'asc' ? -1 : 1;
            if (valueA > valueB) return sortDirection === 'asc' ? 1 : -1;
            return 0;
          });
        }
        
        // Primjenjujemo paginaciju
        const start = (currentPage - 1) * pageSize;
        const paginatedData = filteredData.slice(start, start + pageSize);
        
        setNalozi(paginatedData);
        setError(null);
      } catch (err: any) {
        console.error('Error fetching service orders:', err);
        setError(err.message || 'Došlo je do greške prilikom dohvaćanja podataka o servisnim nalozima.');
      } finally {
        setLoading(false);
      }
    };

    fetchNalozi();
  }, [currentPage, pageSize, sortField, sortDirection, filterField, filterValue]);

  // Računamo ukupan broj stranica
  const totalPages = useMemo(() => Math.ceil(totalItems / pageSize), [totalItems, pageSize]);

  // Helper function to format date for display
  const formatDate = (dateStr: string | null | undefined): string => {
    if (!dateStr) return '-';
    return new Date(dateStr).toLocaleDateString('hr-HR');
  };

  // Helper function to format currency
  const formatCurrency = (amount: number | null | undefined): string => {
    if (amount === null || amount === undefined) return '-';
    return new Intl.NumberFormat('hr-HR', { style: 'currency', currency: 'EUR' }).format(amount);
  };

  // Handler za sortiranje
  const handleSort = (field: string) => {
    if (sortField === field) {
      // Mijenjamo smjer sortiranja ako je isto polje
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      // Postavljamo novo polje sortiranja
      setSortField(field);
      setSortDirection('asc');
    }
    // Vraćamo se na prvu stranicu
    setCurrentPage(1);
  };

  // Handler za filtriranje
  const handleFilter = (field: string, value: string) => {
    setFilterField(field);
    setFilterValue(value);
    setIsFiltering(true);
    // Vraćamo se na prvu stranicu
    setCurrentPage(1);
  };

  // Handler za brisanje filtra
  const handleClearFilter = () => {
    setFilterField(null);
    setFilterValue('');
    setIsFiltering(false);
    // Vraćamo se na prvu stranicu
    setCurrentPage(1);
  };

  // Handle adding new service order
  const handleAddNew = () => {
    setEditingNalog(null);
    setIsFormOpen(true);
  };

  // Handle editing service order
  const handleEdit = (nalog: ServisniNalog) => {
    setEditingNalog(nalog);
    setIsFormOpen(true);
  };

  // Handle delete
  const handleDelete = async (id: number) => {
    if (window.confirm('Jeste li sigurni da želite obrisati ovaj servisni nalog?')) {
      try {
        await servisniNalogService.delete(id);
        setNalozi(nalozi.filter(nalog => nalog.id !== id));
        // Ažuriramo ukupan broj stavki
        setTotalItems(prevTotal => prevTotal - 1);
      } catch (err: any) {
        console.error('Error deleting service order:', err);
        alert(err.message || 'Došlo je do greške prilikom brisanja.');
      }
    }
  };

  // Handle form submit (create or update)
  const handleFormSubmit = async (data: CreateServisniNalogDto) => {
    try {
      if (editingNalog) {
        // Update existing
        const updated = await servisniNalogService.update(editingNalog.id, data);
        setNalozi(nalozi.map(n => n.id === editingNalog.id ? updated : n));
      } else {
        // Create new
        const created = await servisniNalogService.create(data);
        
        // Fetch complete details for the newly created record to ensure all related data is loaded
        const completeRecord = await servisniNalogService.getById(created.id);
        
        // Ažuriramo ukupan broj stavki
        setTotalItems(prevTotal => prevTotal + 1);
        
        // Ako je trenutna stranica puna, možda će trebati prikazati novu stranicu
        if (nalozi.length >= pageSize) {
          const newTotalPages = Math.ceil((totalItems + 1) / pageSize);
          if (currentPage < newTotalPages) {
            setCurrentPage(newTotalPages);
          } else {
            // Inače dodajemo na trenutnu stranicu sa svim detaljima
            setNalozi([...nalozi, completeRecord]);
          }
        } else {
          // Dodajemo na trenutnu stranicu sa svim detaljima
          setNalozi([...nalozi, completeRecord]);
        }
      }
      setIsFormOpen(false);
    } catch (err: any) {
      console.error('Error saving service order:', err);
      throw new Error(err.message || 'Došlo je do greške prilikom spremanja.');
    }
  };

  return (
    <div style={{ width: '100% !important', maxWidth: '100% !important' }}>
      {/* Header */}
      <div className="bg-white py-6 px-4">
        <div className="max-w-full mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold flex items-center text-gray-800">
            <FileText className="mr-2 text-indigo-600" />
            Servisni Nalozi
          </h1>
          <button
            onClick={handleAddNew}
            className="flex items-center bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md font-medium"
          >
            <Plus size={20} className="mr-2" />
            Dodaj novi
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="bg-gray-50 px-4 py-6">
        <div className="max-w-full mx-auto">
          {/* Filteri */}
          <TableFilter 
            onFilter={handleFilter}
            onClearFilter={handleClearFilter}
            filterOptions={filterOptions}
            isFiltering={isFiltering}
          />

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative my-4" role="alert">
              <div className="flex">
                <AlertCircle className="h-5 w-5 mr-2" />
                <span>{error}</span>
              </div>
            </div>
          )}

          {loading ? (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
            </div>
          ) : (
            <div className="w-full overflow-x-auto rounded-lg shadow mt-4">
              <table style={{ width: '100% !important' }} className="w-full bg-white table-fixed">
                <thead className="bg-gray-100 text-gray-700">
                  <tr>
                    <SortableHeader
                      label="Datum"
                      field="datum"
                      currentSortField={sortField}
                      currentSortDirection={sortDirection}
                      onSort={handleSort}
                    />
                    <SortableHeader
                      label="Vozilo/Oprema"
                      field="voziloOprema.naziv_vozila_usluge"
                      currentSortField={sortField}
                      currentSortDirection={sortDirection}
                      onSort={handleSort}
                    />
                    <SortableHeader
                      label="Opis servisa"
                      field="opis_servisa"
                      currentSortField={sortField}
                      currentSortDirection={sortDirection}
                      onSort={handleSort}
                    />
                    <SortableHeader
                      label="Broj računa"
                      field="racun_broj"
                      currentSortField={sortField}
                      currentSortDirection={sortDirection}
                      onSort={handleSort}
                    />
                    <SortableHeader
                      label="Iznos"
                      field="iznos"
                      currentSortField={sortField}
                      currentSortDirection={sortDirection}
                      onSort={handleSort}
                    />
                    <th className="py-3 px-4 text-left">Promjene</th>
                    <th className="py-3 px-4 text-center">Akcije</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {nalozi.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-4 px-4 text-center text-gray-500">
                        Nema podataka za prikaz
                      </td>
                    </tr>
                  ) : (
                    nalozi.map(nalog => (
                      <tr key={nalog.id} className="hover:bg-gray-50">
                        <td className="py-3 px-4">{formatDate(nalog.datum)}</td>
                        <td className="py-3 px-4">
                          <div>{nalog.voziloOprema?.naziv_vozila_usluge || '-'}</div>
                          {nalog.voziloOprema?.broj_tablica_vozila_opreme && (
                            <div className="text-xs text-gray-500">
                              {nalog.voziloOprema.broj_tablica_vozila_opreme}
                            </div>
                          )}
                        </td>
                        <td className="py-3 px-4">
                          <div className="max-w-xs truncate">{nalog.opis_servisa}</div>
                        </td>
                        <td className="py-3 px-4">{nalog.racun_broj || '-'}</td>
                        <td className="py-3 px-4">{formatCurrency(nalog.iznos)}</td>
                        <td className="py-3 px-4">
                          <div className="flex space-x-2">
                            {nalog.promjena_ulja && (
                              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                Ulje
                              </span>
                            )}
                            {nalog.promjena_filtera && (
                              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                Filter
                              </span>
                            )}
                            {nalog.novi_datum_godisnje_inspekcije && (
                              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                                Inspekcija
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <div className="flex justify-center space-x-2">
                            <button 
                              className="p-1 text-blue-600 hover:text-blue-800"
                              onClick={() => handleEdit(nalog)}
                              title="Uredi"
                            >
                              <Edit size={18} />
                            </button>
                            <button 
                              className="p-1 text-red-600 hover:text-red-800"
                              onClick={() => handleDelete(nalog.id)}
                              title="Obriši"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
              
              {/* Paginacija */}
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

          {/* Form for adding/editing service orders */}
          <ServisniNalogForm
            isOpen={isFormOpen}
            initialData={editingNalog}
            vozila={vozila}
            onSubmit={handleFormSubmit}
            onCancel={() => setIsFormOpen(false)}
          />
        </div>
      </div>
    </div>
  );
};

export default ServisniNaloziPage; 