import React from 'react';

interface PTaxTotalRowProps {
  totalBasicSalary: number;
  grandTotalPtax: number;
}

const PTaxTotalRow: React.FC<PTaxTotalRowProps> = ({
  totalBasicSalary,
  grandTotalPtax,
}) => (
  <tr className="report-table-row">
    <td className="report-table-cell px-2 py-2 font-bold"></td>
    <td className="report-table-cell px-2 py-2 font-bold text-xs">Total</td>
    <td className="report-table-cell px-2 py-2 font-bold"></td>
    <td className="report-table-cell px-2 py-2 font-bold text-xs text-right">
      {Number(totalBasicSalary).toFixed(2)}
    </td>
    <td className="report-table-cell px-2 py-2 font-bold text-xs text-right">
      {Number(grandTotalPtax).toFixed(2)}
    </td>
    <td className="report-table-cell px-2 py-2 font-bold"></td>
    <td className="report-table-cell px-2 py-2"></td>
  </tr>
);

export default PTaxTotalRow;
