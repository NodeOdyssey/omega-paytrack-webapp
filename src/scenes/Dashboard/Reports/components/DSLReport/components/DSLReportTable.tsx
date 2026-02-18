// Libraries
import React, { useEffect, useRef, useState } from 'react';

// Types
import {
  // DSLReportRow,
  DSLReportTableProps,
} from '../../../../../../types/report-new';

// Components
import Pagination from '../../../common/Pagination';
import ReportActions from '../../../common/ReportActions';
import CompanyAndPeriod from '../../../common/CompanyAndPeriod';
import DSLHeaderRow from './DSLHeaderRow';
import DSLDataRow from './DSLDataRow';
import DSLTotalRow from './DSLTotalRow';
import SignAndTotalInWords from '../../../common/SignAndTotalInWords';

// Utils
import { getDslReportPushRowsAndBreaksNeeded } from '../../../../../../utils/report';
import { useReactToPrint } from 'react-to-print';
import {
  dslColumns,
  handleExportDslPDF,
} from '../../../../../../utils/pdfExportHandlers';
import { handleExportDSLExcel } from '../../../../../../utils/excelExportHandlers';

// Constants
const DISPLAY_ROWS_PER_PAGE = 12;
const PRINT_ROWS_PER_PAGE = 12;

// Demo Data
// const demoDSLReportTableData: DSLReportRow[] = Array(28)
//   .fill(null)
//   .map((_, i) => ({
//     slNo: i + 1,
//     empName: `Employee middle surname ${i + 1}`,
//     rank: 'Rank',
//     days: 26,
//     eightHourPay: 8000,
//     vda: 500,
//     uniform: 500,
//     hra: 500,
//     total: 13000,
//     extraDuty: 1500,
//     deduction: {
//       empEPF: 500,
//       empESI: 200,
//       emplrEPF: 500,
//       emplrESI: 200,
//     },
//     totalDeduction: 1200,
//     netPay: 11100,
//     sign: 'Sign',
//   }));

// Main Component
const DSLReportTable: React.FC<DSLReportTableProps> = ({
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
    documentTitle: 'DSL Report',
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

  const rowsToDisplay = printMode ? tableData : paginatedData;
  const { pushRows, breaksNeeded } = getDslReportPushRowsAndBreaksNeeded(
    tableData.length,
    PRINT_ROWS_PER_PAGE
  );

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
          onClickPrint={() => setPrintMode(true)}
          onExportPDF={() =>
            handleExportDslPDF(
              selectedPostName!,
              periodStartDate,
              periodEndDate,
              dslColumns,
              tableData,
              totalGrossPay,
              totalNetPay
            )
          }
          onExportExcel={() =>
            handleExportDSLExcel(
              tableData,
              'DSL_Report',
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
          <table className="min-w-full table-auto">
            <colgroup>
              <col style={{ width: '1%' }} /> {/* Sl. No. */}
              <col style={{ width: '10%' }} />
              <col style={{ width: '10%' }} />
              <col style={{ width: '10%' }} />
              <col style={{ width: '10%' }} />
              <col style={{ width: '10%' }} />
              <col style={{ width: '10%' }} />
              <col style={{ width: '10%' }} />
              <col style={{ width: '10%' }} />
              <col style={{ width: '10%' }} />
              <col style={{ width: '10%' }} />
              <col style={{ width: '10%' }} />
              <col style={{ width: '10%' }} />
              <col style={{ width: '10%' }} />
              <col style={{ width: '10%' }} />
              <col style={{ width: '10%' }} />
              <col style={{ width: '10%' }} /> {/* Sign */}
            </colgroup>

            <thead className="bg-white w-full">
              <CompanyAndPeriod
                colSpan={16}
                periodEndDate={periodEndDate}
                periodStartDate={periodStartDate}
                selectedPostName={selectedPostName}
              />
              <DSLHeaderRow />
            </thead>
            <tbody>
              {/* All rows except the last pushRows */}
              {rowsToDisplay.slice(0, -pushRows).map((row, idx) => (
                <DSLDataRow
                  rowData={row}
                  index={idx}
                  offset={printMode ? 0 : (page - 1) * DISPLAY_ROWS_PER_PAGE}
                  key={idx}
                />
              ))}

              {/* Last pushRows rows and total row together in printMode */}
              {printMode && (
                <>
                  {pushRows !== 0 &&
                    [...Array(breaksNeeded)].map((_, i) => <br key={i} />)}
                  {rowsToDisplay.slice(-pushRows).map((row, idx) => (
                    <DSLDataRow
                      rowData={row}
                      index={rowsToDisplay.length - pushRows + idx}
                      offset={
                        printMode ? 0 : (page - 1) * DISPLAY_ROWS_PER_PAGE
                      }
                      key={10000 + idx}
                    />
                  ))}

                  {/* Total Row */}
                  <DSLTotalRow
                    totalGrossPay={totalGrossPay}
                    totalNetPay={totalNetPay}
                  />
                  <div className="h-4" />
                </>
              )}

              {/* If not printMode, just render the last rows and total normally */}
              {!printMode &&
                rowsToDisplay
                  .slice(-pushRows)
                  .map((row, idx) => (
                    <DSLDataRow
                      rowData={row}
                      index={rowsToDisplay.length - pushRows + idx}
                      offset={(page - 1) * DISPLAY_ROWS_PER_PAGE}
                      key={20000 + idx}
                    />
                  ))}
              {!printMode && (
                <DSLTotalRow
                  totalGrossPay={totalGrossPay}
                  totalNetPay={totalNetPay}
                />
              )}
            </tbody>
          </table>
        </div>
        <SignAndTotalInWords
          totalNetPay={totalNetPay}
          dataLength={rowsToDisplay.length}
        />
      </div>
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

export default DSLReportTable;
