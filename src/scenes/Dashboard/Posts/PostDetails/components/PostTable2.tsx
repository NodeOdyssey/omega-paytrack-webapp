/* Libraries */
import React, { useEffect, useRef, useState } from 'react';
import axios, { AxiosError } from 'axios';
import { useNavigate } from 'react-router';
import { toast } from 'react-toastify';

/* Configs */
import { api } from '../../../../../configs/api';

/* Hooks */
import useVerifyUserAuth from '../../../../../hooks/useVerifyUserAuth';
import useClickOutside from '../../../../../hooks/useClickOutside';
// import useHorizontalScroll from '../../../../../hooks/useHorizontalScroll';
import useScrollToTop from '../../../../../hooks/useScrollToTop';
import useHandleYupError from '../../../../../hooks/useHandleYupError';
import useHandleAxiosError from '../../../../../hooks/useHandleAxiosError';

/* Types */
import { Post } from '../../../../../types/post';

/* Components */
import ConfirmationModal from '../../../../../common/Modal/ConfirmationModal';
import Loader from '../../../../../common/Loader/Loader';
import DatePickerComp from '../../../../../common/AttendanceDatePicker/DatePickerComp';

/* Assets */
import {
  DeactivateIcon,
  Delete_Icon,
  EditPencil_Icon,
  ReactivateIcon,
  TableOptionsIcon,
  Invoice_Icon,
} from '../../../../../assets/icons';

import { Tooltip } from 'react-tooltip';

/* Prop Types */
type PostsTableProps = {
  postsData: Post[];
  refreshPostsData: () => void;
};

type InvoiceAttendanceMode = 'DERIVE_ATTENDANCE' | 'FULL_ATTENDANCE';

type InvoiceStats = {
  postId: number;
  postName: string;
  month: number;
  year: number;
  employeeCount: number;
  monthDays: number;
  totalActualPresentDays: number;
  deriveTaxableValue: number;
  fullAttendanceTaxableValue: number;
  defaultGstRate: number;
  existingInvoice: {
    ID: number;
    invoiceNumber: string;
  } | null;
};

/* Post Table Main Component */
const PostTable2: React.FC<PostsTableProps> = ({
  postsData,
  refreshPostsData,
}) => {
  /* Scroll To Top */
  useScrollToTop();

  /* Verify User Auth */
  const accessToken = useVerifyUserAuth();

  /* Navigation */
  const navigate = useNavigate();

  /* Table Horizontal Scroll */
  // const tableRef = useHorizontalScroll();

  /* Loader */
  const [isLoading, setIsLoading] = useState(false);

  /* Error Handling */
  const { setErrors } = useHandleYupError();
  const { handleAxiosError } = useHandleAxiosError(setErrors);

  /* Table Action Modal Controls */
  const [actionModalIndex, setActionModalIndex] = useState<number | null>(null);
  const actionMenuRef = useRef<HTMLDivElement>(null);
  useClickOutside(actionMenuRef, () => setActionModalIndex(null));

  /* Edit and Delete Controls */
  const [currentRankId, setCurrentRankId] = useState<number>(0);
  const [currentRankName, setCurrentRankName] = useState<string>('');
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [showDeactivateModal, setShowDeactivateModal] =
    useState<boolean>(false);
  const [showReactivateModal, setShowReactivateModal] =
    useState<boolean>(false);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [showGenerateInvoiceModal, setShowGenerateInvoiceModal] =
    useState<boolean>(false);
  const [invoiceMonthYear, setInvoiceMonthYear] = useState<Date>(new Date());
  const [invoiceGstRate, setInvoiceGstRate] = useState<string>('18');
  const [invoiceAttendanceMode, setInvoiceAttendanceMode] =
    useState<InvoiceAttendanceMode>('DERIVE_ATTENDANCE');
  const [isInvoiceStatsLoading, setIsInvoiceStatsLoading] = useState(false);
  const [isGeneratingInvoice, setIsGeneratingInvoice] = useState(false);
  const [invoiceStats, setInvoiceStats] = useState<InvoiceStats | null>(null);

  const monthLabel = invoiceMonthYear.toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });

  const fetchInvoiceStats = async (postId: number, selectedDate: Date) => {
    if (!accessToken || !postId) return;

    const month = selectedDate.getMonth() + 1;
    const year = selectedDate.getFullYear();

    setIsInvoiceStatsLoading(true);
    try {
      const response = await axios.get(
        `${api.baseUrl}/invoices/stats/${postId}/${month}/${year}`,
        {
          headers: {
            'x-access-token': accessToken,
          },
        }
      );

      if (response.data?.success) {
        setInvoiceStats(response.data.stats);
        const defaultGstRate = response.data.stats?.defaultGstRate;
        if (typeof defaultGstRate === 'number') {
          setInvoiceGstRate(String(defaultGstRate));
        }
      }
    } catch (error) {
      setInvoiceStats(null);
      handleAxiosError(error as AxiosError);
    } finally {
      setIsInvoiceStatsLoading(false);
    }
  };

  const openGenerateInvoiceModal = async () => {
    if (!selectedPost?.ID) return;
    const currentDate = new Date();
    setInvoiceMonthYear(currentDate);
    setInvoiceAttendanceMode('DERIVE_ATTENDANCE');
    setInvoiceGstRate('18');
    setShowGenerateInvoiceModal(true);
    await fetchInvoiceStats(selectedPost.ID, currentDate);
  };

  const handleGenerateInvoice = async () => {
    if (!selectedPost?.ID || !accessToken) return;

    if (invoiceStats?.existingInvoice?.ID) {
      navigate(`/app/invoices/view?invoiceId=${invoiceStats.existingInvoice.ID}`);
      return;
    }

    const gstRate = Number(invoiceGstRate);
    if (!Number.isFinite(gstRate) || gstRate < 0 || gstRate > 100) {
      toast.error('GST rate must be between 0 and 100.');
      return;
    }

    setIsGeneratingInvoice(true);
    try {
      const response = await axios.post(
        `${api.baseUrl}/invoices/generate`,
        {
          postId: selectedPost.ID,
          month: invoiceMonthYear.getMonth() + 1,
          year: invoiceMonthYear.getFullYear(),
          attendanceMode: invoiceAttendanceMode,
          gstRate,
        },
        {
          headers: {
            'x-access-token': accessToken,
          },
        }
      );

      if (response.data?.success) {
        const invoiceId = response.data?.invoice?.invoiceId;
        toast.success(
          response.data.message || 'Invoice generated successfully.'
        );
        setShowGenerateInvoiceModal(false);
        if (invoiceId) {
          navigate(`/app/invoices/view?invoiceId=${invoiceId}`);
        }
      }
    } catch (error) {
      handleAxiosError(error as AxiosError);
    } finally {
      setIsGeneratingInvoice(false);
    }
  };

  useEffect(() => {
    if (!showGenerateInvoiceModal || !selectedPost?.ID) return;
    fetchInvoiceStats(selectedPost.ID, invoiceMonthYear);
  }, [invoiceMonthYear, showGenerateInvoiceModal, selectedPost?.ID]);

  const handleDelete = async (id: number) => {
    setIsLoading(true);
    try {
      const response = await axios.delete(`${api.baseUrl}/posts/${id}`, {
        headers: { 'x-access-token': accessToken },
      });
      if (response.data && response.data.success) {
        setShowDeleteModal(false);
        toast.success(response.data.message);
        refreshPostsData();
      }
    } catch (error) {
      handleAxiosError(error as AxiosError);
    } finally {
      setShowDeleteModal(false);
      setIsLoading(false);
    }
  };

  const handleEdit = (id: number) => {
    navigate(`/app/posts/edit-post?id=${id}`);
  };

  const handleDeactivate = async (id: number) => {
    if (!accessToken || !id) return;
    setIsLoading(true);
    try {
      const response = await axios.patch(
        `${api.baseUrl}/posts/${id}/deactivate`,
        {},
        {
          headers: { 'x-access-token': accessToken },
        }
      );
      if (response.data && response.data.success) {
        toast.success(response.data.message);
        refreshPostsData();
      }
    } catch (error) {
      handleAxiosError(error as AxiosError);
    } finally {
      setShowDeactivateModal(false);
      setIsLoading(false);
    }
  };

  const handleReactivate = async (id: number) => {
    if (!accessToken || !id) return;
    setIsLoading(true);
    try {
      const response = await axios.patch(
        `${api.baseUrl}/posts/${id}/reactivate`,
        {},
        {
          headers: { 'x-access-token': accessToken },
        }
      );
      if (response.data && response.data.success) {
        toast.success(response.data.message);
        refreshPostsData();
      }
    } catch (error) {
      handleAxiosError(error as AxiosError);
    } finally {
      setShowReactivateModal(false);
      setIsLoading(false);
    }
  };

  // action menu
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });

  const handleActionClick = (
    e: React.MouseEvent<HTMLButtonElement>,
    post: Post,
    index: number
  ) => {
    const button = e.currentTarget;
    const rect = button.getBoundingClientRect();

    setTimeout(() => {
      if (actionMenuRef.current) {
        const menuWidth = actionMenuRef.current.offsetWidth;
        setMenuPosition({
          top: rect.bottom + window.scrollY,
          left: rect.right + window.scrollX - menuWidth,
        });
      }
    }, 0);

    setActionModalIndex(index);
    setSelectedPost(post); // <-- THIS IS NEW
    setCurrentRankId(post.ID ?? 0);
    setCurrentRankName(post.postName);
  };

  /* JSX */
  return (
    <>
      {isLoading && <Loader />}
      <div
        // ref={tableRef}
        className="table-container"
      >
        <table
          id="postsTable"
          // className="bg-white w-full h-full table-fixed border-separate border-spacing-0"
          className="bg-white w-full h-full table-fixed border border-collapse"
        >
          <thead className="text-center text-primaryText sticky top-0 z-20 bg-tableHeadingColour border-none">
            <tr className="bg-tableHeadingColour">
              {/* <th className="text-left w-[25%]" rowSpan={2}>
                <div className="flex bg-blue-100 h-full w-full border border-black px-2 2xl:px-4 py-1 2xl:py-2 text-responsive-table items-center">
                  Post Name
                </div>
              </th> */}
              <th className="table-header w-[25%] text-left" rowSpan={2}>
                Post Name
              </th>
              <th className="table-header w-[9%]" rowSpan={2}>
                Contact Person
              </th>
              <th className="table-header w-[12%]" rowSpan={2}>
                GSTIN
              </th>
              <th className="table-header w-[12%]" rowSpan={2}>
                Service Location
              </th>
              <th className="table-header px-3 w-[7%]" rowSpan={2}>
                Contract Start Date
              </th>
              <th className="table-header w-[6%]" rowSpan={2}>
                Status
              </th>
              <th className="table-header px-1 w-[4%]" rowSpan={2}>
                Action
              </th>
            </tr>
          </thead>
          <tbody className="text-primaryText">
            {postsData.map((post: Post, index: number) => (
              <tr
                key={post.ID}
                className="hover:bg-gray-200 font-medium table-responsive-row-height"
              >
                {/* Post Name */}
                <td className="table-td-existing-data">
                  <button
                    className="items-start w-full text-left"
                    onClick={() => handleEdit(post.ID || 0)}
                    data-tooltip-id={`postName-tooltip-${index}`}
                    data-tooltip-content={post.postName || 'No Post Name'}
                  >
                    <p className="text-bgPrimaryButton hover:text-bgPrimaryButtonHover underline table-td-existing-data-overflow">
                      {post.postName || '-'}
                    </p>
                  </button>
                  <Tooltip id={`postName-tooltip-${index}`} place="bottom" />
                </td>
                {/* Contact Person */}
                <td className="table-td-existing-data text-left">
                  <div
                    data-tooltip-id={`contact-tooltip-${index}`}
                    data-tooltip-content={post.contactPerson}
                  >
                    {post.contactPerson ? (
                      <p className="break-words table-td-existing-data-overflow">
                        {post.contactPerson}
                      </p>
                    ) : (
                      <p className="text-center">-</p>
                    )}
                  </div>
                  <Tooltip
                    id={`contact-tooltip-${index}`}
                    place="bottom"
                    hidden={post.contactPerson ? false : true}
                  />
                </td>
                {/* GSTIN */}
                <td className="table-td-existing-data text-left">
                  <p className="table-td-existing-data-overflow">
                    {post.gstin}
                  </p>
                </td>
                {/* Service Location */}
                <td className="table-td-existing-data text-left">
                  <div
                    data-tooltip-id={`address-tooltip-${index}`}
                    data-tooltip-content={post.address}
                  >
                    {post.address ? (
                      // post.address
                      <p className="table-td-existing-data-overflow">
                        {post.address}
                      </p>
                    ) : (
                      <p className="text-center">-</p>
                    )}
                    <Tooltip
                      id={`address-tooltip-${index}`}
                      place="bottom"
                      hidden={post.address ? false : true}
                    />
                  </div>
                </td>
                {/* Contract Start Date */}
                <td className="table-td-existing-data ">
                  {new Date(post.contractDate).toLocaleDateString('en-GB', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                  })}
                </td>
                {/* Status */}
                <td className="table-td-existing-data overflow-hidden">
                  {/* {post.status} */}
                  {post.status === 'Active' ? (
                    <button className="bg-[#0C672B4D] text-[#0C672B] py-1 px-3 rounded-full font-medium">
                      Active
                    </button>
                  ) : (
                    <button className="bg-[#A1A1A1] text-white py-1 px-3 rounded-full font-medium text-responsive-table">
                      Inactive
                    </button>
                  )}
                </td>
                {/* Action */}
                <td className="table-td-existing-data relative">
                  <button
                    // onClick={() => {
                    //   setActionModalIndex(
                    //     actionModalIndex === index ? null : index
                    //   );
                    //   setCurrentRankId(post.ID ? post.ID : 0);
                    //   setCurrentRankName(post.postName);
                    // }}

                    onClick={(e) => handleActionClick(e, post, index)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <img
                      src={TableOptionsIcon}
                      alt="TableOptionsIcon"
                      className="w-4 h-4"
                    />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {actionModalIndex !== null && (
          <>
            <div
              ref={actionMenuRef}
              // className={`absolute right-[60%] ${actionModalIndex <= 2 ? 'top-[-75%] xl:top-[-85%]' : 'bottom-[10%] lg:bottom-[20%]'} w-24 md:w-28 lg:w-32 bg-white border border-gray-300 shadow-lg z-20`}
              className="fixed z-50 bg-white border border-gray-300 shadow-lg"
              style={{
                top: `${menuPosition.top}px`,
                left: `${menuPosition.left}px`,
              }}
            >
              {/* Edit Post */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleEdit(currentRankId);
                }}
                className="action-menu-button"
              >
                <img
                  src={EditPencil_Icon}
                  alt="EditPencil_Icon"
                  className="action-modal-responsive-icon"
                />
                <p className="text-responsive-table">Edit</p>
              </button>
              {/* Delete Post */}
              <button
                onClick={(event) => {
                  event.stopPropagation();
                  setShowDeleteModal(true);
                  setActionModalIndex(null);
                }}
                className="action-menu-button"
              >
                <img
                  src={Delete_Icon}
                  alt="Delete_Icon"
                  className="action-modal-responsive-icon"
                />
                <p className="text-responsive-table">Delete</p>
              </button>
              {/* Invoice */}
              <button
                onClick={(event) => {
                  event.stopPropagation();
                  setActionModalIndex(null);
                  openGenerateInvoiceModal();
                }}
                className="action-menu-button"
              >
                <img
                  src={Invoice_Icon}
                  alt="Invoice_Icon"
                  className="action-modal-responsive-icon"
                />
                <p className="text-responsive-table">Invoice</p>
              </button>
              {/* Deactivate / Reactivate Post */}
              {selectedPost?.status === 'Active' ? (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowDeactivateModal(true);
                    setActionModalIndex(null);
                  }}
                  className="action-menu-button"
                >
                  <img
                    src={DeactivateIcon}
                    alt="EditPencil_Icon"
                    className="action-modal-responsive-icon"
                  />
                  <p className="text-responsive-table">Deactivate</p>
                </button>
              ) : (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowReactivateModal(true);
                    setActionModalIndex(null);
                  }}
                  className="action-menu-button"
                >
                  <img
                    src={ReactivateIcon}
                    alt="EditPencil_Icon"
                    className="action-modal-responsive-icon"
                  />
                  <p className="text-responsive-table">Reactivate</p>
                </button>
              )}
            </div>
          </>
        )}
        {showDeleteModal && (
          <ConfirmationModal
            confirmButtonTitle="Delete"
            cancelButtonTitle="Cancel"
            onConfirm={() => {
              handleDelete(currentRankId);
            }}
            onCancel={() => setShowDeleteModal(false)}
            message={`Are you sure you want to delete the post ${currentRankName}?`}
          />
        )}
        {showDeactivateModal && (
          <ConfirmationModal
            confirmButtonTitle="Deactivate"
            cancelButtonTitle="Cancel"
            onConfirm={() => {
              handleDeactivate(currentRankId);
            }}
            onCancel={() => setShowDeactivateModal(false)}
            message={`Are you sure you want to deactivate the post ${currentRankName}? This will automatically discharge all the employees associated with the post.`}
          />
        )}
        {showReactivateModal && (
          <ConfirmationModal
            confirmButtonTitle="Reactivate"
            cancelButtonTitle="Cancel"
            onConfirm={() => {
              handleReactivate(currentRankId);
            }}
            onCancel={() => setShowReactivateModal(false)}
            message={`Are you sure you want to reactivate the post ${currentRankName}?`}
          />
        )}
        {showGenerateInvoiceModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
            <div className="w-full max-w-2xl rounded-md bg-white p-4 2xl:p-6 shadow-lg">
              <h2 className="text-lg 2xl:text-xl font-semibold text-primaryText">
                Invoice for {selectedPost?.postName || '-'} for the month of{' '}
                {monthLabel}
              </h2>

              <div className="mt-4 rounded-md border border-inputBorder bg-tableHeadingColour p-3 2xl:p-4">
                {isInvoiceStatsLoading ? (
                  <p className="text-sm text-primaryText">
                    Fetching invoice stats...
                  </p>
                ) : invoiceStats ? (
                  <div className="space-y-3">
                    {invoiceStats.existingInvoice && (
                      <div className="rounded-md border border-[#f4cf74] bg-[#fff7de] px-3 py-2">
                        <p className="text-xs font-medium text-[#8a6d1d]">
                          Invoice already exists for this period:
                        </p>
                        <p className="text-sm font-semibold text-[#8a6d1d]">
                          {invoiceStats.existingInvoice.invoiceNumber}
                        </p>
                      </div>
                    )}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 2xl:gap-4">
                      <div>
                        <p className="text-xs text-primaryText/70">Employees</p>
                        <p className="text-sm font-semibold text-primaryText">
                          {invoiceStats.employeeCount}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-primaryText/70">
                          Actual Present Days
                        </p>
                        <p className="text-sm font-semibold text-primaryText">
                          {invoiceStats.totalActualPresentDays}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-primaryText/70">
                          Derive Attendance Taxable Value
                        </p>
                        <p className="text-sm font-semibold text-primaryText">
                          Rs. {invoiceStats.deriveTaxableValue.toFixed(2)}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-primaryText/70">
                          Full Attendance Taxable Value
                        </p>
                        <p className="text-sm font-semibold text-primaryText">
                          Rs. {invoiceStats.fullAttendanceTaxableValue.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-red-600">
                    Unable to load invoice stats for this month.
                  </p>
                )}
              </div>

              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <p className="text-sm font-medium text-primaryText">
                    Invoice Month
                  </p>
                  <DatePickerComp
                    className="w-full h-full 2xl:h-full 2xl:w-full"
                    label="Select Month"
                    pickerMode="monthYear"
                    externalSelectedDate={invoiceMonthYear}
                    onChangeDate={setInvoiceMonthYear}
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-sm font-medium text-primaryText">
                    GST Rate (%)
                  </label>
                  <input
                    type="number"
                    min={0}
                    max={100}
                    step="0.01"
                    value={invoiceGstRate}
                    onChange={(e) => setInvoiceGstRate(e.target.value)}
                    className="w-full rounded-md border border-inputBorder px-3 py-2 text-sm outline-none focus:border-bgPrimaryButton"
                  />
                </div>
              </div>

              <div className="mt-4 rounded-md border border-inputBorder p-3 2xl:p-4">
                <p className="text-sm font-medium text-primaryText">
                  Attendance Strategy
                </p>
                <div className="mt-2 flex flex-col gap-2">
                  <label className="inline-flex items-center gap-2 text-sm text-primaryText">
                    <input
                      type="radio"
                      name="invoiceAttendanceMode"
                      checked={invoiceAttendanceMode === 'DERIVE_ATTENDANCE'}
                      onChange={() =>
                        setInvoiceAttendanceMode('DERIVE_ATTENDANCE')
                      }
                    />
                    Derive Attendance
                  </label>
                  <label className="inline-flex items-center gap-2 text-sm text-primaryText">
                    <input
                      type="radio"
                      name="invoiceAttendanceMode"
                      checked={invoiceAttendanceMode === 'FULL_ATTENDANCE'}
                      onChange={() =>
                        setInvoiceAttendanceMode('FULL_ATTENDANCE')
                      }
                    />
                    Full Attendance
                  </label>
                </div>
                <p className="mt-2 text-xs text-primaryText/70">
                  Derive Attendance uses existing payroll values for the
                  selected month. Full Attendance recomputes invoice billing by
                  considering full month attendance for all employees,
                  irrespective of actual present days.
                </p>
              </div>

              <div className="mt-6 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowGenerateInvoiceModal(false)}
                  className="px-4 py-2 rounded-md border border-inputBorder text-sm font-medium text-primaryText hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleGenerateInvoice}
                  disabled={
                    isGeneratingInvoice ||
                    isInvoiceStatsLoading ||
                    !invoiceStats
                  }
                  className="px-4 py-2 rounded-md bg-bgPrimaryButton text-sm font-medium text-white hover:bg-bgPrimaryButtonHover disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {invoiceStats?.existingInvoice?.ID
                    ? 'View Invoice'
                    : isGeneratingInvoice
                      ? 'Generating...'
                      : 'Generate'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default PostTable2;
