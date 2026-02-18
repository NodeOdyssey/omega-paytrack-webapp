import React from 'react';
import { EPFRow } from '../../../../../../types/report-new';

interface EPFDataRowProps {
  rowData: EPFRow;
  index: number;
  offset?: number;
}

const EPFDataRow: React.FC<EPFDataRowProps> = ({
  rowData,
  // index,
  // offset = 0,
}) => (
  <tr className="report-table-row">
    <td className="report-table-cell px-2 text-center w-[1%] py-1">
      {rowData.slNo}
    </td>
    <td className="report-table-cell text-left px-2">{rowData.accNo}</td>
    <td className="report-table-cell px-2 text-left w-[30%]">
      {rowData.empName}
    </td>
    <td className="report-table-cell text-center px-2">{rowData.days}</td>
    <td className="report-table-cell text-right pr-3">
      {Number(rowData.basicSalary).toFixed(2)}
    </td>
    <td className="report-table-cell text-right pr-3">
      {Number(rowData.empEPF).toFixed(2)}
    </td>
    <td className="report-table-cell text-right pr-3">
      {Number(rowData.emplrEPF).toFixed(2)}
    </td>
    <td className="report-table-cell text-right pr-2 w-[5%]">
      {Number(rowData.total).toFixed(2)}
    </td>
    <td className="report-table-cell px-2"></td>
  </tr>
);

export default EPFDataRow;
