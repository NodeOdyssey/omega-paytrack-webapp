import React, { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useReactToPrint } from 'react-to-print';
import axios, { AxiosError } from 'axios';

import { api } from '../../../../../configs/api';
import useVerifyUserAuth from '../../../../../hooks/useVerifyUserAuth';
import useHandleYupError from '../../../../../hooks/useHandleYupError';
import useHandleAxiosError from '../../../../../hooks/useHandleAxiosError';
import Loader from '../../../../../common/Loader/Loader';
import InvoiceTemplate from './components/InvoiceTemplate';

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

const InvoiceReport: React.FC = () => {
  const [searchParams] = useSearchParams();
  const printRef = useRef<HTMLDivElement>(null);
  const accessToken = useVerifyUserAuth();
  const { setErrors } = useHandleYupError();
  const { handleAxiosError } = useHandleAxiosError(setErrors);

  const [isLoading, setIsLoading] = useState(false);
  const [invoice, setInvoice] = useState<InvoiceData | null>(null);

  const invoiceId = searchParams.get('invoiceId');

  useEffect(() => {
    const fetchInvoice = async () => {
      if (!invoiceId || !accessToken) return;
      setIsLoading(true);
      try {
        const response = await axios.get(`${api.baseUrl}/invoices/${invoiceId}`, {
          headers: {
            'x-access-token': accessToken,
          },
        });

        if (response.data?.success) {
          setInvoice(response.data.invoice);
        }
      } catch (error) {
        handleAxiosError(error as AxiosError);
      } finally {
        setIsLoading(false);
      }
    };

    fetchInvoice();
  }, [invoiceId, accessToken]);

  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: invoice?.invoiceNumber || 'Invoice',
  });

  return (
    <div className="bg-white p-4 min-h-[calc(100vh-120px)]">
      {isLoading && <Loader />}
      {!invoiceId ? (
        <p className="text-sm text-red-600">Invoice ID is missing in URL.</p>
      ) : !isLoading && !invoice ? (
        <p className="text-sm text-red-600">Invoice not found.</p>
      ) : (
        <>
          <div className="flex justify-end mb-4 print:hidden">
            <button
              onClick={() => handlePrint()}
              className="px-4 py-2 bg-blue-600 text-white rounded"
            >
              Print Invoice
            </button>
          </div>
          <div ref={printRef}>{invoice && <InvoiceTemplate invoice={invoice} />}</div>
        </>
      )}
    </div>
  );
};

export default InvoiceReport;
