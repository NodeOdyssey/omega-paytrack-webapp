import React from 'react';

const NewPayrollHeaderRow: React.FC = () => (
  <>
    <tr>
      <th className="report-table-header px-2 py-0.5 text-center" rowSpan={2}>
        Sl. No.
      </th>
      <th className="report-table-header text-left px-2 py-0.5" rowSpan={2}>
        Name & Rank
      </th>
      <th className="report-table-header px-2 py-0.5 text-center" rowSpan={2}>
        Days
      </th>
      <th className="report-table-header px-2 py-0.5 text-center" rowSpan={2}>
        Basic Pay
      </th>
      <th className="report-table-header px-2 py-0.5 text-center" rowSpan={2}>
        Uniform
      </th>
      <th className="report-table-header px-2 py-0.5 text-center" rowSpan={2}>
        Bonus
      </th>
      <th className="report-table-header px-2 py-0.5 text-center" rowSpan={2}>
        Total
      </th>
      <th className="report-table-header px-2 py-0.5 text-center" rowSpan={2}>
        Extra Duty
      </th>
      <th className="report-table-header py-0.5 text-center" colSpan={4}>
        Deduction
      </th>
      <th className="report-table-header px-2 py-0.5 text-center" rowSpan={2}>
        P.Tax
      </th>
      <th className="report-table-header px-2 py-0.5 text-center" rowSpan={2}>
        Other Deduction
      </th>
      <th className="report-table-header px-2 py-0.5 text-center" rowSpan={2}>
        Total Deduction
      </th>
      <th className="report-table-header px-2 py-0.5 text-center" rowSpan={2}>
        Net Pay
      </th>
      <th className="report-table-header px-2 py-0.5 text-center" rowSpan={2}>
        Sign
      </th>
    </tr>
    <tr>
      <th className="report-table-header text-xs px-2 py-0.5 text-center">
        Emp EPF
      </th>
      <th className="report-table-header text-xs px-2 py-0.5 text-center">
        Emp ESI
      </th>
      <th className="report-table-header text-xs px-2 py-0.5 text-center">
        Emplr EPF
      </th>
      <th className="report-table-header text-xs px-2 py-0.5 text-center">
        Emplr ESI
      </th>
    </tr>
  </>
);

export default NewPayrollHeaderRow;
