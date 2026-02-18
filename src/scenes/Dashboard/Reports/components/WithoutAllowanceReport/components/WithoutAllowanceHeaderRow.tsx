import React from 'react';

const WithoutAllowanceHeaderRow: React.FC = () => (
  <tr>
    <th
      className="report-table-header px-2 py-0.5 text-center w-[1%]"
      rowSpan={2}
    >
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
      Extra Duty
    </th>
    <th className="report-table-header py-0.5 text-center" rowSpan={4}>
      Deduction
    </th>
    <th className="report-table-header py-0.5 text-center" rowSpan={4}>
      Other
    </th>
    <th
      className="report-table-header px-2 py-0.5 text-center w-[2%]"
      rowSpan={2}
    >
      Bonus
    </th>
    <th
      className="report-table-header px-2 py-0.5 text-center w-[5%]"
      rowSpan={2}
    >
      Other Deduction
    </th>
    <th
      className="report-table-header px-2 py-0.5 text-center w-[5%]"
      rowSpan={2}
    >
      Total Deduction
    </th>
    <th
      className="report-table-header px-2 py-0.5 text-center w-[5%]"
      rowSpan={2}
    >
      Net Pay
    </th>
    <th className="report-table-header px-2 py-0.5 text-center" rowSpan={2}>
      Sign
    </th>
  </tr>
);

export default WithoutAllowanceHeaderRow;
