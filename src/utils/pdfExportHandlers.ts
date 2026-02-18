import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import {
  DSLReportRow,
  DsReportRow,
  EPFRow,
  ESIRow,
  // LNTDeduction,
  LNTRow,
  NewPayrollRow,
  OthersReportRow,
  PTaxRow,
  SalaryRow,
  WithoutAllowanceRow,
} from '../types/report-new';

// numbers to words
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

// const formatDate = (date: Date) => {
//   const day = String(date.getDate()).padStart(2, '0');
//   const month = String(date.getMonth() + 1).padStart(2, '0');
//   const year = date.getFullYear();
//   return `${day}/${month}/${year}`;
// };
// function getFirstAndLastDay(dateString: Date) {
//   const date = new Date(dateString);
//   const year = date.getFullYear();
//   const month = date.getMonth();

//   // First day of the month
//   const firstDay = new Date(year, month, 1);
//   // Last day of the month
//   const lastDay = new Date(year, month + 1, 0);

//   return {
//     firstDay: formatDate(firstDay),
//     lastDay: formatDate(lastDay),
//   };
// }

interface Column<T> {
  name: keyof T | string;
  label: string;
  children?: Column<T>[];
}

// dummy columns
export const dummyColumns = [
  { name: 'empName', label: 'Employee Name' },
  { name: 'days', label: 'Days' },
  { name: 'basicSalary', label: 'Basic Salary' },
  { name: 'allowances', label: 'Allowances' },
  { name: 'grossPay', label: 'Gross Pay' },
  { name: 'extraDuty', label: 'Extra Duty' },
  { name: 'deduction', label: 'Deductions' },
  { name: 'other', label: 'Other Items' },
  { name: 'otherDeduction', label: 'Other Deduction' },
  { name: 'totalDeduction', label: 'Total Deduction' },
  { name: 'netPay', label: 'Net Pay' },
];

// ds columns
export const dsColumns: Column<DsReportRow>[] = [
  { name: 'empName', label: 'Name & Details' },
  { name: 'days', label: 'Days' },
  { name: 'basicSalary', label: 'Basic Pays' },
  { name: 'allowances', label: 'Allowances' },
  { name: 'grossPay', label: 'Gross Pay' },
  { name: 'extraDuty', label: 'Extra Duty' },
  { name: 'deduction', label: 'Deduction' },
  { name: 'other', label: 'Other' },
  { name: 'otherDeduction', label: 'Other Deduction' },
  { name: 'totalDeduction', label: 'Total Deduction' },
  { name: 'netPay', label: 'Net Pay' },
  // { name: 'sign', label: 'Sign' },
];

//withouAllowance columns
export const withoutAllowanceColumns: Column<WithoutAllowanceRow>[] = [
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

// new payroll columns
export const newPayrollColumns: Column<NewPayrollRow>[] = [
  { name: 'empName', label: 'Name & Rank' },
  { name: 'days', label: 'Days' },
  { name: 'basicSalary', label: 'Basic Pay' },
  { name: 'uniform', label: 'Uniform' },
  { name: 'bonus', label: 'Bonus' },
  { name: 'total', label: 'Total' },
  { name: 'extraDuty', label: 'Extra Duty' },
  {
    name: 'deduction',
    label: 'Deduction',
    children: [
      { name: 'empEPF', label: 'Emp EPF' },
      { name: 'empESI', label: 'Emp ESI' },
      { name: 'emplrEPF', label: 'Emplr EPF' },
      { name: 'emplrESI', label: 'Emplr ESI' },
    ],
  },
  { name: 'pTax', label: 'P Tax' },
  { name: 'otherDeduction', label: 'Other Deduction' },
  { name: 'totalDeduction', label: 'Total Deduction' },
  { name: 'netPay', label: 'Net Pay' },
];

// dsl columns
export const dslColumns: Column<DSLReportRow>[] = [
  { name: 'empName', label: 'Name & Rank' },
  { name: 'days', label: 'No. of Days' },
  { name: 'eightHourPay', label: '8 Hours Pay' },
  { name: 'uniform', label: 'Uniform' },
  { name: 'hra', label: 'House Rent' },
  { name: 'total', label: 'Total' },
  { name: 'extraDuty', label: 'Extra Duty' },
  { name: 'adv', label: 'Adv' },
  {
    name: 'deduction',
    label: 'Deduction',
    children: [
      { name: 'empEPF', label: 'Emp EPF' },
      { name: 'empESI', label: 'Emp ESI' },
      { name: 'emplrEPF', label: 'Emplr EPF' },
      { name: 'emplrESI', label: 'Emplr ESI' },
    ],
  },
  { name: 'totalDeduction', label: 'Total Deduction' },
  { name: 'netPay', label: 'Net Pay' },
];

// LnT columns
export const LnTColumns: Column<LNTRow>[] = [
  { name: 'empName', label: 'Name & Rank' },
  { name: 'days', label: 'No. of Days' },
  { name: 'eightHourPay', label: '8 Hours Pay' },
  // { name: 'vda', label: 'VDA' },
  { name: 'uniform', label: 'Uniform' },
  { name: 'specialAllowance', label: 'Special Allowance' },
  { name: 'weeklyOff', label: 'Weekly Off' },
  { name: 'total', label: 'Total' },
  { name: 'extraDuty', label: 'Extra Duty' },
  { name: 'adv', label: 'Adv' },
  {
    name: 'deduction',
    label: 'Deduction',
    children: [
      { name: 'empEPF', label: 'Emp EPF' },
      { name: 'empESI', label: 'Emp ESI' },
      { name: 'emplrEPF', label: 'Emplr EPF' },
      { name: 'emplrESI', label: 'Emplr ESI' },
    ],
  },
  { name: 'totalDeduction', label: 'Total Deduction' },
  { name: 'netPay', label: 'Net Pay' },
];

//otherReport columns
export const OtherReportColumns: Column<OthersReportRow>[] = [
  { name: 'empName', label: 'Name' },
  { name: 'days', label: 'Days' },
  { name: 'basicSalary', label: 'Basic Pay' },
  { name: 'allowance', label: 'Allowances' },
  { name: 'grossPay', label: 'Gross Pay' },
  { name: 'extraDuty', label: 'Extra Duty' },
  { name: 'uniform', label: 'Uniform' },
  { name: 'fourHourPay', label: '4 HourPay' },
  { name: 'specialAllowance', label: 'Special Allowance' },
  { name: 'bonus', label: 'Bonus' },
  { name: 'deduction', label: 'Deduction' },
  { name: 'netPay', label: 'Net Pay' },
  // { name: 'sign', label: 'Sign' },
];

// esi report columns
export const esiReportColumns: Column<ESIRow>[] = [
  { name: 'accNo', label: 'ESI No.' },
  { name: 'empName', label: 'Name' },
  { name: 'days', label: 'No. of Days' },
  { name: 'grossPay', label: 'Gross Pay' },
  { name: 'empESI', label: 'Employees Contribution' },
  { name: 'emplrESI', label: 'Employers Contribution' },
  { name: 'total', label: 'Total' },
];
// esi report columns
export const epfReportColumns: Column<EPFRow>[] = [
  { name: 'accNo', label: 'Account No' },
  { name: 'empName', label: 'Name' },
  { name: 'days', label: 'Days' },
  { name: 'basicSalary', label: 'Basic Salary' },
  { name: 'empEPF', label: 'Employees Contribution' },
  { name: 'emplrEPF', label: 'Employers Contribution' },
  { name: 'total', label: 'Total' },
];

// pTax report columns
export const pTaxReportColumns: Column<PTaxRow>[] = [
  { name: 'empName', label: 'Employee Name' },
  { name: 'postName', label: 'Post' },
  { name: 'basicSalary', label: 'Basic Salary' },
  { name: 'pTax', label: 'Professional Tax' },
];

// Salary report columns
export const salaryReportColumns: Column<SalaryRow>[] = [
  { name: 'empName', label: 'Employee Name' },
  { name: 'accountNum', label: 'Account No.' },
  { name: 'ifsc', label: 'IFSC' },
  { name: 'bankName', label: 'Bank Name' },
  { name: 'netPay', label: 'Net Pay' },
  { name: 'postName', label: 'Post Name' },
];

// Ds report pdf export
export const handleExportDsReportPDF = async (
  selectedPostName: string,
  periodStartDate: string,
  periodEndDate: string,
  columns: Column<DsReportRow>[],
  dsReportData: DsReportRow[],
  totalGrossPay: number,
  totalNetPay: number
) => {
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

  // Header
  doc.setFont('Mona_Sans', 'bold');
  doc.setFontSize(14);
  doc.text('Purbanchal Security Consultants Pvt. Ltd.', 150, 10, {
    align: 'center',
  });

  doc.setFont('Mona_Sans', 'bold');
  doc.setFontSize(11);
  doc.text('Silpukhuri, Guwahati-03', 150, 16, { align: 'center' });

  doc.setFontSize(11);
  doc.text('Pay Roll of Staff Deployed at', 5, 24);
  doc.setFont('Mona_Sans', 'bold');
  if (selectedPostName) {
    doc.text(`${selectedPostName.toUpperCase()}`, 65, 24, { align: 'left' });
  }

  if (periodStartDate && periodEndDate) {
    doc.text(
      `For the period from: ${periodStartDate} To: ${periodEndDate}`,
      292,
      24,
      {
        align: 'right',
      }
    );
  }
  // Add "Sl. No." to the columns
  const updatedColumns = [
    { name: 'slNo', label: 'Sl. No.' }, // Add the serial number column
    ...columns,
    { name: 'sign', label: 'Sign' }, // Add the serial number column
  ];
  // Generate the Table
  autoTable(doc, {
    startY: 30, // Start the table after the header details
    margin: { top: 5, left: 5, right: 5, bottom: 5 },
    head: [updatedColumns.map((col) => col.label)],
    body: dsReportData.map((row, index) => [
      index + 1, // Serial Number (Sl. No.)
      ...columns.map((col) => {
        if (col.name === 'allowances') {
          return `Kit: ${row.allowances.kitAllowances}\nCity: ${row.allowances.cityAllowances}\nConv/H.Rent: ${row.allowances.convHra}`;
        } else if (col.name === 'deduction') {
          return `ESI: ${row.deduction.empESI} EPF: ${row.deduction.empEPF}\nAdv: ${row.deduction.adv} P.Tax: ${row.deduction.pTax}`;
        } else if (col.name === 'other') {
          return `Belt: ${row.other.belt}\nBoot: ${row.other.boot}\nUniform: ${row.other.uniform}`;
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
      fontSize: 8.5,
      halign: 'center',
      lineWidth: 0.2,
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
      overflow: 'linebreak',
    },
    // columnStyles: {
    //   0: { cellWidth: 10 }, // Adjust the width of Sl. No. column
    //   1: { cellWidth: 30 },
    //   2: { cellWidth: 12 },
    //   3: { cellWidth: 16 },
    //   4: { cellWidth: 30 },
    //   5: { cellWidth: 20 },
    //   6: { cellWidth: 15 },
    //   7: { cellWidth: 35 },
    //   8: { cellWidth: 30 },
    //   9: { cellWidth: 20 },
    //   10: { cellWidth: 20 },
    //   11: { cellWidth: 20 },
    //   12: { cellWidth: 20 },
    // },
    styles: {
      cellPadding: { top: 1.5, bottom: 1.5, left: 1, right: 1 },
      overflow: 'linebreak',
    },
    didDrawCell: (data) => {
      const { cell, section } = data;

      if (section === 'body') {
        // Draw only the bottom dotted border
        doc.setLineDashPattern([0.5, 0.5], 0);
        doc.setLineWidth(0.3);
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
  });

  // Add Total Row (Total Gross Pay and Total Net Pay)

  const totalText = ` Total`;
  const totalGrossPayText = ` ${totalGrossPay}`;
  const totalNetPayText = ` ${totalNetPay}`;

  doc.setFont('Mona_Sans', 'bold');
  doc.setFontSize(10);
  doc.text(totalText, 30, doc.lastAutoTable.finalY + 6);
  doc.text(totalGrossPayText, 120, doc.lastAutoTable.finalY + 6);
  doc.text(totalNetPayText, 250, doc.lastAutoTable.finalY + 6);

  // Add Footer
  const footerY = doc.lastAutoTable.finalY + 16; // Adjusting vertical position after the table
  doc.setFontSize(10);
  doc.text('Rupees:', 90, footerY);
  doc.text(
    `${numberToWords(parseFloat(totalNetPay.toFixed(2)))}`,
    108,
    footerY
  );

  doc.text('Return after disbursement', 112, footerY + 8, {
    align: 'center',
  });

  doc.text(
    'Incharge: ..............................................................',
    90,
    footerY + 16
  );
  doc.text('Date: .......................................', 180, footerY + 16);

  //note
  // const noteY = footerY + 30;
  // doc.setFont('Mona_Sans', 'bold');
  // doc.setFontSize(9);
  // doc.setTextColor(100);
  // doc.text(
  //   'Note: This is a system-generated salary report. For any discrepancies, please contact Admin.\n© 2025 PSCPL Payroll',
  //   150,
  //   noteY,
  //   { align: 'center' }
  // );

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
  doc.save(
    `Details_Report_${selectedPostName}_${formattedDate}_${formattedTime}.pdf`
  );
};

// withou allowance handle pdf export
export const handleExportWithoutAllowanceReportPDF = async (
  selectedPostName: string,
  periodStartDate: string,
  periodEndDate: string,
  columns: Column<WithoutAllowanceRow>[],
  reportData: WithoutAllowanceRow[],
  totalBasicSalary: number,
  totalNetPay: number
) => {
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

  // Header
  doc.setFont('Mona_Sans', 'bold');
  doc.setFontSize(14);
  doc.text('Purbanchal Security Consultants Pvt. Ltd.', 150, 10, {
    align: 'center',
  });

  doc.setFont('Mona_Sans', 'bold');
  doc.setFontSize(11);
  doc.text('Silpukhuri, Guwahati-03', 150, 16, { align: 'center' });

  doc.setFontSize(11);
  doc.text('Pay Roll of Staff Deployed at', 5, 24);
  doc.setFont('Mona_Sans', 'bold');
  if (selectedPostName) {
    doc.text(`${selectedPostName.toUpperCase()}`, 65, 24, { align: 'left' });
  }

  if (periodStartDate && periodEndDate) {
    doc.text(
      `For the period from: ${periodStartDate} To: ${periodEndDate}`,
      292,
      24,
      {
        align: 'right',
      }
    );
  }

  const updatedColumns = [
    { name: 'slNo', label: 'Sl. No.' },
    ...columns,
    { name: 'sign', label: 'Sign' },
  ];

  autoTable(doc, {
    startY: 30,
    margin: { top: 5, left: 5, right: 5, bottom: 5 },
    head: [updatedColumns.map((col) => col.label)],
    body: reportData.map((row, index) => [
      index + 1,
      ...columns.map((col) => {
        if (col.name === 'empName') {
          return `${row.empName}\n${row.rank || ''}`;
        } else if (col.name === 'deduction') {
          return `ESI: ${row.deduction.empESI} Adv: ${row.deduction.adv}\nEPF: ${row.deduction.empEPF} P.Tax: ${row.deduction.pTax}`;
        } else if (col.name === 'other') {
          return `Belt: ${row.other?.belt ?? ''}, Boot: ${row.other?.boot ?? ''}, Uniform: ${row.other?.uniform ?? ''}`;
        } else if (
          typeof row[col.name as keyof WithoutAllowanceRow] === 'object'
        ) {
          return JSON.stringify(row[col.name as keyof WithoutAllowanceRow]);
        } else {
          return String(row[col.name as keyof WithoutAllowanceRow] ?? '');
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
      lineWidth: 0.2,
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
      overflow: 'linebreak',
    },
    styles: {
      cellPadding: { top: 1.5, bottom: 1.5, left: 1, right: 1 },
      overflow: 'linebreak',
    },
    didDrawCell: (data) => {
      const { cell, section } = data;
      if (section === 'body') {
        doc.setLineDashPattern([0.5, 0.5], 0);
        doc.setLineWidth(0.3);
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

  // Totals
  const finalY = doc.lastAutoTable.finalY;
  doc.setFontSize(10);
  doc.text(`Total`, 20, finalY + 8);
  doc.text(`${totalBasicSalary}`, 69, finalY + 8);
  doc.text(`${totalNetPay}`, 270, finalY + 8);

  // Footer
  const footerY = finalY + 18;
  doc.text('Rupees:', 90, footerY);
  doc.text(
    `${numberToWords(parseFloat(totalNetPay.toFixed(2)))}`,
    110,
    footerY
  );
  doc.text('Return after disbursement', 90, footerY + 8);
  doc.text(
    'Incharge: ..............................................................',
    90,
    footerY + 16
  );
  doc.text('Date: .......................................', 190, footerY + 16);

  //note
  // const noteY = footerY + 30;
  // doc.setFont('Mona_Sans', 'bold');
  // doc.setFontSize(9);
  // doc.setTextColor(100);
  // doc.text(
  //   'Note: This is a system-generated salary report. For any discrepancies, please contact Admin.\n© 2025 PSCPL Payroll',
  //   150,
  //   noteY,
  //   { align: 'center' }
  // );

  // Save File
  const date = new Date();
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  let hours = date.getHours();
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const ampm = hours >= 12 ? 'pm' : 'am';
  hours = hours % 12 || 12;
  const formattedTime = `${String(hours).padStart(2, '0')}-${minutes}-${ampm}`;
  const formattedDate = `${day}-${month}-${year}`;

  doc.save(
    `WithoutAllowance_Report_${selectedPostName}_${formattedDate}_${formattedTime}.pdf`
  );
};

// new payroll  pdf
export const handleExportNewPayrollPDF = async (
  selectedPostName: string,
  periodStartDate: string,
  periodEndDate: string,
  columns: Column<NewPayrollRow>[],
  reportData: NewPayrollRow[],
  totalBasicSalary: number,
  totalNetPay: number
) => {
  const doc = new jsPDF('landscape', 'pt', 'a4');

  // Load custom fonts
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

  // Header
  doc.setFont('Mona_Sans', 'bold');
  doc.setFontSize(12);
  doc.text('Purbanchal Security Consultants Pvt. Ltd.', 420, 30, {
    align: 'center',
  });
  doc.setFont('Mona_Sans', 'bold');
  doc.setFontSize(10);
  doc.text('Silpukhuri, Guwahati-03', 420, 50, { align: 'center' });

  doc.setFontSize(10);
  doc.text('Pay Roll of Staff Deployed at', 10, 75);
  doc.setFont('Mona_Sans', 'bold');
  if (selectedPostName) {
    doc.text(`${selectedPostName.toUpperCase()}`, 150, 75);
  }

  doc.setFontSize(10);
  if (periodStartDate && periodEndDate) {
    doc.text(
      `For the period from: ${periodStartDate} To: ${periodEndDate}`,
      830,
      75,
      {
        align: 'right',
      }
    );
  }

  // 🔧 Build multi-row header
  const buildHeaderRows = <T>(cols: Column<T>[]) => {
    const row1: any[] = [{ content: 'Sl. No.', rowSpan: 2 }];
    const row2: any[] = [];

    for (const col of cols) {
      if (col.children && col.children.length > 0) {
        row1.push({
          content: col.label,
          colSpan: col.children.length,
          styles: { halign: 'center' },
        });
        row2.push(...col.children.map((child) => ({ content: child.label })));
      } else {
        row1.push({ content: col.label, rowSpan: 2 });
      }
    }

    row1.push({ content: 'Sign', rowSpan: 2 });
    return [row1, row2];
  };

  // 🔧 Flatten columns for row data
  const flattenColumns = <T>(cols: Column<T>[]): string[] => {
    const flat: string[] = [];
    for (const col of cols) {
      if (col.children && col.children.length > 0) {
        flat.push(...col.children.map((child) => child.name as string));
      } else {
        flat.push(col.name as string);
      }
    }
    return flat;
  };

  const headerRows = buildHeaderRows(columns);
  const flatKeys = flattenColumns(columns);
  const fullKeys = ['slNo', ...flatKeys, 'sign'];

  const tableBody = reportData.map((row, index) =>
    fullKeys.map((key) => {
      if (key === 'slNo') return index + 1;
      if (key === 'sign') return '';
      if (key === 'empName') return `${row.empName}\n${row.rank ?? ''}`;
      if (
        ['empEPF', 'empESI', 'emplrEPF', 'emplrESI'].includes(key) &&
        row.deduction
      ) {
        return row.deduction[key as keyof typeof row.deduction] ?? '';
      }
      const value = row[key as keyof NewPayrollRow];
      if (typeof value === 'object' && value !== null) {
        return '';
      }
      return value ?? '';
    })
  );

  // 🧾 Table
  autoTable(doc, {
    startY: 90,
    margin: { top: 5, left: 5, right: 5, bottom: 5 },
    head: headerRows,
    body: tableBody,

    theme: 'grid',
    headStyles: {
      fillColor: '#ffffff',
      textColor: '#212529',
      font: 'Mona_Sans',
      fontStyle: 'bold',
      fontSize: 8,
      halign: 'center',
      lineWidth: 0.2,
      lineColor: '#000',
    },
    bodyStyles: {
      fillColor: '#fff',
      textColor: '#212529',
      font: 'Mona_Sans',
      fontStyle: 'bold',
      fontSize: 8,
      halign: 'center',
      lineWidth: 0,
      lineColor: '#000',
      overflow: 'linebreak',
    },
    styles: {
      cellPadding: { top: 3, bottom: 3, left: 1, right: 1 },
      overflow: 'linebreak',
    },
    didDrawCell: (data) => {
      const { cell, section } = data;

      if (section === 'body') {
        doc.setLineDashPattern([0.5, 0.5], 0);
        doc.setLineWidth(0.1);
        doc.setDrawColor(0, 0, 0);
        doc.line(
          cell.x,
          cell.y + cell.height,
          cell.x + cell.width,
          cell.y + cell.height
        );
      } else if (section === 'head') {
        doc.setLineDashPattern([], 0);
        doc.setLineWidth(0.3);
        doc.setDrawColor(0, 0, 0);
        doc.rect(cell.x, cell.y, cell.width, cell.height);
      }
    },
  });

  // ➕ Totals
  const totalText = `Total`;
  const totalBasicSalaryText = `${totalBasicSalary}`;
  const totalNetPayText = `${totalNetPay}`;

  doc.setFont('Mona_Sans', 'bold');
  doc.setFontSize(9);
  doc.text(totalText, 80, doc.lastAutoTable.finalY + 15);
  doc.text(totalBasicSalaryText, 190, doc.lastAutoTable.finalY + 15);
  doc.text(totalNetPayText, 725, doc.lastAutoTable.finalY + 15);

  const footerY = doc.lastAutoTable.finalY + 50;
  doc.setFontSize(10);
  doc.text('Rupees:', 240, footerY);
  doc.text(
    `${numberToWords(parseFloat(totalNetPay.toFixed(2)))}`,
    300,
    footerY
  );
  doc.text('Return after disbursement', 240, footerY + 16);
  doc.text(
    'Incharge: ..............................................................',
    240,
    footerY + 32
  );
  doc.text('Date: .......................................', 450, footerY + 32);

  //note
  // const noteY = footerY + 90;
  // doc.setFont('Mona_Sans', 'bold');
  // doc.setFontSize(9);
  // doc.setTextColor(100);
  // doc.text(
  //   'Note: This is a system-generated salary report. For any discrepancies, please contact Admin.\n© 2025 PSCPL Payroll',
  //   410,
  //   noteY,
  //   { align: 'center' }
  // );

  // 📄 Save
  const date = new Date();
  const formattedDate = `${String(date.getDate()).padStart(2, '0')}-${String(
    date.getMonth() + 1
  ).padStart(2, '0')}-${date.getFullYear()}`;
  const hours = date.getHours() % 12 || 12;
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const ampm = date.getHours() >= 12 ? 'pm' : 'am';
  const formattedTime = `${String(hours).padStart(2, '0')}:${minutes} ${ampm}`;

  doc.save(
    `NewPayroll_Report_${selectedPostName}_${formattedDate}_${formattedTime}.pdf`
  );
};

// DsL  pdf
export const handleExportDslPDF = async (
  selectedPostName: string,
  periodStartDate: string,
  periodEndDate: string,
  columns: Column<DSLReportRow>[],
  reportData: DSLReportRow[],
  totalBasicSalary: number,
  totalNetPay: number
) => {
  const doc = new jsPDF('landscape', 'pt', 'a4');

  // Load custom fonts
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

  // Header
  doc.setFont('Mona_Sans', 'bold');
  doc.setFontSize(12);
  doc.text('Purbanchal Security Consultants Pvt. Ltd.', 420, 30, {
    align: 'center',
  });
  doc.setFont('Mona_Sans', 'bold');
  doc.setFontSize(10);
  doc.text('Silpukhuri, Guwahati-03', 420, 50, { align: 'center' });

  doc.setFontSize(10);
  doc.text('Pay Roll of Staff Deployed at', 10, 75);
  doc.setFont('Mona_Sans', 'bold');
  if (selectedPostName) {
    doc.text(`${selectedPostName.toUpperCase()}`, 150, 75);
  }

  doc.setFontSize(10);
  if (periodStartDate && periodEndDate) {
    doc.text(
      `For the period from: ${periodStartDate} To: ${periodEndDate}`,
      830,
      75,
      {
        align: 'right',
      }
    );
  }

  // 🔧 Build multi-row header
  const buildHeaderRows = <T>(cols: Column<T>[]) => {
    const row1: any[] = [{ content: 'Sl. No.', rowSpan: 2 }];
    const row2: any[] = [];

    for (const col of cols) {
      if (col.children && col.children.length > 0) {
        row1.push({
          content: col.label,
          colSpan: col.children.length,
          styles: { halign: 'center' },
        });
        row2.push(...col.children.map((child) => ({ content: child.label })));
      } else {
        row1.push({ content: col.label, rowSpan: 2 });
      }
    }

    row1.push({ content: 'Sign', rowSpan: 2 });
    return [row1, row2];
  };

  // 🔧 Flatten columns for row data
  const flattenColumns = <T>(cols: Column<T>[]): string[] => {
    const flat: string[] = [];
    for (const col of cols) {
      if (col.children && col.children.length > 0) {
        flat.push(...col.children.map((child) => child.name as string));
      } else {
        flat.push(col.name as string);
      }
    }
    return flat;
  };

  const headerRows = buildHeaderRows(columns);
  const flatKeys = flattenColumns(columns);
  const fullKeys = ['slNo', ...flatKeys, 'sign'];

  const tableBody = reportData.map((row, index) =>
    fullKeys.map((key) => {
      if (key === 'slNo') return index + 1;
      if (key === 'sign') return '';
      if (key === 'empName') return `${row.empName}\n${row.rank ?? ''}`;
      if (key === 'empEPF')
        return `${row.deduction.empEPF}\nP.Tax:${row.deduction.pTax ?? ''}`;
      if (['empESI', 'emplrEPF', 'emplrESI'].includes(key) && row.deduction) {
        return row.deduction[key as keyof typeof row.deduction] ?? '';
      }
      const value = row[key as keyof DSLReportRow];
      if (typeof value === 'object' && value !== null) {
        return '';
      }
      return value ?? '';
    })
  );

  // 🧾 Table
  autoTable(doc, {
    startY: 90,
    margin: { top: 5, left: 5, right: 5, bottom: 5 },
    head: headerRows,
    body: tableBody,

    theme: 'grid',
    headStyles: {
      fillColor: '#ffffff',
      textColor: '#212529',
      font: 'Mona_Sans',
      fontStyle: 'bold',
      fontSize: 8,
      halign: 'center',
      lineWidth: 0.2,
      lineColor: '#000',
    },
    bodyStyles: {
      fillColor: '#fff',
      textColor: '#212529',
      font: 'Mona_Sans',
      fontStyle: 'bold',
      fontSize: 8,
      halign: 'center',
      lineWidth: 0,
      lineColor: '#000',
      overflow: 'linebreak',
    },
    styles: {
      cellPadding: { top: 3, bottom: 3, left: 2, right: 2 },
      overflow: 'linebreak',
    },
    didDrawCell: (data) => {
      const { cell, section } = data;

      if (section === 'body') {
        doc.setLineDashPattern([0.5, 0.5], 0);
        doc.setLineWidth(0.1);
        doc.setDrawColor(0, 0, 0);
        doc.line(
          cell.x,
          cell.y + cell.height,
          cell.x + cell.width,
          cell.y + cell.height
        );
      } else if (section === 'head') {
        doc.setLineDashPattern([], 0);
        doc.setLineWidth(0.3);
        doc.setDrawColor(0, 0, 0);
        doc.rect(cell.x, cell.y, cell.width, cell.height);
      }
    },
  });

  // ➕ Totals
  const totalText = `Total`;
  const totalBasicSalaryText = `${totalBasicSalary}`;
  const totalNetPayText = `${totalNetPay}`;

  doc.setFont('Mona_Sans', 'bold');
  doc.setFontSize(9);
  doc.text(totalText, 80, doc.lastAutoTable.finalY + 15);
  doc.text(totalBasicSalaryText, 387, doc.lastAutoTable.finalY + 15);
  doc.text(totalNetPayText, 780, doc.lastAutoTable.finalY + 15);

  const footerY = doc.lastAutoTable.finalY + 50;
  doc.setFontSize(10);
  doc.text('Rupees:', 240, footerY);
  doc.text(
    `${numberToWords(parseFloat(totalNetPay.toFixed(2)))}`,
    300,
    footerY
  );
  doc.text('Return after disbursement', 240, footerY + 16);
  doc.text(
    'Incharge: ..............................................................',
    240,
    footerY + 32
  );
  doc.text('Date: .......................................', 450, footerY + 32);

  //note
  // const noteY = footerY + 90;
  // doc.setFont('Mona_Sans', 'bold');
  // doc.setFontSize(9);
  // doc.setTextColor(100);
  // doc.text(
  //   'Note: This is a system-generated salary report. For any discrepancies, please contact Admin.\n© 2025 PSCPL Payroll',
  //   410,
  //   noteY,
  //   { align: 'center' }
  // );

  // 📄 Save
  const date = new Date();
  const formattedDate = `${String(date.getDate()).padStart(2, '0')}-${String(
    date.getMonth() + 1
  ).padStart(2, '0')}-${date.getFullYear()}`;
  const hours = date.getHours() % 12 || 12;
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const ampm = date.getHours() >= 12 ? 'pm' : 'am';
  const formattedTime = `${String(hours).padStart(2, '0')}:${minutes} ${ampm}`;

  doc.save(
    `DSL_Report_${selectedPostName}_${formattedDate}_${formattedTime}.pdf`
  );
};

// L&T report pdf

export const handleExportLnTPDF = async (
  selectedPostName: string,
  periodStartDate: string,
  periodEndDate: string,
  columns: Column<LNTRow>[],
  reportData: LNTRow[],
  totalBasicSalary: number,
  totalNetPay: number
) => {
  const doc = new jsPDF('landscape', 'pt', 'a4');

  // Load custom fonts
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

  // Header
  doc.setFont('Mona_Sans', 'bold');
  doc.setFontSize(12);
  doc.text('Purbanchal Security Consultants Pvt. Ltd.', 420, 30, {
    align: 'center',
  });
  doc.setFont('Mona_Sans', 'bold');
  doc.setFontSize(10);
  doc.text('Silpukhuri, Guwahati-03', 420, 50, { align: 'center' });

  doc.setFontSize(10);
  doc.text('Pay Roll of Staff Deployed at', 10, 75);
  doc.setFont('Mona_Sans', 'bold');
  if (selectedPostName) {
    doc.text(`${selectedPostName.toUpperCase()}`, 150, 75);
  }
  doc.setFontSize(10);

  if (periodStartDate && periodEndDate) {
    doc.text(
      `For the period from: ${periodStartDate} To: ${periodEndDate}`,
      830,
      75,
      {
        align: 'right',
      }
    );
  }

  // 🔧 Build multi-row header
  const buildHeaderRows = <T>(cols: Column<T>[]) => {
    const row1: any[] = [{ content: 'Sl. No.', rowSpan: 2 }];
    const row2: any[] = [];

    for (const col of cols) {
      if (col.children && col.children.length > 0) {
        row1.push({
          content: col.label,
          colSpan: col.children.length,
          styles: { halign: 'center' },
        });
        row2.push(...col.children.map((child) => ({ content: child.label })));
      } else {
        row1.push({ content: col.label, rowSpan: 2 });
      }
    }

    row1.push({ content: 'Sign', rowSpan: 2 });
    return [row1, row2];
  };

  // 🔧 Flatten columns for row data
  const flattenColumns = <T>(cols: Column<T>[]): string[] => {
    const flat: string[] = [];
    for (const col of cols) {
      if (col.children && col.children.length > 0) {
        flat.push(...col.children.map((child) => child.name as string));
      } else {
        flat.push(col.name as string);
      }
    }
    return flat;
  };

  const headerRows = buildHeaderRows(columns);
  const flatKeys = flattenColumns(columns);
  const fullKeys = ['slNo', ...flatKeys, 'sign'];

  const tableBody = reportData.map((row, index) =>
    fullKeys.map((key) => {
      if (key === 'slNo') return index + 1;
      if (key === 'sign') return '';
      if (key === 'empName') return `${row.empName}\n${row.rank ?? ''}`;
      if (key === 'empEPF')
        return `${row.deduction.empEPF}\nP.Tax:${row.deduction.pTax ?? ''}`;
      if (['empESI', 'emplrEPF', 'emplrESI'].includes(key) && row.deduction) {
        return row.deduction[key as keyof typeof row.deduction] ?? '';
      }
      const value = row[key as keyof LNTRow];
      if (typeof value === 'object' && value !== null) {
        return '';
      }
      return value ?? '';
    })
  );

  // 🧾 Table
  autoTable(doc, {
    startY: 90,
    margin: { top: 5, left: 5, right: 5, bottom: 5 },
    head: headerRows,
    body: tableBody,

    theme: 'grid',
    headStyles: {
      fillColor: '#ffffff',
      textColor: '#212529',
      font: 'Mona_Sans',
      fontStyle: 'bold',
      fontSize: 8,
      halign: 'center',
      lineWidth: 0.2,
      lineColor: '#000',
    },
    bodyStyles: {
      fillColor: '#fff',
      textColor: '#212529',
      font: 'Mona_Sans',
      fontStyle: 'bold',
      fontSize: 8,
      halign: 'center',
      lineWidth: 0,
      lineColor: '#000',
      overflow: 'linebreak',
    },
    styles: {
      cellPadding: { top: 3, bottom: 3, left: 1, right: 1 },
      overflow: 'linebreak',
    },
    didDrawCell: (data) => {
      const { cell, section } = data;

      if (section === 'body') {
        doc.setLineDashPattern([0.5, 0.5], 0);
        doc.setLineWidth(0.1);
        doc.setDrawColor(0, 0, 0);
        doc.line(
          cell.x,
          cell.y + cell.height,
          cell.x + cell.width,
          cell.y + cell.height
        );
      } else if (section === 'head') {
        doc.setLineDashPattern([], 0);
        doc.setLineWidth(0.3);
        doc.setDrawColor(0, 0, 0);
        doc.rect(cell.x, cell.y, cell.width, cell.height);
      }
    },
  });

  // ➕ Totals
  const totalText = `Total`;
  const totalBasicSalaryText = `${totalBasicSalary}`;
  const totalNetPayText = `${totalNetPay}`;

  doc.setFont('Mona_Sans', 'bold');
  doc.setFontSize(9);
  doc.text(totalText, 80, doc.lastAutoTable.finalY + 15);
  doc.text(totalBasicSalaryText, 420, doc.lastAutoTable.finalY + 15);
  doc.text(totalNetPayText, 780, doc.lastAutoTable.finalY + 15);

  const footerY = doc.lastAutoTable.finalY + 50;
  doc.setFontSize(10);
  doc.text('Rupees:', 240, footerY);
  doc.text(
    `${numberToWords(parseFloat(totalNetPay.toFixed(2)))}`,
    300,
    footerY
  );
  doc.text('Return after disbursement', 240, footerY + 16);
  doc.text(
    'Incharge: ..............................................................',
    240,
    footerY + 32
  );
  doc.text('Date: .......................................', 450, footerY + 32);

  //note
  // const noteY = footerY + 90;
  // doc.setFont('Mona_Sans', 'bold');
  // doc.setFontSize(9);
  // doc.setTextColor(100);
  // doc.text(
  //   'Note: This is a system-generated salary report. For any discrepancies, please contact Admin.\n© 2025 PSCPL Payroll',
  //   410,
  //   noteY,
  //   { align: 'center' }
  // );

  // 📄 Save
  const date = new Date();
  const formattedDate = `${String(date.getDate()).padStart(2, '0')}-${String(
    date.getMonth() + 1
  ).padStart(2, '0')}-${date.getFullYear()}`;
  const hours = date.getHours() % 12 || 12;
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const ampm = date.getHours() >= 12 ? 'pm' : 'am';
  const formattedTime = `${String(hours).padStart(2, '0')}:${minutes} ${ampm}`;

  doc.save(
    `L&T_Report_${selectedPostName}_${formattedDate}_${formattedTime}.pdf`
  );
};

// Other handle pdf export
export const handleExportOtherReportPDF = async (
  selectedPostName: string,
  periodStartDate: string,
  periodEndDate: string,
  columns: Column<OthersReportRow>[],
  reportData: OthersReportRow[],
  totalBasicSalary: number,
  totalNetPay: number
) => {
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

  // Header
  doc.setFont('Mona_Sans', 'bold');
  doc.setFontSize(14);
  doc.text('Purbanchal Security Consultants Pvt. Ltd.', 150, 10, {
    align: 'center',
  });

  doc.setFont('Mona_Sans', 'bold');
  doc.setFontSize(11);
  doc.text('Silpukhuri, Guwahati-03', 150, 16, { align: 'center' });

  doc.setFontSize(11);
  doc.text('Pay Roll of Staff Deployed at', 5, 24);
  doc.setFont('Mona_Sans', 'bold');
  if (selectedPostName) {
    doc.text(`${selectedPostName.toUpperCase()}`, 65, 24, { align: 'left' });
  }

  if (periodStartDate && periodEndDate) {
    doc.text(
      `For the period from: ${periodStartDate} To: ${periodEndDate}`,
      292,
      24,
      {
        align: 'right',
      }
    );
  }

  const updatedColumns = [
    { name: 'slNo', label: 'Sl. No.' },
    ...columns,
    { name: 'sign', label: 'Sign' },
  ];

  autoTable(doc, {
    startY: 30,
    margin: { top: 5, left: 5, right: 5, bottom: 5 },
    head: [updatedColumns.map((col) => col.label)],
    body: reportData.map((row, index) => [
      index + 1,
      ...columns.map((col) => {
        if (col.name === 'allowance') {
          return `Kits/Washing: ${row.allowance.kitAllowances}\nCity Allowances: ${row.allowance.cityAllowances || ''}\nConv/H.Rent: ${row.allowance.convHra || ''}`;
        } else if (col.name === 'deduction') {
          return `ESI: ${row.deduction.empESI}   Adv: ${row.deduction.adv}\nEPF: ${row.deduction.empEPF}   P.Tax: ${row.deduction.pTax}\nBelt: ${row.deduction.belt}   Uniform: ${row.deduction.Uniform}`;
        } else if (typeof row[col.name as keyof OthersReportRow] === 'object') {
          return JSON.stringify(row[col.name as keyof OthersReportRow]);
        } else {
          return String(row[col.name as keyof OthersReportRow] ?? '');
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
      lineWidth: 0.2,
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
      overflow: 'linebreak',
    },
    styles: {
      cellPadding: { top: 1, bottom: 1, left: 1, right: 1 },
      overflow: 'linebreak',
    },
    didDrawCell: (data) => {
      const { cell, section } = data;
      if (section === 'body') {
        doc.setLineDashPattern([0.5, 0.5], 0);
        doc.setLineWidth(0.3);
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

  // Totals
  const finalY = doc.lastAutoTable.finalY;
  doc.setFontSize(10);
  doc.text(`Total`, 20, finalY + 8);
  doc.text(`${totalBasicSalary}`, 70, finalY + 8);
  doc.text(`${totalNetPay}`, 270, finalY + 8);

  // Footer
  const footerY = finalY + 18;
  doc.text('Rupees:', 90, footerY);
  doc.text(
    `${numberToWords(parseFloat(totalNetPay.toFixed(2)))}`,
    110,
    footerY
  );
  doc.text('Return after disbursement', 90, footerY + 8);
  doc.text(
    'Incharge: ..............................................................',
    90,
    footerY + 16
  );
  doc.text('Date: .......................................', 160, footerY + 16);

  //note
  // const noteY = footerY + 30;
  // doc.setFont('Mona_Sans', 'bold');
  // doc.setFontSize(9);
  // doc.setTextColor(100);
  // doc.text(
  //   'Note: This is a system-generated salary report. For any discrepancies, please contact Admin.\n© 2025 PSCPL Payroll',
  //   150,
  //   noteY,
  //   { align: 'center' }
  // );

  // Save File
  const date = new Date();
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  let hours = date.getHours();
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const ampm = hours >= 12 ? 'pm' : 'am';
  hours = hours % 12 || 12;
  const formattedTime = `${String(hours).padStart(2, '0')}-${minutes}-${ampm}`;
  const formattedDate = `${day}-${month}-${year}`;

  doc.save(
    `Other_Report_${selectedPostName}_${formattedDate}_${formattedTime}.pdf`
  );
};

// const html2pdf = (await import('html2pdf.js')).default;

// export pdf html2pdf
// export const handleExportOtherReportPDF_HTML = (
//   tableRef: React.RefObject<HTMLDivElement>,
//   fileName: string = 'Other_Report'
// ) => {
//   if (!tableRef.current) return;

//   const element = tableRef.current;

//   const opt = {
//     // margin: [0.5, 0.5, 0.5, 0.5], // inches: top, left, bottom, right
//     filename: `${fileName}_${new Date()
//       .toLocaleString('en-IN', {
//         day: '2-digit',
//         month: '2-digit',
//         year: 'numeric',
//         hour: '2-digit',
//         minute: '2-digit',
//         hour12: true,
//       })
//       .replace(/[\s:]/g, '_')}.pdf`,
//     image: { type: 'jpeg', quality: 0.98 },
//     html2canvas: {
//       scale: 2,
//       useCORS: true, // allow fonts & logos to load
//       logging: true,
//     },
//     jsPDF: {
//       unit: 'in',
//       format: 'a4',
//       orientation: 'landscape',
//     },
//     pagebreak: {
//       mode: ['avoid-all', 'css', 'legacy'],
//       before: '.break-before',
//       after: '.break-after',
//     },
//   };

//   html2pdf().from(element).set(opt).save();
// };

// type 2 reports

// esi report pdf
export const handleExportESIReportPDF = async (
  // selectedPostName: ESIRow[],
  periodStartDate: string,
  periodEndDate: string,
  columns: Column<ESIRow>[],
  dsReportData: ESIRow[],
  totalGrossPay: number,
  totalNetPay: number
) => {
  const doc = new jsPDF('portrait');
  const rowsPerPage = 32;

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

  // Add "Sl. No." to the columns
  const updatedColumns = [
    { name: 'slNo', label: 'Sl. No.' }, // Add the serial number column
    ...columns,
    { name: 'sign', label: 'Sign' }, // Add the serial number column
  ];

  const chunks: ESIRow[][] = [];
  for (let i = 0; i < dsReportData.length; i += rowsPerPage) {
    chunks.push(dsReportData.slice(i, i + rowsPerPage));
  }

  chunks.forEach((chunk, pageIndex) => {
    if (pageIndex > 0) doc.addPage();

    // Header
    doc.setFont('Mona_Sans', 'bold');
    doc.setFontSize(14);
    doc.text('Purbanchal Security Consultants Pvt. Ltd.', 100, 10, {
      align: 'center',
    });

    doc.setFont('Mona_Sans', 'bold');
    doc.setFontSize(11);
    doc.text('Silpukhuri, Guwahati-03', 100, 16, { align: 'center' });

    if (periodStartDate && periodEndDate) {
      doc.text(
        `For the period from: ${periodStartDate} To: ${periodEndDate}`,
        5,
        28,
        {
          align: 'left',
        }
      );
    }

    // Table
    autoTable(doc, {
      startY: 30,
      margin: { top: 5, left: 5, right: 5, bottom: 20 },
      head: [updatedColumns.map((col) => col.label)],
      body: chunk.map((row, i) => [
        i + 1 + pageIndex * rowsPerPage,
        ...columns.map((col) => String(row[col.name as keyof typeof row])),
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
        fontStyle: 'bold',
        fontSize: 8.5,
        halign: 'center',
        lineWidth: 0,
        lineColor: '#000',
        overflow: 'linebreak',
      },
      styles: {
        cellPadding: { top: 1.5, bottom: 1.5, left: 1, right: 1 },
        overflow: 'linebreak',
      },
      didDrawCell: (data) => {
        const { cell, section } = data;

        if (section === 'body') {
          // Draw only the bottom dotted border
          doc.setLineDashPattern([0.5, 0.5], 0);
          doc.setLineWidth(0.3);
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
    });

    // Only draw total + footer on last page
    if (pageIndex === chunks.length - 1) {
      const finalY = doc.lastAutoTable.finalY + 5;

      doc.setFont('Mona_Sans', 'bold');
      doc.setFontSize(10);
      doc.text('Total', 30, finalY);
      doc.text(`${totalGrossPay}`, 95, finalY);
      doc.text(`${totalNetPay}`, 185, finalY);

      const footerY = finalY + 10;
      doc.setFontSize(10);
      doc.text('Rupees:', 70, footerY);
      doc.text(
        `${numberToWords(parseFloat(totalNetPay.toFixed(2)))}`,
        88,
        footerY
      );
      doc.text('Return after disbursement', 92, footerY + 5, {
        align: 'center',
      });
      doc.text(
        'Incharge: ..............................................................',
        70,
        footerY + 10
      );
      doc.text(
        'Date: .......................................',
        140,
        footerY + 10
      );

      // const noteY = footerY + 20;
      // doc.setFont('Mona_Sans', 'bold');
      // doc.setFontSize(9);
      // doc.setTextColor(100);
      // doc.text(
      //   'Note: This is a system-generated salary report. For any discrepancies, please contact Admin.\n© 2025 PSCPL Payroll',
      //   120,
      //   noteY,
      //   { align: 'center' }
      // );
    }
  });

  // // Header
  // doc.setFont('Mona_Sans', 'bold');
  // doc.setFontSize(14);
  // doc.text('Purbanchal Security Consultants Pvt. Ltd.', 150, 10, {
  //   align: 'center',
  // });

  // doc.setFont('Mona_Sans', 'normal');
  // doc.setFontSize(11);
  // doc.text('Silpukhuri, Guwahati-03', 150, 16, { align: 'center' });

  // if (selectedDate) {
  //   const { firstDay, lastDay } = getFirstAndLastDay(selectedDate);
  //   doc.text(`For the period from: ${firstDay} To: ${lastDay}`, 5, 24, {
  //     align: 'left',
  //   });
  // }

  // // Generate the Table
  // autoTable(doc, {
  //   startY: 30, // Start the table after the header details
  //   margin: { top: 5, left: 5, right: 5, bottom: 5 },
  //   head: [updatedColumns.map((col) => col.label)],
  //   body: dsReportData.map((row, index) => [
  //     index + 1, // Serial Number (Sl. No.)
  //     ...columns.map((col) => {
  //       {
  //         return String(row[col.name as keyof typeof row]); // Convert the value to a string
  //       }
  //     }),
  //   ]),
  //   theme: 'grid',
  //   headStyles: {
  //     fillColor: '#ffffff',
  //     textColor: '#212529',
  //     font: 'Mona_Sans',
  //     fontStyle: 'bold',
  //     fontSize: 8.5,
  //     halign: 'center',
  //     lineWidth: 0.2,
  //     lineColor: '#000',
  //   },
  //   bodyStyles: {
  //     fillColor: '#fff',
  //     textColor: '#212529',
  //     font: 'Mona_Sans',
  //     fontStyle: 'normal',
  //     fontSize: 8.5,
  //     halign: 'center',
  //     lineWidth: 0,
  //     lineColor: '#000',
  //     overflow: 'linebreak',
  //   },

  //   styles: {
  //     cellPadding: { top: 1.5, bottom: 1.5, left: 1, right: 1 },
  //     overflow: 'linebreak',
  //   },
  //   didDrawCell: (data) => {
  //     const { cell, section } = data;

  //     if (section === 'body') {
  //       // Draw only the bottom dotted border
  //       doc.setLineDashPattern([0.5, 0.5], 0);
  //       doc.setLineWidth(0.3);
  //       doc.setDrawColor(0, 0, 0);
  //       doc.line(
  //         cell.x,
  //         cell.y + cell.height,
  //         cell.x + cell.width,
  //         cell.y + cell.height
  //       );
  //     } else if (section === 'head') {
  //       // Draw full solid border for head
  //       doc.setLineDashPattern([], 0);
  //       doc.setLineWidth(0.5);
  //       doc.setDrawColor(0, 0, 0);
  //       doc.rect(cell.x, cell.y, cell.width, cell.height);
  //     }
  //   },
  // });

  // // Add Total Row (Total Gross Pay and Total Net Pay)

  // const totalText = ` Total`;
  // const totalGrossPayText = ` ${totalGrossPay}`;
  // const totalNetPayText = ` ${totalNetPay}`;

  // doc.setFont('Mona_Sans', 'bold');
  // doc.setFontSize(10);
  // doc.text(totalText, 30, doc.lastAutoTable.finalY + 8);
  // doc.text(totalGrossPayText, 143, doc.lastAutoTable.finalY + 8);
  // doc.text(totalNetPayText, 265, doc.lastAutoTable.finalY + 8);

  // // Add Footer
  // const footerY = doc.lastAutoTable.finalY + 20; // Adjusting vertical position after the table
  // doc.setFontSize(10);
  // doc.text('Rupees:', 100, footerY);
  // doc.text(
  //   `${numberToWords(parseFloat(totalNetPay.toFixed(2)))}`,
  //   118,
  //   footerY
  // );

  // doc.text('Return after disbursement', 122, footerY + 8, {
  //   align: 'center',
  // });

  // doc.text(
  //   'Incharge: ..............................................................',
  //   100,
  //   footerY + 16
  // );
  // doc.text('Date: .......................................', 190, footerY + 16);

  // //note
  // const noteY = footerY + 30;
  // doc.setFont('Mona_Sans', 'normal');
  // doc.setFontSize(9);
  // doc.setTextColor(100);
  // doc.text(
  //   'Note: This is a system-generated salary report. For any discrepancies, please contact Admin.\n© 2025 PSCPL Payroll',
  //   155,
  //   noteY,
  //   { align: 'center' }
  // );

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
  doc.save(`ESI_Report_${formattedDate}_${formattedTime}.pdf`);
};

// esi report pdf
export const handleExportEPFReportPDF = async (
  // selectedPostName: ESIRow[],
  periodStartDate: string,
  periodEndDate: string,
  columns: Column<EPFRow>[],
  dsReportData: EPFRow[],
  totalGrossPay: number,
  totalNetPay: number
) => {
  const doc = new jsPDF('portrait');
  const rowsPerPage = 32;

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

  // Add "Sl. No." to the columns
  const updatedColumns = [
    { name: 'slNo', label: 'Sl. No.' }, // Add the serial number column
    ...columns,
    { name: 'sign', label: 'Sign' }, // Add the serial number column
  ];

  const chunks: EPFRow[][] = [];
  for (let i = 0; i < dsReportData.length; i += rowsPerPage) {
    chunks.push(dsReportData.slice(i, i + rowsPerPage));
  }

  chunks.forEach((chunk, pageIndex) => {
    if (pageIndex > 0) doc.addPage();

    // Header
    doc.setFont('Mona_Sans', 'bold');
    doc.setFontSize(14);
    doc.text('Purbanchal Security Consultants Pvt. Ltd.', 100, 10, {
      align: 'center',
    });

    doc.setFont('Mona_Sans', 'bold');
    doc.setFontSize(11);
    doc.text('Silpukhuri, Guwahati-03', 100, 16, { align: 'center' });

    if (periodStartDate && periodEndDate) {
      doc.text(
        `For the period from: ${periodStartDate} To: ${periodEndDate}`,
        5,
        28,
        {
          align: 'left',
        }
      );
    }

    // Table
    autoTable(doc, {
      startY: 30,
      margin: { top: 5, left: 5, right: 5, bottom: 20 },
      head: [updatedColumns.map((col) => col.label)],
      body: chunk.map((row, i) => [
        i + 1 + pageIndex * rowsPerPage,
        ...columns.map((col) => String(row[col.name as keyof typeof row])),
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
        fontStyle: 'bold',
        fontSize: 8.5,
        halign: 'center',
        lineWidth: 0,
        lineColor: '#000',
        overflow: 'linebreak',
      },
      styles: {
        cellPadding: { top: 1.5, bottom: 1.5, left: 1, right: 1 },
        overflow: 'linebreak',
      },
      didDrawCell: (data) => {
        const { cell, section } = data;

        if (section === 'body') {
          // Draw only the bottom dotted border
          doc.setLineDashPattern([0.5, 0.5], 0);
          doc.setLineWidth(0.3);
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
    });

    // Only draw total + footer on last page
    if (pageIndex === chunks.length - 1) {
      const finalY = doc.lastAutoTable.finalY + 5;

      doc.setFont('Mona_Sans', 'bold');
      doc.setFontSize(10);
      doc.text('Total', 30, finalY);
      doc.text(`${totalGrossPay}`, 85, finalY);
      doc.text(`${totalNetPay}`, 182, finalY);

      const footerY = finalY + 10;
      doc.setFontSize(10);
      doc.text('Rupees:', 70, footerY);
      doc.text(
        `${numberToWords(parseFloat(totalNetPay.toFixed(2)))}`,
        88,
        footerY
      );
      doc.text('Return after disbursement', 92, footerY + 5, {
        align: 'center',
      });
      doc.text(
        'Incharge: ..............................................................',
        70,
        footerY + 10
      );
      doc.text(
        'Date: .......................................',
        140,
        footerY + 10
      );

      // const noteY = footerY + 20;
      // doc.setFont('Mona_Sans', 'bold');
      // doc.setFontSize(9);
      // doc.setTextColor(100);
      // doc.text(
      //   'Note: This is a system-generated salary report. For any discrepancies, please contact Admin.\n© 2025 PSCPL Payroll',
      //   125,
      //   noteY,
      //   { align: 'center' }
      // );
    }
  });

  // // Header
  // doc.setFont('Mona_Sans', 'bold');
  // doc.setFontSize(14);
  // doc.text('Purbanchal Security Consultants Pvt. Ltd.', 150, 10, {
  //   align: 'center',
  // });

  // doc.setFont('Mona_Sans', 'normal');
  // doc.setFontSize(11);
  // doc.text('Silpukhuri, Guwahati-03', 150, 16, { align: 'center' });

  // if (selectedDate) {
  //   const { firstDay, lastDay } = getFirstAndLastDay(selectedDate);
  //   doc.text(`For the period from: ${firstDay} To: ${lastDay}`, 5, 24, {
  //     align: 'left',
  //   });
  // }

  // // Generate the Table
  // autoTable(doc, {
  //   startY: 30, // Start the table after the header details
  //   margin: { top: 5, left: 5, right: 5, bottom: 5 },
  //   head: [updatedColumns.map((col) => col.label)],
  //   body: dsReportData.map((row, index) => [
  //     index + 1, // Serial Number (Sl. No.)
  //     ...columns.map((col) => {
  //       {
  //         return String(row[col.name as keyof typeof row]); // Convert the value to a string
  //       }
  //     }),
  //   ]),
  //   theme: 'grid',
  //   headStyles: {
  //     fillColor: '#ffffff',
  //     textColor: '#212529',
  //     font: 'Mona_Sans',
  //     fontStyle: 'bold',
  //     fontSize: 8.5,
  //     halign: 'center',
  //     lineWidth: 0.2,
  //     lineColor: '#000',
  //   },
  //   bodyStyles: {
  //     fillColor: '#fff',
  //     textColor: '#212529',
  //     font: 'Mona_Sans',
  //     fontStyle: 'normal',
  //     fontSize: 8.5,
  //     halign: 'center',
  //     lineWidth: 0,
  //     lineColor: '#000',
  //     overflow: 'linebreak',
  //   },

  //   styles: {
  //     cellPadding: { top: 1.5, bottom: 1.5, left: 1, right: 1 },
  //     overflow: 'linebreak',
  //   },
  //   didDrawCell: (data) => {
  //     const { cell, section } = data;

  //     if (section === 'body') {
  //       // Draw only the bottom dotted border
  //       doc.setLineDashPattern([0.5, 0.5], 0);
  //       doc.setLineWidth(0.3);
  //       doc.setDrawColor(0, 0, 0);
  //       doc.line(
  //         cell.x,
  //         cell.y + cell.height,
  //         cell.x + cell.width,
  //         cell.y + cell.height
  //       );
  //     } else if (section === 'head') {
  //       // Draw full solid border for head
  //       doc.setLineDashPattern([], 0);
  //       doc.setLineWidth(0.5);
  //       doc.setDrawColor(0, 0, 0);
  //       doc.rect(cell.x, cell.y, cell.width, cell.height);
  //     }
  //   },
  // });

  // // Add Total Row (Total Gross Pay and Total Net Pay)

  // const totalText = ` Total`;
  // const totalGrossPayText = ` ${totalGrossPay}`;
  // const totalNetPayText = ` ${totalNetPay}`;

  // doc.setFont('Mona_Sans', 'bold');
  // doc.setFontSize(10);
  // doc.text(totalText, 30, doc.lastAutoTable.finalY + 8);
  // doc.text(totalGrossPayText, 138, doc.lastAutoTable.finalY + 8);
  // doc.text(totalNetPayText, 265, doc.lastAutoTable.finalY + 8);

  // // Add Footer
  // const footerY = doc.lastAutoTable.finalY + 20; // Adjusting vertical position after the table
  // doc.setFontSize(10);
  // doc.text('Rupees:', 100, footerY);
  // doc.text(
  //   `${numberToWords(parseFloat(totalNetPay.toFixed(2)))}`,
  //   118,
  //   footerY
  // );

  // doc.text('Return after disbursement', 122, footerY + 8, {
  //   align: 'center',
  // });

  // doc.text(
  //   'Incharge: ..............................................................',
  //   100,
  //   footerY + 16
  // );
  // doc.text('Date: .......................................', 190, footerY + 16);

  // //note
  // const noteY = footerY + 27;
  // doc.setFont('Mona_Sans', 'normal');
  // doc.setFontSize(9);
  // doc.setTextColor(100);
  // doc.text(
  //   'Note: This is a system-generated salary report. For any discrepancies, please contact Admin.\n© 2025 PSCPL Payroll',
  //   155,
  //   noteY,
  //   { align: 'center' }
  // );

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

// pTax report pdf
export const handleExportPTaxReportPDF = async (
  periodStartDate: string,
  periodEndDate: string,
  columns: Column<PTaxRow>[],
  dsReportData: PTaxRow[],
  totalGrossPay: number,
  totalNetPay: number
) => {
  const doc = new jsPDF('portrait');
  const rowsPerPage = 32;

  // Load fonts
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

  // Columns
  const updatedColumns = [
    { name: 'slNo', label: 'Sl. No.' },
    ...columns,
    { name: 'sign', label: 'Sign' },
  ];

  // Chunk rows
  const chunks: PTaxRow[][] = [];
  for (let i = 0; i < dsReportData.length; i += rowsPerPage) {
    chunks.push(dsReportData.slice(i, i + rowsPerPage));
  }

  chunks.forEach((chunk, pageIndex) => {
    if (pageIndex > 0) doc.addPage();

    // Header
    doc.setFont('Mona_Sans', 'bold');
    doc.setFontSize(14);
    doc.text('Purbanchal Security Consultants Pvt. Ltd.', 100, 10, {
      align: 'center',
    });

    doc.setFont('Mona_Sans', 'bold');
    doc.setFontSize(11);
    doc.text('Silpukhuri, Guwahati-03', 100, 16, { align: 'center' });

    if (periodStartDate && periodEndDate) {
      doc.text(
        `For the period from: ${periodStartDate} To: ${periodEndDate}`,
        5,
        28,
        {
          align: 'left',
        }
      );
    }

    // Table
    autoTable(doc, {
      startY: 30,
      margin: { top: 5, left: 5, right: 5, bottom: 20 },
      head: [updatedColumns.map((col) => col.label)],
      body: chunk.map((row, i) => [
        i + 1 + pageIndex * rowsPerPage,
        ...columns.map((col) => String(row[col.name as keyof typeof row])),
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
        fontStyle: 'bold',
        fontSize: 8.5,
        halign: 'center',
        lineWidth: 0,
        lineColor: '#000',
        overflow: 'linebreak',
      },
      styles: {
        cellPadding: { top: 1.5, bottom: 1.5, left: 1, right: 1 },
        overflow: 'linebreak',
      },
      didDrawCell: (data) => {
        const { cell, section } = data;

        if (section === 'body') {
          // Draw only the bottom dotted border
          doc.setLineDashPattern([0.5, 0.5], 0);
          doc.setLineWidth(0.3);
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
    });

    // Only draw total + footer on last page
    if (pageIndex === chunks.length - 1) {
      const finalY = doc.lastAutoTable.finalY + 10;

      doc.setFont('Mona_Sans', 'bold');
      doc.setFontSize(10);
      doc.text('Total', 30, finalY);
      doc.text(`${totalGrossPay}`, 145, finalY);
      doc.text(`${totalNetPay}`, 175, finalY);

      const footerY = finalY + 10;
      doc.setFontSize(10);
      doc.text('Rupees:', 70, footerY);
      doc.text(
        `${numberToWords(parseFloat(totalNetPay.toFixed(2)))}`,
        88,
        footerY
      );
      doc.text('Return after disbursement', 92, footerY + 8, {
        align: 'center',
      });
      doc.text(
        'Incharge: ..............................................................',
        70,
        footerY + 16
      );
      doc.text(
        'Date: .......................................',
        140,
        footerY + 16
      );

      // const noteY = footerY + 28;
      // doc.setFont('Mona_Sans', 'bold');
      // doc.setFontSize(9);
      // doc.setTextColor(100);
      // doc.text(
      //   'Note: This is a system-generated salary report. For any discrepancies, please contact Admin.\n© 2025 PSCPL Payroll',
      //   120,
      //   noteY,
      //   { align: 'center' }
      // );
    }
  });

  // Save the PDF
  const date = new Date();
  const formattedDate = `${String(date.getDate()).padStart(2, '0')}-${String(
    date.getMonth() + 1
  ).padStart(2, '0')}-${date.getFullYear()}`;
  const formattedTime = `${String(date.getHours() % 12 || 12).padStart(2, '0')}:${String(
    date.getMinutes()
  ).padStart(2, '0')} ${date.getHours() >= 12 ? 'pm' : 'am'}`;

  doc.save(`PTAX_Report_${formattedDate}_${formattedTime}.pdf`);
};

// Salary report pdf
export const handleExportSalaryReportPDF = async (
  // selectedDate: Date,
  periodStartDate: string,
  periodEndDate: string,
  columns: Column<SalaryRow>[],
  dsReportData: SalaryRow[],
  // totalGrossPay: number,
  totalNetPay: number
) => {
  const doc = new jsPDF('landscape');
  const rowsPerPage = 22;

  // Load fonts
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

  // Columns
  const updatedColumns = [
    { name: 'slNo', label: 'Sl. No.' },
    ...columns,
    { name: 'sign', label: 'Sign' },
  ];

  // Chunk rows
  const chunks: SalaryRow[][] = [];
  for (let i = 0; i < dsReportData.length; i += rowsPerPage) {
    chunks.push(dsReportData.slice(i, i + rowsPerPage));
  }

  chunks.forEach((chunk, pageIndex) => {
    if (pageIndex > 0) doc.addPage();

    // Header
    doc.setFont('Mona_Sans', 'bold');
    doc.setFontSize(14);
    doc.text('Purbanchal Security Consultants Pvt. Ltd.', 150, 10, {
      align: 'center',
    });

    doc.setFont('Mona_Sans', 'bold');
    doc.setFontSize(11);
    doc.text('Silpukhuri, Guwahati-03', 150, 16, { align: 'center' });

    if (periodStartDate && periodEndDate) {
      doc.text(
        `For the period from: ${periodStartDate} To: ${periodEndDate}`,
        5,
        24,
        {
          align: 'left',
        }
      );
    }

    // Table
    autoTable(doc, {
      startY: 30,
      margin: { top: 5, left: 5, right: 5, bottom: 20 },
      head: [updatedColumns.map((col) => col.label)],
      body: chunk.map((row, i) => [
        i + 1 + pageIndex * rowsPerPage,
        ...columns.map((col) => String(row[col.name as keyof typeof row])),
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
        fontStyle: 'bold',
        fontSize: 8.5,
        halign: 'center',
        lineWidth: 0,
        lineColor: '#000',
        overflow: 'linebreak',
      },
      styles: {
        cellPadding: { top: 1.5, bottom: 1.5, left: 1, right: 1 },
        overflow: 'linebreak',
      },
      didDrawCell: (data) => {
        const { cell, section } = data;

        if (section === 'body') {
          // Draw only the bottom dotted border
          doc.setLineDashPattern([0.5, 0.5], 0);
          doc.setLineWidth(0.3);
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
    });

    // Only draw total + footer on last page
    if (pageIndex === chunks.length - 1) {
      const finalY = doc.lastAutoTable.finalY + 10;

      doc.setFont('Mona_Sans', 'bold');
      doc.setFontSize(10);
      doc.text('Total', 30, finalY);
      // doc.text(`${totalGrossPay}`, 220, finalY);
      doc.text(`${totalNetPay}`, 170, finalY);

      const footerY = finalY + 10;
      doc.setFontSize(10);
      doc.text('Rupees:', 100, footerY);
      doc.text(
        `${numberToWords(parseFloat(totalNetPay.toFixed(2)))}`,
        118,
        footerY
      );
      doc.text('Return after disbursement', 122, footerY + 8, {
        align: 'center',
      });
      doc.text(
        'Incharge: ..............................................................',
        100,
        footerY + 16
      );
      doc.text(
        'Date: .......................................',
        190,
        footerY + 16
      );

      // const noteY = footerY + 28;
      // doc.setFont('Mona_Sans', 'bold');
      // doc.setFontSize(9);
      // doc.setTextColor(100);
      // doc.text(
      //   'Note: This is a system-generated salary report. For any discrepancies, please contact Admin.\n© 2025 PSCPL Payroll',
      //   155,
      //   noteY,
      //   { align: 'center' }
      // );
    }
  });

  // Save the PDF
  const date = new Date();
  const formattedDate = `${String(date.getDate()).padStart(2, '0')}-${String(
    date.getMonth() + 1
  ).padStart(2, '0')}-${date.getFullYear()}`;
  const formattedTime = `${String(date.getHours() % 12 || 12).padStart(2, '0')}:${String(
    date.getMinutes()
  ).padStart(2, '0')} ${date.getHours() >= 12 ? 'pm' : 'am'}`;

  doc.save(`Salary_Report_${formattedDate}_${formattedTime}.pdf`);
};

///////////////////////////////////////////////
