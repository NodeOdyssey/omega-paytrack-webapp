import React from 'react';

// Dummy Data (Replace Later with Backend)
const payslipData = {
  company: {
    name: 'Purbanchal Security Consultants Pvt. Ltd.',
    address:
      '59, JB Lane, Nabagraha Road, Krishna Nagar, Silphukuri, Guwahati, Assam, 781003',
  },

  period: 'January, 2024',

  employee: {
    name: 'Nita Dey',
    id: 'A031',
    company: 'Assam Enterprise LLP',
    designation: 'Female Security Guard',
    doj: '01/02/2019',
    payDate: '31/01/2024',
    bank: 'SBI',
    pf: 'AA/AAA/999999/99G/989999',
    esi: '1234567890',
    uan: '123456789012',
  },

  attendance: {
    totalDays: 30,
    paidDays: 30,
    lwp: 0,
  },

  earnings: [
    { label: 'Basic Salary', amount: 12000 },
    { label: 'House Rent Allowance', amount: 5000 },
    { label: 'Uniform', amount: 600 },
  ],

  deductions: [
    { label: 'EPF Contribution', amount: 2000 },
    { label: 'Professional Tax', amount: 0 },
  ],
};

const getTotal = (items: any[]) =>
  items.reduce((sum, item) => sum + item.amount, 0);

const numberToWords = (_num: number) => {
  return 'Rupees Fifteen Thousand Six Hundred Only'; // Dummy for now
};

const PaySlipTemplate: React.FC = () => {
  const gross = getTotal(payslipData.earnings);
  const deduction = getTotal(payslipData.deductions);
  const net = gross - deduction;

  return (
    <div className="border border-gray-400 p-6 max-w-4xl mx-auto text-sm">
      {/* Header */}
      <div className="flex justify-between items-start border-b pb-4 mb-4">
        <div>
          <h1 className="text-xl font-bold">{payslipData.company.name}</h1>
          <p className="text-xs">{payslipData.company.address}</p>
        </div>

        <div className="text-right">
          <p className="text-gray-600">Payslip for the month of</p>
          <p className="font-semibold text-lg">{payslipData.period}</p>
        </div>
      </div>

      {/* Employee Summary */}
      <div className="grid grid-cols-3 gap-6 mb-6">
        <div className="col-span-2 space-y-2">
          <h2 className="font-bold mb-2">EMPLOYEE SUMMARY</h2>

          <div className="grid grid-cols-2 gap-2">
            <p>Employee Name:</p>
            <p>{payslipData.employee.name}</p>

            <p>Employee ID:</p>
            <p>{payslipData.employee.id}</p>

            <p>Company Name:</p>
            <p>{payslipData.employee.company}</p>

            <p>Designation:</p>
            <p>{payslipData.employee.designation}</p>

            <p>Date of Joining:</p>
            <p>{payslipData.employee.doj}</p>

            <p>Pay Date:</p>
            <p>{payslipData.employee.payDate}</p>
          </div>
        </div>

        {/* Net Pay Box */}
        <div className="bg-green-100 border-l-4 border-green-600 p-4">
          <p className="text-xl font-bold">Rs. {net.toFixed(2)}</p>

          <p className="text-gray-600 mt-1">Employee Net Pay</p>

          <div className="mt-4 space-y-1 text-xs">
            <p>Total Days: {payslipData.attendance.totalDays}</p>
            <p>Paid Days: {payslipData.attendance.paidDays}</p>
            <p>LWP Days: {payslipData.attendance.lwp}</p>
          </div>
        </div>
      </div>

      {/* Bank Info */}
      <div className="grid grid-cols-4 gap-4 border-t border-b py-3 mb-6 text-xs">
        <p>Bank: {payslipData.employee.bank}</p>
        <p>PF: {payslipData.employee.pf}</p>
        <p>ESI: {payslipData.employee.esi}</p>
        <p>UAN: {payslipData.employee.uan}</p>
      </div>

      {/* Earnings & Deductions */}
      <table className="w-full border border-gray-400 mb-6 text-sm">
        <thead className="bg-gray-300">
          <tr>
            <th className="border p-2">Earnings</th>
            <th className="border p-2">Amount</th>
            <th className="border p-2">Deductions</th>
            <th className="border p-2">Amount</th>
          </tr>
        </thead>

        <tbody>
          {payslipData.earnings.map((e, i) => (
            <tr key={i}>
              <td className="border p-2">{e.label}</td>
              <td className="border p-2 text-right">
                Rs. {e.amount.toFixed(2)}
              </td>

              <td className="border p-2">
                {payslipData.deductions[i]?.label || ''}
              </td>

              <td className="border p-2 text-right">
                {payslipData.deductions[i]
                  ? `Rs. ${payslipData.deductions[i].amount.toFixed(2)}`
                  : ''}
              </td>
            </tr>
          ))}

          {/* Totals */}
          <tr className="font-bold bg-gray-100">
            <td className="border p-2">Gross Earnings</td>
            <td className="border p-2 text-right">Rs. {gross.toFixed(2)}</td>

            <td className="border p-2">Total Deductions</td>
            <td className="border p-2 text-right">
              Rs. {deduction.toFixed(2)}
            </td>
          </tr>
        </tbody>
      </table>

      {/* Net Payable */}
      <div className="flex justify-between border p-3 mb-4">
        <div>
          <p className="font-semibold">TOTAL NET PAYABLE</p>
          <p className="text-xs">Gross Earnings - Total Deductions</p>
        </div>

        <div className="bg-green-100 px-6 py-2 font-bold">
          Rs. {net.toFixed(2)}
        </div>
      </div>

      {/* Amount in Words */}
      <p className="mb-10">
        Amount in Words:{' '}
        <span className="font-semibold">{numberToWords(net)}</span>
      </p>

      {/* Signatures */}
      <div className="flex justify-between mt-20">
        <div className="text-center">
          <div className="border-t w-48 mx-auto mb-2"></div>
          <p>Employee Signature</p>
        </div>

        <div className="text-center">
          <div className="border-t w-48 mx-auto mb-2"></div>
          <p>Director Signature</p>
        </div>
      </div>
    </div>
  );
};

export default PaySlipTemplate;
