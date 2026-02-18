import React, { useRef, useState } from 'react';
import { useReactToPrint } from 'react-to-print';
import { SalaryReportTableProps } from '../../../../../../types/report-new';
import Pagination from '../../../common/Pagination';
import ReportActions from '../../../common/ReportActions';
import CompanyAndPeriod from '../../../common/CompanyAndPeriod';
import SalaryHeaderRow from './SalaryHeaderRow';
import SalaryDataRow from './SalaryDataRow';
import SalaryTotalRow from './SalaryTotalRow';
import SignAndTotalInWords from '../../../common/SignAndTotalInWords';
import { getSalaryReportPushRowsAndBreaksNeeded } from '../../../../../../utils/report';
import {
  handleExportSalaryReportPDF,
  salaryReportColumns,
} from '../../../../../../utils/pdfExportHandlers';
import { handleExportSalaryExcel } from '../../../../../../utils/excelExportHandlers';
// import { SalaryRow } from '../../../../../../types/salaryReport';

// const DISPLAY_ROWS_PER_PAGE = 36;
// const PRINT_ROWS_PER_PAGE = 36;
const DISPLAY_ROWS_PER_PAGE = 23;
const PRINT_ROWS_PER_PAGE = 23;
// const demoSalaryReportTableData: SalaryRow[] = Array(63)
//   .fill(null)
//   .map((_, i) => ({
//     slNo: i + 1,
//     empName: `Employee ${i + 1}`,
//     accountNum: `Account Number ${i + 1}`,
//     ifsc: `IFSC ${i + 1}`,
//     bankName: `Bank Name ${i + 1}`,
//     netPay: 13000,
//     postName: `Post ${i + 1}`,
//   }));

const SalaryReportTable: React.FC<SalaryReportTableProps> = ({
  tableData,
  periodStartDate,
  periodEndDate,
  totalNetPay,
}) => {
  const [page, setPage] = useState(1);
  const totalPages = Math.ceil(tableData.length / DISPLAY_ROWS_PER_PAGE);
  const paginatedData = tableData.slice(
    (page - 1) * DISPLAY_ROWS_PER_PAGE,
    page * DISPLAY_ROWS_PER_PAGE
  );

  console.log('period date', periodStartDate);
  console.log('period end date', periodEndDate);

  const [printMode, setPrintMode] = useState(false);
  const tableRef = useRef<HTMLDivElement>(null);

  const handlePrint = useReactToPrint({
    contentRef: tableRef,
    documentTitle: 'Salary Report',
    onBeforePrint: () => {
      setPrintMode(true);
      return Promise.resolve();
    },
    onAfterPrint: () => {
      setPrintMode(false);
    },
  });

  const rowsToDisplay = printMode ? tableData : paginatedData;
  const { pushRows, breaksNeeded } = getSalaryReportPushRowsAndBreaksNeeded(
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
          onClickPrint={handlePrint}
          onExportPDF={() =>
            handleExportSalaryReportPDF(
              // selectedPostName!,
              periodStartDate,
              periodEndDate,
              salaryReportColumns,
              tableData,
              totalNetPay
            )
          }
          onExportExcel={() =>
            handleExportSalaryExcel(
              tableData,
              'Salary_Report',
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
        <div className="overflow-x-auto w-full">
          <table className="min-w-full table-auto">
            <colgroup>
              <col style={{ width: '2%' }} /> {/* Sl. No. */}
              <col style={{ width: '16%' }} /> {/* Employee Name */}
              <col style={{ width: '4%' }} /> {/* Account Number */}
              <col style={{ width: '6%' }} /> {/* IFSC */}
              <col style={{ width: '2%' }} /> {/* Bank Name */}
              <col style={{ width: '1%' }} /> {/* Net Pay */}
              <col style={{ width: '30%' }} /> {/* Post Name */}
              <col style={{ width: '5%' }} /> {/* Post Name */}
            </colgroup>
            <thead className="bg-white w-full">
              <CompanyAndPeriod
                colSpan={7}
                periodEndDate={periodEndDate}
                periodStartDate={periodStartDate}
                selectedPostName={''}
                displayPostName={false}
              />
              <SalaryHeaderRow />
            </thead>
            <tbody>
              {rowsToDisplay.slice(0, -pushRows).map((row, idx) => (
                <SalaryDataRow rowData={row} index={idx} key={idx} />
              ))}

              {printMode && (
                <>
                  {pushRows !== 0 &&
                    [...Array(breaksNeeded)].map((_, i) => <br key={i} />)}

                  {rowsToDisplay.slice(-pushRows).map((row, idx) => (
                    <SalaryDataRow
                      rowData={row}
                      index={rowsToDisplay.length - pushRows + idx}
                      key={10000 + idx}
                    />
                  ))}

                  <SalaryTotalRow totalNetPay={totalNetPay} />
                </>
              )}

              {!printMode &&
                rowsToDisplay
                  .slice(-pushRows)
                  .map((row, idx) => (
                    <SalaryDataRow
                      rowData={row}
                      index={rowsToDisplay.length - pushRows + idx}
                      key={20000 + idx}
                    />
                  ))}

              {!printMode && <SalaryTotalRow totalNetPay={totalNetPay} />}
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
          system-generated report. For any discrepancies, please contact Admin.
        </p>
        <p className="text-sm text-gray-500">
          © {new Date().getFullYear()} PSCPL Payroll
        </p>
      </div>
    </div>
  );
};

export default SalaryReportTable;
