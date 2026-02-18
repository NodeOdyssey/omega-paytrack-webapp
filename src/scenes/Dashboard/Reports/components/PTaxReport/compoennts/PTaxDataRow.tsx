import React from 'react';
import { PTaxRow } from '../../../../../../types/report-new';

interface PTaxDataRowProps {
  rowData: PTaxRow;
  index: number;
  offset?: number;
}

const PTaxDataRow: React.FC<PTaxDataRowProps> = ({ rowData }) => (
  <tr className="report-table-row">
    <td className="report-table-cell py-1 text-center px-1">{rowData.slNo}</td>
    <td className="report-table-cell text-left px-1">{rowData.empName}</td>
    <td className="report-table-cell text-left px-1">{rowData.postName}</td>
    <td className="report-table-cell text-right px-1">
      {Number(rowData.basicSalary).toFixed(2)}
    </td>
    <td className="report-table-cell text-right px-1">
      {Number(rowData.pTax).toFixed(2)}
    </td>
    <td className="report-table-cell px-1"></td>
  </tr>
);

export default PTaxDataRow;
