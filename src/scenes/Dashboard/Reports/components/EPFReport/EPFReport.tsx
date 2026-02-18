import React, { useEffect } from 'react';
import EPFReportTable from './components/EPFReportTable';
import Loader from '../../../../../common/Loader/Loader';
import { useReportStore } from '../../../../../store/report';
import { getLastDateOfMonth } from '../../../../../utils/helpersFunctions';
import { formatDateDdMmYyyySlash } from '../../../../../utils/formatter';

interface EPFReportProps {
  selectedPostName: string | null;
  selectedDate: Date | null;
  selectedPostIds: number[];
}

const EPFReport: React.FC<EPFReportProps> = ({
  // selectedPostName,
  selectedDate,
  selectedPostIds,
}) => {
  const {
    epfReportData,
    doesEpfReportExist,
    isLoading,
    epfTotalBasicSalary,
    epfGrandTotal,
    fetchEpfReportData,
  } = useReportStore();

  useEffect(() => {
    if (!selectedDate || !selectedPostIds.length) return;
    fetchEpfReportData(selectedPostIds, selectedDate);
  }, [selectedDate, selectedPostIds]);

  const endDate = selectedDate ? getLastDateOfMonth(selectedDate) : null;
  const periodStartDate = formatDateDdMmYyyySlash(selectedDate);
  const periodEndDate = formatDateDdMmYyyySlash(endDate);

  if (!selectedDate || !selectedPostIds.length) return null;

  return (
    <>
      {isLoading && <Loader />}
      <div className="flex flex-col print:hidden">
        <div className="overflow-y-auto h-[calc(100vh-112px)] overflow-x-auto">
          {doesEpfReportExist ? (
            <EPFReportTable
              tableData={epfReportData}
              // selectedPostName={selectedPostName}
              periodStartDate={periodStartDate}
              periodEndDate={periodEndDate}
              totalBasicSalary={epfTotalBasicSalary}
              grandTotalEpf={epfGrandTotal}
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

export default EPFReport;
