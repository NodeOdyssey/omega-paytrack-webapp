import React from 'react';

const SalaryHeaderRow: React.FC = () => (
  <tr>
    <th className="report-table-header px-1 py-0.5 text-center">Sl. No.</th>
    <th className="report-table-header text-left px-1 py-0.5">Employee Name</th>
    <th className="report-table-header text-center px-1 py-0.5">Account No.</th>
    <th className="report-table-header text-center px-1 py-0.5">IFSC</th>
    <th className="report-table-header text-center px-1 py-0.5">Bank Name</th>
    <th className="report-table-header px-2 py-0.5 text-center">Net Pay</th>
    <th className="report-table-header px-2 py-0.5 text-center">Post Name</th>
    <th className="report-table-header px-2 py-0.5 text-center">Sign</th>
  </tr>
);

export default SalaryHeaderRow;
