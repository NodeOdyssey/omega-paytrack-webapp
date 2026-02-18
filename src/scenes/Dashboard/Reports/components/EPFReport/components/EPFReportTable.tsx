import React, { useRef, useState } from 'react';
import { useReactToPrint } from 'react-to-print';
import {
  EPFReportTableProps,
  // EPFRow,
} from '../../../../../../types/report-new';
import Pagination from '../../../common/Pagination';
import ReportActions from '../../../common/ReportActions';
import CompanyAndPeriod from '../../../common/CompanyAndPeriod';
import EPFHeaderRow from './EPFHeaderRow';
import EPFDataRow from './EPFDataRow';
import EPFTotalRow from './EPFTotalRow';
import SignAndTotalInWords from '../../../common/SignAndTotalInWords';
import { getEpfReportPushRowsAndBreaksNeeded } from '../../../../../../utils/report';
import {
  epfReportColumns,
  handleExportEPFReportPDF,
} from '../../../../../../utils/pdfExportHandlers';
import { handleExportEPFExcel } from '../../../../../../utils/excelExportHandlers';

const DISPLAY_ROWS_PER_PAGE = 36;
const PRINT_ROWS_PER_PAGE = 36;

// const demoEPFReportTableData: EPFRow[] = Array(39)
//   .fill(null)
//   .map((_, i) => ({
//     slNo: i + 1,
//     accNo: `accNo ${i + 1}`,
//     empName: `Employee ${i + 1}`,
//     days: 26,
//     basicSalary: 13000,
//     empEPF: 200,
//     emplrEPF: 200,
//     total: 400,
//   }));

const EPFReportTable: React.FC<EPFReportTableProps> = ({
  tableData,
  periodStartDate,
  periodEndDate,
  // selectedPostName,
  totalBasicSalary,
  grandTotalEpf,
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
    documentTitle: 'EPF Report',
    onBeforePrint: () => {
      setPrintMode(true);
      return Promise.resolve();
    },
    onAfterPrint: () => {
      setPrintMode(false);
    },
  });

  const { pushRows, breaksNeeded } = getEpfReportPushRowsAndBreaksNeeded(
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
            handleExportEPFReportPDF(
              // selectedPostName!,
              periodStartDate,
              periodEndDate,
              epfReportColumns,
              tableData,
              totalBasicSalary,
              grandTotalEpf
            )
          }
          onExportExcel={() =>
            handleExportEPFExcel(
              tableData,
              'EPF_Report',
              'Purbanchal Security Consultants Pvt. Ltd.',
              'Silpukhuri, Guwahati-03',
              periodStartDate,
              periodEndDate,
              grandTotalEpf
            )
          }
        />
      </div>

      <div ref={tableRef}>
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto">
            <thead className="bg-white w-full">
              <CompanyAndPeriod
                colSpan={8}
                periodEndDate={periodEndDate}
                periodStartDate={periodStartDate}
                displayPostName={false}
              />
              <EPFHeaderRow />
            </thead>
            <tbody>
              {rowsToDisplay.slice(0, -pushRows).map((row, idx) => (
                <EPFDataRow
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
                    <EPFDataRow
                      rowData={row}
                      index={rowsToDisplay.length - pushRows + idx}
                      offset={
                        printMode ? 0 : (page - 1) * DISPLAY_ROWS_PER_PAGE
                      }
                      key={10000 + idx}
                    />
                  ))}

                  <EPFTotalRow
                    totalBasicSalary={totalBasicSalary}
                    grandTotalEpf={grandTotalEpf}
                  />
                </>
              )}

              {!printMode &&
                rowsToDisplay
                  .slice(-pushRows)
                  .map((row, idx) => (
                    <EPFDataRow
                      rowData={row}
                      index={rowsToDisplay.length - pushRows + idx}
                      offset={(page - 1) * DISPLAY_ROWS_PER_PAGE}
                      key={20000 + idx}
                    />
                  ))}

              {!printMode && (
                <EPFTotalRow
                  totalBasicSalary={totalBasicSalary}
                  grandTotalEpf={grandTotalEpf}
                />
              )}
            </tbody>
          </table>
        </div>

        <SignAndTotalInWords
          totalNetPay={grandTotalEpf}
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

export default EPFReportTable;
