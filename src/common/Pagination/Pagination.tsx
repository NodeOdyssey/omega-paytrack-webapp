// Libraries
import React, { useState, useEffect } from 'react';

// Types
import { Rank } from '../../types/rank';
import { Post } from '../../types/post';
import { Employee, EmployeeTable } from '../../types/employee';
import { Payroll } from '../../types/payroll';

type SupportedTypes = Rank | Employee | EmployeeTable | Post | Payroll;

interface PaginationProps<T> {
  data: T[];
  itemsPerPage: number;
  onPageChange: (currentData: T[]) => void;
}

// const Pagination: React.FC<PaginationProps<SupportedTypes>> = <
const Pagination = <T extends SupportedTypes>({
  data,
  itemsPerPage,
  onPageChange,
}: PaginationProps<T>) => {
  const [currentPage, setCurrentPage] = React.useState(1);
  const [currentItemsPerPage, setItemsPerPage] = useState(itemsPerPage);
  const [currentData, setCurrentData] = useState<T[]>([]);
  const [inputPage, setInputPage] = useState('');

  useEffect(() => {
    setCurrentPage(1);
  }, [data]);

  const totalPages = Math.ceil(data.length / currentItemsPerPage);
  const indexOfLastItem = currentPage * currentItemsPerPage;
  const indexOfFirstItem = indexOfLastItem - currentItemsPerPage;

  useEffect(() => {
    setCurrentData(data.slice(indexOfFirstItem, indexOfLastItem));
  }, [data, indexOfFirstItem, indexOfLastItem]);

  useEffect(() => {
    onPageChange(currentData);
  }, [currentData]);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    setInputPage('');
  };

  const handleItemsPerPageChange = (newItemsPerPage: number) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
  };

  // input fields function
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^\d*$/.test(value)) {
      // Allow only numeric input
      setInputPage(value);
    }
  };

  const handlePageInputSubmit = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const page = Number(inputPage);
      if (page >= 1 && page <= totalPages) {
        handlePageChange(page);
      } else {
        alert(`Please enter a valid page number between 1 and ${totalPages}`);
      }
    }
  };

  // pagination show function
  const getPageNumbers = () => {
    const pages = [];

    if (totalPages <= 5) {
      // Show all pages if we have 5 or fewer total pages
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always include the first page
      pages.push(1);

      if (currentPage > 4) {
        // Add ellipsis after the first page if we're past the first few pages
        pages.push('...');
      }

      // Add the "window" of pages around the current page
      const startPage = Math.max(2, currentPage - 1);
      const endPage = Math.min(totalPages - 1, currentPage + 1);

      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }

      if (currentPage < totalPages - 3) {
        // Add ellipsis before the last page if we're not near the end
        pages.push('...');
      }

      // Always include the last page
      pages.push(totalPages);
    }

    return pages;
  };

  return (
    <div className="flex flex-col-reverse lg:flex-row  justify-between items-center font-Mona_Sans mt-4">
      <div className="flex items-center gap-2 text-primaryText">
        <label
          htmlFor="itemsPerPage"
          className="text-responsive-label  font-medium"
        >
          Show
        </label>
        <select
          id="itemsPerPage"
          value={currentItemsPerPage}
          onChange={(e) => handleItemsPerPageChange(Number(e.target.value))}
          className="border border-gray-300 rounded p-1 text-responsive-label "
        >
          {/* TODO: Might need to make this dynamic if we need to reuse this in payroll */}
          <option value={100}>100</option>
          <option value={300}>300</option>
          <option value={600}>600</option>
          <option value={700}>700</option>
          <option value={800}>800</option>
          <option value={900}>900</option>
          <option value={1000}>1000</option>
        </select>
        <label
          htmlFor="itemsPerPage"
          className="text-responsive-label font-medium"
        >
          results per page
        </label>
      </div>

      <div className="flex items-center gap-2 lg:gap-4 text-primaryText">
        <button
          disabled={currentPage === 1}
          onClick={() => handlePageChange(currentPage - 1)}
          className={`${
            currentPage === 1
              ? 'text-tableBorder cursor-not-allowed text-responsive-label '
              : 'text-primaryText font-semibold text-responsive-label '
          }`}
        >
          Previous
        </button>
        {/* <div>
          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index + 1}
              onClick={() => handlePageChange(index + 1)}
              className={`px-3 py-1 rounded hover:bg-[#D7D7D7] ${
                currentPage === index + 1
                  ? 'bg-[#C0D3FF] text-primaryText font-semibold text-responsive-label '
                  : 'text-secondaryText font-medium text-responsive-label '
              }`}
            >
              {index + 1}
            </button>
          ))}
        </div> */}
        <div>
          {getPageNumbers().map((page, index) =>
            page === '...' ? (
              <span
                key={index}
                className="px-3 py-1 text-secondaryText font-medium text-responsive-label "
              >
                ...
              </span>
            ) : (
              <button
                key={index}
                onClick={() => handlePageChange(page as number)}
                className={`px-3 py-1 rounded hover:bg-[#D7D7D7] ${
                  currentPage === page
                    ? 'bg-[#C0D3FF] text-primaryText font-semibold text-responsive-label '
                    : 'text-secondaryText font-medium text-responsive-label '
                }`}
              >
                {page}
              </button>
            )
          )}
        </div>
        <button
          disabled={currentPage === totalPages}
          onClick={() => handlePageChange(currentPage + 1)}
          className={`${
            currentPage === totalPages
              ? 'text-tableBorder cursor-not-allowed text-responsive-label '
              : 'text-primaryText font-semibold text-responsive-label '
          }`}
        >
          Next
        </button>
        {/* Input field for page navigation, visible only when totalPages > 5 */}
        {totalPages > 5 && (
          <div className="ml-4 flex items-center">
            <label
              htmlFor="jumpToPage"
              className="mr-2 text-responsive-label  font-medium"
            >
              Go to page:
            </label>
            <input
              id="jumpToPage"
              type="text"
              value={inputPage}
              onChange={handleInputChange}
              onKeyDown={handlePageInputSubmit}
              className="border border-gray-300 rounded p-1 text-responsive-label  w-12 text-center"
              placeholder="Page"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Pagination;
