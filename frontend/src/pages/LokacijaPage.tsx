import React, { useState, useEffect, useMemo } from 'react';
import lokacijaService from '../services/lokacijaService';
import firmaService from '../services/firmaService';
import type { Lokacija, CreateLokacijaDto } from '../services/lokacijaService';
import type { Firma } from '../services/firmaService';
import { MapPin, Edit, Trash2, Plus, AlertCircle } from 'lucide-react';
import LokacijaForm from '../components/LokacijaForm';
import TablePagination from '../components/TablePagination';
import TableFilter from '../components/TableFilter';
import SortableHeader from '../components/SortableHeader';

// Definicija opcija za filtriranje
const filterOptions = [
  { key: 'naziv', label: 'Naziv' },
  { key: 'adresa', label: 'Adresa' },
  { key: 'firma.naziv', label: 'Firma' },
];

type SortDirection = 'asc' | 'desc' | null;

const LokacijaPage: React.FC = () => {
  // Stanje za podatke
  const [lokacije, setLokacije] = useState<Lokacija[]>([]);
  const [firme, setFirme] = useState<Firma[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState<boolean>(false);
  const [editingLokacija, setEditingLokacija] = useState<Lokacija | null>(null);

  // Stanje za paginaciju
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [totalItems, setTotalItems] = useState<number>(0);

  // Stanje za sortiranje
  const [sortField, setSortField] = useState<string | null>('naziv');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

  // Stanje za filtriranje
  const [filterField, setFilterField] = useState<string | null>(null);
  const [filterValue, setFilterValue] = useState<string>('');
  const [isFiltering, setIsFiltering] = useState<boolean>(false);

  // Dohvati firme pri prvom renderiranju
  useEffect(() => {
    const fetchFirme = async () => {
      try {
        const firmeData = await firmaService.getAll();
        setFirme(firmeData);
      } catch (err: any) {
        console.error('Error fetching firms:', err);
        setError(err.message || 'Došlo je do greške prilikom dohvaćanja podataka o firmama.');
      }
    };

    fetchFirme();
  }, []);

  // Dohvati lokacije pri prvom renderiranju ili kad se promijene parametri
  useEffect(() => {
    const fetchLokacije = async () => {
      try {
        setLoading(true);
        const lokacijeData = await lokacijaService.getAll();
        
        // Uređujemo podatke prema trenutnim filterima i sortiranju
        let filteredData = [...lokacijeData];
        
        // Primjenjujemo filtriranje
        if (filterField && filterValue) {
          filteredData = filteredData.filter(lokacija => {
            // Podržavamo filtriranje ugniježđenih polja (npr. firma.naziv)
            if (filterField.includes('.')) {
              const [parent, child] = filterField.split('.');
              // @ts-ignore - dinamički pristup
              return lokacija[parent] && String(lokacija[parent][child]).toLowerCase().includes(filterValue.toLowerCase());
            }
            
            // @ts-ignore - dinamički pristup
            const fieldValue = String(lokacija[filterField] || '').toLowerCase();
            return fieldValue.includes(filterValue.toLowerCase());
          });
        }
        
        // Čuvamo ukupan broj stavki nakon filtriranja
        setTotalItems(filteredData.length);
        
        // Primjenjujemo sortiranje
        if (sortField) {
          filteredData.sort((a, b) => {
            let valueA, valueB;
            
            // Podržavamo sortiranje ugniježđenih polja (npr. firma.naziv)
            if (sortField.includes('.')) {
              const [parent, child] = sortField.split('.');
              // @ts-ignore - dinamički pristup
              valueA = a[parent] ? a[parent][child] : '';
              // @ts-ignore - dinamički pristup
              valueB = b[parent] ? b[parent][child] : '';
            } else {
              // @ts-ignore - dinamički pristup
              valueA = a[sortField] || '';
              // @ts-ignore - dinamički pristup
              valueB = b[sortField] || '';
            }
            
            // Ako su podaci stringovi, pretvaramo ih u lowercase za usporedbu
            if (typeof valueA === 'string') valueA = valueA.toLowerCase();
            if (typeof valueB === 'string') valueB = valueB.toLowerCase();
            
            if (valueA < valueB) return sortDirection === 'asc' ? -1 : 1;
            if (valueA > valueB) return sortDirection === 'asc' ? 1 : -1;
            return 0;
          });
        }
        
        // Primjenjujemo paginaciju
        const start = (currentPage - 1) * pageSize;
        const paginatedData = filteredData.slice(start, start + pageSize);
        
        setLokacije(paginatedData);
        setError(null);
      } catch (err: any) {
        console.error('Error fetching locations:', err);
        setError(err.message || 'Došlo je do greške prilikom dohvaćanja podataka o lokacijama.');
      } finally {
        setLoading(false);
      }
    };

    fetchLokacije();
  }, [currentPage, pageSize, sortField, sortDirection, filterField, filterValue]);

  // Računamo ukupan broj stranica
  const totalPages = useMemo(() => Math.ceil(totalItems / pageSize), [totalItems, pageSize]);

  // Handler za sortiranje
  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
    setCurrentPage(1);
  };

  // Handler za filtriranje
  const handleFilter = (field: string, value: string) => {
    setFilterField(field);
    setFilterValue(value);
    setIsFiltering(true);
    setCurrentPage(1);
  };

  // Handler za brisanje filtra
  const handleClearFilter = () => {
    setFilterField(null);
    setFilterValue('');
    setIsFiltering(false);
    setCurrentPage(1);
  };

  // Handle adding new location
  const handleAddNew = () => {
    setEditingLokacija(null);
    setIsFormOpen(true);
  };

  // Handle editing location
  const handleEdit = (lokacija: Lokacija) => {
    setEditingLokacija(lokacija);
    setIsFormOpen(true);
  };

  // Handle delete
  const handleDelete = async (id: number) => {
    if (window.confirm('Jeste li sigurni da želite obrisati ovu lokaciju?')) {
      try {
        await lokacijaService.delete(id);
        setLokacije(lokacije.filter(lokacija => lokacija.id !== id));
        setTotalItems(prevTotal => prevTotal - 1);
      } catch (err: any) {
        console.error('Error deleting location:', err);
        alert(err.message || 'Došlo je do greške prilikom brisanja.');
      }
    }
  };

  // Handle form submit (create or update)
  const handleFormSubmit = async (data: CreateLokacijaDto) => {
    try {
      if (editingLokacija) {
        // Update existing
        const updated = await lokacijaService.update(editingLokacija.id, data);
        setLokacije(lokacije.map(l => l.id === editingLokacija.id ? updated : l));
      } else {
        // Create new
        const created = await lokacijaService.create(data);
        
        // Fetch complete details for the newly created record
        const completeRecord = await lokacijaService.getById(created.id);
        
        setTotalItems(prevTotal => prevTotal + 1);
        
        if (lokacije.length >= pageSize) {
          const newTotalPages = Math.ceil((totalItems + 1) / pageSize);
          if (currentPage < newTotalPages) {
            setCurrentPage(newTotalPages);
          } else {
            // Use complete record with all details
            setLokacije([...lokacije, completeRecord]);
          }
        } else {
          // Use complete record with all details
          setLokacije([...lokacije, completeRecord]);
        }
      }
      setIsFormOpen(false);
    } catch (err: any) {
      console.error('Error saving location:', err);
      throw new Error(err.message || 'Došlo je do greške prilikom spremanja.');
    }
  };

  // Helper za prikaz GPS koordinata
  const formatGPS = (lat?: number | null, lng?: number | null): string => {
    if (lat === null || lat === undefined || lng === null || lng === undefined) {
      return '-';
    }
    return `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
  };

  return (
    <div style={{ width: '100% !important', maxWidth: '100% !important' }}>
      {/* Header */}
      <div className="bg-white py-6 px-4">
        <div className="max-w-full mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold flex items-center text-gray-800">
            <MapPin className="mr-2 text-indigo-600" />
            Lokacije
          </h1>
          <button
            onClick={handleAddNew}
            className="flex items-center bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md font-medium"
          >
            <Plus size={20} className="mr-2" />
            Dodaj novu
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
                      label="Naziv"
                      field="naziv"
                      currentSortField={sortField}
                      currentSortDirection={sortDirection}
                      onSort={handleSort}
                    />
                    <SortableHeader
                      label="Adresa"
                      field="adresa"
                      currentSortField={sortField}
                      currentSortDirection={sortDirection}
                      onSort={handleSort}
                    />
                    <SortableHeader
                      label="Firma"
                      field="firma.naziv"
                      currentSortField={sortField}
                      currentSortDirection={sortDirection}
                      onSort={handleSort}
                    />
                    <th className="py-3 px-4 text-left hidden md:table-cell">GPS Koordinate</th>
                    <th className="py-3 px-4 text-center">Akcije</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {lokacije.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-4 px-4 text-center text-gray-500">
                        Nema podataka za prikaz
                      </td>
                    </tr>
                  ) : (
                    lokacije.map(lokacija => (
                      <tr key={lokacija.id} className="hover:bg-gray-50">
                        <td className="py-3 px-4">{lokacija.naziv}</td>
                        <td className="py-3 px-4">{lokacija.adresa}</td>
                        <td className="py-3 px-4">{lokacija.firma?.naziv || '-'}</td>
                        <td className="py-3 px-4 hidden md:table-cell">
                          {formatGPS(lokacija.gps_latitude, lokacija.gps_longitude)}
                        </td>
                        <td className="py-3 px-4 text-center">
                          <div className="flex justify-center space-x-2">
                            <button 
                              className="p-1 text-blue-600 hover:text-blue-800"
                              onClick={() => handleEdit(lokacija)}
                              title="Uredi"
                            >
                              <Edit size={18} />
                            </button>
                            <button 
                              className="p-1 text-red-600 hover:text-red-800"
                              onClick={() => handleDelete(lokacija.id)}
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

          {/* Form za dodavanje/uređivanje lokacija */}
          <LokacijaForm
            isOpen={isFormOpen}
            initialData={editingLokacija}
            firme={firme}
            onSubmit={handleFormSubmit}
            onCancel={() => setIsFormOpen(false)}
          />
        </div>
      </div>
    </div>
  );
};

export default LokacijaPage; 