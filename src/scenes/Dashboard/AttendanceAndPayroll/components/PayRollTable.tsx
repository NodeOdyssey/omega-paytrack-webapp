// Libraries
import React, { useEffect, useRef } from 'react';

// Types
import { Payroll, PayrollUpdate } from '../../../../types/payroll';

interface PayRollTableProps {
  isEditingPayroll: boolean;
  existingPayrolls: Payroll[];
  currentSelectedPostId: number;
  currentSelectedDate: Date;
  payrollUpdateData: PayrollUpdate[];
  updatePayrollUpdateData: (data: PayrollUpdate[]) => void;
}

const PayRollTable: React.FC<PayRollTableProps> = ({
  isEditingPayroll,
  existingPayrolls,
  payrollUpdateData,
  updatePayrollUpdateData,
}) => {
  const handlePayrollRowDataChange = (
    id: number,
    field: keyof PayrollUpdate,
    value: string
  ) => {
    const updatedData = payrollUpdateData.map((data) =>
      data.ID === id ? { ...data, [field]: parseFloat(value) || 0 } : data
    );

    updatePayrollUpdateData(updatedData);
  };

  /* Table Horizontal Scrol */
  const tableRef = useRef<HTMLDivElement>(null);

  // useEffect(() => {
  //   const tableElement = tableRef.current;
  //   if (tableElement) {
  //     const handleScroll = (e: WheelEvent) => {
  //       if (e.deltaY !== 0) {
  //         e.preventDefault();
  //         tableElement.scrollLeft += e.deltaY;
  //       }
  //     };

  //     tableElement.addEventListener('wheel', handleScroll);

  //     return () => {
  //       tableElement.removeEventListener('wheel', handleScroll);
  //     };
  //   }
  // }, []);

  /* Test Use Effect */
  useEffect(() => {
    // console.log(
    //   'payrollUpdateData in PayrollTable component: ',
    //   payrollUpdateData
    // );
    // console.log(
    //   'existingPayrolls in PayrollTable component: ',
    //   existingPayrolls
    // );
  });

  // JSX
  return (
    <>
      <div
        ref={tableRef}
        className="overflow-x-auto overflow-y-auto max-h-[calc(100vh-224px)] 2xl:max-h-[calc(100vh-288px)] whitespace-nowrap mx-4 2xl:mx-8 flex text-center border border-x-tableBorder border-opacity-40 scrollbar scrollbar-thumb-scrollBarColor scrollbar-track-scrollBarBg max-h-[calc(100vh - 500px)]"
      >
        <table className="bg-white border border-tableBorder min-w-[1000px]">
          <thead className="text-center text-primaryText border border-tableBorder sticky top-0 z-20">
            <tr className="bg-tableHeadingColour ">
              <th
                className="emp-posting-table-th padding-y-responsive-table-header w-[50px] sticky left-0 z-20 bg-tableHeadingColour"
                rowSpan={2}
              >
                Sl. No.
              </th>
              <th
                className="emp-posting-table-th padding-y-responsive-table-header w-[100px] sticky left-[74px] z-20 bg-tableHeadingColour"
                rowSpan={2}
              >
                Emp Name
              </th>

              {/* <th
                className="emp-posting-table-th padding-y-responsive-table-header  "
                rowSpan={2}
              >
                Posting
              </th> */}
              <th
                className="emp-posting-table-th padding-y-responsive-table-header sticky w-[110px] left-[200px]  z-20 bg-tableHeadingColour"
                rowSpan={2}
              >
                Rank
              </th>
              <th
                className="emp-posting-table-th padding-y-responsive-table-header sticky w-[100px] left-[330px]  z-20 bg-tableHeadingColour"
                rowSpan={2}
              >
                Working Days
              </th>
              <th
                className="emp-posting-table-th padding-y-responsive-table-header sticky w-[100px] left-[440px]  z-20 bg-tableHeadingColour"
                rowSpan={2}
              >
                Basic Salary
              </th>
              <th
                className="emp-posting-table-th padding-y-responsive-table-header w-[20%] "
                colSpan={3}
              >
                Earnings
              </th>
              <th
                className="emp-posting-table-th padding-y-responsive-table-header w-[30%] "
                colSpan={6}
              >
                Allowances
              </th>
              <th
                className="emp-posting-table-th padding-y-responsive-table-header w-[10%] "
                rowSpan={2}
              >
                Gross Pay
              </th>
              <th
                className="emp-posting-table-th padding-y-responsive-table-header w-[10%] "
                rowSpan={2}
              >
                Extra Duty
              </th>
              <th
                className="emp-posting-table-th padding-y-responsive-table-header w-[10%] "
                rowSpan={2}
              >
                Advance
              </th>
              <th
                className="emp-posting-table-th padding-y-responsive-table-header w-[20%] "
                colSpan={5}
              >
                Deduction
              </th>
              <th
                className="emp-posting-table-th padding-y-responsive-table-header w-[10%] "
                rowSpan={2}
              >
                Other Deduction
              </th>
              <th
                className="emp-posting-table-th padding-y-responsive-table-header w-[10%] "
                rowSpan={2}
              >
                Total Deduction
              </th>
              <th
                className="emp-posting-table-th padding-y-responsive-table-header w-[10%] "
                rowSpan={2}
              >
                P.Tax
              </th>
              <th
                className="emp-posting-table-th padding-y-responsive-table-header w-[10%] "
                rowSpan={2}
              >
                Net Pay
              </th>
            </tr>
            <tr className="bg-tableHeadingColour">
              {/* <th className="emp-posting-table-th padding-y-responsive-table-header w-[10%]  sticky left-[38%] z-20 bg-tableHeadingColour">
                Working Days
              </th>
              <th className="emp-posting-table-th padding-y-responsive-table-header w-[10%]  sticky left-[51%] z-20 bg-tableHeadingColour">
                Basic Salary
              </th> */}
              <th className="emp-posting-table-th padding-y-responsive-table-header w-[10%] ">
                4 Hour Pay
              </th>
              {/* watchout */}
              <th className="emp-posting-table-th padding-y-responsive-table-header w-[10%] ">
                8 Hour Pay
              </th>
              <th className="py-3 px-6 border border-tableBorder w-[10%] ">
                Bonus
              </th>
              <th className="emp-posting-table-th padding-y-responsive-table-header w-[10%] ">
                Weekly Off
              </th>
              {/* <th className="emp-posting-table-th padding-y-responsive-table-header w-[10%] ">
                House Rent
              </th> */}
              <th className="emp-posting-table-th padding-y-responsive-table-header w-[10%] ">
                Conveyance
              </th>
              <th className="emp-posting-table-th padding-y-responsive-table-header w-[10%] ">
                Kit/Washing
              </th>
              <th className="emp-posting-table-th padding-y-responsive-table-header w-[10%] ">
                Uniform
              </th>
              <th className="emp-posting-table-th padding-y-responsive-table-header w-[10%] ">
                City Allowance
              </th>
              {/* <th className="emp-posting-table-th padding-y-responsive-table-header w-[10%] ">
                VDA
              </th> */}
              {/* <th className="emp-posting-table-th padding-y-responsive-table-header w-[10%] ">
                Others
              </th> */}
              <th className="emp-posting-table-th padding-y-responsive-table-header w-[10%] ">
                Special Allowance
              </th>
              <th className="emp-posting-table-th padding-y-responsive-table-header w-[10%] ">
                ESI
              </th>
              <th className="emp-posting-table-th padding-y-responsive-table-header w-[10%] ">
                EPF
              </th>
              {/* belt boot */}
              <th className="emp-posting-table-th padding-y-responsive-table-header w-[20%] ">
                Belt
              </th>
              <th className="emp-posting-table-th padding-y-responsive-table-header w-[10%] ">
                Boot
              </th>
              <th className="emp-posting-table-th padding-y-responsive-table-header w-[10%] ">
                Uniform
              </th>
            </tr>
          </thead>
          <tbody className="text-primaryText border border-tableBorder ">
            {existingPayrolls.map((payroll, index) => (
              <tr
                key={index}
                className="hover:bg-gray-200 border border-tableBorder table-body-row"
                // className="hover:bg-gray-200 border border-tableBorder h-10"
              >
                {/* Emp Id */}
                <td className="table-td-with-input w-[50px] sticky left-0 z-10 bg-white">
                  {/* {payroll.empId || '-'} */}
                  {index + 1}
                </td>
                {/* Employee Name */}
                <td className="table-td-with-input w-[100px] sticky left-[74px] z-10 bg-white text-left">
                  {payroll.empName || '-'}
                </td>

                {/* Posting */}
                {/* <td className="px-2 py-2 md:px-4 md:py-3 border border-tableBorder  text-xs font-medium  ">
                    {payroll.post || '-'}
                  </td> */}
                {/* Rank */}
                <td className="table-td-with-input font-medium  sticky w-[110px] left-[200px] z-10 bg-white">
                  {payroll.rank || '-'}
                </td>
                {/* Working Days */}
                <td className="table-td-with-input font-medium  sticky w-[100px] left-[330px] z-10 bg-white">
                  {payroll.workingDays}
                </td>
                {/* Basic Salary */}
                <td className="table-td-with-input font-medium  sticky w-[100px] left-[440px] z-10 bg-white">
                  {payroll.basicSalary !== undefined &&
                  payroll.basicSalary !== 0
                    ? 'Rs. ' +
                      (
                        Math.round(
                          (payroll.basicSalary + Number.EPSILON) * 100
                        ) / 100
                      ).toFixed(2)
                    : '-'}
                </td>
                {/* Four hour pay */}
                <td className="table-td-with-input w-[10%] font-medium  ">
                  {payroll.fourHourPay !== undefined &&
                  payroll.fourHourPay !== 0
                    ? 'Rs. ' +
                      (
                        Math.round(
                          (payroll.fourHourPay + Number.EPSILON) * 100
                        ) / 100
                      ).toFixed(2)
                    : '-'}
                </td>
                {/* Eight hour pay */}
                <td className="table-td-with-input w-[10%]  font-medium  ">
                  {payroll.eightHourPay !== undefined &&
                  payroll.eightHourPay !== 0
                    ? 'Rs. ' +
                      (
                        Math.round(
                          (payroll.eightHourPay + Number.EPSILON) * 100
                        ) / 100
                      ).toFixed(2)
                    : '-'}
                </td>
                {/* Bonus */}
                <td className="table-td-with-input w-[10%]  font-medium  ">
                  {isEditingPayroll ? (
                    <input
                      type="number"
                      value={
                        payrollUpdateData.find((data) => data.ID === payroll.ID)
                          ?.bonus || ''
                      }
                      onChange={(e) => {
                        const value = Math.max(
                          0,
                          parseFloat(e.target.value) || 0
                        );
                        handlePayrollRowDataChange(
                          payroll.ID,
                          'bonus',
                          value.toString()
                        );
                      }}
                      onWheel={(e) => e.currentTarget.blur()}
                      onKeyDown={(e) => {
                        if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
                          e.preventDefault();
                        }
                      }}
                      className="w-full border rounded-md px-2"
                      min="0"
                    />
                  ) : (
                    <p>
                      {payroll.bonus !== undefined && payroll.bonus !== 0
                        ? 'Rs. ' +
                          (
                            Math.round((payroll.bonus + Number.EPSILON) * 100) /
                            100
                          ).toFixed(2)
                        : '-'}
                    </p>
                  )}
                </td>
                {/* Weekly OFf */}
                <td className="table-td-with-input w-[10%]  font-medium  ">
                  {isEditingPayroll ? (
                    <input
                      type="number"
                      value={
                        payrollUpdateData.find((data) => data.ID === payroll.ID)
                          ?.weeklyOff || ''
                      }
                      onChange={(e) => {
                        const value = Math.max(
                          0,
                          parseFloat(e.target.value) || 0
                        );
                        handlePayrollRowDataChange(
                          payroll.ID,
                          'weeklyOff',
                          value.toString()
                        );
                      }}
                      onWheel={(e) => e.currentTarget.blur()}
                      onKeyDown={(e) => {
                        if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
                          e.preventDefault();
                        }
                      }}
                      className="w-full border rounded-md px-2"
                      min="0"
                    />
                  ) : (
                    <p>
                      {payroll.weeklyOff !== undefined &&
                      payroll.weeklyOff !== 0
                        ? 'Rs. ' +
                          (
                            Math.round(
                              (payroll.weeklyOff + Number.EPSILON) * 100
                            ) / 100
                          ).toFixed(2)
                        : '-'}
                    </p>
                  )}
                </td>
                {/* HRA */}
                {/* <td className="px-2 py-2 md:px-4 md:py-3 border border-tableBorder w-[10%] text-xs font-medium  ">
                    {payroll.hra !== undefined && payroll.hra !== 0
                      ? 'Rs. ' +
                        (
                          Math.round((payroll.hra + Number.EPSILON) * 100) / 100
                        ).toFixed(2)
                      : '-'}
                  </td> */}
                {/* Conveyance */}
                <td className="table-td-with-input w-[10%]  font-medium  ">
                  {payroll.conveyance !== undefined && payroll.conveyance !== 0
                    ? 'Rs. ' +
                      (
                        Math.round(
                          (payroll.conveyance + Number.EPSILON) * 100
                        ) / 100
                      ).toFixed(2)
                    : '-'}
                </td>
                {/* Kit/Washing Allowance */}
                <td className="table-td-with-input w-[10%]  font-medium  ">
                  {payroll.kitWashingAllowance !== undefined &&
                  payroll.kitWashingAllowance !== 0
                    ? 'Rs. ' +
                      (
                        Math.round(
                          (payroll.kitWashingAllowance + Number.EPSILON) * 100
                        ) / 100
                      ).toFixed(2)
                    : '-'}
                </td>
                {/* Uniform Allowance */}
                <td className="table-td-with-input w-[10%]  font-medium  ">
                  {payroll.uniformAllowance !== undefined &&
                  payroll.uniformAllowance !== 0
                    ? 'Rs. ' +
                      (
                        Math.round(
                          (payroll.uniformAllowance + Number.EPSILON) * 100
                        ) / 100
                      ).toFixed(2)
                    : '-'}
                </td>
                {/* City Allowance */}
                <td className="table-td-with-input w-[10%]  font-medium  ">
                  {payroll.cityAllowance !== undefined &&
                  payroll.cityAllowance !== 0
                    ? 'Rs. ' +
                      (
                        Math.round(
                          (payroll.cityAllowance + Number.EPSILON) * 100
                        ) / 100
                      ).toFixed(2)
                    : '-'}
                </td>
                {/* VDA */}
                {/* <td className="px-2 py-2 md:px-4 md:py-3 border border-tableBorder w-[10%] text-xs font-medium  ">
                    {payroll.vda !== undefined && payroll.vda !== 0
                      ? 'Rs. ' +
                        (
                          Math.round((payroll.vda + Number.EPSILON) * 100) / 100
                        ).toFixed(2)
                      : '-'}
                  </td> */}
                {/* Other Allowance */}
                {/* <td className="px-2 py-2 md:px-4 md:py-3 border border-tableBorder w-[10%] text-xs font-medium  ">
                    {payroll.otherAllowance !== undefined &&
                    payroll.otherAllowance !== 0
                      ? 'Rs. ' +
                        (
                          Math.round(
                            (payroll.otherAllowance + Number.EPSILON) * 100
                          ) / 100
                        ).toFixed(2)
                      : '-'}
                  </td> */}
                {/* Special Allowance */}
                <td className="table-td-with-input w-[10%]  font-medium  ">
                  {isEditingPayroll ? (
                    <input
                      type="number"
                      value={
                        payrollUpdateData.find((data) => data.ID === payroll.ID)
                          ?.specialAllowance || ''
                      }
                      onChange={(e) => {
                        const value = Math.max(
                          0,
                          parseFloat(e.target.value) || 0
                        );
                        handlePayrollRowDataChange(
                          payroll.ID,
                          'specialAllowance',
                          value.toString()
                        );
                      }}
                      onWheel={(e) => e.currentTarget.blur()}
                      onKeyDown={(e) => {
                        if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
                          e.preventDefault();
                        }
                      }}
                      className="w-full border rounded-md px-2"
                      min="0"
                    />
                  ) : (
                    <p>
                      {payroll.specialAllowance !== undefined &&
                      payroll.specialAllowance !== 0
                        ? 'Rs. ' +
                          (
                            Math.round(
                              (payroll.specialAllowance + Number.EPSILON) * 100
                            ) / 100
                          ).toFixed(2)
                        : '-'}
                    </p>
                  )}
                </td>
                {/* Gross Pay */}
                <td className="table-td-with-input w-[10%]  font-medium  ">
                  {payroll.grossPay !== undefined && payroll.grossPay !== 0
                    ? 'Rs. ' +
                      (
                        Math.round((payroll.grossPay + Number.EPSILON) * 100) /
                        100
                      ).toFixed(2)
                    : '-'}
                </td>
                {/* Extra Duty */}
                <td className="table-td-with-input w-[10%]  font-medium  ">
                  {isEditingPayroll ? (
                    <input
                      type="number"
                      // value={Math.max(
                      //   0,
                      //   payrollUpdateData.find(
                      //     (data) => data.ID === payroll.ID
                      //   )?.extraDuty || 0
                      // )}
                      value={
                        payrollUpdateData.find((data) => data.ID === payroll.ID)
                          ?.extraDuty || ''
                      }
                      onWheel={(e) => e.currentTarget.blur()}
                      onKeyDown={(e) => {
                        if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
                          e.preventDefault();
                        }
                      }}
                      onChange={(e) =>
                        handlePayrollRowDataChange(
                          payroll.ID,
                          'extraDuty',
                          Math.max(
                            0,
                            parseFloat(e.target.value) || 0
                          ).toString()
                        )
                      }
                      className="w-full border rounded-md px-2"
                      min="0"
                    />
                  ) : (
                    // <p>{payroll.extraDuty || '-'}</p>
                    <p>
                      {payroll.extraDuty !== undefined &&
                      payroll.extraDuty !== 0
                        ? 'Rs. ' +
                          (
                            Math.round(
                              (payroll.extraDuty + Number.EPSILON) * 100
                            ) / 100
                          ).toFixed(2)
                        : '-'}
                    </p>
                  )}
                </td>
                {/* Advance */}
                <td className="table-td-with-input w-[10%]  font-medium  ">
                  {isEditingPayroll ? (
                    <input
                      type="number"
                      className="w-full border rounded-md px-2"
                      // value={Math.max(
                      //   0,
                      //   payrollUpdateData.find(
                      //     (data) => data.ID === payroll.ID
                      //   )?.advance || 0
                      // )}
                      value={
                        payrollUpdateData.find((data) => data.ID === payroll.ID)
                          ?.advance || ''
                      }
                      onWheel={(e) => e.currentTarget.blur()}
                      onKeyDown={(e) => {
                        if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
                          e.preventDefault();
                        }
                      }}
                      onChange={(e) =>
                        handlePayrollRowDataChange(
                          payroll.ID,
                          'advance',
                          Math.max(
                            0,
                            parseFloat(e.target.value) || 0
                          ).toString()
                        )
                      }
                      min="0"
                    />
                  ) : (
                    <p>
                      {payroll.advance !== undefined && payroll.advance !== 0
                        ? 'Rs. ' +
                          (
                            Math.round(
                              (payroll.advance + Number.EPSILON) * 100
                            ) / 100
                          ).toFixed(2)
                        : '-'}
                    </p>
                  )}
                </td>
                {/* ESI */}
                {/* <td className="px-2 py-2 md:px-4 md:py-3 border border-tableBorder w-[10%] text-xs font-medium  ">
                    {payroll.esi !== undefined && payroll.esi !== 0
                      ? 'Rs. ' +
                        (
                          Math.round((payroll.esi + Number.EPSILON) * 100) / 100
                        ).toFixed(2)
                      : '-'}
                  </td> */}
                <td className="table-td-with-input w-[10%]  font-medium">
                  {isEditingPayroll ? (
                    <input
                      type="number"
                      className=" w-[64px] border rounded-md px-2"
                      // value={Math.max(
                      //   0,
                      //   payrollUpdateData.find(
                      //     (data) => data.ID === payroll.ID
                      //   )?.esi || 0
                      // )}
                      value={
                        payrollUpdateData.find((data) => data.ID === payroll.ID)
                          ?.esi || ''
                      }
                      onWheel={(e) => e.currentTarget.blur()}
                      onKeyDown={(e) => {
                        if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
                          e.preventDefault();
                        }
                      }}
                      onChange={(e) =>
                        handlePayrollRowDataChange(
                          payroll.ID,
                          'esi',
                          Math.max(
                            0,
                            parseFloat(e.target.value) || 0
                          ).toString()
                        )
                      }
                      min="0"
                    />
                  ) : (
                    <p>
                      {payroll.esi !== undefined && payroll.esi !== 0
                        ? 'Rs. ' +
                          (
                            Math.round((payroll.esi + Number.EPSILON) * 100) /
                            100
                          ).toFixed(2)
                        : '-'}
                    </p>
                  )}
                </td>
                {/* EPF */}
                <td className="table-td-with-input w-[10%]  font-medium  ">
                  {payroll.epf !== undefined && payroll.epf !== 0
                    ? 'Rs. ' +
                      (
                        Math.round((payroll.epf + Number.EPSILON) * 100) / 100
                      ).toFixed(2)
                    : '-'}
                </td>
                {/* Belt Deduction //TODO: add logic for belt deduction */}
                <td className="table-td-with-input w-[10%]  font-medium  ">
                  {isEditingPayroll ? (
                    <input
                      type="number"
                      className="w-[72px] border rounded-md px-2"
                      // value={payrollUpdateData[index]?.beltDeduction}
                      value={
                        payrollUpdateData.find((data) => data.ID === payroll.ID)
                          ?.beltDeduction || ''
                      }
                      min="0"
                      onWheel={(e) => e.currentTarget.blur()}
                      onKeyDown={(e) => {
                        if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
                          e.preventDefault();
                        }
                      }}
                      onChange={(e) =>
                        handlePayrollRowDataChange(
                          payroll.ID,

                          'beltDeduction',
                          Math.max(
                            0,
                            parseFloat(e.target.value) || 0
                          ).toString()
                        )
                      }
                    />
                  ) : (
                    <p>
                      {payroll.beltDeduction !== undefined &&
                      payroll.beltDeduction !== 0
                        ? 'Rs. ' +
                          (
                            Math.round(
                              (payroll.beltDeduction + Number.EPSILON) * 100
                            ) / 100
                          ).toFixed(2)
                        : '-'}
                    </p>
                  )}
                </td>
                {/* Boot Deduction //TODO: add logic for boot deduction */}
                <td className="table-td-with-input w-[10%]  font-medium  ">
                  {isEditingPayroll ? (
                    <input
                      type="number"
                      className="w-[72px] border rounded-md px-2"
                      // value={payrollUpdateData[index]?.bootDeduction}
                      value={
                        payrollUpdateData.find((data) => data.ID === payroll.ID)
                          ?.bootDeduction || ''
                      }
                      onWheel={(e) => e.currentTarget.blur()}
                      onKeyDown={(e) => {
                        if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
                          e.preventDefault();
                        }
                      }}
                      onChange={(e) =>
                        handlePayrollRowDataChange(
                          payroll.ID,

                          'bootDeduction',
                          Math.max(
                            0,
                            parseFloat(e.target.value) || 0
                          ).toString()
                        )
                      }
                    />
                  ) : (
                    <p>
                      {payroll.bootDeduction !== undefined &&
                      payroll.bootDeduction !== 0
                        ? 'Rs. ' +
                          (
                            Math.round(
                              (payroll.bootDeduction + Number.EPSILON) * 100
                            ) / 100
                          ).toFixed(2)
                        : '-'}
                    </p>
                  )}
                </td>
                {/* Uniform Deduction //TODO: add logic for boot deduction */}
                <td className="table-td-with-input w-[10%]  font-medium  ">
                  {isEditingPayroll ? (
                    <input
                      type="number"
                      className="w-full border rounded-md px-2"
                      value={
                        payrollUpdateData.find((data) => data.ID === payroll.ID)
                          ?.uniformDeduction || ''
                      }
                      onWheel={(e) => e.currentTarget.blur()}
                      onKeyDown={(e) => {
                        if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
                          e.preventDefault();
                        }
                      }}
                      onChange={(e) =>
                        handlePayrollRowDataChange(
                          payroll.ID,

                          'uniformDeduction',
                          Math.max(
                            0,
                            parseFloat(e.target.value) || 0
                          ).toString()
                        )
                      }
                    />
                  ) : (
                    <p>
                      {payroll.uniformDeduction !== undefined &&
                      payroll.uniformDeduction !== 0
                        ? 'Rs. ' +
                          (
                            Math.round(
                              (payroll.uniformDeduction + Number.EPSILON) * 100
                            ) / 100
                          ).toFixed(2)
                        : '-'}
                    </p>
                  )}
                </td>
                {/* Other Deduction */}
                {/* <td className="px-2 py-2 md:px-4 md:py-3 border border-tableBorder w-[10%] text-xs font-medium  ">
                    Rs.&nbsp;
                    {payroll.otherDeduction !== undefined
                      ? (
                          Math.round(
                            (payroll.otherDeduction + Number.EPSILON) * 100
                          ) / 100
                        ).toFixed(2)
                      : '-'}
                  </td> */}
                <td className="table-td-with-input w-[10%]  font-medium  ">
                  {isEditingPayroll ? (
                    <input
                      type="number"
                      value={
                        payrollUpdateData.find((data) => data.ID === payroll.ID)
                          ?.otherDeduction || ''
                      }
                      onChange={(e) => {
                        const value = Math.max(
                          0,
                          parseFloat(e.target.value) || 0
                        );
                        handlePayrollRowDataChange(
                          payroll.ID,
                          'otherDeduction',
                          value.toString()
                        );
                      }}
                      onWheel={(e) => e.currentTarget.blur()}
                      onKeyDown={(e) => {
                        if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
                          e.preventDefault();
                        }
                      }}
                      className="w-full border rounded-md px-2"
                      min="0"
                    />
                  ) : (
                    <p>
                      {payroll.otherDeduction !== undefined &&
                      payroll.otherDeduction !== 0
                        ? 'Rs. ' +
                          (
                            Math.round(
                              (payroll.otherDeduction + Number.EPSILON) * 100
                            ) / 100
                          ).toFixed(2)
                        : '-'}
                    </p>
                  )}
                </td>
                {/* Total Deduction */}
                <td className="table-td-with-input w-[10%]  font-medium  ">
                  {payroll.totalDeduction !== undefined &&
                  payroll.totalDeduction !== 0
                    ? 'Rs. ' +
                      (
                        Math.round(
                          (payroll.totalDeduction + Number.EPSILON) * 100
                        ) / 100
                      ).toFixed(2)
                    : '-'}
                </td>
                {/* P Tax */}
                <td className="table-td-with-input w-[10%]  font-medium  ">
                  {/* {payroll.pTax !== undefined && payroll.pTax !== 0
                      ? 'Rs. ' +
                        (
                          Math.round((payroll.pTax + Number.EPSILON) * 100) /
                          100
                        ).toFixed(2)
                      : '-'} */}
                  {isEditingPayroll ? (
                    <input
                      type="number"
                      className=" w-[64px] border rounded-md px-2"
                      value={
                        payrollUpdateData.find((data) => data.ID === payroll.ID)
                          ?.pTax || ''
                      }
                      onWheel={(e) => e.currentTarget.blur()}
                      onKeyDown={(e) => {
                        if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
                          e.preventDefault();
                        }
                      }}
                      onChange={(e) =>
                        handlePayrollRowDataChange(
                          payroll.ID,
                          'pTax',
                          Math.max(
                            0,
                            parseFloat(e.target.value) || 0
                          ).toString()
                        )
                      }
                      min="0"
                    />
                  ) : (
                    <p>
                      {payroll.pTax !== undefined && payroll.pTax !== 0
                        ? 'Rs. ' +
                          (
                            Math.round((payroll.pTax + Number.EPSILON) * 100) /
                            100
                          ).toFixed(2)
                        : '-'}
                    </p>
                  )}
                </td>
                {/* Net Pay */}
                <td className="table-td-with-input w-[10%] text-right font-medium  ">
                  {payroll.netPay !== undefined && payroll.netPay !== 0
                    ? 'Rs. ' +
                      (
                        Math.round((payroll.netPay + Number.EPSILON) * 100) /
                        100
                      ).toFixed(2)
                    : '-'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default PayRollTable;
