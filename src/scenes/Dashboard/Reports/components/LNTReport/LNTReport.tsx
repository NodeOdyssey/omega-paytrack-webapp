import React, { useEffect } from 'react';
import LNTReportTable from './components/LNTReportTable';
import Loader from '../../../../../common/Loader/Loader';
import { useReportStore } from '../../../../../store/report';
import { getLastDateOfMonth } from '../../../../../utils/helpersFunctions';
import { formatDateDdMmYyyySlash } from '../../../../../utils/formatter';

interface LNTReportProps {
  currentSelectedPostId: number;
  selectedPostName: string | null;
  selectedDate: Date | null;
}

const LNTReport: React.FC<LNTReportProps> = ({
  currentSelectedPostId,
  selectedPostName,
  selectedDate,
}) => {
  const {
    lntReportData,
    doesLntReportExist,
    isLoading,
    lntReportTotalAllowance,
    lntReportTotalNetPay,
    fetchLntReportData,
  } = useReportStore();

  useEffect(() => {
    if (!selectedPostName || !selectedDate || !currentSelectedPostId) return;
    fetchLntReportData(currentSelectedPostId, selectedPostName, selectedDate);
  }, [selectedPostName, selectedDate, currentSelectedPostId]);

  const endDate = selectedDate ? getLastDateOfMonth(selectedDate) : null;
  const periodStartDate = formatDateDdMmYyyySlash(selectedDate);
  const periodEndDate = formatDateDdMmYyyySlash(endDate);

  if (!selectedPostName || !selectedDate || !currentSelectedPostId) return null;
  console.log('LNT Report Data:', lntReportData);
  return (
    <>
      {isLoading && <Loader />}
      <div className="flex flex-col print:hidden">
        <div className="overflow-y-auto h-[calc(100vh-112px)] overflow-x-auto">
          {doesLntReportExist ? (
            <LNTReportTable
              tableData={lntReportData}
              selectedPostName={selectedPostName}
              periodStartDate={periodStartDate}
              periodEndDate={periodEndDate}
              totalAllowance={lntReportTotalAllowance}
              totalNetPay={lntReportTotalNetPay}
            />
          ) : (
            <p className="text-center py-20">
              Payroll hasn&rsquo;t been generated for this month yet.
            </p>
          )}
        </div>
      </div>
    </>
  );
};

export default LNTReport;
