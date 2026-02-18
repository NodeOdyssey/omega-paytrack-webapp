import React from 'react';

interface EPFTotalRowProps {
  totalBasicSalary: number;
  grandTotalEpf: number;
}

const EPFTotalRow: React.FC<EPFTotalRowProps> = ({
  totalBasicSalary,
  grandTotalEpf,
}) => (
  <tr className="report-table-row">
    <td className="report-table-cell px-2 py-2 font-bold"></td>
    <td className="report-table-cell px-2 py-2 font-bold text-xs">Total</td>
    <td className="report-table-cell px-2 py-2 font-bold"></td>
    <td className="report-table-cell px-2 py-2 font-bold"></td>
    <td className="report-table-cell px-2 py-2 font-bold text-xs text-right">
      {Number(totalBasicSalary).toFixed(2)}
    </td>
    <td className="report-table-cell px-2 py-2 font-bold"></td>
    <td className="report-table-cell px-2 py-2 font-bold"></td>
    <td className="report-table-cell px-2 py-2 font-bold text-xs text-right">
      {Number(grandTotalEpf).toFixed(2)}
    </td>
    <td className="report-table-cell px-2 py-2"></td>
  </tr>
);

export default EPFTotalRow;
