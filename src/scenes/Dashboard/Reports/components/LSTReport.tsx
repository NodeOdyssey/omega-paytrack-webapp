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
import { LSTReportRow } from '../../../../types/lstReportTypes';
import Loader from '../../../../common/Loader/Loader';

interface LSTReportProps {
  currentSelectedPostId: number;
  selectedPostName: string | null;
  selectedDate: Date | null;
}

const LSTReport: React.FC<LSTReportProps> = ({
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

  const visibleColumns = [
    'empName',
    'days',
    'eightHourPay',
    // 'vda',
    'uniform',
    'specialAllowance',
    'weeklyOff',
    'total',
    'extraDuty',
    'adv',
    'deduction',
    'empEPF',
    'empESI',
    'emplrEPF',
    'emplrESI',
    'totalDeduction',
    'netPay',
  ];

  // Define column data

  // const columns = [
  //   { name: 'empName', label: 'Name & Rank' },
  //   { name: 'days', label: 'Days' },
  //   { name: 'eightHourPay', label: '8 Hour Pay' },
  //   { name: 'vda', label: 'VDA' },
  //   { name: 'uniform', label: 'Uniform' },
  //   { name: 'hra', label: 'House Rent' },
  //   { name: 'total', label: 'Total' },
  //   { name: 'extraDuty', label: 'Extra Duty' },
  //   { name: 'adv', label: 'Adv' },

  //   { name: 'empEPF', label: 'Employee EPF' },
  //   { name: 'empESI', label: 'Employee ESI' },
  //   { name: 'emplrEPF', label: 'Employer EPF' },
  //   { name: 'emplrESI', label: 'Employer ESI' },

  //   { name: 'totalDeduction', label: 'Total Deduction' },
  //   { name: 'netPay', label: 'Net Pay' },
  //   { name: 'sign', label: 'Sign' },
  // ];

  const [lstReportData, setLstReportData] = useState<LSTReportRow[]>([]);
  const [doesReportExist, setDoesReportExist] = useState(false);
  const [totalAllowance, setTotalAllowance] = useState(0);
  const [totalNetPay, setTotalNetPay] = useState(0);

  const fetchDsReportData = async () => {
    if (!accessToken || !selectedPostName || !selectedDate) return;
    setIsLoading(true);
    try {
      const response = await axios.get(
        `${api.baseUrl}${api.reports}/lst/${currentSelectedPostId}/${selectedDate.getMonth() + 1}/${selectedDate.getFullYear()}`,
        {
          headers: { 'x-access-token': accessToken },
        }
      );
      if (response.data && response.data.success) {
        toast.success(response.data.message);
        setDoesReportExist(true);
        console.log('Reports:', response.data.lstReports);
        setLstReportData(response.data.lstReports);
        setTotalAllowance(Number(response.data.totalAllowance));
        setTotalNetPay(Number(response.data.totalNetPay));
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
    fetchDsReportData();
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
  // const totalAllowance = lstReportData.reduce(
  //   (sum, row) =>
  //     sum +
  //     parseFloat(
  //       row.eightHourPay +
  //         row.vda +
  //         row.uniform +
  //         row.specialAllowance +
  //         row.weeklyOff
  //     ),
  //   0
  // );
  // const totalNetPay = lstReportData.reduce(
  //   (sum, row) => sum + parseFloat(row.netPay),
  //   0
  // );
  /////////////////////////////////////
  const [downloadDropdownOpen, setDownloadDropdownOpen] = useState(false); // To toggle dropdown
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const handleExportPDF = async () => {
    const doc = new jsPDF('landscape', 'pt', 'a3'); // Create PDF in landscape mode

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
    doc.text('Purbanchal Security Consultants Pvt. Ltd.', 550, 35, {
      align: 'center',
    }); // Centered
    doc.setFont('Mona_Sans', 'normal');
    doc.setFontSize(12);
    doc.text('Silpukhuri, Guwahati-03', 550, 55, { align: 'center' });

    // Add Payroll Information
    doc.setFontSize(12);
    doc.text('Pay Roll of Staff Deployed at', 40, 80);
    doc.setFont('Mona_Sans', 'bold');
    doc.setFontSize(14);
    // doc.text(`${selectedPostName.toUpperCase()}`, 200, 80, { align: 'left' });
    if (selectedPostName) {
      doc.text(`${selectedPostName.toUpperCase()}`, 200, 80, { align: 'left' });
    }

    // Add Payroll Period
    doc.setFontSize(12);
    if (selectedDate) {
      doc.text(
        `For the period from: ${getFirstAndLastDay(selectedDate).firstDay}`,
        850,
        80,
        {
          align: 'right',
        }
      );
    }
    if (selectedDate) {
      doc.text(`To: ${getFirstAndLastDay(selectedDate).lastDay}`, 950, 80, {
        align: 'right',
      });
    }
    // Add "Sl. No." to the columns
    // const updatedColumns = [
    //   { name: 'slNo', label: 'Sl. No.' }, // Add the serial number column
    //   ...columns,
    // ];

    autoTable(doc, {
      startY: 100, // Start the table after the header details

      head: [
        // updatedColumns
        //   .map((col) => {
        //     if (col.name === 'deduction') {
        //       // Deduction column with sub-columns
        //       return [
        //         'Employee EPF',
        //         'Employee ESI',
        //         'Employer EPF',
        //         'Employer ESI',
        //       ];
        //     }
        //     return col.label;
        //   })
        //   .flat(), // Flatten the array to include all sub-columns under Deduction
        [
          { content: 'Sl No.', rowSpan: 2 },
          { content: 'Name & Rank', rowSpan: 2 },
          { content: 'No. of Days', rowSpan: 2 },
          { content: '8 Hours Pay', rowSpan: 2 },
          { content: 'VDA', rowSpan: 2 },
          { content: 'Uniform', rowSpan: 2 },
          { content: 'Special Allowance', rowSpan: 2 },
          { content: 'Weekly Off', rowSpan: 2 },
          { content: 'Total', rowSpan: 2 },
          { content: 'Extra Duty', rowSpan: 2 },
          { content: 'Adv', rowSpan: 2 },
          { content: 'Deduction', colSpan: 4 },
          { content: 'Total Deduction', rowSpan: 2 },
          { content: 'Net Pay', rowSpan: 2 },
          { content: 'Sign', rowSpan: 2 },
        ],
        ['Employee EPF', 'Employee ESI', 'Employer EPF', 'Employer ESI'],
      ],
      body: lstReportData.map((row, index) => [
        index + 1, // Serial Number (Sl. No.)
        // ...columns.flatMap((col) => {
        //   if (col.name === 'deduction') {
        //     return [
        //       row.deduction.empEPF || '', // Employee EPF
        //       row.deduction.empESI || '', // Employee ESI
        //       row.deduction.empEPF || '', // Employer EPF
        //       row.deduction.empESI || '', // Employer ESI
        //     ];
        //   } else if (col.name === 'other') {
        //     return `Belt: ${row.other.belt}, Boot: ${row.other.boot}, Uniform: ${row.other.uniform}`;
        //   } else {
        //     return row[col.name as keyof typeof row];
        //   }
        // }),
        `${row.empName}\n${row.rank}`,
        // row.empName,

        row.days,
        row.eightHourPay,
        // row.vda,
        row.uniform,
        row.specialAllowance,
        row.weeklyOff,
        row.eightHourPay + row.uniform + row.weeklyOff,
        row.extraDuty,
        row.adv,
        // row.deduction.empEPF,
        `${row.deduction.empEPF}\n P.Tax: ${row.deduction.pTax}`,
        row.deduction.empESI,
        row.deduction.empEPF,
        row.deduction.empESI,
        row.totalDeduction,
        row.netPay,
        row.sign,
      ]),
      theme: 'grid',
      headStyles: {
        fillColor: '#ffffff',
        textColor: '#212529',
        font: 'Mona_Sans',
        fontStyle: 'bold',
        fontSize: 10,
        halign: 'center',
        lineWidth: 0.5,
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
        0: { cellWidth: 50 }, // Adjust the width of Sl. No. column
        1: { cellWidth: 80 },
        2: { cellWidth: 50 },
        3: { cellWidth: 80 },
        4: { cellWidth: 50 },
        5: { cellWidth: 50 },
        6: { cellWidth: 70 },
        7: { cellWidth: 80 },
        8: { cellWidth: 50 },
        9: { cellWidth: 50 },
        10: { cellWidth: 60 },
        11: { cellWidth: 60 },
        12: { cellWidth: 60 },
        13: { cellWidth: 60 },
        14: { cellWidth: 50 },
        15: { cellWidth: 50 },
        16: { cellWidth: 50 },
        17: { cellWidth: 50 },
      },
      didDrawCell: (data) => {
        const { cell, section } = data;

        if (section === 'body') {
          // Draw only the bottom dotted border
          doc.setLineDashPattern([1, 1], 0);
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
          doc.setLineWidth(0.5);
          doc.setDrawColor(0, 0, 0);
          doc.rect(cell.x, cell.y, cell.width, cell.height);
        }
      },
      // margin: { top: 80, bottom: 20 },
    });

    // Add Total Row (Total Gross Pay and Total Net Pay)

    const totalText = ` Total`;
    const totalGrossPayText = ` ${totalAllowance}`;
    const totalNetPayText = ` ${totalNetPay}`;

    doc.setFont('Mona_Sans', 'normal');
    doc.setFontSize(10);
    doc.text(totalText, 110, doc.lastAutoTable.finalY + 20);
    doc.text(totalGrossPayText, 558, doc.lastAutoTable.finalY + 20);
    doc.text(totalNetPayText, 998, doc.lastAutoTable.finalY + 20);

    // Add Footer
    const footerY = doc.lastAutoTable.finalY + 70; // Adjusting vertical position after the table
    doc.setFontSize(12);
    doc.text('Rupees:', 350, footerY);
    doc.text(
      `${numberToWords(parseFloat(totalNetPay.toFixed(2)))} only`,
      400,
      footerY
    );

    doc.text('Return after disbursement', 550, footerY + 40, {
      align: 'center',
    });

    doc.text(
      'Incharge: ..............................................................',
      370,
      footerY + 80
    );
    doc.text(
      'Date: .......................................',
      650,
      footerY + 80
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
    doc.save(`LST_Report_${formattedDate}_${formattedTime}.pdf`);
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
    { label: 'Name', key: 'empName' },
    { label: 'Rank', key: 'rank' },
    { label: 'No. of Days', key: 'days' },
    { label: '8 Hours Pay', key: 'eightHourPay' },
    // { label: 'VDA', key: 'vda' },
    { label: 'Uniform', key: 'uniform' },
    { label: 'Special Allowance', key: 'specialAllowance' },
    { label: 'Weekly Off', key: 'weeklyOff' },
    { label: 'Total', key: 'total' },
    { label: 'Extra Duty', key: 'extraDuty' },
    { label: 'Adv', key: 'adv' },
    { label: 'Employee ESI', key: 'deduction.empESI' },
    { label: 'Employee EPF', key: 'deduction.empEPF' },
    { label: 'Employer ESI', key: 'emplrESI' },
    { label: 'Employer EPF', key: 'emplrEPF' },
    { label: 'P. Tax', key: 'pTax' },
    { label: 'Total Deduction', key: 'totalDeduction' },
    { label: 'Net Pay', key: 'netPay' },
    { label: 'Sign', key: '' },
  ];

  const csvData = lstReportData.map((row, index) => ({
    slNo: index + 1, // Serial number
    empName: row.empName,
    rank: row.rank,
    days: row.days,
    eightHourPay: row.eightHourPay,
    // vda: row.vda,
    uniform: row.uniform,
    specialAllowance: row.specialAllowance,
    weeklyOff: row.weeklyOff,
    total: row.eightHourPay + row.vda + row.vda + row.uniform,
    extraDuty: row.extraDuty,
    adv: row.adv,
    deduction: {
      empESI: row.deduction.empESI,
      empEPF: row.deduction.empEPF,
      emplrESI: row.deduction.emplrESI,
      emplrEPF: row.deduction.emplrEPF,
      pTax: row.deduction.pTax,
    },
    // pTax: row.deduction.pTax,
    // grossPay: row.grossPay,
    // otherDeduction: row.otherDeduction,
    totalDeduction: row.totalDeduction,
    netPay: row.netPay,
  }));

/*************  ✨ Windsurf Command ⭐  *************/
/**
 * Closes the download dropdown modal by setting its open state to false.
 */

/*******  36a57a1b-f79a-47b5-ae63-dfbc8d5d141f  *******/
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
  //          <html>
  //            <head>
  //              <style>${styleSheets}</style>
  //            </head>
  //            <body>${printContents}</body>
  //          </html>
  //        `);

  //       doc.close();

  //       iframe.contentWindow?.focus();
  //       iframe.contentWindow?.print();
  //       document.body.removeChild(iframe); // Remove iframe after printing
  //     }
  //   }
  // };

  // pagination
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

  const rowsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(1);
  // Calculate total pages
  const totalPages = Math.ceil(lstReportData.length / rowsPerPage);

  // Get the data to display for the current page
  const currentPageData = lstReportData.slice(
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
  const rowsToDisplay = isPrintMode ? lstReportData : currentPageData;

  // JSX here
  return (
    <>
      {isLoading && <Loader />}

      <div className=" flex flex-col">
        <div className="flex-none bg-tableHeadingColour">
          <div className="flex items-center justify-between px-2 2xl:px-4 border-t py-1 2xl:py-2">
            <div>
              <h2 className="text-primaryText text-xs  ">
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

            {/* print */}
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
                        className="px-2 py-2 cursor-pointer font-medium hover:bg-gray-100"
                        onClick={() => {
                          handleExportPDF();
                          setDownloadDropdownOpen(false);
                        }}
                      >
                        Export PDF
                      </li>
                      <li
                        onClick={() => setDownloadDropdownOpen(false)}
                        className="px-2 py-2 font-medium hover:bg-gray-100"
                      >
                        <CSVLink
                          headers={csvHeaders}
                          data={csvData}
                          filename={`LST_Report_${formatCSVDate()}.csv`}
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
        {/* preview */}

        {/* Custom report table */}
        <div
          className="overflow-y-auto h-[calc(100vh-150px)] overflow-x-auto mt-2 px-2 scrollbar scrollbar-thumb-scrollBarColor scrollbar-track-scrollBarBg"
          ref={tableRef}
        >
          {doesReportExist ? (
            <div>
              <table
                // id="detailsReportTable"
                className="w-full border-collapse font-bold overflow-y-auto"
              >
                {/* Define column widths using colgroup */}
                <colgroup>
                  <col style={{ width: '5%' }} /> {/* Sl. No. */}
                  {visibleColumns.includes('empName') && (
                    <col style={{ width: '10%' }} />
                  )}
                  {visibleColumns.includes('days') && (
                    <col style={{ width: '10%' }} />
                  )}
                  {visibleColumns.includes('eightHourPay') && (
                    <col style={{ width: '10%' }} />
                  )}
                  {/* {visibleColumns.includes('vda') && (
                      <col style={{ width: '10%' }} />
                    )} */}
                  {visibleColumns.includes('uniform') && (
                    <col style={{ width: '10%' }} />
                  )}
                  {visibleColumns.includes('specialAllowance') && (
                    <col style={{ width: '10%' }} />
                  )}
                  {visibleColumns.includes('weeklyOff') && (
                    <col style={{ width: '10%' }} />
                  )}
                  {visibleColumns.includes('total') && (
                    <col style={{ width: '10%' }} />
                  )}
                  {visibleColumns.includes('extraDuty') && (
                    <col style={{ width: '10%' }} />
                  )}
                  {visibleColumns.includes('adv') && (
                    <col style={{ width: '10%' }} />
                  )}
                  {visibleColumns.includes('deduction') && (
                    <col style={{ width: '10%' }} />
                  )}
                  {visibleColumns.includes('empEPF') && (
                    <col style={{ width: '10%' }} />
                  )}
                  {visibleColumns.includes('empESI') && (
                    <col style={{ width: '10%' }} />
                  )}
                  {visibleColumns.includes('emplrEPF') && (
                    <col style={{ width: '10%' }} />
                  )}
                  {visibleColumns.includes('emplrESI') && (
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

                <thead>
                  {/* first tr */}
                  <tr>
                    <th
                      className="px-2 py-2 text-center"
                      colSpan={
                        1 + // Sl. No.
                        // 1 + // Sl. No.
                        (visibleColumns.includes('empName') ? 1 : 0) +
                        (visibleColumns.includes('days') ? 1 : 0) +
                        (visibleColumns.includes('eightHourPay') ? 1 : 0) +
                        // (visibleColumns.includes('vda') ? 1 : 0) +
                        (visibleColumns.includes('uniform') ? 1 : 0) +
                        (visibleColumns.includes('specialAllowance') ? 1 : 0) +
                        (visibleColumns.includes('weeklyOff') ? 1 : 0) +
                        (visibleColumns.includes('total') ? 1 : 0) +
                        (visibleColumns.includes('extraDuty') ? 1 : 0) +
                        (visibleColumns.includes('adv') ? 1 : 0) +
                        (visibleColumns.includes('deduction') ? 1 : 0) +
                        (visibleColumns.includes('empEPF') ? 1 : 0) +
                        (visibleColumns.includes('empESI') ? 1 : 0) +
                        (visibleColumns.includes('emplrEPF') ? 1 : 0) +
                        (visibleColumns.includes('emplrESI') ? 1 : 0) +
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
                      className="border-2 border-primaryText px-2 py-0.5 text-center text-xs   w-[10%]"
                      rowSpan={2}
                    >
                      Sl. No.
                    </th>
                    {visibleColumns.includes('empName') && (
                      <th
                        className="border-2 border-primaryText px-2 py-0.5 text-left text-xs   w-[10%] whitespace-nowrap"
                        rowSpan={2}
                      >
                        Name & Rank
                      </th>
                    )}
                    {visibleColumns.includes('days') && (
                      <th
                        className="border-2 border-primaryText px-2 py-0.5 text-center text-xs   w-[10%]"
                        rowSpan={2}
                      >
                        No. of Days
                      </th>
                    )}
                    {visibleColumns.includes('eightHourPay') && (
                      <th
                        className="border-2 border-primaryText px-2 py-0.5 text-center text-xs   w-[10%]"
                        rowSpan={2}
                      >
                        Basic Pay
                      </th>
                    )}
                    {/* {visibleColumns.includes('vda') && (
                        <th
                          className="border-2 border-primaryText px-2 py-0.5 text-center text-xs   w-[10%]"
                          rowSpan={2}
                        >
                          VDA
                        </th>
                      )} */}

                    {visibleColumns.includes('uniform') && (
                      <th
                        className="border-2 border-primaryText px-2 py-0.5 text-center text-xs   w-[10%]"
                        rowSpan={2}
                      >
                        Uniform
                      </th>
                    )}
                    {visibleColumns.includes('specialAllowance') && (
                      <th
                        className="border-2 border-primaryText px-2 py-0.5 text-center text-xs   w-[10%]"
                        rowSpan={2}
                      >
                        Special Allowances
                      </th>
                    )}
                    {visibleColumns.includes('weeklyOff') && (
                      <th
                        className="border-2 border-primaryText px-2 py-0.5 text-center text-xs   w-[10%]"
                        rowSpan={2}
                      >
                        Weekly Off
                      </th>
                    )}
                    {visibleColumns.includes('total') && (
                      <th
                        className="border-2 border-primaryText px-2 py-0.5 text-center text-xs   w-[10%]"
                        rowSpan={2}
                      >
                        Total
                      </th>
                    )}
                    {visibleColumns.includes('extraDuty') && (
                      <th
                        className="border-2 border-primaryText px-2 py-0.5 text-center text-xs   w-[10%]"
                        rowSpan={2}
                      >
                        Extra Duty
                      </th>
                    )}
                    {visibleColumns.includes('adv') && (
                      <th
                        className="border-2 border-primaryText px-2 py-0.5 text-center text-xs   w-[10%]"
                        rowSpan={2}
                      >
                        Adv
                      </th>
                    )}

                    {visibleColumns.includes('deduction') && (
                      <th
                        className="border-2 border-primaryText px-2 py-0.5 text-center text-xs  "
                        colSpan={4}
                      >
                        Deduction
                      </th>
                    )}

                    {visibleColumns.includes('totalDeduction') && (
                      <th
                        className="border-2 border-primaryText px-2 py-0.5 text-center text-xs   w-[10%]"
                        rowSpan={2}
                      >
                        Total Deduction
                      </th>
                    )}

                    {visibleColumns.includes('netPay') && (
                      <th
                        className="border-2 border-primaryText px-2 py-0.5 text-center text-xs   w-[10%]"
                        rowSpan={2}
                      >
                        Net Pay
                      </th>
                    )}
                    <th
                      className="border-2 border-primaryText px-2 py-0.5 text-center text-xs   w-[10%]"
                      rowSpan={2}
                    >
                      Sign
                    </th>
                  </tr>
                  <tr>
                    {visibleColumns.includes('empEPF') && (
                      <th className="border-2 border-primaryText px-2 py-0.5 text-center text-xs   w-[10%]">
                        Employee EPF
                      </th>
                    )}

                    {visibleColumns.includes('empESI') && (
                      <th className="border-2 border-primaryText px-2 py-0.5 text-center text-xs   w-[10%]">
                        Employee ESI
                      </th>
                    )}
                    {visibleColumns.includes('emplrEPF') && (
                      <th className="border-2 border-primaryText px-2 py-0.5 text-center text-xs   w-[10%]">
                        Employer EPF
                      </th>
                    )}
                    {visibleColumns.includes('emplrESI') && (
                      <th className="border-2 border-primaryText px-2 py-0.5 text-center text-xs   w-[10%]">
                        Employer ESI
                      </th>
                    )}
                  </tr>
                </thead>

                <tbody className="text-center">
                  {/* {lstReportData.map((row, rowIndex) => ( */}
                  {rowsToDisplay.map((row, rowIndex) => (
                    <tr key={rowIndex}>
                      <td
                        className={`border-b border-dotted border-primaryText px-2 ${lstReportData.length % 12 <= 2 ? 'py-7' : 'py-3'} text-xs `}
                      >
                        {isPrintMode
                          ? rowIndex + 1 // Show correct serial number for all rows in print mode
                          : (currentPage - 1) * rowsPerPage + rowIndex + 1}
                      </td>
                      <td className="border-b border-dotted border-primaryText text-left px-2 py-2 text-xs  whitespace-nowrap">
                        <div className="flex flex-col gap-1">
                          <div>{row.empName}</div>
                          {row.rank}
                        </div>
                      </td>
                      <td className="border-b border-dotted border-primaryText pr-4 py-2 text-xs text-right">
                        {row.days}
                      </td>
                      {/* Basic pay */}
                      <td className="border-b border-dotted border-primaryText pr-2 py-2 text-xs text-right">
                        {row.eightHourPay}
                      </td>
                      {/* vda */}
                      {/* <td className="border-b border-dotted border-primaryText px-2 py-2 text-xs ">
                          {row.vda}
                        </td> */}
                      {/* uniform */}
                      <td className="border-b border-dotted border-primaryText pr-2 py-2 text-xs text-right">
                        {row.uniform}
                      </td>
                      {/* special allowance */}
                      <td className="border-b border-dotted border-primaryText pr-2 py-2 text-xs text-right">
                        {row.specialAllowance}
                      </td>
                      {/* Weekly off */}
                      <td className="border-b border-dotted border-primaryText pr-2 py-2 text-xs text-right">
                        {row.weeklyOff}
                      </td>
                      {/* total */}
                      <td className="border-b border-dotted border-primaryText pr-2 py-2 text-xs text-right">
                        {/* {row.eightHourPay + row.vda + row.uniform} */}
                        {row.total}
                      </td>
                      {/* extra duty */}
                      <td className="border-b border-dotted border-primaryText pr-2 py-2 text-xs text-right">
                        {row.extraDuty}
                      </td>
                      {/* adv */}
                      <td className="border-b border-dotted border-primaryText pr-2 py-2 text-xs text-right">
                        {row.adv}
                      </td>
                      <td className="border-b border-dotted border-primaryText pr-1 py-2 text-xs text-right">
                        <div className="flex flex-col gap-2 items-end">
                          {row.deduction.empEPF}
                          <div>P.Tax: {row.deduction.pTax}</div>
                        </div>
                      </td>
                      <td className="border-b border-dotted border-primaryText pr-2 py-2 text-xs text-right">
                        {row.deduction.empESI}
                      </td>
                      <td className="border-b border-dotted border-primaryText pr-2 py-2 text-xs text-right">
                        {row.deduction.emplrEPF}
                      </td>
                      <td className="border-b border-dotted border-primaryText pr-2 py-2 text-xs text-right">
                        {row.deduction.emplrESI}
                      </td>
                      <td className="border-b border-dotted border-primaryText pr-2 py-2 text-xs text-right">
                        {row.totalDeduction}
                      </td>

                      <td className="border-b border-dotted border-primaryText pr-2 py-2 text-xs text-right">
                        {row.netPay}
                      </td>
                      <td className="border-b border-dotted border-primaryText px-2 py-2"></td>
                    </tr>
                  ))}
                  {/* total */}
                  <tr className="mt-2 mx-auto">
                    <td className="border-t-2 border-primaryText px-2 py-2 font-bold"></td>
                    <td className="border-t-2 border-primaryText px-2 py-2 font-bold text-xs  ">
                      Total
                    </td>

                    <td className="border-t-2 border-primaryText px-2 py-2 font-bold"></td>
                    <td className="border-t-2 border-primaryText px-2 py-2 font-bold"></td>
                    <td className="border-t-2 border-primaryText px-2 py-2 font-bold"></td>
                    <td className="border-t-2 border-primaryText px-2 py-2 font-bold"></td>
                    <td className="border-t-2 border-primaryText px-2 py-2 font-bold"></td>
                    <td className="border-t-2 border-primaryText pr-2 py-2 font-bold text-xs  text-right">
                      {totalAllowance.toFixed(2)}
                    </td>
                    <td className="border-t-2 border-primaryText px-2 py-2 font-bold"></td>
                    <td className="border-t-2 border-primaryText px-2 py-2 font-bold"></td>
                    <td className="border-t-2 border-primaryText px-2 py-2 font-bold"></td>
                    <td className="border-t-2 border-primaryText px-2 py-2 font-bold"></td>
                    <td className="border-t-2 border-primaryText px-2 py-2 font-bold"></td>
                    <td className="border-t-2 border-primaryText px-2 py-2 font-bold"></td>
                    <td className="border-t-2 border-primaryText px-2 py-2 font-bold"></td>
                    <td className="border-t-2 border-primaryText pr-2 py-2 font-bold text-xs  text-right">
                      {totalNetPay.toFixed(2)}
                    </td>
                    <td className="border-t-2 border-primaryText px-2 py-2 font-bold"></td>
                    {/* <td className="border-t-2 border-primaryText px-2 py-2 font-bold"></td> */}
                    <td className="border-t-2 border-primaryText px-2 py-2"></td>
                  </tr>
                </tbody>
              </table>
              {/* total */}
              <div
                className={`flex flex-col gap-2 items-start font-bold w-[50%] mx-auto justify-center footer-to-print ${lstReportData.length % 8 <= 2 ? 'py-4' : 'py-2'} `}
              >
                <div className="flex items-center gap-4">
                  <h2 className="text-primaryText reportPrimaryLabels2 font-bold">
                    Rupees:
                  </h2>
                  <h3 className="text-primaryText reportPrimaryLabels2 uppercase font-bold">
                    {numberToWords(Number(totalNetPay.toFixed(2)))}
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
            <p className="text-center py-20">
              Payroll hasn&rsquo;t been generated for this month yet.
            </p>
          )}
        </div>
      </div>
    </>
  );
};

export default LSTReport;
