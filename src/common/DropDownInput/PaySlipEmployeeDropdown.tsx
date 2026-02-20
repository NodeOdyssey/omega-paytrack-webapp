import React, { useEffect, useRef, useState } from 'react';
import {
  Keyboard_Arrow_Down,
  Keyboard_Arrow_Up,
  SearchIcon,
} from '../../assets/icons';

// types

interface Employee {
  ID: string;
  empName: string;
}

interface Props {
  employees: Employee[];
  selectedIndex: number;
  onSelect: (index: number) => void;
  placeholder?: string;
  disabled?: boolean;
}

// jsx
const PaySlipEmployeeDropdown: React.FC<Props> = ({
  employees,
  selectedIndex,
  onSelect,
  placeholder = 'Select Employee',
  disabled = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // click outside

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // filter

  const filteredEmployees = employees.filter((emp) =>
    emp.empName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // handlers

  const toggleDropdown = () => {
    if (disabled) return;

    setIsOpen((prev) => !prev);

    setTimeout(() => {
      searchInputRef.current?.focus();
    }, 100);
  };

  const handleSelect = (id: string) => {
    const index = employees.findIndex((e) => e.ID === id);

    if (index !== -1) {
      onSelect(index);
    }

    setIsOpen(false);
    setSearchTerm('');
  };

  // jsx
  return (
    <div ref={dropdownRef} className="relative w-72 select-none">
      {/* Button */}
      <button
        type="button"
        disabled={disabled}
        onClick={toggleDropdown}
        className={`w-full flex justify-between items-center border px-3 py-2 rounded 
          ${disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white hover:bg-gray-50'}
        `}
      >
        <span className="truncate font-medium">
          {employees[selectedIndex]?.empName || placeholder}
        </span>

        {/* <span className="ml-2 text-gray-500 text-sm">{isOpen ? '▲' : '▼'}</span> */}
        <span className={`transform transition-transform`}>
          {isOpen ? (
            <img
              src={Keyboard_Arrow_Up}
              alt="Arrow Up"
              className="dropdown-menu-icon"
            />
          ) : (
            <img
              src={Keyboard_Arrow_Down}
              alt="Arrow Down"
              className="dropdown-menu-icon"
            />
          )}
        </span>
      </button>

      {/* Dropdown */}
      {isOpen && !disabled && (
        <div className="absolute right-0 mt-1 w-full bg-white border rounded shadow-lg z-50">
          {/* Search */}
          <div className="flex items-center p-2 relative">
            <input
              ref={searchInputRef}
              type="search"
              placeholder="Search employee..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full border rounded px-6 py-1 text-sm 
                         focus:outline-none focus:ring-1 focus:ring-black focus:ring-opacity-50"
            />
            <img
              src={SearchIcon}
              alt="Search Icon"
              className="dropdown-search-icon ml-1"
            />
          </div>

          {/* List */}
          <ul className="max-h-64 overflow-y-auto text-sm">
            {filteredEmployees.length > 0 ? (
              filteredEmployees.map((emp) => (
                <li
                  key={emp.ID}
                  onClick={() => handleSelect(emp.ID)}
                  className="px-3 py-2 cursor-pointer hover:bg-blue-50 truncate font-medium"
                >
                  {emp.empName}
                </li>
              ))
            ) : (
              <li className="px-3 py-2 text-gray-400">No results found</li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default PaySlipEmployeeDropdown;
