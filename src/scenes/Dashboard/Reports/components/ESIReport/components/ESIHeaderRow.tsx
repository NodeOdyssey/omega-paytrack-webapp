import React from 'react';

const ESIHeaderRow: React.FC = () => (
  <tr>
    <th
      className="report-table-header px-1 py-0.5 text-center w-[1%]"
      rowSpan={2}
    >
      Sl. No.
    </th>
    <th className="report-table-header text-left px-1 py-0.5" rowSpan={2}>
      ESI No.
    </th>
    <th className="report-table-header text-left px-1 py-0.5" rowSpan={2}>
      Name
    </th>
    <th className="report-table-header px-1 py-0.5 text-center" rowSpan={2}>
      <p>No of</p>
      <p>Days</p>
    </th>
    <th className="report-table-header px-1 py-0.5 text-center" rowSpan={2}>
      Gross Pay
    </th>
    <th className="report-table-header px-1 py-0.5 text-center" rowSpan={2}>
      Employees Contribution
    </th>
    <th className="report-table-header px-1 py-0.5 text-center" rowSpan={2}>
      Employers Contribution
    </th>
    <th className="report-table-header px-1 py-0.5 text-center" rowSpan={2}>
      Total
    </th>
    <th className="report-table-header px-1 py-0.5 text-center" rowSpan={2}>
      Sign
    </th>
  </tr>
);

export default ESIHeaderRow;
