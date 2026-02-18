import React, { useEffect, useRef, useState } from 'react';
import axios, { AxiosError } from 'axios';
import { toast } from 'react-toastify';
import {
  // Arrow_Back,
  Arrow_Back_Blue,
  Delete_Icon,
  DownloadIcon,
  Edit_Icon_Blue,
  PDFIcon,
  SaveIcon,
  // SearchIcon,
  TableOptionsIcon,
} from '../../../assets/icons';
// import PostSelectDropdown from '../../common/DropDownInput/PostSelectDropdown';
import * as Yup from 'yup';

import { api } from '../../../configs/api';
import { Post } from '../../../types/post';

import useHandleAxiosError from '../../../hooks/useHandleAxiosError';
import useHandleYupError from '../../../hooks/useHandleYupError';
import useVerifyUserAuth from '../../../hooks/useVerifyUserAuth';
import useScrollToTop from '../../../hooks/useScrollToTop';

import SearchAttendancePosts from './components/SearchAttendancePosts';
import DatePickerComp from '../../../common/AttendanceDatePicker/DatePickerComp';
import BreadCrumb from '../../../common/BreadCrumb/BreadCrumb';
import Loader from '../../../common/Loader/Loader';
import AttendanceAndPayrollStatus from './components/AttendanceAndPayrollStatus';
import { getMonthName, monthToNumber } from '../../../utils/helpersFunctions';
import {
  extractFileNameFromPath,
  extractNameFromFileObj,
  getDaysInMonth,
  getFileIcon,
  getLabel,
} from '../../../utils/formatter';

import {
  Attendance,
  AttendanceAndPayrollStatuses,
  AttendanceDocuments,
  AttendanceSchedule,
} from '../../../types/attendance';
import AttendanceTable from './components/AttendanceTable';
// import PostSelectDropdown from '../../../common/DropDownInput/PostSelectDropdown';
import ConfirmationModal from '../../../common/Modal/ConfirmationModal';

import PayRollTable from './components/PayRollTable';
import { Payroll, PayrollUpdate } from '../../../types/payroll';
// import Accordion from '../../../common/Accordion/Accordion';
import Pagination from '../../../common/Pagination/Pagination';
import SavePayrollButton from '../../../common/Button/SavePayrollButton';
import PrimaryButton from '../../../common/Button/PrimaryButton';
import useClickOutside from '../../../hooks/useClickOutside';
import { CSVLink } from 'react-csv';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import NoSearchResultPage from '../../../common/NoSearchResultPage/NoSearchResultPage';
import SearchCompo from '../../../common/SearchCompo';
import { ReportName, ReportType } from '../../../types/report';

// import ClearButton from '../../../common/Button/ClearButton';

/* Initial Payroll values */
const initialPayrollUpdateData: PayrollUpdate = {
  bonus: 0,
  extraDuty: 0,
  advance: 0,
  beltDeduction: 0,
  bootDeduction: 0,
  uniformDeduction: 0,
  otherDeduction: 0,
  weeklyOff: 0,
  specialAllowance: 0,
  esi: 0,
  pTax: 0,
};

const reportTypesList: ReportType[] = [
  { type: 1, name: ReportName.VIEW_DS_REPORT, reportCode: 'VIEW_DS_REPORT' },
  { type: 2, name: ReportName.ESI_REPORT, reportCode: 'ESI_REPORT' },
  { type: 3, name: ReportName.EPF_REPORT, reportCode: 'EPF_REPORT' },
  { type: 4, name: ReportName.PTAX_REPORT, reportCode: 'PTAX_REPORT' },
  {
    type: 5,
    name: ReportName.WITHOUT_ALLOWANCE_REPORT,
    reportCode: 'WITHOUT_ALLOWANCE_REPORT',
  },
  {
    type: 6,
    name: ReportName.NEW_PAYROLL_REPORT,
    reportCode: 'NEW_PAYROLL_REPORT',
  },
  { type: 7, name: ReportName.DSL_REPORT, reportCode: 'DSL_REPORT' },
  { type: 8, name: ReportName.LNT_REPORT, reportCode: 'LNT_REPORT' },
  { type: 9, name: ReportName.OTHERS_REPORT, reportCode: 'OTHERS_REPORT' },
  { type: 10, name: ReportName.SALARY_REPORT, reportCode: 'SALARY_REPORT' },
];

const AttendanceAndPayroll: React.FC = () => {
  /* Scroll To Top */
  useScrollToTop();

  /* Verify User Auth */
  const token = useVerifyUserAuth();

  /* Loader */
  const [isLoading, setIsLoading] = useState(false);

  /* Error Handling */
  const { errors, handleYupError, setErrors } = useHandleYupError();
  const { handleAxiosError } = useHandleAxiosError(setErrors);

  /* Date and post controls */
  const [currentSelectedPostId, setCurrentSelectedPostId] = useState<number>(0);
  const [selectedDate, setSelectedDate] = useState<Date>(() => {
    const saved = localStorage.getItem(
      'paytrack.attendancePayroll.selectedDate'
    );
    const parsed = saved ? new Date(saved) : new Date();
    return isNaN(parsed.getTime()) ? new Date() : parsed;
  });
  const [resetCurrentPost, setResetCurrentPost] = useState(false);
  // const [resetCurrentDate, setResetCurrentDate] = useState(false);
  const handleDateChange = (date: Date) => {
    setSelectedDate(date);
    try {
      localStorage.setItem(
        'paytrack.attendancePayroll.selectedDate',
        date.toISOString()
      );
    } catch {}
    setSearchStatusTerm('');
  };
  // const handlePostChange = (postId: number) => {
  //   setCurrentSelectedPostId(postId);
  // };
  // useEffect(() => {
  //   setFilteredPayrollData([]);
  //   fetchAttendanceAndPayrollStatus(
  //     selectedDate.getMonth() + 1,
  //     selectedDate.getFullYear()
  //   );
  //   setCurrentView(View.Status);
  // }, [selectedDate]);

  /* All Posts Data and data handling */
  const [allPostsData, setAllPostsData] = useState<Post[]>([]);
  const fetchPosts = async () => {
    if (!token) return;
    setIsLoading(true);

    try {
      const response = await axios.get(`${api.baseUrl}${api.posts}`, {
        headers: { 'x-access-token': token },
      });
      if (response.data && response.data.success) {
        setAllPostsData(response.data.posts);
      } else {
        console.error('Error:', response.data.message);
      }
    } catch (error) {
      handleAxiosError(error as AxiosError);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    fetchPosts();
  }, [token]);

  /* Attendance and Payroll Status Data and data handling */
  const [attendanceAndPayrollStatusData, setAttendanceAndPayrollStatusData] =
    React.useState<AttendanceAndPayrollStatuses[]>([]);
  const fetchAttendanceAndPayrollStatus = async (
    month: number,
    year: number
  ) => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        `${api.baseUrl}/attendance-payroll-status/${month}/${year}`,
        {
          headers: { 'x-access-token': localStorage.getItem('accessToken') },
        }
      );
      if (response.data && response.data.success) {
        console.log(
          `Attendance and Payroll Status Data Fetched for ${response.data.month}, ${response.data.year}: `,
          response.data.statuses
        );
        // console.log(
        //   `Attendance and Payroll Status ``Data Fetched for Employeej ${response.data.month}, ${response.data.year}: `,
        //   response.data.statuses
        // );
        setAttendanceAndPayrollStatusData(response.data.statuses);
      }
    } catch (error) {
      handleAxiosError(error as AxiosError);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    setFilteredStatusData([]);
    const date = {
      month: selectedDate
        ? getMonthName(selectedDate.getMonth())
        : getMonthName(new Date().getMonth()),
      year: selectedDate
        ? selectedDate.getFullYear()
        : new Date().getFullYear(),
    };
    fetchAttendanceAndPayrollStatus(monthToNumber(date.month), date.year);
    // fetchAttendanceAndPayrollStatus(monthToNumber(date.month), date.year);
  }, [selectedDate]);

  /* View Controls */
  enum View {
    Status = 'Status',
    Attendance = 'Attendance',
    Payroll = 'Payroll',
  }
  const [currentView, setCurrentView] = useState<View>(View.Status);

  /* Attendance Schedule and Data controls */
  const [attendanceScheduleData, setAttendanceScheduleData] = useState<
    AttendanceSchedule[]
  >([]);
  const [existingAttendanceData, setExistingAttendanceData] = useState<
    Attendance[]
  >([]);
  const [canAttendanceBeEdited, setCanAttendanceBeEdited] = useState(false);
  const allowAttendanceEdit = () => {
    setCanAttendanceBeEdited(true);
  };

  const refreshAttendanceData = (attendances: Attendance[]) => {
    setExistingAttendanceData(attendances);
  };
  const initiateAttendance = async (postId: number, date: Date) => {
    console.log(
      'What is postId: ',
      postId,
      ' and date: ',
      date,
      ' in initiateAttendance'
    );
    if (!token) return;
    console.log('Initiating attendance...');
    setIsLoading(true);

    try {
      console.log('Trying to initiate attendance');
      const response = await axios.post(
        `${api.baseUrl}/attendance-schedule/`,
        {
          month: date ? date.getMonth() + 1 : selectedDate.getMonth() + 1,
          year: date ? date.getFullYear() : selectedDate.getFullYear(),
          postId: postId ?? currentSelectedPostId,
        },
        {
          headers: { 'x-access-token': localStorage.getItem('accessToken') },
        }
      );
      if (response.data && response.data.success) {
        // setCurrentView(View.Attendance);
        if (response.data.attendances) {
          console.log(
            'Attendance exists and data found: ',
            response.data.attendances
          );
          toast.success(response.data.message);
          // console.log('response.data.attendances: ', response.data.attendances);
          setExistingAttendanceData(response.data.attendances);
          // if (response.data.attendances[0].docAttendance) {
          //   setAttendanceDocsFormData({
          //     docAttendance: response.data.attendances[0]
          //       .docAttendance as string,
          //     postId: response.data.attendances[0].postId,
          //     month: response.data.attendances[0].month,
          //     year: response.data.attendances[0].year,
          //   });
          // }
          setAttendanceScheduleData([]);
          // console.log('payrollExists: ', response.data.payrollExists);
          if (response.data.payrollExists) {
            // setIsPayrollAlreadyGenerated(true);
            toast.warning(
              'Payroll already generated for the selected month and post.'
            );
          }
          setCanAttendanceBeEdited(!response.data.payrollExists);

          // const doesPayrollExist = await verifyIfPayrollExists();
          // setCanAttendanceBeEdited(doesPayrollExist);
        } else if (response.data.attendanceSchedule) {
          if (response.data.attendanceSchedule.length === 0) {
            toast.error('No attendance generated for the selected month.');
            setCurrentView(View.Status);
          }
          console.log(
            'Attendance doesnt exist and schedule found: ',
            response.data.attendanceSchedule
          );
          setAttendanceScheduleData(response.data.attendanceSchedule);
          setExistingAttendanceData([]);
          setCanAttendanceBeEdited(false);
          // setAttendanceDocsFormData(defaultattendanceDocsFormData);
        }
      }
    } catch (error) {
      handleAxiosError(error as AxiosError);
      setCurrentView(View.Status);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClickPostNameFromStatus = (postId: number) => {
    console.log('Clicked post ID:', postId);
    setCurrentSelectedPostId(postId);
    setFilteredStatusData([]); // Clear the filtered data when a post is clicked
    // handleViewChange(View.Attendance);
    // initiateAttendance(postId, selectedDate);

    setCurrentView(View.Attendance);
    console.log('View set to Attendance');
    initiateAttendance(postId, selectedDate);
  };

  /* Search / Filter Post in Status */
  const [filteredStatusData, setFilteredStatusData] = useState<
    AttendanceAndPayrollStatuses[]
  >([]);

  // search
  const [searchStatusTerm, setSearchStatusTerm] = useState('');

  const handleSearchPost = (debouncedTerm: string) => {
    setSearchStatusTerm(debouncedTerm);
    // Filter the attendance and payroll status data by post name
    const filteredData = attendanceAndPayrollStatusData.filter((record) =>
      record.postName.toLowerCase().includes(debouncedTerm.toLowerCase())
    );

    setFilteredStatusData(filteredData); // Update the filtered data
  };

  // Attendance docs
  const defaultattendanceDocsFormData: AttendanceDocuments = {
    // attendancePhoto: string | File,
    docAttendance: new File([], ''),
    month: 0,
    year: 0,
    postId: 0,
  };
  const [attendanceDocsFormData, setAttendanceDocsFormData] =
    useState<AttendanceDocuments>(defaultattendanceDocsFormData);
  const handleFilesInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsLoading(true);

    const { name, files } = e.target;
    if (files && files.length > 0) {
      setIsLoading(true);
      const selectedFile = files[0];
      handleSubmitAttendanceDocs({
        docAttendance: selectedFile,
        month: selectedDate !== null ? selectedDate.getMonth() + 1 : 0,
        year: selectedDate !== null ? selectedDate.getFullYear() : 0,
        postId: currentSelectedPostId,
      });
      // Update the form data state
      setAttendanceDocsFormData((prevData) => ({
        ...prevData,
        [name]: selectedFile,
        month: selectedDate !== null ? selectedDate.getMonth() + 1 : 0,
        year: selectedDate !== null ? selectedDate.getFullYear() : 0,
        postId: currentSelectedPostId,
      }));

      // console.log(`File uploaded for ${name}:`, selectedFile.name);
    } else {
      console.log('No file selected.');
    }
  };
  const handleSubmitAttendanceDocs = async (
    attendanceDocsFormData: AttendanceDocuments = defaultattendanceDocsFormData
  ) => {
    if (!token) return;
    setIsLoading(true);
    console.log('inside handleSubmitAttendanceDocs');
    console.log('AttendanceDocuments: ', attendanceDocsFormData);
    console.log('month : ', attendanceDocsFormData.month);
    console.log('year : ', attendanceDocsFormData.year);
    console.log('postId : ', attendanceDocsFormData.postId);
    console.log('---------------------------------------');
    try {
      if (
        !attendanceDocsFormData.docAttendance ||
        !attendanceDocsFormData.month ||
        !attendanceDocsFormData.year ||
        !attendanceDocsFormData.postId
      ) {
        toast.error('Please select an attendance document.');
        return;
      }

      const response = await axios.post(
        `${api.baseUrl}/attendance/${attendanceDocsFormData.postId}/upload/${attendanceDocsFormData.month}/${attendanceDocsFormData.year}`,
        attendanceDocsFormData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            'x-access-token': token,
          },
        }
      );
      if (response.data.success) {
        toast.success(response.data.message);
        // console.log('response data ', response.data.docAttendance);
        setAttendanceDocsFormData({
          docAttendance: response.data.docAttendance,
          postId: 0,
          month: 0,
          year: 0,
        });
      }
    } catch (error) {
      handleAxiosError(error as AxiosError);
    } finally {
      setIsLoading(false);
    }
  };

  /* Delete Attendance Doc Modal Handling */
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [deleteFileName, setDeleteFileName] = useState<string>('');
  const handleDeleteFile = async (fieldName: string) => {
    if (!token || !currentSelectedPostId || !selectedDate) return;
    setIsLoading(true);
    try {
      const response = await axios.delete(
        `${api.baseUrl}/attendance-doc/${currentSelectedPostId}/${selectedDate?.getMonth() + 1}/${selectedDate?.getFullYear()}`,
        {
          headers: {
            'x-access-token': token,
          },
        }
      );

      if (response.data && response.data.success) {
        toast.success(response.data.message);
        setAttendanceDocsFormData((prevData) => ({
          ...prevData,
          [fieldName]: '',
        }));
      }
    } catch (error) {
      handleAxiosError(error as AxiosError);
    } finally {
      setShowDeleteModal(false);
      setIsLoading(false);
    }
  };

  /* Payroll Generate or View  */
  const [existingPayrollData, setExistingPayrollData] = useState<Payroll[]>([]);
  const generateNewPayroll = async (postId: number) => {
    console.log('Generating new payroll...');
    if (!token || !selectedDate) return;
    setIsLoading(true);

    try {
      const response = await axios.post(
        `${api.baseUrl}/payrolls`,
        {
          postId: postId,
          month: selectedDate.getMonth() + 1,
          year: selectedDate.getFullYear(),
        },
        {
          headers: { 'x-access-token': token },
        }
      );
      console.log('generate new payroll response::: ', response.data);
      if (response.data && response.data.success) {
        // setShowPayrollTable(true);
        toast.success(response.data.message);
        setExistingPayrollData(response.data.payrolls);
        fetchAttendanceAndPayrollStatus(
          selectedDate.getMonth() + 1,
          selectedDate.getFullYear()
        );
        // setPayrollData(response.data.payrolls);
      } else {
        // toast.error(response.data.message);
        console.error('Error:', response.data.message);
      }
    } catch (error) {
      // setExistingPayrollData([]);
      if (error instanceof Yup.ValidationError) {
        handleYupError(error);
      } else {
        handleAxiosError(error as AxiosError);
        if (error instanceof AxiosError && error.status === 404) {
          // toast.error('Payroll not found for the selected month and post.');
          setCurrentView(View.Status);
        }
      }
    } finally {
      // fetchExistingPayroll(true); // Pass true to indicate fetch after creation
      // setPayrollData([]);
      setIsLoading(false);
    }
  };

  const handlePayrollGenerateRequest = async (
    postId: number,
    month: number,
    year: number
  ) => {
    if (!token) return;
    console.log(
      'inside handlePayrollGenerateRequest, postId: ',
      postId,
      'month: ',
      month,
      'year: ',
      year
    );
    // setPayrollGenerateRequest(true);
    // setCurrentSelectedPostId(postId);
    // setSelectedDate(new Date(year, month - 1));
    setCurrentView(View.Payroll);
    generateNewPayroll(postId);
  };
  const fetchExistingPayroll = async (
    afterCreation = false,
    postId?: number,
    month?: number,
    year?: number
  ) => {
    console.log('fetching existing payroll...');

    if (!token) return;
    setIsLoading(true);
    try {
      const response = await axios.get(
        `${api.baseUrl}/payrolls/${postId ? postId : currentSelectedPostId}/${month ? month : selectedDate.getMonth() + 1}/${year ? year : selectedDate.getFullYear()}`,
        {
          headers: { 'x-access-token': token },
        }
      );
      if (response.data && response.data.success) {
        console.log('what are payrolls: ', response.data.payrolls);
        if (!afterCreation) {
          toast.success(response.data.message);
        }
        setExistingPayrollData(response.data.payrolls);
        // setShowPayrollTable(true);
        if (!('netPay' in response.data.payrolls[0])) {
          // setIsGenerateButtonEnabled(true);
        }
        // setShowPayrollStatusButton(true);
      } else {
        console.error('Error:', response.data.message);
      }
    } catch (error) {
      if (error instanceof Yup.ValidationError) {
        handleYupError(error);
      } else {
        setExistingPayrollData([]);
        // fetchPayrollStatus(
        //   currentSelectedDate.getMonth() + 1,
        //   currentSelectedDate.getFullYear()
        // );
        // setShowPayrollStatusButton(false);
        handleAxiosError(error as AxiosError);
      }
    } finally {
      setIsLoading(false);
    }
  };
  const handleViewPayrollRequest = async (
    postId: number,
    month: number,
    year: number
  ) => {
    if (!token) return;
    console.log(
      'inside handleViewPayrollRequest, postId: ',
      postId,
      'month: ',
      month,
      'year: ',
      year
    );
    setCurrentSelectedPostId(postId);
    fetchExistingPayroll(false, postId, month, year);
    setCurrentView(View.Payroll);
  };
  /* Payroll Update / Edit */
  const [payrollUpdateData, setPayrollUpdateData] = useState<PayrollUpdate[]>([
    initialPayrollUpdateData,
  ]);
  const [isEditingPayroll, setIsEditingPayroll] = useState(false);
  const handleEditPayroll = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsKebabModalOpen(false);
    setPayrollUpdateData(
      existingPayrollData.map((payroll) => ({
        ID: payroll.ID,
        bonus: payroll.bonus,
        extraDuty: payroll.extraDuty,
        advance: payroll.advance,
        beltDeduction: payroll.beltDeduction,
        bootDeduction: payroll.bootDeduction,
        uniformDeduction: payroll.uniformDeduction,
        otherDeduction: payroll.otherDeduction,
        weeklyOff: payroll.weeklyOff,
        specialAllowance: payroll.specialAllowance,
        esi: payroll.esi,
        pTax: payroll.pTax,
      }))
    );
    setIsEditingPayroll(true);
  };
  const handlePayrollUpdateDataChange = (data: PayrollUpdate[]) => {
    setPayrollUpdateData(data);
  };
  const updatePayroll = async (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const hasErrors = false;
    // const newErrors: string[] = [];

    // Validate each row
    // for (let i = 0; i < payrollUpdateData.length; i++) {
    //   try {
    //     await payrollUpdateValidationSchema.validate(payrollUpdateData[i], {
    //       abortEarly: false,
    //     });
    //   } catch (error) {
    //     if (error instanceof Yup.ValidationError) {
    //       hasErrors = true;
    //       error.inner.forEach((err) => {
    //         if (err.message) newErrors.push(err.message); // TODO: Push error row here
    //       });
    //     }
    //   }
    // }
    if (hasErrors) {
      // setErrors(newErrors);
      // toast.error('Please fill all required fields.');
    } else {
      setErrors({});
      try {
        const response = await axios.patch(
          `${api.baseUrl}/payrolls`,
          payrollUpdateData,
          { headers: { 'x-access-token': token } }
        );

        if (response.status === 200) {
          toast.success(response.data.message);
          setPayrollUpdateData([initialPayrollUpdateData]);
          fetchExistingPayroll(true);
          setIsEditingPayroll(false);
          setSearchPayrollValue('');
        } else {
          toast.error('Failed to update payrolls');
        }
      } catch (error) {
        if (error instanceof Yup.ValidationError) {
          handleYupError(error);
        } else {
          handleAxiosError(error as AxiosError);
        }
      }
    }
  };
  const handleCancelEditPayroll = (e: React.MouseEvent) => {
    e.stopPropagation();
    setErrors({});
    setPayrollUpdateData(
      existingPayrollData.map((payroll) => ({
        ID: payroll.ID,
        bonus: payroll.bonus,
        extraDuty: payroll.extraDuty,
        advance: payroll.advance,
        beltDeduction: payroll.beltDeduction,
        bootDeduction: payroll.bootDeduction,
        uniformDeduction: payroll.uniformDeduction,
        otherDeduction: payroll.otherDeduction,
        weeklyOff: payroll.weeklyOff,
        specialAllowance: payroll.specialAllowance,
        esi: payroll.esi,
        pTax: payroll.pTax,
      }))
    );
    setIsEditingPayroll(false);
  };

  /* Payroll Pagination */
  const [currentPayrolls, setCurrentPayrolls] = useState<Payroll[]>([]);
  const [itemsPerPage] = useState(600);

  /* Payroll Search / Filter  */
  const [searchPayrollValue, setSearchPayrollValue] = useState('');
  const [filteredPayrollData, setFilteredPayrollData] = useState<Payroll[]>(
    existingPayrollData ?? []
  );
  const handleFilterPayroll: (
    payrollData: Payroll[],
    searchValue: string
  ) => Payroll[] = (payrollData: Payroll[], searchValue: string) => {
    const trimmedSearchValue = searchValue.trim();
    const filteredData = trimmedSearchValue
      ? payrollData.filter(
          (payroll) =>
            payroll.empName
              .toLowerCase()
              .includes(trimmedSearchValue.toLowerCase()) ||
            payroll.empId
              .toLowerCase()
              .toString()
              .includes(trimmedSearchValue) ||
            payroll.post
              .toLowerCase()
              .toString()
              .includes(trimmedSearchValue) ||
            payroll.rank
              .toLowerCase()
              .toString()
              .includes(trimmedSearchValue) ||
            payroll.workingDays.toString().includes(trimmedSearchValue) ||
            payroll.basicSalary.toString().includes(trimmedSearchValue) ||
            payroll.fourHourPay.toString().includes(trimmedSearchValue) ||
            payroll.eightHourPay.toString().includes(trimmedSearchValue) ||
            payroll.hra.toString().includes(trimmedSearchValue) ||
            payroll.conveyance.toString().includes(trimmedSearchValue) ||
            payroll.kitWashingAllowance
              .toString()
              .includes(trimmedSearchValue) ||
            payroll.uniformAllowance.toString().includes(trimmedSearchValue) ||
            payroll.cityAllowance.toString().includes(trimmedSearchValue) ||
            payroll.vda.toString().includes(trimmedSearchValue) ||
            payroll.otherAllowance.toString().includes(trimmedSearchValue) ||
            payroll.grossPay.toString().includes(trimmedSearchValue) ||
            payroll.extraDuty.toString().includes(trimmedSearchValue) ||
            payroll.advance.toString().includes(trimmedSearchValue) ||
            payroll.esi.toString().includes(trimmedSearchValue) ||
            payroll.epf.toString().includes(trimmedSearchValue) ||
            payroll.otherDeduction.toString().includes(trimmedSearchValue) ||
            payroll.totalDeduction.toString().includes(trimmedSearchValue) ||
            payroll.pTax.toString().includes(trimmedSearchValue) ||
            payroll.netPay.toString().includes(trimmedSearchValue)
        )
      : existingPayrollData;
    return filteredData;
  };
  useEffect(() => {
    const filteredData = handleFilterPayroll(
      existingPayrollData,
      searchPayrollValue
    );
    setFilteredPayrollData(filteredData);
  }, [existingPayrollData, searchPayrollValue, setFilteredPayrollData]);
  const handleSearchPayrollInputChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setSearchPayrollValue(e.target.value);
  };

  /* Kebab Modal Handling */
  const [isKebabModalOpen, setIsKebabModalOpen] = useState(false);
  const kebabModalRef = useRef<HTMLDivElement>(null);
  useClickOutside(kebabModalRef, () => setIsKebabModalOpen(false));

  /* Export PDF and CSV */
  const handleExportPDF = () => {
    try {
      const doc = new jsPDF('landscape', 'pt', 'A3');
      autoTable(doc, {
        // startY: 30,
        head: [
          [
            { content: 'Sl No', rowSpan: 2 },
            { content: 'Emp Name', rowSpan: 2 },
            { content: 'Emp ID', rowSpan: 2 },
            { content: 'Posting', rowSpan: 2 },
            { content: 'Rank', rowSpan: 2 },
            { content: 'Earnings', colSpan: 5 },
            { content: 'Allowances', colSpan: 7 },
            { content: 'Gross Pay', rowSpan: 2 },
            { content: 'Extra Duty', rowSpan: 2 },
            { content: 'Advance', rowSpan: 2 },
            { content: 'Deduction', colSpan: 4 },
            { content: 'Other Deduction', rowSpan: 2 },
            { content: 'Total Deduction', rowSpan: 2 },
            { content: 'P.Tax', rowSpan: 2 },
            { content: 'Net Pay', rowSpan: 2 },
          ],
          [
            'Working Days',
            'Basic Salary',
            '4 Hour Pay',
            '8 Hour Pay',
            'Bonus',
            'House Rent',
            'Conveyance',
            'Kit/Washing Allowance',
            'Uniform',
            'City Allowance',
            'VDA',
            'Others',
            'ESI',
            'EPF',

            'Belt',
            'Boot',
          ],
        ],
        body: existingPayrollData.map((payroll, index) => [
          index + 1,
          payroll.empName,
          payroll.empId,
          payroll.post,
          payroll.rank,
          payroll.workingDays,
          'Rs. ' + payroll.basicSalary.toFixed(2),
          'Rs. ' + payroll.fourHourPay.toFixed(2),
          'Rs. ' + payroll.eightHourPay.toFixed(2),
          'Rs. ' + payroll.bonus.toFixed(2),
          'Rs. ' + payroll.hra.toFixed(2),
          'Rs. ' + payroll.conveyance.toFixed(2),
          'Rs. ' + payroll.kitWashingAllowance.toFixed(2),
          'Rs. ' + payroll.uniformAllowance.toFixed(2),
          'Rs. ' + payroll.cityAllowance.toFixed(2),
          'Rs. ' + payroll.vda.toFixed(2),
          'Rs. ' + payroll.otherAllowance.toFixed(2),
          'Rs. ' + payroll.grossPay.toFixed(2),
          'Rs. ' + payroll.extraDuty.toFixed(2),
          'Rs. ' + payroll.advance.toFixed(2),
          'Rs. ' + payroll.esi.toFixed(2),
          'Rs. ' + payroll.epf.toFixed(2),
          //////
          // TODO: Add belt
          'Rs. ' + payroll.bonus.toFixed(2),
          // TODO: Add boot
          'Rs. ' + payroll.epf.toFixed(2),
          //////
          'Rs. ' + payroll.otherDeduction.toFixed(2),
          'Rs. ' + payroll.totalDeduction.toFixed(2),
          'Rs. ' + payroll.pTax.toFixed(2),
          'Rs. ' + payroll.netPay.toFixed(2),
        ]),
        theme: 'grid',
        headStyles: {
          fillColor: '#f5f5f5',
          textColor: '#212529',
          fontSize: 8,
          halign: 'center',
          lineWidth: 0.001,
          lineColor: '#80858A',
        },
        bodyStyles: {
          fillColor: '#fff',
          textColor: '#212529',
          fontSize: 8,
          halign: 'center',
          // cellPadding: 4,
        },
        columnStyles: {
          0: { cellWidth: 35 },
          1: { cellWidth: 45 },
          2: { cellWidth: 45 },
          3: { cellWidth: 45 },
          4: { cellWidth: 45 },
          5: { cellWidth: 35 },
          6: { cellWidth: 45 },
          7: { cellWidth: 45 },
          8: { cellWidth: 45 },
          9: { cellWidth: 45 },
          10: { cellWidth: 45 },
          11: { cellWidth: 45 },
          12: { cellWidth: 45 },
          13: { cellWidth: 45 },
          14: { cellWidth: 45 },
          15: { cellWidth: 45 },
          16: { cellWidth: 45 },
          17: { cellWidth: 45 },
          18: { cellWidth: 35 },
          19: { cellWidth: 35 },
          20: { cellWidth: 45 },
          21: { cellWidth: 45 },
          22: { cellWidth: 45 },
          23: { cellWidth: 45 },
          24: { cellWidth: 35 },
          25: { cellWidth: 35 },
          26: { cellWidth: 35 },
          27: { cellWidth: 35 },
        },
        didDrawPage: (data) => {
          doc.setFontSize(12);
          doc.text('PayRoll_Report', data.settings.margin.left, 10);
        },
        margin: { top: 30, bottom: 20, left: 5, right: 5 },
        // styles: { overflow: 'linebreak' },
      });

      doc.save('payroll_data.pdf');
    } catch (error) {
      handleAxiosError(error as AxiosError);
      console.error('Error generating PDF:', error);
    } finally {
      setIsKebabModalOpen(false);
    }
  };

  const getCSVData = () => {
    const csvHeaders = [
      { label: 'Sl No', key: 'slNo' },
      { label: 'Emp Name', key: 'empName' },
      { label: 'Emp ID', key: 'empId' },
      { label: 'Posting', key: 'post' },
      { label: 'Rank', key: 'rank' },
      { label: 'Working Days', key: 'workingDays' },
      { label: 'Basic Salary', key: 'basicSalary' },
      { label: '4 Hour Pay', key: 'fourHourPay' },
      { label: '8 Hour Pay', key: 'eightHourPay' },
      { label: 'Bonus', key: 'bonus' },
      { label: 'House Rent', key: 'hra' },
      { label: 'Conveyance', key: 'conveyance' },
      { label: 'Kit/Washing Allowance', key: 'kitWashingAllowance' },
      { label: 'Uniform', key: 'uniformAllowance' },
      { label: 'City Allowance', key: 'cityAllowance' },
      { label: 'VDA', key: 'vda' },
      { label: 'Other', key: 'otherAllowance' },
      { label: 'Gross Pay', key: 'grossPay' },
      { label: 'Extra Duty', key: 'extraDuty' },
      { label: 'Advance', key: 'advance' },
      { label: 'ESI', key: 'esi' },
      { label: 'EPF', key: 'epf' },

      { label: 'Belt', key: 'belt' },

      { label: 'Boot', key: 'boot' },
      { label: 'Other Deduction', key: 'otherDeduction' },
      { label: 'Total Deduction', key: 'totalDeduction' },
      { label: 'P.Tax', key: 'pTax' },
      { label: 'Net Pay', key: 'netPay' },
      // Add more headers as needed
    ];
    const csvData = existingPayrollData.map((payroll, index) => ({
      slNo: index + 1,
      empName: payroll.empName,
      empId: payroll.empId,
      post: payroll.post,
      rank: payroll.rank,
      workingDays: payroll.workingDays,
      basicSalary: payroll.basicSalary,
      fourHourPay: payroll.fourHourPay,
      eightHourPay: payroll.eightHourPay,
      bonus: payroll.bonus,
      hra: payroll.hra,
      conveyance: payroll.conveyance,
      kitWashingAllowance: payroll.kitWashingAllowance,
      uniformAllowance: payroll.uniformAllowance,
      cityAllowance: payroll.cityAllowance,
      vda: payroll.vda,
      otherAllowance: payroll.otherAllowance,
      grossPay: payroll.grossPay,
      extraDuty: payroll.extraDuty,
      advance: payroll.advance,
      esi: payroll.esi,
      epf: payroll.epf,
      // TODO: belt
      belt: payroll.epf,
      // TODO: boot
      boot: payroll.epf,
      otherDeduction: payroll.otherDeduction,
      totalDeduction: payroll.totalDeduction,
      pTax: payroll.pTax,
      netPay: payroll.netPay,
      // Add more fields as needed
    }));

    return { csvHeaders, csvData };
  };

  /* Test Use Effect */
  useEffect(() => {
    console.log('canAttendanceBeEdited:', canAttendanceBeEdited);
  }, []);

  /** Delete Payroll */
  const handleDeletePayrollRequest = async (
    postId: number,
    month: number,
    year: number
  ) => {
    if (!token) return;
    setIsLoading(true);
    try {
      console.log(
        'inside handleDeletePayrollRequest, postId: ',
        postId,
        'month: ',
        month,
        'year: ',
        year
      );
      const response = await axios.delete(
        `${api.baseUrl}/payrolls/${postId ? postId : currentSelectedPostId}/${month ? month : selectedDate.getMonth() + 1}/${year ? year : selectedDate.getFullYear()}`,
        {
          headers: { 'x-access-token': token },
        }
      );
      if (response.data && response.data.success) {
        toast.success(response.data.message);
        fetchAttendanceAndPayrollStatus(
          selectedDate.getMonth() + 1,
          selectedDate.getFullYear()
        );
      }
    } catch (error) {
      handleAxiosError(error as AxiosError);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAttendanceRequest = async (
    postId: number,
    month: number,
    year: number
  ) => {
    if (!token) return;
    setIsLoading(true);
    try {
      const response = await axios.delete(
        `${api.baseUrl}/attendance/${postId}/${month}/${year}`,
        {
          headers: { 'x-access-token': token },
        }
      );
      if (response.data && response.data.success) {
        toast.success(response.data.message);
        fetchAttendanceAndPayrollStatus(
          selectedDate.getMonth() + 1,
          selectedDate.getFullYear()
        );
      }
    } catch (error) {
      handleAxiosError(error as AxiosError);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdatePostReport = async (postId: number, reportCode: string) => {
    if (!token) return;
    console.log(
      'Updating post report type, postId: ',
      postId,
      'reportType: ',
      reportCode
    );
    setIsLoading(true);
    try {
      const response = await axios.patch(
        `${api.baseUrl}/posts/${postId}/report-type`,
        { reportName: reportCode },
        {
          headers: { 'x-access-token': token },
        }
      );
      if (response.data && response.data.success) {
        toast.success(response.data.message);
        fetchAttendanceAndPayrollStatus(
          selectedDate.getMonth() + 1,
          selectedDate.getFullYear()
        );
      }
    } catch (error) {
      handleAxiosError(error as AxiosError);
      ``;
    } finally {
      setIsLoading(false);
    }
  };

  /* JSX */
  return (
    <>
      {isLoading && <Loader />}
      <div className="h-[calc(100vh-70px)] flex flex-col">
        <div className="flex-none">
          {/* <div className="flex flex-col gap-2.5 2xl:gap-4 fixed z-20 padding-responsive-header-container-type-1"> */}
          <div
            className={`flex flex-col w-[calc(100%-64px)] 2xl:w-[calc(100%-82px)] z-20 fixed padding-responsive-header-container-type-1`}
          >
            {/* Bread Crumb */}
            <div>
              <BreadCrumb />
            </div>
            {/* Top Bar */}
            {currentView === View.Status && (
              <div className="flex flex-col md:flex-row gap-4 2xl:gap-6 py-1 2xl:py-2 ">
                {/* <div className="flex flex-col md:flex-row gap-4 2xl:gap-6 py-1 2xl:py-2 pb-0.5 2xl:pb-1"> */}
                <SearchAttendancePosts
                  reset={resetCurrentPost}
                  onDebouncedSearch={(debouncedTerm) =>
                    handleSearchPost(debouncedTerm)
                  }
                />
                <DatePickerComp
                  label="Select Date"
                  onChangeDate={handleDateChange}
                  externalSelectedDate={selectedDate}
                />
              </div>
            )}
          </div>
          <div className="mt-[2.6%] ">
            {/* Attendance back and upload button */}
            {currentView === View.Attendance && (
              <div className="flex flex-col justify-between md:flex-row gap-2 2xl:gap-4 px-4 2xl:px-8">
                <button
                  onClick={() => {
                    setResetCurrentPost(true);
                    setCurrentView(View.Status);
                    setTimeout(() => setResetCurrentPost(false), 100);
                  }}
                  className="flex items-center gap-1 2xl:gap-2"
                >
                  <img
                    src={Arrow_Back_Blue}
                    alt="Back"
                    className="back-button-icon"
                  />
                  <button className="text-bgPrimaryButton hover:text-bgPrimaryButtonHover font-Mona_Sans text-sm 2xl:text-base font-semibold">
                    Back
                  </button>
                </button>

                <div className="w-[30%] flex justify-end">
                  {existingAttendanceData &&
                    existingAttendanceData.length > 0 && (
                      <div className={`flex flex-col ml-2 gap-2`}>
                        <div className="flex flex-col gap-2 cursor-pointer">
                          <input
                            id="docAttendance"
                            type="file"
                            name="docAttendance"
                            onChange={handleFilesInputChange}
                            className="hidden"
                            accept=".pdf,.jpg,.jpeg,.png,.doc,.docx,.xls,.xlsx"
                          />
                          <div className="flex flex-row gap-2">
                            {attendanceDocsFormData.docAttendance &&
                            typeof attendanceDocsFormData.docAttendance ===
                              'string' ? (
                              <div className="flex gap-2">
                                <a
                                  href={attendanceDocsFormData.docAttendance}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center gap-1 2xl:gap-2 px-2 h-10 2xl:h-12 rounded-md shadow-sm border border-inputBorder cursor-pointer hover:shadow-md w-full"
                                >
                                  <img
                                    src={getFileIcon(
                                      extractFileNameFromPath(
                                        attendanceDocsFormData.docAttendance
                                      ) || ''
                                    )}
                                    alt="File Icon"
                                    className="icon-responsive-button"
                                  />
                                  <span className="text-labelColour font-medium text-responsive-input overflow-hidden text-ellipsis">
                                    {extractFileNameFromPath(
                                      attendanceDocsFormData.docAttendance
                                    ) || 'Upload Document'}
                                  </span>
                                </a>
                                <button
                                  onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    // handleDeleteFile('docAttendance');
                                    setDeleteFileName('docAttendance');
                                    setShowDeleteModal(true);
                                  }}
                                >
                                  <img
                                    src={Delete_Icon}
                                    alt="Delete"
                                    className="w-4 xl:w-5 2xl:w-6 h-4 xl:h-5 2xl:h-6"
                                  />
                                </button>
                              </div>
                            ) : attendanceDocsFormData.docAttendance &&
                              attendanceDocsFormData.docAttendance instanceof
                                File &&
                              attendanceDocsFormData.docAttendance.name !==
                                '' ? (
                              <label
                                htmlFor="docAttendance"
                                className="flex items-center gap-1 2xl:gap-2 px-2 h-8 2xl:h-10 rounded-md shadow-sm border border-inputBorder cursor-pointer hover:shadow-md w-full"
                              >
                                <img
                                  src={getFileIcon(
                                    extractNameFromFileObj(
                                      attendanceDocsFormData.docAttendance as File
                                    ) || ''
                                  )}
                                  alt="File Icon"
                                  className="icon-responsive-button"
                                />
                                <span className="text-labelColour font-medium text-responsive-input overflow-hidden text-ellipsis">
                                  {extractNameFromFileObj(
                                    attendanceDocsFormData.docAttendance as File
                                  )}
                                </span>
                              </label>
                            ) : (
                              <label
                                htmlFor="docAttendance"
                                className="flex items-center gap-1 2xl:gap-2 px-2 h-8 2xl:h-10 rounded-md shadow-sm border border-inputBorder cursor-pointer hover:shadow-md w-full"
                              >
                                <img
                                  src={getFileIcon('')}
                                  alt="File Icon"
                                  className="icon-responsive-button"
                                />
                                <span className="text-labelColour font-medium text-responsive-input overflow-hidden text-ellipsis">
                                  Upload Attendance
                                </span>
                              </label>
                            )}
                          </div>
                        </div>
                        {showDeleteModal && (
                          <ConfirmationModal
                            confirmButtonTitle="Delete"
                            cancelButtonTitle="Cancel"
                            onConfirm={() => {
                              handleDeleteFile(deleteFileName);
                            }}
                            onCancel={() => setShowDeleteModal(false)}
                            message={`Are you sure you want to delete the ${getLabel(deleteFileName)}?`}
                          />
                        )}
                      </div>
                    )}
                </div>
              </div>
            )}
            {/* Payroll back and upload button */}
            {currentView === View.Payroll && (
              <div className="flex flex-col items-center justify-between md:flex-row gap-2 2xl:gap-4 px-4 2xl:px-8">
                {/* Back button */}
                <button
                  onClick={() => {
                    setResetCurrentPost(true);
                    setCurrentView(View.Status);
                    setTimeout(() => setResetCurrentPost(false), 100);
                  }}
                  className="flex items-center gap-1 2xl:gap-2"
                >
                  <img
                    src={Arrow_Back_Blue}
                    alt="Back"
                    className="back-button-icon"
                  />
                  <button className="text-bgPrimaryButton hover:text-bgPrimaryButtonHover font-Mona_Sans text-sm 2xl:text-base font-semibold">
                    Back
                  </button>
                </button>
                <SearchCompo
                  searchValue={searchPayrollValue}
                  handleSearchInputChange={handleSearchPayrollInputChange}
                />
                {/* Summary text */}
                <div className="text-primaryText text-sm md:text-base font-medium ml-2 flex-1 text-center">
                  {/* Payroll &nbsp;for post&nbsp;
                  {
                    allPostsData.find(
                      (post) => post.ID === currentSelectedPostId
                    )?.postName
                  }
                  &nbsp;for the month of {getMonthName(selectedDate.getMonth())}
                  &nbsp;
                  {selectedDate.getFullYear()} */}
                </div>

                {/* Right side: Edit / Save / Kebab */}
                <div className="flex items-center gap-4 relative">
                  {!isEditingPayroll ? (
                    <>
                      <SavePayrollButton
                        onClick={handleEditPayroll}
                        icon={Edit_Icon_Blue}
                      >
                        Edit
                      </SavePayrollButton>

                      {existingPayrollData.length > 0 &&
                        'netPay' in existingPayrollData[0] && (
                          <div className="relative" ref={kebabModalRef}>
                            <button onClick={() => setIsKebabModalOpen(true)}>
                              <img
                                src={TableOptionsIcon}
                                alt="Options"
                                className="icon-responsive-button"
                              />
                            </button>
                            {isKebabModalOpen && (
                              <div className="absolute top-8 right-0 w-48 bg-white border border-gray-300 shadow-lg z-30">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    e.preventDefault();
                                    handleExportPDF();
                                  }}
                                  className="flex gap-2 items-center w-full px-4 py-2 text-secondaryText hover:bg-gray-100"
                                >
                                  <img
                                    src={PDFIcon}
                                    alt="PDF"
                                    className="w-4 h-4"
                                  />
                                  <span>Export as PDF</span>
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setIsKebabModalOpen(false);
                                  }}
                                >
                                  <CSVLink
                                    data={getCSVData().csvData}
                                    headers={getCSVData().csvHeaders}
                                    filename="payroll_data.csv"
                                    className="flex gap-2 items-center w-full px-4 py-2 text-secondaryText hover:bg-gray-100"
                                  >
                                    <img
                                      src={DownloadIcon}
                                      alt="Excel"
                                      className="w-4 h-4"
                                    />
                                    <span>Export as Excel</span>
                                  </CSVLink>
                                </button>
                              </div>
                            )}
                          </div>
                        )}
                    </>
                  ) : (
                    <>
                      <SavePayrollButton
                        onClick={updatePayroll}
                        icon={SaveIcon}
                      >
                        Save
                      </SavePayrollButton>
                      <PrimaryButton onClick={handleCancelEditPayroll}>
                        Cancel
                      </PrimaryButton>
                    </>
                  )}
                </div>
              </div>
            )}
            {/* Status table */}
            {currentView === View.Status && (
              <AttendanceAndPayrollStatus
                date={{
                  month: selectedDate
                    ? getMonthName(selectedDate.getMonth())
                    : getMonthName(new Date().getMonth()),
                  year: selectedDate
                    ? selectedDate.getFullYear()
                    : new Date().getFullYear(),
                }}
                // statusData={attendanceAndPayrollStatusData}
                // statusData={
                //   filteredStatusData.length > 0
                //     ? filteredStatusData
                //     : attendanceAndPayrollStatusData
                // } // Use filtered data if available
                statusData={
                  searchStatusTerm.trim()
                    ? filteredStatusData
                    : attendanceAndPayrollStatusData
                }
                reportTypes={reportTypesList}
                onClickPost={handleClickPostNameFromStatus}
                onClickGenerate={handlePayrollGenerateRequest}
                onClickViewPayroll={handleViewPayrollRequest}
                onClickDeleteAttendance={handleDeleteAttendanceRequest}
                onClickDeletePayroll={handleDeletePayrollRequest}
                onClickSetReportType={handleUpdatePostReport}
              />
            )}
            {/* Attendance table */}
            {currentView === View.Attendance && (
              <>
                <div className="flex flex-col gap-4 2xl:gap-6 mt-[1.25%]">
                  <p className="font-semibold text-primaryText text-sm 2xl:text-base h-10 2xl:h-14 padding-responsive-header-container-type-1 bg-tableHeadingColour">
                    Attendance –{' '}
                    {
                      allPostsData.find(
                        (post) => post.ID === currentSelectedPostId
                      )?.postName
                    }{' '}
                    - {getMonthName(selectedDate.getMonth())}{' '}
                    {selectedDate.getFullYear()}
                  </p>
                  <AttendanceTable
                    initialAttendanceData={attendanceScheduleData}
                    // TODO: need to check types
                    existingAttendanceData={existingAttendanceData}
                    refreshAttendanceData={refreshAttendanceData}
                    defaultWorkingDays={
                      getDaysInMonth(selectedDate as Date) || 0
                    }
                    month={selectedDate ? selectedDate.getMonth() + 1 : 0}
                    year={selectedDate?.getFullYear() || 0}
                    postId={currentSelectedPostId}
                    canAttendanceBeEdited={canAttendanceBeEdited}
                    allowAttendanceEdit={allowAttendanceEdit}
                    refreshAttendanceAndPayrollStatus={
                      fetchAttendanceAndPayrollStatus
                    }
                    currentPostName={
                      allPostsData.find(
                        (post) => post.ID === currentSelectedPostId
                      )?.postName
                    }
                  />
                </div>
              </>
            )}
            {/* Payroll table */}
            {currentView === View.Payroll && (
              <>
                {/* <Accordion
                  title={`Payroll – ${
                    allPostsData.find(
                      (post) => post.ID === currentSelectedPostId
                    )?.postName
                  } - ${getMonthName(selectedDate.getMonth())} ${selectedDate.getFullYear()}`}
                  disabled={false}
                > */}
                {/* <div className="md:w-[320px] h-[32px] relative">
                  <input
                    type="search"
                    name="payrollSearch"
                    onChange={handleSearchPayrollInputChange}
                    placeholder="Search"
                    id=""
                    className="w-full h-full rounded-full bg-transparent text-sm  border border-inputBorder pl-10 pr-4 focus:outline-offset-1 focus:outline-inputBorder"
                  />
                  <img
                    src={SearchIcon}
                    alt="SearchIcon"
                    className="absolute top-2 md:top-3 lg:top-2 left-4 w-4 h-4 "
                  />
                </div> */}
                <div className="flex flex-col gap-4 2xl:gap-6 mt-[1.25%]">
                  {/* title */}
                  <p className="font-semibold text-primaryText text-sm 2xl:text-base h-10 2xl:h-14 padding-responsive-header-container-type-1 bg-tableHeadingColour">
                    Payroll –{' '}
                    {
                      allPostsData.find(
                        (post) => post.ID === currentSelectedPostId
                      )?.postName
                    }{' '}
                    - {getMonthName(selectedDate.getMonth())}{' '}
                    {selectedDate.getFullYear()}
                  </p>
                  {filteredPayrollData.length > 0 ? (
                    <>
                      <PayRollTable
                        updatePayrollUpdateData={handlePayrollUpdateDataChange}
                        isEditingPayroll={isEditingPayroll}
                        currentSelectedPostId={currentSelectedPostId}
                        currentSelectedDate={selectedDate as Date}
                        existingPayrolls={currentPayrolls}
                        payrollUpdateData={payrollUpdateData}
                      />

                      {typeof errors === 'object' &&
                        Object.keys(errors).length > 0 && (
                          <div className="text-red-500 mt-4 text-left">
                            {Object.values(errors).map((error, index) => (
                              <p key={index}>{error}</p>
                            ))}
                          </div>
                        )}
                      <div className="px-8">
                        <Pagination
                          data={filteredPayrollData}
                          itemsPerPage={itemsPerPage}
                          onPageChange={setCurrentPayrolls}
                        />
                      </div>
                    </>
                  ) : (
                    <NoSearchResultPage />
                  )}
                </div>
                {/* <PayRollTable
                  updatePayrollUpdateData={handlePayrollUpdateDataChange}
                  isEditingPayroll={isEditingPayroll}
                  currentSelectedPostId={currentSelectedPostId}
                  currentSelectedDate={selectedDate as Date}
                  existingPayrolls={currentPayrolls}
                  payrollUpdateData={payrollUpdateData}
                />

                {typeof errors === 'object' &&
                  Object.keys(errors).length > 0 && (
                    <div className="text-red-500 mt-4 text-left">
                      {Object.values(errors).map((error, index) => (
                        <p key={index}>{error}</p>
                      ))}
                    </div>
                  )}
                <Pagination
                  data={filteredPayrollData}
                  itemsPerPage={itemsPerPage}
                  onPageChange={setCurrentPayrolls}
                /> */}
                {/* </Accordion> */}
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default AttendanceAndPayroll;
