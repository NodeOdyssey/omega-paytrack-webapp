import React from 'react';

interface SalaryTotalRowProps {
  totalNetPay: number;
}

const SalaryTotalRow: React.FC<SalaryTotalRowProps> = ({ totalNetPay }) => (
  <tr className="report-table-row">
    <td className="report-table-cell px-2 py-2 font-bold"></td>
    <td className="report-table-cell px-2 py-2 font-bold text-xs">Total</td>
    <td className="report-table-cell px-2 py-2 font-bold"></td>
    <td className="report-table-cell px-2 py-2 font-bold"></td>
    <td className="report-table-cell px-2 py-2 font-bold"></td>
    <td className="report-table-cell px-2 py-2 font-bold text-xs text-right">
      {Number(totalNetPay).toFixed(2)}
    </td>
    <td className="report-table-cell px-2 py-2 font-bold"></td>
    <td className="report-table-cell px-2 py-2 font-bold"></td>
  </tr>
);

export default SalaryTotalRow;
