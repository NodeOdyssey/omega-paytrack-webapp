import React, { useEffect, useRef, useState } from 'react';
import { SearchIcon, ViewColumnsIcon } from '../../../../../../assets/icons';

type ColumnCompProps = {
  updateColumns: (columns: string) => void;
  visibleColumns: string[];
  areAllColsSelected: boolean;
};

const ColumnSelector: React.FC<ColumnCompProps> = ({
  updateColumns,
  visibleColumns,
  areAllColsSelected,
}) => {
  const [columnsOpen, setColumnsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const columnDropdownRef = useRef<HTMLDivElement>(null);

  const handleColumnsOpen = () => {
    setColumnsOpen((prev) => !prev);
  };

  const handleSelectColumn = (column: string) => {
    updateColumns(column);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value.toLowerCase());
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        columnDropdownRef.current &&
        !columnDropdownRef.current.contains(event.target as Node)
      ) {
        setColumnsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const columnNames = [
    { name: 'designation', label: 'Rank' },
    { name: 'basicSalary', label: 'Basic Salary' },
    { name: 'hra', label: 'House Rent' },
    { name: 'conveyance', label: 'Conveyance' },
    { name: 'kitWashingAllowance', label: 'Kit/Washing Allowance' },
    { name: 'uniformAllowance', label: 'Uniform' },
    { name: 'cityAllowance', label: 'City Allowance' },
    // { name: 'vda', label: 'VDA' },
    // { name: 'otherAllowance', label: 'Others' },
    // added special allowance & weekly off
    { name: 'specialAllowance', label: 'Special Allowance' },
    { name: 'weeklyOff', label: 'Weekly Off' },
    // { name: 'taxGroup', label: 'Tax Group' },
  ];

  const filteredColumns = columnNames.filter((column) =>
    column.label.toLowerCase().includes(searchQuery)
  );
  return (
    <>
      <div className="flex justify-end relative">
        <button
          type="button"
          onClick={handleColumnsOpen}
          className={`flex items-center justify-center font-Mona_Sans font-semibold bg-white text-primaryText text-sm 2xl:text-base border border-inputBorder hover:border-accordionBg hover:duration-200 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-md h-8 2xl:h-10 px-3 2xl:px-4 py-1 2xl:py-2`}
        >
          <span className="mr-2">
            <img
              src={ViewColumnsIcon}
              alt=""
              className="w-4 lg:w-5 h-4 lg:h-5"
            />
          </span>
          Column
        </button>
        {columnsOpen && (
          <div
            ref={columnDropdownRef}
            className="absolute p-4 z-50 top-12 right-0 w-[30%] lg:w-[23%] xl:w-[20%] 2xl:w-[12%] h-fit bg-white shadow-md flex flex-col transform transition-transform duration-300"
          >
            {/* search */}
            <div className="relative flex items-center pb-2">
              <input
                type="search"
                name="rankSearch"
                placeholder="Search"
                value={searchQuery}
                onChange={handleSearchChange}
                className="w-full h-full pl-8 bg-transparent focus:outline-none text-xs lg:text-sm xl:text-base"
              />
              <img
                src={SearchIcon}
                alt="SearchIcon"
                className="absolute top-0 left-0 w-4 lg:w-5 h-4 lg:h-5"
              />
            </div>
            {/* select all */}
            <div className="flex gap-2 border-t border-b py-2 hover:bg-tableHeadingColour">
              <input
                type="checkbox"
                name="select"
                checked={areAllColsSelected}
                onChange={() => handleSelectColumn('all')}
              />
              <label className="text-xs lg:text-sm xl:text-base">
                Select All
              </label>
            </div>
            {/* select options */}
            <div className="flex flex-col gap-2 pt-2">
              {filteredColumns.map((column) => (
                <div
                  key={column.name}
                  className="flex gap-4 font-medium hover:bg-tableHeadingColour"
                >
                  <input
                    type="checkbox"
                    name={column.name}
                    checked={visibleColumns.includes(column.name)}
                    disabled={
                      column.name === 'designation' ||
                      column.name === 'basicSalary' ||
                      column.name === 'taxGroup'
                    }
                    onChange={() => handleSelectColumn(column.name)}
                  />
                  <label className="text-xs lg:text-sm xl:text-base">
                    {column.label}
                  </label>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default ColumnSelector;
