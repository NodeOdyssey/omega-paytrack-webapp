import React from 'react';
import { LNTRow } from '../../../../../../types/report-new';

interface LNTDataRowProps {
  rowData: LNTRow;
}

const LNTDataRow: React.FC<LNTDataRowProps> = ({ rowData }) => (
  <tr className="report-table-row">
    <td className="report-table-cell px-2 text-center py-3">{rowData.slNo}</td>
    <td className="report-table-cell text-left px-2">
      <div className="flex flex-col gap-1">
        <span>{rowData.empName}</span>
        <span>{rowData.rank}</span>
      </div>
    </td>
    <td className="report-table-cell text-center px-1">{rowData.days}</td>
    <td className="report-table-cell text-right px-1">
      {rowData.eightHourPay}
    </td>
    {/* <td className="report-table-cell text-right">{rowData.vda}</td> */}
    <td className="report-table-cell text-right px-1">{rowData.uniform}</td>
    <td className="report-table-cell text-right px-1">
      {rowData.specialAllowance}
    </td>
    <td className="report-table-cell text-right px-1">{rowData.weeklyOff}</td>
    <td className="report-table-cell text-right px-1">{rowData.total}</td>
    <td className="report-table-cell text-right px-1">{rowData.extraDuty}</td>
    <td className="report-table-cell text-right px-1">{rowData.adv}</td>
    <td className="report-table-cell pr-1 py-1 text-xs">
      <div className="flex flex-col gap-1 items-end">
        {rowData.deduction.empEPF}
        <div className="text-start">P.Tax: {rowData.deduction.pTax}</div>
      </div>
    </td>
    <td className="report-table-cell text-right px-1">
      {rowData.deduction.empESI}
    </td>
    <td className="report-table-cell text-right px-1">
      {rowData.deduction.emplrEPF}
    </td>
    <td className="report-table-cell text-right px-1">
      {rowData.deduction.emplrESI}
    </td>
    <td className="report-table-cell text-right px-1">
      {rowData.totalDeduction}
    </td>
    <td className="report-table-cell text-right px-1">{rowData.netPay}</td>
    <td className="report-table-cell px-1"></td>
  </tr>
);

export default LNTDataRow;
