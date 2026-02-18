import React from 'react';

interface CompanyAndPeriodProps {
  colSpan: number;
  selectedPostName?: string;
  periodStartDate: string;
  periodEndDate: string;
  displayPostName?: boolean;
}

const CompanyAndPeriod: React.FC<CompanyAndPeriodProps> = ({
  colSpan,
  selectedPostName,
  periodStartDate,
  periodEndDate,
  displayPostName = true,
}) => (
  <tr>
    <th className="px-2 py-2 text-center" colSpan={colSpan}>
      <div className="w-full">
        <div className="text-center">
          <h2 className="reportPrimaryHeadings2 text-primaryText">
            Purbanchal Security Consultants Pvt. Ltd.
          </h2>
          <h3 className="reportPrimaryHeadings2 text-primaryText">
            Silpukhuri, Guwahati-03
          </h3>
        </div>
        <div className="flex justify-between items-center mt-4">
          {displayPostName && (
            <div className="flex items-center gap-2">
              <h3 className="reports-from-to text-primaryText">
                Pay Roll of Staff Deployed at:
              </h3>
              <h3 className="reports-from-to font-bold text-primaryText uppercase">
                {selectedPostName || 'Select a Post'}
              </h3>
            </div>
          )}
          <div className="flex items-center gap-2">
            <h3 className="reports-from-to text-primaryText">
              For the period from:
            </h3>
            <h3 className="reports-from-to text-primaryText">
              {periodStartDate}
            </h3>
            <h3 className="reports-from-to text-primaryText">to</h3>
            <h3 className="reports-from-to text-primaryText">
              {periodEndDate}
            </h3>
          </div>
        </div>
      </div>
    </th>
  </tr>
);

export default CompanyAndPeriod;
