import React, { useEffect, useRef, useState } from 'react';
import { CSVLink } from 'react-csv';
import { useReportStore } from '../../../../store/report';
import { DownloadIcon, PrintIcon } from '../../../../assets/icons';
import Loader from '../../../../common/Loader/Loader';
import {
  dateTimeInString,
  formatDateForReport,
  getLastDateOfMonth,
  // handleExportDsReportPDF,
} from '../../../../utils/helpersFunctions';
import { numberToWords } from '../../../../utils/formatter';
import { useReactToPrint } from 'react-to-print';

interface NewViewDSReportProps {
  currentSelectedPostId: number;
  selectedPostName: string | null;
  selectedDate: Date | null;
}

const ROWS_PER_PAGE = 6; // for screen
const PRINT_ROWS_PER_PAGE = 8; // for print

const NewViewDSReport: React.FC<NewViewDSReportProps> = ({
  currentSelectedPostId,
  selectedPostName,
  selectedDate,
}) => {
  if (!selectedDate || currentSelectedPostId === 0 || !selectedPostName) {
    return (
      <div className="bg-black">
        <h1>Report is not available because date or post is not selected</h1>
      </div>
    );
  }
  const endDate = getLastDateOfMonth(selectedDate);
  const periodStartDate = formatDateForReport(selectedDate);
  const periodEndDate = formatDateForReport(endDate);

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

  const [visibleColumns] = useState<string[]>([...alwaysVisibleColumns]);

  // const columns: { name: string; label: string }[] = [
  //   { name: 'empName', label: 'Name & Details' },
  //   { name: 'days', label: 'Days' },
  //   { name: 'basicSalary', label: 'Basic Pays' },
  //   { name: 'allowances', label: 'Allowances' },
  //   { name: 'grossPay', label: 'Gross Pay' },
  //   { name: 'extraDuty', label: 'Extra Duty' },
  //   { name: 'deduction', label: 'Deduction' },
  //   { name: 'other', label: 'Other' },
  //   { name: 'otherDeduction', label: 'Other Deduction' },
  //   { name: 'totalDeduction', label: 'Total Deduction' },
  //   { name: 'netPay', label: 'Net Pay' },
  // ];

  const {
    // dsReportData,
    doesDsReportExist,
    isLoading,
    dsReportTotalGrossPay,
    dsReportTotalNetPay,
    fetchDsReportData,
  } = useReportStore();

  const dsReportData = demoDSReportData;

  useEffect(() => {
    if (!selectedPostName || !selectedDate || currentSelectedPostId === 0)
      return;
    fetchDsReportData(currentSelectedPostId, selectedPostName, selectedDate);
  }, [selectedPostName, selectedDate, currentSelectedPostId]);

  const [downloadDropdownOpen, setDownloadDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

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
    slNo: index + 1,
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

  const tableRef = useRef<HTMLDivElement>(null);

  // Print controls
  const [isPrintMode, setIsPrintMode] = useState(false);

  // --- Dynamic pushRows calculation for print ---
  let pushRows = 1;
  let breaksNeeded = 0;
  const printRows = dsReportData.length;
  const remainder = printRows % PRINT_ROWS_PER_PAGE;
  switch (remainder) {
    case 0:
      pushRows = 1;
      breaksNeeded = 4;
      break;
    case 1:
      pushRows = 0;
      breaksNeeded = 0;
      break;
    case 2:
      pushRows = 0;
      breaksNeeded = 0;
      break;
    case 3:
      pushRows = 0;
      breaksNeeded = 0;
      break;
    case 4:
      pushRows = 0;
      breaksNeeded = 0;
      break;
    case 5:
      pushRows = 0;
      breaksNeeded = 0;
      break;
    case 6:
      pushRows = 0;
      breaksNeeded = 0;
      break;
    case 7:
      pushRows = 0;
      breaksNeeded = 0;
      break;

      pushRows = 1;
      breaksNeeded = 3;
      break;
    default:
      pushRows = 2;
      breaksNeeded = 3;
  }

  // Pagination for screen
  // Initialize the current page to 1
  const [currentPage, setCurrentPage] = useState(1);

  // Calculate the total number of pages based on the number of rows in the data and the rows per page
  const totalPages = Math.ceil(dsReportData.length / ROWS_PER_PAGE);

  // Calculate the data to display on the current page, based on the current page number and the rows per page
  // For example, if the data has 10 rows and we are showing 2 rows per page,
  // the first page will have rows 0 and 1, the second page will have rows 2 and 3,
  // and so on. This is why we multiply the current page number minus 1 by the rows per page
  // to get the starting index of the slice, and then add the rows per page to get the ending index.
  const currentPageData = dsReportData.slice(
    (currentPage - 1) * ROWS_PER_PAGE,
    currentPage * ROWS_PER_PAGE
  );

  // Determine which data to display, based on whether we are in print mode or not
  // If we are in print mode, display all the data, otherwise display only the current page
  const rowsToDisplay = isPrintMode ? dsReportData : currentPageData;

  // Print handler
  // const handlePrint = () => {
  //   setIsPrintMode(true);
  //   setTimeout(() => {
  //     const printContents = tableRef.current?.innerHTML;
  //     if (printContents) {
  //       const iframe = document.createElement('iframe');
  //       iframe.style.position = 'absolute';
  //       iframe.style.width = '0';
  //       iframe.style.height = '0';
  //       iframe.style.border = 'none';
  //       document.body.appendChild(iframe);

  //       const doc = iframe.contentWindow?.document || iframe.contentDocument;
  //       if (doc) {
  //         doc.open();
  //         const styleSheets = Array.from(document.styleSheets)
  //           .map((styleSheet) => {
  //             try {
  //               return Array.from(styleSheet.cssRules)
  //                 .map((rule) => rule.cssText)
  //                 .join('');
  //             } catch (e) {
  //               return '';
  //             }
  //           })
  //           .join('');
  //         doc.write(`
  //           <html>
  //             <head>
  //               <style>
  //                 ${styleSheets}
  //                 @media print { thead { display: table-header-group; } }
  //               </style>
  //             </head>
  //             <body>${printContents}</body>
  //           </html>
  //         `);
  //         doc.close();
  //         iframe.contentWindow?.focus();
  //         iframe.contentWindow?.print();
  //         document.body.removeChild(iframe);
  //       }
  //     }
  //     setIsPrintMode(false);
  //   }, 0);
  // };
  const handlePrint = useReactToPrint({
    contentRef: tableRef,
    documentTitle: 'View DS Report',
    onBeforePrint: () => {
      setIsPrintMode(true);
      return Promise.resolve();
    },
    onAfterPrint: () => {
      setIsPrintMode(false);
    },
  });

  console.log('is Print mode', isPrintMode);

  // Pagination controls
  const goToPreviousPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };
  const goToNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  return (
    <>
      {isLoading && <Loader />}
      <div className="flex flex-col print:hidden  mt-20">
        {/* Pagination Controls */}
        <div className="flex-none bg-tableHeadingColour">
          <div className="flex items-center justify-between px-2 2xl:px-4 border-t py-1 2xl:py-2">
            <div>
              <h2 className="text-primaryText text-xs"></h2>
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
                <button
                  onClick={() => setDownloadDropdownOpen((prev) => !prev)}
                >
                  <img
                    src={DownloadIcon}
                    alt="DownloadIcon"
                    className="report-action-icon"
                  />
                </button>
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
                          // handleExportDsReportPDF(
                          //   selectedPostName as string,
                          //   selectedDate as Date,
                          //   columns,
                          //   // dsReportData,
                          //   dsReportTotalGrossPay,
                          //   dsReportTotalNetPay
                          // );
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
                          filename={`ViewDS_Report_${dateTimeInString()}.csv`}
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
        <div ref={tableRef}>
          {doesDsReportExist ? (
            <>
              <div className="overflow-y-auto h-[calc(100vh-150px)] overflow-x-auto mt-2 px-2 scrollbar scrollbar-thumb-scrollBarColor scrollbar-track-scrollBarBg">
                <table className="w-full border-collapse font-bold overflow-y-auto">
                  <colgroup>
                    <col style={{ width: '5%' }} />
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
                    <col style={{ width: '10%' }} />
                  </colgroup>
                  <thead>
                    {/* Title Header */}
                    <tr>
                      <th
                        className="px-2 py-2 text-center"
                        colSpan={
                          1 +
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
                          1
                        }
                      >
                        <div className="w-full">
                          <div className="text-center">
                            <h2 className="reportPrimaryHeadings2 text-primaryText">
                              Purbanchal Security Consultants Pvt. Ltd.
                            </h2>
                            <h3 className="reportPrimaryHeadings2 text-primaryText">
                              Silpukhuri, Guwahati-03
                            </h3>
                          </div>
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
                    {/* Table Headers */}
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
                  <tbody className="text-center">
                    {/* All rows except the last pushRows */}
                    {rowsToDisplay.slice(0, -pushRows).map((row, index) => (
                      <tr key={index}>
                        <td className="border-b border-dotted border-primaryText px-2 py-1 text-xs w-[5%]">
                          {index + 1}
                          {/* {isPrintMode
                            ? index + 1
                            : (currentPage - 1) * ROWS_PER_PAGE + index + 1} */}
                        </td>
                        <td className="border-b border-dotted text-left border-primaryText px-2 py-1 text-xs ">
                          {row.empName}
                        </td>
                        <td className="border-b border-dotted border-primaryText text-right pr-5 py-1 text-xs ">
                          {row.days}
                        </td>
                        <td className="border-b border-dotted border-primaryText text-right pr-3 py-1 text-xs ">
                          {row.basicSalary.toFixed(2)}
                        </td>
                        <td className="border-b border-dotted border-primaryText text-right pr-1 py-1">
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
                              <h3 className="text-xs  font-bold">
                                City Allow:
                              </h3>
                              <h3 className="text-xs  font-bold">
                                {row.allowances.cityAllowances.toFixed(2)}
                              </h3>
                            </div>
                            <div className="flex justify-between space-x-2">
                              <h3 className="text-xs  font-bold">
                                Conv/H.Rent:
                              </h3>
                              <h3 className="text-xs  font-bold">
                                {row.allowances.convHra.toFixed(2)}
                              </h3>
                            </div>
                          </div>
                        </td>
                        <td className="border-b border-dotted border-primaryText text-right pr-2 py-1 text-xs ">
                          {row.grossPay.toFixed(2)}
                        </td>
                        <td className="border-b border-dotted border-primaryText text-right pr-2 py-1 text-xs ">
                          {row.extraDuty.toFixed(2)}
                        </td>
                        <td className="border-b border-dotted border-primaryText text-right p-1">
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
                        <td className="border-b border-dotted border-primaryText text-right pr-2 py-1">
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
                        <td className="border-b border-dotted border-primaryText text-right pr-2 py-1 text-xs ">
                          {row.otherDeduction.toFixed(2)}
                        </td>
                        <td className="border-b border-dotted border-primaryText text-right pr-2 py-1 text-xs ">
                          {row.totalDeduction.toFixed(2)}
                        </td>
                        <td className="border-b border-dotted border-primaryText text-right pr-2 py-1 text-xs ">
                          {row.netPay.toFixed(2)}
                        </td>
                        <td className="border-b border-dotted border-primaryText px-2 py-1"></td>
                      </tr>
                    ))}

                    {/* Last pushRows rows and total row together in printMode */}
                    {isPrintMode && (
                      <>
                        {/* Breaks */}
                        {pushRows !== 0 &&
                          [...Array(breaksNeeded)].map((_, i) => (
                            <br key={i} />
                          ))}

                        {/* Push Rows */}
                        {rowsToDisplay.slice(-pushRows).map((row, idx) => (
                          <tr key={`last-${idx}`}>
                            <td className="border-b border-dotted border-primaryText px-2 py-1 text-xs w-[5%]">
                              {/* {dsReportData.length - pushRows + idx + 1} */}
                              {rowsToDisplay.length - pushRows + idx + 1}
                            </td>
                            <td className="border-b border-dotted text-left border-primaryText px-2 py-1 text-xs ">
                              {row.empName}
                            </td>
                            <td className="border-b border-dotted border-primaryText text-right pr-5 py-1 text-xs ">
                              {row.days}
                            </td>
                            <td className="border-b border-dotted border-primaryText text-right pr-3 py-1 text-xs ">
                              {row.basicSalary.toFixed(2)}
                            </td>
                            <td className="border-b border-dotted border-primaryText text-right pr-1 py-1">
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
                                  <h3 className="text-xs  font-bold">
                                    City Allow:
                                  </h3>
                                  <h3 className="text-xs  font-bold">
                                    {row.allowances.cityAllowances.toFixed(2)}
                                  </h3>
                                </div>
                                <div className="flex justify-between space-x-2">
                                  <h3 className="text-xs  font-bold">
                                    Conv/H.Rent:
                                  </h3>
                                  <h3 className="text-xs  font-bold">
                                    {row.allowances.convHra.toFixed(2)}
                                  </h3>
                                </div>
                              </div>
                            </td>
                            <td className="border-b border-dotted border-primaryText text-right pr-2 py-1 text-xs ">
                              {row.grossPay.toFixed(2)}
                            </td>
                            <td className="border-b border-dotted border-primaryText text-right pr-2 py-1 text-xs ">
                              {row.extraDuty.toFixed(2)}
                            </td>
                            <td className="border-b border-dotted border-primaryText text-right p-1">
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
                                    <h3 className="text-xs  font-bold">
                                      P.Tax:
                                    </h3>
                                    <h3 className="text-xs  font-bold">
                                      {row.deduction.pTax.toFixed(2)}
                                    </h3>
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="border-b border-dotted border-primaryText text-right pr-2 py-1">
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
                                  <h3 className="text-xs  font-bold">
                                    Uniform:
                                  </h3>
                                  <h3 className="text-xs  font-bold">
                                    {row.other.uniform.toFixed(2)}
                                  </h3>
                                </div>
                              </div>
                            </td>
                            <td className="border-b border-dotted border-primaryText text-right pr-2 py-1 text-xs ">
                              {row.otherDeduction.toFixed(2)}
                            </td>
                            <td className="border-b border-dotted border-primaryText text-right pr-2 py-1 text-xs ">
                              {row.totalDeduction.toFixed(2)}
                            </td>
                            <td className="border-b border-dotted border-primaryText text-right pr-2 py-1 text-xs ">
                              {row.netPay.toFixed(2)}
                            </td>
                            <td className="border-b border-dotted border-primaryText px-2 py-1"></td>
                          </tr>
                        ))}

                        {/* Total row */}
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
                      </>
                    )}

                    {/* If not printMode, just render the last rows normally */}
                    {!isPrintMode &&
                      rowsToDisplay.slice(-pushRows).map((row, idx) => (
                        <tr key={`last-nonprint-${idx}`}>
                          <td className="border-b border-dotted border-primaryText px-2 py-1 text-xs w-[5%]">
                            {(currentPage - 1) * ROWS_PER_PAGE +
                              rowsToDisplay.length -
                              pushRows +
                              idx +
                              1}
                          </td>
                          <td className="border-b border-dotted text-left border-primaryText px-2 py-1 text-xs ">
                            {row.empName}
                          </td>
                          <td className="border-b border-dotted border-primaryText text-right pr-5 py-1 text-xs ">
                            {row.days}
                          </td>
                          <td className="border-b border-dotted border-primaryText text-right pr-3 py-1 text-xs ">
                            {row.basicSalary.toFixed(2)}
                          </td>
                          <td className="border-b border-dotted border-primaryText text-right pr-1 py-1">
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
                                <h3 className="text-xs  font-bold">
                                  City Allow:
                                </h3>
                                <h3 className="text-xs  font-bold">
                                  {row.allowances.cityAllowances.toFixed(2)}
                                </h3>
                              </div>
                              <div className="flex justify-between space-x-2">
                                <h3 className="text-xs  font-bold">
                                  Conv/H.Rent:
                                </h3>
                                <h3 className="text-xs  font-bold">
                                  {row.allowances.convHra.toFixed(2)}
                                </h3>
                              </div>
                            </div>
                          </td>
                          <td className="border-b border-dotted border-primaryText text-right pr-2 py-1 text-xs ">
                            {row.grossPay.toFixed(2)}
                          </td>
                          <td className="border-b border-dotted border-primaryText text-right pr-2 py-1 text-xs ">
                            {row.extraDuty.toFixed(2)}
                          </td>
                          <td className="border-b border-dotted border-primaryText text-right p-1">
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
                          <td className="border-b border-dotted border-primaryText text-right pr-2 py-1">
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
                          <td className="border-b border-dotted border-primaryText text-right pr-2 py-1 text-xs ">
                            {row.otherDeduction.toFixed(2)}
                          </td>
                          <td className="border-b border-dotted border-primaryText text-right pr-2 py-1 text-xs ">
                            {row.totalDeduction.toFixed(2)}
                          </td>
                          <td className="border-b border-dotted border-primaryText text-right pr-2 py-1 text-xs ">
                            {row.netPay.toFixed(2)}
                          </td>
                          <td className="border-b border-dotted border-primaryText px-2 py-1"></td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>

              <div
                className={`flex flex-col gap-1 items-start font-bold w-[50%] mx-auto justify-center `}
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
            </>
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

export default NewViewDSReport;

// Demo data for testing
export const demoDSReportData = Array(8 + 0) // Change 25 to any number for testing
  .fill(null)
  .map((_, i) => ({
    empName: `Employee ${i + 1}`,
    days: 26,
    basicSalary: 8000,
    allowances: {
      kitAllowances: 500,
      cityAllowances: 300,
      convHra: 2000,
    },
    grossPay: 10800,
    extraDuty: 1500,
    deduction: {
      empESI: 200,
      empEPF: 500,
      adv: 0,
      pTax: 200,
    },
    other: {
      belt: 50,
      boot: 100,
      uniform: 200,
    },
    otherDeduction: 100,
    totalDeduction: 1200,
    netPay: 11100,
  }));
