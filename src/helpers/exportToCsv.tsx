// Libraries
import React from 'react';
import { CSVLink } from 'react-csv';

// Types
import { Rank } from '../types/rank';
import { Post } from '../types/post';

// Utils
import { getFormattedDateDdMmYyyyDash } from '../utils/formatter';

// Assets
import { DownloadIcon } from '../assets/icons';
import { EmployeeTable } from '../types/employee';

export const ExportRanksCsv: React.FC<{
  ranksData: Rank[];
  handleClose: () => void;
}> = ({ ranksData, handleClose }) => {
  const csvHeaders = [
    { label: 'Designation', key: 'designation' },
    { label: 'Basic Salary', key: 'basicSalary' },
    { label: 'House Rent', key: 'hra' },
    { label: 'Conveyance', key: 'conveyance' },
    { label: 'Kit/Washing Allowance', key: 'kitWashingAllowance' },
    { label: 'Uniform', key: 'uniformAllowance' },
    { label: 'City Allowance', key: 'cityAllowance' },
    { label: 'VDA', key: 'vda' },
    { label: 'Others', key: 'otherAllowance' },
  ];

  const csvData = ranksData.map((rank) => ({
    designation: rank.designation,
    basicSalary: rank.basicSalary,
    hra: rank.hra,
    conveyance: rank.conveyance,
    kitWashingAllowance: rank.kitWashingAllowance,
    uniformAllowance: rank.uniformAllowance,
    cityAllowance: rank.cityAllowance,
    vda: rank.vda,
    otherAllowance: rank.otherAllowance,
  }));

  return (
    <CSVLink
      onClick={handleClose}
      data={csvData}
      headers={csvHeaders}
      filename={`RankDetails_${getFormattedDateDdMmYyyyDash(new Date())}.csv`}
      className="action-menu-button"
    >
      <img src={DownloadIcon} alt="DownloadIcon" className="w-4 h-4" />
      <p className="text-responsive-button">Export as Excel</p>
    </CSVLink>
  );
};

export const ExportPostsCsv: React.FC<{
  postsData: Post[];
  handleClose: () => void;
}> = ({ postsData, handleClose }) => {
  const csvHeaders = [
    { label: 'Post Name', key: 'postName' },
    { label: 'Contact Person', key: 'contactPerson' },
    { label: 'GSTIN', key: 'gstin' },
    { label: 'Service Location', key: 'serviceLocation' },
    { label: 'Contract Start Date', key: 'contractStartDate' },
    { label: 'Status', key: 'status' },
  ];

  const csvData = postsData.map((post: Post) => ({
    postName: post.postName,
    contactPerson: post.contactPerson,
    gstin: post.gstin,
    serviceLocation: post.address,
    contractStartDate: getFormattedDateDdMmYyyyDash(
      new Date(post.contractDate)
    ),
    status: post.status,
  }));

  return (
    <CSVLink
      onClick={handleClose}
      data={csvData}
      headers={csvHeaders}
      filename={`PostDetails_${getFormattedDateDdMmYyyyDash(new Date())}.csv`}
      className="action-menu-button"
    >
      <img src={DownloadIcon} alt="DownloadIcon" className="w-4 h-4" />
      <p className="text-responsive-button">Export as Excel</p>
    </CSVLink>
  );
};

export const ExportEmployeesCsv: React.FC<{
  employeesData: EmployeeTable[];
  handleClose: () => void;
}> = ({ employeesData, handleClose }) => {
  const csvHeaders = [
    { label: 'Name', key: 'name' },
    { label: 'Employee Id', key: 'employeeId' },
    { label: 'Posting', key: 'posting' },
    { label: 'Rank', key: 'rank' },
    { label: 'Gender', key: 'gender' },
    { label: 'Contact', key: 'contact' },
  ];

  const csvData = employeesData.map((employee: EmployeeTable) => ({
    name: employee.empName,
    employeeId: employee.empId,
    posting: employee.postName,
    rank: employee.rank,
    gender: employee.gender,
    contact: employee.phoneNum,
  }));

  return (
    <CSVLink
      onClick={handleClose}
      data={csvData}
      headers={csvHeaders}
      filename={`EmployeeDetails_${getFormattedDateDdMmYyyyDash(new Date())}.csv`}
      className="action-menu-button"
    >
      <img src={DownloadIcon} alt="DownloadIcon" className="w-4 h-4" />
      <p className="text-responsive-button">Export as Excel</p>
    </CSVLink>
  );
};
