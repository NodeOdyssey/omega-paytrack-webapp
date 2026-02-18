import React from 'react';
import { DsReportRow } from '../../../../../../types/report-new';

interface DsReportTableProps {
  rowData: DsReportRow;
  index: number;
  key: number;
}

const ViewDsDataRow: React.FC<DsReportTableProps> = ({
  rowData,
  // index
}) => (
  <tr className="report-table-row">
    {/* <td className="report-table-cell px-2 text-center">{index + 1}</td> */}
    <td className="report-table-cell px-2 text-center w-[2%]">
      {rowData.slNo}
    </td>
    <td className="report-table-cell text-left px-2">{rowData.empName}</td>
    <td className="report-table-cell text-right pr-5">{rowData.days}</td>
    <td className="report-table-cell text-right pr-3">
      {rowData.basicSalary.toFixed(2)}
    </td>
    <td className="report-table-cell text-right pr-1">
      <div className="flex flex-col gap-1">
        <div className="report-cell-inner">
          <h3>Kits/Washing:</h3>
          <h3>{rowData.allowances.kitAllowances.toFixed(2)}</h3>
        </div>
        <div className="report-cell-inner">
          <h3>City Allow:</h3>
          <h3>{rowData.allowances.cityAllowances.toFixed(2)}</h3>
        </div>
        <div className="report-cell-inner">
          <h3>Conv/H.Rent:</h3>
          <h3>{rowData.allowances.convHra.toFixed(2)}</h3>
        </div>
      </div>
    </td>
    <td className="report-table-cell text-right pr-2 w-[6%]">
      {rowData.grossPay.toFixed(2)}
    </td>
    <td className="report-table-cell text-right pr-2 w-[6%]">
      {rowData.extraDuty.toFixed(2)}
    </td>
    <td className="report-table-cell text-right p-1">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-5">
          <div className="report-cell-inner ">
            <h3>ESI:</h3>
            <h3>{rowData.deduction.empESI.toFixed(2)}</h3>
          </div>
          <div className="report-cell-inner ">
            <h3>EPF:</h3>
            <h3>{rowData.deduction.empEPF.toFixed(2)}</h3>
          </div>
        </div>
        <div className="flex flex-col gap-5 ml-2">
          <div className="report-cell-inner ">
            <h3>Adv:</h3>
            <h3>{rowData.deduction.adv.toFixed(2)}</h3>
          </div>
          <div className="report-cell-inner ">
            <h3>P.Tax:</h3>
            <h3>{rowData.deduction.pTax.toFixed(2)}</h3>
          </div>
        </div>
      </div>
    </td>
    <td className="report-table-cell text-right pr-2">
      <div className="flex flex-col gap-1">
        <div className="report-cell-inner ">
          <h3>Belt:</h3>
          <h3>{rowData.other.belt.toFixed(2)}</h3>
        </div>
        <div className="report-cell-inner ">
          <h3>Boot:</h3>
          <h3>{rowData.other.boot.toFixed(2)}</h3>
        </div>
        <div className="report-cell-inner ">
          <h3>Uniform:</h3>
          <h3>{rowData.other.uniform.toFixed(2)}</h3>
        </div>
      </div>
    </td>
    <td className="report-table-cell text-right pr-2 w-[5%]">
      {rowData.otherDeduction.toFixed(2)}
    </td>
    <td className="report-table-cell text-right pr-2 w-[5%]">
      {rowData.totalDeduction.toFixed(2)}
    </td>
    <td className="report-table-cell text-right pr-2">
      {rowData.netPay.toFixed(2)}
    </td>
    <td className="report-table-cell px-2"></td>
  </tr>
);

export default ViewDsDataRow;
