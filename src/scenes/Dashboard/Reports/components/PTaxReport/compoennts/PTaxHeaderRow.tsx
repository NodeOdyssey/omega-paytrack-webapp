import React from 'react';

const PTaxHeaderRow: React.FC = () => (
  <tr>
    <th
      className="report-table-header px-2 py-2 text-center w-[1%]"
      rowSpan={2}
    >
      Sl. No.
    </th>
    <th className="report-table-header text-left px-2 py-0.5" rowSpan={2}>
      Employee Name
    </th>
    <th className="report-table-header text-left px-2 py-0.5" rowSpan={2}>
      Post
    </th>
    <th className="report-table-header px-2 py-0.5 text-center" rowSpan={2}>
      Basic Salary
    </th>
    <th className="report-table-header px-2 py-0.5 text-center" rowSpan={2}>
      Professional Tax
    </th>
    <th className="report-table-header px-2 py-0.5 text-center" rowSpan={2}>
      Sign
    </th>
  </tr>
);

export default PTaxHeaderRow;
