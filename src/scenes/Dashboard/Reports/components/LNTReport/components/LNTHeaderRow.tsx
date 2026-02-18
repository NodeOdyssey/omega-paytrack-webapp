import React from 'react';

const LNTHeaderRow: React.FC = () => (
  <>
    {' '}
    <tr>
      <th className="report-table-header px-1 py-0.5 text-center" rowSpan={2}>
        Sl. No.
      </th>
      <th
        className="report-table-header text-left px-1 py-0.5 w-[17%]"
        rowSpan={2}
      >
        Name & Rank
      </th>
      <th
        className="report-table-header px-1 py-0.5 text-center w-[4%]"
        rowSpan={2}
      >
        No. of Days
      </th>
      <th
        className="report-table-header px-1 py-0.5 text-center w-[6%]"
        rowSpan={2}
      >
        8 Hours Pay
      </th>
      {/* <th
  className="report-table-header px-1 py-0.5 text-center w-[3%]"
  rowSpan={2}
>
  VDA
</th> */}
      <th
        className="report-table-header px-1 py-0.5 text-center w-[3%]"
        rowSpan={2}
      >
        Uniform
      </th>
      <th
        className="report-table-header px-1 py-0.5 text-center w-[5%]"
        rowSpan={2}
      >
        Special Allowance
      </th>
      <th
        className="report-table-header px-1 py-0.5 text-center w-[4%]"
        rowSpan={2}
      >
        Weekly Off
      </th>
      <th className="report-table-header px-1 py-0.5 text-center" rowSpan={2}>
        Total
      </th>
      <th
        className="report-table-header px-1 py-0.5 text-center w-[2%]"
        rowSpan={2}
      >
        <div className="flex flex-col">
          <p> Extra</p>
          <p>Duty</p>
        </div>
      </th>
      <th
        className="report-table-header px-1 py-0.5 text-center  w-[4%]"
        rowSpan={2}
      >
        Adv
      </th>
      <th className="report-table-header px-1 py-0.5 text-center" colSpan={4}>
        Deduction
      </th>
      <th
        className="report-table-header px-1 py-0.5 text-center w-[4%]"
        rowSpan={2}
      >
        Total Deduction
      </th>
      <th
        className="report-table-header px-1 py-0.5 text-center w-[6%]"
        rowSpan={2}
      >
        Net Pay
      </th>
      <th className="report-table-header px-1 py-0.5 text-center" rowSpan={2}>
        Sign
      </th>
    </tr>
    <tr>
      <th className="border-2 border-primaryText px-1 py-0.5 text-center text-xs   w-[4%]">
        Employee EPF
      </th>

      <th className="border-2 border-primaryText px-1 py-0.5 text-center text-xs   w-[4%]">
        Employee ESI
      </th>
      <th className="border-2 border-primaryText px-1 py-0.5 text-center text-xs   w-[4%]">
        Employer EPF
      </th>
      <th className="border-2 border-primaryText px-1 py-0.5 text-center text-xs   w-[4%]">
        Employer ESI
      </th>
    </tr>
  </>
);

export default LNTHeaderRow;
