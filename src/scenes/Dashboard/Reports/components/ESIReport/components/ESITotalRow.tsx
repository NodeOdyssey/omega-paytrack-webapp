import React from 'react';

interface ESITotalRowProps {
  totalGrossPay: number;
  grandTotalEsi: number;
}

const ESITotalRow: React.FC<ESITotalRowProps> = ({
  totalGrossPay,
  grandTotalEsi,
}) => (
  <tr className="report-table-row">
    <td className="report-table-cell px-2 py-2 font-bold"></td>
    <td className="report-table-cell px-2 py-2 font-bold text-xs">Total</td>
    <td className="report-table-cell px-2 py-2 font-bold"></td>
    <td className="report-table-cell px-2 py-2 font-bold"></td>
    <td className="report-table-cell px-2 py-2 font-bold text-xs text-right">
      {Number(totalGrossPay).toFixed(2)}
    </td>
    <td className="report-table-cell px-2 py-2 font-bold"></td>
    <td className="report-table-cell px-2 py-2 font-bold"></td>
    <td className="report-table-cell px-2 py-2 font-bold text-xs text-right">
      {Number(grandTotalEsi).toFixed(2)}
    </td>
    <td className="report-table-cell px-2 py-2"></td>
  </tr>
);

export default ESITotalRow;
