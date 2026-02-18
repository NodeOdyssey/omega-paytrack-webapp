import React, { useRef, useState } from 'react';
import { useReactToPrint } from 'react-to-print';
import { PTaxReportTableProps } from '../../../../../../types/report-new';
import Pagination from '../../../common/Pagination';
import ReportActions from '../../../common/ReportActions';
import CompanyAndPeriod from '../../../common/CompanyAndPeriod';
import PTaxHeaderRow from './PTaxHeaderRow';
import PTaxDataRow from './PTaxDataRow';
import PTaxTotalRow from './PTaxTotalRow';
import SignAndTotalInWords from '../../../common/SignAndTotalInWords';
import { getPtaxReportPushRowsAndBreaksNeeded } from '../../../../../../utils/report';
import {
  handleExportPTaxReportPDF,
  pTaxReportColumns,
} from '../../../../../../utils/pdfExportHandlers';
import { handleExportPTaxExcel } from '../../../../../../utils/excelExportHandlers';
// import { PTaxRow } from '../../../../../../types/pTaxReport';

const DISPLAY_ROWS_PER_PAGE = 36;
const PRINT_ROWS_PER_PAGE = 36;

// const demoPtaxReportTableData: PTaxRow[] = Array(30)
//   .fill(null)
//   .map((_, i) => ({
//     slNo: i + 1,
//     empName: `Employee ${i + 1}`,
//     postName: `Post ${i + 1}`,
//     basicSalary: 13000,
//     pTax: 200,
//   }));

const PTaxReportTable: React.FC<PTaxReportTableProps> = ({
  tableData,
  periodStartDate,
  periodEndDate,
  totalBasicSalary,
  grandTotalPtax,
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
    documentTitle: 'PTax Report',
    onBeforePrint: () => {
      setPrintMode(true);
      return Promise.resolve();
    },
    onAfterPrint: () => {
      setPrintMode(false);
    },
  });

  const { pushRows, breaksNeeded } = getPtaxReportPushRowsAndBreaksNeeded(
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
            handleExportPTaxReportPDF(
              // selectedPostName!,
              periodStartDate,
              periodEndDate,
              pTaxReportColumns,
              tableData,
              totalBasicSalary,
              grandTotalPtax
            )
          }
          onExportExcel={() =>
            handleExportPTaxExcel(
              tableData,
              'PTax_Report',
              'Purbanchal Security Consultants Pvt. Ltd.',
              'Silpukhuri, Guwahati-03',
              periodStartDate,
              periodEndDate,
              grandTotalPtax
            )
          }
        />
      </div>

      <div ref={tableRef}>
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto">
            <colgroup>
              <col style={{ width: '10%' }} /> {/* Sl. No. */}
              <col style={{ width: '20%' }} /> {/* Employee Name */}
              <col style={{ width: '30%' }} /> {/* Post Name */}
              <col style={{ width: '15%' }} /> {/* Basic Salary */}
              <col style={{ width: '15%' }} /> {/* PTax */}
              <col style={{ width: '10%' }} /> {/* Sign */}
            </colgroup>
            <thead className="bg-white w-full">
              <CompanyAndPeriod
                colSpan={8}
                periodEndDate={periodEndDate}
                periodStartDate={periodStartDate}
                selectedPostName={''}
                displayPostName={false}
              />
              <PTaxHeaderRow />
            </thead>
            <tbody>
              {rowsToDisplay.slice(0, -pushRows).map((row, idx) => (
                <PTaxDataRow
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
                    <PTaxDataRow
                      rowData={row}
                      index={rowsToDisplay.length - pushRows + idx}
                      offset={
                        printMode ? 0 : (page - 1) * DISPLAY_ROWS_PER_PAGE
                      }
                      key={10000 + idx}
                    />
                  ))}

                  <PTaxTotalRow
                    totalBasicSalary={totalBasicSalary}
                    grandTotalPtax={grandTotalPtax}
                  />
                </>
              )}

              {!printMode &&
                rowsToDisplay
                  .slice(-pushRows)
                  .map((row, idx) => (
                    <PTaxDataRow
                      rowData={row}
                      index={rowsToDisplay.length - pushRows + idx}
                      offset={(page - 1) * DISPLAY_ROWS_PER_PAGE}
                      key={20000 + idx}
                    />
                  ))}

              {!printMode && (
                <PTaxTotalRow
                  totalBasicSalary={totalBasicSalary}
                  grandTotalPtax={grandTotalPtax}
                />
              )}
            </tbody>
          </table>
        </div>

        <SignAndTotalInWords
          totalNetPay={grandTotalPtax}
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

export default PTaxReportTable;
