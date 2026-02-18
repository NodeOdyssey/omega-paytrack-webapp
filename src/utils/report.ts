export const getDsReportPushRowsAndBreaksNeeded = (
  dataLength: number,
  printRowsPerPage: number
) => {
  let pushRows = 0;
  let breaksNeeded = 0;

  const remainder = dataLength % printRowsPerPage;

  switch (remainder) {
    case 0:
      pushRows = 1;
      breaksNeeded = 2;
      break;
    case 1:
    case 2:
    case 3:
    case 4:
    case 5:
    case 6:
    case 7:
      pushRows = 0;
      breaksNeeded = 0;
      break;
    case 8:
      pushRows = 1;
      breaksNeeded = 4;
      break;
    default:
      pushRows = 0;
      breaksNeeded = 0;
      break;
  }
  return { pushRows, breaksNeeded };
};

export const getWithoutAllowanceReportPushRowsAndBreaksNeeded = (
  dataLength: number,
  printRowsPerPage: number
) => {
  let pushRows = 0;
  let breaksNeeded = 0;

  const remainder = dataLength % printRowsPerPage;

  switch (remainder) {
    case 0:
      pushRows = 1;
      breaksNeeded = 3;
      break;
    case 1:
    case 2:
    case 3:
    case 4:
    case 5:
    case 6:
    case 7:
      pushRows = 0;
      breaksNeeded = 0;
      break;
    case 8:
      pushRows = 1;
      breaksNeeded = 6;
      break;
    default:
      pushRows = 0;
      breaksNeeded = 0;
      break;
  }
  return { pushRows, breaksNeeded };
};

export const getOthersReportPushRowsAndBreaksNeeded = (
  dataLength: number,
  printRowsPerPage: number
) => {
  let pushRows = 0;
  let breaksNeeded = 0;

  const remainder = dataLength % printRowsPerPage;

  switch (remainder) {
    case 0:
      pushRows = 1;
      breaksNeeded = 3;
      break;
    case 1:
    case 2:
    case 3:
    case 4:
    case 5:
    case 6:
    case 7:
      pushRows = 0;
      breaksNeeded = 0;
      break;
    case 8:
      pushRows = 1;
      breaksNeeded = 5;
      break;
    default:
      pushRows = 0;
      breaksNeeded = 0;
      break;
  }
  return { pushRows, breaksNeeded };
};

export const getNewPayrollPushRowsAndBreaksNeeded = (
  dataLength: number,
  printRowsPerPage: number
) => {
  let pushRows = 0;
  let breaksNeeded = 0;

  const remainder = dataLength % printRowsPerPage;

  switch (remainder) {
    case 0:
      pushRows = 1;
      breaksNeeded = 2;
      break;
    case 1:
      pushRows = 1;
      breaksNeeded = 0;
      break;
    case 2:
    case 3:
    case 4:
    case 5:
    case 6:
    case 7:
    case 8:
    case 9:
      pushRows = 0;
      breaksNeeded = 0;
      break;
    case 10:
      pushRows = 1;
      breaksNeeded = 6;
      break;
    case 11:
      pushRows = 1;
      breaksNeeded = 3;
      break;
    default:
      pushRows = 0;
      breaksNeeded = 0;
  }
  return { pushRows, breaksNeeded };
};

export const getDslReportPushRowsAndBreaksNeeded = (
  dataLength: number,
  printRowsPerPage: number
) => {
  let pushRows = 0;
  let breaksNeeded = 0;

  const remainder = dataLength % printRowsPerPage;

  switch (remainder) {
    case 0:
      pushRows = 1;
      breaksNeeded = 2;
      break;
    case 1:
      pushRows = 1;
      breaksNeeded = 0;
      break;
    case 2:
    case 3:
    case 4:
    case 5:
    case 6:
    case 7:
    case 8:
    case 9:
      pushRows = 0;
      breaksNeeded = 0;
      break;
    case 10:
      pushRows = 1;
      breaksNeeded = 6;
      break;
    case 11:
      pushRows = 1;
      breaksNeeded = 3;
      break;
    default:
      pushRows = 0;
      breaksNeeded = 0;
  }
  return { pushRows, breaksNeeded };
};

export const getLntPushRowsAndBreaksNeeded = (
  dataLength: number,
  printRowsPerPage: number
) => {
  let pushRows = 0;
  let breaksNeeded = 0;

  const remainder = dataLength % printRowsPerPage;

  switch (remainder) {
    case 0:
      pushRows = 1;
      breaksNeeded = 2;
      break;
    case 1:
      pushRows = 1;
      breaksNeeded = 0;
      break;
    case 2:
    case 3:
    case 4:
    case 5:
    case 6:
    case 7:
    case 8:
    case 9:
    case 10:
      pushRows = 0;
      breaksNeeded = 0;
      break;
    case 11:
      pushRows = 1;
      breaksNeeded = 5;
      break;
    case 12:
      pushRows = 1;
      breaksNeeded = 4;
      break;
    default:
      pushRows = 0;
      breaksNeeded = 0;
  }
  return { pushRows, breaksNeeded };
};

export const getEpfReportPushRowsAndBreaksNeeded = (
  dataLength: number,
  printRowsPerPage: number
) => {
  let pushRows = 1;
  let breaksNeeded = 3;

  const remainder = dataLength % printRowsPerPage;

  switch (remainder) {
    case 0:
      pushRows = 1;
      breaksNeeded = 1;
      break;
    case 1:
      pushRows = 1;
      breaksNeeded = 0;
      break;
    case 2:
    case 3:
    case 4:
    case 5:
    case 6:
    case 7:
    case 8:
    case 9:
    case 10:
    case 11:
    case 12:
    case 13:
    case 14:
    case 15:
    case 16:
    case 17:
    case 18:
    case 19:
    case 20:
    case 21:
    case 22:
    case 23:
    case 24:
    case 25:
    case 26:
    case 27:
    case 28:
    case 29:
    case 30:
    case 31:
      pushRows = 0;
      breaksNeeded = 0;
      break;
    case 32:
      pushRows = 1;
      breaksNeeded = 5;
      break;
    case 33:
      pushRows = 1;
      breaksNeeded = 4;
      break;
    case 34:
      pushRows = 1;
      breaksNeeded = 3;
      break;
    case 35:
      pushRows = 1;
      breaksNeeded = 2;
      break;
    default:
      pushRows = 0;
      breaksNeeded = 0;
  }
  return { pushRows, breaksNeeded };
};

export const getEsiReportPushRowsAndBreaksNeeded = (
  dataLength: number,
  printRowsPerPage: number
) => {
  let pushRows = 0;
  let breaksNeeded = 0;

  const remainder = dataLength % printRowsPerPage;

  switch (remainder) {
    case 0:
      pushRows = 1;
      breaksNeeded = 1;
      break;
    case 1:
      pushRows = 1;
      breaksNeeded = 0;
      break;
    case 2:
    case 3:
    case 4:
    case 5:
    case 6:
    case 7:
    case 8:
    case 9:
    case 10:
    case 11:
    case 12:
    case 13:
    case 14:
    case 15:
    case 16:
    case 17:
    case 18:
    case 19:
    case 20:
    case 21:
    case 22:
    case 23:
    case 24:
    case 25:
    case 26:
    case 27:
    case 28:
    case 29:
    case 30:
    case 31:
      pushRows = 0;
      breaksNeeded = 0;
      break;
    case 32:
      pushRows = 1;
      breaksNeeded = 5;
      break;
    case 33:
      pushRows = 1;
      breaksNeeded = 4;
      break;
    case 34:
      pushRows = 1;
      breaksNeeded = 3;
      break;
    case 35:
      pushRows = 1;
      breaksNeeded = 2;
      break;
    default:
      pushRows = 0;
      breaksNeeded = 0;
  }
  return { pushRows, breaksNeeded };
};

export const getPtaxReportPushRowsAndBreaksNeeded = (
  dataLength: number,
  printRowsPerPage: number
) => {
  let pushRows = 1;
  let breaksNeeded = 3;

  const remainder = dataLength % printRowsPerPage;

  switch (remainder) {
    case 0:
      pushRows = 1;
      breaksNeeded = 1;
      break;
    case 1:
      pushRows = 1;
      breaksNeeded = 0;
      break;
    case 2:
    case 3:
    case 4:
    case 5:
    case 6:
    case 7:
    case 8:
    case 9:
    case 10:
    case 11:
    case 12:
    case 13:
    case 14:
    case 15:
    case 16:
    case 17:
    case 18:
    case 19:
    case 20:
    case 21:
    case 22:
    case 23:
    case 24:
    case 25:
    case 26:
    case 27:
    case 28:
    case 29:
    case 30:
    case 31:
      pushRows = 0;
      breaksNeeded = 0;
      break;
    case 32:
      pushRows = 1;
      breaksNeeded = 5;
      break;
    case 33:
      pushRows = 1;
      breaksNeeded = 4;
      break;
    case 34:
      pushRows = 1;
      breaksNeeded = 3;
      break;
    case 35:
      pushRows = 1;
      breaksNeeded = 2;
      break;
    default:
      pushRows = 0;
      breaksNeeded = 0;
  }
  return { pushRows, breaksNeeded };
};

export const getSalaryReportPushRowsAndBreaksNeeded = (
  dataLength: number,
  printRowsPerPage: number
) => {
  let pushRows = 0;
  let breaksNeeded = 0;

  const remainder = dataLength % printRowsPerPage;

  // portrait mode
  // switch (remainder) {
  //   case 0:
  //   case 1:
  //   case 2:
  //   case 3:
  //   case 4:
  //   case 5:
  //   case 6:
  //   case 7:
  //   case 8:
  //   case 9:
  //   case 10:
  //   case 11:
  //   case 12:
  //   case 13:
  //   case 14:
  //   case 15:
  //   case 16:
  //   case 17:
  //   case 18:
  //   case 19:
  //   case 20:
  //   case 21:
  //   case 22:
  //   case 23:
  //   case 24:
  //   case 25:
  //   case 26:
  //   case 27:
  //   case 28:
  //   case 29:
  //   case 30:
  //     pushRows = 0;
  //     breaksNeeded = 0;
  //     break;
  //   case 31:
  //     pushRows = 1;
  //     breaksNeeded = 5;
  //     break;
  //   case 32:
  //     pushRows = 1;
  //     breaksNeeded = 4;
  //     break;
  //   case 33:
  //     pushRows = 1;
  //     breaksNeeded = 3;
  //     break;
  //   case 34:
  //     pushRows = 1;
  //     breaksNeeded = 2;
  //     break;
  //   default:
  //     pushRows = 0;
  //     breaksNeeded = 0;
  // }
  switch (remainder) {
    case 0:
      pushRows = 1;
      breaksNeeded = 1;
      break;
    case 1:
    case 2:
    case 3:
    case 4:
    case 5:
    case 6:
    case 7:
    case 8:
    case 9:
    case 10:
    case 11:
    case 12:
    case 13:
    case 14:
    case 15:
    case 16:
    case 17:
      pushRows = 0;
      breaksNeeded = 0;
      break;
    case 18:
      pushRows = 1;
      breaksNeeded = 6;
      break;
    case 19:
      pushRows = 1;
      breaksNeeded = 5;
      break;
    case 20:
      pushRows = 1;
      breaksNeeded = 4;
      break;
    case 21:
      pushRows = 1;
      breaksNeeded = 3;
      break;
    case 22:
      pushRows = 1;
      breaksNeeded = 2;
      break;
    default:
      pushRows = 0;
      breaksNeeded = 0;
  }
  return { pushRows, breaksNeeded };
};
