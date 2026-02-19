// Libraries
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router';
import axios, { AxiosError } from 'axios';
import { toast } from 'react-toastify';
import * as Yup from 'yup';
import { Tooltip as ReactTooltip, Tooltip } from 'react-tooltip';

// Assets
import {
  Abscond_Icon,
  Delete_Icon,
  EditPencil_Icon,
  EmpRemoveIcon,
  Generate_ID_Icon,
  Resign_Icon,
  TableOptionsIcon,
} from '../../../../../assets/icons';

// Components
import ConfirmationModal from '../../../../../common/Modal/ConfirmationModal';

// Hooks
import useScrollToTop from '../../../../../hooks/useScrollToTop';
import useVerifyUserAuth from '../../../../../hooks/useVerifyUserAuth';
import useClickOutside from '../../../../../hooks/useClickOutside';

// Types
import { EmployeeTable } from '../../../../../types/employee';
// import { EmployeeStatus } from '../../../../../types/employee';

// Configs
import { api } from '../../../../../configs/api';
// import useHorizontalScroll from '../../../../../hooks/useHorizontalScroll';
import useHandleYupError from '../../../../../hooks/useHandleYupError';
import useHandleAxiosError from '../../../../../hooks/useHandleAxiosError';
// import { ref } from 'yup';
import Loader from '../../../../../common/Loader/Loader';

// css
import '../../../../../App.css';
import EmployeeResignModal from '../../../../../common/Modal/EmployeeResignModal';
import EmployeeAbscondModal from '../../../../../common/Modal/EmployeeAbscondModal';
import EmployeeDischargeModal from '../../../../../common/Modal/EmployeeDischargeModal';
import { formatDateDdMmYyyySlash } from '../../../../../utils/formatter';
// import { set } from 'react-datepicker/dist/date_utils';
import EmployeeIdCardModal from '../../../../../common/Modal/EmployeeIdCardModal';

// Prop types
type EmployeesTableProps = {
  employeesData: EmployeeTable[];
  refreshEmployeesData: () => void;
};

const EmployeesTable2: React.FC<EmployeesTableProps> = ({
  employeesData,
  refreshEmployeesData,
}) => {
  // scroll to top
  useScrollToTop();
  // verify user authentication
  const accessToken = useVerifyUserAuth();
  // navigation
  const navigate = useNavigate();

  /* Table Horizontal Scroll */
  // const tableRef = useHorizontalScroll();

  /* Loader */
  const [isLoading, setIsLoading] = useState(false);

  /* Error Handling */
  const { handleYupError, setErrors } = useHandleYupError();
  const { handleAxiosError } = useHandleAxiosError(setErrors);

  /** Table Action Modal Controls */
  const [actionModalIndex, setActionModalIndex] = useState<number | null>(null);
  const actionMenuRef = useRef<HTMLDivElement>(null);
  useClickOutside(actionMenuRef, () => setActionModalIndex(null));

  /** Edit and Delete Controls */
  const [actionEmployeeId, setActionEmployeeId] = useState<number>(0);
  const [actionEmplPostRankId, setActionEmplPostRankId] = useState<number>(0);
  const [actionEmployeeName, setActionEmployeeName] = useState<string>('');

  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);

  const handleDelete = async (id: number) => {
    setIsLoading(true);

    try {
      const response = await axios.delete(
        `${api.baseUrl}${api.employees}/${id}`,
        {
          headers: { 'x-access-token': accessToken },
        }
      );
      if (response.data && response.data.success) {
        setShowDeleteModal(false);
        toast.success(response.data.message);
        refreshEmployeesData();
      }
    } catch (error) {
      // Type guard to check if the error is an AxiosError
      if (axios.isAxiosError(error)) {
        if (error.response) {
          toast.error(error.response.data.message);

          // Handle specific error codes if necessary
          if (error.response.data.errorCode === 'P2003') {
            setShowDeleteModal(false);
            toast.error('Rank cannot be deleted. It is in use.');
          }
        } else {
          console.error('Axios error without response:', error.message);
        }
      } else {
        console.error('Unexpected error:', error);
        toast.error('An unexpected error occurred.');
      }
    } finally {
      setShowDeleteModal(false);
      setIsLoading(false);
    }
  };
  const handleEdit = (id: number) => {
    navigate(`/app/organisation/employee-details/edit-employee?id=${id}`);
  };

  /** Update Employee Status */
  // const updateEmployeeStatus = async (id: number, status: EmployeeStatus) => {
  //   if (!accessToken || !id || !status) {
  //     return;
  //   }
  //   try {
  //     setIsLoading(true);
  //     setActionModalIndex(null);

  //     const response = await axios.patch(
  //       `${api.baseUrl}/employees/status/${id}`,
  //       { status },
  //       { headers: { 'x-access-token': accessToken } }
  //     );
  //     if (response.data && response.data.success) {
  //       toast.success(response.data.message);
  //       refreshEmployeesData();
  //     } else {
  //       toast.error(response.data.message);
  //     }
  //   } catch (error) {
  //     // Type guard to check if the error is an AxiosError
  //     if (axios.isAxiosError(error)) {
  //       toast.error(error.response?.data.message);
  //     } else {
  //       console.error('Unexpected error:', error);
  //       toast.error('An unexpected error occurred.');
  //     }
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  /* Employee Resign */
  const [showResignEmployeeModal, setShowResignEmployeeModal] =
    useState<boolean>(false);
  const [dateOfResignation, setDateOfResignation] = useState<Date | null>(null);
  const handleUpdateDateOfResignation = (dateOfResignation: Date | null) => {
    setDateOfResignation(dateOfResignation);
  };
  const handleResign = async (empTableID: number, postRankLinkID: number) => {
    if (!accessToken) return;
    setIsLoading(true);
    try {
      // TODO: Change API later
      const response = await axios.delete(
        `${api.baseUrl}/emp/${empTableID}/resign/${postRankLinkID}/${new Date(dateOfResignation as Date).toISOString() as string}`,
        { headers: { 'x-access-token': accessToken } }
      );
      if (response.data && response.data.success) {
        toast.success(response.data.message);
        refreshEmployeesData();
      }
    } catch (error) {
      // First, check if the error is an AxiosError before accessing properties
      if (error instanceof AxiosError && error.response) {
        toast.error(error.response.data.message);
        // Additional handling if needed for AxiosError, e.g., logging
        if (error.status === 400) {
          toast.error(error.response.data.message); // Additional toast if 400 status
        }
        handleAxiosError(error); // You can add custom logic for Axios-specific errors
      } else if (error instanceof Yup.ValidationError) {
        handleYupError(error);
      } else {
        // Fallback for unexpected errors
        toast.error('An unexpected error occurred');
      }
    } finally {
      setIsLoading(false);
      setShowResignEmployeeModal(false);
    }
  };

  /* Employee Abscond */
  const [showAbscondEmployeeModal, setShowAbscondEmployeeModal] =
    useState<boolean>(false);
  const [dateOfAbsconding, setDateOfAbsconding] = useState<Date | null>(null);
  const handleUpdateDateOfAbsconding = (dateOfAbsconding: Date | null) => {
    setDateOfAbsconding(dateOfAbsconding);
  };
  const handleAbscond = async (empTableID: number, postRankLinkID: number) => {
    if (!accessToken) return;
    setIsLoading(true);
    try {
      // TODO: Change API later
      const response = await axios.delete(
        `${api.baseUrl}/emp/${empTableID}/abscond/${postRankLinkID}/${new Date(dateOfAbsconding as Date).toISOString() as string}`,
        { headers: { 'x-access-token': accessToken } }
      );
      if (response.data && response.data.success) {
        toast.success(response.data.message);
        refreshEmployeesData();
      }
    } catch (error) {
      // First, check if the error is an AxiosError before accessing properties
      if (error instanceof AxiosError && error.response) {
        toast.error(error.response.data.message);
        // Additional handling if needed for AxiosError, e.g., logging
        if (error.status === 400) {
          toast.error(error.response.data.message); // Additional toast if 400 status
        }
        handleAxiosError(error); // You can add custom logic for Axios-specific errors
      } else if (error instanceof Yup.ValidationError) {
        handleYupError(error);
      } else {
        // Fallback for unexpected errors
        toast.error('An unexpected error occurred');
      }
    } finally {
      setIsLoading(false);
      setShowAbscondEmployeeModal(false);
    }
  };

  /* Table scroll */
  // const tableRef = useRef<HTMLDivElement>(null);

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

  const [showDischargeEmployeeModal, setShowDischargeEmployeeModal] =
    useState<boolean>(false);
  const [dischargeDate, setDischargeDate] = useState<Date | null>(null);
  const handleDischarge = async (
    empTableID: number,
    postRankLinkID: number
  ) => {
    if (!accessToken || !dischargeDate) return;
    setIsLoading(true);
    try {
      const response = await axios.delete(
        `${api.baseUrl}/emp/${empTableID}/unlink-postrank/${postRankLinkID}/${new Date(dischargeDate).toISOString() as string}`,
        { headers: { 'x-access-token': accessToken } }
      );
      if (response.data && response.data.success) {
        toast.success(response.data.message);
        refreshEmployeesData();
      }
    } catch (error) {
      // First, check if the error is an AxiosError before accessing properties
      if (error instanceof AxiosError && error.response) {
        toast.error(error.response.data.message);
        // Additional handling if needed for AxiosError, e.g., logging
        if (error.status === 400) {
          toast.error(error.response.data.message); // Additional toast if 400 status
        }
        handleAxiosError(error); // You can add custom logic for Axios-specific errors
      } else if (error instanceof Yup.ValidationError) {
        handleYupError(error);
      } else {
        // Fallback for unexpected errors
        toast.error('An unexpected error occurred');
      }
    } finally {
      setIsLoading(false);
      setShowDischargeEmployeeModal(false);
    }
  };
  const handleUpdateDischargeDate = (newDischargeDate: Date | null) => {
    setDischargeDate(newDischargeDate);
  };

  // const formatDate = (date?: Date | string | null): string => {
  //   if (!date) return '';
  //   const d = new Date(date);
  //   if (isNaN(d.getTime())) return '';
  //   return d.toLocaleDateString('en-GB'); // Format: DD/MM/YYYY
  // };

  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });

  // const handleActionClick = (
  //   e: React.MouseEvent,
  //   index: number,
  //   employee: EmployeeTable
  // ) => {
  //   const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();

  //   setMenuPosition({
  //     top: rect.bottom + window.scrollY,
  //     left: rect.left + window.scrollX,
  //   });

  //   setActionModalIndex(index);
  //   setActionEmployeeId(employee.ID ?? 0);
  //   setActionEmplPostRankId(employee.postRankLinkId ?? 0);
  //   setActionEmployeeName(employee.empName ?? '');
  // };
  const handleActionClick = (
    e: React.MouseEvent<HTMLButtonElement>,
    employee: EmployeeTable,
    index: number
  ) => {
    const button = e.currentTarget;
    const rect = button.getBoundingClientRect();
    // Store full employee object for modal use
    setSelectedEmployeeData(employee);
    // Wait for the menu to render so ref is not null
    setTimeout(() => {
      if (actionMenuRef.current) {
        const menuWidth = actionMenuRef.current.offsetWidth;

        setMenuPosition({
          top: rect.bottom + window.scrollY,
          left: rect.right + window.scrollX - menuWidth, // aligns right edge
        });
      }
    }, 0);

    setActionModalIndex(index);
    setActionEmployeeId(employee.ID ?? 0);
    setActionEmplPostRankId(employee.postRankLinkId ?? 0);
    setActionEmployeeName(employee.empName ?? '');
  };

  useEffect(() => {
    const handleScroll = () => {
      setActionModalIndex(null);
    };

    window.addEventListener('scroll', handleScroll, true); // useCapture = true to catch inner scrolls

    return () => {
      window.removeEventListener('scroll', handleScroll, true);
    };
  }, []);

  // Generate Id card
  const [showEmployeeIdCardModal, setShowEmployeeIdCardModal] =
    useState<boolean>(false);

  const [selectedEmployeeData, setSelectedEmployeeData] =
    useState<EmployeeTable | null>(null);

  // const generateIdCard = (employee: Employee) => {
  //   setSelectedEmployeeData({
  //     name: employee.empName ?? '',
  //     empId: employee.empId ?? '',
  //     // rank: employee.rank ?? '',
  //     dob: employee.dob ?? '',
  //     phone: employee.phoneNum ?? '',
  //     fatherName: employee.fatherName ?? '',
  //     // profilePhoto: employee.profilePhoto ?? '/default-photo.png',
  //   });
  //   setShowEmployeeIdCardModal(true);
  // };

  /* JSX here */
  return (
    <>
      {isLoading && <Loader />}
      <div
        // ref={tableRef}
        className="table-container"
      >
        <table
          id="employeesTable"
          className="bg-white border border-tableBorder w-full h-full table-fixed border-collapse"
        >
          <thead className="text-center text-primaryText border border-tableBorder sticky top-0 z-20 bg-tableHeadingColour">
            <tr>
              <th className="table-header text-left w-[15%]" rowSpan={2}>
                Name
              </th>
              <th className="table-header w-[6.6%]" rowSpan={2}>
                Emp ID
              </th>

              <th className="table-header w-[12%]" rowSpan={2}>
                Posting
              </th>

              <th className="table-header w-[11%]" rowSpan={2}>
                Rank
              </th>
              <th className="table-header w-[6%]" rowSpan={2}>
                Gender
              </th>
              <th className="table-header w-[8%]" rowSpan={2}>
                Status
              </th>
              <th className="table-header w-[7%]" rowSpan={2}>
                Date of Posting
              </th>
              {/* <th
                className="padding-x-responsive-table padding-y-responsive-table-header border border-tableBorder w-[8%] text-responsive-table "
                rowSpan={2}
              >
                Date of Re-Joining
              </th> */}
              <th className="table-header w-[8%]" rowSpan={2}>
                Contact
              </th>
              <th className="table-header px-0 w-[4.2%]" rowSpan={2}>
                Action
              </th>
            </tr>
          </thead>
          <tbody className="text-primaryText border border-tableBorder font-medium">
            {employeesData.map((employee: EmployeeTable, index: number) => (
              <tr key={employee.ID} className="table-body-row">
                {/* <td className="py-2 pl-[1%] xl:pl-[1.5%] text-start border border-tableBorder w-[15%] text-responsive-table  "> */}
                {/* Employee Name */}
                <td className="table-td-existing-data text-left table-td-existing-data-overflow">
                  <button onClick={() => handleEdit(employee.ID || 0)}>
                    <p className="text-left text-bgPrimaryButton hover:text-bgPrimaryButtonHover underline table-td-existing-data-overflow">
                      {employee.empName || '-'}
                    </p>
                  </button>
                </td>
                {/* Employee ID */}
                <td className="table-td-existing-data text-left">
                  {/* {employee.empId || '-'} */}
                  {employee.empId ? (
                    employee.empId
                  ) : (
                    <p className="text-center">-</p>
                  )}
                </td>
                {/* Posting */}
                <td className="table-td-existing-data text-left">
                  {/* {employee.postName || '-'} */}
                  <div
                    data-tooltip-id={`postName-tooltip-${index}`}
                    data-tooltip-content={employee.postName}
                  >
                    {employee.postName ? (
                      <p className="table-td-existing-data-overflow">
                        {employee.postName}
                      </p>
                    ) : (
                      <p className="text-center">-</p>
                    )}
                  </div>
                  <Tooltip
                    id={`postName-tooltip-${index}`}
                    place="bottom"
                    hidden={employee.postName ? false : true}
                  />
                </td>
                {/* Rank */}
                <td className="table-td-existing-data text-left">
                  <div
                    data-tooltip-id={`rank-tooltip-${index}`}
                    data-tooltip-content={employee.rank || '-'}
                  >
                    {employee.rank ? (
                      <p className="table-td-existing-data-overflow">
                        {employee.rank}
                      </p>
                    ) : (
                      <p className="text-center">-</p>
                    )}
                  </div>
                  <Tooltip id={`rank-tooltip-${index}`} place="bottom" />
                </td>
                {/* Gender */}
                <td className="table-td-existing-data">
                  {employee.gender ? (
                    employee.gender
                  ) : (
                    <p className="text-center">-</p>
                  )}
                </td>
                {/* Status */}
                <td className="table-td-existing-data w-[8%] ">
                  <div
                    data-tooltip-id={`status-tooltip-${employee.empId}`}
                    // data-tooltip-html={`Date of Posting: ${employee.dateOfPosting ? formatDateDdMmYyyySlash(employee.dateOfPosting) : '&nbsp;&nbsp;&nbsp;-'}<br />Date of Resignation: ${employee.dateOfResignation ? formatDateDdMmYyyySlash(employee.dateOfResignation) : '&nbsp;&nbsp;&nbsp;-'}<br />Date of Absconding: ${employee.dateOfAbsconding ? formatDateDdMmYyyySlash(employee.dateOfAbsconding) : '&nbsp;&nbsp;&nbsp;-'}<br />Date of Discharge: ${employee.dateOfDischarge ? formatDateDdMmYyyySlash(employee.dateOfDischarge) : '&nbsp;&nbsp;&nbsp;-'}`}
                  >
                    {employee.empStatus === 'Active' ? (
                      <button className="bg-[#0C672B4D] text-[#0C672B] py-1 px-4 rounded-full font-medium pointer-events-none">
                        {employee.empStatus}
                      </button>
                    ) : employee.empStatus === 'Discharged' ? (
                      <button className="bg-[#a7a7a7] text-[#4a4a4a] py-1 px-4 rounded-full font-medium text-responsive-table pointer-events-none">
                        {employee.empStatus}
                      </button>
                    ) : employee.empStatus === 'Absconded' ? (
                      <button className="bg-[#eaa9a9] text-[#ad1a1a] py-1 px-4 rounded-full font-medium text-responsive-table pointer-events-none">
                        {employee.empStatus}
                      </button>
                    ) : employee.empStatus === 'Resigned' ? (
                      <button className="bg-[#afb0e7] text-[#3538cd] py-1 px-4 rounded-full font-medium text-responsive-table pointer-events-none">
                        {employee.empStatus}
                      </button>
                    ) : (
                      <button className="bg-[#A1A1A1] text-white py-1 px-4 rounded-full font-medium text-responsive-table pointer-events-none">
                        {employee.empStatus}
                      </button>
                    )}
                  </div>

                  {/* <ReactTooltip
                    className="z-50"
                    id={`status-tooltip-${employee.empId}`}
                    place="right"
                    html={`<div style="text-align: left;">Date of Posting: ${employee.dateOfPosting ? formatDateDdMmYyyySlash(employee.dateOfPosting) : '&nbsp;&nbsp;&nbsp;-'}<br />Date of Resignation: ${employee.dateOfResignation ? formatDateDdMmYyyySlash(employee.dateOfResignation) : '&nbsp;&nbsp;&nbsp;-'}<br />Date of Absconding: ${employee.dateOfAbsconding ? formatDateDdMmYyyySlash(employee.dateOfAbsconding) : '&nbsp;&nbsp;&nbsp;-'}<br />Date of Discharge: ${employee.dateOfDischarge ? formatDateDdMmYyyySlash(employee.dateOfDischarge) : '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;-'}</div>`}
                  /> */}

                  <ReactTooltip
                    id={`status-tooltip-${employee.empId}`}
                    place="right"
                    className="z-50"
                  >
                    <div className="text-left">
                      <div>
                        Date of Posting:{' '}
                        {employee.dateOfPosting
                          ? formatDateDdMmYyyySlash(employee.dateOfPosting)
                          : '-'}
                      </div>

                      <div>
                        Date of Resignation:{' '}
                        {employee.dateOfResignation
                          ? formatDateDdMmYyyySlash(employee.dateOfResignation)
                          : '-'}
                      </div>

                      <div>
                        Date of Absconding:{' '}
                        {employee.dateOfAbsconding
                          ? formatDateDdMmYyyySlash(employee.dateOfAbsconding)
                          : '-'}
                      </div>

                      <div>
                        Date of Discharge:{' '}
                        {employee.dateOfDischarge
                          ? formatDateDdMmYyyySlash(employee.dateOfDischarge)
                          : '-'}
                      </div>
                    </div>
                  </ReactTooltip>
                </td>
                {/* date of posting */}
                <td className="table-td-existing-data">
                  {/* {formatDateDdMmYyyySlash(employee.dateOfPosting || '-')} */}
                  {employee.dateOfPosting ? (
                    formatDateDdMmYyyySlash(employee.dateOfPosting)
                  ) : (
                    <p className="text-center">-</p>
                  )}
                </td>
                {/* contact */}
                <td className="table-td-existing-data text-right">
                  {employee.phoneNum ? (
                    employee.phoneNum
                  ) : (
                    <p className="text-center">-</p>
                  )}
                </td>
                {/* action */}
                <td className="table-td-existing-data relative">
                  {/* <button
                    onClick={() => {
                      setActionModalIndex(
                        actionModalIndex === index ? null : index
                      );
                      setActionEmployeeId(employee.ID ? employee.ID : 0);
                      setActionEmplPostRankId(
                        employee.postRankLinkId ? employee.postRankLinkId : 0
                      );
                      setActionEmployeeName(
                        employee.empName ? employee.empName : ''
                      );
                    }}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <img
                      src={TableOptionsIcon}
                      alt="TableOptionsIcon"
                      className="w-4 "
                    />
                  </button> */}
                  <button
                    onClick={(e) => handleActionClick(e, employee, index)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <img
                      src={TableOptionsIcon}
                      alt="TableOptionsIcon"
                      className="w-4"
                    />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {actionModalIndex !== null && (
          <div
            ref={actionMenuRef}
            className="fixed z-50 bg-white border border-gray-300 shadow-lg"
            style={{
              top: `${menuPosition.top}px`,
              left: `${menuPosition.left}px`,
            }}
          >
            <button
              onClick={() => {
                setActionModalIndex(null);
                handleEdit(actionEmployeeId);
              }}
              className="action-menu-button"
            >
              <img src={EditPencil_Icon} alt="Edit" className="w-4 h-4" />
              <p className="text-responsive-table">Edit</p>
            </button>

            <button
              onClick={() => {
                setActionModalIndex(null);
                setShowDeleteModal(true);
              }}
              className="action-menu-button"
            >
              <img src={Delete_Icon} alt="Delete" className="w-4 h-4" />
              <p className="text-responsive-table">Delete</p>
            </button>

            <button
              onClick={() => {
                setActionModalIndex(null);
                setShowDischargeEmployeeModal(true);
              }}
              className={`action-menu-button ${
                actionEmployeeName === ''
                  ? 'opacity-50 pointer-events-none'
                  : ''
              }`}
            >
              <img src={EmpRemoveIcon} alt="Discharge" className="w-4 h-4" />
              <p className="text-responsive-table">Discharge</p>
            </button>

            <button
              onClick={() => {
                setActionModalIndex(null);
                setShowAbscondEmployeeModal(true);
              }}
              className={`action-menu-button ${
                actionEmployeeName === ''
                  ? 'opacity-50 pointer-events-none'
                  : ''
              }`}
            >
              <img src={Abscond_Icon} alt="Abscond" className="w-4 h-4" />
              <p className="text-responsive-table">Mark Abscond</p>
            </button>

            <button
              onClick={() => {
                setActionModalIndex(null);
                setShowResignEmployeeModal(true);
              }}
              className={`action-menu-button ${
                actionEmployeeName === ''
                  ? 'opacity-50 pointer-events-none'
                  : ''
              }`}
            >
              <img src={Resign_Icon} alt="Resign" className="w-4 h-4" />
              <p className="text-responsive-table">Mark Resign</p>
            </button>
            {/* Id card */}
            <button
              // onClick={() => setShowEmployeeIdCardModal(true)}
              onClick={() => {
                setActionModalIndex(null);
                setShowEmployeeIdCardModal(true);
              }}
              className={`action-menu-button ${
                actionEmployeeName === ''
                  ? 'opacity-50 pointer-events-none'
                  : ''
              }`}
            >
              <img src={Generate_ID_Icon} alt="Resign" className="w-4 h-4" />
              <p className="text-responsive-table">Generate ID Card</p>
            </button>
          </div>
        )}

        {showDeleteModal && (
          <ConfirmationModal
            confirmButtonTitle="Delete"
            cancelButtonTitle="Cancel"
            onConfirm={() => {
              handleDelete(actionEmployeeId);
            }}
            onCancel={() => setShowDeleteModal(false)}
            message={`Are you sure you want to delete the employee ${actionEmployeeName}?`}
          />
        )}
        {showResignEmployeeModal && (
          <EmployeeResignModal
            confirmButtonTitle="Mark Resign"
            cancelButtonTitle="Cancel"
            updateResignDate={handleUpdateDateOfResignation}
            onConfirm={(e) => {
              e.stopPropagation();
              e.preventDefault();
              handleResign(actionEmployeeId, actionEmplPostRankId);
            }}
            onCancel={() => setShowResignEmployeeModal(false)}
            message={`Are you sure the employee ${actionEmployeeName} has resigned from the current post?`}
          />
        )}
        {showAbscondEmployeeModal && (
          <EmployeeAbscondModal
            confirmButtonTitle="Mark Abscond"
            cancelButtonTitle="Cancel"
            updateAbscondDate={handleUpdateDateOfAbsconding}
            onConfirm={(e) => {
              e.stopPropagation();
              e.preventDefault();
              handleAbscond(actionEmployeeId, actionEmplPostRankId);
            }}
            onCancel={() => setShowAbscondEmployeeModal(false)}
            message={`Are you sure the employee ${actionEmployeeName} has absconded from the current post?`}
          />
        )}
        {showDischargeEmployeeModal && (
          <EmployeeDischargeModal
            confirmButtonTitle="Discharge"
            cancelButtonTitle="Cancel"
            updateDischargePostingDate={handleUpdateDischargeDate}
            onConfirm={(e) => {
              e.stopPropagation();
              e.preventDefault();
              handleDischarge(actionEmployeeId, actionEmplPostRankId);
            }}
            onCancel={() => setShowDischargeEmployeeModal(false)}
            message={`Are you sure you want to discharge the employee ${actionEmployeeName} from the current post?`}
          />
        )}
        {/* Id card */}
        {showEmployeeIdCardModal && selectedEmployeeData && (
          <EmployeeIdCardModal
            // onCancel={() => setShowEmployeeIdCardModal(false)}
            onCancel={() => {
              setShowEmployeeIdCardModal(false);
              setSelectedEmployeeData(null);
            }}
            // employee={selectedEmployeeData}
            employeeId={actionEmployeeId}
            // onConfirm={(e) => {
            //   e.stopPropagation();
            //   e.preventDefault();
            //   handleGenerateIdCard(actionEmployeeId);
            // }}
          />
        )}
      </div>
    </>
  );
};

export default EmployeesTable2;
