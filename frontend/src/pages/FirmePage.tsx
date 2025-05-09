import React, { useState, useEffect, useMemo } from 'react';
import firmaService from '../services/firmaService';
import type { Firma, CreateFirmaDto } from '../services/firmaService';
import { Building2, Edit, Trash2, Plus, AlertCircle } from 'lucide-react';
import FirmaForm from '../components/FirmaForm';
import TablePagination from '../components/TablePagination';
import TableFilter from '../components/TableFilter';
import SortableHeader from '../components/SortableHeader';
import ConfirmationDialog from '../components/ConfirmationDialog';
import { useApiErrors } from '../contexts/ApiErrorContext';

// Definicija opcija za filtriranje
const filterOptions = [
  { key: 'naziv', label: 'Naziv' },
  { key: 'adresa', label: 'Adresa' },
  { key: 'oib', label: 'OIB' },
  { key: 'kontakt_osoba', label: 'Kontakt osoba' },
  { key: 'email', label: 'Email' },
];

type SortDirection = 'asc' | 'desc' | null;

const FirmePage: React.FC = () => {
  // API Error context
  const { addError } = useApiErrors();

  // Stanje za podatke
  const [firme, setFirme] = useState<Firma[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isFormOpen, setIsFormOpen] = useState<boolean>(false);
  const [editingFirma, setEditingFirma] = useState<Firma | null>(null);

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

  // Stanje za dijalog potvrde brisanja
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState<boolean>(false);
  const [firmIdToDelete, setFirmIdToDelete] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  // Dohvati firme pri prvom renderiranju
  useEffect(() => {
    const fetchFirme = async () => {
      try {
        setLoading(true);
        const firmeData = await firmaService.getAll();
        
        // Uređujemo podatke prema trenutnim filterima i sortiranju
        let filteredData = [...firmeData];
        
        // Primjenjujemo filtriranje
        if (filterField && filterValue) {
          filteredData = filteredData.filter(firma => {
            // @ts-ignore - dinamički pristup polju
            const fieldValue = String(firma[filterField] || '').toLowerCase();
            return fieldValue.includes(filterValue.toLowerCase());
          });
        }
        
        // Čuvamo ukupan broj stavki nakon filtriranja
        setTotalItems(filteredData.length);
        
        // Primjenjujemo sortiranje
        if (sortField) {
          filteredData.sort((a, b) => {
            // @ts-ignore - dinamički pristup
            let valueA = a[sortField] || '';
            // @ts-ignore - dinamički pristup
            let valueB = b[sortField] || '';
            
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
        
        setFirme(paginatedData);
      } catch (error) {
        console.error('Error fetching firms:', error);
        // The error will be handled by the global API error handler
      } finally {
        setLoading(false);
      }
    };

    fetchFirme();
  }, [currentPage, pageSize, sortField, sortDirection, filterField, filterValue]);

  // Računamo ukupan broj stranica
  const totalPages = useMemo(() => Math.ceil(totalItems / pageSize), [totalItems, pageSize]);

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

  // Handle adding new firm
  const handleAddNew = () => {
    setEditingFirma(null);
    setIsFormOpen(true);
  };

  // Handle editing firm
  const handleEdit = (firma: Firma) => {
    setEditingFirma(firma);
    setIsFormOpen(true);
  };

  // Show confirmation dialog for delete
  const confirmDelete = (id: number) => {
    setFirmIdToDelete(id);
    setIsDeleteDialogOpen(true);
  };

  // Handle delete
  const handleDelete = async () => {
    if (firmIdToDelete === null) return;
    
    try {
      setIsDeleting(true);
      await firmaService.delete(firmIdToDelete);
      setFirme(firme.filter(firma => firma.id !== firmIdToDelete));
      // Ažuriramo ukupan broj stavki
      setTotalItems(prevTotal => prevTotal - 1);
      setIsDeleteDialogOpen(false);
      setFirmIdToDelete(null);
    } catch (error) {
      // API errors are handled globally
    } finally {
      setIsDeleting(false);
    }
  };

  // Close delete confirmation dialog
  const cancelDelete = () => {
    setIsDeleteDialogOpen(false);
    setFirmIdToDelete(null);
  };

  // Handle form submit (create or update)
  const handleFormSubmit = async (data: CreateFirmaDto) => {
    try {
      if (editingFirma) {
        // Update existing
        const updated = await firmaService.update(editingFirma.id, data);
        setFirme(firme.map(f => f.id === editingFirma.id ? updated : f));
      } else {
        // Create new
        const created = await firmaService.create(data);
        
        // Fetch complete details for the newly created record
        const completeRecord = await firmaService.getById(created.id);
        
        // Ažuriramo ukupan broj stavki
        setTotalItems(prevTotal => prevTotal + 1);
        
        // Ako je trenutna stranica puna, možda će trebati prikazati novu stranicu
        if (firme.length >= pageSize) {
          const newTotalPages = Math.ceil((totalItems + 1) / pageSize);
          if (currentPage < newTotalPages) {
            setCurrentPage(newTotalPages);
          } else {
            // Inače dodajemo na trenutnu stranicu s kompletnim podacima
            setFirme([...firme, completeRecord]);
          }
        } else {
          // Dodajemo na trenutnu stranicu s kompletnim podacima
          setFirme([...firme, completeRecord]);
        }
      }
      setIsFormOpen(false);
    } catch (error) {
      // Global error handler will catch API errors
      throw error; // rethrow to prevent form from closing
    }
  };

  return (
    <div style={{ width: '100% !important', maxWidth: '100% !important' }}>
      {/* Header */}
      <div className="bg-white py-6 px-4">
        <div className="max-w-full mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold flex items-center text-gray-800">
            <Building2 className="mr-2 text-indigo-600" />
            Firme
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
                      label="OIB"
                      field="oib"
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
                      label="Kontakt osoba"
                      field="kontakt_osoba"
                      currentSortField={sortField}
                      currentSortDirection={sortDirection}
                      onSort={handleSort}
                    />
                    <SortableHeader
                      label="Kontakt"
                      field="email"
                      currentSortField={sortField}
                      currentSortDirection={sortDirection}
                      onSort={handleSort}
                      className="hidden md:table-cell"
                    />
                    <th className="py-3 px-4 text-center">Akcije</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {firme.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-4 px-4 text-center text-gray-500">
                        Nema podataka za prikaz
                      </td>
                    </tr>
                  ) : (
                    firme.map(firma => (
                      <tr key={firma.id} className="hover:bg-gray-50">
                        <td className="py-3 px-4">{firma.naziv}</td>
                        <td className="py-3 px-4">{firma.oib}</td>
                        <td className="py-3 px-4">{firma.adresa}</td>
                        <td className="py-3 px-4">{firma.kontakt_osoba}</td>
                        <td className="py-3 px-4 hidden md:table-cell">
                          <div>{firma.email}</div>
                          <div className="text-xs text-gray-500">{firma.broj_telefona}</div>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <div className="flex justify-center space-x-2">
                            <button 
                              className="p-1 text-blue-600 hover:text-blue-800"
                              onClick={() => handleEdit(firma)}
                              title="Uredi"
                            >
                              <Edit size={18} />
                            </button>
                            <button 
                              className="p-1 text-red-600 hover:text-red-800"
                              onClick={() => confirmDelete(firma.id)}
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

          {/* Form for adding/editing firms */}
          <FirmaForm
            isOpen={isFormOpen}
            initialData={editingFirma}
            onSubmit={handleFormSubmit}
            onCancel={() => setIsFormOpen(false)}
          />

          {/* Confirmation dialog for delete */}
          <ConfirmationDialog
            isOpen={isDeleteDialogOpen}
            title="Potvrda brisanja"
            message="Jeste li sigurni da želite obrisati ovu firmu? Ova akcija je trajna i ne može se poništiti."
            confirmLabel="Izbriši"
            cancelLabel="Odustani"
            onConfirm={handleDelete}
            onCancel={cancelDelete}
            isLoading={isDeleting}
          />
        </div>
      </div>
    </div>
  );
};

export default FirmePage; 