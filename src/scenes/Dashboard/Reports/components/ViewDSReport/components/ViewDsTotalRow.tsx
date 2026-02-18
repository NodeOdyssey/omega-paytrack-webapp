// Libraries
import React from 'react';

// Prop Types
interface ViewDsTotalRowProps {
  totalGrossPay: number;
  totalNetPay: number;
}

// Main Component
const ViewDsTotalRow: React.FC<ViewDsTotalRowProps> = ({
  totalGrossPay,
  totalNetPay,
}) => (
  <tr className="report-table-row">
    {/* Sl. No. */}
    <td className="report-table-cell px-2 py-2 font-bold"></td>
    {/* Name & Rank */}
    <td className="report-table-cell px-2 py-2 font-bold text-sm">Total</td>
    {/* No. of Days */}
    <td className="report-table-cell px-2 py-2 font-bold"></td>
    {/* 8 Hours Pay */}
    <td className="report-table-cell px-2 py-2 font-bold"></td>
    {/* Uniform */}
    <td className="report-table-cell px-2 py-2 font-bold"></td>
    {/* Gross Pay */}
    <td className="report-table-cell px-2 py-2 font-bold text-xs text-right">
      {totalGrossPay.toFixed(2)}
    </td>
    {/* ...other columns as per your table... */}
    <td className="report-table-cell px-2 py-2 font-bold"></td>
    <td className="report-table-cell px-2 py-2 font-bold"></td>
    <td className="report-table-cell px-2 py-2 font-bold"></td>
    <td className="report-table-cell px-2 py-2 font-bold"></td>
    <td className="report-table-cell px-2 py-2 font-bold"></td>
    {/* Net Pay */}
    <td className="report-table-cell px-2 py-2 font-bold text-xs text-right">
      {totalNetPay.toFixed(2)}
    </td>
    {/* Sign */}
    <td className="report-table-cell px-2 py-2"></td>
  </tr>
);

export default ViewDsTotalRow;
