import React, { useEffect, useRef, useState } from 'react';
import { SearchIcon, ViewColumnsIcon } from '../../../../assets/icons';

type ReportColumnSelectorProps = {
  updateColumns: (columns: string) => void;
  visibleColumns: string[];
  areAllColsSelected: boolean;
};
const ReportColumnSelector: React.FC<ReportColumnSelectorProps> = ({
  updateColumns,
  visibleColumns,
  areAllColsSelected,
}) => {
  const [isHovered, setIsHovered] = useState(false);
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

  // const columnNames = [
  //   { name: 'empName', label: 'Employee Name' },
  //   { name: 'basicSalary', label: 'Basic Salary' },
  //   { name: 'hra', label: 'House Rent' },
  //   { name: 'conveyance', label: 'Conveyance' },
  //   { name: 'kitWashingAllowance', label: 'Kit/Washing Allowance' },
  //   { name: 'uniformAllowance', label: 'Uniform' },
  //   { name: 'cityAllowance', label: 'City Allowance' },
  //   { name: 'vda', label: 'VDA' },
  //   { name: 'otherAllowance', label: 'Others' },
  // ];
  const alwaysVisibleColumns = [
    'empName',
    'designation',
    'basicSalary',
    'grossPay',
    'empEPF',
    'empESI',
    'empPF',
    'empESIP',
    'netPay',
  ];

  const columnNames = [
    { name: 'empName', label: 'Employee Name' },
    { name: 'designation', label: 'Rank' },
    { name: 'workingDays', label: 'Working Days' },
    { name: 'basicSalary', label: 'Basic Salary' },
    { name: 'uniform', label: 'Uniform' },
    { name: 'bonus', label: 'Bonus' },
    { name: 'grossPay', label: 'Gross Pay / Total' },
    { name: 'extraDuty', label: 'Extra Duty' },
    { name: 'empEPF', label: 'Employee EPF' },
    { name: 'empESI', label: 'Employee ESI' },
    { name: 'empPF', label: 'Employer EPF' },
    { name: 'empESIP', label: 'Employer ESI' },
    { name: 'pTax', label: 'P. Tax' },
    { name: 'otherDeduction', label: 'Other Deduction' },
    { name: 'totalDeduction', label: 'Total Deduction' },
    { name: 'netPay', label: 'Net Pay' },
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
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className={`flex items-center justify-center ${isHovered ? 'hover:border-accordionBg' : ''}  hover:duration-200`}
        >
          <span className="mr-2">
            <img src={ViewColumnsIcon} alt="" className="w-6 h-6" />
          </span>
        </button>
        {/* {columnsOpen && (
          <div
            ref={columnDropdownRef}
            className="absolute p-4 z-50 top-12 right-0 w-full h-full border border-red-600 bg-white shadow-md flex flex-col transform transition-transform duration-300"
          >
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
                      column.name === 'basicSalary'
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
        )} */}
        {columnsOpen && (
          <div
            ref={columnDropdownRef}
            className="absolute p-4 z-50 top-12 right-0 w-64 h-64 bg-white shadow-md flex flex-col overflow-y-auto"
          >
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
                    disabled={alwaysVisibleColumns.includes(column.name)}
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

export default ReportColumnSelector;
