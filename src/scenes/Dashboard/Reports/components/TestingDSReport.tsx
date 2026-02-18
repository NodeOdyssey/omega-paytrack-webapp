// // src/scenes/Dashboard/Reports/components/TestingReport.tsx
// // Libraries
// import React, { useEffect, useRef, useState } from 'react';
// import { useReactToPrint } from 'react-to-print';

// // Types
// import { DsReportDataTableProps } from '../../../../types/report-new';

// // Components
// import Pagination from '../common/Pagination';
// import ReportActions from '../common/ReportActions';
// import CompanyAndPeriod from '../common/CompanyAndPeriod';
// import ViewDsHeaderRow from './ViewDSReport/components/ViewDsHeaderRow';
// import ViewDsDataRow from './ViewDSReport/components/ViewDsDataRow';
// import ViewDsTotalRow from './ViewDSReport/components/ViewDsTotalRow';
// import SignAndTotalInWords from '../common/SignAndTotalInWords';

// // Utils
// import { getDsReportPushRowsAndBreaksNeeded } from '../../../../utils/report';

// // Constants
// const DISPLAY_ROWS_PER_PAGE = 9;
// const PRINT_ROWS_PER_PAGE = 9;

// // Styles
// import './../components/ViewDSReport/ViewDSReport.css';
// // import { handleExportDsReportPDF } from '../../../../utils/helpersFunctions';

// // Main Component
// const DSReportTable: React.FC<DsReportDataTableProps> = ({
//   tableData,
//   periodStartDate,
//   periodEndDate,
//   selectedPostName,
//   // dsReportTotalGrossPay,
//   // dsReportTotalNetPay,
// }) => {
//   if (tableData.length === 0) return <>What</>;
//   // Pagination
//   const [page, setPage] = useState(1);
//   const totalPages = Math.ceil(tableData.length / DISPLAY_ROWS_PER_PAGE);
//   const paginatedData = tableData.slice(
//     (page - 1) * DISPLAY_ROWS_PER_PAGE,
//     page * DISPLAY_ROWS_PER_PAGE
//   );

//   // Print using React-to-Print
//   const [printMode, setPrintMode] = useState(false);
//   const tableRef = useRef<HTMLDivElement>(null);

//   const handlePrint = useReactToPrint({
//     contentRef: tableRef,
//     documentTitle: 'View DS Report',
//     onBeforePrint: () => {
//       setPrintMode(true);
//       return Promise.resolve();
//     },
//     onAfterPrint: () => {
//       setPrintMode(false);
//     },
//   });

//   useEffect(() => {
//     if (printMode) {
//       handlePrint();
//     }
//   }, [printMode]);

//   const onClickPrint = () => {
//     setPrintMode(true);
//   };
//   // Use all data when printing, paginated data otherwise
//   const rowsToDisplay = printMode ? tableData : paginatedData;
//   const { pushRows, breaksNeeded } = getDsReportPushRowsAndBreaksNeeded(
//     tableData.length,
//     PRINT_ROWS_PER_PAGE
//   );

//   // How many rows would be on the last page if all rows are printed?
//   // const remainder = tableData.length % PRINT_ROWS_PER_PAGE;

//   // Render
//   return (
//     <div className="max-w-6xl mx-auto my-8 bg-white rounded-lg shadow-lg p-6">
//       {/* <p>
//         Remainder : {remainder} :::: Push Rows: {pushRows} :::: Breaks Needed:{' '}
//         {breaksNeeded},
//       </p> */}

//       {/* Pagination */}
//       {!printMode && (
//         <div className="flex relative bg-tableHeadingColour">
//           <Pagination
//             currentPage={page}
//             totalPages={totalPages}
//             onPrevious={() => setPage((p) => Math.max(1, p - 1))}
//             onNext={() => setPage((p) => Math.min(totalPages, p + 1))}
//           />
//           <ReportActions
//             onClickPrint={onClickPrint}

//             // onExportPDF={() =>
//             // handleExportDsReportPDF(
//             //   selectedPostName as string,
//             //   selectedDate as Date,
//             //   columns,
//             //   dsReportData,
//             //   dsReportTotalGrossPay,
//             //   dsReportTotalNetPay
//             // )
//             // }
//             // csvHeaders={csvHeaders}
//             // csvData={csvData}
//             // csvFilename={`ViewDS_Report_${formatCSVDate()}.csv`}
//             // downloadDropdownOpen={downloadDropdownOpen}
//             // setDownloadDropdownOpen={setDownloadDropdownOpen}
//             // dropdownRef={dropdownRef}
//           />
//         </div>
//       )}

//       <div ref={tableRef}>
//         {/* Table */}
//         <div className="overflow-x-auto rounded-lg border border-gray-200">
//           <table className="min-w-full table-auto">
//             <thead className="bg-white">
//               {/* Title Header */}
//               <CompanyAndPeriod
//                 colSpan={13}
//                 periodEndDate={periodStartDate}
//                 periodStartDate={periodEndDate}
//                 selectedPostName={selectedPostName}
//               />
//               {/* Table Headers */}
//               <ViewDsHeaderRow />
//             </thead>
//             <tbody>
//               {/* All rows except the last pushRows */}
//               {rowsToDisplay.slice(0, -pushRows).map((row, index) => (
//                 <ViewDsDataRow rowData={row} index={index} key={index} />
//               ))}

//               {/* Last pushRows rows and total row together in printMode */}
//               {printMode && (
//                 <>
//                   {/* Breaks */}
//                   {pushRows !== 0 &&
//                     [...Array(breaksNeeded)].map((_, i) => <br key={i} />)}

//                   {/* Push Rows */}
//                   {rowsToDisplay.slice(-pushRows).map((row, index) => (
//                     <ViewDsDataRow
//                       rowData={row}
//                       index={rowsToDisplay.length - pushRows + index}
//                       key={index}
//                     />
//                   ))}

//                   {/* Total  */}
//                   <ViewDsTotalRow
//                     totalGrossPay={dsReportTotalGrossPay}
//                     totalNetPay={dsReportTotalNetPay}
//                   />
//                 </>
//               )}

//               {/* If not printMode, just render the last rows normally */}
//               {!printMode &&
//                 rowsToDisplay
//                   .slice(-pushRows)
//                   .map((row, index) => (
//                     <ViewDsDataRow rowData={row} index={index} key={index} />
//                   ))}
//             </tbody>
//           </table>
//         </div>

//         {/* In words and signature */}
//         <SignAndTotalInWords
//           totalNetPay={dsReportTotalNetPay}
//           dataLength={rowsToDisplay.length}
//         />
//       </div>

//       {/* Footer */}
//       <div className="mt-4 text-center border-t pt-2">
//         <p className="text-gray-700">
//           <span className="font-semibold">Note:</span> This is a
//           system-generated salary report. For any discrepancies, please contact
//           Admin.
//         </p>
//         <p className="text-sm text-gray-500">
//           © {new Date().getFullYear()} PSCPL Payroll
//         </p>
//       </div>
//     </div>
//   );
// };

// export default DSReportTable;
