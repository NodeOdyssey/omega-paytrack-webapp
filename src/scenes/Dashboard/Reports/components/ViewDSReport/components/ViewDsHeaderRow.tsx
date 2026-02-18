import React from 'react';

const ViewDsHeaderRow: React.FC = () => (
  <tr>
    <th
      className="border-2 border-primaryText text-xs  px-2 py-0.5 text-center"
      rowSpan={2}
    >
      Sl. No.
    </th>
    <th
      className="border-2 text-left border-primaryText px-2 py-0.5 text-xs "
      rowSpan={2}
    >
      Name & Details
    </th>
    <th
      className="border-2 border-primaryText px-2 py-0.5 text-center text-xs "
      rowSpan={2}
    >
      Days
    </th>
    <th
      className="border-2 border-primaryText px-2 py-0.5 text-center text-xs "
      rowSpan={2}
    >
      Basic Pay
    </th>
    <th
      className="border-2 border-primaryText py-0.5 text-center text-xs "
      rowSpan={6}
    >
      Allowances
    </th>
    <th
      className="border-2 border-primaryText px-2 py-0.5 text-center text-xs "
      rowSpan={2}
    >
      Gross Pay
    </th>
    <th
      className="border-2 border-primaryText px-2 py-0.5 text-center text-xs "
      rowSpan={2}
    >
      Extra Duty
    </th>
    <th
      className="border-2 border-primaryText py-0.5 text-center text-xs "
      rowSpan={4}
    >
      Deduction
    </th>
    <th
      className="border-2 border-primaryText px-2 py-0.5 text-center text-xs "
      rowSpan={4}
    >
      Other
    </th>
    <th
      className="border-2 border-primaryText px-2 py-0.5 text-center text-xs "
      rowSpan={2}
    >
      Other Deduction
    </th>
    <th
      className="border-2 border-primaryText px-2 py-0.5 text-center text-xs "
      rowSpan={2}
    >
      Total Deduction
    </th>
    <th
      className="border-2 border-primaryText px-2 py-0.5 text-center text-xs "
      rowSpan={2}
    >
      Net Pay
    </th>
    <th
      className="border-2 border-primaryText px-2 py-0.5 text-center text-xs "
      rowSpan={2}
    >
      Sign
    </th>
  </tr>
);

export default ViewDsHeaderRow;
