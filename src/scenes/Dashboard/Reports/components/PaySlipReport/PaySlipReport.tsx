import React, { useRef, useState } from 'react';
import { useReactToPrint } from 'react-to-print';
import PaySlipTemplate from './components/PaySlipTemplate';

const PaySlipReport: React.FC = () => {
  const printRef = useRef<HTMLDivElement>(null);

  const [, setPrintMode] = useState(false);

  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: 'Payslip',
    onBeforePrint: () => {
      setPrintMode(true);
      return Promise.resolve();
    },
    onAfterPrint: () => {
      setPrintMode(false);
    },
  });

  return (
    <div className="bg-white p-4">
      {/* Action Bar */}
      <div className="flex justify-end mb-4 print:hidden">
        <button
          onClick={() => handlePrint()}
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          Print Payslip
        </button>
      </div>

      {/* Printable Area */}
      <div ref={printRef}>
        <PaySlipTemplate />
      </div>
    </div>
  );
};

export default PaySlipReport;
