import React from 'react';
import { DSLReportRow } from '../../../../../../types/report-new';

interface DSLDataRowProps {
  rowData: DSLReportRow;
  index: number;
  offset?: number;
}

const DSLDataRow: React.FC<DSLDataRowProps> = ({
  rowData,
  // index,
  // offset = 0,
}) => (
  <tr className="report-table-row">
    {/* Sl. No. */}
    <td className="report-table-cell px-2 text-xs text-center">
      {rowData.slNo}
    </td>
    {/* Name & Rank */}
    <td className="report-table-cell text-left px-2 py-1 text-xs whitespace-nowrap">
      <div className="flex flex-col gap-1">
        <div>{rowData.empName}</div>
        {rowData.rank}
      </div>
    </td>
    {/* No. of Days */}
    <td className="report-table-cell pr-4 py-1 text-xs text-right">
      {rowData.days}
    </td>
    {/* 8 Hours Pay */}
    <td className="report-table-cell px-2 py-1 text-xs text-right">
      {rowData.eightHourPay}
    </td>
    {/* Uniform */}
    <td className="report-table-cell px-2 py-1 text-xs text-right">
      {rowData.uniform}
    </td>
    {/* House Rent */}
    <td className="report-table-cell px-2 py-1 text-xs text-right">
      {rowData.hra}
    </td>
    {/* Total */}
    <td className="report-table-cell px-2 py-1 text-xs text-right">
      {rowData.total}
    </td>
    {/* Extra Duty */}
    <td className="report-table-cell px-2 py-1 text-xs text-right">
      {rowData.extraDuty}
    </td>
    {/* Adv */}
    <td className="report-table-cell px-2 py-1 text-xs text-right">
      {rowData.adv}
    </td>
    {/* Deduction: Employee EPF + P.Tax */}
    <td className="report-table-cell pr-1 py-1 text-xs">
      <div className="flex flex-col gap-1 items-end">
        {rowData.deduction.empEPF}
        <div className="text-start">P.Tax: {rowData.deduction.pTax}</div>
      </div>
    </td>
    {/* Employee ESI */}
    <td className="report-table-cell pr-2 py-1 text-xs text-right">
      {rowData.deduction.empESI}
    </td>
    {/* Employer EPF */}
    <td className="report-table-cell pr-2 py-1 text-xs text-right">
      {rowData.deduction.emplrEPF}
    </td>
    {/* Employer ESI */}
    <td className="report-table-cell pr-2 py-1 text-xs text-right">
      {rowData.deduction.emplrESI}
    </td>
    {/* Total Deduction */}
    <td className="report-table-cell pr-2 py-1 text-xs text-right">
      {rowData.totalDeduction}
    </td>
    {/* Net Pay */}
    <td className="report-table-cell pr-2 py-1 text-xs text-right">
      {rowData.netPay}
    </td>
    {/* Sign */}
    <td className="report-table-cell px-2 py-1"></td>
  </tr>
);

export default DSLDataRow;
