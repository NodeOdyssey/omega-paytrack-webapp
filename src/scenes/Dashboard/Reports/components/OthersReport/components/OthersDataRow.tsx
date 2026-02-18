import React from 'react';
import { OthersReportRow } from '../../../../../../types/report-new';

interface OthersDataRowProps {
  rowData: OthersReportRow;
}

const OthersDataRow: React.FC<OthersDataRowProps> = ({ rowData }) => (
  <tr className="report-table-row">
    <td className="report-table-cell px-2 text-center">{rowData.slNo}</td>
    <td className="report-table-cell text-left px-2">{rowData.empName}</td>
    <td className="report-table-cell text-right pr-5">{rowData.days}</td>
    <td className="report-table-cell text-right pr-3">{rowData.basicSalary}</td>
    <td className="report-table-cell text-right pr-1">
      <div className="flex flex-col gap-1">
        <div className="report-cell-inner">
          <h3>Kits/Washing:</h3>
          <h3>{rowData.allowance.kitAllowances}</h3>
        </div>
        <div className="report-cell-inner">
          <h3>City Allow:</h3>
          <h3>{rowData.allowance.cityAllowances}</h3>
        </div>
        <div className="report-cell-inner">
          <h3>Conv/H.Rent:</h3>
          <h3>{rowData.allowance.convHra}</h3>
        </div>
      </div>
    </td>
    <td className="report-table-cell text-right pr-3">{rowData.grossPay}</td>
    <td className="report-table-cell text-right pr-3">{rowData.extraDuty}</td>
    <td className="report-table-cell text-right pr-3">{rowData.uniform}</td>
    <td className="report-table-cell text-right pr-3">{rowData.fourHourPay}</td>
    <td className="report-table-cell text-right pr-3">
      {rowData.specialAllowance}
    </td>
    <td className="report-table-cell text-right pr-3">{rowData.bonus}</td>
    <td className="report-table-cell text-right pr-3">
      <div className="flex flex-col gap-1">
        <div className="flex items-center justify-between">
          {/* ESI, EPF, Belt */}
          <div className="flex flex-col gap-1">
            <div className="flex justify-between space-x-2">
              <h3 className="text-xs  font-semibold">ESI:</h3>
              <h3 className="text-xs  font-semibold">
                {rowData.deduction.empESI}
              </h3>
            </div>
            <div className="flex justify-between space-x-2">
              <h3 className="text-xs  font-semibold">EPF:</h3>
              <h3 className="text-xs  font-semibold">
                {rowData.deduction.empEPF}
              </h3>
            </div>
            <div className="flex justify-between space-x-2">
              <h3 className="text-xs  font-semibold">Belt:</h3>
              <h3 className="text-xs  font-semibold">
                {rowData.deduction.belt}
              </h3>
            </div>
          </div>
          {/* Adv, P.Tax, Uniform */}
          <div className="flex flex-col gap-1">
            <div className="flex justify-between space-x-2">
              <h3 className="text-xs  font-semibold">Adv:</h3>
              <h3 className="text-xs  font-semibold">
                {rowData.deduction.adv}
              </h3>
            </div>
            <div className="flex justify-between space-x-2">
              <h3 className="text-xs  font-semibold">P.Tax:</h3>
              <h3 className="text-xs  font-semibold">
                {rowData.deduction.pTax}
              </h3>
            </div>
            <div className="flex justify-between space-x-2">
              <h3 className="text-xs  font-semibold">Uniform:</h3>
              <h3 className="text-xs  font-semibold">
                {rowData.deduction.Uniform}
              </h3>
            </div>
          </div>
        </div>
      </div>
    </td>
    <td className="report-table-cell text-right pr-3">{rowData.netPay}</td>
    <td className="report-table-cell px-2"></td>
  </tr>
);

export default OthersDataRow;
