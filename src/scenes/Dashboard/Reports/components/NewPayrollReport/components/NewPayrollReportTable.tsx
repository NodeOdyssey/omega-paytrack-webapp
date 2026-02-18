import React, { useRef, useState, useEffect } from 'react';
import {
  NewPayrollReportTableProps,
  // NewPayrollRow,
} from '../../../../../../types/report-new';
import Pagination from '../../../common/Pagination';
import ReportActions from '../../../common/ReportActions';
import CompanyAndPeriod from '../../../common/CompanyAndPeriod';
import NewPayrollHeaderRow from './NewPayrollHeaderRow';
import NewPayrollDataRow from './NewPayrollDataRow';
import NewPayrollTotalRow from './NewPayrollTotalRow';
import SignAndTotalInWords from '../../../common/SignAndTotalInWords';
import { useReactToPrint } from 'react-to-print';
import { getNewPayrollPushRowsAndBreaksNeeded } from '../../../../../../utils/report';
import {
  handleExportNewPayrollPDF,
  newPayrollColumns,
} from '../../../../../../utils/pdfExportHandlers';
import { handleExportNewPayrollExcel } from '../../../../../../utils/excelExportHandlers';

const DISPLAY_ROWS_PER_PAGE = 12;
const PRINT_ROWS_PER_PAGE = 12;
// const demoNewPayrollTableData: NewPayrollRow[] = Array(25)
//   .fill(null)
//   .map((_, i) => ({
//     slNo: i + 1,
//     empName: `Employee ${i + 1}`,
//     rank: 'Rank',
//     days: 26,
//     basicSalary: 8000,
//     uniform: 500,
//     bonus: 500,
//     total: 13000,
//     extraDuty: 1500,
//     deduction: {
//       empEPF: 500,
//       empESI: 200,
//       emplrEPF: 500,
//       emplrESI: 200,
//     },
//     pTax: 200,
//     otherDeduction: 100,
//     totalDeduction: 1200,
//     netPay: 11100,
//   }));

const NewPayrollReportTable: React.FC<NewPayrollReportTableProps> = ({
  tableData,
  periodStartDate,
  periodEndDate,
  selectedPostName,
  totalBasicSalary,
  totalNetPay,
}) => {
  const [page, setPage] = useState(1);
  const totalPages = Math.ceil(tableData.length / DISPLAY_ROWS_PER_PAGE);
  const paginatedData = tableData.slice(
    (page - 1) * DISPLAY_ROWS_PER_PAGE,
    page * DISPLAY_ROWS_PER_PAGE
  );
  const [printMode, setPrintMode] = useState(false);
  const tableRef = useRef<HTMLDivElement>(null);

  const handlePrint = useReactToPrint({
    contentRef: tableRef,
    documentTitle: 'New Payroll Report',
    onBeforePrint: () => {
      setPrintMode(true);
      return Promise.resolve();
    },
    onAfterPrint: () => setPrintMode(false),
  });

  useEffect(() => {
    if (printMode) handlePrint();
  }, [printMode]);

  const handleClickPrint = () => setPrintMode(true);

  const rowsToDisplay = printMode ? tableData : paginatedData;
  const { pushRows, breaksNeeded } = getNewPayrollPushRowsAndBreaksNeeded(
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
          onClickPrint={handleClickPrint}
          onExportPDF={() =>
            handleExportNewPayrollPDF(
              selectedPostName!,
              periodStartDate,
              periodEndDate,
              newPayrollColumns,
              tableData,
              totalBasicSalary,
              totalNetPay
            )
          }
          onExportExcel={() =>
            handleExportNewPayrollExcel(
              tableData,
              'NewPayroll_Report',
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
                colSpan={17}
                periodEndDate={periodEndDate}
                periodStartDate={periodStartDate}
                selectedPostName={selectedPostName}
              />
              {/* Table Headers */}
              <NewPayrollHeaderRow />
            </thead>
            <tbody>
              {/* All rows except the last pushRows */}
              {rowsToDisplay.slice(0, -pushRows).map((row, idx) => (
                <NewPayrollDataRow
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
                    <NewPayrollDataRow
                      rowData={row}
                      index={rowsToDisplay.length - pushRows + idx}
                      offset={
                        printMode ? 0 : (page - 1) * DISPLAY_ROWS_PER_PAGE
                      }
                      key={10000 + idx}
                    />
                  ))}

                  {/* Total Row */}
                  <NewPayrollTotalRow
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
                    <NewPayrollDataRow
                      rowData={row}
                      index={rowsToDisplay.length - pushRows + idx}
                      offset={(page - 1) * DISPLAY_ROWS_PER_PAGE}
                      key={20000 + idx}
                    />
                  ))}

              {/* Total row (visible in both modes, but only once) */}
              {!printMode && (
                <NewPayrollTotalRow
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

export default NewPayrollReportTable;
