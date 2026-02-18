import React, { useEffect } from 'react';

// Components
import DSLReportTable from './components/DSLReportTable';
import Loader from '../../../../../common/Loader/Loader';

// Store
import { useReportStore } from '../../../../../store/report';

// Utils
import { getLastDateOfMonth } from '../../../../../utils/helpersFunctions';
import { formatDateDdMmYyyySlash } from '../../../../../utils/formatter';

// Prop Types
interface DSLReportProps {
  currentSelectedPostId: number;
  selectedPostName: string | null;
  selectedDate: Date | null;
}

const DSLReport: React.FC<DSLReportProps> = ({
  currentSelectedPostId,
  selectedPostName,
  selectedDate,
}) => {
  const {
    dslReportData,
    doesDslReportExist,
    isLoading,
    dslReportTotalGrossPay,
    dslReportTotalNetPay,
    fetchDslReportData,
  } = useReportStore();

  useEffect(() => {
    if (!selectedPostName || !selectedDate || !currentSelectedPostId) return;
    fetchDslReportData(currentSelectedPostId, selectedPostName, selectedDate);
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
          {doesDslReportExist ? (
            <DSLReportTable
              tableData={dslReportData}
              selectedPostName={selectedPostName}
              periodStartDate={periodStartDate}
              periodEndDate={periodEndDate}
              totalGrossPay={dslReportTotalGrossPay}
              totalNetPay={dslReportTotalNetPay}
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

export default DSLReport;
