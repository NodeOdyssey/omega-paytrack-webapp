import React from 'react';

interface DSLTotalRowProps {
  totalGrossPay: number;
  totalNetPay: number;
}

const DSLTotalRow: React.FC<DSLTotalRowProps> = ({
  totalGrossPay,
  totalNetPay,
}) => (
  <tr className="report-table-row">
    {/* Sl. No. */}
    <td className="report-table-cell px-2 py-2 font-bold"></td>
    {/* Name & Rank */}
    <td className="report-table-cell px-2 py-2 font-bold text-xs">Total</td>
    {/* No. of Days */}
    <td className="report-table-cell px-2 py-2 font-bold"></td>
    {/* 8 Hours Pay */}
    <td className="report-table-cell px-2 py-2 font-bold"></td>
    {/* Uniform */}
    <td className="report-table-cell px-2 py-2 font-bold"></td>
    {/* House Rent */}
    <td className="report-table-cell px-2 py-2 font-bold"></td>
    {/* Total */}
    <td className="report-table-cell px-2 py-2 font-bold text-xs text-right">
      {Number(totalGrossPay).toFixed(2)}
    </td>
    {/* Extra Duty */}
    <td className="report-table-cell px-2 py-2 font-bold"></td>
    {/* Adv */}
    <td className="report-table-cell px-2 py-2 font-bold"></td>
    {/* Deduction: Employee EPF */}
    <td className="report-table-cell px-2 py-2 font-bold"></td>
    {/* Employee ESI */}
    <td className="report-table-cell px-2 py-2 font-bold"></td>
    {/* Employer EPF */}
    <td className="report-table-cell px-2 py-2 font-bold"></td>
    {/* Employer ESI */}
    <td className="report-table-cell px-2 py-2 font-bold"></td>
    {/* Total Deduction */}
    <td className="report-table-cell px-2 py-2 font-bold"></td>
    {/* Net Pay */}
    <td className="report-table-cell px-2 py-2 font-bold text-xs text-right">
      {Number(totalNetPay).toFixed(2)}
    </td>
    {/* Sign */}
    <td className="report-table-cell px-2 py-2"></td>
  </tr>
);

export default DSLTotalRow;
