// Libraries
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

// Types
import { Rank } from '../types/rank';
import { Post } from '../types/post';

// Utils
import {
  formatDateDdMmYyyySlash,
  formatValueRsFixedTwo,
  getFormattedDateDdMmYyyyDash,
} from '../utils/formatter';
import { EmployeeTable } from '../types/employee';

export const exportRankDetailsPdf = (allRanksData: Rank[]) => {
  const doc = new jsPDF('landscape');
  autoTable(doc, {
    head: [
      [
        { content: 'Rank', rowSpan: 2 },
        { content: 'Basic Salary', rowSpan: 2 },
        { content: 'Allowances', colSpan: 7 },
      ],
      [
        'House Rent',
        'Conveyance',
        'Kit/Washing Allowance',
        'Uniform',
        'City Allowance',
        'VDA',
        'Other Allowance',
      ],
    ],
    body: allRanksData.map((rank) => [
      rank.designation,
      formatValueRsFixedTwo(rank.basicSalary),
      formatValueRsFixedTwo(rank.hra),
      formatValueRsFixedTwo(rank.conveyance),
      formatValueRsFixedTwo(rank.kitWashingAllowance),
      formatValueRsFixedTwo(rank.uniformAllowance),
      formatValueRsFixedTwo(rank.cityAllowance),
      formatValueRsFixedTwo(rank.vda),
      formatValueRsFixedTwo(rank.otherAllowance),
    ]),
    theme: 'grid',
    headStyles: {
      fillColor: '#f5f5f5',
      textColor: '#212529',
      fontSize: 10,
      halign: 'center',
      lineWidth: 0.001,
      lineColor: '#80858A',
    },
    bodyStyles: {
      fillColor: '#fff',
      textColor: '#212529',
      fontSize: 8,
      halign: 'center',
    },
    columnStyles: {
      0: { cellWidth: 30 },
      1: { cellWidth: 30 },
    },
    didDrawPage: (data) => {
      doc.setFontSize(12);
      doc.text('Rank Details', data.settings.margin.left, 10);
    },
  });

  doc.save(`RankDetails_${getFormattedDateDdMmYyyyDash(new Date())}.pdf`);
};

export const exportPostDetailsPdf = (allPostsData: Post[]) => {
  // console.log('all post data in export ', allPostsData);
  const doc = new jsPDF('landscape');
  autoTable(doc, {
    head: [
      [
        'Post Name',
        'Contact Person',
        'GSTIN',
        'Service Location',
        'Contract Start Date',
        'Status',
      ],
    ],
    body: allPostsData.map((post) => [
      post.postName || '',
      post.contactPerson || '',
      post.gstin || '',
      post.address || '',
      formatDateDdMmYyyySlash(new Date(post.contractDate)) || '',
      post.status || '',
    ]),
    theme: 'grid',
    headStyles: {
      fillColor: '#f5f5f5',
      textColor: '#212529',
      fontSize: 10,
      halign: 'center',
      lineWidth: 0.001,
      lineColor: '#80858A',
    },
    bodyStyles: {
      fillColor: '#fff',
      textColor: '#212529',
      fontSize: 8,
      halign: 'center',
    },
    columnStyles: {
      0: { cellWidth: 30 },
      1: { cellWidth: 30 },
    },
    didDrawPage: (data) => {
      doc.setFontSize(12);
      doc.text('Posts Details', data.settings.margin.left, 10);
    },
  });

  doc.save(`PostsDetails_${getFormattedDateDdMmYyyyDash(new Date())}.pdf`);
};

export const exportEmployeeDetailsPdf = (allEmployeesData: EmployeeTable[]) => {
  const doc = new jsPDF('landscape'); // Creates a new PDF in landscape orientation

  autoTable(doc, {
    head: [['Name', 'Employee Id', 'Posting', 'Rank', 'Gender', 'Contact']],
    body: allEmployeesData.map((employee) => [
      employee.empName || '',
      employee.empId || '',
      employee.postName || '',
      employee.rank || '',
      employee.gender || '',
      employee.phoneNum || '',
    ]),
    // other options
    theme: 'grid',
    headStyles: {
      fillColor: '#f5f5f5',
      textColor: '#212529',
      fontSize: 10,
      halign: 'center',
      lineWidth: 0.001,
      lineColor: '#80858A',
    },
    bodyStyles: {
      fillColor: '#fff',
      textColor: '#212529',
      fontSize: 8,
      halign: 'center',
    },
    columnStyles: {
      0: { cellWidth: 30 },
      1: { cellWidth: 30 },
    },
    didDrawPage: (data) => {
      doc.setFontSize(12);
      doc.text('Employees Table', data.settings.margin.left, 10);
    },
  });
  // date function for pdf
  const date = new Date();
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
  const year = date.getFullYear();

  let hours = date.getHours();
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const ampm = hours >= 12 ? 'pm' : 'am';
  hours = hours % 12 || 12; // Convert to 12-hour format
  const formattedTime = `${String(hours).padStart(2, '0')}:${minutes} ${ampm}`;

  const formattedDate = `${day}-${month}-${year}`;

  doc.save(`employeesTable: ${formattedDate} ${formattedTime}.pdf`);
};
