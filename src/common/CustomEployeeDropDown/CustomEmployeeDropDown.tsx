// Libraries
import React, { useRef, useState } from 'react';

// Hooks
import useClickOutside from '../../hooks/useClickOutside';

// Assets
import {
  Keyboard_Arrow_Down,
  Keyboard_Arrow_Up,
  SearchIcon,
} from '../../assets/icons';
import { Employee } from '../../types/employee';

// Prop Types
type CustomEmployeeDropDownProps = {
  // employees: { ID: number; empName: string }[];
  employees: Employee[];
  selectedEmployeeId: number;
  onChange: (id: number) => void;
  disabled: boolean;
};

const CustomEmployeeDropDown: React.FC<CustomEmployeeDropDownProps> = ({
  employees,
  selectedEmployeeId,
  onChange,
  disabled,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);
  useClickOutside(dropdownRef, () => setIsDropdownOpen(false));

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleOptionClick = (id: number) => {
    onChange(id);
    setIsDropdownOpen(false);
    setSearchTerm('');
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  // Filter employees based on the search term
  const filteredEmployees = employees.filter((employee) =>
    employee.empName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // JSX
  return (
    <>
      <div
        className="w-56 md:w-64 lg:w-72 2xl:w-full font-Mona_Sans z-40 "
        ref={dropdownRef}
      >
        <div
          className={`flex items-center justify-between p-3 rounded-lg cursor-pointer bg-white border border-gray-300 h-10 ${
            disabled ? 'cursor-not-allowed opacity-50' : ''
          }`}
          onClick={() => !disabled && setIsDropdownOpen(!isDropdownOpen)}
        >
          <span className="text-[##212529]">
            {/* {selectedOption || label} */}
            {employees.find((emp) => emp.ID === selectedEmployeeId)
              ?.empName || (
              <span className="text-gray-500">Select Employee </span>
            )}
          </span>
          <span className={`transform transition-transform`}>
            {isDropdownOpen ? (
              <img src={Keyboard_Arrow_Up} alt="Keyboard_Arrow_Up" />
            ) : (
              <img src={Keyboard_Arrow_Down} alt="Keyboard_Arrow_Down" />
            )}
          </span>
        </div>
        {/* {isOpen && ( */}
        {isDropdownOpen && (
          <div className="absolute top-0 z-50 mt-2 w-56 md:w-64 lg:w-72 bg-white border border-gray-300 rounded-md shadow-lg px-4 py-2 flex flex-col gap-4">
            <div className="flex flex-col pb-2 gap-2 border-b">
              {/* Search */}
              <div className="relative flex items-center pb-2">
                <input
                  type="search"
                  placeholder="Search"
                  value={searchTerm}
                  onChange={handleSearchChange}
                  className="w-full h-full bg-transparent focus:outline-offset-1 focus:outline-1 focus:outline-inputBorder border border-smallMenuHover rounded-md py-2 pl-8 pr-2"
                />
                <img
                  src={SearchIcon}
                  alt="SearchIcon"
                  className="absolute top-2 left-2 w-5 h-5"
                />
              </div>
              {/* Status */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="bg-[#098C35] w-3 h-3 rounded-full"></div>
                  <h2 className="text-sm font-medium">Available</h2>
                </div>
                <div className="flex items-center gap-2">
                  <div className="bg-[#B54A19] w-3 h-3 rounded-full"></div>
                  <h2 className="text-sm font-medium">Engaged</h2>
                </div>
              </div>
            </div>
            <div>
              <ul className="max-h-40 overflow-y-auto">
                {filteredEmployees.length > 0 ? (
                  filteredEmployees.map((employee) => {
                    const statusColor = employee.isPosted
                      ? 'bg-[#B54A19]'
                      : 'bg-[#098C35]';

                    return (
                      <li
                        key={employee.ID}
                        className="p-2 text-sm hover:bg-gray-100 cursor-pointer font-medium"
                        onClick={() => handleOptionClick(employee.ID as number)}
                      >
                        <div className="flex items-center gap-2">
                          <div
                            className={`${statusColor} w-3 h-3 rounded-full`}
                          ></div>
                          {employee.empName}
                        </div>
                      </li>
                    );
                  })
                ) : (
                  <li className="p-2 text-gray-500">No results found</li>
                )}
              </ul>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default CustomEmployeeDropDown;
