import React from 'react';

const DSLHeaderRow: React.FC = () => (
  <>
    {/* First header row: Company, Post, Date, etc. should be rendered outside this component */}
    {/* Second header row: Main column headers */}
    <tr>
      <th
        className="border-2 border-primaryText px-2 py-0.5 text-center text-xs"
        rowSpan={2}
      >
        Sl. No.
      </th>
      <th
        className="border-2 border-primaryText px-2 py-0.5 text-left text-xs"
        rowSpan={2}
      >
        Name & Rank
      </th>
      <th
        className="border-2 border-primaryText px-2 py-0.5 text-center text-xs"
        rowSpan={2}
      >
        No. of Days
      </th>
      <th
        className="border-2 border-primaryText px-2 py-0.5 text-center text-xs"
        rowSpan={2}
      >
        8 Hours Pay
      </th>
      {/* <th className="border-2 border-primaryText px-2 py-0.5 text-center text-xs" rowSpan={2}>
        VDA
      </th> */}
      <th
        className="border-2 border-primaryText px-2 py-0.5 text-center text-xs"
        rowSpan={2}
      >
        Uniform
      </th>
      <th
        className="border-2 border-primaryText px-2 py-0.5 text-center text-xs"
        rowSpan={2}
      >
        House Rent
      </th>
      <th
        className="border-2 border-primaryText px-2 py-0.5 text-center text-xs"
        rowSpan={2}
      >
        Total
      </th>
      <th
        className="border-2 border-primaryText px-2 py-0.5 text-center text-xs"
        rowSpan={2}
      >
        Extra Duty
      </th>
      <th
        className="border-2 border-primaryText px-2 py-0.5 text-center text-xs"
        rowSpan={2}
      >
        Adv
      </th>
      <th
        className="border-2 border-primaryText px-2 py-0.5 text-center text-xs"
        colSpan={4}
      >
        Deduction
      </th>
      <th
        className="border-2 border-primaryText px-2 py-0.5 text-center text-xs"
        rowSpan={2}
      >
        Total Deduction
      </th>
      <th
        className="border-2 border-primaryText px-2 py-0.5 text-center text-xs"
        rowSpan={2}
      >
        Net Pay
      </th>
      <th
        className="border-2 border-primaryText px-2 py-0.5 text-center text-xs"
        rowSpan={2}
      >
        Sign
      </th>
    </tr>
    {/* Third header row: Deduction sub-columns */}
    <tr>
      <th className="border-2 border-primaryText px-2 py-0.5 text-center text-xs">
        Employee EPF
      </th>
      <th className="border-2 border-primaryText px-2 py-0.5 text-center text-xs">
        Employee ESI
      </th>
      <th className="border-2 border-primaryText px-2 py-0.5 text-center text-xs">
        Employer EPF
      </th>
      <th className="border-2 border-primaryText px-2 py-0.5 text-center text-xs">
        Employer ESI
      </th>
    </tr>
  </>
);

export default DSLHeaderRow;
