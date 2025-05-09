import React, { useState, useEffect, useMemo } from 'react';
import userService from '../services/userService';
import type { User, CreateUserDto, UpdateUserDto } from '../services/userService';
import { Users, Edit, Trash2, Plus, AlertCircle, Shield } from 'lucide-react';
import KorisniciForm from '../components/KorisniciForm';
import TablePagination from '../components/TablePagination';
import TableFilter from '../components/TableFilter';
import SortableHeader from '../components/SortableHeader';
import { useAuth } from '../contexts/AuthContext';

// Definicija opcija za filtriranje
const filterOptions = [
  { key: 'username', label: 'Korisničko ime' },
  { key: 'email', label: 'Email' },
  { key: 'role', label: 'Uloga' },
];

type SortDirection = 'asc' | 'desc' | null;

const KorisniciPage: React.FC = () => {
  // Dohvaćamo informacije o prijavljenom korisniku
  const { user: currentUser } = useAuth();

  // Stanje za podatke
  const [korisnici, setKorisnici] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState<boolean>(false);
  const [editingKorisnik, setEditingKorisnik] = useState<User | null>(null);

  // Stanje za paginaciju
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [totalItems, setTotalItems] = useState<number>(0);

  // Stanje za sortiranje
  const [sortField, setSortField] = useState<string | null>('username');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

  // Stanje za filtriranje
  const [filterField, setFilterField] = useState<string | null>(null);
  const [filterValue, setFilterValue] = useState<string>('');
  const [isFiltering, setIsFiltering] = useState<boolean>(false);

  // Dohvati korisnike pri prvom renderiranju ili kad se promijene parametri
  useEffect(() => {
    const fetchKorisnici = async () => {
      try {
        setLoading(true);
        const korisniciData = await userService.getAll();
        
        // Uređujemo podatke prema trenutnim filterima i sortiranju
        let filteredData = [...korisniciData];
        
        // Primjenjujemo filtriranje
        if (filterField && filterValue) {
          filteredData = filteredData.filter(korisnik => {
            // @ts-ignore - dinamički pristup polju
            const fieldValue = String(korisnik[filterField] || '').toLowerCase();
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
        
        setKorisnici(paginatedData);
        setError(null);
      } catch (err: any) {
        console.error('Error fetching users:', err);
        setError(err.message || 'Došlo je do greške prilikom dohvaćanja podataka o korisnicima.');
      } finally {
        setLoading(false);
      }
    };

    fetchKorisnici();
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

  // Handle adding new user
  const handleAddNew = () => {
    setEditingKorisnik(null);
    setIsFormOpen(true);
  };

  // Handle editing user
  const handleEdit = (korisnik: User) => {
    setEditingKorisnik(korisnik);
    setIsFormOpen(true);
  };

  // Handle delete
  const handleDelete = async (id: number) => {
    // Spriječi brisanje samog sebe
    if (currentUser?.id === id) {
      alert('Ne možete obrisati vlastiti korisnički račun.');
      return;
    }

    if (window.confirm('Jeste li sigurni da želite obrisati ovog korisnika?')) {
      try {
        await userService.delete(id);
        setKorisnici(korisnici.filter(korisnik => korisnik.id !== id));
        setTotalItems(prevTotal => prevTotal - 1);
      } catch (err: any) {
        console.error('Error deleting user:', err);
        alert(err.message || 'Došlo je do greške prilikom brisanja.');
      }
    }
  };

  // Handle form submit (create or update)
  const handleFormSubmit = async (formData: CreateUserDto | UpdateUserDto) => {
    try {
      if (editingKorisnik) {
        // Update existing
        const updated = await userService.update(editingKorisnik.id, formData);
        setKorisnici(korisnici.map(k => k.id === editingKorisnik.id ? updated : k));
      } else {
        // Create new
        const created = await userService.create(formData as CreateUserDto);
        setTotalItems(prevTotal => prevTotal + 1);
        
        if (korisnici.length >= pageSize) {
          const newTotalPages = Math.ceil((totalItems + 1) / pageSize);
          if (currentPage < newTotalPages) {
            setCurrentPage(newTotalPages);
          } else {
            setKorisnici([...korisnici, created]);
          }
        } else {
          setKorisnici([...korisnici, created]);
        }
      }
      setIsFormOpen(false);
    } catch (err: any) {
      console.error('Error saving user:', err);
      throw new Error(err.message || 'Došlo je do greške prilikom spremanja.');
    }
  };

  return (
    <div style={{ width: '100% !important', maxWidth: '100% !important' }}>
      {/* Header */}
      <div className="bg-white py-6 px-4">
        <div className="max-w-full mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold flex items-center text-gray-800">
            <Users className="mr-2 text-indigo-600" />
            Korisnici
          </h1>
          <button
            onClick={handleAddNew}
            className="flex items-center bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md font-medium"
          >
            <Plus size={20} className="mr-2" />
            Dodaj novog
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
                      label="Korisničko ime"
                      field="username"
                      currentSortField={sortField}
                      currentSortDirection={sortDirection}
                      onSort={handleSort}
                    />
                    <SortableHeader
                      label="Email"
                      field="email"
                      currentSortField={sortField}
                      currentSortDirection={sortDirection}
                      onSort={handleSort}
                    />
                    <SortableHeader
                      label="Uloga"
                      field="role"
                      currentSortField={sortField}
                      currentSortDirection={sortDirection}
                      onSort={handleSort}
                    />
                    <th className="py-3 px-4 text-center">Akcije</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {korisnici.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="py-4 px-4 text-center text-gray-500">
                        Nema podataka za prikaz
                      </td>
                    </tr>
                  ) : (
                    korisnici.map(korisnik => (
                      <tr key={korisnik.id} className="hover:bg-gray-50">
                        <td className="py-3 px-4">{korisnik.username}</td>
                        <td className="py-3 px-4">{korisnik.email}</td>
                        <td className="py-3 px-4">
                          <div className="flex items-center">
                            {korisnik.role === 'Admin' && (
                              <Shield size={16} className="mr-1 text-indigo-600" />
                            )}
                            {korisnik.role}
                          </div>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <div className="flex justify-center space-x-2">
                            <button 
                              className="p-1 text-blue-600 hover:text-blue-800"
                              onClick={() => handleEdit(korisnik)}
                              title="Uredi"
                            >
                              <Edit size={18} />
                            </button>
                            <button 
                              className={`p-1 ${korisnik.id === currentUser?.id ? 'text-gray-400 cursor-not-allowed' : 'text-red-600 hover:text-red-800'}`}
                              onClick={() => korisnik.id !== currentUser?.id && handleDelete(korisnik.id)}
                              title={korisnik.id === currentUser?.id ? 'Ne možete obrisati vlastiti račun' : 'Obriši'}
                              disabled={korisnik.id === currentUser?.id}
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

          {/* Form za dodavanje/uređivanje korisnika */}
          <KorisniciForm
            isOpen={isFormOpen}
            initialData={editingKorisnik}
            onSubmit={handleFormSubmit}
            onCancel={() => setIsFormOpen(false)}
          />
        </div>
      </div>
    </div>
  );
};

export default KorisniciPage; 