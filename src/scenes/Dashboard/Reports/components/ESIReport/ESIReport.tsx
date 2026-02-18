import React, { useEffect } from 'react';
import ESIReportTable from './components/ESIReportTable';
import Loader from '../../../../../common/Loader/Loader';
import { useReportStore } from '../../../../../store/report';
import { getLastDateOfMonth } from '../../../../../utils/helpersFunctions';
import { formatDateDdMmYyyySlash } from '../../../../../utils/formatter';

interface ESIReportProps {
  selectedDate: Date | null;
  selectedPostIds: number[];
}

const ESIReport: React.FC<ESIReportProps> = ({
  selectedDate,
  selectedPostIds,
}) => {
  console.log('ESIReport component rendered');
  const {
    esiReportData,
    doesEsiReportExist,
    isLoading,
    esiTotalGrossPay,
    esiGrandTotal,
    fetchEsiReportData,
  } = useReportStore();

  useEffect(() => {
    console.log('ESIReport useEffect');
    console.log('selectedDate:', selectedDate);
    console.log('selectedPostIds:', selectedPostIds);

    if (!selectedDate || !selectedPostIds.length) return;
    fetchEsiReportData(selectedPostIds, selectedDate);
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
          {doesEsiReportExist ? (
            <ESIReportTable
              tableData={esiReportData}
              periodStartDate={periodStartDate}
              periodEndDate={periodEndDate}
              totalGrossPay={esiTotalGrossPay}
              grandTotalEsi={esiGrandTotal}
              selectedPostName={''}
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

export default ESIReport;
