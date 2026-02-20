import React, { useEffect, useRef, useState } from 'react';
// import Accordion from '../../../../common/Accordion/Accordion';
import type { AttendanceAndPayrollStatuses } from '../../../../types/attendance';
import useScrollToTop from '../../../../hooks/useScrollToTop';
// import useHandleYupError from '../../../hooks/useHandleYupError';
// import useHandleAxiosError from '../../../hooks/useHandleAxiosError';
// import axios, { AxiosError } from 'axios';
// import { api } from '../../../configs/api';
import PrimaryButton from '../../../../common/Button/PrimaryButton';
import { monthToNumber } from '../../../../utils/helpersFunctions';
import NoSearchResultPage from '../../../../common/NoSearchResultPage/NoSearchResultPage';
import { ReportName, ReportType } from '../../../../types/report';
// import Loader from '../../../common/Loader/Loader';
import ReportSelectDropDown from '../../../../common/ReportSelectDropDown/ReportSelectDropDown';
import {
  EditPencil_Icon,
  Ok,
  PayrollStatus_Attendance,
  PayrollStatus_Payroll,
  PayrollStatus_Payslip,
  PayrollStatus_print,
  TableOptionsIcon,
} from '../../../../assets/icons';
import { useNavigate } from 'react-router';
import useClickOutside from '../../../../hooks/useClickOutside';
export interface AttendanceAndPayrollProps {
  date: {
    month: string;
    year: number;
  };
  statusData: AttendanceAndPayrollStatuses[];
  reportTypes: ReportType[];
  onClickPost: (postId: number, month: number, year: number) => void;
  onClickGenerate: (postId: number, month: number, year: number) => void;
  onClickViewPayroll: (postId: number, month: number, year: number) => void;
  onClickDeleteAttendance: (
    postId: number,
    month: number,
    year: number
  ) => void;
  onClickDeletePayroll: (postId: number, month: number, year: number) => void;
  onClickSetReportType: (postId: number, reportName: string) => void;
}

const AttendanceAndPayrollStatus: React.FC<AttendanceAndPayrollProps> = ({
  date,
  statusData,
  reportTypes,
  onClickPost,
  onClickGenerate,
  onClickViewPayroll,
  onClickDeleteAttendance,
  onClickDeletePayroll,
  onClickSetReportType,
}: AttendanceAndPayrollProps) => {
  // console.log('What is date coming in attendance and payroll status: ', date);
  /* Scroll To Top */
  useScrollToTop();

  /* Verify User Auth */
  // const token = useVerifyUserAuth();

  /* Loader */
  // const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handlePostClick = (postId: number) => {
    if (!postId) return;
    onClickPost(postId, monthToNumber(date.month), date.year);
  };

  useEffect(() => {
    console.log('Status Data: ', statusData);
  }, [statusData]);

  const [isDevAdmin, setIsDevAdmin] = React.useState(false);

  useEffect(() => {
    const userRole = localStorage.getItem('userRole');
    console.log('User Role: ', userRole);
    if (userRole === 'DevAdmin') {
      setIsDevAdmin(true);
    } else {
      setIsDevAdmin(false);
    }
  }, []);

  const [editingReportTypePostId, setEditingReportTypePostId] = React.useState<
    number | null
  >(null);
  // const [selectedReportType, setSelectedReportType] =
  //   React.useState<ReportType>({
  //     type: 0,
  //     name: ReportName.NONE,
  //     reportCode: 'NONE',
  //   });
  const [selectedReportTypes, setSelectedReportTypes] = React.useState<{
    [postId: number]: ReportType;
  }>({});
  console.log('what is selected Report type: ', selectedReportTypes);

  // Action menu

  const [actionPostId, setActionPostId] = useState<number | null>(null);
  const actionMenuRef = useRef<HTMLDivElement>(null);
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });

  // const handleActionClick = (
  //   e: React.MouseEvent<HTMLButtonElement>,
  //   postId: number
  // ) => {
  //   const rect = e.currentTarget.getBoundingClientRect();

  //   setTimeout(() => {
  //     if (actionMenuRef.current) {
  //       const menuWidth = actionMenuRef.current.offsetWidth;

  //       setMenuPosition({
  //         top: rect.bottom + window.scrollY,
  //         left: rect.right + window.scrollX - menuWidth,
  //       });
  //     }
  //   }, 0);

  //   setActionPostId(postId);
  // };

  const handleActionClick = (
    e: React.MouseEvent<HTMLButtonElement>,
    postId: number
  ) => {
    const rect = e.currentTarget.getBoundingClientRect();

    setActionPostId(postId);

    setTimeout(() => {
      if (!actionMenuRef.current) return;

      const menuHeight = actionMenuRef.current.offsetHeight;
      const menuWidth = actionMenuRef.current.offsetWidth;

      const spaceBelow = window.innerHeight - rect.bottom;

      let top = rect.bottom + window.scrollY;

      // 🔥 ONLY change: flip upward if not enough space below
      if (spaceBelow < menuHeight) {
        top = rect.top + window.scrollY - menuHeight;
      }

      setMenuPosition({
        top,
        left: rect.right + window.scrollX - menuWidth,
      });
    }, 0);
  };

  useClickOutside(actionMenuRef, () => setActionPostId(null));

  useEffect(() => {
    const handleScroll = () => setActionPostId(null);
    window.addEventListener('scroll', handleScroll, true);
    return () => {
      window.removeEventListener('scroll', handleScroll, true);
    };
  }, []);

  return (
    <div>
      {/* {isLoading && <Loader />} */}
      {/* <Accordion title="Completed Attendance" disabled={false}> */}
      {/* <div className="flex flex-col text-center overflow-x-auto px-4 mt-[7%] max-h-[75vh] overflow-y-auto scrollbar scrollbar-thumb-scrollBarColor scrollbar-track-scrollBarBg"> */}
      <div className="flex flex-col text-center overflow-x-auto px-4 2xl:px-8 mt-[76px] 2xl:mt-[108px] max-h-[75vh] 2xl:pb-16 overflow-y-auto scrollbar scrollbar-thumb-scrollBarColor scrollbar-track-scrollBarBg">
        {/* <p className="py-2 font-semibold text-base">
            Attendance & Payroll Status for {date.month}, {date.year}
          </p> */}
        {statusData.length === 0 ? (
          // <p className="py-2 text-lg font-medium">Post name not found</p>
          <NoSearchResultPage />
        ) : (
          <>
            {/* <p className="py-2 font-semibold text-base">
              Attendance & Payroll Status for {date.month}, {date.year}
            </p> */}
            {/* <table className="bg-white border border-tableBorder w-[80%] mx-auto"> */}
            <table className="bg-white border border-tableBorder w-full mx-auto">
              <thead className="text-center text-primaryText border border-tableBorder sticky top-0 z-10">
                <tr className="bg-tableHeadingColour table-responsive-row-height">
                  <th
                    className="border border-tableBorder w-[15%] text-left padding-y-responsive-table-header emp-posting-table-th "
                    rowSpan={2}
                  >
                    Post Name
                  </th>
                  <th
                    className="emp-posting-table-th padding-y-responsive-table-header w-[5%]"
                    rowSpan={2}
                  >
                    Attendance Status
                  </th>
                  <th
                    className="emp-posting-table-th padding-y-responsive-table-header w-[5%]"
                    rowSpan={2}
                  >
                    Payroll Status
                  </th>
                  <th
                    className="emp-posting-table-th padding-y-responsive-table-header w-[7%]"
                    rowSpan={2}
                  >
                    Report Type
                  </th>
                  <th
                    className="emp-posting-table-th padding-y-responsive-table-header w-[1%]"
                    rowSpan={2}
                  >
                    Action
                  </th>

                  {isDevAdmin && (
                    <th
                      className="px-4 py-3 border border-tableBorder w-[10%] text-responsive-label   "
                      rowSpan={2}
                    >
                      Dev Action
                    </th>
                  )}
                </tr>
              </thead>
              <tbody className="text-primaryText border border-tableBorder">
                {statusData &&
                  statusData.map((item) => (
                    <tr
                      className="border border-tableBorder hover:bg-gray-200 font-medium table-responsive-row-height"
                      key={item.postName}
                    >
                      {/* Post Name */}
                      <td className="table-td-with-input px-2 2xl:px-4 py-2 text-start">
                        <button onClick={() => handlePostClick(item.postId)}>
                          <p className="text-left text-bgPrimaryButton hover:text-bgPrimaryButtonHover underline">
                            {item.postName || '---'}
                          </p>
                        </button>
                      </td>

                      {/* Attendance Status */}
                      <td className="table-td-with-input">
                        <div className="flex w-full justify-center">
                          <div className="relative inline-flex items-center">
                            <button
                              className={`py-1 px-4 rounded-full font-medium text-responsive-label cursor-auto ${
                                item.attendanceStatus === 'Completed'
                                  ? 'bg-[#0C672B4D] text-[#0C672B]'
                                  : 'bg-[#FFECB3] text-[#cc8f00]'
                              }`}
                            >
                              {item.attendanceStatus}
                            </button>

                            {item.attendanceStatus === 'Completed' && (
                              <button
                                onClick={() => handlePostClick(item.postId)}
                                className="absolute left-full top-1/2 -translate-y-1/2 ml-2"
                              >
                                <p className="text-right text-bgPrimaryButton hover:text-bgPrimaryButtonHover underline text-responsive-label whitespace-nowrap">
                                  View
                                </p>
                              </button>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Payroll Status */}
                      <td className="table-td-with-input">
                        <div className="flex w-full items-center justify-center">
                          {item.payrollStatus === 'Completed' && (
                            <div className="relative inline-flex items-center">
                              <button className="bg-[#0C672B4D] text-[#0C672B] py-1 px-4 rounded-full font-medium text-responsive-label cursor-auto">
                                {item.payrollStatus}
                              </button>
                              {/* view payroll */}
                              <button
                                disabled={
                                  item.payrollStatus !== 'Completed' ||
                                  !item.reportName
                                }
                                onClick={() => {
                                  const post = statusData.find(
                                    (p) => p.postId === item.postId
                                  );
                                  if (!post) return;

                                  setActionPostId(null);
                                  onClickViewPayroll(
                                    post.postId,
                                    monthToNumber(date.month),
                                    date.year
                                  );
                                }}
                                className="absolute left-full top-1/2 -translate-y-1/2 ml-2 disabled:opacity-50 disabled:pointer-events-none"
                              >
                                <p className="text-right text-bgPrimaryButton hover:text-bgPrimaryButtonHover underline text-responsive-label whitespace-nowrap">
                                  View
                                </p>
                              </button>
                            </div>
                          )}
                          {item.attendanceStatus === 'Pending' &&
                            item.payrollStatus === 'Pending' && (
                              <button className="bg-[#FFECB3] text-[#cc8f00] py-1 px-4 rounded-full font-medium text-responsive-label cursor-auto">
                                {item.payrollStatus}
                              </button>
                            )}
                          {item.attendanceStatus === 'Completed' &&
                            item.payrollStatus === 'Pending' && (
                              <div className="h-7 2xl:h-8">
                                <PrimaryButton
                                  height={'full'}
                                  onClick={() =>
                                    onClickGenerate(
                                      item.postId,
                                      monthToNumber(date.month),
                                      date.year
                                    )
                                  }
                                >
                                  <p className="text-responsive-label">
                                    Generate&nbsp;
                                  </p>
                                </PrimaryButton>
                              </div>
                            )}
                        </div>
                      </td>

                      {/* Action */}
                      {/* <td className="table-td-with-input">
                        <div className="flex items-center justify-center">
                          {item.attendanceStatus === 'Completed' &&
                          item.payrollStatus === 'Completed' ? (
                            <>
                              <button
                                onClick={() =>
                                  onClickViewPayroll(
                                    item.postId,
                                    monthToNumber(date.month),
                                    date.year
                                  )
                                }
                                className={`flex items-center justify-center underline font-Mona_Sans text-responsive-label font-semibold text-bgPrimaryButton hover:text-bgPrimaryButtonHover hover:duration-200 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-md px-4 py-2`}
                              >
                                View&nbsp;Payroll
                              </button>

                              <button
                                onClick={() => {
                                  if (item.reportName !== ReportName.NONE) {
                                    navigate(
                                      `/paytrack/reports?postId=${item.postId}&reportType=${reportTypes.find((r) => r.reportCode === item.reportName)?.reportCode}&month=${monthToNumber(date.month)}&year=${date.year}`
                                    );
                                  }
                                }}
                                disabled={
                                  item.reportName ===
                                  ReportName.NONE.toUpperCase()
                                }
                                className={`flex items-center justify-center underline font-Mona_Sans text-responsive-label font-semibold rounded-md px-4 py-2 ${
                                  item.reportName ===
                                  ReportName.NONE.toUpperCase()
                                    ? 'text-gray-400 cursor-not-allowed bg-gray-100'
                                    : 'text-bgPrimaryButton hover:text-bgPrimaryButtonHover hover:duration-200 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
                                }`}
                              >
                                Print&nbsp;Report
                              </button>
                              <button
                                onClick={() =>
                                  navigate(
                                    `/paytrack/attendance-payslip?postId=${item.postId}&month=${monthToNumber(
                                      date.month
                                    )}&year=${date.year}`
                                  )
                                }
                                className="text-bgPrimaryButton hover:text-bgPrimaryButtonHover underline"
                              >
                                PaySlip
                              </button>
                            </>
                          ) : (
                            <>-</>
                          )}
                        </div>
                      </td> */}

                      {/* Set Report Type */}
                      <td className="table-td-with-input">
                        {editingReportTypePostId === item.postId ? (
                          <div className="flex items-center justify-center gap-2">
                            <ReportSelectDropDown
                              label="Select Report Type"
                              reportTypes={reportTypes}
                              width={'full'}
                              value={
                                selectedReportTypes[item.postId]?.name ||
                                ReportName.NONE
                              }
                              onChangeReportType={(reportType) =>
                                setSelectedReportTypes((prev) => ({
                                  ...prev,
                                  [item.postId]: reportType,
                                }))
                              }
                            />
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                e.preventDefault();
                                console.log(
                                  'what is post id when button is clicked:::::',
                                  item.postId
                                );
                                setEditingReportTypePostId(item.postId);
                                console.log(
                                  'what is item.reportName :',
                                  item.reportName
                                );
                                // console.log(
                                //   'what is the reportCode and item.reportName values:',
                                //   reportTypes.map((r) => r.reportCode),
                                //   item.reportName
                                // );
                                // setSelectedReportTypes((prev) => ({
                                //   ...prev,
                                //   [item.postId]: reportTypes.find(
                                //     (r) => r.reportCode === item.reportName
                                //   ) || {
                                //     type: 0,
                                //     name: ReportName.NONE,
                                //     reportCode: 'NONE',
                                //   },
                                // }));
                                onClickSetReportType(
                                  item.postId,
                                  selectedReportTypes[item.postId]
                                    ?.reportCode || ReportName.NONE
                                );

                                setEditingReportTypePostId(null);
                              }}
                              className="text-blue-600 hover:text-blue-800"
                            >
                              <img
                                src={Ok}
                                alt="Ok Icon"
                                className="table-action-icon"
                              />
                            </button>
                          </div>
                        ) : item.reportName !== ReportName.NONE ? (
                          <>
                            <div className="flex items-center justify-between w-full">
                              <div className="flex-1 items-center gap-2">
                                <p>
                                  {reportTypes.find(
                                    (type) =>
                                      type.reportCode === item.reportName
                                  )?.name || ''}
                                </p>
                              </div>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  e.preventDefault();
                                  setEditingReportTypePostId(item.postId);
                                  setSelectedReportTypes((prev) => ({
                                    ...prev,
                                    [item.postId]: reportTypes.find(
                                      (r) => r.name === item.reportName
                                    ) || {
                                      type: 0,
                                      name: ReportName.NONE,
                                      reportCode: 'NONE',
                                    },
                                  }));
                                }}
                                className="text-blue-600 hover:text-blue-800"
                              >
                                <img
                                  src={EditPencil_Icon}
                                  alt="Edit Icon"
                                  className="table-action-icon"
                                />
                              </button>
                              <button
                                onClick={() => {
                                  if (
                                    item.payrollStatus !== 'Completed' ||
                                    item.reportName === ReportName.NONE
                                  )
                                    return;

                                  navigate(
                                    `/paytrack/reports?postId=${item.postId}&reportType=${
                                      reportTypes.find(
                                        (r) => r.reportCode === item.reportName
                                      )?.reportCode
                                    }&month=${monthToNumber(date.month)}&year=${date.year}`
                                  );
                                }}
                                disabled={
                                  item.payrollStatus !== 'Completed' ||
                                  !item.reportName
                                }
                                className="disabled:opacity-50 disabled:pointer-events-none pl-1"
                              >
                                <img
                                  src={PayrollStatus_print}
                                  alt="print Icon"
                                  className="table-action-icon"
                                />
                              </button>
                            </div>
                          </>
                        ) : (
                          <div className="flex items-center justify-center gap-2">
                            <ReportSelectDropDown
                              label="Select Report Type"
                              reportTypes={reportTypes}
                              width={40}
                              value={
                                selectedReportTypes[item.postId]?.name ||
                                ReportName.NONE
                              }
                              onChangeReportType={(reportType) =>
                                setSelectedReportTypes((prev) => ({
                                  ...prev,
                                  [item.postId]: reportType,
                                }))
                              }
                            />
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                e.preventDefault();
                                onClickSetReportType(
                                  item.postId,
                                  selectedReportTypes[item.postId]?.name ||
                                    ReportName.NONE
                                );
                                setEditingReportTypePostId(null);
                              }}
                              className="text-blue-600 hover:text-blue-800"
                            >
                              <img
                                src={Ok}
                                alt="Ok Icon"
                                className="table-action-icon"
                              />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                e.preventDefault();
                                onClickSetReportType(
                                  item.postId,
                                  selectedReportTypes[item.postId]?.name
                                );
                                setEditingReportTypePostId(null);
                              }}
                              className="text-blue-600 hover:text-blue-800"
                            >
                              <img
                                src={Ok}
                                alt="Ok Icon"
                                className="table-action-icon"
                              />
                            </button>
                          </div>
                        )}
                      </td>
                      <td className="table-td-with-input relative">
                        <button
                          onClick={(e) => handleActionClick(e, item.postId)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <img
                            src={TableOptionsIcon}
                            alt="Options"
                            className="w-4"
                          />
                        </button>
                      </td>

                      {/* Dev Action */}
                      {isDevAdmin && (
                        <td className="table-td-with-input">
                          <div className="flex items-center justify-center">
                            {/* Delete  */}
                            {item.attendanceStatus === 'Completed' &&
                              item.payrollStatus !== 'Completed' && (
                                <button
                                  onClick={() =>
                                    onClickDeleteAttendance(
                                      item.postId,
                                      monthToNumber(date.month),
                                      date.year
                                    )
                                  }
                                  className={`flex items-center justify-center underline font-Mona_Sans text-responsive-label font-semibold text-bgPrimaryButton hover:text-bgPrimaryButtonHover hover:duration-200 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-md px-4 py-2`}
                                >
                                  Delete&nbsp;Attendance
                                </button>
                              )}
                            {item.payrollStatus === 'Completed' &&
                              item.attendanceStatus === 'Completed' && (
                                <button
                                  onClick={() =>
                                    onClickDeletePayroll(
                                      item.postId,
                                      monthToNumber(date.month),
                                      date.year
                                    )
                                  }
                                  className={`flex items-center justify-center underline font-Mona_Sans text-responsive-label font-semibold text-bgPrimaryButton hover:text-bgPrimaryButtonHover hover:duration-200 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-md px-4 py-2`}
                                >
                                  Delete&nbsp;Payroll
                                </button>
                              )}
                          </div>
                        </td>
                      )}
                    </tr>
                  ))}
              </tbody>
            </table>

            {actionPostId !== null && (
              <div
                ref={actionMenuRef}
                className="fixed z-50 bg-white border border-gray-300 shadow-lg"
                style={{
                  top: `${menuPosition.top}px`,
                  left: `${menuPosition.left}px`,
                }}
              >
                {/* View Attendance — ALWAYS ENABLED */}
                <button
                  onClick={() => {
                    setActionPostId(null);
                    handlePostClick(actionPostId);
                  }}
                  className="action-menu-button"
                >
                  <img
                    src={PayrollStatus_Attendance}
                    alt="Delete"
                    className="w-4 h-4"
                  />
                  <p className="text-responsive-table">View Attendance</p>
                </button>

                {/* View Payroll */}
                <button
                  disabled={
                    !statusData.find((p) => p.postId === actionPostId)
                      ?.payrollStatus ||
                    statusData.find((p) => p.postId === actionPostId)
                      ?.payrollStatus !== 'Completed'
                  }
                  onClick={() => {
                    const post = statusData.find(
                      (p) => p.postId === actionPostId
                    );
                    if (!post) return;

                    setActionPostId(null);
                    onClickViewPayroll(
                      post.postId,
                      monthToNumber(date.month),
                      date.year
                    );
                  }}
                  className="action-menu-button disabled:opacity-50 disabled:pointer-events-none"
                >
                  <img
                    src={PayrollStatus_Payroll}
                    alt="Delete"
                    className="w-4 h-4"
                  />
                  <p className="text-responsive-table">View Payroll</p>
                </button>

                {/* Print Report */}
                <button
                  onClick={() => {
                    if (
                      statusData.find((p) => p.postId === actionPostId)
                        ?.reportName !== ReportName.NONE
                    ) {
                      navigate(
                        `/paytrack/reports?postId=${actionPostId}&reportType=${reportTypes.find((r) => r.reportCode === statusData.find((p) => p.postId === actionPostId)?.reportName)?.reportCode}&month=${monthToNumber(date.month)}&year=${date.year}`
                      );
                    }
                  }}
                  disabled={
                    statusData.find((p) => p.postId === actionPostId)
                      ?.payrollStatus !== 'Completed'
                  }
                  className="action-menu-button disabled:opacity-50 disabled:pointer-events-none"
                >
                  <img
                    src={PayrollStatus_print}
                    alt="Delete"
                    className="w-4 h-4"
                  />
                  <p className="text-responsive-table">Print Report</p>
                </button>

                {/* Payslip */}
                <button
                  disabled={
                    statusData.find((p) => p.postId === actionPostId)
                      ?.payrollStatus !== 'Completed'
                  }
                  onClick={() => {
                    const post = statusData.find(
                      (p) => p.postId === actionPostId
                    );
                    if (!post) return;

                    navigate(
                      `/paytrack/attendance-payslip?postId=${post.postId}&month=${monthToNumber(
                        date.month
                      )}&year=${date.year}`
                    );

                    setActionPostId(null);
                  }}
                  className="action-menu-button disabled:opacity-50 disabled:pointer-events-none"
                >
                  <img
                    src={PayrollStatus_Payslip}
                    alt="Delete"
                    className="w-4 h-4"
                  />
                  <p className="text-responsive-table">Payslip</p>
                </button>
              </div>
            )}
          </>
        )}
      </div>
      {/* </Accordion> */}
    </div>
  );
};

export default AttendanceAndPayrollStatus;
