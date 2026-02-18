// Libraries
import React, { useEffect, useRef, useState } from 'react';
import { useReactToPrint } from 'react-to-print';

// Types
import {
  DsReportDataTableProps,
  // DsReportRow,
} from '../../../../../../types/report-new';

// Components
import Pagination from '../../../common/Pagination';
import ReportActions from '../../../common/ReportActions';
import CompanyAndPeriod from '../../../common/CompanyAndPeriod';
import ViewDsHeaderRow from './ViewDsHeaderRow';
import ViewDsDataRow from './ViewDsDataRow';
import ViewDsTotalRow from './ViewDsTotalRow';
import SignAndTotalInWords from '../../../common/SignAndTotalInWords';

// Utils
import { getDsReportPushRowsAndBreaksNeeded } from '../../../../../../utils/report';
import {
  dsColumns,
  handleExportDsReportPDF,
} from '../../../../../../utils/pdfExportHandlers';
import { handleExportDsExcel } from '../../../../../../utils/excelExportHandlers';

// Constants
const DISPLAY_ROWS_PER_PAGE = 9;
const PRINT_ROWS_PER_PAGE = 9;

// import { handleExportDsReportPDF } from '../../../../utils/helpersFunctions';

// const demoDSReportData: DsReportRow[] = Array(27)
//   .fill(null)
//   .map((_, i) => ({
//     slNo: i + 1,
//     empName: `Employee ${i + 1}`,
//     days: 26,
//     basicSalary: 8000,
//     allowances: {
//       kitAllowances: 500,
//       cityAllowances: 300,
//       convHra: 2000,
//     },
//     grossPay: 10800,
//     extraDuty: 1500,
//     deduction: {
//       empESI: 200,
//       empEPF: 500,
//       adv: 0,
//       pTax: 200,
//     },
//     other: {
//       belt: 50,
//       boot: 100,
//       uniform: 200,
//     },
//     otherDeduction: 100,
//     totalDeduction: 1200,
//     netPay: 11100,
//   }));

// Main Component
const DSReportTable: React.FC<DsReportDataTableProps> = ({
  tableData,
  periodStartDate,
  periodEndDate,
  selectedPostName,
  totalGrossPay,
  totalNetPay,
}) => {
  // Pagination
  const [page, setPage] = useState(1);
  const totalPages = Math.ceil(tableData.length / DISPLAY_ROWS_PER_PAGE);
  const paginatedData = tableData.slice(
    (page - 1) * DISPLAY_ROWS_PER_PAGE,
    page * DISPLAY_ROWS_PER_PAGE
  );

  // Print using React-to-Print
  const [printMode, setPrintMode] = useState(false);
  const tableRef = useRef<HTMLDivElement>(null);

  const handlePrint = useReactToPrint({
    contentRef: tableRef,
    documentTitle: 'View DS Report',
    onBeforePrint: () => {
      setPrintMode(true);
      return Promise.resolve();
    },
    onAfterPrint: () => {
      setPrintMode(false);
    },
  });

  useEffect(() => {
    if (printMode) {
      handlePrint();
    }
  }, [printMode]);

  // Use all data when printing, paginated data otherwise
  const rowsToDisplay = printMode ? tableData : paginatedData;
  const { pushRows, breaksNeeded } = getDsReportPushRowsAndBreaksNeeded(
    tableData.length,
    PRINT_ROWS_PER_PAGE
  );

  // download options

  // Render
  return (
    <div className="bg-white">
      {/* Pagination */}
      {/* {!printMode && (
        <div className="flex relative bg-tableHeadingColour"> */}
      <div className="flex bg-tableHeadingColour sticky top-0 z-10">
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onPrevious={() => setPage((p) => Math.max(1, p - 1))}
          onNext={() => setPage((p) => Math.min(totalPages, p + 1))}
        />
        <ReportActions
          onClickPrint={() => setPrintMode(true)}
          onExportPDF={() =>
            handleExportDsReportPDF(
              selectedPostName!,
              periodStartDate,
              periodEndDate,
              dsColumns,
              tableData,
              totalGrossPay,
              totalNetPay
            )
          }
          onExportExcel={() =>
            handleExportDsExcel(
              tableData,
              'DS_Report',
              'Purbanchal Security Consultants Pvt. Ltd.',
              'Silpukhuri, Guwahati-03',
              periodStartDate,
              periodEndDate,
              totalNetPay
            )
          }
        />
      </div>
      <div ref={tableRef}>
        {/* Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto">
            <thead className="bg-white w-full">
              {/* Title Header */}
              <CompanyAndPeriod
                colSpan={13}
                periodEndDate={periodEndDate}
                periodStartDate={periodStartDate}
                selectedPostName={selectedPostName}
              />
              {/* Table Headers */}
              <ViewDsHeaderRow />
            </thead>
            <tbody>
              {/* All rows except the last pushRows */}
              {rowsToDisplay.slice(0, -pushRows).map((row, index) => (
                <ViewDsDataRow rowData={row} index={index} key={index} />
              ))}

              {/* Last pushRows rows and total row together in printMode */}
              {printMode && (
                <>
                  {/* Breaks */}
                  {pushRows !== 0 &&
                    [...Array(breaksNeeded)].map((_, i) => <br key={i} />)}

                  {/* Push Rows */}
                  {rowsToDisplay.slice(-pushRows).map((row, index) => (
                    <ViewDsDataRow
                      rowData={row}
                      index={rowsToDisplay.length - pushRows + index}
                      key={index}
                    />
                  ))}

                  {/* Total  */}
                  <ViewDsTotalRow
                    totalGrossPay={totalGrossPay}
                    totalNetPay={totalNetPay}
                  />
                </>
              )}

              {/* If not printMode, just render the last rows normally */}
              {!printMode &&
                rowsToDisplay
                  .slice(-pushRows)
                  .map((row, index) => (
                    <ViewDsDataRow rowData={row} index={index} key={index} />
                  ))}

              {/* Total row (visible in both modes, but only once) */}
              {!printMode && (
                <ViewDsTotalRow
                  totalGrossPay={totalGrossPay}
                  totalNetPay={totalNetPay}
                />
              )}
            </tbody>
          </table>
        </div>

        {/* In words and signature */}
        <SignAndTotalInWords
          totalNetPay={totalNetPay}
          dataLength={rowsToDisplay.length}
        />
      </div>
      {/* Footer */}
      <div className="mt-4 text-center border-t pt-2">
        <p className="text-gray-700">
          <span className="font-semibold">Note:</span> This is a
          system-generated salary report. For any discrepancies, please contact
          Admin.
        </p>
        <p className="text-sm text-gray-500">
          © {new Date().getFullYear()} PSCPL Payroll
        </p>
      </div>
    </div>
  );
};

export default DSReportTable;
