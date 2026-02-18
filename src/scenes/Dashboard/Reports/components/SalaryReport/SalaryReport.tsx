import React, { useEffect } from 'react';
import Loader from '../../../../../common/Loader/Loader';
import SalaryReportTable from './components/SalaryReportTable';
import { useReportStore } from '../../../../../store/report';
import { getLastDateOfMonth } from '../../../../../utils/helpersFunctions';
import { formatDateDdMmYyyySlash } from '../../../../../utils/formatter';

interface SalaryReportProps {
  selectedDate: Date | null;
  selectedPostIds: number[];
}

const SalaryReport: React.FC<SalaryReportProps> = ({
  selectedDate,
  selectedPostIds,
}) => {
  const {
    salaryReportData,
    doesSalaryReportExist,
    isLoading,
    salaryTotalNetPay,
    fetchSalaryReportData,
  } = useReportStore();

  useEffect(() => {
    if (!selectedDate || !selectedPostIds.length) return;
    fetchSalaryReportData(selectedPostIds, selectedDate);
  }, [selectedDate, selectedPostIds]);

  const endDate = selectedDate ? getLastDateOfMonth(selectedDate) : null;
  const periodStartDate = formatDateDdMmYyyySlash(selectedDate);
  const periodEndDate = formatDateDdMmYyyySlash(endDate);

  if (!selectedDate || !selectedPostIds.length) return null;

  return (
    <>
      {isLoading && <Loader />}
      <div className="flex flex-col print:hidden">
        <div className="overflow-y-auto h-[calc(100vh-120px)] overflow-x-auto">
          {doesSalaryReportExist ? (
            <SalaryReportTable
              tableData={salaryReportData}
              periodStartDate={periodStartDate}
              periodEndDate={periodEndDate}
              totalNetPay={salaryTotalNetPay}
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

export default SalaryReport;
