import React, { useEffect, useRef, useState } from 'react';

import { useSearchParams } from 'react-router-dom';

import PaySlipTemplate, { PayslipData } from './components/PaySlipTemplate';
import Loader from '../../../../../common/Loader/Loader';

import PaySlipEmployeeDropdown from '../../../../../common/DropDownInput/PaySlipEmployeeDropdown';
import { saveAs } from 'file-saver';
import JSZip from 'jszip';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
// import { mockPayslipApi } from './components/dummyData';
import axios from 'axios';
import { api } from '../../../../../configs/api';
import { useNavigate } from 'react-router-dom';
import { Arrow_Back_Blue } from '../../../../../assets/icons';

const PayslipReport: React.FC = () => {
  const [params] = useSearchParams();
  const navigate = useNavigate();

  const postId = params.get('postId');
  const month = params.get('month');
  const year = params.get('year');

  //State

  const [isLoading, setIsLoading] = useState(false);
  const [payslipData, setPayslipData] = useState<PayslipData | null>(null);
  const [index, setIndex] = useState(0);

  //Fetch

  // const fetchPayslips = async () => {
  //   setIsLoading(true);

  //   try {
  //     await new Promise((r) => setTimeout(r, 500));

  //     setPayslipData(mockPayslipApi);
  //     setIndex(0);
  //   } catch (err) {
  //     console.error(err);
  //     setPayslipData(null);
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  const fetchPayslips = async () => {
    if (!postId || !month || !year) return;

    setIsLoading(true);

    try {
      const token = localStorage.getItem('accessToken'); // or wherever you store API key

      const response = await axios.get(
        `${api.baseUrl}/payrolls/payslips/${postId}/${month}/${year}`,

        {
          headers: {
            'x-access-token': token, // or Authorization if required
          },
        }
      );

      console.log('Payslip API Response:', response.data);
      if (!response.data?.success) {
        throw new Error(response.data?.message || 'Failed to fetch payslips');
      }

      setPayslipData(response.data.payslipData); // 👈 important
      setIndex(0);
    } catch (error) {
      console.error('Payslip API Error:', error);
      setPayslipData(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPayslips();
  }, [postId, month, year]);

  //Mapper

  //Current Payrolls

  const currentPayslip = payslipData?.payslips?.[index] ?? null;

  // bulk pdf
  const bulkRefs = useRef<(HTMLDivElement | null)[]>([]);

  const downloadBulkPayslips = async () => {
    if (!payslipData?.payslips.length) return;

    setIsLoading(true);

    try {
      const zip = new JSZip();

      const safePostName = (payslipData?.postName || 'Post')
        .replace(/\s+/g, '_')
        .toUpperCase();

      const folderName = `Payslip_${safePostName}_${month}_${year}`;

      // ✅ ZIP contains ONE folder
      const folder = zip.folder(folderName);
      if (!folder) throw new Error('Failed to create zip folder');

      for (let i = 0; i < payslipData.payslips.length; i++) {
        const ref = bulkRefs.current[i];
        if (!ref) continue;

        const canvas = await html2canvas(ref, {
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

        const pdfBlob = pdf.output('blob');

        // ✅ hooking employee + post name into filename
        const employeeName = payslipData?.payslips[i].employeeProfile.name
          .replace(/\s+/g, '_')
          .toUpperCase();
        // month
        const month = payslipData?.month.toUpperCase();
        // year
        const year = payslipData?.year;

        const pdfFileName = `${employeeName}_${safePostName}_${month},${year}.pdf`;

        folder.file(pdfFileName, pdfBlob);
      }

      const zipBlob = await zip.generateAsync({ type: 'blob' });

      // ✅ ZIP name SAME as folder name
      saveAs(zipBlob, `${folderName}.zip`);
    } catch (err) {
      console.error('Bulk Payslip Download Error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  //jsx

  return (
    <>
      {isLoading && <Loader />}

      <div className="flex flex-col h-full w-full overflow-hidden">
        {/* Header */}
        <div className="sticky top-0 z-30 border-b">
          <div className="flex flex-col items-start gap-2 px-8 py-3">
            <h2 className="font-bold text-sm">Payslip</h2>

            <div className="flex items-center justify-between w-full py-2">
              {/* Back Button */}
              <div className="flex items-start gap-6">
                <button
                  onClick={() => navigate('/app/attendance-and-payroll')}
                  className="text-blue-600 hover:text-blue-800 font-medium px-0 flex items-center py-2 gap-2"
                >
                  <img
                    src={Arrow_Back_Blue}
                    alt="Arrow_Back_Blue"
                    className="back-button-icon"
                  />
                  Back
                </button>
                <PaySlipEmployeeDropdown
                  employees={
                    payslipData?.payslips.map((p) => ({
                      ID: p.employeeProfile.id,
                      empName: p.employeeProfile.name,
                    })) || []
                  }
                  selectedIndex={index}
                  onSelect={setIndex}
                  // showDownloadButton={true}
                />
              </div>
              <button
                onClick={downloadBulkPayslips}
                disabled={!payslipData || payslipData.payslips.length === 0}
                className="px-4 py-2 bg-blue-600 text-white rounded"
              >
                Download All Payslips (ZIP)
              </button>
              {/* Dropdown */}
            </div>
          </div>

          {/* Hidden payslips for bulk export */}
          <div style={{ position: 'absolute', left: '-9999px', top: 0 }}>
            {payslipData?.payslips.map((p, i) => (
              <div
                key={p.employeeProfile.id}
                ref={(el) => (bulkRefs.current[i] = el)}
              >
                <PaySlipTemplate
                  data={{
                    ...payslipData,
                    payslips: [p],
                  }}
                  showDownloadButton={false}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Navigation */}
        <div className="sticky top-[64px] z-20 bg-white border-b">
          <div className="flex items-center justify-center gap-6 py-3">
            <button
              disabled={index === 0}
              onClick={() => setIndex(index - 1)}
              className="border px-3 py-1 rounded disabled:opacity-40"
            >
              Prev
            </button>

            <span>
              Employee {index + 1} of {payslipData?.payslips.length}
            </span>

            <button
              disabled={index === payslipData?.payslips.length! - 1}
              onClick={() => setIndex(index + 1)}
              className="border px-3 py-1 rounded disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </div>

        {/* Payslip */}
        <div className="flex-1 overflow-y-auto bg-gray-50 pt-4">
          {/* <div className="min-h-fit"> */}
          {currentPayslip ? (
            <>
              {payslipData && currentPayslip && (
                <PaySlipTemplate
                  data={{
                    ...payslipData,
                    payslips: [currentPayslip], // send only selected employee
                  }}
                />
              )}
            </>
          ) : (
            <p className="text-center text-gray-500 mt-20">
              No Payslip Data Found
            </p>
          )}
          {/* </div> */}
        </div>
      </div>
    </>
  );
};

export default PayslipReport;
