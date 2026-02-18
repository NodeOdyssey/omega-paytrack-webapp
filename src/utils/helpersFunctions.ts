import { formatDateDdMmYyyySlash, numberToWords } from './formatter';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { DsReportRow } from '../types/report-new';

export const monthToNumber = (monthName: string) => {
  return new Date(`${monthName} 1, 2000`).getMonth() + 1; // Safe conversion
};

/**
 * Returns the name of the month for a given month number.
 * @param month - A zero-based month index (0 for January, 11 for December).
 * @returns The full name of the month as a string.
 */
export const getMonthName = (month: number) => {
  const monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];
  return monthNames[month];
};

export const getActualMonth = (jsDateMonth: number) => {
  return jsDateMonth + 1;
};

export const getFirstAndLastDay = (dateString: Date) => {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = date.getMonth();

  // First day of the month
  const firstDay = new Date(year, month, 1);
  // Last day of the month
  const lastDay = new Date(year, month + 1, 0);

  return {
    firstDay: formatDateDdMmYyyySlash(firstDay),
    lastDay: formatDateDdMmYyyySlash(lastDay),
  };
};

export const getLastDateOfMonth = (date: Date) => {
  const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
  return lastDay;
};

export const dateTimeInString = () => {
  const date = new Date();
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = String(date.getFullYear()).slice(-2);

  let hours = date.getHours();
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const ampm = hours >= 12 ? 'pm' : 'am';
  hours = hours % 12 || 12;

  return `${day}-${month}-${year}, ${hours}:${minutes} ${ampm}`;
};

// Format date for display in reports
export const formatDateForReport = (date: Date | null) => {
  if (!date) return '';
  return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1)
    .toString()
    .padStart(2, '0')}/${date.getFullYear()}`;
};

export const calcMonthEndDate = (date: Date | null) => {
  if (!date) return '';
  return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1)
    .toString()
    .padStart(2, '0')}/${date.getFullYear()}`;
};

// const pdfConfig = async () => {
//   const doc = new jsPDF('landscape'); // Create PDF in landscape mode
//   const loadFont = async (url: string) => {
//     const response = await fetch(url);
//     return await response.arrayBuffer();
//   };
// };

export const handleExportDsReportPDF = async (
  selectedPostName: string,
  selectedDate: Date,
  columns: { name: string; label: string }[],
  dsReportData: DsReportRow[],
  totalGrossPay: number,
  totalNetPay: number
) => {
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
    { name: 'sign', label: 'Sign' }, // Add the serial number column
  ];
  // Generate the Table
  autoTable(doc, {
    startY: 60, // Start the table after the header details
    head: [updatedColumns.map((col) => col.label)],
    // body: dsReportData.map((row, index) => [
    //   index + 1, // Serial Number (Sl. No.)
    //   ...columns.map((col) => {
    //     if (col.name === 'allowances') {
    //       return `Kit: ${row.allowances.kitAllowances}, City: ${row.allowances.cityAllowances}, Conv/H.Rent: ${row.allowances.convHra}`;
    //     } else if (col.name === 'deduction') {
    //       return `ESI: ${row.deduction.empESI}, EPF: ${row.deduction.empEPF}, Adv: ${row.deduction.adv}, P.Tax: ${row.deduction.pTax}`;
    //     } else if (col.name === 'other') {
    //       return `Belt: ${row.other.belt}, Boot: ${row.other.boot}, Uniform: ${row.other.uniform}`;
    //     } else {
    //       return row[col.name as keyof typeof row];
    //     }
    //   }),
    // ]),
    body: dsReportData.map((row, index) => [
      index + 1, // Serial Number (Sl. No.)
      ...columns.map((col) => {
        if (col.name === 'allowances') {
          return `Kit: ${row.allowances.kitAllowances}, City: ${row.allowances.cityAllowances}, Conv/H.Rent: ${row.allowances.convHra}`;
        } else if (col.name === 'deduction') {
          return `ESI: ${row.deduction.empESI}, EPF: ${row.deduction.empEPF}, Adv: ${row.deduction.adv}, P.Tax: ${row.deduction.pTax}`;
        } else if (col.name === 'other') {
          return `Belt: ${row.other.belt}, Boot: ${row.other.boot}, Uniform: ${row.other.uniform}`;
        } else {
          return String(row[col.name as keyof typeof row]); // Convert the value to a string
        }
      }),
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
      2: { cellWidth: 12 },
      3: { cellWidth: 16 },
      4: { cellWidth: 30 },
      5: { cellWidth: 20 },
      6: { cellWidth: 15 },
      7: { cellWidth: 35 },
      8: { cellWidth: 30 },
      9: { cellWidth: 20 },
      10: { cellWidth: 20 },
      11: { cellWidth: 20 },
      12: { cellWidth: 20 },
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
        doc.setLineWidth(0.5);
        doc.setDrawColor(0, 0, 0);
        doc.rect(cell.x, cell.y, cell.width, cell.height);
      }
    },
    // margin: { top: 80, bottom: 20 },
    // didDrawPage: (data) => {
    //   // If it's not the first page, adjust top margin
    //   if (data.pageNumber !== 1) {
    //     data.settings.margin.top = 10; // Smaller top margin for subsequent pages
    //   }
    // },
  });

  // Add Total Row (Total Gross Pay and Total Net Pay)

  const totalText = ` Total`;
  const totalGrossPayText = ` ${totalGrossPay}`;
  const totalNetPayText = ` ${totalNetPay}`;

  doc.setFont('Mona_Sans', 'normal');
  doc.setFontSize(10);
  doc.text(totalText, 30, doc.lastAutoTable.finalY + 10);
  doc.text(totalGrossPayText, 132, doc.lastAutoTable.finalY + 10);
  doc.text(totalNetPayText, 255, doc.lastAutoTable.finalY + 10);

  // Add Footer
  const footerY = doc.lastAutoTable.finalY + 30; // Adjusting vertical position after the table
  doc.setFontSize(12);
  doc.text('Rupees:', 70, footerY);
  doc.text(
    `${numberToWords(parseFloat(totalNetPay.toFixed(2)))} only`,
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
  doc.text('Date: .......................................', 160, footerY + 20);

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
  doc.save(`Details_Report_${formattedDate}_${formattedTime}.pdf`);
};
