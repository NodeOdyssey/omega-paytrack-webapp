import React from 'react';
import { PayrollStatuses } from '../../types/payroll';
import Accordion from '../Accordion/Accordion';
import { useNavigate } from 'react-router';

export interface PayrollStatusProps {
  statusData: PayrollStatuses[];
  date: {
    month: string;
    year: number;
  };
}

const PayrollStatus: React.FC<PayrollStatusProps> = ({ statusData, date }) => {
  const navigate = useNavigate();
  const handleEdit = (id: number) => {
    navigate(`/paytrack/posts/edit-post?id=${id}`);
  };
  return (
    <>
      <Accordion title="Payroll Overview" disabled={false}>
        <div className="flex flex-col text-center overflow-x-auto px-4 scrollbar scrollbar-thumb-scrollBarColor scrollbar-track-scrollBarBg max-h-[45vh] overflow-y-auto">
          <p className="py-2">
            Payroll status for {date.month}, {date.year}
          </p>
          <table className="bg-white border border-tableBorder w-[50%] mx-auto">
            <thead className="text-center text-primaryText border border-tableBorder sticky top-0 z-20">
              <tr className="bg-tableHeadingColour">
                <th
                  className="py-3 text-start pl-[3%] border border-tableBorder w-[30%] text-xs md:text-sm xl:text-base"
                  rowSpan={2}
                >
                  Post Name
                </th>
                <th
                  className="px-4 py-3 border border-tableBorder w-[10%] text-xs md:text-sm xl:text-base "
                  rowSpan={2}
                >
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="text-primaryText border border-tableBorder">
              {statusData.map((item) => (
                <tr key={item.postName}>
                  <td className="border border-tableBorder py-2 pl-[3%] text-xs md:text-sm xl:text-base text-start">
                    <button onClick={() => handleEdit(item.postId || 0)}>
                      <p className="text-left">{item.postName || '---'}</p>
                    </button>
                  </td>
                  <td className="border border-tableBorder p-2 text-center text-xs md:text-sm xl:text-base">
                    {item.status === 'Completed' ? (
                      <button className="bg-[#0C672B4D] text-[#0C672B] py-1 px-4 rounded-full font-medium text-xs md:text-sm xl:text-base cursor-auto">
                        {item.status}
                      </button>
                    ) : (
                      <button className="bg-[#FFECB3] text-[#cc8f00] py-1 px-4 rounded-full font-medium text-xs md:text-sm xl:text-base cursor-auto">
                        {item.status}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Accordion>
    </>
  );
};

export default PayrollStatus;
