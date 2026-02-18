import React from 'react';

interface ViewWithoutAllowanceTotalRowProps {
  totalBasicSalary: number;
  totalNetPay: number;
}

const ViewWithoutAllowanceTotalRow: React.FC<
  ViewWithoutAllowanceTotalRowProps
> = ({ totalBasicSalary, totalNetPay }) => (
  <tr className="report-table-row">
    <td className="report-table-cell px-2 py-2 font-bold"></td>
    {/* Fill the rest as empty, except Basic Pay and Net Pay */}
    <td className="report-table-cell px-2 py-2 font-bold text-xs">Total</td>
    <td className="report-table-cell px-2 py-2 font-bold"></td>
    <td className="report-table-cell px-2 py-2 font-bold text-xs text-right">
      {Number(totalBasicSalary).toFixed(2)}
    </td>
    <td className="report-table-cell px-2 py-2 font-bold"></td>
    <td className="report-table-cell px-2 py-2 font-bold"></td>
    <td className="report-table-cell px-2 py-2 font-bold"></td>
    <td className="report-table-cell px-2 py-2 font-bold"></td>
    <td className="report-table-cell px-2 py-2 font-bold"></td>
    <td className="report-table-cell px-2 py-2 font-bold"></td>
    <td className="report-table-cell px-2 py-2 font-bold text-xs text-right">
      {Number(totalNetPay).toFixed(2)}
    </td>
    <td className="report-table-cell px-2 py-2"></td>
  </tr>
);

export default ViewWithoutAllowanceTotalRow;
