import React from 'react';
import { ArrowUp, ArrowDown, ArrowUpDown } from 'lucide-react';

type SortDirection = 'asc' | 'desc' | null;

interface SortableHeaderProps {
  label: string;
  field: string;
  currentSortField: string | null;
  currentSortDirection: SortDirection;
  onSort: (field: string) => void;
  className?: string;
}

const SortableHeader: React.FC<SortableHeaderProps> = ({
  label,
  field,
  currentSortField,
  currentSortDirection,
  onSort,
  className = ''
}) => {
  // Determine if this column is being sorted
  const isActive = currentSortField === field;
  
  // Handler for clicking on the header
  const handleSort = () => {
    onSort(field);
  };
  
  // Render the appropriate sort icon
  const renderSortIcon = () => {
    if (!isActive) {
      return <ArrowUpDown size={16} className="ml-1 text-gray-400" />;
    }
    
    return currentSortDirection === 'asc' ? (
      <ArrowUp size={16} className="ml-1 text-indigo-600" />
    ) : (
      <ArrowDown size={16} className="ml-1 text-indigo-600" />
    );
  };
  
  return (
    <th 
      className={`py-3 px-4 text-left cursor-pointer hover:bg-gray-50 ${className} ${isActive ? 'bg-indigo-50' : ''}`}
      onClick={handleSort}
    >
      <div className="flex items-center">
        <span>{label}</span>
        {renderSortIcon()}
      </div>
    </th>
  );
};

export default SortableHeader; 