// Libraries
import React, { useEffect } from 'react';

// Components
import WithoutAllowanceReportTable from './components/WithoutAllowanceReportTable';
import Loader from '../../../../../common/Loader/Loader';

// Store
import { useReportStore } from '../../../../../store/report';

// Utils
import { getLastDateOfMonth } from '../../../../../utils/helpersFunctions';
import { formatDateDdMmYyyySlash } from '../../../../../utils/formatter';

// Prop Types
interface WithoutAllowanceReportProps {
  currentSelectedPostId: number;
  selectedPostName: string | null;
  selectedDate: Date | null;
}

// Main Component
const WithoutAllowanceReport: React.FC<WithoutAllowanceReportProps> = ({
  currentSelectedPostId,
  selectedPostName,
  selectedDate,
}) => {
  // Store Data and Functions
  const {
    withoutAllowanceReportData,
    doesWithoutAllowanceReportExist,
    isLoading,
    withoutAllowanceTotalBasicSalary,
    withoutAllowanceTotalNetPay,
    fetchWithoutAllowanceReportData,
  } = useReportStore();

  // Fetch Data on Component Mount and when selectedPostName,
  // selectedDate, or currentSelectedPostId changes
  useEffect(() => {
    if (!selectedPostName || !selectedDate || !currentSelectedPostId) return;
    fetchWithoutAllowanceReportData(
      currentSelectedPostId,
      selectedPostName,
      selectedDate
    );
  }, [selectedPostName, selectedDate, currentSelectedPostId]);

  // Date formatting helpers
  const endDate = selectedDate ? getLastDateOfMonth(selectedDate) : null;
  const periodStartDate = formatDateDdMmYyyySlash(selectedDate);
  const periodEndDate = formatDateDdMmYyyySlash(endDate);

  if (!selectedPostName || !selectedDate || !currentSelectedPostId) return;

  // Render
  return (
    <>
      {isLoading && <Loader />}
      <div className="flex flex-col print:hidden">
        <div className="overflow-y-auto h-[calc(100vh-112px)] overflow-x-auto">
          {doesWithoutAllowanceReportExist ? (
            <WithoutAllowanceReportTable
              tableData={withoutAllowanceReportData}
              selectedPostName={selectedPostName}
              periodStartDate={periodStartDate}
              periodEndDate={periodEndDate}
              totalBasicSalary={withoutAllowanceTotalBasicSalary}
              totalNetPay={withoutAllowanceTotalNetPay}
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

export default WithoutAllowanceReport;
