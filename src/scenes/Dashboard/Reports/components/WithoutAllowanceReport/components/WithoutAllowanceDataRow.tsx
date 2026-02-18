// Libraries
import React from 'react';
import { WithoutAllowanceRow } from '../../../../../../types/report-new';

interface WithoutAllowanceDataRowProps {
  rowData: WithoutAllowanceRow;
  index: number;
  offset?: number; // for correct serial number in paginated view
}

const ViewWithoutAllowanceDataRow: React.FC<WithoutAllowanceDataRowProps> = ({
  rowData,
  // index,
  // offset = 0,
}) => (
  <tr className="report-table-row">
    {/* <td className="report-table-cell px-2 text-center">{offset + index + 1}</td> */}
    <td className="report-table-cell px-2 text-center">{rowData.slNo}</td>
    <td className="report-table-cell text-left px-2">
      <div className="flex flex-col gap-1">
        <span>{rowData.empName}</span>
        {/* <span>{rowData.rank}</span> */}
      </div>
    </td>
    <td className="report-table-cell text-right pr-5">{rowData.days}</td>
    <td className="report-table-cell text-right pr-3">
      {Number(rowData.basicSalary).toFixed(2)}
    </td>
    <td className="report-table-cell text-right pr-3">
      {Number(rowData.extraDuty).toFixed(2)}
    </td>
    <td className="report-table-cell text-right pr-2">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-5">
          <div className="report-cell-inner">
            <span>ESI:</span>
            <span>{Number(rowData.deduction.empESI).toFixed(2)}</span>
          </div>
          <div className="report-cell-inner">
            <span>EPF:</span>
            <span>{Number(rowData.deduction.empEPF).toFixed(2)}</span>
          </div>
        </div>
        <div className="flex flex-col gap-5 ml-2">
          <div className="report-cell-inner">
            <span>Adv:</span>
            <span>{Number(rowData.deduction.adv).toFixed(2)}</span>
          </div>
          <div className="report-cell-inner">
            <span>P.Tax:</span>
            <span>{Number(rowData.deduction.pTax).toFixed(2)}</span>
          </div>
        </div>
      </div>
    </td>
    <td className="report-table-cell text-right pr-2">
      <div className="flex flex-col gap-1">
        <div className="report-cell-inner">
          <span>Belt:</span>
          <span>{Number(rowData.other.belt).toFixed(2)}</span>
        </div>
        <div className="report-cell-inner">
          <span>H.Rent:</span>
          <span>{Number(rowData.other.boot).toFixed(2)}</span>
        </div>
        <div className="report-cell-inner">
          <span>Uniform:</span>
          <span>{Number(rowData.other.uniform).toFixed(2)}</span>
        </div>
      </div>
    </td>
    <td className="report-table-cell text-right pr-2">
      {Number(rowData.bonus).toFixed(2)}
    </td>
    <td className="report-table-cell text-right px-2">
      {Number(rowData.otherDeduction).toFixed(2)}
    </td>
    <td className="report-table-cell text-right px-2">
      {Number(rowData.totalDeduction).toFixed(2)}
    </td>
    <td className="report-table-cell text-right px-2">
      {Number(rowData.netPay).toFixed(2)}
    </td>
    <td className="report-table-cell px-2"></td>
  </tr>
);

export default ViewWithoutAllowanceDataRow;
