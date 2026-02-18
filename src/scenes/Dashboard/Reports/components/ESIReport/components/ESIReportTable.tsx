import React, { useRef, useState } from 'react';
import { useReactToPrint } from 'react-to-print';
import {
  ESIReportTableProps,
  // ESIRow,
} from '../../../../../../types/report-new';
import Pagination from '../../../common/Pagination';
import ReportActions from '../../../common/ReportActions';
import CompanyAndPeriod from '../../../common/CompanyAndPeriod';
import ESIHeaderRow from './ESIHeaderRow';
import ESIDataRow from './ESIDataRow';
import ESITotalRow from './ESITotalRow';
import SignAndTotalInWords from '../../../common/SignAndTotalInWords';
import { getEsiReportPushRowsAndBreaksNeeded } from '../../../../../../utils/report';
import {
  esiReportColumns,
  handleExportESIReportPDF,
} from '../../../../../../utils/pdfExportHandlers';
import { handleExportEsIExcel } from '../../../../../../utils/excelExportHandlers';

const DISPLAY_ROWS_PER_PAGE = 36;
const PRINT_ROWS_PER_PAGE = 36;

// const demoESIReportTableData: ESIRow[] = Array(75)
//   .fill(null)
//   .map((_, i) => ({
//     slNo: i + 1,
//     accNo: `IS2371236172361 ${i + 1}`,
//     empName: `Employee Name Surname Pulik ${i + 1}`,
//     days: 26,
//     grossPay: 13000,
//     empESI: 200,
//     emplrESI: 200,
//     total: 400,
//   }));

const ESIReportTable: React.FC<ESIReportTableProps> = ({
  tableData,
  periodStartDate,
  periodEndDate,
  totalGrossPay,
  grandTotalEsi,
}) => {
  console.log('ESIReportTable component rendered');

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
    documentTitle: 'ESI Report',
    onBeforePrint: () => {
      setPrintMode(true);
      return Promise.resolve();
    },
    onAfterPrint: () => {
      setPrintMode(false);
    },
  });

  const { pushRows, breaksNeeded } = getEsiReportPushRowsAndBreaksNeeded(
    tableData.length,
    PRINT_ROWS_PER_PAGE
  );

  const rowsToDisplay = printMode ? tableData : paginatedData;

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
          onClickPrint={handlePrint}
          onExportPDF={() =>
            handleExportESIReportPDF(
              // tableData!,
              periodStartDate,
              periodEndDate,
              esiReportColumns,
              tableData,
              totalGrossPay,
              grandTotalEsi
            )
          }
          onExportExcel={() =>
            handleExportEsIExcel(
              tableData,
              'ESI_Report',
              'Purbanchal Security Consultants Pvt. Ltd.',
              'Silpukhuri, Guwahati-03',
              periodStartDate,
              periodEndDate,
              grandTotalEsi
            )
          }
        />
      </div>

      <div ref={tableRef}>
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto">
            <colgroup>
              <col style={{ width: '5%' }} /> {/* Sl. No. */}
              <col style={{ width: '10%' }} /> {/* Acc. No. */}
              <col style={{ width: '15%' }} /> {/* Employee Name */}
              <col style={{ width: '10%' }} /> {/* Days */}
              <col style={{ width: '8%' }} /> {/* Gross Pay */}
              <col style={{ width: '8%' }} /> {/* Employee ESI */}
              <col style={{ width: '8%' }} /> {/* Employer ESI */}
              <col style={{ width: '10%' }} /> {/* Total ESI */}
              <col style={{ width: '10%' }} /> {/* Sign */}
            </colgroup>

            <thead className="bg-white w-full">
              <CompanyAndPeriod
                colSpan={9}
                periodEndDate={periodEndDate}
                periodStartDate={periodStartDate}
                selectedPostName={''}
                displayPostName={false}
              />
              <ESIHeaderRow />
            </thead>
            <tbody>
              {rowsToDisplay.slice(0, -pushRows).map((row, idx) => (
                <ESIDataRow
                  rowData={row}
                  index={idx}
                  offset={printMode ? 0 : (page - 1) * DISPLAY_ROWS_PER_PAGE}
                  key={idx}
                />
              ))}

              {printMode && (
                <>
                  {pushRows !== 0 &&
                    [...Array(breaksNeeded)].map((_, i) => <br key={i} />)}

                  {rowsToDisplay.slice(-pushRows).map((row, idx) => (
                    <ESIDataRow
                      rowData={row}
                      index={rowsToDisplay.length - pushRows + idx}
                      offset={
                        printMode ? 0 : (page - 1) * DISPLAY_ROWS_PER_PAGE
                      }
                      key={10000 + idx}
                    />
                  ))}

                  <ESITotalRow
                    totalGrossPay={totalGrossPay}
                    grandTotalEsi={grandTotalEsi}
                  />
                </>
              )}

              {!printMode &&
                rowsToDisplay
                  .slice(-pushRows)
                  .map((row, idx) => (
                    <ESIDataRow
                      rowData={row}
                      index={rowsToDisplay.length - pushRows + idx}
                      offset={(page - 1) * DISPLAY_ROWS_PER_PAGE}
                      key={20000 + idx}
                    />
                  ))}

              {!printMode && (
                <ESITotalRow
                  totalGrossPay={totalGrossPay}
                  grandTotalEsi={grandTotalEsi}
                />
              )}
            </tbody>
          </table>
        </div>

        <SignAndTotalInWords
          totalNetPay={grandTotalEsi}
          dataLength={rowsToDisplay.length}
        />
      </div>

      <div className="mt-4 text-center border-t pt-2">
        <p className="text-gray-700">
          <span className="font-semibold">Note:</span> This is a
          system-generated report. For any discrepancies, please contact Admin.
        </p>
        <p className="text-sm text-gray-500">
          © {new Date().getFullYear()} PSCPL Payroll
        </p>
      </div>
    </div>
  );
};

export default ESIReportTable;
