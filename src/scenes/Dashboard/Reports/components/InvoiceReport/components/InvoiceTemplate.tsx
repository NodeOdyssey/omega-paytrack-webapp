import React from 'react';

// import { numberToWords } from '../../../../../../../utils/formatter';
import { numberToWords } from '../../../../../../utils/formatter';

type InvoiceItem = {
  ID: number;
  employeeId: number;
  employeeName: string;
  employeeCode: string | null;
  designation: string | null;
  attendanceDays: number;
  billedNetAmount: number;
};

type InvoiceData = {
  ID: number;
  invoiceNumber: string;
  postId: number;
  postName: string;
  month: number;
  year: number;
  invoiceDate: string;
  attendanceMode: 'DERIVE_ATTENDANCE' | 'FULL_ATTENDANCE';
  gstRate: number;
  taxableValue: number;
  gstAmount: number;
  totalAmount: number;
  seller: {
    name: string;
    address: string | null;
    gstin: string | null;
    pan: string | null;
  };
  buyer: {
    name: string;
    address: string | null;
    gstin: string | null;
    pan: string | null;
  };
  items: InvoiceItem[];
};

type InvoiceTemplateProps = {
  invoice: InvoiceData;
};

const InvoiceTemplate: React.FC<InvoiceTemplateProps> = ({ invoice }) => {
  const monthLabel = new Date(
    invoice.year,
    invoice.month - 1
  ).toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });

  const invoiceDate = new Date(invoice.invoiceDate).toLocaleDateString('en-GB');

  return (
    <div className="border border-gray-400 p-6 max-w-6xl mx-auto text-sm bg-white">
      <div className="border-b pb-4 mb-4">
        <h1 className="text-xl font-bold">{invoice.seller.name}</h1>
        <p className="text-xs mt-1">{invoice.seller.address || '-'}</p>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="space-y-1">
          <h2 className="font-bold text-base">Bill To</h2>
          <p className="font-medium">{invoice.buyer.name}</p>
          <p className="text-xs">{invoice.buyer.address || '-'}</p>
          <p className="text-xs">GSTIN: {invoice.buyer.gstin || '-'}</p>
          <p className="text-xs">PAN: {invoice.buyer.pan || '-'}</p>
        </div>
        <div className="space-y-1 text-right">
          <h2 className="font-bold text-base">Tax Invoice</h2>
          <p>Invoice No: {invoice.invoiceNumber}</p>
          <p>Invoice Date: {invoiceDate}</p>
          <p>Billing Month: {monthLabel}</p>
          <p>
            Attendance Mode:{' '}
            {invoice.attendanceMode === 'FULL_ATTENDANCE'
              ? 'Full Attendance'
              : 'Derive Attendance'}
          </p>
        </div>
      </div>

      <table className="w-full border border-gray-400 mb-6 text-sm">
        <thead className="bg-gray-200">
          <tr>
            <th className="border p-2 text-left">#</th>
            <th className="border p-2 text-left">Employee</th>
            <th className="border p-2 text-left">Emp ID</th>
            <th className="border p-2 text-left">Designation</th>
            <th className="border p-2 text-right">Attendance Days</th>
            <th className="border p-2 text-right">Billed Amount (Rs.)</th>
          </tr>
        </thead>
        <tbody>
          {invoice.items.map((item, index) => (
            <tr key={item.ID}>
              <td className="border p-2">{index + 1}</td>
              <td className="border p-2">{item.employeeName}</td>
              <td className="border p-2">{item.employeeCode || '-'}</td>
              <td className="border p-2">{item.designation || '-'}</td>
              <td className="border p-2 text-right">
                {item.attendanceDays.toFixed(2)}
              </td>
              <td className="border p-2 text-right">
                {item.billedNetAmount.toFixed(2)}
              </td>
            </tr>
          ))}
          <tr className="font-semibold bg-gray-50">
            <td className="border p-2" colSpan={5}>
              Taxable Value
            </td>
            <td className="border p-2 text-right">
              {invoice.taxableValue.toFixed(2)}
            </td>
          </tr>
          <tr className="font-semibold bg-gray-50">
            <td className="border p-2" colSpan={5}>
              GST ({invoice.gstRate.toFixed(2)}%)
            </td>
            <td className="border p-2 text-right">
              {invoice.gstAmount.toFixed(2)}
            </td>
          </tr>
          <tr className="font-bold bg-gray-100">
            <td className="border p-2" colSpan={5}>
              Total Invoice Amount
            </td>
            <td className="border p-2 text-right">
              {invoice.totalAmount.toFixed(2)}
            </td>
          </tr>
        </tbody>
      </table>

      <p className="text-sm font-medium">
        Amount in Words: {numberToWords(Number(invoice.totalAmount.toFixed(2)))}
      </p>

      <div className="flex justify-between mt-20">
        <div className="text-center">
          <div className="border-t w-48 mx-auto mb-2" />
          <p>Prepared By</p>
        </div>
        <div className="text-center">
          <div className="border-t w-48 mx-auto mb-2" />
          <p>Authorized Signatory</p>
        </div>
      </div>
    </div>
  );
};

export default InvoiceTemplate;
