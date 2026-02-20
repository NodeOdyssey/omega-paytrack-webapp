import React, { useRef } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { companyConfig } from './config/companyConfig';

//types

type PayslipComponents = Record<string, number> & { total: number };
interface PayslipEmployee {
  name: string;
  id: string;
  company: string;
  designation: string;
  doj: string;
  bankName: string;
  accountNumber: string;
  esiNumber: string;
  uanNumber: string;
}
interface PayslipAttendance {
  totalDays: number;
  paidDays: number;
  lwp: number;
}

// Final API Response Type
export interface PayslipData {
  month: string;
  year: number;
  postName: string;
  postId: number;
  reportType?: string;
  payslips: Payslip[];
}
// // Individual Payslip Type
interface Payslip {
  employeeProfile: PayslipEmployee;
  attendance: PayslipAttendance;
  earnings: PayslipComponents;
  deductions: PayslipComponents;
}
interface Props {
  data: PayslipData;
  showDownloadButton?: boolean;
}

//helpers

// const numberToWords = (num: number) => {
//   return `Rupees ${num.toLocaleString()} Only`;
// };

const numberToWords = (amount: number): string => {
  if (amount === 0) return 'Rupees Zero Only';

  const belowTwenty = [
    '',
    'One',
    'Two',
    'Three',
    'Four',
    'Five',
    'Six',
    'Seven',
    'Eight',
    'Nine',
    'Ten',
    'Eleven',
    'Twelve',
    'Thirteen',
    'Fourteen',
    'Fifteen',
    'Sixteen',
    'Seventeen',
    'Eighteen',
    'Nineteen',
  ];

  const tens = [
    '',
    '',
    'Twenty',
    'Thirty',
    'Forty',
    'Fifty',
    'Sixty',
    'Seventy',
    'Eighty',
    'Ninety',
  ];

  const convert = (num: number): string => {
    if (num < 20) return belowTwenty[num];

    if (num < 100) {
      return (
        tens[Math.floor(num / 10)] +
        (num % 10 ? ' ' + belowTwenty[num % 10] : '')
      );
    }

    if (num < 1000) {
      return (
        belowTwenty[Math.floor(num / 100)] +
        ' Hundred' +
        (num % 100 ? ' ' + convert(num % 100) : '')
      );
    }

    if (num < 100000) {
      return (
        convert(Math.floor(num / 1000)) +
        ' Thousand' +
        (num % 1000 ? ' ' + convert(num % 1000) : '')
      );
    }

    if (num < 10000000) {
      return (
        convert(Math.floor(num / 100000)) +
        ' Lakh' +
        (num % 100000 ? ' ' + convert(num % 100000) : '')
      );
    }

    return (
      convert(Math.floor(num / 10000000)) +
      ' Crore' +
      (num % 10000000 ? ' ' + convert(num % 10000000) : '')
    );
  };

  const rupees = Math.floor(amount);
  const paise = Math.round((amount - rupees) * 100);

  let words = `Rupees ${convert(rupees)}`;

  if (paise > 0) {
    words += ` and ${convert(paise)} Paise`;
  }

  return words + ' Only';
};

// pdf blob
export const generatePayslipPDFBlob = async (
  element: HTMLDivElement
  // fileName: string
): Promise<Blob> => {
  const canvas = await html2canvas(element, {
    scale: 2,
    useCORS: true,
    backgroundColor: '#ffffff',
  });

  const imgData = canvas.toDataURL('image/png');
  const pdf = new jsPDF('p', 'mm', 'a4');

  const w = pdf.internal.pageSize.getWidth();
  const h = pdf.internal.pageSize.getHeight();
  const imgHeight = (canvas.height * w) / canvas.width;

  let heightLeft = imgHeight;
  let position = 0;

  pdf.addImage(imgData, 'PNG', 0, position, w, imgHeight);
  heightLeft -= h;

  while (heightLeft > 0) {
    position -= h;
    pdf.addPage();
    pdf.addImage(imgData, 'PNG', 0, position, w, imgHeight);
    heightLeft -= h;
  }

  return pdf.output('blob');
};

const PaySlipTemplate: React.FC<Props> = ({
  data,
  showDownloadButton = true,
}) => {
  const payslip = data.payslips[0];

  const gross = payslip.earnings.total;
  const deduction = payslip.deductions.total;
  const net = gross - deduction;

  const pdfRef = useRef<HTMLDivElement>(null);

  const earningOrder = [
    'basic',
    'hra',
    'conveyance',
    'cityAllowance',
    'kitWashing',
    'specialAllowance',
    'otWages',
    'uniform',
    'vda',
    'others',
  ];

  const deductionOrder = [
    'epf',
    'esi',
    'professionalTax',
    'belt',
    'boot',
    'uniform',
    'advance',
    'incomeTax',
    'others',
  ];

  const componentLabelMap: Record<string, string> = {
    basic: 'Basic Salary',
    hra: 'HRA',
    conveyance: 'Conveyance',
    cityAllowance: 'City Allowance',
    kitWashing: 'Kit/Washing',
    specialAllowance: 'Special Allowance',
    otWages: 'OT Wages',
    uniform: 'Uniform',
    vda: 'VDA',
    others: 'Cafeteria',
    epf: 'EPF',
    esi: 'ESI',
    professionalTax: 'P. Tax',
    belt: 'Belt',
    boot: 'House Rent',
    advance: 'Advance',
    incomeTax: 'Income Tax',
  };

  const getOrderedRows = (
    components: PayslipComponents,
    preferredOrder: string[]
  ): Array<{ key: string; label: string; amount: number }> => {
    const keysWithoutTotal = Object.keys(components).filter(
      (key) => key !== 'total'
    );

    const orderedKeys = [
      ...preferredOrder.filter((key) => keysWithoutTotal.includes(key)),
      ...keysWithoutTotal.filter((key) => !preferredOrder.includes(key)),
    ];

    return orderedKeys.map((key) => ({
      key,
      label: componentLabelMap[key] ?? key,
      amount: Number(components[key] ?? 0),
    }));
  };

  const earningRows = getOrderedRows(payslip.earnings, earningOrder);
  const deductionRows = getOrderedRows(payslip.deductions, deductionOrder);
  const tableRowCount = Math.max(earningRows.length, deductionRows.length);

  //pdf

  const downloadPDF = async () => {
    if (!pdfRef.current) return;

    const canvas = await html2canvas(pdfRef.current, {
      scale: 2,
      useCORS: true,
      backgroundColor: '#ffffff',
    });

    const imgData = canvas.toDataURL('image/png');

    const pdf = new jsPDF('p', 'mm', 'a4');

    const w = pdf.internal.pageSize.getWidth();
    const h = pdf.internal.pageSize.getHeight();

    const imgHeight = (canvas.height * w) / canvas.width;

    let heightLeft = imgHeight;
    let position = 0;

    pdf.addImage(imgData, 'PNG', 0, position, w, imgHeight);

    heightLeft -= h;

    while (heightLeft > 0) {
      position -= h;

      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, w, imgHeight);

      heightLeft -= h;
    }

    pdf.save(
      `${payslip.employeeProfile.name}_${payslip.employeeProfile.company}_${data.month},${data.year}.pdf`
    );
  };

  //jsx

  return (
    <>
      {/* Download */}
      {showDownloadButton && (
        <div className="flex justify-end pr-8 print:hidden fixed right-0">
          <button
            onClick={downloadPDF}
            className="px-4 py-2 bg-red-600 text-white rounded"
          >
            Download PDF
          </button>
        </div>
      )}

      <div
        ref={pdfRef}
        className="border border-gray-400 max-w-4xl mx-auto text-sm bg-white"
      >
        {/* Header */}
        <div className="flex justify-between items-start border-b px-6 py-5">
          <div className="flex gap-3 items-start">
            <img
              // src={companyConfig.logo}
              src={
                'https://pscpl-paytrack.s3.ap-south-1.amazonaws.com/assets/logo_small.svg'
              }
              className="w-[72px]"
            />

            <div>
              <h1 className="text-xl font-bold">{companyConfig.name}</h1>
              <p className="leading-tight">{companyConfig.address}</p>
            </div>
          </div>

          <div className="text-right">
            <p className="text-gray-600 text-sm">Payslip for the month of</p>

            <p className="font-semibold text-lg">
              {data.month}, {data.year}
            </p>
          </div>
        </div>

        {/* Employee Summary */}
        <div className="grid grid-cols-3 gap-6 border-b px-6 py-5">
          <div className="col-span-2">
            <h2 className="font-bold mb-4 text-lg">EMPLOYEE SUMMARY</h2>

            <div className="grid grid-cols-2 gap-y-2 gap-x-6">
              <p className="font-medium">Employee Name:</p>
              <p>{payslip.employeeProfile.name}</p>

              <p className="font-medium">Employee ID:</p>
              <p>{payslip.employeeProfile.id}</p>

              <p className="font-medium">Company Name:</p>
              <p>{payslip.employeeProfile.company}</p>

              <p className="font-medium">Designation:</p>
              <p>{payslip.employeeProfile.designation}</p>

              <p className="font-medium">Date of Joining:</p>
              <p>{payslip.employeeProfile.doj}</p>
            </div>
          </div>

          {/* Net Pay */}
          <div>
            <div className="bg-green-100 border-l-4 border-green-600 px-4 py-3">
              <p className="text-2xl font-bold">Rs. {net.toFixed(2)}</p>

              <p className="text-sm text-gray-700 mt-1">Employee Net Pay</p>
            </div>

            <div className="bg-gray-100 mt-3 px-4 py-3 space-y-1 text-sm">
              <p>
                <span className="font-medium">Total Days:</span>{' '}
                {payslip.attendance.totalDays}
              </p>

              <p>
                <span className="font-medium">Paid Days:</span>{' '}
                {payslip.attendance.paidDays}
              </p>

              <p>
                <span className="font-medium">LWP Days:</span>{' '}
                {payslip.attendance.lwp}
              </p>
            </div>
          </div>
        </div>

        {/* Bank Info */}
        <div className="border-b px-6 py-4 text-sm">
          <div className="flex justify-between flex-wrap gap-x-6 gap-y-2">
            <p>
              <span className="font-medium">Bank Name:</span>{' '}
              {payslip.employeeProfile.bankName}
            </p>

            <p>
              <span className="font-medium">A/C Number:</span>{' '}
              {payslip.employeeProfile.accountNumber}
            </p>

            <p>
              <span className="font-medium">ESI No:</span>{' '}
              {payslip.employeeProfile.esiNumber}
            </p>

            <p>
              <span className="font-medium">UAN:</span>{' '}
              {payslip.employeeProfile.uanNumber}
            </p>
          </div>
        </div>

        {/* Earnings & Deductions */}
        <div className="px-6 py-5">
          <table className="w-full border border-gray-400 text-sm text-center">
            <thead className="bg-gray-300">
              <tr className="font-medium">
                <th className="border p-2 w-1/4">Earnings</th>
                <th className="border p-2 w-1/4 text-right">Amount</th>
                <th className="border p-2 w-1/4">Deductions</th>
                <th className="border p-2 w-1/4 text-right">Amount</th>
              </tr>
            </thead>

            <tbody>
              {Array.from({ length: tableRowCount }).map((_, index) => {
                const earning = earningRows[index];
                const deductionItem = deductionRows[index];

                return (
                  <tr key={`row-${index}`}>
                    <td className="border p-2">{earning?.label ?? '-'}</td>
                    <td className="border p-2 text-right">
                      {earning ? `Rs ${earning.amount.toFixed(2)}` : '-'}
                    </td>

                    <td className="border p-2">
                      {deductionItem?.label ?? '-'}
                    </td>
                    <td className="border p-2 text-right">
                      {deductionItem
                        ? `Rs ${deductionItem.amount.toFixed(2)}`
                        : '-'}
                    </td>
                  </tr>
                );
              })}

              <tr className="font-semibold">
                <td className="border p-2">Gross Earnings</td>
                <td className="border p-2 text-right">Rs {gross.toFixed(2)}</td>

                <td className="border p-2">Total Deductions</td>
                <td className="border p-2 text-right">
                  Rs {deduction.toFixed(2)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Net Payable */}
        <div className="px-6 pb-5">
          <div className="flex justify-between items-center border mb-4">
            <div className="p-3">
              <p className="font-semibold">TOTAL NET PAYABLE</p>

              <p className="text-xs text-gray-600">
                Gross Earnings - Total Deductions
              </p>
            </div>

            <div className="bg-green-100 pl-[86px] pr-2 py-6 font-semibold text-right">
              Rs. {net.toFixed(2)}
            </div>
          </div>

          <p className="text-right text-sm">
            Amount in Words:{' '}
            <span className="font-medium">{numberToWords(net)}</span>
          </p>
        </div>

        {/* Signatures */}
        {/* <div className="flex justify-between px-6 py-10">
          <div className="text-center">
            <div className="border-t w-48 mx-auto mb-2" />
            Employee Signature
          </div>

          <div className="text-center">
            <div className="border-t w-48 mx-auto mb-2" />
            Director Signature
          </div>
        </div> */}
        <div className="text-left px-6 py-5 text-sm">
          <p>
            Note: This is a System Generated Pay Slip, does not require
            Signature.
          </p>
        </div>
      </div>
    </>
  );
};

export default PaySlipTemplate;
