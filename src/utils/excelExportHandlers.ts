import * as XLSX from 'xlsx';

import {
  DSLReportRow,
  DsReportRow,
  EPFRow,
  ESIRow,
  LNTRow,
  NewPayrollRow,
  OthersReportRow,
  PTaxRow,
  SalaryRow,
  WithoutAllowanceRow,
} from '../types/report-new';

// Apply styles below worksheet
// const totalRowIndex = sheetData.length - 1;
// const range = XLSX.utils.decode_range(worksheet['!ref']!);

// for (let R = range.s.r; R <= range.e.r; ++R) {
//   for (let C = range.s.c; C <= range.e.c; ++C) {
//     const cellAddress = XLSX.utils.encode_cell({ r: R, c: C });
//     const cell = worksheet[cellAddress];
//     if (!cell) continue;

//     cell.s = {
//       font: {
//         bold: R <= 1 || R === totalRowIndex, // Bold headers and totals
//       },
//       alignment: {
//         vertical: 'center',
//         horizontal: R <= 1 ? 'center' : 'right',
//       },
//       border: {
//         top: { style: 'thin', color: { auto: 1 } },
//         bottom: { style: 'thin', color: { auto: 1 } },
//         left: { style: 'thin', color: { auto: 1 } },
//         right: { style: 'thin', color: { auto: 1 } },
//       },
//       fill:
//         R <= 1
//           ? {
//               fgColor: { rgb: 'D9E1F2' }, // Light blue for headers
//             }
//           : undefined,
//     };
//   }
// }

// XLSX.writeFile(workbook, `${fileName}.xlsx`, { cellStyles: true });

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

// Converts input to number with fallback
const toNumber = (val: any): number => {
  const num = typeof val === 'number' ? val : parseFloat(val);
  return isNaN(num) ? 0 : Number(num.toFixed(2));
};

// Helper to sum a column of values
const sumColumn = (values: any[]): number => {
  return Number(values.reduce((sum, val) => sum + toNumber(val), 0).toFixed(2));
};

// Ds report excel
export const handleExportDsExcel = (
  // columns: Column<LNTRow>[],
  dsReportData: DsReportRow[],
  fileName = 'DS_Report',
  companyName = 'Purbanchal Security Consultants Pvt. Ltd.',
  companyAddress = 'Silpukhuri, Guwahati-03',
  periodStartDate?: string,
  periodEndDate?: string,
  totalNetPay?: number
) => {
  // Manually define column labels to match HTML layout
  const headersRow1 = [
    'Sl. No.',
    'Name & Details',
    'Days',
    'Basic Pay',
    'Allowances',
    '',
    '',
    'Gross Pay',
    'Extra Duty',
    'Deduction',
    '',
    '',
    '',
    'Other',
    '',
    '',
    'Other Deduction',
    'Total Deduction',
    'Net Pay',
    'Sign',
  ];

  const headersRow2 = [
    '',
    '',
    '',
    '',
    'Kits/Washing',
    'City Allowance',
    'Conv/H.Rent',
    '',
    '',
    'ESI',
    'EPF',
    'Adv',
    'P.Tax',
    'Belt',
    'Boot',
    'Uniform',
    '',
    '',
    '',
    '',
  ];

  // Build the body rows
  const dataRows = dsReportData.map((row) => [
    row.slNo,
    row.empName,
    row.days,
    toNumber(row.basicSalary),
    toNumber(row.allowances.kitAllowances),
    toNumber(row.allowances.cityAllowances),
    toNumber(row.allowances.convHra),
    toNumber(row.grossPay),
    toNumber(row.extraDuty),
    toNumber(row.deduction.empESI),
    toNumber(row.deduction.empEPF),
    toNumber(row.deduction.adv),
    toNumber(row.deduction.pTax),
    toNumber(row.other.belt),
    toNumber(row.other.boot),
    toNumber(row.other.uniform),
    toNumber(row.otherDeduction),
    toNumber(row.totalDeduction),
    toNumber(row.netPay),
    '',
  ]);

  // Add a total row
  const totalRow = [
    '',
    'Total',
    '',
    '', // First few non-numeric fields
    '',
    '',
    '',
    sumColumn(dsReportData.map((r) => r.grossPay)),
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    sumColumn(dsReportData.map((r) => r.netPay)),
    '', // Sign
  ];

  const periodRow = [
    `Salary Report Period: ${periodStartDate} to ${periodEndDate}`,
  ];

  // Custom header rows
  const titleRow = [companyName];
  const addressRow = [companyAddress];
  const emptyRow = ['']; // spacer row
  const headerSpacing = ['', '', '', '', '', '', '', ''];

  // return row

  const rupeesRow = [
    `Rupees: ${numberToWords(parseFloat((totalNetPay ?? 0).toFixed(2)))}`,
  ];

  // return after disbursement
  const returnRow = [`Return after disbursement`];
  // incharge and date
  const inchargeAndDateRow = [
    `Incharge:.....................................  Date:...............`,
  ];

  // Custom footer row
  const footerRow = [
    'Note: This is a system-generated report. Please verify before processing payment.',
  ];

  // Combine all rows
  // const sheetData = [headersRow1, headersRow2, ...dataRows, totalRow];
  const sheetData = [
    titleRow,
    addressRow,
    periodRow,
    headerSpacing,
    headersRow1,
    headersRow2,
    ...dataRows,
    totalRow,
    emptyRow,
    rupeesRow,
    emptyRow,
    returnRow,
    emptyRow,
    inchargeAndDateRow,
    emptyRow,
    footerRow,
  ];

  // Create worksheet
  const worksheet = XLSX.utils.aoa_to_sheet(sheetData);

  // Merge cells for 'Deduction'
  worksheet['!merges'] = [
    // Top Header Merges (rows 0–2)
    { s: { r: 0, c: 0 }, e: { r: 0, c: 19 } }, // Company Name
    { s: { r: 1, c: 0 }, e: { r: 1, c: 19 } }, // Company Address
    { s: { r: 2, c: 0 }, e: { r: 2, c: 19 } }, // Period

    // Allowances: col 4 to 6
    { s: { r: 4, c: 4 }, e: { r: 4, c: 6 } },
    // Deduction: col 10 to 13
    { s: { r: 4, c: 9 }, e: { r: 4, c: 12 } },
    // Other: col 14 to 16
    { s: { r: 4, c: 13 }, e: { r: 4, c: 15 } },
    // Merge rest of first row cells vertically where needed
    ...[0, 1, 2, 3, 7, 8, 16, 17, 18, 19].map((col) => ({
      s: { r: 4, c: col },
      e: { r: 5, c: col },
    })),
  ];

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Details Report');
  XLSX.writeFile(workbook, `${fileName}.xlsx`);
};

// WithoutAllowance report excel
export const handleExportWithoutAllowanceExcel = (
  // columns: Column<LNTRow>[],
  dsReportData: WithoutAllowanceRow[],
  fileName = 'WithoutAllowance_Report',
  companyName = 'Purbanchal Security Consultants Pvt. Ltd.',
  companyAddress = 'Silpukhuri, Guwahati-03',
  periodStartDate?: string,
  periodEndDate?: string,
  totalNetPay?: number
) => {
  // Manually define column labels to match HTML layout
  const headersRow1 = [
    'Sl. No.',
    'Name',
    'Rank',
    'Days',
    'Basic Pay',
    'Extra Duty',
    'Deduction',
    '',
    '',
    '',
    'Other',
    '',
    '',
    'Bonus',
    'Other Deduction',
    'Total Deduction',
    'Net Pay',
    'Sign',
  ];

  const headersRow2 = [
    '',
    '',
    '',
    '',
    '',
    '',
    'ESI',
    'EPF',
    'Adv',
    'P.Tax',
    'Belt',
    'Boot',
    'Uniform',
    '',
    '',
    '',
    '',
    '',
  ];

  // Build the body rows
  const dataRows = dsReportData.map((row) => [
    row.slNo,
    row.empName,
    row.rank,
    row.days,
    toNumber(row.basicSalary),
    toNumber(row.extraDuty),
    toNumber(row.deduction.empESI),
    toNumber(row.deduction.empEPF),
    toNumber(row.deduction.adv),
    toNumber(row.deduction.pTax),
    toNumber(row.other.belt),
    toNumber(row.other.boot),
    toNumber(row.other.uniform),
    toNumber(row.bonus),
    toNumber(row.otherDeduction),
    toNumber(row.totalDeduction),
    toNumber(row.netPay),
    '',
  ]);

  // Add a total row
  const totalRow = [
    'Total',
    '',
    '',
    '', // First few non-numeric fields
    sumColumn(dsReportData.map((r) => r.basicSalary)),
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    sumColumn(dsReportData.map((r) => r.netPay)),
    '',
    '', // Sign
  ];

  const periodRow = [
    `Salary Report Period: ${periodStartDate} to ${periodEndDate}`,
  ];

  // Custom header rows
  const titleRow = [companyName];
  const addressRow = [companyAddress];
  const emptyRow = ['']; // spacer row
  const headerSpacing = ['', '', '', '', '', '', '', ''];

  // return row

  const rupeesRow = [
    `Rupees: ${numberToWords(parseFloat((totalNetPay ?? 0).toFixed(2)))}`,
  ];

  // return after disbursement
  const returnRow = [`Return after disbursement`];
  // incharge and date
  const inchargeAndDateRow = [
    `Incharge:.....................................  Date:...............`,
  ];

  // Custom footer row
  const footerRow = [
    'Note: This is a system-generated report. Please verify before processing payment.',
  ];

  // Combine all rows
  // const sheetData = [headersRow1, headersRow2, ...dataRows, totalRow];
  const sheetData = [
    titleRow,
    addressRow,
    periodRow,
    headerSpacing,
    headersRow1,
    headersRow2,
    ...dataRows,
    totalRow,
    emptyRow,
    rupeesRow,
    emptyRow,
    returnRow,
    emptyRow,
    inchargeAndDateRow,
    emptyRow,
    footerRow,
  ];

  // Create worksheet
  const worksheet = XLSX.utils.aoa_to_sheet(sheetData);

  // Merge cells for 'Deduction'
  worksheet['!merges'] = [
    // Top Header Merges (rows 0–2)
    { s: { r: 0, c: 0 }, e: { r: 0, c: 17 } }, // Company Name
    { s: { r: 1, c: 0 }, e: { r: 1, c: 17 } }, // Company Address
    { s: { r: 2, c: 0 }, e: { r: 2, c: 17 } }, // Period

    // Allowances: col 4 to 6
    { s: { r: 4, c: 6 }, e: { r: 4, c: 9 } },
    // Deduction: col 10 to 13
    { s: { r: 4, c: 10 }, e: { r: 4, c: 12 } },
    // Merge rest of first row cells vertically where needed
    ...[0, 1, 2, 3, 4, 5, 13, 14, 15, 16, 17, 18].map((col) => ({
      s: { r: 4, c: col },
      e: { r: 5, c: col },
    })),
  ];

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Without Allowance Report');
  XLSX.writeFile(workbook, `${fileName}.xlsx`);
};

// New payroll report excel
export const handleExportNewPayrollExcel = (
  // columns: Column<LNTRow>[],
  dsReportData: NewPayrollRow[],
  fileName = 'NewPayrollRow_Report',
  companyName = 'Purbanchal Security Consultants Pvt. Ltd.',
  companyAddress = 'Silpukhuri, Guwahati-03',
  periodStartDate?: string,
  periodEndDate?: string,
  totalNetPay?: number
) => {
  // Manually define column labels to match HTML layout
  const headersRow1 = [
    'Sl. No.',
    'Name',
    'Rank',
    'Days',
    'Basic Pay',
    'Uniform',
    'Bonus',
    'Total',
    'Extra Duty',
    'Deduction',
    '',
    '',
    '',
    'P.Tax',
    'Other Deduction',
    'Total Deduction',
    'Net Pay',
    'Sign',
  ];

  const headersRow2 = [
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    'Employee EPF',
    'Employee ESI',
    'Employeer EPF',
    'Employeer ESI',
    '',
    '',
    '',
    '',
    '',
  ];

  // Build the body rows
  const dataRows = dsReportData.map((row) => [
    row.slNo,
    row.empName,
    row.rank,
    row.days,
    toNumber(row.basicSalary),
    toNumber(row.uniform),
    toNumber(row.bonus),
    toNumber(row.total),
    toNumber(row.extraDuty),
    toNumber(row.deduction.empEPF),
    toNumber(row.deduction.empESI),
    toNumber(row.deduction.emplrEPF),
    toNumber(row.deduction.emplrESI),
    toNumber(row.pTax),
    toNumber(row.otherDeduction),
    toNumber(row.totalDeduction),
    toNumber(row.netPay),
    '',
  ]);

  // Add a total row
  const totalRow = [
    '',
    'Total',
    '',
    '', // First few non-numeric fields
    sumColumn(dsReportData.map((r) => r.basicSalary)),
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    sumColumn(dsReportData.map((r) => r.netPay)),
    '',
  ];

  const periodRow = [
    `Salary Report Period: ${periodStartDate} to ${periodEndDate}`,
  ];

  // Custom header rows
  const titleRow = [companyName];
  const addressRow = [companyAddress];
  const emptyRow = ['']; // spacer row
  const headerSpacing = ['', '', '', '', '', '', '', ''];

  // return row

  const rupeesRow = [
    `Rupees: ${numberToWords(parseFloat((totalNetPay ?? 0).toFixed(2)))}`,
  ];

  // return after disbursement
  const returnRow = [`Return after disbursement`];
  // incharge and date
  const inchargeAndDateRow = [
    `Incharge:.....................................  Date:...............`,
  ];

  // Custom footer row
  const footerRow = [
    'Note: This is a system-generated report. Please verify before processing payment.',
  ];

  // Combine all rows
  // const sheetData = [headersRow1, headersRow2, ...dataRows, totalRow];
  const sheetData = [
    titleRow,
    addressRow,
    periodRow,
    headerSpacing,
    headersRow1,
    headersRow2,
    ...dataRows,
    totalRow,
    emptyRow,
    rupeesRow,
    emptyRow,
    returnRow,
    emptyRow,
    inchargeAndDateRow,
    emptyRow,
    footerRow,
  ];

  // Create worksheet
  const worksheet = XLSX.utils.aoa_to_sheet(sheetData);

  // Merge cells for 'Deduction'
  worksheet['!merges'] = [
    // Top Header Merges (rows 0–2)
    { s: { r: 0, c: 0 }, e: { r: 0, c: 17 } }, // Company Name
    { s: { r: 1, c: 0 }, e: { r: 1, c: 17 } }, // Company Address
    { s: { r: 2, c: 0 }, e: { r: 2, c: 17 } }, // Period

    // Deduction: col 9 to 12
    { s: { r: 4, c: 9 }, e: { r: 4, c: 12 } },

    // Merge rest of first row cells vertically where needed
    ...[0, 1, 2, 3, 4, 5, 6, 7, 8, 13, 14, 15, 16, 17, 18].map((col) => ({
      s: { r: 4, c: col },
      e: { r: 5, c: col },
    })),
  ];

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'New payroll Report');
  XLSX.writeFile(workbook, `${fileName}.xlsx`);
};

// New payroll report excel
export const handleExportDSLExcel = (
  // columns: Column<LNTRow>[],
  dsReportData: DSLReportRow[],
  fileName = 'DSLReportRow_Report',
  companyName = 'Purbanchal Security Consultants Pvt. Ltd.',
  companyAddress = 'Silpukhuri, Guwahati-03',
  periodStartDate?: string,
  periodEndDate?: string,
  totalNetPay?: number
) => {
  // Manually define column labels to match HTML layout
  const headersRow1 = [
    'Sl. No.',
    'Name',
    'Rank',
    'No. of Days',
    '8 Hours Pay',
    'Uniform',
    'House Rent',
    'Total',
    'Extra Duty',
    'Adv',
    'Deduction',
    '',
    '',
    '',
    '',
    'Total Deduction',
    'Net Pay',
    'Sign',
  ];

  const headersRow2 = [
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    'Employee EPF',
    'Employee ESI',
    'Employeer EPF',
    'Employeer ESI',
    'P.Tax',
    '',
    '',
    '',
  ];

  // Build the body rows
  const dataRows = dsReportData.map((row) => [
    row.slNo,
    row.empName,
    row.rank,
    row.days,
    toNumber(row.eightHourPay),
    toNumber(row.uniform),
    toNumber(row.hra),
    toNumber(row.total),
    toNumber(row.extraDuty),
    toNumber(row.adv),
    toNumber(row.deduction.empEPF),
    toNumber(row.deduction.empESI),
    toNumber(row.deduction.emplrEPF),
    toNumber(row.deduction.emplrESI),
    toNumber(row.deduction.pTax),
    toNumber(row.totalDeduction),
    toNumber(row.netPay),
    '',
  ]);

  // Add a total row
  const totalRow = [
    '',
    'Total',
    '',
    '', // First few non-numeric fields
    '',
    '',
    '',
    sumColumn(dsReportData.map((r) => r.total)),
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    sumColumn(dsReportData.map((r) => r.netPay)),
    '',
  ];

  const periodRow = [
    `Salary Report Period: ${periodStartDate} to ${periodEndDate}`,
  ];

  // Custom header rows
  const titleRow = [companyName];
  const addressRow = [companyAddress];
  const emptyRow = ['']; // spacer row
  const headerSpacing = ['', '', '', '', '', '', '', ''];

  // return row

  const rupeesRow = [
    `Rupees: ${numberToWords(parseFloat((totalNetPay ?? 0).toFixed(2)))}`,
  ];

  // return after disbursement
  const returnRow = [`Return after disbursement`];
  // incharge and date
  const inchargeAndDateRow = [
    `Incharge:.....................................  Date:...............`,
  ];

  // Custom footer row
  const footerRow = [
    'Note: This is a system-generated report. Please verify before processing payment.',
  ];

  // Combine all rows
  // const sheetData = [headersRow1, headersRow2, ...dataRows, totalRow];
  const sheetData = [
    titleRow,
    addressRow,
    periodRow,
    headerSpacing,
    headersRow1,
    headersRow2,
    ...dataRows,
    totalRow,
    emptyRow,
    rupeesRow,
    emptyRow,
    returnRow,
    emptyRow,
    inchargeAndDateRow,
    emptyRow,
    footerRow,
  ];

  // Create worksheet
  const worksheet = XLSX.utils.aoa_to_sheet(sheetData);

  // Merge cells for 'Deduction'
  worksheet['!merges'] = [
    // Top Header Merges (rows 0–2)
    { s: { r: 0, c: 0 }, e: { r: 0, c: 14 } }, // Company Name
    { s: { r: 1, c: 0 }, e: { r: 1, c: 14 } }, // Company Address
    { s: { r: 2, c: 0 }, e: { r: 2, c: 14 } }, // Period

    // Deduction: col 9 to 12
    { s: { r: 4, c: 10 }, e: { r: 4, c: 14 } },

    // Merge rest of first row cells vertically where needed
    ...[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 15, 16, 17, 18].map((col) => ({
      s: { r: 4, c: col },
      e: { r: 5, c: col },
    })),
  ];

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'DSL Report');
  XLSX.writeFile(workbook, `${fileName}.xlsx`);
};

// LnT report excel
export const handleExportLNTExcel = (
  // columns: Column<LNTRow>[],
  dsReportData: LNTRow[],
  fileName = 'LNT_Report',
  companyName = 'Purbanchal Security Consultants Pvt. Ltd.',
  companyAddress = 'Silpukhuri, Guwahati-03',
  periodStartDate?: string,
  periodEndDate?: string,
  totalNetPay?: number
) => {
  // Manually define column labels to match HTML layout
  const headersRow1 = [
    'Sl. No.',
    'Name',
    'Rank',
    'No. of Days',
    '8 Hours Pay',
    'Uniform',
    'Special Allowance',
    'Weekly Off',
    'Total',
    'Extra Duty',
    'Adv',
    'Deduction',
    // '',
    '',
    '',
    '', // Deduction's children
    '', // Deduction's children
    'Total Deduction',
    'Net Pay',
    'Sign',
  ];

  const headersRow2 = [
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    'Emp EPF',
    'Emp ESI',
    'Emplr EPF',
    'Emplr ESI',
    'PTax',
    '',
    '',
    '', // Remaining 2 columns
  ];

  // Build the body rows
  const dataRows = dsReportData.map((row) => [
    row.slNo,
    row.empName,
    row.rank,
    row.days,
    toNumber(row.eightHourPay),
    toNumber(row.uniform),
    toNumber(row.specialAllowance),
    toNumber(row.weeklyOff),
    toNumber(row.total),
    toNumber(row.extraDuty),
    toNumber(row.adv),
    toNumber(row.deduction.empEPF),
    toNumber(row.deduction.empESI),
    toNumber(row.deduction.emplrEPF),
    toNumber(row.deduction.emplrESI),
    toNumber(row.deduction.pTax),
    toNumber(row.totalDeduction),
    toNumber(row.netPay),
    row.sign ?? '',
  ]);

  // Add a total row
  const totalRow = [
    '',
    'Total',
    '',
    '', // First few non-numeric fields
    '',
    '',
    '',
    '',
    // sumColumn(dsReportData.reduce((sum, r) => sum + r.total, 0)),
    sumColumn(dsReportData.map((r) => r.total)),
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    sumColumn(dsReportData.map((r) => r.netPay)),
    // dsReportData.reduce((sum, r) => sum + r.netPay, 0),
    '', // Sign
  ];

  const periodRow = [
    `Salary Report Period: ${periodStartDate} to ${periodEndDate}`,
  ];

  // Custom header rows
  const titleRow = [companyName];
  const addressRow = [companyAddress];
  const emptyRow = ['']; // spacer row
  const headerSpacing = ['', '', '', '', '', '', '', ''];

  // return row

  const rupeesRow = [
    `Rupees: ${numberToWords(parseFloat((totalNetPay ?? 0).toFixed(2)))}`,
  ];

  // return after disbursement
  const returnRow = [`Return after disbursement`];
  // incharge and date
  const inchargeAndDateRow = [
    `Incharge:.....................................  Date:...............`,
  ];

  // Custom footer row
  const footerRow = [
    'Note: This is a system-generated report. Please verify before processing payment.',
  ];

  // Combine all rows
  // const sheetData = [headersRow1, headersRow2, ...dataRows, totalRow];
  const sheetData = [
    titleRow,
    addressRow,
    periodRow,
    headerSpacing,
    headersRow1,
    headersRow2,
    ...dataRows,
    totalRow,
    emptyRow,
    rupeesRow,
    emptyRow,
    returnRow,
    emptyRow,
    inchargeAndDateRow,
    emptyRow,
    footerRow,
  ];

  // Create worksheet
  const worksheet = XLSX.utils.aoa_to_sheet(sheetData);

  // Merge cells for 'Deduction'
  worksheet['!merges'] = [
    // Top Header Merges (rows 0–2)
    { s: { r: 0, c: 0 }, e: { r: 0, c: 20 } }, // Company Name
    { s: { r: 1, c: 0 }, e: { r: 1, c: 20 } }, // Company Address
    { s: { r: 2, c: 0 }, e: { r: 2, c: 20 } }, // Period

    {
      s: { r: 4, c: 11 }, // start: row 0, col 11 (Deduction)
      e: { r: 4, c: 15 }, // end:   row 0, col 14
    },
    // Merge rest of first row cells vertically where needed
    ...[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 16, 17, 18, 19].map((col) => ({
      s: { r: 4, c: col },
      e: { r: 5, c: col },
    })),
  ];

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'LNT Report');
  XLSX.writeFile(workbook, `${fileName}.xlsx`);
};

// New payroll report excel
export const handleExportOthersExcel = (
  // columns: Column<LNTRow>[],
  dsReportData: OthersReportRow[],
  fileName = 'OthersReportRow_Report',
  companyName = 'Purbanchal Security Consultants Pvt. Ltd.',
  companyAddress = 'Silpukhuri, Guwahati-03',
  periodStartDate?: string,
  periodEndDate?: string,
  totalNetPay?: number
) => {
  // Manually define column labels to match HTML layout
  const headersRow1 = [
    'Sl. No.',
    'Name',
    'Days',
    'Basic Pay',
    'Allowances',
    '',
    '',
    'Gross Pay',
    'Extra Duty',
    'Uniform',
    '4 Hour Pay',
    'Special Allowances',
    'Bonus',
    'Deduction',
    '',
    '',
    '',
    '',
    '',
    'Net Pay',
    'Sign',
  ];

  const headersRow2 = [
    '',
    '',
    '',
    '',
    'Kits/Washing',
    'City Allowances',
    'Conv/H.Rent',
    '',
    '',
    '',
    '',
    '',
    '',
    'ESI',
    'EPF',
    'Belt',
    'Adv',
    'P.Tax',
    'Uniform',
    '',
    '',
  ];

  // Build the body rows
  const dataRows = dsReportData.map((row) => [
    row.slNo,
    row.empName,
    row.days,
    toNumber(row.basicSalary),
    toNumber(row.allowance.kitAllowances),
    toNumber(row.allowance.cityAllowances),
    toNumber(row.allowance.convHra),
    toNumber(row.grossPay),
    toNumber(row.extraDuty),
    toNumber(row.uniform),
    toNumber(row.fourHourPay),
    toNumber(row.specialAllowance),
    toNumber(row.bonus),
    toNumber(row.deduction.empESI),
    toNumber(row.deduction.empEPF),
    toNumber(row.deduction.belt),
    toNumber(row.deduction.adv),
    toNumber(row.deduction.pTax),
    toNumber(row.deduction.Uniform),
    toNumber(row.netPay),
    '',
  ]);

  // Add a total row
  const totalRow = [
    '',
    'Total',
    '',
    '', // First few non-numeric fields
    '',
    '',
    '',
    sumColumn(dsReportData.map((r) => r.grossPay)),
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    sumColumn(dsReportData.map((r) => r.netPay)),
    '',
  ];

  const periodRow = [
    `Salary Report Period: ${periodStartDate} to ${periodEndDate}`,
  ];

  // Custom header rows
  const titleRow = [companyName];
  const addressRow = [companyAddress];
  const emptyRow = ['']; // spacer row
  const headerSpacing = ['', '', '', '', '', '', '', ''];

  // return row

  const rupeesRow = [
    `Rupees: ${numberToWords(parseFloat((totalNetPay ?? 0).toFixed(2)))}`,
  ];

  // return after disbursement
  const returnRow = [`Return after disbursement`];
  // incharge and date
  const inchargeAndDateRow = [
    `Incharge:.....................................  Date:...............`,
  ];

  // Custom footer row
  const footerRow = [
    'Note: This is a system-generated report. Please verify before processing payment.',
  ];

  // Combine all rows
  // const sheetData = [headersRow1, headersRow2, ...dataRows, totalRow];
  const sheetData = [
    titleRow,
    addressRow,
    periodRow,
    headerSpacing,
    headersRow1,
    headersRow2,
    ...dataRows,
    totalRow,
    emptyRow,
    rupeesRow,
    emptyRow,
    returnRow,
    emptyRow,
    inchargeAndDateRow,
    emptyRow,
    footerRow,
  ];

  // Create worksheet
  const worksheet = XLSX.utils.aoa_to_sheet(sheetData);

  worksheet['!merges'] = [
    // Top Header Merges (rows 0–2)
    { s: { r: 0, c: 0 }, e: { r: 0, c: 20 } }, // Company Name
    { s: { r: 1, c: 0 }, e: { r: 1, c: 20 } }, // Company Address
    { s: { r: 2, c: 0 }, e: { r: 2, c: 20 } }, // Period

    // Table Header Merges (starting from row 4)
    { s: { r: 4, c: 4 }, e: { r: 4, c: 6 } }, // Allowances (Kits/Washing to Conv/H.Rent)
    { s: { r: 4, c: 13 }, e: { r: 4, c: 18 } }, // Deduction (ESI to Uniform)

    ...[0, 1, 2, 3, 7, 8, 9, 10, 11, 12, 19, 20].map((col) => ({
      s: { r: 4, c: col },
      e: { r: 5, c: col },
    })),
  ];

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Others Report');
  XLSX.writeFile(workbook, `${fileName}.xlsx`);
};

// type 2 reports

// EsI report excel
export const handleExportEsIExcel = (
  // columns: Column<LNTRow>[],
  dsReportData: ESIRow[],
  fileName = 'ESIRow_Report',
  companyName = 'Purbanchal Security Consultants Pvt. Ltd.',
  companyAddress = 'Silpukhuri, Guwahati-03',
  periodStartDate?: string,
  periodEndDate?: string,
  totalNetPay?: number
) => {
  // Manually define column labels to match HTML layout
  const headersRow1 = [
    'Sl. No.',
    'ESI. No.',
    'Name',
    'No. of Days',
    'Gross Pay',
    'Employees Contribution',
    'Employers Contribution',
    'Total',
    'Sign',
  ];

  // Build the body rows
  const dataRows = dsReportData.map((row) => [
    row.slNo,
    row.accNo,
    row.empName,
    row.days,
    toNumber(row.grossPay),
    toNumber(row.empESI),
    toNumber(row.emplrESI),
    toNumber(row.total),
    '',
  ]);

  // Add a total row
  const totalRow = [
    '',
    'Total',
    '',
    '', // First few non-numeric fields
    sumColumn(dsReportData.map((r) => r.grossPay)),
    '',
    '',
    sumColumn(dsReportData.map((r) => r.total)),
    '',
  ];

  const periodRow = [
    `Salary Report Period: ${periodStartDate} to ${periodEndDate}`,
  ];

  // Custom header rows
  const titleRow = [companyName];
  const addressRow = [companyAddress];
  const emptyRow = ['']; // spacer row
  const headerSpacing = ['', '', '', '', '', '', '', ''];

  // return row

  const rupeesRow = [
    `Rupees: ${numberToWords(parseFloat((totalNetPay ?? 0).toFixed(2)))}`,
  ];

  // return after disbursement
  const returnRow = [`Return after disbursement`];
  // incharge and date
  const inchargeAndDateRow = [
    `Incharge:.....................................  Date:...............`,
  ];

  // Custom footer row
  const footerRow = [
    'Note: This is a system-generated report. Please verify before processing payment.',
  ];

  // Combine all rows
  // const sheetData = [headersRow1, ...dataRows, totalRow];
  const sheetData = [
    titleRow,
    addressRow,
    periodRow,
    // emptyRow,
    headerSpacing,
    headersRow1,
    ...dataRows,
    totalRow,
    emptyRow,
    rupeesRow,
    emptyRow,
    returnRow,
    emptyRow,
    inchargeAndDateRow,
    emptyRow,
    footerRow,
  ];

  // Create worksheet
  const worksheet = XLSX.utils.aoa_to_sheet(sheetData);

  // Optional: merge cells for company name, address, etc.
  worksheet['!merges'] = [
    { s: { r: 0, c: 0 }, e: { r: 0, c: 7 } }, // company name
    { s: { r: 1, c: 0 }, e: { r: 1, c: 7 } }, // address
    { s: { r: 2, c: 0 }, e: { r: 2, c: 7 } }, // period
    {
      s: { r: dataRows.length + 6, c: 0 },
      e: { r: dataRows.length + 6, c: 7 },
    }, // footer note
  ];

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'ESI Report');
  XLSX.writeFile(workbook, `${fileName}.xlsx`);
};
// EPF report excel
export const handleExportEPFExcel = (
  // columns: Column<LNTRow>[],
  dsReportData: EPFRow[],
  fileName = 'EPFRow_Report',
  companyName = 'Purbanchal Security Consultants Pvt. Ltd.',
  companyAddress = 'Silpukhuri, Guwahati-03',
  periodStartDate?: string,
  periodEndDate?: string,
  totalNetPay?: number
) => {
  // Manually define column labels to match HTML layout
  const headersRow1 = [
    'Sl. No.',
    'Account No.',
    'Name',
    'Days',
    'Basic Salary',
    'Employees Contribution',
    'Employers Contribution',
    'Total',
    'Sign',
  ];

  // Build the body rows
  const dataRows = dsReportData.map((row) => [
    row.slNo,
    row.accNo,
    row.empName,
    row.days,
    toNumber(row.basicSalary),
    toNumber(row.empEPF),
    toNumber(row.emplrEPF),
    toNumber(row.total),
    '',
  ]);

  // Add a total row
  const totalRow = [
    '',
    'Total',
    '',
    '', // First few non-numeric fields
    sumColumn(dsReportData.map((r) => r.basicSalary)),
    '',
    '',
    sumColumn(dsReportData.map((r) => r.total)),
    '',
  ];

  const periodRow = [
    `Salary Report Period: ${periodStartDate} to ${periodEndDate}`,
  ];

  // Custom header rows
  const titleRow = [companyName];
  const addressRow = [companyAddress];
  const emptyRow = ['']; // spacer row
  const headerSpacing = ['', '', '', '', '', '', '', ''];

  // return row

  const rupeesRow = [
    `Rupees: ${numberToWords(parseFloat((totalNetPay ?? 0).toFixed(2)))}`,
  ];

  // return after disbursement
  const returnRow = [`Return after disbursement`];
  // incharge and date
  const inchargeAndDateRow = [
    `Incharge:.....................................  Date:...............`,
  ];

  // Custom footer row
  const footerRow = [
    'Note: This is a system-generated report. Please verify before processing payment.',
  ];

  // Combine all rows
  // const sheetData = [headersRow1, ...dataRows, totalRow];
  const sheetData = [
    titleRow,
    addressRow,
    periodRow,
    // emptyRow,
    headerSpacing,
    headersRow1,
    ...dataRows,
    totalRow,
    emptyRow,
    rupeesRow,
    emptyRow,
    returnRow,
    emptyRow,
    inchargeAndDateRow,
    emptyRow,
    footerRow,
  ];

  // Create worksheet
  const worksheet = XLSX.utils.aoa_to_sheet(sheetData);

  // Optional: merge cells for company name, address, etc.
  worksheet['!merges'] = [
    { s: { r: 0, c: 0 }, e: { r: 0, c: 7 } }, // company name
    { s: { r: 1, c: 0 }, e: { r: 1, c: 7 } }, // address
    { s: { r: 2, c: 0 }, e: { r: 2, c: 7 } }, // period
    {
      s: { r: dataRows.length + 6, c: 0 },
      e: { r: dataRows.length + 6, c: 7 },
    }, // footer note
  ];

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'EPF Report');
  XLSX.writeFile(workbook, `${fileName}.xlsx`);
};

// PTax report excel
export const handleExportPTaxExcel = (
  // columns: Column<LNTRow>[],
  dsReportData: PTaxRow[],
  fileName = 'PTaxRow_Report',
  companyName = 'Purbanchal Security Consultants Pvt. Ltd.',
  companyAddress = 'Silpukhuri, Guwahati-03',
  periodStartDate?: string,
  periodEndDate?: string,
  totalNetPay?: number
) => {
  // Manually define column labels to match HTML layout
  const headersRow1 = [
    'Sl. No.',
    'Employee Name',
    'Post',
    'Basic Salary',
    'Professional Tax',
    'Sign',
  ];

  // Build the body rows
  const dataRows = dsReportData.map((row) => [
    row.slNo,
    row.empName,
    row.postName,
    toNumber(row.basicSalary),
    toNumber(row.pTax),
    '',
  ]);

  // Add a total row
  const totalRow = [
    '',
    'Total',
    '',
    sumColumn(dsReportData.map((r) => r.basicSalary)),
    sumColumn(dsReportData.map((r) => r.pTax)),
    '',
  ];

  const periodRow = [
    `Salary Report Period: ${periodStartDate} to ${periodEndDate}`,
  ];

  // Custom header rows
  const titleRow = [companyName];
  const addressRow = [companyAddress];
  const emptyRow = ['']; // spacer row
  const headerSpacing = ['', '', '', '', '', '', '', ''];

  // return row

  const rupeesRow = [
    `Rupees: ${numberToWords(parseFloat((totalNetPay ?? 0).toFixed(2)))}`,
  ];

  // return after disbursement
  const returnRow = [`Return after disbursement`];
  // incharge and date
  const inchargeAndDateRow = [
    `Incharge:.....................................  Date:...............`,
  ];

  // Custom footer row
  const footerRow = [
    'Note: This is a system-generated report. Please verify before processing payment.',
  ];

  // Combine all rows
  // const sheetData = [headersRow1, ...dataRows, totalRow];
  const sheetData = [
    titleRow,
    addressRow,
    periodRow,
    // emptyRow,
    headerSpacing,
    headersRow1,
    ...dataRows,
    totalRow,
    emptyRow,
    rupeesRow,
    emptyRow,
    returnRow,
    emptyRow,
    inchargeAndDateRow,
    emptyRow,
    footerRow,
  ];

  // Create worksheet
  const worksheet = XLSX.utils.aoa_to_sheet(sheetData);

  // Optional: merge cells for company name, address, etc.
  worksheet['!merges'] = [
    { s: { r: 0, c: 0 }, e: { r: 0, c: 7 } }, // company name
    { s: { r: 1, c: 0 }, e: { r: 1, c: 7 } }, // address
    { s: { r: 2, c: 0 }, e: { r: 2, c: 7 } }, // period
    {
      s: { r: dataRows.length + 6, c: 0 },
      e: { r: dataRows.length + 6, c: 7 },
    }, // footer note
  ];

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'PTax Report');
  XLSX.writeFile(workbook, `${fileName}.xlsx`);
};

// PTax report excel
export const handleExportSalaryExcel = (
  // columns: Column<LNTRow>[],
  dsReportData: SalaryRow[],
  fileName = 'SalaryRow_Report',
  companyName = 'Purbanchal Security Consultants Pvt. Ltd.',
  companyAddress = 'Silpukhuri, Guwahati-03',
  periodStartDate?: string,
  periodEndDate?: string,
  totalNetPay?: number
) => {
  // Manually define column labels to match HTML layout
  const headersRow1 = [
    'Sl. No.',
    'Employee Name',
    'Account No.',
    'IFSC',
    'Bank Name',
    'Net Pay',
    'Post Name',
    'Sign',
  ];

  // Build the body rows
  const dataRows = dsReportData.map((row) => [
    row.slNo,
    row.empName,
    toNumber(row.accountNum),
    row.ifsc,
    row.bankName,
    toNumber(row.netPay),
    row.postName,
    '',
  ]);

  // Add a total row
  const totalRow = [
    '',
    'Total',
    '',
    '',
    '',
    sumColumn(dsReportData.map((r) => r.netPay)),
    '',
    '',
  ];

  const periodRow = [
    `Salary Report Period: ${periodStartDate} to ${periodEndDate}`,
  ];

  // Custom header rows
  const titleRow = [companyName];
  const addressRow = [companyAddress];
  const emptyRow = ['']; // spacer row
  const headerSpacing = ['', '', '', '', '', '', '', ''];

  // return row

  const rupeesRow = [
    `Rupees: ${numberToWords(parseFloat((totalNetPay ?? 0).toFixed(2)))}`,
  ];

  // return after disbursement
  const returnRow = [`Return after disbursement`];
  // incharge and date
  const inchargeAndDateRow = [
    `Incharge:.....................................  Date:...............`,
  ];

  // Custom footer row
  const footerRow = [
    'Note: This is a system-generated report. Please verify before processing payment.',
  ];

  // Combine all rows
  // const sheetData = [headersRow1, ...dataRows, totalRow];
  const sheetData = [
    titleRow,
    addressRow,
    periodRow,
    // emptyRow,
    headerSpacing,
    headersRow1,
    ...dataRows,
    totalRow,
    emptyRow,
    rupeesRow,
    emptyRow,
    returnRow,
    emptyRow,
    inchargeAndDateRow,
    emptyRow,
    footerRow,
  ];

  // Create worksheet
  const worksheet = XLSX.utils.aoa_to_sheet(sheetData);

  // Optional: merge cells for company name, address, etc.
  worksheet['!merges'] = [
    { s: { r: 0, c: 0 }, e: { r: 0, c: 7 } }, // company name
    { s: { r: 1, c: 0 }, e: { r: 1, c: 7 } }, // address
    { s: { r: 2, c: 0 }, e: { r: 2, c: 7 } }, // period
    {
      s: { r: dataRows.length + 6, c: 0 },
      e: { r: dataRows.length + 6, c: 7 },
    }, // footer note
  ];

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Salary Report');
  XLSX.writeFile(workbook, `${fileName}.xlsx`);
};
