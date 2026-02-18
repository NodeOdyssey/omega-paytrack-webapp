// Libraries
import React, { useEffect, useRef } from 'react';

// Components
import DSReportTable from './components/DsReportTable';
import Loader from '../../../../../common/Loader/Loader';

// Store
import { useReportStore } from '../../../../../store/report';
import {
  formatDateForReport,
  getLastDateOfMonth,
} from '../../../../../utils/helpersFunctions';

// Prop Types
interface ViewDSReportProps {
  currentSelectedPostId: number;
  selectedPostName: string | null;
  selectedDate: Date | null;
}

// Main Component
const ViewDSReport: React.FC<ViewDSReportProps> = ({
  currentSelectedPostId,
  selectedPostName,
  selectedDate,
}) => {
  // Store Data and Functions
  const {
    dsReportData,
    doesDsReportExist,
    isLoading,
    dsReportTotalGrossPay,
    dsReportTotalNetPay,
    fetchDsReportData,
    clearDsReportData,
  } = useReportStore();

  // Ref to prevent multiple API calls
  const hasFetched = useRef(false);

  // Fetch Data on Component Mount and when selectedPostName,
  // selectedDate, or currentSelectedPostId changes
  useEffect(() => {
    // Only fetch if all required data is available and we haven't fetched yet
    if (
      !selectedPostName ||
      !selectedDate ||
      !currentSelectedPostId ||
      hasFetched.current
    )
      return;

    hasFetched.current = true;
    fetchDsReportData(currentSelectedPostId, selectedPostName, selectedDate);
  }, [
    selectedPostName,
    selectedDate,
    currentSelectedPostId,
    fetchDsReportData,
  ]);

  // Reset the ref when any of the dependencies change significantly
  useEffect(() => {
    hasFetched.current = false;
  }, [currentSelectedPostId, selectedDate?.getTime()]);

  // Cleanup effect to clear data when component unmounts or parameters change
  useEffect(() => {
    return () => {
      // Clear data when component unmounts
      clearDsReportData();
    };
  }, [clearDsReportData]);

  // Date formatting helpers
  const endDate = selectedDate ? getLastDateOfMonth(selectedDate) : null;
  const periodStartDate = formatDateForReport(selectedDate);
  const periodEndDate = formatDateForReport(endDate);

  if (!selectedPostName || !selectedDate || !currentSelectedPostId) return;

  // Render
  return (
    <>
      {isLoading && <Loader />}
      <div className="flex flex-col print:hidden">
        <div className="overflow-y-auto h-[calc(100vh-112px)] overflow-x-auto">
          {doesDsReportExist ? (
            <DSReportTable
              tableData={dsReportData}
              selectedPostName={selectedPostName}
              periodStartDate={periodStartDate}
              periodEndDate={periodEndDate}
              totalGrossPay={dsReportTotalGrossPay}
              totalNetPay={dsReportTotalNetPay}
            />
          ) : (
            <p className="text-center py-20">
              Payroll hasn&rsquo;t been generated for this month yet.
              {/* table data: {dsReportData.length} */}
            </p>
          )}
        </div>
      </div>
    </>
  );
};

export default ViewDSReport;
