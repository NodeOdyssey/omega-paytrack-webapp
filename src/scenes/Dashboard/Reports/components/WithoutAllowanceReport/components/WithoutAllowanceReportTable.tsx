// Libraries
import React, { useEffect, useRef, useState } from 'react';
import { useReactToPrint } from 'react-to-print';

// Types
import {
  WithoutAllowanceReportTableProps,
  // WithoutAllowanceRow,
} from '../../../../../../types/report-new';

// Components
import Pagination from '../../../common/Pagination';
import ReportActions from '../../../common/ReportActions';
import CompanyAndPeriod from '../../../common/CompanyAndPeriod';
import WithoutAllowanceHeaderRow from './WithoutAllowanceHeaderRow';
import WithoutAllowanceDataRow from './WithoutAllowanceDataRow';
import WithoutAllowanceTotalRow from './WithoutAllowanceTotalRow';
import SignAndTotalInWords from '../../../common/SignAndTotalInWords';

// Utils
import { getWithoutAllowanceReportPushRowsAndBreaksNeeded } from '../../../../../../utils/report';
import {
  handleExportWithoutAllowanceReportPDF,
  withoutAllowanceColumns,
} from '../../../../../../utils/pdfExportHandlers';
import { handleExportWithoutAllowanceExcel } from '../../../../../../utils/excelExportHandlers';

// Constants
const DISPLAY_ROWS_PER_PAGE = 9;
const PRINT_ROWS_PER_PAGE = 9;
// const demoWithoutAllowanceTableData: WithoutAllowanceRow[] = Array(27)
//   .fill(null)
//   .map((_, i) => ({
//     slNo: i + 1,
//     empName: `Employee ${i + 1}`,
//     rank: 'Rank',
//     days: 26,
//     basicSalary: 8000,
//     extraDuty: 1500,
//     deduction: {
//       empESI: 200,
//       empEPF: 500,
//       adv: 100,
//       pTax: 200,
//     },
//     other: {
//       belt: 50,
//       boot: 50,
//       uniform: 150,
//     },
//     bonus: 500,
//     otherDeduction: 100,
//     totalDeduction: 1200,
//     netPay: 11100,
//   }));

// Main Component
const WithoutAllowanceReportTable: React.FC<
  WithoutAllowanceReportTableProps
> = ({
  tableData,
  periodStartDate,
  periodEndDate,
  selectedPostName,
  totalBasicSalary,
  totalNetPay,
}) => {
  // Pagination
  const [page, setPage] = useState(1);
  const totalPages = Math.ceil(tableData.length / DISPLAY_ROWS_PER_PAGE);
  const paginatedData = tableData.slice(
    (page - 1) * DISPLAY_ROWS_PER_PAGE,
    page * DISPLAY_ROWS_PER_PAGE
  );

  // Print
  const [printMode, setPrintMode] = useState(false);
  const tableRef = useRef<HTMLDivElement>(null);

  const handlePrint = useReactToPrint({
    contentRef: tableRef,
    documentTitle: 'Without Allowance Report',
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

  const handleClickPrint = () => setPrintMode(true);

  // Calculate pushRows for perfect last page (if you use breaks for print styling)
  const rowsToDisplay = printMode ? tableData : paginatedData;
  const { pushRows, breaksNeeded } =
    getWithoutAllowanceReportPushRowsAndBreaksNeeded(
      tableData.length,
      PRINT_ROWS_PER_PAGE
    );

  // Render
  return (
    <div className="bg-white">
      {/* Pagination and Actions */}
      <div className="flex bg-tableHeadingColour sticky top-0 z-10">
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onPrevious={() => setPage((p) => Math.max(1, p - 1))}
          onNext={() => setPage((p) => Math.min(totalPages, p + 1))}
        />
        <ReportActions
          onClickPrint={handleClickPrint}
          onExportPDF={() =>
            handleExportWithoutAllowanceReportPDF(
              selectedPostName!,
              periodStartDate,
              periodEndDate,
              withoutAllowanceColumns,
              tableData,
              totalBasicSalary,
              totalNetPay
            )
          }
          onExportExcel={() =>
            handleExportWithoutAllowanceExcel(
              tableData,
              'WithoutAllowance_Report',
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
        <div className="overflow-x-auto">
          {/* Table */}
          <table className="min-w-full table-auto">
            <thead className="bg-white w-full">
              {/* Company and period info */}
              <CompanyAndPeriod
                colSpan={12}
                periodEndDate={periodEndDate}
                periodStartDate={periodStartDate}
                selectedPostName={selectedPostName}
              />
              {/* Table Headers */}
              <WithoutAllowanceHeaderRow />
            </thead>
            <tbody>
              {/* All rows except the last pushRows */}
              {rowsToDisplay.slice(0, -pushRows).map((row, idx) => (
                <WithoutAllowanceDataRow
                  rowData={row}
                  index={idx}
                  offset={printMode ? 0 : (page - 1) * DISPLAY_ROWS_PER_PAGE}
                  key={idx}
                />
              ))}

              {/* Last pushRows rows and total row together in printMode */}
              {printMode && (
                <>
                  {/* Breaks (if needed; can be removed if not using breaks) */}
                  {pushRows !== 0 &&
                    [...Array(breaksNeeded)].map((_, i) => <br key={i} />)}

                  {/* Last rows */}
                  {rowsToDisplay.slice(-pushRows).map((row, idx) => (
                    <WithoutAllowanceDataRow
                      rowData={row}
                      index={rowsToDisplay.length - pushRows + idx}
                      offset={
                        printMode ? 0 : (page - 1) * DISPLAY_ROWS_PER_PAGE
                      }
                      key={10000 + idx}
                    />
                  ))}

                  {/* Total Row */}
                  <WithoutAllowanceTotalRow
                    totalBasicSalary={totalBasicSalary}
                    totalNetPay={totalNetPay}
                  />
                </>
              )}

              {/* If not printMode, just render the last rows and total normally */}
              {!printMode &&
                rowsToDisplay
                  .slice(-pushRows)
                  .map((row, idx) => (
                    <WithoutAllowanceDataRow
                      rowData={row}
                      index={rowsToDisplay.length - pushRows + idx}
                      offset={(page - 1) * DISPLAY_ROWS_PER_PAGE}
                      key={20000 + idx}
                    />
                  ))}

              {/* Total row (visible in both modes, but only once) */}
              {!printMode && (
                <WithoutAllowanceTotalRow
                  totalBasicSalary={totalBasicSalary}
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

export default WithoutAllowanceReportTable;
