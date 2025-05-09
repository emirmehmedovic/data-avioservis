import React, { useState } from 'react';
import { Search, X } from 'lucide-react';

interface FilterOption {
  key: string;
  label: string;
}

interface TableFilterProps {
  onFilter: (field: string, value: string) => void;
  onClearFilter: () => void;
  filterOptions: FilterOption[];
  isFiltering: boolean;
}

const TableFilter: React.FC<TableFilterProps> = ({
  onFilter,
  onClearFilter,
  filterOptions,
  isFiltering
}) => {
  const [selectedField, setSelectedField] = useState<string>(filterOptions[0]?.key || '');
  const [filterValue, setFilterValue] = useState<string>('');

  const handleFieldChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedField(e.target.value);
  };

  const handleValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilterValue(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedField && filterValue.trim()) {
      onFilter(selectedField, filterValue.trim());
    }
  };

  const handleClear = () => {
    setFilterValue('');
    onClearFilter();
  };

  return (
    <div className="mb-4">
      <form onSubmit={handleSubmit} className="flex flex-wrap items-center space-x-2">
        <div className="mb-2 sm:mb-0">
          <select
            value={selectedField}
            onChange={handleFieldChange}
            className="border border-gray-300 rounded-md text-sm px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          >
            {filterOptions.map(option => (
              <option key={option.key} value={option.key}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        
        <div className="mb-2 sm:mb-0 flex-1 min-w-[200px]">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={16} className="text-gray-400" />
            </div>
            <input
              type="text"
              value={filterValue}
              onChange={handleValueChange}
              placeholder="Pretraži..."
              className="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
            {filterValue && (
              <button
                type="button"
                onClick={() => setFilterValue('')}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                <X size={16} className="text-gray-400 hover:text-gray-600" />
              </button>
            )}
          </div>
        </div>
        
        <div className="flex space-x-2">
          <button
            type="submit"
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 text-sm"
          >
            Filtriraj
          </button>
          
          {isFiltering && (
            <button
              type="button"
              onClick={handleClear}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-100 text-sm"
            >
              Očisti
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default TableFilter; 