/* Libraries */
import React, { useEffect, useRef, useState } from 'react';
import { CSVLink } from 'react-csv';

/* Store */
import { useReportStore } from '../../../../store/report';

/* Hooks */
import useVerifyUserAuth from '../../../../hooks/useVerifyUserAuth';

/* Assets */
import { DownloadIcon, PrintIcon } from '../../../../assets/icons';

/* Components */
import Loader from '../../../../common/Loader/Loader';

/* Utils */
import {
  getLastDateOfMonth,
  handleExportDsReportPDF,
} from '../../../../utils/helpersFunctions';
import {
  formatDateDdMmYyyySlash,
  numberToWords,
} from '../../../../utils/formatter';

/* Prop types */
interface ViewDSReportProps {
  currentSelectedPostId: number;
  selectedPostName: string | null;
  selectedDate: Date | null;
}

/* Main Component */
const ViewDSReport: React.FC<ViewDSReportProps> = ({
  currentSelectedPostId,
  selectedPostName,
  selectedDate,
}) => {
  /* Verify user authentication */
  const accessToken = useVerifyUserAuth();

  /* Loader */
  // const [isLoading, setIsLoading] = useState(false);

  /** Date handling */
  const endDate = selectedDate ? getLastDateOfMonth(selectedDate) : null;
  const periodStartDate = formatDateDdMmYyyySlash(selectedDate);
  const periodEndDate = formatDateDdMmYyyySlash(endDate);

  /* Column dynamic visibility */
  const alwaysVisibleColumns = [
    'empName',
    'days',
    'basicSalary',
    'allowances',
    'grossPay',
    'extraDuty',
    'deduction',
    'other',
    'otherDeduction',
    'totalDeduction',
    'netPay',
  ];

  /* Define the initial state of visible columns */
  const [visibleColumns] = useState<string[]>([...alwaysVisibleColumns]);

  /* Define column data */
  const columns: { name: string; label: string }[] = [
    { name: 'empName', label: 'Name & Details' },
    { name: 'days', label: 'Days' },
    { name: 'basicSalary', label: 'Basic Pays' },
    { name: 'allowances', label: 'Allowances' },
    { name: 'grossPay', label: 'Gross Pay' },
    { name: 'extraDuty', label: 'Extra Duty' },
    { name: 'deduction', label: 'Deduction' },
    { name: 'other', label: 'Other' },
    { name: 'otherDeduction', label: 'Other Deduction' },
    { name: 'totalDeduction', label: 'Total Deduction' },
    { name: 'netPay', label: 'Net Pay' },
    // { name: 'sign', label: 'Sign' },
  ];

  /* Report data */
  const {
    dsReportData,
    doesDsReportExist,
    isLoading,
    dsReportTotalGrossPay,
    dsReportTotalNetPay,
    fetchDsReportData,
  } = useReportStore();

  useEffect(() => {
    if (!accessToken || !selectedPostName || !selectedDate) return;
    fetchDsReportData(
      // accessToken,
      currentSelectedPostId,
      selectedPostName,
      selectedDate
    );
  }, [accessToken, selectedPostName, selectedDate, currentSelectedPostId]);

  const [downloadDropdownOpen, setDownloadDropdownOpen] = useState(false); // To toggle dropdown
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  // CSV Headers and Data (Updated based on your function)
  const formatCSVDate = () => {
    const date = new Date();
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = String(date.getFullYear()).slice(-2);

    let hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12 || 12; // Convert to 12-hour format

    return `${day}-${month}-${year}, ${hours}:${minutes} ${ampm}`;
  };

  const csvHeaders = [
    { label: 'Sl No.', key: 'slNo' },
    { label: 'Name & Details', key: 'empName' },
    { label: 'Days', key: 'days' },
    { label: 'Basic Pay', key: 'basicSalary' },
    { label: 'Kit/Washing Allowance', key: 'allowances.kitAllowances' },
    { label: 'City Allowance', key: 'allowances.cityAllowances' },
    { label: 'Conv / HRA', key: 'allowances.convHra' },
    { label: 'Gross Pay', key: 'grossPay' },
    { label: 'Extra Duty', key: 'extraDuty' },
    { label: 'ESI Deduction', key: 'deduction.empESI' },
    { label: 'EPF Deduction', key: 'deduction.empEPF' },
    { label: 'Advance Deduction', key: 'deduction.adv' },
    { label: 'P.Tax Deduction', key: 'deduction.pTax' },
    { label: 'Belt Deduction', key: 'other.belt' },
    { label: 'Boot Deduction', key: 'other.boot' },
    { label: 'Uniform Deduction', key: 'other.uniform' },
    { label: 'Other Deduction', key: 'otherDeduction' },
    { label: 'Total Deduction', key: 'totalDeduction' },
    { label: 'Net Pay', key: 'netPay' },
    { label: 'Sign', key: '' },
  ];

  const csvData = dsReportData.map((row, index) => ({
    slNo: index + 1, // Serial number
    empName: row.empName,
    days: row.days,
    basicSalary: row.basicSalary,
    allowances: {
      kitAllowances: row.allowances.kitAllowances,
      cityAllowances: row.allowances.cityAllowances,
      convHra: row.allowances.convHra,
    },
    grossPay: row.grossPay,
    extraDuty: row.extraDuty,
    deduction: {
      empESI: row.deduction.empESI,
      empEPF: row.deduction.empEPF,
      adv: row.deduction.adv,
      pTax: row.deduction.pTax,
    },
    other: {
      belt: row.other.belt,
      boot: row.other.boot,
      uniform: row.other.uniform,
    },
    otherDeduction: row.otherDeduction,
    totalDeduction: row.totalDeduction,
    netPay: row.netPay,
  }));

  const handleCloseModal = () => {
    setDownloadDropdownOpen(false);
  };
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        handleCloseModal();
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
  }, [downloadDropdownOpen]);

  // print
  // const handlePrint = () => {
  //   const originalContents = document.body.innerHTML;
  //   const printContents = tableRef.current?.innerHTML;

  //   if (printContents) {
  //     document.body.innerHTML = printContents;
  //     window.print();
  //     document.body.innerHTML = originalContents;
  //     window.location.reload();
  //   }
  // };
  const tableRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    setIsPrintMode(true); // Enable print mode to render all pages

    setTimeout(() => {
      const printContents = tableRef.current?.innerHTML;

      if (printContents) {
        // Create a new iframe for printing
        const iframe = document.createElement('iframe');
        iframe.style.position = 'absolute';
        iframe.style.width = '0';
        iframe.style.height = '0';
        iframe.style.border = 'none';
        document.body.appendChild(iframe);

        const doc = iframe.contentWindow?.document || iframe.contentDocument;

        if (doc) {
          doc.open();

          // Copy the styles from the main document
          const styleSheets = Array.from(document.styleSheets)
            .map((styleSheet) => {
              try {
                return Array.from(styleSheet.cssRules)
                  .map((rule) => rule.cssText)
                  .join('');
              } catch (e) {
                // Sometimes accessing cross-origin styles throws errors, ignore those
                return '';
              }
            })
            .join('');

          // Write the table's content and the copied styles to the iframe
          doc.write(`
          <html>
            <head>
              <style>${styleSheets}</style>
            </head>
            <body>${printContents}</body>
          </html>
        `);

          doc.close();

          iframe.contentWindow?.focus();
          iframe.contentWindow?.print();
          document.body.removeChild(iframe); // Remove iframe after printing
        }
      }

      setIsPrintMode(false); // Disable print mode after printing
    }, 0); // Allow React to re-render the table with all rows before printing
  };

  // pagination
  const rowsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(1);
  // Calculate total pages
  const totalPages = Math.ceil(dsReportData.length / rowsPerPage);

  // Get the data to display for the current page
  const currentPageData = dsReportData.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  // Handle page navigation
  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  // Print controls
  const [isPrintMode, setIsPrintMode] = useState(false);
  const rowsToDisplay = isPrintMode ? dsReportData : currentPageData;
  // JSX
  return (
    <>
      {isLoading && <Loader />}
      {/* Main Container */}
      <div className="flex flex-col print:hidden">
        {/* Pagination Controls */}
        <div className="flex-none bg-tableHeadingColour">
          <div className="flex items-center justify-between px-2 2xl:px-4 border-t py-1 2xl:py-2">
            <div>
              <h2 className="text-primaryText text-xs">
                {/* Custom Report */}
              </h2>
            </div>
            <div className="flex items-center gap-4 text-responsive-button">
              <button
                onClick={goToPreviousPage}
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
                {/* Page 1 */}
                Page {currentPage} of {totalPages}
              </h2>
              <button
                onClick={goToNextPage}
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
            <div className="report-action-buttons-container">
              <div>
                <button onClick={handlePrint}>
                  <img
                    src={PrintIcon}
                    alt="PrintIcon"
                    className="report-action-icon"
                  />
                </button>
              </div>
              <div className="relative">
                {/* download icon */}
                <button
                  onClick={() => setDownloadDropdownOpen((prev) => !prev)}
                >
                  <img
                    src={DownloadIcon}
                    alt="DownloadIcon"
                    className="report-action-icon"
                  />
                </button>
                {/* Dropdown for download options */}
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
                          handleExportDsReportPDF(
                            selectedPostName as string,
                            selectedDate as Date,
                            columns,
                            dsReportData,
                            dsReportTotalGrossPay,
                            dsReportTotalNetPay
                          );
                        }}
                      >
                        <p className="text-responsive-button">Export PDF</p>
                      </li>

                      <li
                        onClick={() => setDownloadDropdownOpen(false)}
                        className="px-2 py-2 font-medium hover:bg-gray-100"
                      >
                        <CSVLink
                          headers={csvHeaders}
                          data={csvData}
                          filename={`ViewDS_Report_${formatCSVDate()}.csv`}
                        >
                          <p className="text-responsive-button">Export CSV</p>
                        </CSVLink>
                      </li>
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        {/* Preview Container */}
        <div
          className="overflow-y-auto h-[calc(100vh-150px)] overflow-x-auto mt-2 px-2 scrollbar scrollbar-thumb-scrollBarColor scrollbar-track-scrollBarBg"
          ref={tableRef}
        >
          {/* View DS report table for print out */}
          {doesDsReportExist ? (
            // Container for reports table and total
            <div>
              {/* Reports Table */}
              <table
                // id="viewDsReportTable"
                className="w-full border-collapse font-bold overflow-y-auto"
              >
                {/* Define column widths using colgroup */}
                <colgroup>
                  <col style={{ width: '5%' }} /> {/* Sl. No. */}
                  {visibleColumns.includes('empName') && (
                    <col style={{ width: '20%' }} />
                  )}
                  {visibleColumns.includes('days') && (
                    <col style={{ width: '10%' }} />
                  )}
                  {visibleColumns.includes('basicSalary') && (
                    <col style={{ width: '10%' }} />
                  )}
                  {visibleColumns.includes('allowances') && (
                    <col style={{ width: '20%' }} />
                  )}
                  {visibleColumns.includes('grossPay') && (
                    <col style={{ width: '10%' }} />
                  )}
                  {visibleColumns.includes('extraDuty') && (
                    <col style={{ width: '10%' }} />
                  )}
                  {visibleColumns.includes('deduction') && (
                    <col style={{ width: '30%' }} />
                  )}
                  {visibleColumns.includes('other') && (
                    <col style={{ width: '20%' }} />
                  )}
                  {visibleColumns.includes('otherDeduction') && (
                    <col style={{ width: '10%' }} />
                  )}
                  {visibleColumns.includes('totalDeduction') && (
                    <col style={{ width: '10%' }} />
                  )}
                  {visibleColumns.includes('netPay') && (
                    <col style={{ width: '10%' }} />
                  )}
                  <col style={{ width: '10%' }} /> {/* Sign */}
                </colgroup>

                {/* Header containing both company details and table header row */}
                <thead>
                  {/* First header row for company details */}
                  <tr>
                    <th
                      className="px-2 py-2 text-center"
                      colSpan={
                        1 + // Sl. No.
                        (visibleColumns.includes('empName') ? 1 : 0) +
                        (visibleColumns.includes('days') ? 1 : 0) +
                        (visibleColumns.includes('basicSalary') ? 1 : 0) +
                        (visibleColumns.includes('allowances') ? 1 : 0) +
                        (visibleColumns.includes('grossPay') ? 1 : 0) +
                        (visibleColumns.includes('extraDuty') ? 1 : 0) +
                        (visibleColumns.includes('deduction') ? 1 : 0) +
                        (visibleColumns.includes('other') ? 1 : 0) +
                        (visibleColumns.includes('otherDeduction') ? 1 : 0) +
                        (visibleColumns.includes('totalDeduction') ? 1 : 0) +
                        (visibleColumns.includes('netPay') ? 1 : 0) +
                        1 // Sign
                      }
                    >
                      <div className="w-full">
                        {/* Company details */}
                        <div className="text-center">
                          <h2 className="reportPrimaryHeadings2 text-primaryText">
                            Purbanchal Security Consultants Pvt. Ltd.
                          </h2>
                          <h3 className="reportPrimaryHeadings2 text-primaryText">
                            Silpukhuri, Guwahati-03
                          </h3>
                        </div>
                        {/* Post Name and Date */}
                        <div className="flex justify-between items-center mt-4">
                          <div className="flex items-center gap-2">
                            <h3 className="reports-from-to text-primaryText">
                              Pay Roll of Staff Deployed at:
                            </h3>
                            <h3 className="reports-from-to font-bold text-primaryText uppercase">
                              {selectedPostName || 'Select a Post'}
                            </h3>
                          </div>
                          <div className="flex items-center gap-2">
                            <h3 className="reports-from-to text-primaryText">
                              For the period from:
                            </h3>
                            <h3 className="reports-from-to text-primaryText">
                              {periodStartDate}
                            </h3>
                            <h3 className="reports-from-to text-primaryText">
                              to
                            </h3>
                            <h3 className="reports-from-to text-primaryText">
                              {periodEndDate}
                            </h3>
                          </div>
                        </div>
                      </div>
                    </th>
                  </tr>
                  {/* Second header row for table column names */}
                  <tr>
                    <th
                      className="border-2 border-primaryText text-xs  px-2 py-0.5 text-center"
                      rowSpan={2}
                    >
                      Sl. No.
                    </th>
                    {visibleColumns.includes('empName') && (
                      <th
                        className="border-2 text-left border-primaryText px-2 py-0.5 text-xs "
                        rowSpan={2}
                      >
                        Name & Details
                      </th>
                    )}
                    {visibleColumns.includes('days') && (
                      <th
                        className="border-2 border-primaryText px-2 py-0.5 text-center text-xs "
                        rowSpan={2}
                      >
                        Days
                      </th>
                    )}
                    {visibleColumns.includes('basicSalary') && (
                      <th
                        className="border-2 border-primaryText px-2 py-0.5 text-center text-xs "
                        rowSpan={2}
                      >
                        Basic Pay
                      </th>
                    )}
                    {visibleColumns.includes('allowances') && (
                      <th
                        className="border-2 border-primaryText py-0.5 text-center text-xs "
                        rowSpan={6}
                      >
                        Allowances
                      </th>
                    )}
                    {visibleColumns.includes('grossPay') && (
                      <th
                        className="border-2 border-primaryText px-2 py-0.5 text-center text-xs "
                        rowSpan={2}
                      >
                        Gross Pay
                      </th>
                    )}
                    {visibleColumns.includes('extraDuty') && (
                      <th
                        className="border-2 border-primaryText px-2 py-0.5 text-center text-xs "
                        rowSpan={2}
                      >
                        Extra Duty
                      </th>
                    )}
                    {visibleColumns.includes('deduction') && (
                      <th
                        className="border-2 border-primaryText py-0.5 text-center text-xs "
                        rowSpan={4}
                      >
                        Deduction
                      </th>
                    )}
                    {visibleColumns.includes('other') && (
                      <th
                        className="border-2 border-primaryText px-2 py-0.5 text-center text-xs "
                        rowSpan={4}
                      >
                        Other
                      </th>
                    )}
                    {visibleColumns.includes('otherDeduction') && (
                      <th
                        className="border-2 border-primaryText px-2 py-0.5 text-center text-xs "
                        rowSpan={2}
                      >
                        Other Deduction
                      </th>
                    )}
                    {visibleColumns.includes('totalDeduction') && (
                      <th
                        className="border-2 border-primaryText px-2 py-0.5 text-center text-xs "
                        rowSpan={2}
                      >
                        Total Deduction
                      </th>
                    )}
                    {visibleColumns.includes('netPay') && (
                      <th
                        className="border-2 border-primaryText px-2 py-0.5 text-center text-xs "
                        rowSpan={2}
                      >
                        Net Pay
                      </th>
                    )}
                    <th
                      className="border-2 border-primaryText px-2 py-0.5 text-center text-xs "
                      rowSpan={2}
                    >
                      Sign
                    </th>
                  </tr>
                </thead>

                {/* Body containing reports data and total */}
                <tbody className="text-center">
                  {rowsToDisplay.map((row, index) => (
                    <tr key={index}>
                      <td
                        // className={`border-b border-dotted border-primaryText px-2 ${dsReportData.length % 8 <= 2 ? 'py-4' : 'py-2'} text-xs  w-[5%]`}
                        className={`border-b border-dotted border-primaryText px-2 py-1 text-xs w-[5%]`}
                      >
                        {isPrintMode
                          ? index + 1 // Show correct serial number for all rows in print mode
                          : (currentPage - 1) * rowsPerPage + index + 1}
                      </td>
                      <td
                        // className={`border-b border-dotted text-left border-primaryText px-2 ${dsReportData.length % 8 <= 2 ? 'py-4' : 'py-2'} text-xs `}
                        className={`border-b border-dotted text-left border-primaryText px-2 py-1 text-xs `}
                      >
                        {row.empName}
                      </td>
                      <td
                        // className={`border-b border-dotted border-primaryText text-right pr-5 ${dsReportData.length % 8 <= 2 ? 'py-4' : 'py-2'} text-xs `}
                        className={`border-b border-dotted border-primaryText text-right pr-5 py-1 text-xs `}
                      >
                        {row.days}
                      </td>
                      <td
                        // className={`border-b border-dotted border-primaryText text-right pr-3 ${dsReportData.length % 8 <= 2 ? 'py-4' : 'py-2'} text-xs `}
                        className={`border-b border-dotted border-primaryText text-right pr-3 py-1 text-xs `}
                      >
                        {row.basicSalary.toFixed(2)}
                      </td>
                      <td
                        // className={`border-b border-dotted border-primaryText text-right pr-1 ${dsReportData.length % 8 <= 2 ? 'py-4' : 'py-2'}`}
                        className={`border-b border-dotted border-primaryText text-right pr-1 py-1`}
                      >
                        <div className="flex flex-col gap-1">
                          <div className="flex justify-between space-x-2">
                            <h3 className="text-xs  font-bold">
                              Kits/Washing:
                            </h3>
                            <h3 className="text-xs  font-bold">
                              {row.allowances.kitAllowances.toFixed(2)}
                            </h3>
                          </div>
                          <div className="flex justify-between space-x-2">
                            <h3 className="text-xs  font-bold">City Allow:</h3>
                            <h3 className="text-xs  font-bold">
                              {row.allowances.cityAllowances.toFixed(2)}
                            </h3>
                          </div>
                          <div className="flex justify-between space-x-2">
                            <h3 className="text-xs  font-bold">Conv/H.Rent:</h3>
                            <h3 className="text-xs  font-bold">
                              {row.allowances.convHra.toFixed(2)}
                            </h3>
                          </div>
                        </div>
                      </td>
                      <td
                        // className={`border-b border-dotted border-primaryText text-right pr-2 ${dsReportData.length % 8 <= 2 ? 'py-4' : 'py-2'} text-xs `}
                        className={`border-b border-dotted border-primaryText text-right pr-2 py-1 text-xs `}
                      >
                        {row.grossPay.toFixed(2)}
                      </td>
                      <td
                        // className={`border-b border-dotted border-primaryText text-right pr-2 ${dsReportData.length % 8 <= 2 ? 'py-4' : 'py-2'} text-xs `}
                        className={`border-b border-dotted border-primaryText text-right pr-2 py-1 text-xs `}
                      >
                        {row.extraDuty.toFixed(2)}
                      </td>

                      <td
                        className={`border-b border-dotted border-primaryText text-right p-1`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex flex-col gap-5">
                            <div className="flex justify-between space-x-2">
                              <h3 className="text-xs  font-bold">ESI:</h3>
                              <h3 className="text-xs  font-bold">
                                {row.deduction.empESI.toFixed(2)}
                              </h3>
                            </div>
                            <div className="flex justify-between space-x-2">
                              <h3 className="text-xs  font-bold">EPF:</h3>
                              <h3 className="text-xs  font-bold">
                                {row.deduction.empEPF.toFixed(2)}
                              </h3>
                            </div>
                          </div>
                          <div className="flex flex-col gap-5 ml-2">
                            <div className="flex justify-between space-x-2">
                              <h3 className="text-xs  font-bold">Adv:</h3>
                              <h3 className="text-xs  font-bold">
                                {row.deduction.adv.toFixed(2)}
                              </h3>
                            </div>
                            <div className="flex justify-between space-x-2">
                              <h3 className="text-xs  font-bold">P.Tax:</h3>
                              <h3 className="text-xs  font-bold">
                                {row.deduction.pTax.toFixed(2)}
                              </h3>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td
                        // className={`border-b border-dotted border-primaryText text-right pr-2 ${dsReportData.length % 8 <= 2 ? 'py-4' : 'py-2'}`}
                        className={`border-b border-dotted border-primaryText text-right pr-2 py-1`}
                      >
                        <div className="flex flex-col gap-1">
                          <div className="flex justify-between space-x-2">
                            <h3 className="text-xs  font-bold">Belt:</h3>
                            <h3 className="text-xs  font-bold">
                              {row.other.belt.toFixed(2)}
                            </h3>
                          </div>
                          <div className="flex justify-between space-x-2">
                            <h3 className="text-xs  font-bold">Boot:</h3>
                            <h3 className="text-xs  font-bold">
                              {row.other.boot.toFixed(2)}
                            </h3>
                          </div>
                          <div className="flex justify-between space-x-2">
                            <h3 className="text-xs  font-bold">Uniform:</h3>
                            <h3 className="text-xs  font-bold">
                              {row.other.uniform.toFixed(2)}
                            </h3>
                          </div>
                        </div>
                      </td>
                      <td
                        className={`border-b border-dotted border-primaryText text-right pr-2 ${dsReportData.length % 8 <= 2 ? 'py-4' : 'py-2'} text-xs `}
                      >
                        {row.otherDeduction.toFixed(2)}
                      </td>
                      <td
                        className={`border-b border-dotted border-primaryText text-right pr-2 ${dsReportData.length % 8 <= 2 ? 'py-4' : 'py-2'} text-xs `}
                      >
                        {row.totalDeduction.toFixed(2)}
                      </td>

                      <td
                        className={`border-b border-dotted border-primaryText text-right pr-2 ${dsReportData.length % 8 <= 2 ? 'py-4' : 'py-2'} text-xs `}
                      >
                        {row.netPay.toFixed(2)}
                      </td>
                      <td
                        className={`border-b border-dotted border-primaryText px-2 ${dsReportData.length % 8 <= 2 ? 'py-4' : 'py-2'}`}
                      ></td>
                    </tr>
                  ))}
                  {/* Total */}
                  <tr className="mt-2 mx-auto">
                    <td className="border-t-2 border-primaryText px-2 py-2 font-bold"></td>
                    <td className="border-t-2 border-primaryText px-2 py-2 font-bold text-sm">
                      Total
                    </td>
                    <td className="border-t-2 border-primaryText px-2 py-2 font-bold"></td>
                    <td className="border-t-2 border-primaryText px-2 py-2 font-bold"></td>
                    <td className="border-t-2 border-primaryText px-2 py-2 font-bold"></td>
                    <td className="border-t-2 border-primaryText pr-1 py-2 font-bold text-right text-xs">
                      {dsReportTotalGrossPay.toFixed(2)}
                    </td>
                    <td className="border-t-2 border-primaryText px-2 py-2 font-bold"></td>
                    <td className="border-t-2 border-primaryText px-2 py-2 font-bold"></td>
                    <td className="border-t-2 border-primaryText px-2 py-2 font-bold"></td>
                    <td className="border-t-2 border-primaryText px-2 py-2 font-bold"></td>
                    <td className="border-t-2 border-primaryText px-2 py-2 font-bold"></td>
                    <td className="border-t-2 border-primaryText pr-1 py-2 font-bold text-right text-xs">
                      {dsReportTotalNetPay.toFixed(2)}
                    </td>
                    <td className="border-t-2 border-primaryText px-2 py-2"></td>
                  </tr>
                </tbody>
              </table>

              {/* Total */}
              <div
                className={`flex flex-col gap-2 items-start font-bold w-[50%] mx-auto justify-center footer-to-print ${dsReportData.length % 8 <= 2 ? 'py-4' : 'py-2'}`}
              >
                <div className="flex items-center gap-2">
                  <h2 className="text-primaryText reportPrimaryLabels2 font-bold">
                    Rupees:
                  </h2>
                  <h3 className="text-primaryText reportPrimaryLabels2 uppercase font-bold">
                    {numberToWords(Number(dsReportTotalNetPay.toFixed(2)))}
                  </h3>
                </div>
                <h2 className="text-primaryText reportPrimaryLabels2 font-bold">
                  Return after disbursement
                </h2>
                <div className="flex items-center gap-2">
                  <h2 className="text-primaryText reportPrimaryLabels2 font-bold">
                    Incharge:.................................................................................
                  </h2>
                  <h3 className="text-primaryText reportPrimaryLabels2 font-bold">
                    Date:...............................
                  </h3>
                </div>
              </div>
              <br />
              <br />
              <br />
            </div>
          ) : isLoading ? null : (
            <p className="text-center py-20">
              Payroll hasn&rsquo;t been generated for this month yet.
            </p>
          )}
        </div>
      </div>
    </>
  );
};

export default ViewDSReport;
