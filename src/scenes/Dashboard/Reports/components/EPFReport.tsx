// Libraries
import React, { useEffect, useRef, useState } from 'react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { CSVLink } from 'react-csv';

// Hooks
import useVerifyUserAuth from '../../../../hooks/useVerifyUserAuth';

// Types
// import { DsReport } from '../../../../types/report';

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

import './reports.css';
import { EPFRow } from '../../../../types/epfReportType';

// Prop types
interface EPFReportProps {
  // currentSelectedPostId: number;
  selectedPostName: string | null;
  selectedDate: Date | null;
  selectedPostIds: number[];
}

const EPFReport: React.FC<EPFReportProps> = ({
  // currentSelectedPostId,
  selectedPostName,
  selectedDate,
  selectedPostIds,
}) => {
  const accessToken = useVerifyUserAuth();
// 
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
  const alwaysVisibleColumns = [
    'accNo',
    'empName',
    'days',
    'basicSalary',
    'empEPF',
    'emplrEPF',
    'total',
  ];
  // Define the initial state of visible columns
  const [visibleColumns] = useState<string[]>([...alwaysVisibleColumns]);

  // Define column data
  const columns = [
    { name: 'basicSalary', label: 'EPF No.' },
    { name: 'empName', label: 'Name' },
    { name: 'days', label: 'No. of Days' },
    { name: 'basicSalary', label: 'Basic Salary' },
    { name: 'extraDuty', label: 'Employees Contribution' },
    { name: 'otherDeduction', label: 'Employers Contribution' },
    { name: 'netPay', label: 'Total' },
    { name: 'sign', label: 'Sign' },
  ];

  const [epfReportData, setEpfReportData] = useState<EPFRow[]>([]);
  const [doesReportExist, setDoesReportExist] = useState(false);

  const [totalBasicSalary, setTotalBasicSalary] = useState(0);
  const [grandTotalEpf, setGrandTotalEpf] = useState(0);

  const fetchEpfReportData = async () => {
    console.log('fetchEpfReportData');
    if (!accessToken || !selectedDate) return;
    setIsLoading(true);
    try {
      // const response = await axios.get(
      //   `${api.baseUrl}/reports/epf/${currentSelectedPostId}/${selectedDate.getMonth() + 1}/${selectedDate.getFullYear()}`,
      //   {
      //     headers: { 'x-access-token': accessToken },
      //   }
      // );
      const response = await axios.post(
        `${api.baseUrl}/reports/epf/all`,
        {
          postIds: selectedPostIds,
          month: selectedDate.getMonth() + 1,
          year: selectedDate.getFullYear(),
        },
        {
          headers: { 'x-access-token': accessToken },
        }
      );

      if (response.data && response.data.success) {
        toast.success(response.data.message);
        console.log('EPF Reports:', response.data.epfReports);
        console.log('EPF Reports:', response.data);
        setEpfReportData(response.data.epfReports);
        setTotalBasicSalary(Number(response.data.totalBasicSalary));
        setGrandTotalEpf(Number(response.data.grandTotalEpf));
        setDoesReportExist(true);
      } else {
        console.error('Error:', response.data.message);
      }
      console.log(
        'Sending reqeust with followinng post ids: ',
        selectedPostIds
      );
    } catch (error) {
      handleError(error);
      setDoesReportExist(false);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEpfReportData();
    // }, [accessToken, selectedPostName, selectedDate]);
  }, [accessToken, selectedDate]);

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
  // const totalBasicSalary = epfReportData.reduce(
  //   (sum, row) => sum + parseFloat(row.basicSalary),
  //   0
  // );
  // const totalNetPay = epfReportData.reduce(
  //   (sum, row) => sum + parseFloat(row.basicSalary),
  //   0
  // );
  // const totalBasicSalary = 0;
  // const totalNetPay = 0;
  /////////////////////////////////////
  const [downloadDropdownOpen, setDownloadDropdownOpen] = useState(false); // To toggle dropdown
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  // Function to generate PDF

  const handleExportPDF = async () => {
    const doc = new jsPDF('landscape'); // Create PDF in landscape mode
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

    // Add Company Details
    doc.setFont('Mona_Sans', 'bold');
    doc.setFontSize(14);
    doc.text('Purbanchal Security Consultants Pvt. Ltd.', 150, 20, {
      align: 'center',
    }); // Centered
    doc.setFont('Mona_Sans', 'normal');
    doc.setFontSize(12);
    doc.text('Silpukhuri, Guwahati-03', 148, 28, { align: 'center' });

    // Add Payroll Information
    doc.setFontSize(12);
    doc.text('Pay Roll of Staff Deployed at', 16, 50);
    doc.setFont('Mona_Sans', 'bold');
    doc.setFontSize(14);
    // doc.text(`${selectedPostName.toUpperCase()}`, 78, 50, { align: 'left' });
    if (selectedPostName) {
      doc.text(`${selectedPostName.toUpperCase()}`, 78, 50, { align: 'left' });
    }
    // Add Payroll Period
    doc.setFontSize(12);
    if (selectedDate) {
      doc.text(
        `For the period from: ${getFirstAndLastDay(selectedDate).firstDay}`,
        250,
        50,
        {
          align: 'right',
        }
      );
    }
    if (selectedDate) {
      doc.text(`To: ${getFirstAndLastDay(selectedDate).lastDay}`, 280, 50, {
        align: 'right',
      });
    }
    // Add "Sl. No." to the columns
    const updatedColumns = [
      { name: 'slNo', label: 'Sl. No.' }, // Add the serial number column
      ...columns,
    ];

    // Generate the Table
    autoTable(doc, {
      startY: 60, // Start the table after the header details
      head: [updatedColumns.map((col) => col.label)],
      // body: epfReportData.map((row, index) => [
      //   index + 1, // Serial Number (Sl. No.)
      //   ...columns.map((col) => {
      //     if (col.name === 'allowances') {
      //       return `Kit: ${row.}, City: ${row.allowances.cityAllowances}, Conv/H.Rent: ${row.allowances.convHra}`;
      //     } else if (col.name === 'deduction') {
      //       return `ESI: ${row.deduction.empEPF}, EPF: ${row.deduction.empEPF}, Adv: ${row.deduction.adv}, P.Tax: ${row.deduction.pTax}`;
      //     } else if (col.name === 'other') {
      //       return `Belt: ${row.other.belt}, Boot: ${row.other.boot}, Uniform: ${row.other.uniform}`;
      //     } else {
      //       return row[col.name as keyof typeof row];
      //     }
      //   }),
      body: epfReportData.map((row, index) => [
        index + 1,
        row.accNo,
        row.empName,
        row.days,
        row.basicSalary,
        row.empEPF,
        row.emplrEPF,
        row.empEPF + row.emplrEPF,
      ]),

      theme: 'grid',
      headStyles: {
        fillColor: '#ffffff',
        textColor: '#212529',
        font: 'Mona_Sans',
        fontStyle: 'bold',
        fontSize: 10,
        halign: 'center',
        lineWidth: 0.2,
        lineColor: '#000',
      },
      bodyStyles: {
        fillColor: '#fff',
        textColor: '#212529',
        font: 'Mona_Sans',
        fontStyle: 'normal',
        fontSize: 10,
        halign: 'center',
        lineWidth: 0,
        lineColor: '#000',
      },
      columnStyles: {
        0: { cellWidth: 10 }, // Adjust the width of Sl. No. column
        1: { cellWidth: 30 },
        2: { cellWidth: 30 },
      },
      didDrawCell: (data) => {
        const { cell, section } = data;

        if (section === 'body') {
          // Draw only the bottom dotted border
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
          // Draw full solid border for head
          doc.setLineDashPattern([], 0);
          doc.setLineWidth(0.4);
          doc.setDrawColor(0, 0, 0);
          doc.rect(cell.x, cell.y, cell.width, cell.height);
        }
      },
      // margin: { top: 80, bottom: 20 },
    });

    // Add Total Row (Total Basic Salary and Total Net Pay)
    const totalText = ` Total`;
    const totalBasicSalaryText = ` ${totalBasicSalary}`;
    const grandTotalEpftText = ` ${grandTotalEpf}`;

    doc.setFont('Mona_Sans', 'normal');
    doc.setFontSize(10);
    doc.text(totalText, 30, doc.lastAutoTable.finalY + 10);
    doc.text(totalBasicSalaryText, 120, doc.lastAutoTable.finalY + 10);
    doc.text(grandTotalEpftText, 255, doc.lastAutoTable.finalY + 10);

    // Add Footer
    const footerY = doc.lastAutoTable.finalY + 30; // Adjusting vertical position after the table
    doc.setFontSize(12);
    doc.text('Rupees:', 70, footerY);
    doc.text(
      `${numberToWords(parseFloat(totalBasicSalary.toFixed(2)))} only`,
      88,
      footerY
    );

    doc.text('Return after disbursement', 142, footerY + 10, {
      align: 'center',
    });

    doc.text(
      'Incharge: ..............................................................',
      70,
      footerY + 20
    );
    doc.text(
      'Date: .......................................',
      160,
      footerY + 20
    );

    // Save the PDF
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
    doc.save(`EPF_Report_${formattedDate}_${formattedTime}.pdf`);
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
    { label: 'Sl. No.', key: 'slNo' }, // Add serial number column
    { label: 'UAN', key: 'accNo' },
    { label: 'Name', key: 'empName' },
    { label: 'No. of Days', key: 'days' },
    { label: 'Basic Salary', key: 'basicSalary' },
    { label: 'Employees Contribution', key: 'empEPF' },
    { label: 'Employers Contribution', key: 'emplrEPF' },
    { label: 'Total', key: 'total' },
    { label: 'Sign', key: '' },
  ];

  // CSV Data
  const csvData = epfReportData.map((row, index) => ({
    slNo: index + 1, // Serial number
    accNo: row.accNo,
    empName: row.empName,
    days: row.days,
    basicSalary: row.basicSalary,
    empEPF: row.empEPF,
    emplrEPF: row.emplrEPF,
    total: row.total,
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

  // print function
  const tableRef = useRef<HTMLDivElement>(null);

  // const handlePrint = () => {
  //   const printContents = tableRef.current?.innerHTML;

  //   if (printContents) {
  //     // Create a new iframe for printing
  //     const iframe = document.createElement('iframe');
  //     iframe.style.position = 'absolute';
  //     iframe.style.width = '0';
  //     iframe.style.height = '0';
  //     iframe.style.border = 'none';
  //     document.body.appendChild(iframe);

  //     const doc = iframe.contentWindow?.document || iframe.contentDocument;

  //     if (doc) {
  //       doc.open();

  //       // Copy the styles from the main document
  //       const styleSheets = Array.from(document.styleSheets)
  //         .map((styleSheet) => {
  //           try {
  //             return Array.from(styleSheet.cssRules)
  //               .map((rule) => rule.cssText)
  //               .join('');
  //           } catch (e) {
  //             // Sometimes accessing cross-origin styles throws errors, ignore those
  //             return '';
  //           }
  //         })
  //         .join('');

  //       // Write the table's content and the copied styles to the iframe
  //       doc.write(`
  //         <html>
  //           <head>
  //             <style>${styleSheets}</style>
  //           </head>
  //           <body>${printContents}</body>
  //         </html>
  //       `);

  //       doc.close();

  //       iframe.contentWindow?.focus();
  //       iframe.contentWindow?.print();
  //       document.body.removeChild(iframe); // Remove iframe after printing
  //     }
  //   }
  // };

  // Print controls

  const handlePrint = () => {
    setIsPrintMode(true); // Enable print mode to render all pages

    setTimeout(() => {
      const printContents = tableRef.current?.innerHTML;

      if (printContents) {
        // Create a new iframe for printing
        const iframe = document.createElement('iframe');
        iframe.style.position = 'absolute';
        iframe.style.width = '0';
        iframe.style.height = '0';
        iframe.style.border = 'none';
        document.body.appendChild(iframe);

        const doc = iframe.contentWindow?.document || iframe.contentDocument;

        if (doc) {
          doc.open();

          // Copy the styles from the main document
          const styleSheets = Array.from(document.styleSheets)
            .map((styleSheet) => {
              try {
                return Array.from(styleSheet.cssRules)
                  .map((rule) => rule.cssText)
                  .join('');
              } catch (e) {
                // Sometimes accessing cross-origin styles throws errors, ignore those
                return '';
              }
            })
            .join('');

          // Write the table's content and the copied styles to the iframe
          doc.write(`
          <html>
            <head>
              <style>${styleSheets}</style>
            </head>
            <body>${printContents}</body>
          </html>
        `);

          doc.close();

          iframe.contentWindow?.focus();
          iframe.contentWindow?.print();
          document.body.removeChild(iframe); // Remove iframe after printing
        }
      }

      setIsPrintMode(false); // Disable print mode after printing
    }, 0); // Allow React to re-render the table with all rows before printing
  };

  // pagination

  // pagi
  const rowsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(1);
  // Calculate total pages
  const totalPages = Math.ceil(epfReportData.length / rowsPerPage);

  // Get the data to display for the current page
  const currentPageData = epfReportData.slice(
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
  const [isPrintMode, setIsPrintMode] = useState(false);
  const rowsToDisplay = isPrintMode ? epfReportData : currentPageData;

  // JSX here
  return (
    <>
      {isLoading && <Loader />}
      <div className="flex flex-col print:hidden">
        <div className="flex-none bg-tableHeadingColour">
          <div className="flex items-center justify-between px-2 2xl:px-4 border-t py-1 2xl:py-2">
            <div className="">
              <h2 className="text-primaryText text-xs lg:text-sm  ">
                {/* Custom Report */}
              </h2>
            </div>

            {/* Pagination controls */}
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
                      <li
                        className="px-4 py-2 cursor-pointer font-medium hover:bg-gray-100"
                        onClick={() => {
                          handleExportPDF();
                          setDownloadDropdownOpen(false);
                        }}
                      >
                        Export PDF
                      </li>
                      <li
                        onClick={() => setDownloadDropdownOpen(false)}
                        className="px-4 py-2 font-medium hover:bg-gray-100"
                      >
                        <CSVLink
                          headers={csvHeaders}
                          data={csvData}
                          filename={`EPF_Report_${formatCSVDate()}.csv`}
                        >
                          Export CSV
                        </CSVLink>
                      </li>
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        {/* Preview Container */}

        {/* EPF report table */}
        <div
          className="overflow-y-auto h-[calc(100vh-150px)] overflow-x-auto mt-2 px-2 scrollbar scrollbar-thumb-scrollBarColor scrollbar-track-scrollBarBg"
          ref={tableRef}
        >
          {doesReportExist ? (
            <div>
              {/* table */}
              <table
                // id="detailsReportTable"
                className="w-full border-collapse font-bold overflow-y-auto"
              >
                {/* Define column widths using colup */}
                <colgroup>
                  <col style={{ width: '5%' }} /> {/* Sl. No. */}
                  {visibleColumns.includes('accNo') && (
                    <col style={{ width: '10%' }} />
                  )}
                  {visibleColumns.includes('empName') && (
                    <col style={{ width: '10%' }} />
                  )}
                  {visibleColumns.includes('days') && (
                    <col style={{ width: '10%' }} />
                  )}
                  {visibleColumns.includes('basicSalary') && (
                    <col style={{ width: '10%' }} />
                  )}
                  {visibleColumns.includes('empEPF') && (
                    <col style={{ width: '10%' }} />
                  )}
                  {visibleColumns.includes('emplrEPF') && (
                    <col style={{ width: '10%' }} />
                  )}
                  {visibleColumns.includes('total') && (
                    <col style={{ width: '10%' }} />
                  )}
                  <col style={{ width: '10%' }} /> {/* Sign */}
                </colgroup>

                {/* header containing both company and table header */}
                <thead>
                  {/* first tr */}
                  <tr>
                    <th
                      className="px-2 py-2 text-center"
                      colSpan={
                        1 + // Sl. No.
                        // 1 + // Sl. No.
                        (visibleColumns.includes('accNo') ? 1 : 0) +
                        (visibleColumns.includes('empName') ? 1 : 0) +
                        (visibleColumns.includes('days') ? 1 : 0) +
                        (visibleColumns.includes('basicSalary') ? 1 : 0) +
                        (visibleColumns.includes('empEPF') ? 1 : 0) +
                        (visibleColumns.includes('emplrEPF') ? 1 : 0) +
                        (visibleColumns.includes('total') ? 1 : 0) +
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
                        <div className="flex justify-between items-center w-full mt-4">
                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-4">
                              <h3 className="reports-from-to text-primaryText">
                                For the period from:
                              </h3>

                              <h3 className="reports-from-to text-primaryText">
                                {formattedStartDate}
                              </h3>
                            </div>
                            <div className="flex items-center gap-4">
                              <h3 className="reports-from-to text-primaryText">
                                To:
                              </h3>

                              <h3 className="reports-from-to text-primaryText">
                                {formattedEndDate}
                              </h3>
                            </div>
                          </div>
                        </div>
                      </div>
                    </th>
                  </tr>
                  {/* second tr */}
                  <tr>
                    <th className="border-2 border-primaryText px-4 py-1 text-center text-xs  w-[10%]">
                      Sl. No.
                    </th>
                    {/* <th
                        className="border-2 border-primaryText px-4 py-1 text-center text-xs  w-[10%]"
                        rowSpan={2}
                      >
                        EPF No.
                      </th> */}
                    {visibleColumns.includes('accNo') && (
                      <th
                        className="border-2 border-primaryText px-4 py-1 text-center text-xs  w-[10%]"
                        rowSpan={2}
                      >
                        UAN
                      </th>
                    )}
                    {visibleColumns.includes('empName') && (
                      <th
                        className="border-2 border-primaryText px-4 py-1 text-left text-xs  w-[10%]"
                        rowSpan={2}
                      >
                        Name
                      </th>
                    )}
                    {visibleColumns.includes('days') && (
                      <th
                        className="border-2 border-primaryText px-4 py-1 text-center text-xs  w-[10%]"
                        rowSpan={2}
                      >
                        No. of Days
                      </th>
                    )}

                    {visibleColumns.includes('basicSalary') && (
                      <th
                        className="border-2 border-primaryText px-4 py-1 text-center text-xs  w-[10%]"
                        rowSpan={2}
                      >
                        Basic Salary
                      </th>
                    )}

                    {visibleColumns.includes('empEPF') && (
                      <th
                        className="border-2 border-primaryText px-4 py-1 text-center text-xs  w-[10%]"
                        rowSpan={2}
                      >
                        Employees Contribution
                      </th>
                    )}
                    {visibleColumns.includes('emplrEPF') && (
                      <th
                        className="border-2 border-primaryText px-4 py-1 text-center text-xs  w-[10%]"
                        rowSpan={2}
                      >
                        Employers Contribution
                      </th>
                    )}
                    {visibleColumns.includes('total') && (
                      <th
                        className="border-2 border-primaryText px-4 py-1 text-center text-xs  w-[10%]"
                        rowSpan={2}
                      >
                        Total
                      </th>
                    )}

                    <th
                      className="border-2 border-primaryText px-4 py-1 text-center text-xs  w-[10%]"
                      rowSpan={2}
                    >
                      Sign
                    </th>
                  </tr>
                </thead>
                <tbody className="text-center">
                  {/* {epfReportData.map((row, rowIndex) => ( */}
                  {rowsToDisplay.map((row, rowIndex) => (
                    <tr key={rowIndex}>
                      <td
                        className={`border-b border-dotted border-primaryText px-4 ${epfReportData.length % 14 <= 2 ? 'py-3' : 'py-1'} text-xs `}
                      >
                        {isPrintMode
                          ? rowIndex + 1 // Show correct serial number for all rows in print mode
                          : (currentPage - 1) * rowsPerPage + rowIndex + 1}
                      </td>
                      <td
                        className={`border-b border-dotted border-primaryText px-4 py-2 text-xs text-right`}
                      >
                        {row.accNo}
                      </td>
                      <td
                        className={`border-b border-dotted border-primaryText text-left px-4 py-2 text-xs  whitespace-nowrap`}
                      >
                        {row.empName}
                      </td>
                      <td
                        className={`border-b border-dotted border-primaryText px-4 py-2 text-xs text-right`}
                      >
                        {row.days}
                      </td>
                      <td
                        className={`border-b border-dotted border-primaryText px-4 py-2 text-xs text-right`}
                      >
                        {row.basicSalary}
                      </td>
                      <td
                        className={`border-b border-dotted border-primaryText px-4 py-2 text-xs text-right`}
                      >
                        {row.empEPF}
                      </td>

                      <td
                        className={`border-b border-dotted border-primaryText px-4 py-2 text-xs text-right`}
                      >
                        {row.emplrEPF}
                      </td>

                      <td
                        className={`border-b border-dotted border-primaryText px-4 py-2 text-xs text-right`}
                      >
                        {row.total}
                      </td>
                      <td
                        className={`border-b border-dotted border-primaryText px-4 py-2 text-xs `}
                      >
                        {/* {row.netPay} */}
                      </td>
                    </tr>
                  ))}
                  {/* total */}
                  <tr className="mt-2 mx-auto">
                    <td className="border-t-2 border-primaryText px-4 py-2 font-bold"></td>
                    <td className="border-t-2 border-primaryText px-4 py-2 font-bold text-xs ">
                      Total
                    </td>

                    <td className="border-t-2 border-primaryText px-4 py-2 font-bold"></td>
                    <td className="border-t-2 border-primaryText px-4 py-2 font-bold"></td>
                    <td className="border-t-2 border-primaryText px-4 py-2 font-bold text-xs text-right">
                      {totalBasicSalary.toFixed(2)}
                    </td>

                    <td className="border-t-2 border-primaryText px-4 py-2 font-bold"></td>
                    <td className="border-t-2 border-primaryText px-4 py-2 font-bold"></td>
                    <td className="border-t-2 border-primaryText px-4 py-2 font-bold text-xs text-right">
                      {grandTotalEpf.toFixed(2)}
                    </td>
                    <td className="border-t-2 border-primaryText px-4 py-2 font-bold"></td>
                  </tr>
                </tbody>
              </table>
              {/* disbursment */}
              <div
                className={`flex flex-col gap-2 items-start font-bold w-[50%] mx-auto justify-center footer-to-print ${epfReportData.length % 8 <= 2 ? 'py-4' : 'py-2'} `}
              >
                <div className="flex items-center gap-4">
                  <h2 className="text-primaryText reportPrimaryLabels2 font-bold">
                    Rupees:
                  </h2>
                  <h3 className="text-primaryText reportPrimaryLabels2 uppercase font-bold">
                    {numberToWords(Number(grandTotalEpf.toFixed(2)))}
                  </h3>
                </div>
                <h2 className="text-primaryText reportPrimaryLabels2">
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
            <p className="text-center py-20 font-medium">
              Payroll hasn&rsquo;t been generated for this month yet.
            </p>
          )}
        </div>
      </div>
    </>
  );
};

export default EPFReport;
