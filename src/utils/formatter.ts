import {
  DocExcelIcon,
  DocFileIcon,
  DocJpgIcon,
  DocPdfIcon,
  DocWordIcon,
  UploadIcon,
} from '../assets/icons';

// export const formatDateDdMmYyyySlash = (date: Date) => {
//   const d = new Date(date);
//   const day = String(d.getDate()).padStart(2, '0');
//   const month = String(d.getMonth() + 1).padStart(2, '0');
//   const year = d.getFullYear();
//   return `${day}/${month}/${year}`;
// };

/**
 * Format a date as DD/MM/YYYY with slashes.
 * @param {Date|string|null} date - The date to be formatted.
 * @returns {string} The formatted date string. If the date is null or invalid, returns '-'.
 */
export const formatDateDdMmYyyySlash = (
  date?: Date | string | null
): string => {
  // if (!date || isNaN(new Date(date).getTime())) return '-';
  if (!date) return '-';
  const d = new Date(date);
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
};

/**
 * Format a value as a string with 'Rs. ' prefixed and two decimal places.
 * @param {number|null|undefined} value - The value to be formatted.
 * @returns {string} The formatted value string. If the value is null, undefined or 0, returns '-'.
 */
export const formatValueRsFixedTwo = (value: number | null | undefined) => {
  if (value === null || value === undefined || value === 0) return '-';
  return `Rs. ${Number(value).toFixed(2)}`;
};

/**
 * Format a date as DD-MM-YYYY with dashes.
 * @param {Date} date - The date to be formatted.
 * @returns {string} The formatted date string. If the date is invalid, returns an empty string.
 */

export const getFormattedDateDdMmYyyyDash = (date: Date) => {
  if (!date) return '';
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
};

export const getFormattedDateYyyyMmDdDash = (date: Date) => {
  if (!date) return '';
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${year}-${month}-${day}`;
};

export const getFileIcon = (fileName: string | null) => {
  if (!fileName || fileName === '') return UploadIcon;
  const extension = fileName.split('.').pop()?.toLowerCase();
  switch (extension) {
    case 'pdf':
      return DocPdfIcon;
    case 'jpg':
    case 'jpeg':
      return DocJpgIcon;
    case 'doc':
    case 'docx':
      return DocWordIcon;
    case 'xls':
    case 'xlsx':
      return DocExcelIcon;
    default:
      return DocFileIcon;
  }
};

export const extractNameFromFileObj = (file: File | null) => {
  if (!file) return null;
  return file.name;
};

export const extractFileNameFromPath = (filePath: string | null) => {
  if (!filePath) return null;
  return filePath.split('\\').pop()?.split('/').pop();
};

export const formatDateToYMD = (dateString: string) => {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const getLabel = (fileName: string) => {
  switch (fileName) {
    case 'docContract':
      return 'Contract document';
    case 'docResume':
      return 'Resume document';
    case 'docPan':
      return 'Pan Card document';
    case 'docOther':
      return 'Others document';
    case 'docGst':
      return 'GST document';
    case 'docAadhaar':
      return 'Aadhaar document';
    case 'docAttendance':
      return 'Attendance document';
    default:
      return '';
  }
};

export const getDaysInMonth = (date: Date) => {
  const year = date.getFullYear();
  const month = date.getMonth();

  return new Date(year, month + 1, 0).getDate();
};

export const numberToWords = (num: number) => {
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
};
