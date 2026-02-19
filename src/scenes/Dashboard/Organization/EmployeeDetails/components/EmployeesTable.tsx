// Libraries
import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router';
import axios from 'axios';
import { toast } from 'react-toastify';

// Assets
import {
  Abscond_Icon,
  Delete_Icon,
  EditPencil_Icon,
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
import { EmployeeStatus } from '../../../../../types/employee';

// Configs
import { api } from '../../../../../configs/api';
import useHorizontalScroll from '../../../../../hooks/useHorizontalScroll';
// import useHandleYupError from '../../../../../hooks/useHandleYupError';
// import useHandleAxiosError from '../../../../../hooks/useHandleAxiosError';
// import { ref } from 'yup';
import Loader from '../../../../../common/Loader/Loader';

// css
import '../../../../../App.css';

// Prop types
type EmployeesTableProps = {
  employeesData: EmployeeTable[];
  refreshEmployeesData: () => void;
};

const EmployeesTable: React.FC<EmployeesTableProps> = ({
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
  const tableRef = useHorizontalScroll();

  /* Loader */
  const [isLoading, setIsLoading] = useState(false);

  /* Error Handling */
  // const { setErrors } = useHandleYupError();
  // const { handleAxiosError } = useHandleAxiosError(setErrors);

  /** Table Action Modal Controls */
  const [actionModalIndex, setActionModalIndex] = useState<number | null>(null);
  const actionMenuRef = useRef<HTMLDivElement>(null);
  useClickOutside(actionMenuRef, () => setActionModalIndex(null));

  /** Edit and Delete Controls */
  const [currentEmployeeId, setCurrentEmployeeId] = useState<number>(0);
  const [currentRankName, setCurrentRankName] = useState<string>('');
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
        // window.location.reload();
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

  /** Update employee status */
  const updateEmployeeStatus = async (id: number, status: EmployeeStatus) => {
    if (!accessToken || !id || !status) {
      return;
    }
    try {
      setIsLoading(true);
      setActionModalIndex(null);

      const response = await axios.patch(
        `${api.baseUrl}/employees/status/${id}`,
        { status },
        { headers: { 'x-access-token': accessToken } }
      );
      if (response.data && response.data.success) {
        toast.success(response.data.message);
        refreshEmployeesData();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      // Type guard to check if the error is an AxiosError
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data.message);
      } else {
        console.error('Unexpected error:', error);
        toast.error('An unexpected error occurred.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // // Table scroll
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

  // JSX here
  return (
    <>
      {isLoading && <Loader />}
      <div
        ref={tableRef}
        className="relative overflow-x-auto overflow-y-auto whitespace-nowrap flex text-center border scrollbar border-opacity-40  scrollbar-thumb-scrollBarColor scrollbar-track-scrollBarBg"
      >
        <table
          id="employeesTable"
          className="bg-white border border-tableBorder min-w-[105%]"
        >
          <thead className="text-center text-primaryText border border-tableBorder sticky top-0 bg-tableHeadingColour z-10">
            <tr>
              <th
                className="p-2 border border-tableBorder w-[10%] text-xs md:text-sm xl:text-base"
                rowSpan={2}
              >
                Name
              </th>
              <th
                className="p-2 border border-tableBorder w-[10%] text-xs md:text-sm xl:text-base"
                rowSpan={2}
              >
                Employee Id
              </th>
              <th
                className="p-2 border border-tableBorder w-[10%] text-xs md:text-sm xl:text-base"
                rowSpan={2}
              >
                Posting
              </th>
              <th
                className="p-2 border border-tableBorder w-[10%] text-xs md:text-sm xl:text-base"
                rowSpan={2}
              >
                Rank
              </th>
              <th
                className="p-2 border border-tableBorder w-[10%] text-xs md:text-sm xl:text-base"
                rowSpan={2}
              >
                Gender
              </th>
              <th
                className="p-2 border border-tableBorder w-[10%] text-xs md:text-sm xl:text-base"
                rowSpan={2}
              >
                Status
              </th>
              <th
                className="p-2 border border-tableBorder w-[10%] text-xs md:text-sm xl:text-base"
                rowSpan={2}
              >
                Contact
              </th>
              <th
                className="p-2 border border-tableBorder w-[5%] text-xs md:text-sm xl:text-base"
                rowSpan={2}
              >
                Action
              </th>
            </tr>
          </thead>
          <tbody className="text-primaryText border border-tableBorder ">
            {employeesData.map((employee: EmployeeTable, index: number) => (
              <tr key={employee.ID} className="border border-tableBorder">
                <td className="p-2 border border-tableBorder w-[10%] text-xs lg:text-sm xl:text-base ">
                  <button onClick={() => handleEdit(employee.ID || 0)}>
                    {employee.empName || '---'}
                  </button>
                </td>
                <td className="p-2 border border-tableBorder w-[10%] text-xs lg:text-sm xl:text-base ">
                  {employee.empId || '---'}
                </td>
                <td className="p-2 border border-tableBorder w-[10%] text-xs lg:text-sm xl:text-base ">
                  {employee.postName || '---'}
                </td>
                <td className="p-2 border border-tableBorder w-[10%] text-xs lg:text-sm xl:text-base ">
                  {employee.rank || '---'}
                </td>
                <td className="p-2 border border-tableBorder w-[10%] text-xs lg:text-sm xl:text-base ">
                  {employee.gender || '---'}
                </td>
                {/* <td className="p-2 border border-tableBorder w-[10%] text-xs lg:text-sm xl:text-base ">
                  {employee.empStatus === 'Active' ? (
                    <button className="bg-[#0C672B4D] text-[#0C672B] py-1 px-4 rounded-full font-medium text-xs md:text-sm xl:text-base">
                      {employee.empStatus}
                    </button>
                  ) : (
                    <button className="bg-[#A1A1A1] text-white py-1 px-4 rounded-full font-medium text-xs md:text-sm xl:text-base">
                      {employee.empStatus}
                    </button>
                  )}
                </td> */}
                <td className="p-2 border border-tableBorder w-[10%] text-xs lg:text-sm xl:text-base">
                  {employee.empStatus === 'Active' ? (
                    <button className="bg-[#0C672B4D] text-[#0C672B] py-1 px-4 rounded-full font-medium text-xs md:text-sm xl:text-base">
                      {employee.empStatus}
                    </button>
                  ) : employee.empStatus === 'Discharged' ? (
                    <button className="bg-[#a7a7a7] text-[#4a4a4a] py-1 px-4 rounded-full font-medium text-xs md:text-sm xl:text-base">
                      {employee.empStatus}
                    </button>
                  ) : employee.empStatus === 'Absconded' ? (
                    <button className="bg-[#eaa9a9] text-[#ad1a1a] py-1 px-4 rounded-full font-medium text-xs md:text-sm xl:text-base">
                      {employee.empStatus}
                    </button>
                  ) : employee.empStatus === 'Resigned' ? (
                    <button className="bg-[#afb0e7] text-[#3538cd] py-1 px-4 rounded-full font-medium text-xs md:text-sm xl:text-base">
                      {employee.empStatus}
                    </button>
                  ) : (
                    <button className="bg-[#A1A1A1] text-white py-1 px-4 rounded-full font-medium text-xs md:text-sm xl:text-base">
                      {employee.empStatus}
                    </button>
                  )}
                </td>
                <td className="p-2 border border-tableBorder w-[10%] text-xs lg:text-sm xl:text-base ">
                  {employee.phoneNum || '---'}
                </td>

                <td className="p-2 border border-tableBorder w-[5%] text-xs lg:text-sm xl:text-base relative">
                  <button
                    onClick={() => {
                      setActionModalIndex(
                        actionModalIndex === index ? null : index
                      );
                      setCurrentEmployeeId(employee.ID ? employee.ID : 0);
                      setCurrentRankName(employee.empName);
                    }}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <img
                      src={TableOptionsIcon}
                      alt="TableOptionsIcon"
                      className="w-4 lg:w-5 h-4 lg:h-5"
                    />
                  </button>
                  {actionModalIndex === index && (
                    <>
                      <div className="absolute inset-0 bg-black opacity-50 pointer-events-none"></div>
                      <div
                        ref={actionMenuRef}
                        className={`absolute right-[60%] ${employeesData.length === 1 ? 'bottom-[0%] lg:bottom-[0%]' : actionModalIndex <= 1 ? '' : 'bottom-[10%] lg:bottom-[20%]'} ${employeesData.length === 2 && actionModalIndex === 0 ? 'bottom-[-10%] lg:bottom-[-10%]' : ''} w-36 md:w-40 lg:w-44 bg-white border border-gray-300 shadow-lg z-10`}
                      >
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEdit(currentEmployeeId);
                          }}
                          className="flex gap-2 items-center w-full px-2 lg:px-4 py-2 text-xs md:text-sm lg:text-base primaryLabels text-secondaryText hover:bg-smallMenuHover"
                        >
                          <img
                            src={EditPencil_Icon}
                            alt="EditPencil_Icon"
                            className="w-3 h-3 lg:w-4 lg:h-4"
                          />
                          <span>Edit</span>
                        </button>
                        <button
                          onClick={(event) => {
                            event.stopPropagation();
                            setShowDeleteModal(true);
                          }}
                          className="flex gap-2 items-center w-full px-2  lg:px-4 py-2 text-xs md:text-sm lg:text-base primaryLabels text-secondaryText hover:bg-smallMenuHover"
                        >
                          <img
                            src={Delete_Icon}
                            alt="Delete_Icon"
                            className="w-3 h-3 lg:w-4 lg:h-4"
                          />
                          <span>Delete</span>
                        </button>
                        <button
                          onClick={(event) => {
                            event.stopPropagation();
                            updateEmployeeStatus(
                              currentEmployeeId,
                              EmployeeStatus.ABSCONDED
                            );
                          }}
                          className="flex gap-2 items-center w-full px-2  lg:px-4 py-2 text-xs md:text-sm lg:text-base primaryLabels text-secondaryText hover:bg-smallMenuHover"
                        >
                          <img
                            src={Abscond_Icon}
                            alt="Delete_Icon"
                            className="w-3 h-3 lg:w-4 lg:h-4"
                          />
                          <span>Mark Abscond</span>
                        </button>
                        <button
                          onClick={(event) => {
                            event.stopPropagation();
                            updateEmployeeStatus(
                              currentEmployeeId,
                              EmployeeStatus.RESIGNED
                            );
                          }}
                          className="flex gap-2 items-center w-full px-2  lg:px-4 py-2 text-xs md:text-sm lg:text-base primaryLabels text-secondaryText hover:bg-smallMenuHover"
                        >
                          <img
                            src={Resign_Icon}
                            alt="Delete_Icon"
                            className="w-3 h-3 lg:w-4 lg:h-4"
                          />
                          <span>Mark Resign</span>
                        </button>
                      </div>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {showDeleteModal && (
          <ConfirmationModal
            confirmButtonTitle="Delete"
            cancelButtonTitle="Cancel"
            onConfirm={() => {
              handleDelete(currentEmployeeId);
            }}
            onCancel={() => setShowDeleteModal(false)}
            message={`Are you sure you want to delete the employee ${currentRankName}?`}
          />
        )}
      </div>
    </>
  );
};

export default EmployeesTable;
