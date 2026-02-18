// Libraries
import React, { useEffect, useState, useRef } from 'react';
// import { jsPDF } from 'jspdf';
// import html2canvas from 'html2canvas';

// Hooks / Store
import useScrollToTop from '../../../hooks/useScrollToTop';
import usePostStore from '../../../store/post';
import { useAppStore } from '../../../store/app';

// UI Components
import BreadCrumb from '../../../common/BreadCrumb/BreadCrumb';
import DatePickerComp from '../../../common/AttendanceDatePicker/DatePickerComp';
import ClearButton from '../../../common/Button/ClearButton';
import PostSelectDropdown from '../../../common/DropDownInput/PostSelectDropdown';
import ReportSelectDropDown from '../../../common/ReportSelectDropDown/ReportSelectDropDown';
import Loader from '../../../common/Loader/Loader';
import MultiPostSelectDropdown from '../../../common/DropDownInput/MultiPostSelectDropdown';

// New Report Components
import ViewDSReport from './components/ViewDSReport/ViewDSReport';
import WithoutAllowanceReport from './components/WithoutAllowanceReport/WithoutAllowanceReport';
import NewPayrollReport from './components/NewPayrollReport/NewPayrollReport';
import DSLReport from './components/DSLReport/DSLReport';
import LNTReport from './components/LNTReport/LNTReport';
import OthersReport from './components/OthersReport/OthersReport';
import ESIReport from './components/ESIReport/ESIReport';
import EPFReport from './components/EPFReport/EPFReport';
import PTaxReport from './components/PTaxReport/PTaxReport';
import SalaryReport from './components/SalaryReport/SalaryReport';

// Old Report Components
// import ESIReport from './components/ESIReport';
// import WithoutAllowanceReport from './components/WithoutAllowanceReport';
// import NewPayrollReport from './components/NewPayrollReport';
// import DSLReport from './components/DSLReport';
// import LSTReport from './components/LSTReport';
// import OtherReport from './components/OtherReport';
// import EPFReport from './components/EPFReport';
// import SalaryReport from './components/SalaryReport';
// import PTaxReport from './components/PTaxReport';

// Content
import { reportType } from '../../../content/content';

// Assets
import { Select_Report } from '../../../assets/icons';

// Styles
import './Reports.css';
import { ReportName } from '../../../types/report';
import { useLocation } from 'react-router';

const Reports: React.FC = () => {
  // Call Hooks
  useScrollToTop();

  const location = useLocation();

  const { posts: allPostsData, isLoading, fetchAllPosts } = usePostStore();

  useEffect(() => {
    fetchAllPosts();
  }, [fetchAllPosts]);

  const { showMenu } = useAppStore();

  // Single Post type Report handling
  const [selectedPostName, setSelectedPostName] = useState<string | null>(null);
  const [selectedPostId, setCurrentSelectedPostId] = useState<number>(0);
  const updateSelectedPost = (postId: number) => {
    const selectedPostName =
      allPostsData.find((post) => post.ID === postId)?.postName || null;
    setSelectedPostName(selectedPostName);
    setCurrentSelectedPostId(postId);
  };

  // Multiple Post type Report handling
  const [selectedMultiPostIds, setSelectedMultiPostIds] = useState<number[]>(
    []
  );
  const updateSelectedPostIds = (postIds: number[]) => {
    setSelectedMultiPostIds(postIds);
  };

  // Report data handling
  const [selectedReportType, setSelectedReportType] = useState<string | null>(
    null
  );

  const updateSelectedReportType = (option: string | null) => {
    // Clear any existing report data when switching report types
    if (option !== selectedReportType) {
      setShowTable(false);
      // Clear all report data to prevent stale data from being displayed
      // This will be handled by the individual report components when they mount
    }
    setSelectedReportType(option);
  };

  // Date handling
  const [selectedDate, setSelectedDate] = useState<Date>(() => {
    const saved = localStorage.getItem('paytrack.reports.selectedDate');
    const parsed = saved ? new Date(saved) : new Date();
    return isNaN(parsed.getTime()) ? new Date() : parsed;
  });
  const updateSelectedDate = (date: Date) => {
    setSelectedDate(date);
    try {
      localStorage.setItem('paytrack.reports.selectedDate', date.toISOString());
    } catch {
      console.error('Error saving selected date to localStorage');
    }
  };

  // Preview Report
  const [showTable, setShowTable] = useState(false);
  const previewReport = () => {
    if (
      (!selectedPostId && !selectedMultiPostIds) ||
      !selectedDate ||
      !selectedReportType
    )
      return;
    setShowTable(true);
  };

  // Convert reportCode to ReportName enum value
  const reportTypeMapping: { [key: string]: string } = {
    VIEW_DS_REPORT: ReportName.VIEW_DS_REPORT,
    ESI_REPORT: ReportName.ESI_REPORT,
    EPF_REPORT: ReportName.EPF_REPORT,
    PTAX_REPORT: ReportName.PTAX_REPORT,
    WITHOUT_ALLOWANCE_REPORT: ReportName.WITHOUT_ALLOWANCE_REPORT,
    NEW_PAYROLL_REPORT: ReportName.NEW_PAYROLL_REPORT,
    DSL_REPORT: ReportName.DSL_REPORT,
    LNT_REPORT: ReportName.LNT_REPORT,
    OTHERS_REPORT: ReportName.OTHERS_REPORT,
    SALARY_REPORT: ReportName.SALARY_REPORT,
  };

  // Ref to prevent multiple data fetching
  const hasInitializedFromURL = useRef(false);

  // Render Report
  const renderReport = () => {
    switch (selectedReportType) {
      case ReportName.VIEW_DS_REPORT:
        return (
          <ViewDSReport
            currentSelectedPostId={selectedPostId}
            selectedPostName={selectedPostName}
            selectedDate={selectedDate}
          />
        );
      case ReportName.ESI_REPORT:
        return (
          <ESIReport
            // selectedPostName={''}
            selectedDate={selectedDate}
            selectedPostIds={selectedMultiPostIds}
          />
        );
      case ReportName.EPF_REPORT:
        return (
          <EPFReport
            selectedPostName={selectedPostName}
            selectedDate={selectedDate}
            selectedPostIds={selectedMultiPostIds}
          />
        );
      case ReportName.PTAX_REPORT:
        return (
          <PTaxReport
            // selectedPostName={selectedPostName}
            selectedDate={selectedDate}
            selectedPostIds={selectedMultiPostIds}
          />
        );
      case ReportName.SALARY_REPORT:
        return (
          <SalaryReport
            // selectedPostName={selectedPostName}
            selectedDate={selectedDate}
            selectedPostIds={selectedMultiPostIds}
          />
        );
      case ReportName.WITHOUT_ALLOWANCE_REPORT:
        return (
          <WithoutAllowanceReport
            currentSelectedPostId={selectedPostId}
            selectedPostName={selectedPostName}
            selectedDate={selectedDate}
          />
        );
      case ReportName.NEW_PAYROLL_REPORT:
        return (
          <NewPayrollReport
            currentSelectedPostId={selectedPostId}
            selectedPostName={selectedPostName}
            selectedDate={selectedDate}
          />
        );
      case ReportName.DSL_REPORT:
        return (
          <DSLReport
            currentSelectedPostId={selectedPostId}
            selectedPostName={selectedPostName}
            selectedDate={selectedDate}
          />
        );
      case ReportName.LNT_REPORT:
        return (
          <LNTReport
            currentSelectedPostId={selectedPostId}
            selectedPostName={selectedPostName}
            selectedDate={selectedDate}
          />
        );
      case ReportName.OTHERS_REPORT:
        return (
          <OthersReport
            currentSelectedPostId={selectedPostId}
            selectedPostName={selectedPostName}
            selectedDate={selectedDate}
          />
        );
      default:
        return null;
    }
  };

  // Consolidated useEffect to handle URL parameters and prevent multiple calls
  useEffect(() => {
    // Only run if posts are loaded and we haven't initialized from URL yet
    if (allPostsData.length === 0 || hasInitializedFromURL.current) return;

    const params = new URLSearchParams(location.search);
    const postId = Number(params.get('postId'));
    const reportTypeCode = params.get('reportType');
    const month = Number(params.get('month'));
    const year = Number(params.get('year'));

    console.log('Reports useEffect', {
      postId,
      reportTypeCode,
      month,
      year,
    });

    // Set all values at once to prevent multiple re-renders
    if (postId) updateSelectedPost(postId);
    if (reportTypeCode) {
      const reportName = reportTypeMapping[reportTypeCode] || reportTypeCode;
      console.log('Report Type in Reports use effect:', reportName);
      setSelectedReportType(reportName);
    }
    if (month && year) setSelectedDate(new Date(year, month - 1));

    // Mark as initialized to prevent re-running
    hasInitializedFromURL.current = true;
  }, [location.search, allPostsData, reportTypeMapping]);

  // Auto-preview when all required values are present
  useEffect(() => {
    // Only auto-preview if all required values are present and we've initialized from URL
    if (
      hasInitializedFromURL.current &&
      (selectedPostId || selectedMultiPostIds.length > 0) &&
      selectedReportType &&
      selectedDate
    ) {
      setShowTable(true);
    }
  }, [selectedPostId, selectedMultiPostIds, selectedReportType, selectedDate]);

  // JSX here
  return (
    <>
      {isLoading && <Loader />}
      {/* Main Container */}
      {/* <div className="flex flex-col w-[calc(100vw-600px)] 2xl:w-[calc(100vw-82px)]"> */}
      <div
        className={`flex flex-col transition-all duration-100 ${
          showMenu
            ? 'w-[calc(100vw-64px)] 2xl:w-[calc(100vw-80px)]'
            : 'w-[calc(100vw-224px)]'
        }`}
      >
        {/* Header */}
        <div
          className={`flex flex-col fixed z-20 ${
            showMenu
              ? 'w-[calc(100vw-64px)] 2xl:w-[calc(100vw-80px)]'
              : 'w-[calc(100vw-224px)]'
          } py-2 2xl:py-3 px-4 2xl:px-8 gap-2 2xl:gap-3`}
        >
          {/* Bread Crumb */}
          <BreadCrumb />
          {/* Top Bar */}
          <div className="flex items-end gap-4 w-full">
            {/* Post Name */}
            <div className="flex flex-col flex-shrink-0">
              {selectedReportType === ReportName.ESI_REPORT ||
              selectedReportType === ReportName.EPF_REPORT ||
              selectedReportType === ReportName.SALARY_REPORT ||
              selectedReportType === ReportName.PTAX_REPORT ? (
                <MultiPostSelectDropdown
                  label="Select Posts"
                  posts={allPostsData}
                  onChangeSelectedPostIds={updateSelectedPostIds}
                />
              ) : (
                <PostSelectDropdown
                  label={
                    selectedPostName ? `${selectedPostName}` : 'Select Post'
                  }
                  posts={allPostsData}
                  selectedPostId={selectedPostId}
                  onChangePost={updateSelectedPost}
                />
              )}
            </div>

            {/* Center: Report Types */}
            <div className="flex flex-col lg:flex-row items-start lg:items-end gap-2 lg:gap-4 flex-grow justify-center">
              <div className="flex flex-col">
                <ReportSelectDropDown
                  label="Select Report"
                  reportTypes={reportType}
                  value={selectedReportType || ''}
                  onChangeSelectPost={updateSelectedReportType}
                />
              </div>
              <ClearButton
                onClick={previewReport}
                disabled={
                  (!selectedPostId && selectedMultiPostIds.length === 0) ||
                  !selectedDate ||
                  !selectedReportType
                }
              >
                Preview
              </ClearButton>
            </div>

            {/* Date Picker pushed to end */}
            <div className="flex-shrink-0">
              <DatePickerComp
                label="Select Date"
                externalSelectedDate={selectedDate}
                onChangeDate={updateSelectedDate}
              />
            </div>
          </div>
        </div>

        {/* Table Container */}
        <div className="flex justify-center mt-[72px] 2xl:mt-[96px]">
          {showTable ? (
            <div className="w-[calc(100vw-64px)] ">{renderReport()}</div>
          ) : (
            <>
              <div className="mx-auto flex flex-col gap-4 items-center justify-center px-10 text-responsive-input h-[calc(100vh-112px)] 2xl:h-[calc(100vh-152px)]">
                <img src={Select_Report} className="w-36" alt="" />
                <h1 className=" font-semibold text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl">
                  Select Report Type
                </h1>
                <p className="font-medium text-xs md:text-sm xl:text-base">
                  Please select post and report type from the above dropdown to
                  view the report.
                  {/* view the report. what is show menu : {showMenu} */}
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default Reports;
