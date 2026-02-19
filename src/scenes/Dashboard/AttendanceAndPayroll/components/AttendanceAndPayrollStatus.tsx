import React, { useEffect } from 'react';
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
import { EditPencil_Icon, Ok } from '../../../../assets/icons';
import { useNavigate } from 'react-router';
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
  return (
    <div>
      {/* {isLoading && <Loader />} */}
      {/* <Accordion title="Completed Attendance" disabled={false}> */}
      {/* <div className="flex flex-col text-center overflow-x-auto px-4 mt-[7%] max-h-[75vh] overflow-y-auto scrollbar scrollbar-thumb-scrollBarColor scrollbar-track-scrollBarBg"> */}
      <div className="flex flex-col text-center overflow-x-auto px-4 mt-[76px] 2xl:mt-[108px] max-h-[75vh] 2xl:pb-16 overflow-y-auto scrollbar scrollbar-thumb-scrollBarColor scrollbar-track-scrollBarBg">
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
                    className="emp-posting-table-th padding-y-responsive-table-header w-[3%]"
                    rowSpan={2}
                  >
                    Attendance Status
                  </th>
                  <th
                    className="emp-posting-table-th padding-y-responsive-table-header w-[3%]"
                    rowSpan={2}
                  >
                    Payroll Status
                  </th>
                  <th
                    className="emp-posting-table-th padding-y-responsive-table-header w-[3%]"
                    rowSpan={2}
                  >
                    Action
                  </th>
                  <th
                    className="emp-posting-table-th padding-y-responsive-table-header w-[5%]"
                    rowSpan={2}
                  >
                    Report Type
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
                      <td className="table-td-with-input py-2 text-start">
                        <button onClick={() => handlePostClick(item.postId)}>
                          <p className="text-left text-bgPrimaryButton hover:text-bgPrimaryButtonHover underline">
                            {item.postName || '---'}
                          </p>
                        </button>
                      </td>

                      {/* Attendance Status */}
                      <td className="table-td-with-input">
                        {item.attendanceStatus === 'Completed' ? (
                          <button className="bg-[#0C672B4D] text-[#0C672B] py-1 px-4 rounded-full font-medium text-responsive-label cursor-auto">
                            {item.attendanceStatus}
                          </button>
                        ) : (
                          <button className="bg-[#FFECB3] text-[#cc8f00] py-1 px-4 rounded-full font-medium text-responsive-label cursor-auto">
                            {item.attendanceStatus}
                          </button>
                        )}
                      </td>

                      {/* Payroll Status */}
                      <td className="table-td-with-input">
                        <div className="flex items-center justify-center">
                          {item.payrollStatus === 'Completed' && (
                            <button className="bg-[#0C672B4D] text-[#0C672B] py-1 px-4 rounded-full font-medium text-responsive-label   cursor-auto">
                              {item.payrollStatus}
                            </button>
                          )}
                          {item.attendanceStatus === 'Pending' &&
                            item.payrollStatus === 'Pending' && (
                              <button className="bg-[#FFECB3] text-[#cc8f00] py-1 px-4 rounded-full font-medium text-responsive-label   cursor-auto">
                                {item.payrollStatus}
                              </button>
                            )}
                          {item.attendanceStatus === 'Completed' &&
                            item.payrollStatus === 'Pending' && (
                              <div className="h-7 2xl:h-8">
                                <PrimaryButton
                                  // fontSize="xs"
                                  height={'full'}
                                  // onClick={() => setPayrollGenerateRequest(true)}
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
                      <td className="table-td-with-input">
                        <div className="flex items-center justify-center">
                          {/* View Payroll */}
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
                                      `/app/reports?postId=${item.postId}&reportType=${reportTypes.find((r) => r.reportCode === item.reportName)?.reportCode}&month=${monthToNumber(date.month)}&year=${date.year}`
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
                            </>
                          ) : (
                            <>-</>
                          )}
                        </div>
                      </td>

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
                          <div className="flex items-center gap-2">
                            <p>
                              {reportTypes.find(
                                (type) => type.reportCode === item.reportName
                              )?.name || ''}
                            </p>
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
                          </div>
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
          </>
        )}
      </div>
      {/* </Accordion> */}
    </div>
  );
};

export default AttendanceAndPayrollStatus;
