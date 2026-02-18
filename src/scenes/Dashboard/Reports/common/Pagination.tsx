// Libraries
import React, { ReactNode } from 'react';

// Prop Types
interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPrevious: () => void;
  onNext: () => void;
  onPrint?: () => void;
  onExportClick?: () => void;
  exportDropdown?: ReactNode; // For custom dropdown (CSV, PDF, etc.)
  isPrintDisabled?: boolean;
  isExportDisabled?: boolean;
}

// Main Component
const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPrevious,
  onNext,
  onPrint,
  onExportClick,
  exportDropdown,
  isPrintDisabled,
  isExportDisabled,
}) => (
  // <div className="flex items-center justify-center px-2 2xl:px-4 border-t py-1 2xl:py-2 w-full">
  <div className="flex items-center justify-center px-2 2xl:px-4 border-t h-8 2xl:h-10 w-full">
    <div className="flex items-center gap-4 text-responsive-button">
      <button
        onClick={onPrevious}
        disabled={currentPage === 1}
        className={`${
          currentPage === 1
            ? 'text-tableBorder cursor-not-allowed'
            : 'text-bgPrimaryButton hover:text-bgPrimaryButtonHover cursor-pointer font-semibold'
        }`}
      >
        Previous
      </button>
      <h2 className="text-primaryText font-bold">
        Page {currentPage} of {totalPages}
      </h2>
      <button
        onClick={onNext}
        disabled={currentPage === totalPages}
        className={`${
          currentPage === totalPages
            ? 'text-tableBorder cursor-not-allowed'
            : 'text-bgPrimaryButton hover:text-bgPrimaryButtonHover cursor-pointer font-semibold'
        }`}
      >
        Next
      </button>
    </div>
    <div className="report-action-buttons-container flex items-center gap-2">
      {onPrint && (
        <button onClick={onPrint} disabled={isPrintDisabled}>
          <img
            src="/assets/icons/print.svg"
            alt="PrintIcon"
            className="report-action-icon"
          />
        </button>
      )}
      <div className="relative">
        {onExportClick && (
          <button onClick={onExportClick} disabled={isExportDisabled}>
            <img
              src="/assets/icons/download.svg"
              alt="DownloadIcon"
              className="report-action-icon"
            />
          </button>
        )}
        {exportDropdown}
      </div>
    </div>
  </div>
);

export default Pagination;
