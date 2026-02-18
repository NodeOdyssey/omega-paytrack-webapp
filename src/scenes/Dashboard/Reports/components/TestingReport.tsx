// src/scenes/Dashboard/Reports/components/TestingReport.tsx
import React, { useRef, useState } from 'react';
import { useReactToPrint } from 'react-to-print';
import { formatDateDdMmYyyySlash } from '../../../../utils/formatter';

type SalaryReportTableProps = {
  data: Array<{
    empName: string;
    rank: string;
    days: number;
    eightHourPay: number;
    vda: number;
    uniform: number;
    hra: number;
    total: number;
    extraDuty: number;
    adv: number;
    deduction: number;
    netPay: number;
  }>;
};

const ROWS_PER_PAGE = 8;
const PRINT_ROWS_PER_PAGE = 13;

const SalaryReportTable: React.FC<SalaryReportTableProps> = ({ data }) => {
  const [page, setPage] = useState(1);
  const [printMode, setPrintMode] = useState(false);
  const totalPages = Math.ceil(data.length / ROWS_PER_PAGE);

  const paginatedData = data.slice(
    (page - 1) * ROWS_PER_PAGE,
    page * ROWS_PER_PAGE
  );

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

  // Use all data when printing, paginated data otherwise
  const rowsToDisplay = printMode ? data : paginatedData;

  // --- Dynamic pushRows calculation ---
  // How many rows would be on the last page if all rows are printed?
  let pushRows = 1;
  let breaksNeeded = 3;
  // if (printMode) {
  const remainder = data.length % PRINT_ROWS_PER_PAGE;
  switch (remainder) {
    case 0:
      pushRows = 2;
      breaksNeeded = 3;
      break;
    case 1:
      pushRows = 2;
      breaksNeeded = 2;
      break;
    case 2:
      pushRows = 2;
      breaksNeeded = 0;
      break;
    case 3:
      pushRows = 0;
      breaksNeeded = 0;
      break;
    case 4:
      pushRows = 0;
      breaksNeeded = 0;
      break;
    case 5:
      pushRows = 0;
      breaksNeeded = 0;
      break;
    case 6:
      pushRows = 0;
      breaksNeeded = 0;
      break;
    case 7:
      pushRows = 0;
      breaksNeeded = 0;
      break;
    case 8:
      pushRows = 0;
      breaksNeeded = 0;
      break;
    case 9:
      pushRows = 0;
      breaksNeeded = 0;
      break;
    case 10:
      pushRows = 1;
      breaksNeeded = 7;
      break;
    case 11:
      pushRows = 1;
      breaksNeeded = 5;
      break;
    case 12:
      pushRows = 1;
      breaksNeeded = 3;
      break;
    default:
      pushRows = 2;
      breaksNeeded = 3;
  }

  return (
    <div className="max-w-6xl mx-auto my-8 bg-white rounded-lg shadow-lg p-6">
      {/* Print Button */}
      <button
        className="mb-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 print:hidden"
        onClick={handlePrint}
      >
        Print Report
      </button>

      <p>
        Remainder : {remainder} :::: Push Rows: {pushRows} :::: Breaks Needed:
        {breaksNeeded},
      </p>
      <div ref={tableRef}>
        {/* Table */}
        <div className="overflow-x-auto rounded-lg border border-gray-200">
          <table className="min-w-full table-auto">
            <thead className="bg-white">
              {/* Title Header */}
              <tr>
                <th colSpan={12} className="text-center py-4">
                  <div>
                    <h1 className="text-2xl font-bold text-blue-900">
                      Salary Report
                    </h1>
                    <p className="text-gray-600">
                      Monthly Salary Details for Employees
                    </p>
                  </div>
                </th>
              </tr>
              {/* Table Headers */}
              <tr className="bg-blue-100">
                <th className="px-4 py-2 font-semibold text-blue-900">
                  Employee Name
                </th>
                <th className="px-4 py-2 font-semibold text-blue-900">Rank</th>
                <th className="px-4 py-2 font-semibold text-blue-900">Days</th>
                <th className="px-4 py-2 font-semibold text-blue-900">
                  8 Hour Pay
                </th>
                <th className="px-4 py-2 font-semibold text-blue-900">VDA</th>
                <th className="px-4 py-2 font-semibold text-blue-900">
                  Uniform
                </th>
                <th className="px-4 py-2 font-semibold text-blue-900">HRA</th>
                <th className="px-4 py-2 font-semibold text-blue-900">Total</th>
                <th className="px-4 py-2 font-semibold text-blue-900">
                  Extra Duty
                </th>
                <th className="px-4 py-2 font-semibold text-blue-900">
                  Advance
                </th>
                <th className="px-4 py-2 font-semibold text-blue-900">
                  Deduction
                </th>
                <th className="px-4 py-2 font-semibold text-blue-900">
                  Net Pay
                </th>
              </tr>
            </thead>
            <tbody>
              {/* All rows except the last pushRows */}
              {rowsToDisplay.slice(0, -pushRows).map((row, idx) => (
                <tr
                  key={idx}
                  className={idx % 2 === 0 ? 'bg-white' : 'bg-blue-50'}
                >
                  <td className="border px-4 py-2">{row.empName}</td>
                  <td className="border px-4 py-2">{row.rank}</td>
                  <td className="border px-4 py-2 text-center">{row.days}</td>
                  <td className="border px-4 py-2 text-right">
                    {row.eightHourPay}
                  </td>
                  <td className="border px-4 py-2 text-right">{row.vda}</td>
                  <td className="border px-4 py-2 text-right">{row.uniform}</td>
                  <td className="border px-4 py-2 text-right">{row.hra}</td>
                  <td className="border px-4 py-2 text-right">{row.total}</td>
                  <td className="border px-4 py-2 text-right">
                    {row.extraDuty}
                  </td>
                  <td className="border px-4 py-2 text-right">{row.adv}</td>
                  <td className="border px-4 py-2 text-right">
                    {row.deduction}
                  </td>
                  <td className="border px-4 py-2 text-right font-semibold">
                    {row.netPay}
                  </td>
                </tr>
              ))}

              {/* Last pushRows rows and total row together in printMode */}
              {printMode && (
                <>
                  {/* Breaks */}
                  {pushRows !== 0 &&
                    [...Array(breaksNeeded)].map((_, i) => <br key={i} />)}

                  {/* Push Rows */}
                  {rowsToDisplay.slice(-pushRows).map((row, idx) => (
                    <tr
                      key={`last-${idx}`}
                      className={
                        (rowsToDisplay.length - pushRows + idx) % 2 === 0
                          ? 'bg-white'
                          : 'bg-blue-50'
                      }
                    >
                      <td className="border px-4 py-2">PUSH:{row.empName}</td>
                      <td className="border px-4 py-2">{row.rank}</td>
                      <td className="border px-4 py-2 text-center">
                        {row.days}
                      </td>
                      <td className="border px-4 py-2 text-right">
                        {row.eightHourPay}
                      </td>
                      <td className="border px-4 py-2 text-right">{row.vda}</td>
                      <td className="border px-4 py-2 text-right">
                        {row.uniform}
                      </td>
                      <td className="border px-4 py-2 text-right">{row.hra}</td>
                      <td className="border px-4 py-2 text-right">
                        {row.total}
                      </td>
                      <td className="border px-4 py-2 text-right">
                        {row.extraDuty}
                      </td>
                      <td className="border px-4 py-2 text-right">{row.adv}</td>
                      <td className="border px-4 py-2 text-right">
                        {row.deduction}
                      </td>
                      <td className="border px-4 py-2 text-right font-semibold">
                        {row.netPay}
                      </td>
                    </tr>
                  ))}

                  {/* Total  */}
                  <tr className="bg-blue-200 font-bold avoid-break">
                    <td className="border px-4 py-2 text-right" colSpan={3}>
                      Total
                    </td>
                    <td className="border px-4 py-2 text-right">
                      {data.reduce((sum, row) => sum + row.eightHourPay, 0)}
                    </td>
                    <td className="border px-4 py-2 text-right">
                      {data.reduce((sum, row) => sum + row.vda, 0)}
                    </td>
                    <td className="border px-4 py-2 text-right">
                      {data.reduce((sum, row) => sum + row.uniform, 0)}
                    </td>
                    <td className="border px-4 py-2 text-right">
                      {data.reduce((sum, row) => sum + row.hra, 0)}
                    </td>
                    <td className="border px-4 py-2 text-right">
                      {data.reduce((sum, row) => sum + row.total, 0)}
                    </td>
                    <td className="border px-4 py-2 text-right">
                      {data.reduce((sum, row) => sum + row.extraDuty, 0)}
                    </td>
                    <td className="border px-4 py-2 text-right">
                      {data.reduce((sum, row) => sum + row.adv, 0)}
                    </td>
                    <td className="border px-4 py-2 text-right">
                      {data.reduce((sum, row) => sum + row.deduction, 0)}
                    </td>
                    <td className="border px-4 py-2 text-right font-semibold">
                      {data.reduce((sum, row) => sum + row.netPay, 0)}
                    </td>
                  </tr>
                </>
              )}

              {/* If not printMode, just render the last rows normally */}
              {!printMode &&
                rowsToDisplay.slice(-pushRows).map((row, idx) => (
                  <tr
                    key={`last-nonprint-${idx}`}
                    className={
                      (rowsToDisplay.length - pushRows + idx) % 2 === 0
                        ? 'bg-white'
                        : 'bg-blue-50'
                    }
                  >
                    <td className="border px-4 py-2">{row.empName}</td>
                    <td className="border px-4 py-2">{row.rank}</td>
                    <td className="border px-4 py-2 text-center">{row.days}</td>
                    <td className="border px-4 py-2 text-right">
                      {row.eightHourPay}
                    </td>
                    <td className="border px-4 py-2 text-right">{row.vda}</td>
                    <td className="border px-4 py-2 text-right">
                      {row.uniform}
                    </td>
                    <td className="border px-4 py-2 text-right">{row.hra}</td>
                    <td className="border px-4 py-2 text-right">{row.total}</td>
                    <td className="border px-4 py-2 text-right">
                      {row.extraDuty}
                    </td>
                    <td className="border px-4 py-2 text-right">{row.adv}</td>
                    <td className="border px-4 py-2 text-right">
                      {row.deduction}
                    </td>
                    <td className="border px-4 py-2 text-right font-semibold">
                      {row.netPay}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>

        {/* In words and signature */}
        <div className="flex flex-col items-center mt-10">
          <p className="text-center text-base">
            Total Amount in Words: one hundred and fifty thousand six hundred
            and eight
          </p>
          <div className="flex flex-col items-center justify-center">
            <p className="text-base mt-2">Signature _________________</p>
            <p className="text-base ml-2">
              Date: {formatDateDdMmYyyySlash(new Date())}
            </p>
          </div>
        </div>
      </div>

      {/* Pagination */}
      {!printMode && (
        <div className="flex justify-between items-center mt-6">
          <button
            className="px-4 py-2 bg-blue-200 text-blue-900 rounded disabled:opacity-50"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            Previous
          </button>
          <span className="text-gray-700">
            Page <span className="font-semibold">{page}</span> of
            <span className="font-semibold">{totalPages}</span>
          </span>
          <button
            className="px-4 py-2 bg-blue-200 text-blue-900 rounded disabled:opacity-50"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
          >
            Next
          </button>
        </div>
      )}
      {/* Footer */}
      <div className="mt-8 text-center border-t pt-4">
        <p className="text-gray-700">
          <span className="font-semibold">Note:</span> This is a
          system-generated salary report. For any discrepancies, please contact
          HR.
        </p>
        <p className="mt-2 text-sm text-gray-500">
          © {new Date().getFullYear()} PSCPL Payroll
        </p>
      </div>
    </div>
  );
};

export default SalaryReportTable;
