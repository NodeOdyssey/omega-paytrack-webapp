import React from 'react';
import { NewPayrollRow } from '../../../../../../types/report-new';

interface NewPayrollDataRowProps {
  rowData: NewPayrollRow;
  index: number;
  offset?: number;
}

const NewPayrollDataRow: React.FC<NewPayrollDataRowProps> = ({
  rowData,
  // index,
  // offset = 0,
}) => (
  <tr className="report-table-row">
    {/* <td className="report-table-cell px-2 text-center">{offset + index + 1}</td> */}
    <td className="report-table-cell px-2 py-1 text-center w-[2%]">
      {rowData.slNo}
    </td>
    <td className="report-table-cell text-left px-2 py-1 w-[15%]">
      <div className="flex flex-col gap-1">
        <span>{rowData.empName}</span>
        <span>{rowData.rank}</span>
      </div>
    </td>
    <td className="report-table-cell text-right pr-3">{rowData.days}</td>
    <td className="report-table-cell text-right pr-3">
      {rowData.basicSalary.toFixed(2)}
    </td>
    <td className="report-table-cell text-right pr-3">
      {rowData.uniform.toFixed(2)}
    </td>
    <td className="report-table-cell text-right pr-3">
      {rowData.bonus.toFixed(2)}
    </td>
    <td className="report-table-cell text-right pr-3">
      {rowData.total.toFixed(2)}
    </td>
    <td className="report-table-cell text-right pr-3">
      {rowData.extraDuty.toFixed(2)}
    </td>
    <td className="report-table-cell text-right pr-2">
      {rowData.deduction.empEPF.toFixed(2)}
    </td>
    <td className="report-table-cell text-right pr-2">
      {rowData.deduction.empESI.toFixed(2)}
    </td>
    <td className="report-table-cell text-right pr-2">
      {rowData.deduction.emplrEPF.toFixed(2)}
    </td>
    <td className="report-table-cell text-right pr-2">
      {rowData.deduction.emplrESI.toFixed(2)}
    </td>
    <td className="report-table-cell text-right pr-2">
      {rowData.pTax.toFixed(2)}
    </td>
    <td className="report-table-cell text-right pr-2 w-[2%]">
      {rowData.otherDeduction.toFixed(2)}
    </td>
    <td className="report-table-cell text-right pr-2 w-[2%]">
      {rowData.totalDeduction.toFixed(2)}
    </td>
    <td className="report-table-cell text-right pr-2">
      {rowData.netPay.toFixed(2)}
    </td>
    <td className="report-table-cell px-2"></td>
  </tr>
);

export default NewPayrollDataRow;
