import React, { useEffect } from 'react';
import OthersReportTable from './components/OthersReportTable';
import Loader from '../../../../../common/Loader/Loader';
import { useReportStore } from '../../../../../store/report';
import { getLastDateOfMonth } from '../../../../../utils/helpersFunctions';
import { formatDateDdMmYyyySlash } from '../../../../../utils/formatter';

interface OthersReportProps {
  currentSelectedPostId: number;
  selectedPostName: string | null;
  selectedDate: Date | null;
}

const OthersReport: React.FC<OthersReportProps> = ({
  currentSelectedPostId,
  selectedPostName,
  selectedDate,
}) => {
  const {
    othersReportData,
    doesOthersReportExist,
    isLoading,
    othersReportTotalGrossPay,
    othersReportTotalNetPay,
    fetchOthersReportData,
  } = useReportStore();

  useEffect(() => {
    if (!selectedPostName || !selectedDate || !currentSelectedPostId) return;
    fetchOthersReportData(
      currentSelectedPostId,
      selectedPostName,
      selectedDate
    );
  }, [selectedPostName, selectedDate, currentSelectedPostId]);

  const endDate = selectedDate ? getLastDateOfMonth(selectedDate) : null;
  const periodStartDate = formatDateDdMmYyyySlash(selectedDate);
  const periodEndDate = formatDateDdMmYyyySlash(endDate);

  if (!selectedPostName || !selectedDate || !currentSelectedPostId) return null;

  return (
    <>
      {isLoading && <Loader />}
      <div className="flex flex-col print:hidden">
        <div className="overflow-y-auto h-[calc(100vh-112px)] overflow-x-auto">
          {doesOthersReportExist ? (
            <OthersReportTable
              tableData={othersReportData}
              selectedPostName={selectedPostName}
              periodStartDate={periodStartDate}
              periodEndDate={periodEndDate}
              totalGrossPay={othersReportTotalGrossPay}
              totalNetPay={othersReportTotalNetPay}
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

export default OthersReport;
