// Libraries
import React, { useEffect, useRef, useState } from 'react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { CSVLink } from 'react-csv';

// Hooks
import useVerifyUserAuth from '../../../../hooks/useVerifyUserAuth';

// Types
import { WithoutAllowanceRow } from '../../../../types/withoutAllowanceReport';

// Assets
import {
  DownloadIcon,
  PrintIcon,
  // SaveIconBlackActive,
} from '../../../../assets/icons';
import axios from 'axios';
import { api } from '../../../../configs/api';
import { toast } from 'react-toastify';
import Loader from '../../../../common/Loader/Loader';

interface WithoutAllowanceReportProps {
  currentSelectedPostId: number;
  selectedPostName: string | null;
  selectedDate: Date | null;
}
const WithoutAllowanceReport: React.FC<WithoutAllowanceReportProps> = ({
  currentSelectedPostId,
  selectedPostName,
  selectedDate,
}) => {
  const accessToken = useVerifyUserAuth();

  /* Loader */
  const [isLoading, setIsLoading] = useState(false);
  //////////////////////////////////////////////////////////////////////////////////////
  /** Date handling */
  const formatDate = (date: Date) => {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };
  function getFirstAndLastDay(dateString: Date) {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = date.getMonth();

    // First day of the month
    const firstDay = new Date(year, month, 1);
    // Last day of the month
    const lastDay = new Date(year, month + 1, 0);

    return {
      firstDay: formatDate(firstDay),
      lastDay: formatDate(lastDay),
    };
  }

  // Format start date for display
  const formattedStartDate = selectedDate
    ? `${selectedDate.getDate().toString().padStart(2, '0')}/${(
        selectedDate.getMonth() + 1
      )
        .toString()
        .padStart(2, '0')}/${selectedDate.getFullYear()}`
    : '';
  // Calculate last date of the month
  const getLastDateOfMonth = (date: Date) => {
    const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    return lastDay;
  };
  const endDate = selectedDate ? getLastDateOfMonth(selectedDate) : null;
  // Format end date for display
  const formattedEndDate = endDate
    ? `${endDate.getDate().toString().padStart(2, '0')}/${(
        endDate.getMonth() + 1
      )
        .toString()
        .padStart(2, '0')}/${endDate.getFullYear()}`
    : '';
  /////////////////////////////////////////////////////////////////////////////////////
  // Column dynamic visibility
  // const alwaysVisibleColumns = [
  //   'empName',
  //   'days',
  //   'basicSalary',
  //   'extraDuty',
  //   'deduction',
  //   'other',
  //   'grossPay',
  //   'otherDeduction',
  //   'totalDeduction',
  //   'netPay',
  // ];
  // Define the initial state of visible columns
  // const [visibleColumns, setVisibleColumns] = useState<string[]>([
  //   ...alwaysVisibleColumns,
  // ]);
  const visibleColumns = [
    'empName',
    'days',
    'basicSalary',
    'bonus',
    'extraDuty',
    'deduction',
    'other',
    'otherDeduction',
    'totalDeduction',
    'netPay',
  ];

  // Define column data
  const columns = [
    { name: 'empName', label: 'Name & Rank' },
    { name: 'days', label: 'Days' },
    { name: 'basicSalary', label: 'Basic Pay' },
    { name: 'extraDuty', label: 'Extra Duty' },
    { name: 'deduction', label: 'Deduction' },
    { name: 'other', label: 'Other' },
    { name: 'bonus', label: 'Bonus' },
    { name: 'otherDeduction', label: 'Other Deduction' },
    { name: 'totalDeduction', label: 'Total Deduction' },
    { name: 'netPay', label: 'Net Pay' },
    // { name: 'sign', label: 'Sign' },
  ];

  const [withoutAllowanceReportData, setWithoutAllowanceReportData] = useState<
    WithoutAllowanceRow[]
  >([]);
  const [doesReportExist, setDoesReportExist] = useState(false);

  const [totalBasicSalary, setTotalBasicSalary] = useState(0);
  const [totalNetPay, setTotalNetPay] = useState(0);

  const fetchWithoutAllowanceReportData = async () => {
    if (!accessToken || !selectedPostName || !selectedDate) return;
    setIsLoading(true);
    try {
      const response = await axios.get(
        `${api.baseUrl}/reports/without-allowance/${currentSelectedPostId}/${selectedDate.getMonth() + 1}/${selectedDate.getFullYear()}`,
        {
          headers: { 'x-access-token': accessToken },
        }
      );
      if (response.data && response.data.success) {
        toast.success(response.data.message);
        setDoesReportExist(true);
        // console.log('Reports:', response.data);
        setWithoutAllowanceReportData(response.data.withoutAllowanceReports);
        setTotalBasicSalary(response.data.totalBasicSalary);
        setTotalNetPay(response.data.totalNetPay);
      } else {
        console.error('Error:', response.data.message);
      }
    } catch (error) {
      handleError(error);
      setDoesReportExist(false);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    fetchWithoutAllowanceReportData();
  }, [accessToken, selectedPostName, selectedDate]);

  // Error handler
  // const [errors, setErrors] = useState<string[]>([]);
  const handleError = (error: unknown) => {
    console.error('Error:', error); // TODO: Remove console.error
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

  // Calculate totals
  function numberToWords(num: number) {
    const ones = [
      '',
      'one',
      'two',
      'three',
      'four',
      'five',
      'six',
      'seven',
      'eight',
      'nine',
      'ten',
      'eleven',
      'twelve',
      'thirteen',
      'fourteen',
      'fifteen',
      'sixteen',
      'seventeen',
      'eighteen',
      'nineteen',
    ];
    const tens = [
      '',
      '',
      'twenty',
      'thirty',
      'forty',
      'fifty',
      'sixty',
      'seventy',
      'eighty',
      'ninety',
    ];
    const scales = ['', 'thousand', 'lakh', 'crore'];

    if (num === 0) return 'Zero only';

    const getChunkWords = (n: number) => {
      const chunkWords = [];
      if (n >= 100) {
        chunkWords.push(ones[Math.floor(n / 100)]);
        chunkWords.push('hundred');
        n %= 100;
      }
      if (n >= 20) {
        chunkWords.push(tens[Math.floor(n / 10)]);
        n %= 10;
      }
      if (n > 0) {
        chunkWords.push(ones[n]);
      }
      return chunkWords.join(' ');
    };

    let integerPart = Math.floor(num);
    const decimalPart = Math.round((num - integerPart) * 100);

    const chunks = [];
    const scaleNames: (string | number)[] = [];
    let scaleIndex = 0;

    while (integerPart > 0) {
      let chunk;
      if (scaleIndex === 0) {
        chunk = integerPart % 1000;
        integerPart = Math.floor(integerPart / 1000);
      } else {
        chunk = integerPart % 100;
        integerPart = Math.floor(integerPart / 100);
      }
      chunks.push(chunk);
      scaleNames.push(scales[scaleIndex]);
      scaleIndex++;
    }

    const words = chunks
      .map((chunk, index) => {
        if (chunk === 0) return '';
        return `${getChunkWords(chunk)} ${scaleNames[index]}`.trim();
      })
      .reverse()
      .filter(Boolean)
      .join(' ');

    let result = words.charAt(0).toUpperCase() + words.slice(1);

    if (decimalPart > 0) {
      result += ` and ${getChunkWords(decimalPart)} paise`;
    }

    result += ' only';

    return result;
  }
  // Example usage:
  // const amount = 121561.56;
  // console.log(numberToWords(amount));
  // const totalBasicSalary = withoutAllowanceReportData.reduce(
  //   (sum, row) => sum + parseFloat(row.basicSalary),
  //   0
  // );
  // const totalNetPay = withoutAllowanceReportData.reduce(
  //   (sum, row) => sum + parseFloat(row.netPay),
  //   0
  // );
  /////////////////////////////////////
  const [downloadDropdownOpen, setDownloadDropdownOpen] = useState(false); // To toggle dropdown
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  // const handleExportPDF = async () => {
  //   const doc = new jsPDF('landscape'); // Create PDF in landscape mode
  //   const loadFont = async (url: string) => {
  //     const response = await fetch(url);
  //     return await response.arrayBuffer();
  //   };

  //   const regularFont = await loadFont('/Mona-Sans.ttf');
  //   const boldFont = await loadFont('/Mona-Sans-Bold.ttf');

  //   const regularFontString = new Uint8Array(regularFont).reduce(
  //     (data, byte) => data + String.fromCharCode(byte),
  //     ''
  //   );
  //   const boldFontString = new Uint8Array(boldFont).reduce(
  //     (data, byte) => data + String.fromCharCode(byte),
  //     ''
  //   );

  //   doc.addFileToVFS('Mona_Sans.ttf', regularFontString);
  //   doc.addFont('Mona_Sans.ttf', 'Mona_Sans', 'normal');

  //   doc.addFileToVFS('Mona_Sans-Bold.ttf', boldFontString);
  //   doc.addFont('Mona_Sans-Bold.ttf', 'Mona_Sans', 'bold');

  //   // Add Company Details
  //   doc.setFont('Mona_Sans', 'bold');
  //   doc.setFontSize(14);
  //   doc.text('Purbanchal Security Consultants Pvt. Ltd.', 150, 8, {
  //     align: 'center',
  //   }); // Centered
  //   doc.setFont('Mona_Sans', 'normal');
  //   doc.setFontSize(12);
  //   doc.text('Silpukhuri, Guwahati-03', 148, 16, { align: 'center' });

  //   // Add Payroll Information
  //   doc.setFontSize(12);
  //   doc.text('Pay Roll of Staff Deployed at', 16, 26);
  //   doc.setFont('Mona_Sans', 'bold');
  //   doc.setFontSize(14);
  //   // doc.text(`${selectedPostName.toUpperCase()}`, 78, 50, { align: 'left' });
  //   if (selectedPostName) {
  //     doc.text(`${selectedPostName.toUpperCase()}`, 78, 26, { align: 'left' });
  //   }

  //   // Add Payroll Period
  //   doc.setFontSize(12);
  //   if (selectedDate) {
  //     doc.text(
  //       `For the period from: ${getFirstAndLastDay(selectedDate).firstDay}`,
  //       250,
  //       26,
  //       {
  //         align: 'right',
  //       }
  //     );
  //   }
  //   if (selectedDate) {
  //     doc.text(`To: ${getFirstAndLastDay(selectedDate).lastDay}`, 280, 26, {
  //       align: 'right',
  //     });
  //   }

  //   // Add "Sl. No." to the columns
  //   const updatedColumns = [
  //     { name: 'slNo', label: 'Sl. No.' }, // Add the serial number column
  //     ...columns,
  //     { name: 'sign', label: 'Sign' }, // Add the serial number column
  //   ];

  //   autoTable(doc, {
  //     startY: 42, // Start the table after the header details
  //     head: [updatedColumns.map((col) => col.label)],
  //     margin: { top: 5, left: 5, right: 5, bottom: 5 },
  //     // body: withoutAllowanceReportData.map((row, index) => [
  //     //   index + 1, // Serial Number (Sl. No.)
  //     //   ...columns.map((col) => {
  //     //     if (col.name === 'deduction') {
  //     //       return `ESI: ${row.deduction.empESI}, EPF: ${row.deduction.empEPF}, Adv: ${row.deduction.adv}, P.Tax: ${row.deduction.pTax}`;
  //     //     } else if (col.name === 'other') {
  //     //       return `Belt: ${row.other.belt}, Boot: ${row.other.boot}, Uniform: ${row.other.uniform}`;
  //     //     } else {
  //     //       return row[col.name as keyof typeof row];
  //     //     }
  //     //   }),
  //     // ]),
  //     body: withoutAllowanceReportData.map((row, index) => [
  //       index + 1, // Serial Number (Sl. No.)
  //       ...columns.map((col) => {
  //         if (col.name === 'deduction') {
  //           return `ESI: ${row.deduction.empESI}, EPF: ${row.deduction.empEPF}, Adv: ${row.deduction.adv}, P.Tax: ${row.deduction.pTax}`;
  //         } else if (col.name === 'other') {
  //           return `Belt: ${row.other.belt}, Boot: ${row.other.boot}, Uniform: ${row.other.uniform}`;
  //         } else if (typeof row[col.name as keyof typeof row] === 'object') {
  //           // Convert object to string
  //           return JSON.stringify(row[col.name as keyof typeof row]);
  //         } else {
  //           return String(row[col.name as keyof typeof row]); // Convert value to string
  //         }
  //       }),
  //     ]),
  //     theme: 'grid',
  //     headStyles: {
  //       fillColor: '#ffffff',
  //       textColor: '#212529',
  //       font: 'Mona_Sans',
  //       fontStyle: 'bold',
  //       fontSize: 10,
  //       halign: 'center',
  //       lineWidth: 0.2,
  //       lineColor: '#000',
  //     },
  //     bodyStyles: {
  //       fillColor: '#fff',
  //       textColor: '#212529',
  //       font: 'Mona_Sans',
  //       fontStyle: 'normal',
  //       fontSize: 10,
  //       halign: 'center',
  //       lineWidth: 0,
  //       lineColor: '#000',
  //     },
  //     columnStyles: {
  //       0: { cellWidth: 10 }, // Adjust the width of Sl. No. column
  //       1: { cellWidth: 30 },
  //       2: { cellWidth: 30 },
  //     },
  //     didDrawCell: (data) => {
  //       const { cell, section } = data;

  //       if (section === 'body') {
  //         // Draw only the bottom dotted border
  //         doc.setLineDashPattern([0.5, 0.5], 0);
  //         doc.setLineWidth(0.2);
  //         doc.setDrawColor(0, 0, 0);
  //         doc.line(
  //           cell.x,
  //           cell.y + cell.height,
  //           cell.x + cell.width,
  //           cell.y + cell.height
  //         );
  //       } else if (section === 'head') {
  //         // Draw full solid border for head
  //         doc.setLineDashPattern([], 0);
  //         doc.setLineWidth(0.4);
  //         doc.setDrawColor(0, 0, 0);
  //         doc.rect(cell.x, cell.y, cell.width, cell.height);
  //       }
  //     },
  //     // margin: { top: 80, bottom: 20 },
  //   });

  //   // Add Total Row (Total Gross Pay and Total Net Pay)

  //   const totalText = ` Total`;
  //   const totalGrossPayText = ` ${totalBasicSalary}`;
  //   const totalNetPayText = ` ${totalNetPay}`;

  //   doc.setFont('Mona_Sans', 'normal');
  //   doc.setFontSize(10);
  //   doc.text(totalText, 30, doc.lastAutoTable.finalY + 10);
  //   doc.text(totalGrossPayText, 85, doc.lastAutoTable.finalY + 10);
  //   doc.text(totalNetPayText, 255, doc.lastAutoTable.finalY + 10);

  //   // Add Footer
  //   const footerY = doc.lastAutoTable.finalY + 30; // Adjusting vertical position after the table
  //   doc.setFontSize(12);
  //   doc.text('Rupees:', 70, footerY);
  //   doc.text(
  //     `${numberToWords(parseFloat(totalNetPay.toFixed(2)))} only`,
  //     88,
  //     footerY
  //   );

  //   doc.text('Return after disbursement', 142, footerY + 10, {
  //     align: 'center',
  //   });

  //   doc.text(
  //     'Incharge: ..............................................................',
  //     70,
  //     footerY + 20
  //   );
  //   doc.text(
  //     'Date: .......................................',
  //     160,
  //     footerY + 20
  //   );

  //   // Save the PDF
  //   const date = new Date();
  //   const day = String(date.getDate()).padStart(2, '0');
  //   const month = String(date.getMonth() + 1).padStart(2, '0');
  //   const year = date.getFullYear();

  //   let hours = date.getHours();
  //   const minutes = String(date.getMinutes()).padStart(2, '0');
  //   const ampm = hours >= 12 ? 'pm' : 'am';
  //   hours = hours % 12 || 12;
  //   const formattedTime = `${String(hours).padStart(2, '0')}:${minutes} ${ampm}`;

  //   const formattedDate = `${day}-${month}-${year}`;
  //   doc.save(`WithoutAllowance_Report_${formattedDate}_${formattedTime}.pdf`);
  // };

  // version 2
  // const handleExportPDF = async () => {
  //   const doc = new jsPDF('landscape'); // Create PDF in landscape mode

  //   const loadFont = async (url: string) => {
  //     const response = await fetch(url);
  //     return await response.arrayBuffer();
  //   };

  //   const regularFont = await loadFont('/Mona-Sans.ttf');
  //   const boldFont = await loadFont('/Mona-Sans-Bold.ttf');

  //   const regularFontString = new Uint8Array(regularFont).reduce(
  //     (data, byte) => data + String.fromCharCode(byte),
  //     ''
  //   );
  //   const boldFontString = new Uint8Array(boldFont).reduce(
  //     (data, byte) => data + String.fromCharCode(byte),
  //     ''
  //   );

  //   doc.addFileToVFS('Mona_Sans.ttf', regularFontString);
  //   doc.addFont('Mona_Sans.ttf', 'Mona_Sans', 'normal');

  //   doc.addFileToVFS('Mona_Sans-Bold.ttf', boldFontString);
  //   doc.addFont('Mona_Sans-Bold.ttf', 'Mona_Sans', 'bold');

  //   // Add Company Details (close to top)
  //   doc.setFont('Mona_Sans', 'bold');
  //   doc.setFontSize(14);
  //   doc.text('Purbanchal Security Consultants Pvt. Ltd.', 150, 10, {
  //     align: 'center',
  //   });

  //   doc.setFont('Mona_Sans', 'normal');
  //   doc.setFontSize(11);
  //   doc.text('Silpukhuri, Guwahati-03', 148, 18, { align: 'center' });

  //   // Payroll Info (less vertical space)
  //   doc.setFontSize(11);
  //   doc.text('Pay Roll of Staff Deployed at', 5, 28);
  //   doc.setFont('Mona_Sans', 'bold');
  //   doc.setFontSize(11);
  //   if (selectedPostName) {
  //     doc.text(`${selectedPostName.toUpperCase()}`, 60, 28, { align: 'left' });
  //   }
  //   if (selectedDate) {
  //     const firstDay = getFirstAndLastDay(selectedDate).firstDay;
  //     const lastDay = getFirstAndLastDay(selectedDate).lastDay;
  //     doc.setFontSize(11);
  //     doc.text(`For the period from: ${firstDay} To: ${lastDay}`, 292, 28, {
  //       align: 'right',
  //     });
  //     doc.setFontSize(12);
  //   }

  //   const updatedColumns = [
  //     { name: 'slNo', label: 'Sl. No.' },
  //     ...columns,
  //     { name: 'sign', label: 'Sign' },
  //   ];

  //   autoTable(doc, {
  //     startY: 34, // Start very close after header
  //     margin: { top: 5, left: 5, right: 5, bottom: 5 }, // Minimal margins
  //     head: [updatedColumns.map((col) => col.label)],
  //     body: withoutAllowanceReportData.map((row, index) => [
  //       index + 1,
  //       ...columns.map((col) => {
  //         if (col.name === 'deduction') {
  //           return `ESI: ${row.deduction.empESI}, EPF: ${row.deduction.empEPF}, Adv: ${row.deduction.adv}, P.Tax: ${row.deduction.pTax}`;
  //         } else if (col.name === 'other') {
  //           return `Belt: ${row.other.belt}, Boot: ${row.other.boot}, Uniform: ${row.other.uniform}`;
  //         } else if (col.name === 'empName') {
  //           return `${row.empName}, ${row.rank}`;
  //         } else if (typeof row[col.name as keyof typeof row] === 'object') {
  //           return JSON.stringify(row[col.name as keyof typeof row]);
  //         } else {
  //           return String(row[col.name as keyof typeof row]);
  //         }
  //       }),
  //     ]),
  //     theme: 'grid',
  //     headStyles: {
  //       fillColor: '#ffffff',
  //       textColor: '#212529',
  //       font: 'Mona_Sans',
  //       fontStyle: 'bold',
  //       fontSize: 10,
  //       halign: 'center',
  //       lineWidth: 0.2,
  //       lineColor: '#000',
  //     },
  //     bodyStyles: {
  //       fillColor: '#fff',
  //       textColor: '#212529',
  //       font: 'Mona_Sans',
  //       fontStyle: 'normal',
  //       fontSize: 10,
  //       halign: 'center',
  //       lineWidth: 0,
  //       lineColor: '#000',
  //     },
  //     columnStyles: {
  //       0: { cellWidth: 10 },
  //       1: { cellWidth: 30 },
  //       2: { cellWidth: 30 },
  //     },
  //     didDrawCell: (data) => {
  //       const { cell, section } = data;

  //       if (section === 'body') {
  //         doc.setLineDashPattern([0.5, 0.5], 0);
  //         doc.setLineWidth(0.2);
  //         doc.setDrawColor(0, 0, 0);
  //         doc.line(
  //           cell.x,
  //           cell.y + cell.height,
  //           cell.x + cell.width,
  //           cell.y + cell.height
  //         );
  //       } else if (section === 'head') {
  //         doc.setLineDashPattern([], 0);
  //         doc.setLineWidth(0.4);
  //         doc.setDrawColor(0, 0, 0);
  //         doc.rect(cell.x, cell.y, cell.width, cell.height);
  //       }
  //     },
  //   });

  //   const totalText = ` Total`;
  //   const totalGrossPayText = ` ${totalBasicSalary}`;
  //   const totalNetPayText = ` ${totalNetPay}`;

  //   doc.setFont('Mona_Sans', 'normal');
  //   doc.setFontSize(10);
  //   doc.text(totalText, 20, doc.lastAutoTable.finalY + 8);
  //   doc.text(totalGrossPayText, 80, doc.lastAutoTable.finalY + 8);
  //   doc.text(totalNetPayText, 250, doc.lastAutoTable.finalY + 8);

  //   const footerY = doc.lastAutoTable.finalY + 18;
  //   doc.setFontSize(12);
  //   doc.text('Rupees:', 60, footerY);
  //   doc.text(
  //     `${numberToWords(parseFloat(totalNetPay.toFixed(2)))} only`,
  //     80,
  //     footerY
  //   );
  //   doc.text('Return after disbursement', 140, footerY + 8, {
  //     align: 'center',
  //   });
  //   doc.text(
  //     'Incharge: ..............................................................',
  //     60,
  //     footerY + 16
  //   );
  //   doc.text(
  //     'Date: .......................................',
  //     160,
  //     footerY + 16
  //   );

  //   const date = new Date();
  //   const day = String(date.getDate()).padStart(2, '0');
  //   const month = String(date.getMonth() + 1).padStart(2, '0');
  //   const year = date.getFullYear();
  //   let hours = date.getHours();
  //   const minutes = String(date.getMinutes()).padStart(2, '0');
  //   const ampm = hours >= 12 ? 'pm' : 'am';
  //   hours = hours % 12 || 12;
  //   const formattedTime = `${String(hours).padStart(2, '0')}:${minutes} ${ampm}`;
  //   const formattedDate = `${day}-${month}-${year}`;

  //   doc.save(`WithoutAllowance_Report_${formattedDate}_${formattedTime}.pdf`);
  // };

  // version 3
  const handleExportPDF = async () => {
    const doc = new jsPDF('landscape');

    const loadFont = async (url: string) => {
      const response = await fetch(url);
      return await response.arrayBuffer();
    };

    const regularFont = await loadFont('/Mona-Sans.ttf');
    const boldFont = await loadFont('/Mona-Sans-Bold.ttf');

    const regularFontString = new Uint8Array(regularFont).reduce(
      (data, byte) => data + String.fromCharCode(byte),
      ''
    );
    const boldFontString = new Uint8Array(boldFont).reduce(
      (data, byte) => data + String.fromCharCode(byte),
      ''
    );

    doc.addFileToVFS('Mona_Sans.ttf', regularFontString);
    doc.addFont('Mona_Sans.ttf', 'Mona_Sans', 'normal');

    doc.addFileToVFS('Mona_Sans-Bold.ttf', boldFontString);
    doc.addFont('Mona_Sans-Bold.ttf', 'Mona_Sans', 'bold');

    // Header Section
    doc.setFont('Mona_Sans', 'bold');
    doc.setFontSize(14);
    doc.text('Purbanchal Security Consultants Pvt. Ltd.', 150, 10, {
      align: 'center',
    });

    doc.setFont('Mona_Sans', 'normal');
    doc.setFontSize(11);
    doc.text('Silpukhuri, Guwahati-03', 150, 16, { align: 'center' });

    // Payroll Info Row
    doc.setFontSize(11);
    doc.text('Pay Roll of Staff Deployed at', 5, 24);
    doc.setFont('Mona_Sans', 'bold');
    if (selectedPostName) {
      doc.text(`${selectedPostName.toUpperCase()}`, 65, 24, { align: 'left' });
    }
    if (selectedDate) {
      const { firstDay, lastDay } = getFirstAndLastDay(selectedDate);
      doc.text(`For the period from: ${firstDay} To: ${lastDay}`, 292, 24, {
        align: 'right',
      });
    }

    // Prepare Table Columns
    const updatedColumns = [
      { name: 'slNo', label: 'Sl. No.' },
      ...columns,
      { name: 'sign', label: 'Sign' },
    ];
    // const updatedColumns = [
    //   { name: 'slNo', label: 'Sl. No.' },
    //   ...columns.filter((col) => col.name !== 'deduction'),
    //   { name: 'deduction1', label: 'ESI/EPF' },
    //   { name: 'deduction2', label: 'Adv/P.Tax' },
    //   { name: 'sign', label: 'Sign' },
    // ];

    // Generate Table
    autoTable(doc, {
      startY: 30,
      margin: { top: 5, left: 5, right: 5, bottom: 5 },
      head: [updatedColumns.map((col) => col.label)],
      // body: withoutAllowanceReportData.map((row, index) => [
      //   index + 1,
      //   ...columns.map((col) => {
      // if (col.name === 'deduction') {
      //   return `ESI: ${row.deduction.empESI}\n EPF: ${row.deduction.empEPF}, Adv: ${row.deduction.adv}, P.Tax: ${row.deduction.pTax}`;
      // } else if (col.name === 'other') {
      //       return `Belt: ${row.other.belt}\n Boot: ${row.other.boot} \n Uniform: ${row.other.uniform}`;
      //     } else if (col.name === 'empName') {
      //       return `${row.empName}\n ${row.rank}`;
      //     } else if (typeof row[col.name as keyof typeof row] === 'object') {
      //       return JSON.stringify(row[col.name as keyof typeof row]);
      //     } else {
      //       return String(row[col.name as keyof typeof row]);
      //     }
      //   }),
      // ]),
      body: withoutAllowanceReportData.map((row, index) => [
        index + 1,
        ...columns
          .map((col) => {
            if (col.name === 'empName') {
              return `${row.empName}\n${row.rank}`;
            } else if (col.name === 'deduction') {
              return `ESI: ${row.deduction.empESI} Adv: ${row.deduction.adv} \n EPF: ${row.deduction.empEPF} P.Tax: ${row.deduction.pTax}`;
            } else if (col.name === 'other') {
              return `Belt: ${row.other.belt}, Boot: ${row.other.boot}, Uniform: ${row.other.uniform}`;
            } else if (typeof row[col.name as keyof typeof row] === 'object') {
              return JSON.stringify(row[col.name as keyof typeof row]);
            } else {
              return String(row[col.name as keyof typeof row]);
            }
          })
          .filter((val) => val !== null), // Remove null (deduction placeholder)

        // Now push our new two columns for deduction1 & deduction2:
        // `ESI: ${row.deduction.empESI}\nEPF: ${row.deduction.empEPF}`,
        // `Adv: ${row.deduction.adv}\nP.Tax: ${row.deduction.pTax}`,

        // Sign column last
        '',
      ]),
      theme: 'grid',
      headStyles: {
        fillColor: '#ffffff',
        textColor: '#212529',
        font: 'Mona_Sans',
        fontStyle: 'bold',
        fontSize: 8.5,
        halign: 'center',
        lineWidth: 0.2,
        lineColor: '#000',
      },
      bodyStyles: {
        fillColor: '#fff',
        textColor: '#212529',
        font: 'Mona_Sans',
        fontStyle: 'normal',
        fontSize: 8.5,
        halign: 'center',
        lineWidth: 0,
        lineColor: '#000',
      },
      columnStyles: {
        0: { cellWidth: 10 },
        1: { cellWidth: 30 },
        2: { cellWidth: 30 },
      },
      styles: {
        cellPadding: { top: 1.5, bottom: 1.5, left: 1, right: 1 }, // tighter cell padding
        overflow: 'linebreak', // handle wrapping if text overflows
      },
      didDrawCell: (data) => {
        const { cell, section } = data;
        if (section === 'body') {
          doc.setLineDashPattern([0.5, 0.5], 0);
          doc.setLineWidth(0.2);
          doc.setDrawColor(0, 0, 0);
          doc.line(
            cell.x,
            cell.y + cell.height,
            cell.x + cell.width,
            cell.y + cell.height
          );
        } else if (section === 'head') {
          doc.setLineDashPattern([], 0);
          doc.setLineWidth(0.4);
          doc.setDrawColor(0, 0, 0);
          doc.rect(cell.x, cell.y, cell.width, cell.height);
        }
      },
    });

    // Totals Row
    const totalText = ` Total`;
    const totalGrossPayText = ` ${totalBasicSalary}`;
    const totalNetPayText = ` ${totalNetPay}`;

    doc.setFont('Mona_Sans', 'normal');
    doc.setFontSize(10);
    doc.text(totalText, 20, doc.lastAutoTable.finalY + 8);
    doc.text(totalGrossPayText, 80, doc.lastAutoTable.finalY + 8);
    doc.text(totalNetPayText, 270, doc.lastAutoTable.finalY + 8);

    // Footer Section
    const footerY = doc.lastAutoTable.finalY + 18;
    doc.setFontSize(10);
    doc.text('Rupees:', 60, footerY);
    doc.text(
      `${numberToWords(parseFloat(totalNetPay.toFixed(2)))} only`,
      80,
      footerY
    );
    doc.text('Return after disbursement', 60, footerY + 8, {
      align: 'left',
    });
    doc.text(
      'Incharge: ..............................................................',
      60,
      footerY + 16
    );
    doc.text(
      'Date: .......................................',
      160,
      footerY + 16
    );

    // File Save
    const date = new Date();
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    let hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12 || 12;
    const formattedTime = `${String(hours).padStart(2, '0')}:${minutes} ${ampm}`;
    const formattedDate = `${day}-${month}-${year}`;

    doc.save(`WithoutAllowance_Report_${formattedDate}_${formattedTime}.pdf`);
  };

  // CSV Headers and Data (Updated based on your function)
  const formatCSVDate = () => {
    const date = new Date();
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = String(date.getFullYear()).slice(-2);

    let hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12 || 12; // Convert to 12-hour format

    return `${day}-${month}-${year}, ${hours}:${minutes} ${ampm}`;
  };

  const csvHeaders = [
    { label: 'Sl No.', key: 'slNo' },
    { label: 'Employee Name', key: 'empName' },
    { label: 'Days', key: 'days' },
    { label: 'Basic Pay', key: 'basicSalary' },
    { label: 'Extra Duty', key: 'extraDuty' },
    { label: 'ESI Deduction', key: 'deduction.empESI' },
    { label: 'EPF Deduction', key: 'deduction.empEPF' },
    { label: 'Advance Deduction', key: 'deduction.adv' },
    { label: 'P.Tax Deduction', key: 'deduction.pTax' },
    { label: 'Belt Other', key: 'other.belt' },
    { label: 'Boot Other', key: 'other.boot' },
    { label: 'Uniform Other', key: 'other.uniform' },
    { label: 'Bonus', key: 'bonus' },
    { label: 'Other Deduction', key: 'otherDeduction' },
    { label: 'Total Deduction', key: 'totalDeduction' },
    { label: 'Net Pay', key: 'netPay' },
    { label: 'Sign', key: '' },
  ];

  const csvData = withoutAllowanceReportData.map((row, index) => ({
    slNo: index + 1, // Serial number
    empName: row.empName,
    days: row.days,
    basicSalary: row.basicSalary,
    extraDuty: row.extraDuty,
    deduction: {
      empESI: row.deduction.empESI,
      empEPF: row.deduction.empEPF,
      adv: row.deduction.adv,
      pTax: row.deduction.pTax,
    },
    other: {
      belt: row.other.belt,
      boot: row.other.boot,
      uniform: row.other.uniform,
    },
    bonus: row.bonus,
    otherDeduction: row.otherDeduction,
    totalDeduction: row.totalDeduction,
    netPay: row.netPay,
  }));

  const handleCloseModal = () => {
    setDownloadDropdownOpen(false);
  };
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        handleCloseModal();
      }
    };

    if (downloadDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [downloadDropdownOpen]);

  // print
  const tableRef = useRef<HTMLDivElement>(null);

  // const handlePrint = () => {
  //   setIsPrintMode(true); // Enable print mode to render all pages

  //   setTimeout(() => {
  //     const printContents = tableRef.current?.innerHTML;

  //     if (printContents) {
  //       // Create a new iframe for printing
  //       const iframe = document.createElement('iframe');
  //       iframe.style.position = 'absolute';
  //       iframe.style.width = '0';
  //       iframe.style.height = '0';
  //       iframe.style.border = 'none';
  //       document.body.appendChild(iframe);

  //       const doc = iframe.contentWindow?.document || iframe.contentDocument;

  //       if (doc) {
  //         doc.open();

  //         // Copy the styles from the main document
  //         const styleSheets = Array.from(document.styleSheets)
  //           .map((styleSheet) => {
  //             try {
  //               return Array.from(styleSheet.cssRules)
  //                 .map((rule) => rule.cssText)
  //                 .join('');
  //             } catch (e) {
  //               // Sometimes accessing cross-origin styles throws errors, ignore those
  //               return '';
  //             }
  //           })
  //           .join('');

  //         // Write the table's content and the copied styles to the iframe
  //         doc.write(`
  //         <html>
  //           <head>
  //             <style>${styleSheets}</style>
  //           </head>
  //           <body>${printContents}</body>
  //         </html>
  //       `);

  //         doc.close();

  //         iframe.contentWindow?.focus();
  //         iframe.contentWindow?.print();
  //         document.body.removeChild(iframe); // Remove iframe after printing
  //       }
  //     }

  //     setIsPrintMode(false); // Disable print mode after printing
  //   }, 0); // Allow React to re-render the table with all rows before printing
  // };

  // pagination

  // version 2
  // const handlePrint = () => {
  //   const doc = new jsPDF('landscape');

  //   doc.setFontSize(14);
  //   doc.text('Purbanchal Security Consultants Pvt. Ltd.', 150, 10, {
  //     align: 'center',
  //   });
  //   doc.setFontSize(11);
  //   doc.text('Silpukhuri, Guwahati-03', 150, 16, { align: 'center' });

  //   doc.setFontSize(11);
  //   doc.text('Pay Roll of Staff Deployed at', 5, 24);
  //   doc.setFont('helvetica', 'bold');
  //   if (selectedPostName) {
  //     doc.text(`${selectedPostName.toUpperCase()}`, 65, 24);
  //   }
  //   if (selectedDate) {
  //     const firstDay = getFirstAndLastDay(selectedDate).firstDay;
  //     const lastDay = getFirstAndLastDay(selectedDate).lastDay;
  //     doc.text(`For the period from: ${firstDay} To: ${lastDay}`, 292, 24, {
  //       align: 'right',
  //     });
  //   }

  //   type TableRow = {
  //     slNo: number;
  //     empName: string;
  //     days: number;
  //     basicSalary: string;
  //     extraDuty: number;
  //     bonus: number;
  //     deduction: string;
  //     other: string;
  //     otherDeduction: number;
  //     totalDeduction: number;
  //     netPay: string;
  //     sign: string;
  //   };

  //   const columns: { header: string; dataKey: keyof TableRow }[] = [
  //     { header: 'Sl. No.', dataKey: 'slNo' },
  //     { header: 'Name & Rank', dataKey: 'empName' },
  //     { header: 'Days', dataKey: 'days' },
  //     { header: 'Basic Pay', dataKey: 'basicSalary' },
  //     { header: 'Extra Duty', dataKey: 'extraDuty' },
  //     { header: 'Bonus', dataKey: 'bonus' },
  //     { header: 'Deduction', dataKey: 'deduction' },
  //     { header: 'Other', dataKey: 'other' },
  //     { header: 'Other Deduction', dataKey: 'otherDeduction' },
  //     { header: 'Total Deduction', dataKey: 'totalDeduction' },
  //     { header: 'Net Pay', dataKey: 'netPay' },
  //     { header: 'Sign', dataKey: 'sign' },
  //   ];

  //   const body: TableRow[] = withoutAllowanceReportData.map((row, index) => ({
  //     slNo: index + 1,
  //     empName: `${row.empName}\n${row.rank}`,
  //     days: row.days,
  //     basicSalary: row.basicSalary,
  //     extraDuty: row.extraDuty,
  //     bonus: row.bonus,
  //     deduction: `ESI: ${row.deduction.empESI} Adv: ${row.deduction.adv} \n EPF: ${row.deduction.empEPF} P.Tax: ${row.deduction.pTax}`,
  //     other: `Belt: ${row.other.belt}, Boot: ${row.other.boot}, Uniform: ${row.other.uniform}`,
  //     otherDeduction: row.otherDeduction,
  //     totalDeduction: row.totalDeduction,
  //     netPay: row.netPay,
  //     sign: '',
  //   }));

  //   autoTable(doc, {
  //     head: [columns.map((col) => col.header)],
  //     body: body.map((row) => columns.map((col) => row[col.dataKey])),
  //     startY: 30,
  //     theme: 'grid',
  //     headStyles: {
  //       fontSize: 8.5,
  //       halign: 'center',
  //       fillColor: '#ffffff',
  //       textColor: '#000000',
  //       lineWidth: 0.5,
  //       lineColor: '#000000',
  //     },
  //     bodyStyles: {
  //       fontSize: 8.5,
  //       halign: 'center',
  //       lineWidth: 0.5,
  //       lineColor: '#000000',
  //     },
  //     styles: {
  //       overflow: 'linebreak',
  //       cellPadding: 1.5,
  //     },
  //     margin: { top: 10, left: 5, right: 5 },
  //     rowPageBreak: 'avoid',
  //   });

  //   const finalY = doc.lastAutoTable.finalY || 30;
  //   doc.setFont('helvetica', 'bold');
  //   doc.text(`Total Basic Pay: ${totalBasicSalary}`, 20, finalY + 10);
  //   doc.text(`Total Net Pay: ${totalNetPay}`, 200, finalY + 10);

  //   const footerY = finalY + 30;
  //   doc.setFont('helvetica', 'normal');
  //   doc.text('Rupees:', 20, footerY);
  //   doc.text(`${numberToWords(Number(totalNetPay.toFixed(2)))}`, 45, footerY);
  //   doc.text('Return after disbursement', 20, footerY + 10);
  //   doc.text(
  //     'Incharge: ......................................',
  //     20,
  //     footerY + 20
  //   );
  //   doc.text('Date: ................................', 120, footerY + 20);

  //   const pdfBlob = doc.output('blob');
  //   const blobUrl = URL.createObjectURL(
  //     new Blob([pdfBlob], { type: 'application/pdf' })
  //   );

  //   const iframe = document.createElement('iframe');
  //   iframe.style.display = 'none';
  //   iframe.src = blobUrl;
  //   document.body.appendChild(iframe);

  //   iframe.onload = () => {
  //     iframe.contentWindow?.focus();
  //     iframe.contentWindow?.print();
  //   };
  // };

  // version 3
  const handlePrint = async () => {
    const doc = new jsPDF('landscape');

    // Load Fonts
    const loadFont = async (url: string) => {
      const response = await fetch(url);
      return await response.arrayBuffer();
    };

    const regularFont = await loadFont('/Mona-Sans.ttf');
    const boldFont = await loadFont('/Mona-Sans-Bold.ttf');

    const regularFontString = new Uint8Array(regularFont).reduce(
      (data, byte) => data + String.fromCharCode(byte),
      ''
    );
    const boldFontString = new Uint8Array(boldFont).reduce(
      (data, byte) => data + String.fromCharCode(byte),
      ''
    );

    // Register Fonts
    doc.addFileToVFS('Mona_Sans.ttf', regularFontString);
    doc.addFont('Mona_Sans.ttf', 'Mona_Sans', 'normal');

    doc.addFileToVFS('Mona_Sans-Bold.ttf', boldFontString);
    doc.addFont('Mona_Sans-Bold.ttf', 'Mona_Sans', 'bold');

    // Header Section
    doc.setFont('Mona_Sans', 'bold');
    doc.setFontSize(14);
    doc.text('Purbanchal Security Consultants Pvt. Ltd.', 150, 10, {
      align: 'center',
    });

    doc.setFont('Mona_Sans', 'normal');
    doc.setFontSize(11);
    doc.text('Silpukhuri, Guwahati-03', 150, 16, { align: 'center' });

    doc.setFontSize(11);
    doc.text('Pay Roll of Staff Deployed at', 5, 24);
    doc.setFont('Mona_Sans', 'bold');
    if (selectedPostName) {
      doc.text(`${selectedPostName.toUpperCase()}`, 65, 24, { align: 'left' });
    }
    if (selectedDate) {
      const { firstDay, lastDay } = getFirstAndLastDay(selectedDate);
      doc.text(`For the period from: ${firstDay} To: ${lastDay}`, 292, 24, {
        align: 'right',
      });
    }

    // Prepare Table Columns
    const updatedColumns = [
      { name: 'slNo', label: 'Sl. No.' },
      ...columns,
      { name: 'sign', label: 'Sign' },
    ];

    autoTable(doc, {
      startY: 30,
      margin: { top: 5, left: 5, right: 5, bottom: 5 },
      head: [updatedColumns.map((col) => col.label)],
      body: withoutAllowanceReportData.map((row, index) => [
        index + 1,
        ...columns.map((col) => {
          if (col.name === 'empName') {
            return `${row.empName}\n${row.rank}`;
          } else if (col.name === 'deduction') {
            return `ESI: ${row.deduction.empESI} Adv: ${row.deduction.adv} \n EPF: ${row.deduction.empEPF} P.Tax: ${row.deduction.pTax}`;
          } else if (col.name === 'other') {
            return `Belt: ${row.other.belt}, Boot: ${row.other.boot}, Uniform: ${row.other.uniform}`;
          } else if (typeof row[col.name as keyof typeof row] === 'object') {
            return JSON.stringify(row[col.name as keyof typeof row]);
          } else {
            return String(row[col.name as keyof typeof row]);
          }
        }),
        '',
      ]),
      theme: 'grid',
      headStyles: {
        fillColor: '#ffffff',
        textColor: '#212529',
        font: 'Mona_Sans',
        fontStyle: 'bold',
        fontSize: 8.5,
        halign: 'center',
        lineWidth: 0.8,
        lineColor: '#000',
      },
      bodyStyles: {
        fillColor: '#fff',
        textColor: '#212529',
        font: 'Mona_Sans',
        fontStyle: 'bold',
        fontSize: 8.5,
        halign: 'center',
        lineWidth: 0,
        lineColor: '#000',
      },
      columnStyles: {
        0: { cellWidth: 10 },
        1: { cellWidth: 30 },
        2: { cellWidth: 30 },
      },
      styles: {
        cellPadding: { top: 1.5, bottom: 1.5, left: 1, right: 1 },
        overflow: 'linebreak',
      },
      didDrawCell: (data) => {
        const { cell, section } = data;
        if (section === 'body') {
          doc.setLineDashPattern([0.5, 0.5], 0);
          doc.setLineWidth(0.2);
          doc.setDrawColor(0, 0, 0);
          doc.line(
            cell.x,
            cell.y + cell.height,
            cell.x + cell.width,
            cell.y + cell.height
          );
        } else if (section === 'head') {
          doc.setLineDashPattern([], 0);
          doc.setLineWidth(0.4);
          doc.setDrawColor(0, 0, 0);
          doc.rect(cell.x, cell.y, cell.width, cell.height);
        }
      },
    });

    // Totals Row
    const totalText = ` Total`;
    const totalGrossPayText = ` ${totalBasicSalary}`;
    const totalNetPayText = ` ${totalNetPay}`;

    doc.setFont('Mona_Sans', 'bold');
    doc.setFontSize(10);
    doc.text(totalText, 20, doc.lastAutoTable.finalY + 8);
    doc.text(totalGrossPayText, 80, doc.lastAutoTable.finalY + 8);
    doc.text(totalNetPayText, 270, doc.lastAutoTable.finalY + 8);

    // Footer Section
    const footerY = doc.lastAutoTable.finalY + 18;
    doc.setFontSize(10);
    doc.text('Rupees:', 60, footerY);
    doc.text(
      `${numberToWords(parseFloat(totalNetPay.toFixed(2)))} only`,
      80,
      footerY
    );
    doc.text('Return after disbursement', 60, footerY + 8, { align: 'left' });
    doc.text(
      'Incharge: ..............................................................',
      60,
      footerY + 16
    );
    doc.text(
      'Date: .......................................',
      160,
      footerY + 16
    );

    // Now directly print (without new tab)
    const pdfBlob = doc.output('blob');
    const blobUrl = URL.createObjectURL(
      new Blob([pdfBlob], { type: 'application/pdf' })
    );

    const iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    iframe.src = blobUrl;
    document.body.appendChild(iframe);

    iframe.onload = () => {
      iframe.contentWindow?.focus();
      iframe.contentWindow?.print();
    };
  };

  const rowsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(1);
  // Calculate total pages
  const totalPages = Math.ceil(withoutAllowanceReportData.length / rowsPerPage);

  // Get the data to display for the current page
  const currentPageData = withoutAllowanceReportData.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  // Handle page navigation
  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  // Print controls
  const [isPrintMode] = useState(false);
  const rowsToDisplay = isPrintMode
    ? withoutAllowanceReportData
    : currentPageData;

  // JSX here
  return (
    <>
      {isLoading && <Loader />}
      <div className="flex flex-col">
        <div className="flex-none bg-tableHeadingColour">
          <div className="flex items-center justify-between px-2 2xl:px-4 border-t py-1 2xl:py-2">
            <div>
              <h2 className="text-primaryText text-xs">
                {/* Custom Report */}
              </h2>
            </div>
            <div className="flex items-center gap-4 text-responsive-button">
              <button
                onClick={goToPreviousPage}
                disabled={currentPage === 1}
                className={`${
                  currentPage === 1
                    ? 'text-tableBorder cursor-not-allowed'
                    : 'text-bgPrimaryButton hover:text-bgPrimaryButtonHover cursor-pointer font-semibold'
                }`}
              >
                Previous
              </button>
              <h2 className="text-primaryText font-bold">
                {/* Page 1 */}
                Page {currentPage} of {totalPages}
              </h2>
              <button
                onClick={goToNextPage}
                disabled={currentPage === totalPages}
                className={`${
                  currentPage === totalPages
                    ? 'text-tableBorder cursor-not-allowed'
                    : 'text-bgPrimaryButton hover:text-bgPrimaryButtonHover cursor-pointer font-semibold'
                }`}
              >
                Next
              </button>
            </div>
            {/* print and download */}
            <div className="report-action-buttons-container">
              <div>
                <button onClick={handlePrint}>
                  <img
                    src={PrintIcon}
                    alt="PrintIcon"
                    className="report-action-icon"
                  />
                </button>
              </div>
              <div className="relative">
                {/* download icon */}
                <button
                  onClick={() => setDownloadDropdownOpen((prev) => !prev)}
                >
                  <img
                    src={DownloadIcon}
                    alt="DownloadIcon"
                    className="report-action-icon"
                  />
                </button>
                {/* Dropdown for download options */}
                {downloadDropdownOpen && (
                  <div
                    ref={dropdownRef}
                    className="absolute right-0 top-8 z-20 w-48 bg-white shadow-lg"
                  >
                    <ul className="p-2">
                      <button onClick={() => setDownloadDropdownOpen(false)}>
                        <li
                          className="px-2 py-2 cursor-pointer font-medium hover:bg-gray-100"
                          onClick={handleExportPDF}
                        >
                          Export PDF
                        </li>
                      </button>
                      <button onClick={() => setDownloadDropdownOpen(false)}>
                        <li className="px-2 py-2 font-medium hover:bg-gray-100">
                          <CSVLink
                            headers={csvHeaders}
                            data={csvData}
                            filename={`WithoutAllowance_Report_${formatCSVDate()}.csv`}
                          >
                            Export CSV
                          </CSVLink>
                        </li>
                      </button>
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        {/* preview */}
        <div
          className="overflow-y-auto h-[calc(100vh-150px)] overflow-x-auto mt-2 px-2 scrollbar scrollbar-thumb-scrollBarColor scrollbar-track-scrollBarBg"
          ref={tableRef}
        >
          {doesReportExist ? (
            <div>
              <table className="w-full border-collapse font-bold overflow-y-auto">
                {/* Define column widths using colgroup */}
                <colgroup>
                  <col style={{ width: '5%' }} /> {/* Sl. No. */}
                  {visibleColumns.includes('empName') && (
                    <col style={{ width: '20%' }} />
                  )}
                  {visibleColumns.includes('days') && (
                    <col style={{ width: '10%' }} />
                  )}
                  {visibleColumns.includes('basicSalary') && (
                    <col style={{ width: '10%' }} />
                  )}
                  {visibleColumns.includes('extraDuty') && (
                    <col style={{ width: '10%' }} />
                  )}
                  {visibleColumns.includes('deduction') && (
                    <col style={{ width: '30%' }} />
                  )}
                  {visibleColumns.includes('other') && (
                    <col style={{ width: '20%' }} />
                  )}
                  {visibleColumns.includes('bonus') && (
                    <col style={{ width: '10%' }} />
                  )}
                  {visibleColumns.includes('otherDeduction') && (
                    <col style={{ width: '10%' }} />
                  )}
                  {visibleColumns.includes('totalDeduction') && (
                    <col style={{ width: '10%' }} />
                  )}
                  {visibleColumns.includes('netPay') && (
                    <col style={{ width: '10%' }} />
                  )}
                  <col style={{ width: '10%' }} /> {/* Sign */}
                </colgroup>

                {/* Header containing both company details and table header row */}
                <thead>
                  {/* First header row for company details */}
                  <tr>
                    <th
                      className="px-2 py-2 text-center"
                      colSpan={
                        1 + // Sl. No.
                        (visibleColumns.includes('empName') ? 1 : 0) +
                        (visibleColumns.includes('days') ? 1 : 0) +
                        (visibleColumns.includes('basicSalary') ? 1 : 0) +
                        (visibleColumns.includes('extraDuty') ? 1 : 0) +
                        (visibleColumns.includes('deduction') ? 1 : 0) +
                        (visibleColumns.includes('other') ? 1 : 0) +
                        (visibleColumns.includes('bonus') ? 1 : 0) +
                        (visibleColumns.includes('otherDeduction') ? 1 : 0) +
                        (visibleColumns.includes('totalDeduction') ? 1 : 0) +
                        (visibleColumns.includes('netPay') ? 1 : 0) +
                        1 // Sign
                      }
                    >
                      <div className="w-full">
                        {/* Company details */}

                        <div className="text-center">
                          <h2 className="reportPrimaryHeadings2 text-primaryText">
                            Purbanchal Security Consultants Pvt. Ltd.
                          </h2>
                          <h3 className="reportPrimaryHeadings2 text-primaryText">
                            Silpukhuri, Guwahati-03
                          </h3>
                        </div>
                        {/* Post Name and Date */}
                        <div className="flex justify-between items-center mt-4  ">
                          <div className="flex items-center gap-2">
                            <h3 className="reports-from-to text-primaryText">
                              Pay Roll of Staff Deployed at
                            </h3>
                            <h3 className="reports-from-to text-primaryText uppercase">
                              {selectedPostName || 'Select a Post'}
                            </h3>
                          </div>
                          <div className="flex items-center gap-2">
                            <h3 className="reports-from-to text-primaryText">
                              For the period from:
                            </h3>
                            <h3 className="reports-from-to text-primaryText">
                              {formattedStartDate}
                            </h3>
                            <h3 className="reports-from-to text-primaryText">
                              to
                            </h3>
                            <h3 className="reports-from-to text-primaryText">
                              {formattedEndDate}
                            </h3>
                          </div>
                        </div>
                      </div>
                    </th>
                  </tr>
                  {/* second tr */}
                  <tr>
                    <th
                      className="border-2 border-primaryText text-xs  px-2 py-0.5 text-center w-[5%]"
                      rowSpan={2}
                    >
                      Sl. No.
                    </th>
                    {visibleColumns.includes('empName') && (
                      <th
                        className="text-left border-2 border-primaryText text-xs  px-2 py-0.5  w-[20%]"
                        rowSpan={2}
                      >
                        Name & Rank
                      </th>
                    )}
                    {visibleColumns.includes('days') && (
                      <th
                        className="border-2 border-primaryText text-xs  px-2 py-0.5 text-center w-[10%]"
                        rowSpan={2}
                      >
                        Days
                      </th>
                    )}

                    {visibleColumns.includes('basicSalary') && (
                      <th
                        className="border-2 border-primaryText text-xs  px-2 py-0.5 text-center w-[10%]"
                        rowSpan={2}
                      >
                        Basic Pay
                      </th>
                    )}

                    {visibleColumns.includes('extraDuty') && (
                      <th
                        className="border-2 border-primaryText text-xs  px-2 py-0.5 text-center w-[10%]"
                        rowSpan={2}
                      >
                        Extra Duty
                      </th>
                    )}
                    {visibleColumns.includes('deduction') && (
                      <th
                        className="border-2 border-primaryText text-xs  px-2 py-0.5 text-center w-[20%]"
                        rowSpan={4}
                      >
                        Deduction
                      </th>
                    )}
                    {visibleColumns.includes('other') && (
                      <th
                        className="border-2 border-primaryText text-xs  px-2 py-0.5 text-center w-[15%]"
                        rowSpan={4}
                      >
                        Other
                      </th>
                    )}
                    {visibleColumns.includes('bonus') && (
                      <th
                        className="border-2 border-primaryText text-xs  px-2 py-0.5 text-center w-[10%]"
                        rowSpan={2}
                      >
                        Bonus
                      </th>
                    )}

                    {visibleColumns.includes('otherDeduction') && (
                      <th
                        className="border-2 border-primaryText text-xs  px-2 py-0.5 text-center w-[10%]"
                        rowSpan={2}
                      >
                        Other Deduction
                      </th>
                    )}

                    {visibleColumns.includes('totalDeduction') && (
                      <th
                        className="border-2 border-primaryText text-xs  px-2 py-0.5 text-center  w-[10%]"
                        rowSpan={2}
                      >
                        Total Deduction
                      </th>
                    )}

                    {visibleColumns.includes('netPay') && (
                      <th
                        className="border-2 border-primaryText text-xs  px-2 py-0.5 text-center w-[10%]"
                        rowSpan={2}
                      >
                        Net Pay
                      </th>
                    )}
                    {/* {visibleColumns.includes('sign') && (
                )} */}
                    <th
                      className="border-2 border-primaryText text-xs  px-2 py-0.5 text-center w-[10%]"
                      rowSpan={2}
                    >
                      Sign
                    </th>
                  </tr>
                </thead>

                {/* Body containing reports data and total */}
                <tbody className="text-center">
                  {/* {withoutAllowanceReportData.map((row, rowIndex) => ( */}
                  {rowsToDisplay.map((row, rowIndex) => (
                    <tr key={rowIndex}>
                      <td
                        // className={`border-b border-dotted border-primaryText px-2 ${withoutAllowanceReportData.length % 7 <= 2 ? 'py-9' : 'py-1'} text-xs `}
                        className={`border-b border-dotted border-primaryText px-2 py-1 text-xs`}
                      >
                        {isPrintMode
                          ? rowIndex + 1 // Show correct serial number for all rows in print mode
                          : (currentPage - 1) * rowsPerPage + rowIndex + 1}
                      </td>
                      <td className="border-b border-dotted text-left border-primaryText px-2 py-1 text-xs whitespace-nowrap">
                        <div className="flex flex-col gap-1">
                          <p> {row.empName}</p>
                          <p> {row.rank}</p>
                        </div>
                      </td>
                      <td className="border-b border-dotted border-primaryText text-right pr-5 py-1 text-xs ">
                        {row.days}
                      </td>
                      <td className="border-b border-dotted border-primaryText text-right pr-3 py-1 text-xs">
                        {row.basicSalary}
                      </td>
                      <td className="border-b border-dotted border-primaryText pr-3 py-1 text-xs text-right">
                        {row.extraDuty}
                      </td>

                      <td className="border-b border-dotted border-primaryText text-right pr-2 py-1">
                        <div className="flex items-center justify-between">
                          <div className="flex flex-col gap-5">
                            <div className="flex justify-between space-x-2">
                              <h3 className="text-xs  font-bold">ESI:</h3>
                              <h3 className="text-xs  font-bold">
                                {row.deduction.empESI}
                              </h3>
                            </div>
                            <div className="flex justify-between space-x-2">
                              <h3 className="text-xs  font-bold">EPF:</h3>
                              <h3 className="text-xs  font-bold">
                                {row.deduction.empEPF}
                              </h3>
                            </div>
                          </div>
                          <div className="flex flex-col gap-5 ml-2">
                            <div className="flex justify-between space-x-2">
                              <h3 className="text-xs  font-bold">Adv:</h3>
                              <h3 className="text-xs  font-bold">
                                {row.deduction.adv}
                              </h3>
                            </div>
                            <div className="flex justify-between space-x-2">
                              <h3 className="text-xs  font-bold">P.Tax:</h3>
                              <h3 className="text-xs  font-bold">
                                {row.deduction.pTax}
                              </h3>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="border-b border-dotted border-primaryText text-right pr-2 py-1">
                        <div className="flex flex-col gap-1">
                          <div className="flex justify-between space-x-2">
                            <h3 className="text-xs  font-bold">Belt:</h3>
                            <h3 className="text-xs  font-bold">
                              {row.other.belt}
                            </h3>
                          </div>
                          <div className="flex justify-between space-x-2">
                            <h3 className="text-xs  font-bold">Boot:</h3>
                            <h3 className="text-xs  font-bold">
                              {row.other.boot}
                            </h3>
                          </div>
                          <div className="flex justify-between space-x-2">
                            <h3 className="text-xs  font-bold">Uniform:</h3>
                            <h3 className="text-xs  font-bold">
                              {row.other.uniform}
                            </h3>
                          </div>
                        </div>
                      </td>
                      <td className="border-b border-dotted border-primaryText pr-2 py-1 text-xs text-right">
                        {row.bonus}
                      </td>
                      <td className="border-b border-dotted border-primaryText px-2 py-1 text-xs text-right">
                        {row.otherDeduction}
                      </td>
                      <td className="border-b border-dotted border-primaryText px-2 py-1 text-xs text-right">
                        {row.totalDeduction}
                      </td>

                      <td className="border-b border-dotted border-primaryText px-2 py-1 text-xs text-right">
                        {row.netPay}
                      </td>
                      <td className="border-b border-dotted border-primaryText px-2 py-1"></td>
                    </tr>
                  ))}
                  {/* total */}
                  <tr className="mt-2 mx-auto">
                    <td className="border-t-2 border-primaryText px-2 py-2 font-bold text-xs ">
                      Total
                    </td>

                    <td className="border-t-2 border-primaryText px-2 py-2 font-bold"></td>
                    <td className="border-t-2 border-primaryText px-2 py-2 font-bold"></td>
                    <td className="border-t-2 border-primaryText px-2 py-2 font-bold text-xs text-right">
                      {totalBasicSalary.toFixed(2)}
                    </td>
                    <td className="border-t-2 border-primaryText px-2 py-2 font-bold"></td>
                    <td className="border-t-2 border-primaryText px-2 py-2 font-bold"></td>
                    <td className="border-t-2 border-primaryText px-2 py-2 font-bold"></td>
                    <td className="border-t-2 border-primaryText px-2 py-2 font-bold"></td>
                    <td className="border-t-2 border-primaryText px-2 py-2 font-bold"></td>
                    <td className="border-t-2 border-primaryText px-2 py-2 font-bold"></td>
                    <td className="border-t-2 border-primaryText px-2 py-2 font-bold text-xs text-right">
                      {totalNetPay.toFixed(2)}
                    </td>
                    <td className="border-t-2 border-primaryText px-2 py-2"></td>
                  </tr>
                </tbody>
              </table>
              {/* Total */}
              <div
                className={`flex flex-col gap-2 items-start font-bold w-[50%] mx-auto justify-center footer-to-print ${withoutAllowanceReportData.length % 8 <= 2 ? 'py-4' : 'py-2'} `}
              >
                <div className="flex items-center gap-2">
                  <h2 className="text-primaryText reportPrimaryLabels2 font-bold">
                    Rupees:
                  </h2>
                  <h3 className="text-primaryText reportPrimaryLabels2 uppercase font-bold">
                    {numberToWords(Number(totalNetPay.toFixed(2)))}
                  </h3>
                </div>
                <h2 className="text-primaryText reportPrimaryLabels2 font-bold">
                  Return after disbursement
                </h2>
                <div className="flex items-center gap-2">
                  <h2 className="text-primaryText reportPrimaryLabels2 font-bold">
                    Incharge:.................................................................................
                  </h2>
                  <h3 className="text-primaryText reportPrimaryLabels2 font-bold">
                    Date:...............................
                  </h3>
                </div>
              </div>
              <br />
              <br />
              <br />
            </div>
          ) : isLoading ? null : (
            <p className="text-center py-20">
              Payroll hasn&rsquo;t been generated for this month yet.
            </p>
          )}
        </div>
        {/* <div className="overflow-y-auto bg-white max-h-[60vh] scrollbar scrollbar-thumb-scrollBarColor scrollbar-track-scrollBarBg">
         
        </div> */}
      </div>
    </>
  );
};

export default WithoutAllowanceReport;
