import React, { useEffect, useRef, useState } from 'react';
import {
  // OthersReportRow,
  OthersReportTableProps,
} from '../../../../../../types/report-new';
import Pagination from '../../../common/Pagination';
import ReportActions from '../../../common/ReportActions';
import CompanyAndPeriod from '../../../common/CompanyAndPeriod';
import OthersHeaderRow from './OthersHeaderRow';
import OthersDataRow from './OthersDataRow';
import OthersTotalRow from './OthersTotalRow';
import SignAndTotalInWords from '../../../common/SignAndTotalInWords';
import { getOthersReportPushRowsAndBreaksNeeded } from '../../../../../../utils/report';
import { useReactToPrint } from 'react-to-print';
import {
  handleExportOtherReportPDF,
  OtherReportColumns,
} from '../../../../../../utils/pdfExportHandlers';
import { handleExportOthersExcel } from '../../../../../../utils/excelExportHandlers';

const DISPLAY_ROWS_PER_PAGE = 9;
const PRINT_ROWS_PER_PAGE = 9;

// const demoOthersReportTableData: OthersReportRow[] = Array(7)
//   .fill(null)
//   .map((_, i) => ({
//     slNo: i + 1,
//     empName: `Employee ${i + 1}`,
//     days: 26,
//     basicSalary: 8000,
//     allowance: {
//       hra: 500,
//       conveyance: 500,
//       medical: 500,
//       washing: 500,
//       other: 500,
//     },
//     grossPay: 13000,
//     extraDuty: 1500,
//     uniform: 500,
//     fourHourPay: 500,
//     specialAllowance: 500,
//     bonus: 500,
//     deduction: {
//       empEPF: 500,
//       empESI: 200,
//       emplrEPF: 500,
//       emplrESI: 200,
//     },
//     netPay: 11100,
//   }));

const OthersReportTable: React.FC<OthersReportTableProps> = ({
  tableData,
  periodStartDate,
  periodEndDate,
  selectedPostName,
  totalGrossPay,
  totalNetPay,
}) => {
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
  const rowsToDisplay = printMode ? tableData : paginatedData;
  const { pushRows, breaksNeeded } = getOthersReportPushRowsAndBreaksNeeded(
    tableData.length,
    PRINT_ROWS_PER_PAGE
  );

  return (
    <div className="bg-white">
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
            handleExportOtherReportPDF(
              selectedPostName!,
              periodStartDate,
              periodEndDate,
              OtherReportColumns,
              tableData,
              totalGrossPay,
              totalNetPay
            )
          }
          onExportExcel={() =>
            handleExportOthersExcel(
              tableData,
              'Others_Report',
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
              <col style={{ width: '4%' }} /> {/* Sl. No.*/}
              <col style={{ width: '16%' }} /> {/* Name */}
              <col style={{ width: '4%' }} /> {/* Days */}
              <col style={{ width: '8%' }} /> {/* Basic Pay */}
              <col style={{ width: '12%' }} /> {/* Allowances */}
              <col style={{ width: '5%' }} /> {/* Gross Pay */}
              <col style={{ width: '5%' }} /> {/* Extra Duty */}
              <col style={{ width: '5%' }} /> {/* Uniform */}
              <col style={{ width: '5%' }} /> {/* 4 Hour Pay */}
              <col style={{ width: '5%' }} /> {/* Special Allowances */}
              <col style={{ width: '4%' }} /> {/* Bonus */}
              <col style={{ width: '12%' }} /> {/* Deduction */}
              <col style={{ width: '5%' }} /> {/* Net Pay */}
              <col style={{ width: '5%' }} /> {/* Sign */}
            </colgroup>
            <thead className="bg-white w-full">
              <CompanyAndPeriod
                colSpan={14}
                periodEndDate={periodEndDate}
                periodStartDate={periodStartDate}
                selectedPostName={selectedPostName}
              />
              <OthersHeaderRow />
            </thead>
            <tbody>
              {/* All rows except the last pushRows */}
              {rowsToDisplay.slice(0, -pushRows).map((row, idx) => (
                <OthersDataRow rowData={row} key={idx} />
              ))}

              {/* Last pushRows rows and total row together in printMode */}
              {printMode && (
                <>
                  {pushRows !== 0 &&
                    [...Array(breaksNeeded)].map((_, i) => <br key={i} />)}

                  {rowsToDisplay.slice(-pushRows).map((row, idx) => (
                    <OthersDataRow rowData={row} key={10000 + idx} />
                  ))}

                  <OthersTotalRow
                    totalGrossPay={totalGrossPay}
                    totalNetPay={totalNetPay}
                  />
                </>
              )}

              {/* If not printMode, just render the last rows and total normally */}
              {!printMode &&
                rowsToDisplay
                  .slice(-pushRows)
                  .map((row, idx) => (
                    <OthersDataRow rowData={row} key={20000 + idx} />
                  ))}

              {/* Total row (visible in both modes, but only once) */}
              {!printMode && (
                <OthersTotalRow
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

export default OthersReportTable;
