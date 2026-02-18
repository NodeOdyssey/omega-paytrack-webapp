import React from 'react';
import Accordion from '../Accordion/Accordion';

const StatusTable: React.FC = () => {
   const data = [
     { postName: 'Assam Enterprise', status: 'Completed' },
     { postName: 'Godrej', status: 'Not Completed' },
     { postName: 'Audi', status: 'Completed' },
   ];
  return (
    <>
      <Accordion title="Completed Attendance" disabled={false}>
        <div className="flex flex-col text-center overflow-x-auto px-4 scrollbar scrollbar-thumb-scrollBarColor scrollbar-track-scrollBarBg max-h-[45vh] overflow-y-auto">
          <table className="bg-white border border-tableBorder w-[50%] mx-auto">
            <thead className="text-center text-primaryText border border-tableBorder sticky top-0 z-20">
              <tr className="bg-tableHeadingColour">
                <th
                  className="px-4 py-3 border border-tableBorder w-[10%] text-xs md:text-sm xl:text-base"
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
              {data.map((item) => (
                <tr key={item.postName}>
                  <td className="border border-tableBorder p-2 text-xs md:text-sm xl:text-base text-center">
                    {item.postName}
                  </td>
                  <td className="border border-tableBorder p-2 text-center text-xs md:text-sm xl:text-base">
                    {item.status}
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

export default StatusTable;
