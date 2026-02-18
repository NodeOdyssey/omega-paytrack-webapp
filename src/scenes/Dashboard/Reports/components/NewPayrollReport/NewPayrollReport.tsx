import React, { useEffect } from 'react';
import NewPayrollReportTable from './components/NewPayrollReportTable';
import Loader from '../../../../../common/Loader/Loader';
import { useReportStore } from '../../../../../store/report';
import { getLastDateOfMonth } from '../../../../../utils/helpersFunctions';
import { formatDateDdMmYyyySlash } from '../../../../../utils/formatter';

interface NewPayrollReportProps {
  currentSelectedPostId: number;
  selectedPostName: string | null;
  selectedDate: Date | null;
}

const NewPayrollReport: React.FC<NewPayrollReportProps> = ({
  currentSelectedPostId,
  selectedPostName,
  selectedDate,
}) => {
  const {
    newPayrollReportData,
    doesNewPayrollReportExist,
    isLoading,
    newPayrollTotalBasicSalary,
    newPayrollTotalNetPay,
    fetchNewPayrollReportData,
  } = useReportStore();

  useEffect(() => {
    if (!selectedPostName || !selectedDate || !currentSelectedPostId) return;
    fetchNewPayrollReportData(
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
          {doesNewPayrollReportExist ? (
            <NewPayrollReportTable
              tableData={newPayrollReportData}
              selectedPostName={selectedPostName}
              periodStartDate={periodStartDate}
              periodEndDate={periodEndDate}
              totalBasicSalary={newPayrollTotalBasicSalary}
              totalNetPay={newPayrollTotalNetPay}
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

export default NewPayrollReport;
