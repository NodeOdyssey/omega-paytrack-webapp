import React, { useEffect } from 'react';
import Loader from '../../../../../common/Loader/Loader';
import PTaxReportTable from './compoennts/PTaxReportTable';
import { useReportStore } from '../../../../../store/report';
import { getLastDateOfMonth } from '../../../../../utils/helpersFunctions';
import { formatDateDdMmYyyySlash } from '../../../../../utils/formatter';

interface PTaxReportProps {
  selectedDate: Date | null;
  selectedPostIds: number[];
}

const PTaxReport: React.FC<PTaxReportProps> = ({
  selectedDate,
  selectedPostIds,
}) => {
  const {
    ptaxReportData,
    doesPtaxReportExist,
    isLoading,
    ptaxTotalBasicSalary,
    ptaxGrandTotal,
    fetchPtaxReportData,
  } = useReportStore();

  useEffect(() => {
    console.log(
      'PTaxReport useEffect, selectedDate:',
      selectedDate,
      'selectedPostIds:',
      selectedPostIds
    );
    if (!selectedDate || !selectedPostIds.length) return;
    fetchPtaxReportData(selectedPostIds, selectedDate);
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
          {doesPtaxReportExist ? (
            <PTaxReportTable
              tableData={ptaxReportData}
              periodStartDate={periodStartDate}
              periodEndDate={periodEndDate}
              totalBasicSalary={ptaxTotalBasicSalary}
              grandTotalPtax={ptaxGrandTotal}
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

export default PTaxReport;
