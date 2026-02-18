// Libraries
import React, { useEffect, useRef, useState } from 'react';
import * as Yup from 'yup';
import axios from 'axios';
import { toast } from 'react-toastify';

// Configs
import { api } from '../../../../configs/api';

// Hooks
import useVerifyUserAuth from '../../../../hooks/useVerifyUserAuth';
import useClickOutside from '../../../../hooks/useClickOutside';

// Types
import { AttendanceSchedule, Attendance } from '../../../../types/attendance';

// Components
// import Accordion from '../../../../common/Accordion/Accordion';
// import ClearButton from '../../../../common/Button/ClearButton';
import SmallButton from '../../../../common/Button/SmallButton';

// Assets
import {
  EditPencil_Icon,
  // TableOptionsIcon,
  Ok,
  Cancel,
} from '../../../../assets/icons';
import Loader from '../../../../common/Loader/Loader';
import ConfirmationModal from '../../../../common/Modal/ConfirmationModal';
// import { getMonthName } from '../../../../utils/helpersFunctions';
// import useHorizontalScroll from '../../../../hooks/useHorizontalScroll';

type AttendanceTableProps = {
  defaultWorkingDays: number;
  month: number;
  year: number;
  postId: number;
  // TODO: need to check type
  // existingAttendanceData?: AttendanceSchedule[];
  existingAttendanceData?: Attendance[];
  initialAttendanceData: AttendanceSchedule[];
  refreshAttendanceData: (attendanceData: AttendanceSchedule[]) => void;
  canAttendanceBeEdited: boolean;
  allowAttendanceEdit: () => void;
  refreshAttendanceAndPayrollStatus: (month: number, year: number) => void;
  currentPostName?: string;
};

const AttendanceTable: React.FC<AttendanceTableProps> = ({
  defaultWorkingDays,
  month,
  year,
  postId,
  existingAttendanceData,
  refreshAttendanceData,
  initialAttendanceData,
  canAttendanceBeEdited,
  allowAttendanceEdit,
  refreshAttendanceAndPayrollStatus,
  // currentPostName,
}) => {
  const attendanceValidationSchema = Yup.object()
    .shape({
      empPostRankLinkId: Yup.number().required(
        'Employee Post Rank Link is required'
      ),
      // empId: Yup.string(),
      daysPresent: Yup.number()
        .integer('Working Days must be an integer')
        .min(0, 'Working Days cannot be negative')
        .max(
          defaultWorkingDays,
          `Working Days cannot be more than ${defaultWorkingDays}`
        ),
      daysAbsent: Yup.number()
        .integer('Days Absent must be an integer')
        .min(0, 'Days Absent cannot be negative')
        .max(
          defaultWorkingDays,
          `Days Absent cannot be more than ${defaultWorkingDays}`
        )
        .notRequired(),
      extraDutyFourHr: Yup.number()
        .integer('Extra Duty Four Hr must be an integer')
        .min(0, 'Extra Duty Four Hr cannot be negative')
        .notRequired(),
      extraDutyEightHr: Yup.number()
        .integer('Extra Duty Eight Hr must be an integer')
        .min(0, 'Extra Duty Eight Hr cannot be negative')
        .notRequired(),
    })
    .test('total-days-check', function (value) {
      const { daysPresent, daysAbsent } = value;
      return (
        (daysPresent || 0) + (daysAbsent || 0) <= defaultWorkingDays ||
        this.createError({
          message: `The sum of working days and days absent cannot exceed ${defaultWorkingDays}`,
        })
      );
    });

  /* Verify User Auth */
  const accessToken = useVerifyUserAuth();
  /* Table Horizontal Scroll */
  // const tableRef = useHorizontalScroll();

  /* Loader */
  const [isLoading, setIsLoading] = useState(false);

  /* Error Handling */
  // const { errors, handleYupError, setErrors } = useHandleYupError();
  // const { handleAxiosError } = useHandleAxiosError(setErrors);

  /* Attendance Data and Handling */
  const [updatedAttendanceData, setUpdatedAttendanceData] = React.useState<
    Attendance[]
  >([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editAttendanceId, setEditAttendanceId] = useState<number>(0);
  const [isAttendanceEdited, setIsAttendanceEdited] = useState(false);

  const [errors, setErrors] = useState<string[]>([]);

  // Test use effect
  useEffect(() => {
    // console.log(':::::::::START: MONITORING IN ATTENDANCE TABLE:::::::: ');
    // console.log('attendance schedule: ', initialAttendanceData);
    // console.log('_____________________ ');
    // console.log('existing attendance data: ', existingAttendanceData);
    // console.log('updated attendance data: ', updatedAttendanceData);
    // console.log('canAttendanceBeEdited: ', canAttendanceBeEdited);
    // console.log('isAttendanceEdited: ', isAttendanceEdited);
    // console.log('editAttendanceId: ', editAttendanceId);
    // console.log('isEditing: ', isEditing);
    // console.log('errors: ', errors);
    // console.log(':::::::::END: MONITORING IN ATTENDANCE TABLE:::::::: ');
  });

  // Use effect for loading existing attendance data if any
  useEffect(() => {
    if (existingAttendanceData && existingAttendanceData.length > 0) {
      setUpdatedAttendanceData(existingAttendanceData);
    } else if (initialAttendanceData && initialAttendanceData.length > 0) {
      setUpdatedAttendanceData(initialAttendanceData);
    }
  }, [initialAttendanceData]);

  // const handleAttendanceInputChange = (
  //   id: number,
  //   field: keyof Attendance,
  //   value: string
  // ) => {
  //   // console.log(
  //   //   `Input changed for ID: ${id}, field: ${field}, value: ${value}`
  //   // );
  //   setErrors([]);
  //   setUpdatedAttendanceData((prevData) =>
  //     prevData.map((item) =>
  //       item.empPostRankLinkId === id
  //         ? { ...item, [field]: parseInt(value, 10) || 0 }
  //         : item
  //     )
  //   );
  //   setIsAttendanceEdited(true);
  // };

  const handleAttendanceInputChange = (
    id: number,
    field: keyof Attendance,
    value: string
  ) => {
    setErrors([]); // Clear errors initially
    setUpdatedAttendanceData((prevData) =>
      prevData.map((item) => {
        if (item.empPostRankLinkId === id) {
          const updatedValue = parseInt(value, 10) || 0;

          // Use the updated values from the current state (`prevData`) instead of `initialAttendanceData`
          const currentDaysPresent = item.daysPresent || 0;
          const currentDaysAbsent = item.daysAbsent || 0;
          const maxWorkingDaysForEmployee =
            currentDaysPresent + currentDaysAbsent;

          if (field === 'daysAbsent') {
            // Cap `daysAbsent` to the maximum working days
            const newDaysAbsent = Math.min(
              updatedValue,
              maxWorkingDaysForEmployee
            );
            // Recalculate `daysPresent` based on the new `daysAbsent`
            const newDaysPresent = Math.max(
              0,
              maxWorkingDaysForEmployee - newDaysAbsent
            );
            return {
              ...item,
              daysAbsent: newDaysAbsent,
              daysPresent: newDaysPresent,
            };
          }

          if (field === 'daysPresent') {
            // Cap `daysPresent` to the maximum working days
            const newDaysPresent = Math.min(
              updatedValue,
              maxWorkingDaysForEmployee
            );
            // Recalculate `daysAbsent` based on the new `daysPresent`
            const newDaysAbsent = Math.max(
              0,
              maxWorkingDaysForEmployee - newDaysPresent
            );
            return {
              ...item,
              daysPresent: newDaysPresent,
              daysAbsent: newDaysAbsent,
            };
          }

          // Update other fields (like `extraDutyFourHr`, `extraDutyEightHr`) normally
          return { ...item, [field]: updatedValue };
        }
        return item; // Return unchanged rows
      })
    );

    setIsAttendanceEdited(true); // Mark attendance as edited
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // console.log('attendance data in submit: ', updatedAttendanceData);

    setIsLoading(true);
    let hasErrors = false;
    const newErrors: string[] = [];

    // Validate attendance data
    for (let i = 0; i < updatedAttendanceData.length; i++) {
      try {
        await attendanceValidationSchema.validate(updatedAttendanceData[i], {
          abortEarly: false,
        });
      } catch (error) {
        if (error instanceof Yup.ValidationError) {
          hasErrors = true;
          error.inner.forEach((err) => {
            if (err.message)
              newErrors.push(
                `${err.message} for Employee ID ${updatedAttendanceData[i].empId}`
              );
          });
        }
      }
    }

    if (hasErrors) {
      setErrors(newErrors);
      // toast.error('Please fill all required fields.');
      setIsLoading(false);
    } else {
      setErrors([]);

      try {
        // If no existing attendance data, create a new one
        if (!existingAttendanceData || existingAttendanceData.length === 0) {
          const response = await axios.post(
            `${api.baseUrl}/attendance/${postId}/${month}/${year}`,
            { attendanceList: updatedAttendanceData },
            { headers: { 'x-access-token': accessToken } }
          );

          if (response.data && response.data.success) {
            toast.success(response.data.message);
            // console.log(
            //   'create attendance response: ',
            //   response.data.attendances
            // );
            refreshAttendanceData(response.data.attendances);
            setUpdatedAttendanceData(response.data.attendances);
            allowAttendanceEdit();
            refreshAttendanceAndPayrollStatus(month, year);
          }
        }

        // If existing attendance data and data is edited, update it
        // if (
        //   existingAttendanceData &&
        //   existingAttendanceData.length > 0 &&
        //   isAttendanceEdited
        // ) {
        //   console.log('now updating...');
        //   const response = await axios.patch(
        //     `${api.baseUrl}/attendance/${postId}/${month}/${year}`,
        //     { attendanceList: updatedAttendanceData },
        //     { headers: { 'x-access-token': accessToken } }
        //   );
        //   if (response.data && response.data.success) {
        //     toast.success(response.data.message);
        //     console.log(
        //       'update attendance response: ',
        //       response.data.attendances
        //     );
        //     refreshAttendanceData(response.data.attendances);
        //     setUpdatedAttendanceData([]);
        //   }
        // }
      } catch (error) {
        handleError(error);
      } finally {
        setIsAttendanceEdited(false);
        setIsEditing(false);
        setIsLoading(false);
      }
    }
  };

  /** Table Action Modal Controls */
  const [actionModalIndex, setActionModalIndex] = useState<number | null>(null);
  console.log('actionModalIndex: ', actionModalIndex);
  const [showConfirmWarningEditModal, setShowConfirmWarningEditModal] =
    useState(false);
  const actionMenuRef = useRef<HTMLDivElement>(null);
  useClickOutside(actionMenuRef, () => setActionModalIndex(null));

  const handleError = (error: unknown) => {
    console.error('Error:', error); // TODO: Remove console.error
    const newErrors: string[] = [];
    if (error instanceof Yup.ValidationError) {
      error.inner.forEach((err) => {
        if (err.message) newErrors.push(err.message);
      });
    }
    setErrors(newErrors);
    if (axios.isAxiosError(error)) {
      if (error.response) {
        console.error('Error response:', error.response.data);
        toast.error(error.response.data.message);
      } else if (error.request) {
        console.error('Error request:', error.request);
      } else {
        console.error('Error message:', error.message);
      }
    } else {
      console.error('Unexpected error:', error);
    }
  };

  const handleClickEdit = (editAttendanceId: number) => {
    console.log('handleClickEdit: ', editAttendanceId);
    // setUpdatedAttendanceData(existingAttendanceData ?? []);
    setUpdatedAttendanceData(existingAttendanceData ?? []);
    setActionModalIndex(null);
    setIsEditing(true);
    setEditAttendanceId(editAttendanceId);
  };

  const resetRowData = (empPostRankLinkId: number) => {
    if (!existingAttendanceData || empPostRankLinkId === 0) return;
    const existingData = existingAttendanceData.find(
      (data) => data.empPostRankLinkId === empPostRankLinkId
    );
    if (existingData) {
      setUpdatedAttendanceData((prevData) =>
        prevData.map((item) =>
          item.empPostRankLinkId === empPostRankLinkId
            ? { ...existingData }
            : item
        )
      );
    }
  };

  const handleSaveEditedRecord = async (
    e: React.MouseEvent<HTMLButtonElement>,
    attendance: Attendance
  ) => {
    // console.log('saving edited record...');
    // console.log('attendance: ', attendance);
    e.preventDefault();
    e.stopPropagation();
    setIsLoading(true);
    try {
      if (!isAttendanceEdited) {
        setIsEditing(false);
        setEditAttendanceId(0);
        return;
      }
      if (isAttendanceEdited && attendance) {
        let hasErrors = false;
        try {
          await attendanceValidationSchema.validate(attendance, {
            abortEarly: false,
          });
        } catch (error) {
          const newErrors: string[] = [];
          if (error instanceof Yup.ValidationError) {
            error.inner.forEach((err) => {
              if (err.message)
                newErrors.push(
                  `${err.message} for Employee ID ${attendance.empId}`
                  // err.message
                );
            });
          }
          hasErrors = true;
          setErrors(newErrors);
        }

        if (hasErrors) return;
        const response = await axios.patch(
          `${api.baseUrl}/attendance-record/${attendance.ID}`,
          {
            daysPresent: attendance.daysPresent,
            daysAbsent: attendance.daysAbsent,
            extraDutyFourHr: attendance.extraDutyFourHr,
            extraDutyEightHr: attendance.extraDutyEightHr,
            year: attendance.year,
            month: attendance.month,
          },
          { headers: { 'x-access-token': accessToken } }
        );

        if (response.data && response.data.success) {
          toast.success(response.data.message);
          // console.log('response data: ', response.data);
          refreshAttendanceData(response.data.attendances);
          setIsEditing(false);
          setEditAttendanceId(0);
          setIsAttendanceEdited(false);
        }
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response) {
          console.error('Error response:', error.response.data);
          toast.error(error.response.data.message);
        } else if (error.request) {
          console.error('Error request:', error.request);
        } else {
          console.error('Error message:', error.message);
        }
      }
    } finally {
      setIsLoading(false);
    }

    // setUpdatedAttendanceData(existingAttendanceData ?? []);
    // setActionModalIndex(null);
  };

  const handleCancelEditingRecord = (
    e: React.MouseEvent<HTMLButtonElement>,
    empPostRankLinkId: number
  ) => {
    e.preventDefault();
    e.stopPropagation();
    setErrors([]);
    // setUpdatedAttendanceData(existingAttendanceData ?? []);
    // setActionModalIndex(null);
    setIsEditing(false);
    // setEditAttendanceId(0);
    resetRowData(empPostRankLinkId); // Call the function here
    // refreshAttendanceData();
  };

  useEffect(() => {
    console.log('isEditing in attendance table: ', isEditing);
  }, []);

  // JSX here
  return (
    <>
      {isLoading && <Loader />}
      <form
        onSubmit={handleSubmit}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            e.preventDefault();
            handleSubmit(e);
          }
        }}
        className="w-full h-[66vh] mx-auto relative"
      >
        <div className="flex flex-col ">
          <div
            // ref={tableRef}
            className="flex flex-col text-center overflow-x-auto px-4 2xl:px-8 h-[60vh] overflow-y-auto scrollbar scrollbar-thumb-scrollBarColor scrollbar-track-scrollBarBg"
          >
            <table className="bg-white border border-tableBorder w-full ">
              <thead className="text-center text-primaryText border border-tableBorder sticky top-0 z-20">
                <tr className="bg-tableHeadingColour">
                  <th
                    className="emp-posting-table-th padding-y-responsive-table-header w-[5%] "
                    rowSpan={2}
                  >
                    {/* Emp ID */}
                    Sl No.
                  </th>
                  <th
                    className="w-[10%] text-left emp-posting-table-th padding-y-responsive-table-header"
                    rowSpan={2}
                  >
                    Employee Name
                  </th>
                  <th
                    className="w-[10%]  emp-posting-table-th padding-y-responsive-table-header "
                    rowSpan={2}
                  >
                    Rank
                  </th>
                  <th
                    className="w-[8%]  emp-posting-table-th padding-y-responsive-table-header "
                    rowSpan={2}
                  >
                    Working Days
                  </th>
                  <th
                    className="w-[10%]  emp-posting-table-th padding-y-responsive-table-header "
                    rowSpan={2}
                  >
                    {/* Extra Duty (4 Hour) */}
                    <div className="flex flex-col  ">
                      <span> Extra Duty </span>
                      <span>(4 Hour)</span>
                    </div>
                  </th>

                  <th
                    className="w-[10%]  emp-posting-table-th padding-y-responsive-table-header "
                    rowSpan={2}
                  >
                    {/* Extra Duty (8 Hour) */}
                    <div className="flex flex-col ">
                      <span> Extra Duty </span>
                      <span>(8 Hour)</span>
                    </div>
                  </th>
                  <th
                    className="w-[10%]  emp-posting-table-th padding-y-responsive-table-header "
                    rowSpan={2}
                  >
                    Days Absent
                  </th>
                  <th
                    className="w-[5%]  emp-posting-table-th padding-y-responsive-table-header"
                    rowSpan={2}
                  >
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="text-primaryText border border-tableBorder">
                {updatedAttendanceData &&
                  updatedAttendanceData.length > 0 &&
                  // !isEditing &&
                  updatedAttendanceData.map((row, index) => (
                    <tr
                      key={row.empPostRankLinkId}
                      // className="border border-tableBorder hover:bg-gray-200 font-medium table-body-row"
                      className="border border-tableBorder hover:bg-gray-200 font-medium table-body-row"
                    >
                      {/* Employee ID */}
                      <td className="w-[5%] table-td-with-input">
                        {index + 1}
                        {/* {row.empId} */}
                      </td>
                      {/* Employee Name */}
                      <td className="pl-4 w-[30%] table-td-with-input">
                        <p className="text-left">{row.empName}</p>
                      </td>
                      {/* Rank */}
                      <td className="w-[20%] table-td-with-input">
                        {row.rank}
                      </td>
                      {/* Working Days */}
                      <td className="w-[10%] table-td-with-input">
                        {(isEditing &&
                          editAttendanceId === row.empPostRankLinkId) ||
                        !existingAttendanceData ||
                        existingAttendanceData.length === 0 ? (
                          <input
                            type="number"
                            name="daysPresent"
                            className="w-full h-7 2xl:h-8 border rounded-md pl-2"
                            // value={row.daysPresent || defaultWorkingDays}
                            value={
                              row.daysPresent !== undefined
                                ? row.daysPresent
                                : 0
                            }
                            min="0"
                            onWheel={(e) => e.currentTarget.blur()}
                            onChange={(e) =>
                              handleAttendanceInputChange(
                                row.empPostRankLinkId,
                                'daysPresent',
                                e.target.value
                              )
                            }
                          />
                        ) : (
                          <p>{row.daysPresent}</p>
                        )}
                      </td>
                      {/* Extra Duty (4 Hour) */}
                      {/* <td className="w-[10%] table-td-with-input"> */}
                      <td className="w-[10%] table-td-with-input">
                        {(isEditing &&
                          editAttendanceId === row.empPostRankLinkId) ||
                        !existingAttendanceData ||
                        existingAttendanceData.length === 0 ? (
                          <input
                            type="number"
                            name="extraDutyFourHr"
                            className="w-full h-7 2xl:h-8 border rounded-md pl-2"
                            value={row.extraDutyFourHr || 0}
                            min="0"
                            onWheel={(e) => e.currentTarget.blur()}
                            onChange={(e) =>
                              handleAttendanceInputChange(
                                row.empPostRankLinkId,
                                'extraDutyFourHr',
                                e.target.value
                              )
                            }
                          />
                        ) : (
                          <p>{row.extraDutyFourHr}</p>
                        )}
                      </td>
                      {/* Extra Duty (8 Hour) */}
                      <td className="w-[10%] table-td-with-input">
                        {(isEditing &&
                          editAttendanceId === row.empPostRankLinkId) ||
                        !existingAttendanceData ||
                        existingAttendanceData.length === 0 ? (
                          <input
                            type="number"
                            name="extraDutyEightHr"
                            className="w-full h-7 2xl:h-8 border rounded-md pl-2"
                            value={row.extraDutyEightHr || 0}
                            min="0"
                            onWheel={(e) => e.currentTarget.blur()}
                            onChange={(e) =>
                              handleAttendanceInputChange(
                                row.empPostRankLinkId,
                                'extraDutyEightHr',
                                e.target.value
                              )
                            }
                          />
                        ) : (
                          <p>{row.extraDutyEightHr}</p>
                        )}
                      </td>
                      {/* Days Absent */}
                      <td className="w-[10%] table-td-with-input">
                        {(isEditing &&
                          editAttendanceId === row.empPostRankLinkId) ||
                        !existingAttendanceData ||
                        existingAttendanceData.length === 0 ? (
                          <input
                            type="number"
                            name="daysAbsent"
                            className="w-full h-7 2xl:h-8 border rounded-md pl-2"
                            // value={row.daysAbsent || 0}
                            value={
                              row.daysAbsent !== undefined ? row.daysAbsent : 0
                            }
                            min="0"
                            onWheel={(e) => e.currentTarget.blur()}
                            onChange={(e) =>
                              handleAttendanceInputChange(
                                row.empPostRankLinkId,
                                'daysAbsent',
                                e.target.value
                              )
                            }
                          />
                        ) : (
                          <p>{row.daysAbsent}</p>
                        )}
                      </td>
                      {/* Action Menu */}
                      <td className="w-[5%] table-td-with-input relative ">
                        {isEditing &&
                        editAttendanceId === row.empPostRankLinkId ? (
                          <div className="flex gap-2 justify-center">
                            <button
                              onClick={(e) => handleSaveEditedRecord(e, row)}
                            >
                              <img
                                src={Ok}
                                className="table-action-icon"
                                alt=""
                              />
                            </button>
                            <button
                              onClick={(e) =>
                                handleCancelEditingRecord(
                                  e,
                                  row.empPostRankLinkId
                                )
                              }
                            >
                              <img
                                src={Cancel}
                                className="table-action-icon"
                                alt=""
                              />
                            </button>
                          </div>
                        ) : existingAttendanceData &&
                          existingAttendanceData.length > 0 ? (
                          <div className="flex items-center justify-center ">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                e.preventDefault();
                                // setActionModalIndex(
                                //   actionModalIndex === index ? null : index
                                // );
                                if (canAttendanceBeEdited) {
                                  handleClickEdit(row.empPostRankLinkId);
                                } else {
                                  setEditAttendanceId(row.empPostRankLinkId);
                                  setShowConfirmWarningEditModal(true);
                                }
                              }}
                              className="text-blue-600 hover:text-blue-800"
                            >
                              <img
                                src={EditPencil_Icon}
                                alt="TableOptionsIcon"
                                className="table-action-icon"
                              />
                            </button>
                          </div>
                        ) : (
                          <>-</>
                        )}
                      </td>
                      {/* <td>-</td> */}
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="input-error mt-4 px-8 text-left">
          {errors.length > 0 &&
            errors.map((error, index) => <p key={index}>{error}</p>)}
        </div>
        <div className="absolute left-1/2 transform -translate-x-1/2">
          {/* <ClearButton
            type="button"
            onClick={() => setUpdatedAttendanceData([])}
          >
            Clear
          </ClearButton> */}

          {existingAttendanceData && existingAttendanceData.length === 0 && (
            <SmallButton type="submit">Save</SmallButton>
          )}
        </div>
        <div className="flex justify-start text-start absolute bottom-0">
          {existingAttendanceData &&
            existingAttendanceData.length > 0 &&
            !canAttendanceBeEdited && (
              <p className="text-sm self-start pl-8">
                <span className="input-error">* </span> Payroll has already been
                generated for the selected month and post.
              </p>
            )}
        </div>
      </form>
      {showConfirmWarningEditModal && (
        <ConfirmationModal
          confirmButtonTitle="Ok"
          cancelButtonTitle="Cancel"
          onConfirm={() => {
            setShowConfirmWarningEditModal(false);
            handleClickEdit(editAttendanceId);
          }}
          onCancel={() => setShowConfirmWarningEditModal(false)}
          message={`Warning! Payroll has already been generated for the selected month and post. Are you sure you want to edit the attendance?`}
        />
      )}
    </>
  );
};

export default AttendanceTable;
