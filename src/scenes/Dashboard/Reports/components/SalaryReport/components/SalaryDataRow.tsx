import React from 'react';
import { SalaryRow } from '../../../../../../types/report-new';

interface SalaryDataRowProps {
  rowData: SalaryRow;
  index: number;
  offset?: number;
}

const SalaryDataRow: React.FC<SalaryDataRowProps> = ({ rowData }) => (
  <tr className="report-table-row">
    <td className="report-table-cell py-1 text-center px-1">{rowData.slNo}</td>
    <td className="report-table-cell text-left px-1">{rowData.empName}</td>
    <td className="report-table-cell text-right px-1">{rowData.accountNum}</td>
    <td className="report-table-cell text-right px-1">{rowData.ifsc}</td>
    <td className="report-table-cell text-center px-1">{rowData.bankName}</td>
    <td className="report-table-cell text-right px-1">
      {Number(rowData.netPay).toFixed(2)}
    </td>
    <td className="report-table-cell text-left px-1">{rowData.postName}</td>
    <td className="report-table-cell text-left px-1"></td>
  </tr>
);

export default SalaryDataRow;
