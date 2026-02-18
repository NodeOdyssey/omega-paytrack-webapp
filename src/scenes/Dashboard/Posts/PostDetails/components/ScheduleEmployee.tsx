// Libraries
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router';
import axios, { AxiosError } from 'axios';
import { toast } from 'react-toastify';
import * as Yup from 'yup';

// Configs
import { api } from '../../../../../configs/api';

// Types
import { Post } from '../../../../../types/post';
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
import BreadCrumb from '../../../../../common/BreadCrumb/BreadCrumb';
import Accordion from '../../../../../common/Accordion/Accordion';
// import ClearButton from '../../../../../common/Button/ClearButton';
import SmallButton from '../../../../../common/Button/SmallButton';
// import CustomPostNameDropDown from '../../../../../common/CustomRankDropDown/CustomPostNameDropDown';
// import ConfirmationModal from '../../../../../common/Modal/ConfirmationModal';
import EmployeeTransferModal from '../../../../../common/Modal/EmployeeTransferModal';
import Loader from '../../../../../common/Loader/Loader';
import CustomEmployeeDropDown from '../../../../../common/CustomEployeeDropDown/CustomEmployeeDropDown';

// Assets
import {
  Arrow_Back,
  Delete_Icon,
  Plus_Black,
  TableOptionsIcon,
  EmpRemoveIcon,
  EmpTransferIcon,
  Promote_Icon,
} from '../../../../../assets/icons';
import EmployeeDischargeModal from '../../../../../common/Modal/EmployeeDischargeModal';
import PostSelectDropdown from '../../../../../common/DropDownInput/PostSelectDropdown';
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

const ScheduleEmployee: React.FC = () => {
  /* Scroll To Top */
  useScrollToTop();

  /* Verify User Auth */
  const accessToken = useVerifyUserAuth();

  /* Navigation */
  const navigate = useNavigate();

  /* Loader */
  const [isLoading, setIsLoading] = useState(false);

  /* Check for postId in url params */
  const urlParams = new URLSearchParams(window.location.search);
  const postId = urlParams.get('postId');

  useEffect(() => {
    if (postId) {
      setCurrentSelectedPostId(Number(postId));
    }
  }, [postId]);

  /** Post Data and Controls for case when post is already known */
  const [postName, setPostName] = useState<string>('');

  const fetchPostData = async () => {
    if (!postId || !accessToken) return;
    setIsLoading(true);
    try {
      const response = await axios.get(`${api.baseUrl}/posts/${postId}`, {
        headers: {
          'x-access-token': accessToken,
        },
      });
      if (response.data.success) {
        setPostName(response.data.post.postName);
      }
    } catch (error) {
      if (error instanceof Yup.ValidationError) {
        handleYupError(error);
      } else {
        handleAxiosError(error as AxiosError);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!postId || !accessToken) return;
    fetchPostData();
  }, [postId, accessToken]);

  /* Post Data and Controls for case when post is not known */
  const [allPostsData, setAllPostsData] = useState<Post[]>([]);
  const [currentSelectedPostId, setCurrentSelectedPostId] = useState<number>(0);

  const fetchPosts = async () => {
    if (!accessToken || postId) return;
    try {
      const response = await axios.get(`${api.baseUrl}${api.posts}`, {
        headers: { 'x-access-token': accessToken },
      });
      if (response.data && response.data.success) {
        setAllPostsData(response.data.posts);
      }
    } catch (error) {
      if (error instanceof Yup.ValidationError) {
        handleYupError(error);
      } else {
        if (error instanceof AxiosError && error.response?.status === 404) {
          toast.error('No posts found. Please add a post first.');
        }
        handleAxiosError(error as AxiosError);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [accessToken]);

  const updateSelectPost = (postId: number) => {
    setExistingScheduledEmployeesData([]);
    setCurrentSelectedPostId(postId);
  };

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
      //  catch (error) {
      //   toast.error(error.response?.data.message);
      //   if (error instanceof Yup.ValidationError) {
      //     handleYupError(error);
      //   }
      //   // console.log('isAxiosError: ', error instanceof AxiosError);
      //   if (error instanceof AxiosError && error.status === 400) {
      //     // console.log('ERROR: ', error.response?.data.message);
      //     toast.error(error.response?.data.message); // TODO:  Toast not working here check later. Instead toast shifited above
      //   }
      //   handleAxiosError(error as AxiosError);
      // }
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
      //  catch (error) {
      //   toast.error(error.response?.data.message);
      //   // console.log('isAxiosError: ', error instanceof AxiosError);
      //   if (error instanceof Yup.ValidationError) {
      //     handleYupError(error);
      //   } else {
      //     if (error instanceof AxiosError && error.status === 400) {
      //       // console.log('ERROR: ', error.response?.data.message);
      //       toast.error(error.response?.data.message); // TODO:  Toast not working here check later. Instead toast shifited above
      //     }
      //     handleAxiosError(error as AxiosError);
      //   }
      // }
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

  /** Table Data Change Controls */
  // const handleRowDataChange = (
  //   index: number,
  //   field: keyof EmpPostRankLink,
  //   value: string | number
  // ) => {
  //   const updatedData = [...scheduleEmployeesData];
  //   if (field === 'dateOfPosting' && typeof value === 'string') {
  //     const date = new Date(value);
  //     updatedData[index] = { ...updatedData[index], [field]: date };
  //   } else {
  //     updatedData[index] = {
  //       ...updatedData[index],
  //       [field]: value,
  //     };
  //   }
  //   setScheduleEmployeesData(updatedData);
  //   if (field === 'status' && value === 'Active') {
  //     alert('Are you sure?');
  //   }
  //   if (field === 'empTableId') {
  //     setSelectedEmployeeIds([
  //       ...selectedEmployeeIds,
  //       Number(updatedData[index].empTableId),
  //     ]);
  //   }
  // };
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

    // if (field === 'empTableId') {
    //   setSelectedEmployeeIds([
    //     ...selectedEmployeeIds,
    //     Number(updatedData[index].empTableId),
    //   ]);
    // }
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
    // if (removedRow && removedRow.empTableId) {
    //   const newSelectedEmpIds = selectedEmployeeIds.filter(
    //     (id) => id !== removedRow.empTableId
    //   );
    //   setSelectedEmployeeIds(newSelectedEmpIds);
    // }
  };

  // Test useEffect
  useEffect(() => {
    // console.log('postId: ', postId);
    // console.log('postName: ', postName);
    console.log('schedule employees data: ', scheduleEmployeesData);
    console.log(
      'existing schedule employees: ',
      existingScheduledEmployeesData
    );
    // console.log('errors in schedule employee: ', errors);
  });

  // JSX here
  return (
    <>
      {isLoading && <Loader />}
      {/* Top Bar */}
      <div className="flex flex-col w-full fixed z-20 py-2 px-4 2xl:px-8 gap-1 2xl:gap-2">
        <BreadCrumb />
        <button
          onClick={() => navigate(-1)}
          className="flex w-fit items-center gap-2"
        >
          <img src={Arrow_Back} alt="" />
          <h2 className="primaryHeadings text-secondaryText">Back</h2>
        </button>
      </div>
      <div className="bg-white mt-[70px] 2xl:mt-[92px] z-10 overflow-y-auto h-[calc(100vh-208px)] scrollbar scrollbar-thumb-scrollBarColor scrollbar-track-scrollBarBg">
        <form
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              handleSubmitScheduleEmployees(e);
            }
          }}
          className="bg-white pb-6"
        >
          <div className="px-8 flex flex-col gap-4 mt-2 mb-4">
            <h2 className="primaryHeadings text-primaryText">Post Name</h2>
            <div>
              {postId ? (
                <div className="flex items-center justify-between w-1/3 max-w-64 p-4 rounded-lg bg-gray-50 border border-gray-300">
                  {postName}
                </div>
              ) : (
                // <CustomPostNameDropDown
                //   posts={allPostsData}
                //   placeholder="Select"
                //   updateSelectedPostDetails={updateSelectPost}
                // />
                <PostSelectDropdown
                  label="Select"
                  posts={allPostsData || []}
                  onChangePost={updateSelectPost}
                />
              )}
            </div>
          </div>
          {/* Table */}
          <Accordion title="Employee Details">
            <div className="flex px-4 flex-col gap-2 max-h-[45vh] relative">
              {/* total employee & show posting history */}

              {/* total employee */}
              <div className="flex justify-between items-center mb-2">
                {/* total employee */}
                {currentSelectedPostId !== 0 ? (
                  <div className="flex gap-2">
                    <h2 className="text-sm lg:text-base text-primaryText font-medium">
                      Total Employees:
                    </h2>
                    <p className="text-sm lg:text-base text-primaryText font-medium">
                      {existingScheduledEmployeesData
                        .map((emp) => (emp.status === Status.ACTIVE ? 1 : 0))
                        .reduce((acc: number, curr: number) => acc + curr, 0)}
                    </p>
                  </div>
                ) : (
                  <div></div>
                )}
                {/* show posting history */}
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="showPostHistory"
                    name="showPostHistory"
                    checked={showPostingHistory}
                    onChange={(e) => setShowPostingHistory(e.target.checked)}
                    className="cursor-pointer"
                  />
                  <label
                    htmlFor="showPostHistory"
                    className="text-sm font-medium"
                  >
                    Show schedule history
                  </label>
                </div>
                {/* {errors.error && (
                  <div className="text-red-500">
                    <p>{errors.error}</p>
                  </div>
                )} */}
              </div>
              {/* table */}
              <div className="flex text-center overflow-x-auto border scrollbar border-opacity-40  scrollbar-thumb-scrollBarColor scrollbar-track-scrollBarBg">
                <table className="min-w-full bg-white border border-accordionBg scrollbar-thumb-scrollBarColor scrollbar-track-scrollBarBg">
                  <thead className="text-center text-primaryText border border-accordionBg sticky top-0 z-20">
                    <tr className="bg-tableHeadingColour">
                      <th
                        className="py-3 px-4 border border-tableBorder"
                        rowSpan={1}
                      >
                        Emp Id
                      </th>
                      <th
                        className="py-3 px-4 border border-tableBorder"
                        rowSpan={2}
                      >
                        Employee Name
                      </th>
                      <th
                        className="py-3 px-4 border border-tableBorder"
                        rowSpan={2}
                      >
                        Rank
                      </th>
                      <th
                        className="py-3 px-4 border border-tableBorder"
                        rowSpan={2}
                      >
                        Date of Posting
                      </th>
                      <th
                        className="py-3 px-4 border border-tableBorder"
                        rowSpan={2}
                      >
                        Status
                      </th>
                      {showPostingHistory && (
                        <th
                          className="py-3 px-4 border border-tableBorder"
                          rowSpan={2}
                        >
                          Previous Posting
                        </th>
                      )}
                      {showPostingHistory && (
                        <th
                          className="py-3 px-4 border border-tableBorder"
                          rowSpan={2}
                        >
                          Transferred To
                        </th>
                      )}
                      {showPostingHistory && (
                        <th
                          className="py-3 px-4 border border-tableBorder"
                          rowSpan={2}
                        >
                          Date of Transfer
                        </th>
                      )}
                      {showPostingHistory && (
                        <th
                          className="py-3 px-4 border border-tableBorder"
                          rowSpan={2}
                        >
                          Date of Discharge
                        </th>
                      )}
                      {showPostingHistory && (
                        <th
                          className="py-3 px-4 border border-tableBorder"
                          rowSpan={2}
                        >
                          Promoted To
                        </th>
                      )}
                      {showPostingHistory && (
                        <th
                          className="py-3 px-4 border border-tableBorder"
                          rowSpan={2}
                        >
                          Promoted From
                        </th>
                      )}
                      {showPostingHistory && (
                        <th
                          className="py-3 px-4 border border-tableBorder"
                          rowSpan={2}
                        >
                          Date of Promotion
                        </th>
                      )}
                      <th
                        className="py-3 px-4 border border-tableBorder"
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
                            className={`border border-tableBorder h-20 ${row.status === 'Active' ? 'text-primaryText' : 'text-[#9ca3af]'}`}
                          >
                            {/* Sl No. */}
                            <td className="py-3 px-2 border border-tableBorder">
                              {/* {index + 1} */}
                              {row.empId}
                            </td>

                            {/* Employee Name */}
                            <td className="py-3 px-2 border border-tableBorder">
                              <p>{row.empName}</p>
                            </td>

                            {/* Rank */}
                            <td className="py-3 px-2 border border-tableBorder">
                              {row.rank}
                            </td>

                            {/* Date of Posting */}
                            <td className="py-3 px-2 border border-tableBorder">
                              {formatDateDdMmYyyySlash(
                                row.dateOfPosting as Date
                              )}
                            </td>

                            {/* Status */}
                            <td className="py-3 px-2 border border-tableBorder">
                              {row.status === 'Active' ? (
                                <button className="bg-[#0C672B4D] text-[#0C672B] py-1 px-4 rounded-full font-medium">
                                  Active
                                </button>
                              ) : (
                                <button className="bg-[#A1A1A1] text-white py-1 px-4 rounded-full font-medium">
                                  Inactive
                                </button>
                              )}
                            </td>

                            {/* Transferred From */}
                            {showPostingHistory && (
                              <td className="py-3 px-2 border border-tableBorder">
                                {row.transferredFrom || '-'}
                              </td>
                            )}

                            {/* Transferred To */}
                            {showPostingHistory && (
                              <td className="py-3 px-2 border border-tableBorder">
                                {row.transferredTo || '-'}
                              </td>
                            )}

                            {/* Date of Transfer */}
                            {showPostingHistory && (
                              <td className="py-3 px-2 border border-tableBorder">
                                {row.dateOfTransfer === null
                                  ? '-'
                                  : formatDateDdMmYyyySlash(
                                      row.dateOfTransfer as Date
                                    ) || '-'}
                              </td>
                            )}

                            {/* Date of Discharge */}
                            {showPostingHistory && (
                              <td className="py-3 px-2 border border-tableBorder">
                                {row.dateOfDischarge === null
                                  ? '-'
                                  : formatDateDdMmYyyySlash(
                                      row.dateOfDischarge as Date
                                    )}
                              </td>
                            )}

                            {/* Promoted To */}
                            {showPostingHistory && (
                              <td className="py-3 px-2 border border-tableBorder">
                                {row.promotedTo || '-'}
                              </td>
                            )}

                            {/* Promoted From */}
                            {showPostingHistory && (
                              <td className="py-3 px-2 border border-tableBorder">
                                {row.promotedFrom || '-'}
                              </td>
                            )}

                            {/* Date of Promotion */}
                            {showPostingHistory && (
                              <td className="py-3 px-2 border border-tableBorder">
                                {row.dateOfPromotion === null
                                  ? '-'
                                  : formatDateDdMmYyyySlash(
                                      row.dateOfPromotion as Date
                                    )}
                              </td>
                            )}

                            {/* Action */}
                            {row.status === 'Active' ? (
                              <td className="py-3 px-4 border border-tableBorder relative">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    e.preventDefault();
                                    setActionModalIndex(
                                      actionModalIndex === index ? null : index
                                    );
                                    setActionEmployeeId(row.empTableId);
                                    setActionPostRankId(row.postRankLinkId);
                                    setActionEmployeeName(row.empName);
                                  }}
                                  className="text-blue-600 hover:text-blue-800"
                                >
                                  <img
                                    src={TableOptionsIcon}
                                    className="w-4"
                                    alt=""
                                  />
                                </button>
                                {actionModalIndex === index && (
                                  <>
                                    <div className="absolute inset-0 bg-black opacity-50 pointer-events-none"></div>
                                    <div
                                      ref={actionMenuRef}
                                      className={`absolute right-[60%] ${actionModalIndex <= 1 ? '' : 'bottom-[10%] lg:bottom-[20%]'} w-40 bg-white border border-gray-300 shadow-lg z-10`}
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
                              </td>
                            ) : (
                              <td className="py-3 px-4 border border-tableBorder relative">
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
                        <td className="py-3 px-2 border border-tableBorder">
                          {/* {index + existingScheduledEmployeesData.length + 1} */}
                        </td>

                        {/* Select Employee */}
                        <td className="w-56 md:w-64 lg:w-72 p-2 h-full cursor-pointer z-0">
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
                        <td className="py-2 px-2 h-full text-xs lg:text-sm xl:text-base border border-tableBorder cursor-pointer">
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
                            className="w-full p-3 rounded-lg cursor-pointer bg-white border border-gray-300 h-12 "
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
                        <td className="p-3 border border-tableBorder">
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
                              w-full p-3 rounded-lg cursor-pointer
                              ${
                                (currentSelectedPostId === 0 ||
                                  !row.empTableId ||
                                  !row.postRankLinkId) &&
                                'bg-[#fafafa]'
                              } 
                              border border-gray-300 h-12
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
              </div>
              {errors.error && (
                <div className="text-red-500">
                  <p>{errors.error}</p>
                </div>
              )}
              {/* add more */}
              <div className="flex justify-start">
                <button
                  type="button"
                  onClick={handleAddRow}
                  className={`flex items-center justify-center gap-2 font-Mona_Sans text-base font-semibold ${
                    isAddMoreRowsAllowed() ? 'text-[#2C3183]' : 'text-gray-400'
                  } ${
                    isAddMoreRowsAllowed()
                      ? 'hover:text-[#2C3183]'
                      : 'hover:text-gray-400'
                  }  hover:duration-200 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-md px-4 py-2`}
                  disabled={!isAddMoreRowsAllowed()}
                >
                  <div>
                    <img src={Plus_Black} alt="" className={`w-5 h-5`} />
                  </div>
                  Add more..
                </button>
              </div>

              {/* <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="showPostHistory"
                  name="showPostHistory"
                  checked={showPostingHistory}
                  onChange={(e) => setShowPostingHistory(e.target.checked)}
                />
                <label htmlFor="showPostHistory" className="text-sm">
                  Show schedule history
                </label>
              </div>
              {errors.error && (
                <div className="text-red-500">
                  <p>{errors.error}</p>
                </div>
              )} */}
            </div>
          </Accordion>
          <div className="flex justify-center gap-6 mx-8 mt-2">
            {/* <ClearButton type="button">Clear</ClearButton> */}
            <SmallButton onClick={handleSubmitScheduleEmployees} type="submit">
              Save
            </SmallButton>
          </div>
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
        // <ConfirmationModal
        //   confirmButtonTitle="Discharge"
        //   cancelButtonTitle="Cancel"
        //   onConfirm={() => {
        //     handleDischarge(actionEmployeeId, actionPostRankId);
        //   }}
        //   onCancel={() => setShowDischargeEmployeeModal(false)}
        //   message={`Are you sure you want to discharge the employee ${actionEmployeeName} from the current post?`}
        // />
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

export default ScheduleEmployee;
