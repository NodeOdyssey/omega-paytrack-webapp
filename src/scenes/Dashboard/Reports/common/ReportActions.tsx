// import React, { useEffect } from 'react';
import React, { useRef, useState } from 'react';
// import { CSVLink } from 'react-csv';
import { DownloadIcon, PrintIcon } from '../../../../assets/icons';
import { useEffect } from 'react';

interface ReportActionsProps {
  onClickPrint: () => void;
  onExportPDF: () => void;
  onExportExcel: () => void;
  // csvHeaders: any[];
  // csvData: any[];
  // csvFilename: string;
  // downloadDropdownOpen: boolean;
  // setDownloadDropdownOpen: (open: boolean) => void;
  // dropdownRef: React.RefObject<HTMLDivElement>;
}

const ReportActions: React.FC<ReportActionsProps> = ({
  onClickPrint,
  onExportPDF,
  onExportExcel,
  // csvHeaders,
  // csvData,
  // csvFilename,
  // downloadDropdownOpen,
  // setDownloadDropdownOpen,
  // dropdownRef,
}) => {
  // download options
  const [downloadDropdownOpen, setDownloadDropdownOpen] = useState(false); // To toggle dropdown
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDownloadDropdownOpen(false);
      }
    };
    if (downloadDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [downloadDropdownOpen, dropdownRef, setDownloadDropdownOpen]);

  return (
    <div className="flex flex-row absolute top-1/2 -translate-y-1/2 right-2 2xl:right-3 items-center">
      <button className="mr-2 2xl:mr-3" onClick={onClickPrint}>
        <img src={PrintIcon} alt="PrintIcon" className="report-action-icon" />
      </button>
      <button onClick={() => setDownloadDropdownOpen(!downloadDropdownOpen)}>
        <img
          src={DownloadIcon}
          alt="DownloadIcon"
          className="report-action-icon"
        />
      </button>
      <div className="relative">
        {downloadDropdownOpen && (
          <div
            ref={dropdownRef}
            className="absolute right-0 top-8 z-20 w-48 bg-white shadow-lg"
          >
            <ul className="p-2">
              <li
                className="px-2 py-2 cursor-pointer font-medium hover:bg-gray-100"
                onClick={() => {
                  setDownloadDropdownOpen(false);
                  onExportPDF();
                }}
              >
                <p className="text-responsive-button">Export PDF</p>
              </li>
              <li
                // onClick={() => setDownloadDropdownOpen(false)}
                onClick={() => {
                  setDownloadDropdownOpen(false);
                  onExportExcel?.();
                }}
                className="px-2 py-2 font-medium hover:bg-gray-100 cursor-pointer"
              >
                {/* <CSVLink
                  headers={csvHeaders}
                  data={csvData}
                  filename={csvFilename}
                > */}
                <p className="text-responsive-button">Export Excel</p>
                {/* </CSVLink> */}
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReportActions;
