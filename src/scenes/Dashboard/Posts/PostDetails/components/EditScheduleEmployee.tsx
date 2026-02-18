// Libraries
import React, { useEffect, useRef, useState } from 'react';

import axios, { AxiosError } from 'axios';
import { toast } from 'react-toastify';
import * as Yup from 'yup';

// Configs
import { api } from '../../../../../configs/api';

// Types
// import { Post } from '../../../../../types/post';
import { Employee } from '../../../../../types/employee';
import { PostRankLink } from '../../../../../types/postRankLink';
import { EmpPostRankLink, Status } from '../../../../../types/empPostRankLink';

// Hooks
import useVerifyUserAuth from '../../../../../hooks/useVerifyUserAuth';
import useScrollToTop from '../../../../../hooks/useScrollToTop';
import useClickOutside from '../../../../../hooks/useClickOutside';
import useHandleYupError from '../../../../../hooks/useHandleYupError';
import useHandleAxiosError from '../../../../../hooks/useHandleAxiosError';

// Helpers
import {
  formatDateDdMmYyyySlash,
  // formatDateToYMD,
  // getFormattedDateDdMmYyyyDash,
  getFormattedDateYyyyMmDdDash,
} from '../../../../../utils/formatter';

// Components

import Accordion from '../../../../../common/Accordion/Accordion';

import SmallButton from '../../../../../common/Button/SmallButton';

import EmployeeTransferModal from '../../../../../common/Modal/EmployeeTransferModal';
import Loader from '../../../../../common/Loader/Loader';
import CustomEmployeeDropDown from '../../../../../common/CustomEployeeDropDown/CustomEmployeeDropDown';

// Assets
import {
  Delete_Icon,
  Plus_Black,
  TableOptionsIcon,
  EmpRemoveIcon,
  EmpTransferIcon,
  Promote_Icon,
} from '../../../../../assets/icons';
import EmployeeDischargeModal from '../../../../../common/Modal/EmployeeDischargeModal';
// import PostSelectDropdown from '../../../../../common/DropDownInput/PostSelectDropdown';
import ConfirmationModal from '../../../../../common/Modal/ConfirmationModal';
import EmployeePromoteModal from '../../../../../common/Modal/EmployeePromoteModal';

// Types
interface ExistingScheduledEmployees {
  ID: number & { __brand: 'unique' };
  empTableId: number;
  empId: string;
  empName: string;
  rank: string;
  postRankLinkId: number;
  dateOfPosting: Date | null;
  status: Status;
  dateOfDischarge: Date | null;
  dateOfTransfer: Date | null;
  transferredFrom: string;
  transferredTo: string;
  dateOfPromotion: Date | null;
  promotedFrom: string;
  promotedTo: string;
  dateOfResignation: Date | null;
  dateOfAbsconding: Date | null;
  dateOfRejoining: Date | null;
}

// Define initial row data
const defaultScheduleRowData: EmpPostRankLink = {
  empTableId: 0,
  postRankLinkId: 0,
  dateOfPosting: null,
  // dateOfPosting: new Date('2000-01-01'),
  status: Status.INACTIVE,
};

// Validation schema for schedule employee data row
const scheduleEmployeeValidationSchema = Yup.object().shape({
  empTableId: Yup.number()
    .min(1, 'Please select an employee')
    .required('Please select an employee'),
  postRankLinkId: Yup.number()
    .min(1, 'Please select a rank')
    .required('Please select a rank'),
  dateOfPosting: Yup.date()
    .required('Please enter the date of posting')
    .test('not-2000', 'Please select a valid date of posting', (value) => {
      return value && value.getFullYear() !== 2000;
    }),
});

interface EditScheduleEmployeeProps {
  postId: number;
  postName: string;
  refreshData: boolean;
  resetRefreshData: () => void;
  //   existingScheduledEmployees: ExistingScheduledEmployees[];
  //   setExistingScheduledEmployees: React.Dispatch<
  //     React.SetStateAction<ExistingScheduledEmployees[]>
  //   >;
  //   setPostName: React.Dispatch<React.SetStateAction<string>>;
}

const EditScheduleEmployee: React.FC<EditScheduleEmployeeProps> = ({
  postId,
  //   postName,
  refreshData,
  resetRefreshData,
}) => {
  /* Scroll To Top */
  useScrollToTop();

  /* Verify User Auth */
  const accessToken = useVerifyUserAuth();

  /* Navigation */

  /* Loader */
  const [isLoading, setIsLoading] = useState(false);

  /* Check for postId in url params */
  //   const urlParams = new URLSearchParams(window.location.search);
  //   const postId = urlParams.get('postId');

  useEffect(() => {
    if (postId) {
      setCurrentSelectedPostId(Number(postId));
    }
  }, [postId]);

  useEffect(() => {
    if (refreshData) {
      console.log('refreshing schedule employee data');
      fetchPostRanks();
      resetRefreshData();
    }
  }, [refreshData]);
  /** Post Data and Controls for case when post is already known */
  //   const [postName, setPostName] = useState<string>('');

  //   const fetchPostData = async () => {
  //     if (!postId || !accessToken) return;
  //     setIsLoading(true);
  //     try {
  //       const response = await axios.get(`${api.baseUrl}/posts/${postId}`, {
  //         headers: {
  //           'x-access-token': accessToken,
  //         },
  //       });
  //       if (response.data.success) {
  //         setPostName(response.data.post.postName);
  //       }
  //     } catch (error) {
  //       if (error instanceof Yup.ValidationError) {
  //         handleYupError(error);
  //       } else {
  //         handleAxiosError(error as AxiosError);
  //       }
  //     } finally {
  //       setIsLoading(false);
  //     }
  //   };

  //   useEffect(() => {
  //     if (!postId || !accessToken) return;
  //     fetchPostData();
  //   }, [postId, accessToken]);

  /* Post Data and Controls for case when post is not known */
  //   const [allPostsData, setAllPostsData] = useState<Post[]>([]);
  const [currentSelectedPostId, setCurrentSelectedPostId] = useState<number>(0);

  //   const fetchPosts = async () => {
  //     if (!accessToken || postId) return;
  //     try {
  //       const response = await axios.get(`${api.baseUrl}${api.posts}`, {
  //         headers: { 'x-access-token': accessToken },
  //       });
  //       if (response.data && response.data.success) {
  //         setAllPostsData(response.data.posts);
  //       }
  //     } catch (error) {
  //       if (error instanceof Yup.ValidationError) {
  //         handleYupError(error);
  //       } else {
  //         if (error instanceof AxiosError && error.response?.status === 404) {
  //           toast.error('No posts found. Please add a post first.');
  //         }
  //         handleAxiosError(error as AxiosError);
  //       }
  //     } finally {
  //       setIsLoading(false);
  //     }
  //   };

  //   useEffect(() => {
  //     fetchPosts();
  //   }, [accessToken]);

  //   const updateSelectPost = (postId: number) => {
  //     setExistingScheduledEmployeesData([]);
  //     setCurrentSelectedPostId(postId);
  //   };

  /** Employee Data and Controls */
  const [allEmployeesData, setAllEmployeesData] = useState<Employee[]>([]);

  const fetchEmployees = async () => {
    if (!accessToken) return;
    try {
      const response = await axios.get(`${api.baseUrl}${api.employees}`, {
        headers: { 'x-access-token': accessToken },
      });
      if (response.data && response.data.success) {
        setAllEmployeesData(response.data.employees);
      }
    } catch (error) {
      if (error instanceof Yup.ValidationError) {
        handleYupError(error);
      } else {
        if (error instanceof AxiosError && error.response?.status === 404) {
          toast.error('No employees found. Please add an employee first.');
        }
        handleAxiosError(error as AxiosError);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, [accessToken]);

  /** Post Rank Link Data and Controls */
  const [allPostRanksData, setAllPostRanksData] = useState<PostRankLink[]>([]);

  const fetchPostRanks = async () => {
    if (!accessToken) return;
    try {
      const response = await axios.get(
        `${api.baseUrl}/posts/${currentSelectedPostId}/link-rank`,
        {
          headers: { 'x-access-token': accessToken },
        }
      );
      if (response.data && response.data.success) {
        setAllPostRanksData(response.data.postRankLinks);
      }
    } catch (error) {
      if (error instanceof Yup.ValidationError) {
        handleYupError(error);
      } else {
        if (error instanceof AxiosError && error.response?.status === 404) {
          toast.error(
            'No ranks available for this post. Please add ranks first.'
          );
          setAllPostRanksData([]);
        }
        handleAxiosError(error as AxiosError);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!currentSelectedPostId) return;
    fetchPostRanks();
  }, [accessToken, currentSelectedPostId]);

  /** Schedule Employee Data and Controls */
  const [scheduleEmployeesData, setScheduleEmployeesData] = useState<
    EmpPostRankLink[]
  >([defaultScheduleRowData]);
  const [existingScheduledEmployeesData, setExistingScheduledEmployeesData] =
    useState<ExistingScheduledEmployees[]>([]);
  // const [selectedEmployeeIds, setSelectedEmployeeIds] = useState<number[]>([]);
  const [showPostingHistory, setShowPostingHistory] = useState<boolean>(false);
  const [showConfirmTransferModal, setShowConfirmTransferModal] =
    useState<boolean>(false);
  const [confirmWarningEmployeeId, setConfirmWarningEmployeeId] =
    useState<number>(0);

  const fetchExistingScheduleEmployees = async () => {
    if (!accessToken || !currentSelectedPostId) return;
    setIsLoading(true);
    try {
      const response = await axios.get(
        `${api.baseUrl}/empPostRankLinks/${currentSelectedPostId}`,
        {
          headers: { 'x-access-token': accessToken },
        }
      );
      if (response.data && response.data.success) {
        setExistingScheduledEmployeesData(response.data.empPostRankLinks);
        // console.log(
        //   'existingScheduledEmployeesData: ',
        //   existingScheduledEmployeesData
        // );
      }
    } catch (error) {
      if (error instanceof Yup.ValidationError) {
        handleYupError(error);
      } else {
        if (error instanceof AxiosError && error.response?.status === 404) {
          setExistingScheduledEmployeesData([]);
        } else {
          handleAxiosError(error as AxiosError);
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelTransferWarningModal = () => {
    const newRows = [...scheduleEmployeesData];
    const updatedRows = newRows.filter(
      (empPostRank) => empPostRank.empTableId !== confirmWarningEmployeeId
    );

    if (updatedRows.length === 0) {
      setScheduleEmployeesData([defaultScheduleRowData]);
    } else {
      setScheduleEmployeesData([...updatedRows, defaultScheduleRowData]);
    }

    setShowConfirmTransferModal(false);
  };

  useEffect(() => {
    if (!currentSelectedPostId) return;
    fetchExistingScheduleEmployees();
  }, [accessToken, currentSelectedPostId]);

  useEffect(() => {
    if (!currentSelectedPostId) return;
    setScheduleEmployeesData([defaultScheduleRowData]);
  }, [currentSelectedPostId]);

  const handleSubmitScheduleEmployees = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setIsLoading(true);

    if (
      !scheduleEmployeesData ||
      !scheduleEmployeesData.length ||
      !accessToken ||
      !currentSelectedPostId
    )
      return;

    let hasErrors = false;
    const newErrors: string[] = [];

    for (let i = 0; i < scheduleEmployeesData.length; i++) {
      try {
        await scheduleEmployeeValidationSchema.validate(
          scheduleEmployeesData[i],
          {
            abortEarly: false,
          }
        );
      } catch (error) {
        if (error instanceof Yup.ValidationError) {
          hasErrors = true;
          error.inner.forEach((err) => {
            if (err.message) newErrors.push(err.message);
          });
        }
      }
    }

    if (hasErrors) {
      setErrors({ error: newErrors[0] });
      toast.error('Please fill all required fields.');
      setIsLoading(false);
      return;
    } else {
      setErrors({});
      try {
        for (const empPostRank of scheduleEmployeesData) {
          const empPostRankLinkData: EmpPostRankLink = {
            postRankLinkId: empPostRank.postRankLinkId,
            empTableId: empPostRank.empTableId,
            dateOfPosting: empPostRank.dateOfPosting,
          };
          const response = await axios.post(
            `${api.baseUrl}/emp/${empPostRankLinkData.empTableId}/link-postrank/${empPostRankLinkData.postRankLinkId}`,
            empPostRankLinkData,
            { headers: { 'x-access-token': accessToken } }
          );
          if (response.data && response.data.success) {
            toast.success(response.data.message);
            fetchExistingScheduleEmployees();
            fetchEmployees(); //TODO: This is done to update color status. Can we optimize this?
          }
        }
      } catch (error) {
        if (error instanceof Yup.ValidationError) {
          handleYupError(error);
        } else {
          if (error instanceof AxiosError && error.response?.status === 400) {
            toast.error(error.response.data.message);
          }
          handleAxiosError(error as AxiosError);
        }
      } finally {
        setIsLoading(false);
        setScheduleEmployeesData([defaultScheduleRowData]);
      }
    }
  };

  /** Transfer and Discharge Employee Controls */
  const [showDischargeEmployeeModal, setShowDischargeEmployeeModal] =
    useState<boolean>(false);
  const [showTransferEmployeeModal, setShowTransferEmployeeModal] =
    useState<boolean>(false);
  const [actionEmployeeId, setActionEmployeeId] = useState<number>(0);
  const [actionPostRankId, setActionPostRankId] = useState<number>(0);
  const [actionEmployeeName, setActionEmployeeName] = useState<string>('');

  const [transferPostRankId, setTransferPostRankId] = useState<number>(0);
  const [transferPostingDate, setTransferPostingDate] = useState<Date | null>(
    null
  );
  const [dischargePostingDate, setDischargePostingDate] = useState<Date | null>(
    null
  );

  const handleTransfer = async (empTableID: number) => {
    if (!accessToken || !transferPostRankId || !transferPostingDate) return;
    setIsLoading(true);
    try {
      const response = await axios.patch(
        `${api.baseUrl}/emp/${empTableID}/transfer/${transferPostRankId}`,
        { dateOfPosting: transferPostingDate },
        { headers: { 'x-access-token': accessToken } }
      );
      if (response.data && response.data.success) {
        toast.success(response.data.message);
        fetchExistingScheduleEmployees();
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
      setShowTransferEmployeeModal(false);
      setScheduleEmployeesData([defaultScheduleRowData]);
    }
  };
  const handleDischarge = async (
    empTableID: number,
    postRankLinkID: number
  ) => {
    if (!accessToken || !dischargePostingDate) return;
    setIsLoading(true);
    try {
      const response = await axios.delete(
        `${api.baseUrl}/emp/${empTableID}/unlink-postrank/${postRankLinkID}/${new Date(dischargePostingDate).toISOString() as string}`,
        { headers: { 'x-access-token': accessToken } }
      );
      if (response.data && response.data.success) {
        toast.success(response.data.message);
        fetchExistingScheduleEmployees();
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
      setScheduleEmployeesData([defaultScheduleRowData]);
    }
  };
  const handleUpdateTransferPostRank = async (newPostRankLinkId: number) => {
    setTransferPostRankId(newPostRankLinkId);
  };

  const handleUpdateTransferPostingDate = (newPostingDate: Date | null) => {
    setTransferPostingDate(newPostingDate);
  };

  const handleUpdateDischargePostingDate = (newPostingDate: Date | null) => {
    setDischargePostingDate(newPostingDate);
  };

  /** Promote Employee Controls */
  const [showPromoteEmployeeModal, setShowPromoteEmployeeModal] =
    useState<boolean>(false);
  const [promotePostRankId, setPromotePostRankId] = useState<number | null>(
    null
  );
  const [promotePostingDate, setPromotePostingDate] = useState<Date | null>(
    null
  );
  const handleUpdatePromotePostingDate = (newPostingDate: Date | null) => {
    setPromotePostingDate(newPostingDate);
  };
  const handleUpdatePromotePostRank = async (newPostRankLinkId: number) => {
    setPromotePostRankId(newPostRankLinkId);
  };

  const handlePromote = async (empTableID: number) => {
    if (!accessToken || !promotePostRankId || !promotePostingDate) return;
    setIsLoading(true);
    try {
      const response = await axios.patch(
        `${api.baseUrl}/emp/${empTableID}/promote/${promotePostRankId}`,
        { dateOfPromotion: promotePostingDate },
        { headers: { 'x-access-token': accessToken } }
      );
      if (response.data && response.data.success) {
        toast.success(response.data.message);
        fetchExistingScheduleEmployees();
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
      setShowPromoteEmployeeModal(false);
      setScheduleEmployeesData([defaultScheduleRowData]);
    }
  };

  /** Table Action Modal Controls */
  const [actionModalIndex, setActionModalIndex] = useState<number | null>(null);
  const actionMenuRef = useRef<HTMLDivElement>(null);
  useClickOutside(actionMenuRef, () => setActionModalIndex(null));

  /* Error Handling */
  const { errors, handleYupError, setErrors } = useHandleYupError();
  const { handleAxiosError } = useHandleAxiosError(setErrors);

  const handleRowDataChange = (
    index: number,
    field: keyof EmpPostRankLink,
    value: string | number
  ) => {
    const updatedData = [...scheduleEmployeesData];

    if (field === 'empTableId' && typeof value === 'number') {
      const selectedEmployee = allEmployeesData.find((emp) => emp.ID === value);
      if (selectedEmployee && selectedEmployee.isPosted) {
        setConfirmWarningEmployeeId(value);
        setShowConfirmTransferModal(true);
      }
    }

    if (field === 'dateOfPosting' && typeof value === 'string') {
      const date = new Date(value);
      updatedData[index] = { ...updatedData[index], [field]: date };
    } else {
      updatedData[index] = {
        ...updatedData[index],
        [field]: value,
      };
    }

    setScheduleEmployeesData(updatedData);
  };

  const handleAddRow = () => {
    setScheduleEmployeesData([
      ...scheduleEmployeesData,
      defaultScheduleRowData,
    ]);
  };

  const isAddMoreRowsAllowed = () => {
    if (scheduleEmployeesData.length === 0) return true;
    const lastRow = scheduleEmployeesData[scheduleEmployeesData.length - 1];
    return (
      lastRow &&
      lastRow.empTableId !== 0 &&
      lastRow.postRankLinkId !== 0 &&
      lastRow.dateOfPosting?.getFullYear() !== 2000
    );
  };
  const handleRemoveRow = (index: number) => {
    setErrors({});
    const newRows = [...scheduleEmployeesData];
    // const removedRow = newRows[index];
    newRows.splice(index, 1);
    setScheduleEmployeesData(newRows);
  };

  // Test useEffect
  useEffect(() => {
    console.log('schedule employees data: ', scheduleEmployeesData);
    console.log(
      'existing schedule employees: ',
      existingScheduledEmployeesData
    );
  });

  // action menu position
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });

  const handleActionClick = (
    e: React.MouseEvent<HTMLButtonElement>,
    row: ExistingScheduledEmployees,
    index: number
  ) => {
    const button = e.currentTarget;
    const rect = button.getBoundingClientRect();

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
    // setCurrentRankId(rank.ID ?? 0);
    // setCurrentRankName(rank.designation);
    setActionEmployeeId(row.empTableId ?? 0);
    setActionPostRankId(row.postRankLinkId ?? 0);
    setActionEmployeeName(row.empName ?? '');
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

  // JSX here
  return (
    <>
      {isLoading && <Loader />}

      <div className="z-10 overflow-y-auto  scrollbar scrollbar-thumb-scrollBarColor scrollbar-track-scrollBarBg">
        <form
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              handleSubmitScheduleEmployees(e);
            }
          }}
          className="bg-white "
        >
          {/* <div className="px-8 flex flex-col gap-4 mt-2 mb-4">
            <h2 className="primaryHeadings text-primaryText">Post Name</h2>
            <div>
              {postId ? (
                <div className="flex items-center justify-between w-1/3 max-w-64 p-4 rounded-lg bg-gray-50 border border-gray-300">
                  {postName}
                </div>
              ) : (
                <PostSelectDropdown
                  label="Select"
                  posts={allPostsData || []}
                  onChangePost={updateSelectPost}
                />
              )}
            </div>
            <div className="flex items-center justify-between w-1/3 max-w-64 p-4 rounded-lg bg-gray-50 border border-gray-300">
              {postName}
            </div>
          </div> */}
          {/* Table */}
          <Accordion title="Employee Schedule">
            <div className="flex flex-col gap-0.5 2xl:gap-2 max-h-[46.8vh] relative">
              {/* total employee & show posting history */}

              {/* total employee */}
              <div className="flex justify-between items-center mb-1 2xl:mb-2">
                {/* total employee */}
                {currentSelectedPostId !== 0 ? (
                  <div className="flex gap-1 2xl:gap-2">
                    <h2 className="text-responsive-label text-primaryText font-medium">
                      Total Employees:
                    </h2>
                    <p className="text-responsive-label text-primaryText font-medium">
                      {existingScheduledEmployeesData
                        .map((emp) => (emp.status === Status.ACTIVE ? 1 : 0))
                        .reduce((acc: number, curr: number) => acc + curr, 0)}
                    </p>
                  </div>
                ) : (
                  <div></div>
                )}
                {/* show posting history */}
                <div className="flex items-center gap-1">
                  <input
                    type="checkbox"
                    id="showPostHistory"
                    name="showPostHistory"
                    checked={showPostingHistory}
                    onChange={(e) => setShowPostingHistory(e.target.checked)}
                    className="cursor-pointer w-[11px] h-[11px] 2xl:w-3 2xl:h-3"
                  />
                  <label
                    htmlFor="showPostHistory"
                    className="text-responsive-label text-primaryText font-medium"
                  >
                    Show schedule history
                  </label>
                </div>
              </div>
              {/* table */}
              <div className="flex text-center overflow-x-auto border scrollbar border-opacity-40  scrollbar-thumb-scrollBarColor scrollbar-track-scrollBarBg">
                <table className="min-w-full bg-white border border-accordionBg scrollbar-thumb-scrollBarColor scrollbar-track-scrollBarBg">
                  <thead className="text-center text-primaryText border border-accordionBg sticky top-0 z-20">
                    <tr className="bg-tableHeadingColour">
                      <th
                        className={`emp-posting-table-th padding-y-responsive-table-header ${showPostingHistory ? 'w-[30%]' : 'w-[10%]'}`}
                        rowSpan={2}
                      >
                        Emp Id
                      </th>
                      <th
                        className="py-3 pl-[1%] text-left emp-posting-table-th w-[10%]"
                        rowSpan={2}
                      >
                        Employee Name
                      </th>
                      <th
                        className={`emp-posting-table-th padding-y-responsive-table-header ${showPostingHistory ? 'w-[90%]' : 'w-[10%]'}`}
                        rowSpan={2}
                      >
                        Rank
                      </th>
                      <th
                        className="emp-posting-table-th padding-y-responsive-table-header w-[2%]"
                        rowSpan={2}
                      >
                        Date of Posting
                      </th>
                      <th
                        className="emp-posting-table-th padding-y-responsive-table-header w-[10%]"
                        rowSpan={2}
                      >
                        Status
                      </th>
                      {showPostingHistory && (
                        <th
                          className="emp-posting-table-th padding-y-responsive-table-header w-[10%]"
                          rowSpan={2}
                        >
                          Previous Posting
                        </th>
                      )}
                      {showPostingHistory && (
                        <th
                          className="emp-posting-table-th padding-y-responsive-table-header w-[10%]"
                          rowSpan={2}
                        >
                          Transferred To
                        </th>
                      )}
                      {showPostingHistory && (
                        <th
                          className="emp-posting-table-th padding-y-responsive-table-header w-[10%]"
                          rowSpan={2}
                        >
                          Date of Transfer
                        </th>
                      )}
                      {showPostingHistory && (
                        <th
                          className="emp-posting-table-th padding-y-responsive-table-header w-[10%]"
                          rowSpan={2}
                        >
                          Date of Discharge
                        </th>
                      )}
                      {showPostingHistory && (
                        <th
                          className="emp-posting-table-th padding-y-responsive-table-header w-[10%]"
                          rowSpan={2}
                        >
                          Promoted To
                        </th>
                      )}
                      {showPostingHistory && (
                        <th
                          className="emp-posting-table-th padding-y-responsive-table-header w-[10%]"
                          rowSpan={2}
                        >
                          Promoted From
                        </th>
                      )}
                      {showPostingHistory && (
                        <th
                          className="emp-posting-table-th padding-y-responsive-table-header w-[10%]"
                          rowSpan={2}
                        >
                          Date of Promotion
                        </th>
                      )}
                      {showPostingHistory && (
                        <th
                          className="emp-posting-table-th padding-y-responsive-table-header w-[10%]"
                          rowSpan={2}
                        >
                          Date of Resignation
                        </th>
                      )}
                      {showPostingHistory && (
                        <th
                          className="emp-posting-table-th padding-y-responsive-table-header w-[10%]"
                          rowSpan={2}
                        >
                          Date of Absconding
                        </th>
                      )}
                      {showPostingHistory && (
                        <th
                          className="emp-posting-table-th padding-y-responsive-table-header w-[10%]"
                          rowSpan={2}
                        >
                          Date of Rejoining
                        </th>
                      )}
                      <th
                        className="emp-posting-table-th padding-y-responsive-table-header w-[10%]"
                        rowSpan={2}
                      >
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody className="text-primaryText border border-tableBorder">
                    {existingScheduledEmployeesData.map(
                      (row, index) =>
                        (showPostingHistory ||
                          row.status !== Status.INACTIVE) && (
                          <tr
                            key={index}
                            className={`border border-tableBorder hover:bg-gray-200 text-sm font-medium h-10 ${row.status === 'Active' ? 'text-primaryText' : 'text-[#9ca3af]'}`}
                          >
                            {/* Sl No. */}
                            <td className="table-td-with-input">
                              {/* {index + 1} */}
                              {row.empId}
                            </td>

                            {/* Employee Name */}
                            <td className="pl-[1%] text-start table-td-with-input">
                              <p className="text-left w-fit">{row.empName}</p>
                            </td>

                            {/* Rank */}
                            <td
                              className={`table-td-with-input ${showPostingHistory ? 'w-[50%]' : 'w-[10%]'}`}
                            >
                              <p className="w-full">{row.rank}</p>
                            </td>

                            {/* Date of Posting */}
                            <td className=" table-td-with-input">
                              {formatDateDdMmYyyySlash(
                                row.dateOfPosting as Date
                              )}
                            </td>

                            {/* Status */}
                            <td className=" table-td-with-input">
                              {/* {row.status === 'Active' ? (
                                <button className="bg-[#0C672B4D] text-[#0C672B] py-1 px-4 rounded-full font-medium pointer-events-none">
                                  Active
                                </button>
                              ) : (
                                <button className="bg-[#A1A1A1] text-white py-1 px-4 rounded-full font-medium pointer-events-none">
                                  Inactive
                                </button>
                              )} */}
                              {row.status === 'Active' ? (
                                <button className="bg-[#0C672B4D] text-[#0C672B] py-1 px-4 rounded-full font-medium text-xs md:text-sm pointer-events-none">
                                  {row.status}
                                </button>
                              ) : row.status === 'Discharged' ? (
                                <button className="bg-[#a7a7a7] text-[#4a4a4a] py-1 px-4 rounded-full font-medium text-xs md:text-sm pointer-events-none">
                                  {row.status}
                                </button>
                              ) : row.status === 'Absconded' ? (
                                <button className="bg-[#eaa9a9] text-[#ad1a1a] py-1 px-4 rounded-full font-medium text-xs md:text-sm pointer-events-none">
                                  {row.status}
                                </button>
                              ) : row.status === 'Resigned' ? (
                                <button className="bg-[#afb0e7] text-[#3538cd] py-1 px-4 rounded-full font-medium text-xs md:text-sm pointer-events-none">
                                  {row.status}
                                </button>
                              ) : (
                                <button className="bg-[#A1A1A1] text-white py-1 px-4 rounded-full font-medium text-xs md:text-sm pointer-events-none">
                                  {row.status}
                                </button>
                              )}
                            </td>

                            {/* Transferred From */}
                            {showPostingHistory && (
                              <td className=" table-td-with-input">
                                {row.transferredFrom || '-'}
                              </td>
                            )}

                            {/* Transferred To */}
                            {showPostingHistory && (
                              <td className=" table-td-with-input">
                                {row.transferredTo || '-'}
                              </td>
                            )}

                            {/* Date of Transfer */}
                            {showPostingHistory && (
                              <td className=" table-td-with-input">
                                {row.dateOfTransfer === null
                                  ? '-'
                                  : formatDateDdMmYyyySlash(
                                      row.dateOfTransfer as Date
                                    ) || '-'}
                              </td>
                            )}

                            {/* Date of Discharge */}
                            {showPostingHistory && (
                              <td className=" table-td-with-input">
                                {row.dateOfDischarge === null
                                  ? '-'
                                  : formatDateDdMmYyyySlash(
                                      row.dateOfDischarge as Date
                                    )}
                              </td>
                            )}

                            {/* Promoted To */}
                            {showPostingHistory && (
                              <td className=" table-td-with-input">
                                {row.promotedTo || '-'}
                              </td>
                            )}

                            {/* Promoted From */}
                            {showPostingHistory && (
                              <td className=" table-td-with-input">
                                {row.promotedFrom || '-'}
                              </td>
                            )}

                            {/* Date of Promotion */}
                            {showPostingHistory && (
                              <td className=" table-td-with-input">
                                {row.dateOfPromotion === null
                                  ? '-'
                                  : formatDateDdMmYyyySlash(
                                      row.dateOfPromotion as Date
                                    )}
                              </td>
                            )}

                            {/* Date of Resignation */}
                            {showPostingHistory && (
                              <td className=" table-td-with-input">
                                {row.dateOfResignation === null
                                  ? '-'
                                  : formatDateDdMmYyyySlash(
                                      row.dateOfResignation as Date
                                    )}
                              </td>
                            )}

                            {/* Date of Absconding */}
                            {showPostingHistory && (
                              <td className=" table-td-with-input">
                                {row.dateOfAbsconding === null
                                  ? '-'
                                  : formatDateDdMmYyyySlash(
                                      row.dateOfAbsconding as Date
                                    )}
                              </td>
                            )}

                            {/* Date of Rejoining */}
                            {showPostingHistory && (
                              <td className=" table-td-with-input">
                                {row.dateOfRejoining === null
                                  ? '-'
                                  : formatDateDdMmYyyySlash(
                                      row.dateOfRejoining as Date
                                    )}
                              </td>
                            )}

                            {/* Action */}
                            {row.status === 'Active' ? (
                              <td className=" table-td-with-input relative">
                                <button
                                  type="button"
                                  onClick={(e) =>
                                    handleActionClick(e, row, index)
                                  }
                                  className="text-blue-600 hover:text-blue-800"
                                >
                                  <img
                                    src={TableOptionsIcon}
                                    className="w-4"
                                    alt="action image"
                                  />
                                </button>
                              </td>
                            ) : (
                              <td className=" table-td-with-input relative">
                                -
                              </td>
                            )}
                          </tr>
                        )
                    )}

                    {scheduleEmployeesData.map((row, index) => (
                      <tr
                        key={index}
                        className="border border-tableBorder h-12"
                      >
                        {/* Sl No. */}
                        <td className="table-td-with-input">
                          {/* {index + existingScheduledEmployeesData.length + 1} */}
                          {/* {row.ID} */}
                        </td>

                        {/* Select Employee */}
                        <td className="table-td-with-input cursor-pointer z-0">
                          <CustomEmployeeDropDown
                            employees={allEmployeesData}
                            selectedEmployeeId={row.empTableId}
                            onChange={(id) =>
                              handleRowDataChange(index, 'empTableId', id)
                            }
                            disabled={
                              !currentSelectedPostId ||
                              !allEmployeesData ||
                              !allPostRanksData
                              // selectedEmployeeIds.includes(row.empTableId)
                            }
                          />
                        </td>

                        {/* Select Rank */}
                        <td className="table-td-with-input cursor-pointer">
                          <select
                            name="select"
                            disabled={
                              currentSelectedPostId === 0 ||
                              !allPostRanksData ||
                              !row.empTableId
                            }
                            value={
                              row.postRankLinkId
                                ? row.postRankLinkId.toString()
                                : ''
                            }
                            onChange={(e) =>
                              handleRowDataChange(
                                index,
                                'postRankLinkId',
                                parseInt((e.target as HTMLSelectElement).value)
                              )
                            }
                            className="w-40 md:w-48 lg:w-52 2xl:w-full px-2 py-1 rounded-lg cursor-pointer bg-white border border-gray-300 h-10 "
                          >
                            <option value="">Select</option>
                            {allPostRanksData.map((postRankLink) => (
                              <option
                                key={postRankLink.ID}
                                value={postRankLink.ID}
                              >
                                {postRankLink.designation}
                              </option>
                            ))}
                          </select>
                        </td>

                        {/* Select Date of Posting */}
                        <td className="px-3 border border-tableBorder">
                          <input
                            type="date"
                            name="date"
                            id="date"
                            disabled={
                              currentSelectedPostId === 0 ||
                              !row.empTableId ||
                              !row.postRankLinkId
                            }
                            value={
                              getFormattedDateYyyyMmDdDash(
                                row.dateOfPosting as Date
                              ) || ''
                            }
                            onChange={(e) =>
                              handleRowDataChange(
                                index,
                                'dateOfPosting',
                                e.target.value
                              )
                            }
                            className={`
                              w-full px-2 py-1 rounded-lg cursor-pointer
                              ${
                                (currentSelectedPostId === 0 ||
                                  !row.empTableId ||
                                  !row.postRankLinkId) &&
                                'bg-white'
                              } 
                              border border-gray-300 h-10 text-sm
                            `}
                          />
                        </td>

                        {/* Select Status*/}
                        <td className="p-3 border border-tableBorder">
                          <p>-</p>
                        </td>

                        {/* Transferred From */}
                        {showPostingHistory && (
                          <td className="p-3 border border-tableBorder">
                            <p>-</p>
                          </td>
                        )}

                        {/* Transferred To */}
                        {showPostingHistory && (
                          <td className="p-3 border border-tableBorder">
                            <p>-</p>
                          </td>
                        )}

                        {/*  Date of Transfer */}
                        {showPostingHistory && (
                          <td className="p-3 border border-tableBorder">
                            <p>-</p>
                          </td>
                        )}

                        {/* Date of Discharge */}
                        {showPostingHistory && (
                          <td className="p-3 border border-tableBorder">
                            <p>-</p>
                          </td>
                        )}

                        {/* Promoted To */}
                        {showPostingHistory && (
                          <td className="p-3 border border-tableBorder">
                            <p>-</p>
                          </td>
                        )}

                        {/* Promoted From */}
                        {showPostingHistory && (
                          <td className="p-3 border border-tableBorder">
                            <p>-</p>
                          </td>
                        )}

                        {/*  Date of Promotion */}
                        {showPostingHistory && (
                          <td className="p-3 border border-tableBorder">
                            <p>-</p>
                          </td>
                        )}

                        {showPostingHistory && (
                          <td className="p-3 border border-tableBorder">
                            <p>-</p>
                          </td>
                        )}

                        {showPostingHistory && (
                          <td className="p-3 border border-tableBorder">
                            <p>-</p>
                          </td>
                        )}

                        {showPostingHistory && (
                          <td className="p-3 border border-tableBorder">
                            <p>-</p>
                          </td>
                        )}

                        {/* Actions */}
                        <td className="py-3 px-4 border border-tableBorder relative">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              e.preventDefault();
                              handleRemoveRow(index);
                            }}
                            className="flex gap-2 items-center justify-center w-full py-2 primaryLabels text-secondaryText "
                          >
                            <img
                              src={Delete_Icon}
                              alt="Delete_Icon"
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
                      // className={`absolute right-[60%] ${actionModalIndex <= 1 ? '' : 'bottom-[10%] lg:bottom-[20%]'} w-40 bg-white border border-gray-300 shadow-lg z-10`}
                      className="fixed z-50 bg-white border border-gray-300 shadow-lg w-36 md:w-40 lg:w-44"
                      style={{
                        top: `${menuPosition.top}px`,
                        left: `${menuPosition.left}px`,
                      }}
                    >
                      {/* Transfer */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          e.preventDefault();
                          setActionModalIndex(null);
                          setShowTransferEmployeeModal(true);
                        }}
                        className="flex gap-2 items-center w-full px-4 py-2 primaryLabels text-secondaryText hover:bg-smallMenuHover"
                      >
                        <img
                          src={EmpTransferIcon}
                          alt="EditPencil_Icon"
                          className="w-4 h-4"
                        />
                        <span>Transfer</span>
                      </button>
                      {/* Discharge */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          e.preventDefault();
                          setShowDischargeEmployeeModal(true);
                          setActionModalIndex(null);
                        }}
                        className="flex gap-2 items-center w-full px-4 py-2 primaryLabels text-secondaryText hover:bg-smallMenuHover"
                      >
                        <img
                          src={EmpRemoveIcon}
                          alt="Delete_Icon"
                          className="w-4 h-4"
                        />
                        <span>Discharge</span>
                      </button>
                      {/* Promote */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          e.preventDefault();
                          setShowPromoteEmployeeModal(true);
                          setActionModalIndex(null);
                        }}
                        className="flex gap-2 items-center w-full px-4 py-2 primaryLabels text-secondaryText hover:bg-smallMenuHover"
                      >
                        <img
                          src={Promote_Icon}
                          alt="Delete_Icon"
                          className="w-4 h-4"
                        />
                        <span>Promote</span>
                      </button>
                    </div>
                  </>
                )}
              </div>
              {errors.error && (
                <div className="text-red-500">
                  <p className="text-xs 2xl:text-sm">{errors.error}</p>
                </div>
              )}
              {/* add more */}
              <div className="flex justify-start">
                <button
                  type="button"
                  onClick={handleAddRow}
                  className={`flex items-center justify-center gap-2 font-Mona_Sans text-xs 2xl:text-sm font-semibold ${
                    isAddMoreRowsAllowed() ? 'text-[#2C3183]' : 'text-gray-400'
                  } ${
                    isAddMoreRowsAllowed()
                      ? 'hover:text-[#2C3183]'
                      : 'hover:text-gray-400'
                  }  hover:duration-200 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-md px-4 py-1`}
                  disabled={!isAddMoreRowsAllowed()}
                >
                  <div>
                    <img
                      src={Plus_Black}
                      alt=""
                      className={`2xl:w-5 2xl:h-5`}
                    />
                  </div>
                  Add more..
                </button>
              </div>
            </div>
            <div className="flex justify-center gap-4  2xl:gap-6 mx-8 mt-1 2xl:mt-2">
              <SmallButton
                onClick={handleSubmitScheduleEmployees}
                type="submit"
              >
                Save
              </SmallButton>
            </div>
          </Accordion>
        </form>
      </div>
      {showTransferEmployeeModal && (
        <EmployeeTransferModal
          confirmButtonTitle="Save Changes"
          cancelButtonTitle="Cancel"
          updateNewSelectedPostRankId={handleUpdateTransferPostRank}
          updateTransferPostingDate={handleUpdateTransferPostingDate}
          onConfirm={(e) => {
            e.stopPropagation();
            e.preventDefault();
            handleTransfer(actionEmployeeId);
          }}
          onCancel={() => setShowTransferEmployeeModal(false)}
          message={`Please confirm that you want to transfer the ${actionEmployeeName} to another post?`}
        />
      )}
      {showDischargeEmployeeModal && (
        <EmployeeDischargeModal
          confirmButtonTitle="Discharge"
          cancelButtonTitle="Cancel"
          updateDischargePostingDate={handleUpdateDischargePostingDate}
          onConfirm={(e) => {
            e.stopPropagation();
            e.preventDefault();
            handleDischarge(actionEmployeeId, actionPostRankId);
          }}
          onCancel={() => setShowDischargeEmployeeModal(false)}
          message={`Are you sure you want to discharge the employee ${actionEmployeeName} from the current post?`}
        />
      )}
      {showConfirmTransferModal && (
        <ConfirmationModal
          confirmButtonTitle="Ok"
          cancelButtonTitle="Cancel"
          onConfirm={() => setShowConfirmTransferModal(false)}
          onCancel={handleCancelTransferWarningModal}
          message={`Warning! This employee is already assigned to another post. This will result in transferring the employee to the current post. Are you sure?`}
        />
      )}
      {showPromoteEmployeeModal && (
        <EmployeePromoteModal
          confirmButtonTitle="Save Changes"
          cancelButtonTitle="Cancel"
          updateNewSelectedPostRankId={handleUpdatePromotePostRank}
          updatePromotePostingDate={handleUpdatePromotePostingDate}
          onConfirm={(e) => {
            e.stopPropagation();
            e.preventDefault();
            handlePromote(actionEmployeeId);
          }}
          onCancel={() => setShowPromoteEmployeeModal(false)}
          message={`Please confirm that you want to promote the ${actionEmployeeName}?`}
        />
      )}
    </>
  );
};

export default EditScheduleEmployee;
