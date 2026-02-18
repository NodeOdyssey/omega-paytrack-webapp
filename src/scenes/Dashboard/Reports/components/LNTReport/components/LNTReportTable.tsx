import React, { useEffect, useRef, useState } from 'react';
import {
  LNTReportTableProps,
  // LNTRow,
} from '../../../../../../types/report-new';
import Pagination from '../../../common/Pagination';
import ReportActions from '../../../common/ReportActions';
import CompanyAndPeriod from '../../../common/CompanyAndPeriod';
import LNTHeaderRow from './LNTHeaderRow';
import LNTDataRow from './LNTDataRow';
import LNTTotalRow from './LNTTotalRow';
import SignAndTotalInWords from '../../../common/SignAndTotalInWords';
import { useReactToPrint } from 'react-to-print';
import { getLntPushRowsAndBreaksNeeded } from '../../../../../../utils/report';
import {
  handleExportLnTPDF,
  LnTColumns,
} from '../../../../../../utils/pdfExportHandlers';
import { handleExportLNTExcel } from '../../../../../../utils/excelExportHandlers';

const DISPLAY_ROWS_PER_PAGE = 13;
const PRINT_ROWS_PER_PAGE = 13;

// const demoLNTReportTableData: LNTRow[] = Array(28)
//   .fill(null)
//   .map((_, i) => ({
//     slNo: i + 1,
//     empName: `Employee ${i + 1}`,
//     rank: 'Rank',
//     days: 26,
//     eightHourPay: 8000,
//     vda: 500,
//     uniform: 500,
//     specialAllowance: 500,
//     weeklyOff: 500,
//     total: 13000,
//     extraDuty: 1500,
//     adv: 100,
//     deduction: {
//       empEPF: 500,
//       empESI: 200,
//       emplrEPF: 500,
//       emplrESI: 200,
//       pTax: 200,
//       adv: 100,
//     },
//     totalDeduction: 1200,
//     netPay: 11100,
//   }));

const LNTReportTable: React.FC<LNTReportTableProps> = ({
  tableData,
  periodStartDate,
  periodEndDate,
  selectedPostName,
  totalAllowance,
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
  const rowsToDisplay = printMode ? tableData : paginatedData;

  // Push rows logic for print page breaks
  const { pushRows, breaksNeeded } = getLntPushRowsAndBreaksNeeded(
    tableData.length,
    PRINT_ROWS_PER_PAGE
  );

  const handlePrint = useReactToPrint({
    contentRef: tableRef,
    documentTitle: 'LNT Report',
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
    // eslint-disable-next-line
  }, [printMode]);

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
            handleExportLnTPDF(
              selectedPostName!,
              periodStartDate,
              periodEndDate,
              LnTColumns,
              tableData,
              totalAllowance,
              totalNetPay
            )
          }
          onExportExcel={() =>
            handleExportLNTExcel(
              tableData,
              'LNT_Report',
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
              <col style={{ width: '8%' }} />
              <col style={{ width: '8%' }} />
              <col style={{ width: '5%' }} />
              <col style={{ width: '10%' }} />
              <col style={{ width: '7%' }} />
              <col style={{ width: '7%' }} />
              <col style={{ width: '6%' }} />
              <col style={{ width: '8%' }} />
              <col style={{ width: '8%' }} />
              <col style={{ width: '7%' }} />
              <col style={{ width: '6%' }} />
              <col style={{ width: '7%' }} />
              <col style={{ width: '10%' }} />
              <col style={{ width: '8%' }} />
              <col style={{ width: '8%' }} /> {/* Sign */}
            </colgroup>
            <thead className="bg-white w-full">
              <CompanyAndPeriod
                colSpan={18}
                periodEndDate={periodEndDate}
                periodStartDate={periodStartDate}
                selectedPostName={selectedPostName}
              />
              <LNTHeaderRow />
            </thead>
            <tbody>
              {/* All rows except the last pushRows */}
              {rowsToDisplay.slice(0, -pushRows).map((row, idx) => (
                <LNTDataRow rowData={row} key={idx} />
              ))}

              {/* Last pushRows rows and total row together in printMode */}
              {printMode && (
                <>
                  {pushRows !== 0 &&
                    [...Array(breaksNeeded)].map((_, i) => <br key={i} />)}

                  {rowsToDisplay.slice(-pushRows).map((row, idx) => (
                    <LNTDataRow rowData={row} key={10000 + idx} />
                  ))}

                  <LNTTotalRow
                    totalAllowance={totalAllowance}
                    totalNetPay={totalNetPay}
                  />
                </>
              )}

              {/* If not printMode, just render the last rows and total normally */}
              {!printMode &&
                rowsToDisplay
                  .slice(-pushRows)
                  .map((row, idx) => (
                    <LNTDataRow rowData={row} key={20000 + idx} />
                  ))}

              {/* Total row (visible in both modes, but only once) */}
              {!printMode && (
                <LNTTotalRow
                  totalAllowance={totalAllowance}
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

export default LNTReportTable;
