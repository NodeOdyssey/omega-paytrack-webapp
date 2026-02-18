import React from 'react';
import { ESIRow } from '../../../../../../types/report-new';

interface ESIDataRowProps {
  rowData: ESIRow;
  index: number;
  offset?: number;
}

const ESIDataRow: React.FC<ESIDataRowProps> = ({
  rowData,
  // index,
  // offset = 0,
}) => (
  <tr className="report-table-row">
    <td className="report-table-cell py-1 text-center px-1">{rowData.slNo}</td>
    <td className="report-table-cell text-left px-1">
      <span>{rowData.accNo}</span>
    </td>
    <td className="report-table-cell text-left px-1">
      <span>{rowData.empName}</span>
    </td>
    <td className="report-table-cell text-center px-1">{rowData.days}</td>
    <td className="report-table-cell text-right px-1">
      {Number(rowData.grossPay).toFixed(2)}
    </td>
    <td className="report-table-cell text-right px-1">
      {Number(rowData.empESI).toFixed(2)}
    </td>
    <td className="report-table-cell text-right px-1">
      {Number(rowData.emplrESI).toFixed(2)}
    </td>
    <td className="report-table-cell text-right px-1">
      {Number(rowData.total).toFixed(2)}
    </td>
    <td className="report-table-cell px-1"></td>
  </tr>
);

export default ESIDataRow;
