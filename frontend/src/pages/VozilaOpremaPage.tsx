import React, { useState, useEffect, useMemo } from 'react';
import voziloOpremaService from '../services/voziloOpremaService';
import firmaService from '../services/firmaService';
import lokacijaService from '../services/lokacijaService';
import type { VoziloOprema, CreateVoziloOpremaDto } from '../services/voziloOpremaService';
import type { Firma } from '../services/firmaService';
import type { Lokacija } from '../services/lokacijaService';
import { Truck, Edit, Trash2, Plus, AlertCircle, Info } from 'lucide-react';
import VozilaOpremaForm from '../components/VozilaOpremaForm';
import VoziloOpremaDetalji from '../components/VoziloOpremaDetalji';
import TablePagination from '../components/TablePagination';
import TableFilter from '../components/TableFilter';
import SortableHeader from '../components/SortableHeader';

// Definicija opcija za filtriranje
const filterOptions = [
  { key: 'naziv_vozila_usluge', label: 'Naziv' },
  { key: 'broj_tablica_vozila_opreme', label: 'Broj tablica' },
  { key: 'firma.naziv', label: 'Firma' },
  { key: 'lokacija.naziv', label: 'Lokacija' },
  { key: 'status', label: 'Status' },
];

type SortDirection = 'asc' | 'desc' | null;

const VozilaOpremaPage: React.FC = () => {
  // Stanje za podatke
  const [vozila, setVozila] = useState<VoziloOprema[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState<boolean>(false);
  const [editingVozilo, setEditingVozilo] = useState<VoziloOprema | null>(null);
  const [firme, setFirme] = useState<Firma[]>([]);
  const [lokacije, setLokacije] = useState<Lokacija[]>([]);

  // Stanje za paginaciju
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [totalItems, setTotalItems] = useState<number>(0);

  // Stanje za sortiranje
  const [sortField, setSortField] = useState<string | null>('naziv_vozila_usluge');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

  // Stanje za filtriranje
  const [filterField, setFilterField] = useState<string | null>(null);
  const [filterValue, setFilterValue] = useState<string>('');
  const [isFiltering, setIsFiltering] = useState<boolean>(false);

  // Novo stanje za detalje vozila/opreme
  const [selectedVozilo, setSelectedVozilo] = useState<VoziloOprema | null>(null);
  const [isDetaljiOpen, setIsDetaljiOpen] = useState<boolean>(false);

  // Fetch initial data on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch firms and locations for the form
        const firmeData = await firmaService.getAll();
        setFirme(firmeData);
        
        const lokacijeData = await lokacijaService.getAll();
        setLokacije(lokacijeData);
        
        // Fetch vehicles will be done in the fetchVehicles function
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

  // Fetch vehicles with current pagination, sorting, and filtering
  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        setLoading(true);
        const vozilaData = await voziloOpremaService.getAll();
        
        // Uređujemo podatke prema trenutnim filterima i sortiranju
        let filteredData = [...vozilaData];
        
        // Primjenjujemo filtriranje
        if (filterField && filterValue) {
          filteredData = filteredData.filter(vozilo => {
            // Podržavamo filtriranje ugniježđenih polja (npr. firma.naziv)
            if (filterField.includes('.')) {
              const [parent, child] = filterField.split('.');
              // @ts-ignore - dinamički pristup
              return vozilo[parent] && String(vozilo[parent][child]).toLowerCase().includes(filterValue.toLowerCase());
            }
            
            // @ts-ignore - dinamički pristup
            return String(vozilo[filterField]).toLowerCase().includes(filterValue.toLowerCase());
          });
        }
        
        // Čuvamo ukupan broj stavki nakon filtriranja
        setTotalItems(filteredData.length);
        
        // Primjenjujemo sortiranje
        if (sortField) {
          filteredData.sort((a, b) => {
            // Podržavamo sortiranje ugniježđenih polja (npr. firma.naziv)
            let valueA, valueB;
            
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
        
        setVozila(paginatedData);
        setError(null);
      } catch (err: any) {
        console.error('Error fetching vehicles:', err);
        setError(err.message || 'Došlo je do greške prilikom dohvaćanja podataka o vozilima.');
      } finally {
        setLoading(false);
      }
    };

    fetchVehicles();
  }, [currentPage, pageSize, sortField, sortDirection, filterField, filterValue]);

  // Računamo ukupan broj stranica
  const totalPages = useMemo(() => Math.ceil(totalItems / pageSize), [totalItems, pageSize]);

  // Helper function to format date for display
  const formatDate = (dateStr: string | null | undefined): string => {
    if (!dateStr) return '-';
    return new Date(dateStr).toLocaleDateString('hr-HR');
  };

  // Helper function to determine status color
  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'Aktivan':
        return 'bg-green-100 text-green-800';
      case 'Neaktivan':
        return 'bg-gray-100 text-gray-800';
      case 'Na servisu':
        return 'bg-yellow-100 text-yellow-800';
      case 'Čeka dijelove':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Helper function to determine date color based on days remaining
  const getDayColor = (days: number | null | undefined): string => {
    if (days === null || days === undefined) return '';
    if (days < 0) return 'text-red-600 font-medium';
    if (days < 30) return 'text-orange-600 font-medium';
    return 'text-green-600';
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

  // Handle adding new vehicle/equipment
  const handleAddNew = () => {
    setEditingVozilo(null);
    setIsFormOpen(true);
  };

  // Handle editing vehicle/equipment
  const handleEdit = (vozilo: VoziloOprema) => {
    setEditingVozilo(vozilo);
    setIsFormOpen(true);
  };

  // Handle delete
  const handleDelete = async (id: number) => {
    if (window.confirm('Jeste li sigurni da želite obrisati ovo vozilo/opremu?')) {
      try {
        await voziloOpremaService.delete(id);
        setVozila(vozila.filter(vozilo => vozilo.id !== id));
        // Ažuriramo ukupan broj stavki
        setTotalItems(prevTotal => prevTotal - 1);
      } catch (err: any) {
        console.error('Error deleting vozilo:', err);
        alert(err.message || 'Došlo je do greške prilikom brisanja.');
      }
    }
  };

  // Handle form submit (create or update)
  const handleFormSubmit = async (data: CreateVoziloOpremaDto) => {
    try {
      if (editingVozilo) {
        // Update existing
        const updated = await voziloOpremaService.update(editingVozilo.id, data);
        setVozila(vozila.map(v => v.id === editingVozilo.id ? updated : v));
      } else {
        // Create new
        const created = await voziloOpremaService.create(data);
        // Ažuriramo ukupan broj stavki
        setTotalItems(prevTotal => prevTotal + 1);
        
        // Ako je trenutna stranica puna, možda će trebati prikazati novu stranicu
        if (vozila.length >= pageSize) {
          const newTotalPages = Math.ceil((totalItems + 1) / pageSize);
          if (currentPage < newTotalPages) {
            setCurrentPage(newTotalPages);
          } else {
            // Inače dodajemo na trenutnu stranicu
            setVozila([...vozila, created]);
          }
        } else {
          // Dodajemo na trenutnu stranicu
          setVozila([...vozila, created]);
        }
      }
      setIsFormOpen(false);
    } catch (err: any) {
      console.error('Error saving vozilo:', err);
      throw new Error(err.message || 'Došlo je do greške prilikom spremanja.');
    }
  };

  // Handler za otvaranje detalja vozila/opreme
  const handlePrikaziDetalje = (vozilo: VoziloOprema) => {
    setSelectedVozilo(vozilo);
    setIsDetaljiOpen(true);
  };

  return (
    <div style={{ width: '100% !important', maxWidth: '100% !important' }}>
      {/* Header */}
      <div className="bg-white py-6 px-4">
        <div className="max-w-full mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold flex items-center text-gray-800">
            <Truck className="mr-2 text-indigo-600" />
            Vozila/Oprema
          </h1>
          <button
            onClick={handleAddNew}
            className="flex items-center bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md font-medium"
          >
            <Plus size={20} className="mr-2" />
            Dodaj novo
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
                      field="naziv_vozila_usluge"
                      currentSortField={sortField}
                      currentSortDirection={sortDirection}
                      onSort={handleSort}
                    />
                    <SortableHeader
                      label="Broj tablica"
                      field="broj_tablica_vozila_opreme"
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
                    <SortableHeader
                      label="Lokacija"
                      field="lokacija.naziv"
                      currentSortField={sortField}
                      currentSortDirection={sortDirection}
                      onSort={handleSort}
                    />
                    <SortableHeader
                      label="Status"
                      field="status"
                      currentSortField={sortField}
                      currentSortDirection={sortDirection}
                      onSort={handleSort}
                    />
                    <SortableHeader
                      label="Inspekcija"
                      field="godisnja_inspekcija_datum"
                      currentSortField={sortField}
                      currentSortDirection={sortDirection}
                      onSort={handleSort}
                    />
                    <SortableHeader
                      label="Filter"
                      field="datum_isteka_filtera_izracunat"
                      currentSortField={sortField}
                      currentSortDirection={sortDirection}
                      onSort={handleSort}
                    />
                    <th className="py-3 px-4 text-center">Akcije</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {vozila.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="py-4 px-4 text-center text-gray-500">
                        Nema podataka za prikaz
                      </td>
                    </tr>
                  ) : (
                    vozila.map(vozilo => (
                      <tr key={vozilo.id} className="hover:bg-gray-50">
                        <td className="py-3 px-4">{vozilo.naziv_vozila_usluge}</td>
                        <td className="py-3 px-4">{vozilo.broj_tablica_vozila_opreme}</td>
                        <td className="py-3 px-4">{vozilo.firma?.naziv || '-'}</td>
                        <td className="py-3 px-4">{vozilo.lokacija?.naziv || '-'}</td>
                        <td className="py-3 px-4">
                          <span className={`inline-block rounded-full px-3 py-1 text-xs ${getStatusColor(vozilo.status)}`}>
                            {vozilo.status === 'Na servisu' ? 'U servisu' : 
                              vozilo.status.charAt(0).toUpperCase() + vozilo.status.slice(1)}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <div>{formatDate(vozilo.godisnja_inspekcija_datum)}</div>
                          {vozilo.dana_do_godisnje_inspekcije !== null && (
                            <div className={`text-xs ${getDayColor(vozilo.dana_do_godisnje_inspekcije)}`}>
                              {vozilo.dana_do_godisnje_inspekcije} dana
                            </div>
                          )}
                        </td>
                        <td className="py-3 px-4">
                          <div>{formatDate(vozilo.datum_isteka_filtera_izracunat)}</div>
                          {vozilo.dana_do_zamjene_filtera !== null && (
                            <div className={`text-xs ${getDayColor(vozilo.dana_do_zamjene_filtera)}`}>
                              {vozilo.dana_do_zamjene_filtera} dana
                            </div>
                          )}
                        </td>
                        <td className="py-3 px-4 text-center">
                          <div className="flex justify-center space-x-2">
                            <button 
                              className="p-1 text-indigo-600 hover:text-indigo-800"
                              onClick={() => handlePrikaziDetalje(vozilo)}
                              title="Prikaži detalje"
                            >
                              <Info size={18} />
                            </button>
                            <button 
                              className="p-1 text-blue-600 hover:text-blue-800"
                              onClick={() => handleEdit(vozilo)}
                            >
                              <Edit size={18} />
                            </button>
                            <button 
                              className="p-1 text-red-600 hover:text-red-800"
                              onClick={() => handleDelete(vozilo.id)}
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

          {/* Form for adding/editing vehicles */}
          <VozilaOpremaForm
            isOpen={isFormOpen}
            initialData={editingVozilo}
            firme={firme}
            lokacije={lokacije}
            onSubmit={handleFormSubmit}
            onCancel={() => {
              setIsFormOpen(false);
              setEditingVozilo(null);
            }}
          />
          
          {/* Modal za prikaz detalja vozila/opreme */}
          <VoziloOpremaDetalji 
            isOpen={isDetaljiOpen}
            vozilo={selectedVozilo}
            onClose={() => {
              setIsDetaljiOpen(false);
              setSelectedVozilo(null);
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default VozilaOpremaPage; 