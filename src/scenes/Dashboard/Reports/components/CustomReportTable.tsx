import React, { useEffect, useRef, useState } from 'react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
// import { CSVLink } from 'react-csv';
import ReportColumnSelector from './ReportColumnSelector';
import {
  DownloadIcon,
  PDFIcon,
  SaveIconBlackActive,
} from '../../../../assets/icons';

const CustomReportTable: React.FC = () => {
  const alwaysVisibleColumns = [
    'empName',
    'designation',
    'basicSalary',
    'grossPay',
    'empEPF',
    'empESI',
    'empPF',
    'empESIP',
    'netPay',
  ];
  // Define the initial state of visible columns

  const [visibleColumns, setVisibleColumns] = useState<string[]>([
    ...alwaysVisibleColumns,
  ]);

  // Define column data

  const columns = [
    { name: 'empName', label: 'Employee Name' },
    { name: 'designation', label: 'Rank' },
    { name: 'workingDays', label: 'Working Days' },
    { name: 'basicSalary', label: 'Basic Salary' },
    { name: 'uniform', label: 'Uniform' },
    { name: 'bonus', label: 'Bonus' },
    { name: 'grossPay', label: 'Gross Pay / Total' },
    { name: 'extraDuty', label: 'Extra Duty' },
    { name: 'empEPF', label: 'Employee EPF' },
    { name: 'empESI', label: 'Employee ESI' },
    { name: 'empPF', label: 'Employer EPF' },
    { name: 'empESIP', label: 'Employer ESI' },
    { name: 'pTax', label: 'P. Tax' },
    { name: 'otherDeduction', label: 'Other Deduction' },
    { name: 'totalDeduction', label: 'Total Deduction' },
    { name: 'netPay', label: 'Net Pay' },
  ];

  // Sample row data (you can replace it with dynamic data)
  const rowData = [
    {
      empName: 'John Doe',
      designation: 'Manager',
      workingDays: 25,
      basicSalary: '5000',
      uniform: '150',
      bonus: '500',
      grossPay: '5650',
      extraDuty: '200',
      empEPF: '300',
      empESI: '50',
      empPF: '600',
      empESIP: '100',
      pTax: '50',
      otherDeduction: '100',
      totalDeduction: '1200',
      netPay: '4450',
    },
    {
      empName: 'Jane Smith',
      designation: 'Assistant Manager',
      workingDays: 22,
      basicSalary: '4000',
      uniform: '120',
      bonus: '400',
      grossPay: '4520',
      extraDuty: '150',
      empEPF: '250',
      empESI: '40',
      empPF: '500',
      empESIP: '80',
      pTax: '40',
      otherDeduction: '90',
      totalDeduction: '1000',
      netPay: '3520',
    },
  ];

  // Check if all columns are selected
  const areAllColsSelected = visibleColumns.length === columns.length;

  // Handle column updates based on the selection
  // const updateColumns = (column: string) => {
  //   if (column === 'all') {
  //     if (areAllColsSelected) {
  //       setVisibleColumns(['designation', 'basicSalary']); // Reset to default selected
  //     } else {
  //       // Select all available columns
  //       setVisibleColumns([
  //         'empName',
  //         'designation',
  //         'workingDays',
  //         'basicSalary',
  //         'uniform',
  //         'bonus',
  //         'grossPay',
  //         'extraDuty',
  //         'empEPF',
  //         'empESI',
  //         'empPF',
  //         'empESIP',
  //         'pTax',
  //         'otherDeduction',
  //         'totalDeduction',
  //         'netPay',
  //       ]);
  //     }
  //   } else {
  //     setVisibleColumns((prevColumns) =>
  //       prevColumns.includes(column)
  //         ? prevColumns.filter((col) => col !== column)
  //         : [...prevColumns, column]
  //     );
  //   }
  // };
  // const updateColumns = (column: string) => {
  //   if (column === 'all') {
  //     setVisibleColumns(
  //       areAllColsSelected ? [] : columns.map((col) => col.name)
  //     );
  //   } else {
  //     setVisibleColumns((prevColumns) =>
  //       prevColumns.includes(column)
  //         ? prevColumns.filter((col) => col !== column)
  //         : [...prevColumns, column]
  //     );
  //   }
  // };
  const updateColumns = (column: string) => {
    if (column === 'all') {
      setVisibleColumns((prevColumns) =>
        prevColumns.length === columns.length
          ? alwaysVisibleColumns
          : columns.map((col) => col.name)
      );
    } else if (!alwaysVisibleColumns.includes(column)) {
      setVisibleColumns((prevColumns) =>
        prevColumns.includes(column)
          ? prevColumns.filter((col) => col !== column)
          : [...prevColumns, column]
      );
    }
  };

  // Calculate totals
  const totalGrossPay = rowData.reduce(
    (sum, row) => sum + parseFloat(row.grossPay),
    0
  );
  const totalNetPay = rowData.reduce(
    (sum, row) => sum + parseFloat(row.netPay),
    0
  );
  /////////////////////////////////////
  // options
  const [isOptionModalOpen, setIsOptionModalOpen] = useState(false);
  const optionModalRef = useRef<HTMLDivElement>(null);
  const handleToggleOptionModal = () => {
    setIsOptionModalOpen(!isOptionModalOpen);
    // console.log('Toggle option modal');
  };

  const handleCloseModal = () => {
    setIsOptionModalOpen(false);
  };

  // export pdf
  const handleExportPDF = () => {
    const doc = new jsPDF('landscape');

    autoTable(doc, {
      // head,
      // body,
      html: '#customReportTable',
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
        // Add more if needed for specific columns
      },
      didDrawPage: (data) => {
        doc.setFontSize(12);
        doc.text('Employee Report', data.settings.margin.left, 10);
      },
    });

    const date = new Date();
    const formattedDate = date.toLocaleDateString('en-GB').replace(/\//g, '-');
    const formattedTime = date.toLocaleTimeString('en-GB', {
      hour: '2-digit',
      minute: '2-digit',
    });

    doc.save(`Employee_Report_${formattedDate}_${formattedTime}.pdf`);
  };

  // csv

  // Function to format date and time
  // const formatCSVDate = () => {
  //   const date = new Date();
  //   const day = String(date.getDate()).padStart(2, '0');
  //   const month = String(date.getMonth() + 1).padStart(2, '0');
  //   const year = String(date.getFullYear()).slice(-2);

  //   let hours = date.getHours();
  //   const minutes = String(date.getMinutes()).padStart(2, '0');
  //   const ampm = hours >= 12 ? 'pm' : 'am';
  //   hours = hours % 12 || 12; // Convert to 12-hour format

  //   return `${day}-${month}-${year}, ${hours}:${minutes} ${ampm}`;
  // };
  // Define headers
  // const csvHeaders = [
  //   { name: 'slNo', label: 'Sl No.' },
  //   { name: 'empName', label: 'Employee Name' },
  //   { name: 'designation', label: 'Rank' },
  //   { name: 'workingDays', label: 'Working Days' },
  //   { name: 'basicSalary', label: 'Basic Salary' },
  //   { name: 'uniform', label: 'Uniform' },
  //   { name: 'bonus', label: 'Bonus' },
  //   { name: 'grossPay', label: 'Gross Pay / Total' },
  //   { name: 'extraDuty', label: 'Extra Duty' },
  //   { name: 'empEPF', label: 'Employee EPF' },
  //   { name: 'empESI', label: 'Employee ESI' },
  //   { name: 'empPF', label: 'Employer EPF' },
  //   { name: 'empESIP', label: 'Employer ESI' },
  //   { name: 'pTax', label: 'P. Tax' },
  //   { name: 'otherDeduction', label: 'Other Deduction' },
  //   { name: 'totalDeduction', label: 'Total Deduction' },
  //   { name: 'netPay', label: 'Net Pay' },
  //   { name: 'sign', label: 'Sign' },
  // ];
  // Prepare CSV data
  // const csvData = rowData.map((customReports) => ({
  //   empName: customReports.empName,
  //   designation: customReports.designation,
  //   workingDays: customReports.workingDays,
  //   basicSalary: customReports.basicSalary,
  //   uniform: customReports.uniform,
  //   bonus: customReports.bonus,
  //   grossPay: customReports.grossPay,
  //   extraDuty: customReports.extraDuty,
  //   empEPF: customReports.empEPF,
  //   empESI: customReports.empESI,
  //   empPF: customReports.empPF,
  //   empESIP: customReports.empESIP,
  //   pTax: customReports.pTax,
  //   otherDeduction: customReports.otherDeduction,
  //   totalDeduction: customReports.totalDeduction,
  //   netPay: customReports.netPay,
  // }));

  // const handleExportCSV = () => {
  //   console.log('Export as CSV clicked');
  //   handleCloseModal();
  // };
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        optionModalRef.current &&
        !optionModalRef.current.contains(event.target as Node)
      ) {
        handleCloseModal();
      }
    };

    if (isOptionModalOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOptionModalOpen]);

  return (
    <>
      <div className="mt-[3%] flex flex-col">
        <div className="flex-none">
          <div className="flex items-center justify-between px-10 border-t py-2">
            <div className="w-[10%]">
              <h2 className="text-primaryText text-xs lg:text-sm xl:text-base">
                Custom Report
              </h2>
            </div>
            <div className="">
              <h2>page 1</h2>
            </div>
            <div className="flex items-center justify-between w-[8%]">
              <ReportColumnSelector
                updateColumns={updateColumns}
                visibleColumns={visibleColumns}
                areAllColsSelected={areAllColsSelected}
              />
              <div>
                <button>
                  <img
                    src={SaveIconBlackActive}
                    alt="SaveIconBlackActive"
                    className="cursor-pointer w-6 h-6"
                  />
                </button>
              </div>
              <div className="relative">
                {/* download icon */}
                <button onClick={handleToggleOptionModal}>
                  <img
                    src={DownloadIcon}
                    alt="DownloadIcon"
                    className="cursor-pointer w-6 h-6"
                  />
                </button>
                {isOptionModalOpen && (
                  <div
                    ref={optionModalRef}
                    className="absolute z-30 top-10 right-0 w-48 bg-white  rounded shadow-lg  border border-tableBorder"
                  >
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsOptionModalOpen(false);
                        handleExportPDF();
                      }}
                      className="flex gap-2 items-center w-full px-4 py-2 primaryLabels text-secondaryText hover:bg-gray-100"
                    >
                      <img
                        src={PDFIcon}
                        alt="EditPencil_Icon"
                        className="w-4 h-4"
                      />
                      <span>Export as PDF</span>
                    </button>
                    {/* <CSVLink
                      data={csvData}
                      headers={csvHeaders}
                      filename={`ranksTable ${formatCSVDate()}.csv`}
                    >
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setIsOptionModalOpen(false);

                          handleExportCSV();
                        }}
                        className="flex gap-2 items-center w-full px-4 py-2 primaryLabels text-secondaryText hover:bg-gray-100"
                      >
                        <img
                          src={DownloadIcon}
                          alt="EditPencil_Icon"
                          className="w-4 h-4"
                        />
                        <span>Export as CSV</span>
                      </button>
                    </CSVLink> */}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className=" overflow-y-auto bg-white">
          {/* Custom report table */}
          <div className="overflow-x-auto mt-4 px-4">
            <table
              id="customReportTable"
              className="min-w-full border-collapse bg-white"
            >
              <thead className="sticky top-0 bg-white z-10">
                <tr>
                  <th className="p-4" colSpan={columns.length}>
                    {/* heading */}
                    <div className="flex flex-col items-center gap-4 py-6 px-4 w-full">
                      <div className="flex flex-col gap-1 items-center justify-center">
                        <h2 className="primaryHeadings font-bold text-primaryText">
                          Purbanchal Security Consultants Pvt. Ltd.
                        </h2>
                        <h3 className="primaryHeadings font-bold text-primaryText">
                          Silpukhuri, Guwahati-03
                        </h3>
                      </div>
                      <div className="flex justify-between items-center w-full">
                        <div className="flex items-center gap-4">
                          <h3 className="primaryHeadings text-primaryText">
                            Pay Roll of Staff Deployed at
                          </h3>
                          <h3 className="primaryHeadings font-bold text-primaryText uppercase">
                            assam enterprise llp
                          </h3>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-4">
                            <h3>For the period from:</h3>
                            <h3>01/ 04 /2024</h3>
                          </div>
                          <div className="flex items-center gap-4">
                            <h3>To:</h3>
                            <h3>30/ 04 /2024</h3>
                          </div>
                        </div>
                      </div>
                    </div>
                  </th>
                </tr>
                <tr>
                  <th
                    className="border-2 border-primaryText px-4 py-2 text-center"
                    rowSpan={2}
                  >
                    Sl. No.
                  </th>
                  <th
                    className="border-2 border-primaryText px-4 py-2 text-center"
                    colSpan={2}
                  >
                    Emp Details
                  </th>
                  {visibleColumns.includes('workingDays') && (
                    <th
                      className="border-2 border-primaryText px-4 py-2 text-center"
                      rowSpan={2}
                    >
                      Working Days
                    </th>
                  )}

                  {visibleColumns.includes('basicSalary') && (
                    <th
                      className="border-2 border-primaryText px-4 py-2 text-center"
                      rowSpan={2}
                    >
                      Basic Salary
                    </th>
                  )}

                  {visibleColumns.includes('uniform') && (
                    <th
                      className="border-2 border-primaryText px-4 py-2 text-center"
                      rowSpan={2}
                    >
                      Uniform
                    </th>
                  )}

                  {visibleColumns.includes('bonus') && (
                    <th
                      className="border-2 border-primaryText px-4 py-2 text-center"
                      rowSpan={2}
                    >
                      Bonus
                    </th>
                  )}

                  {visibleColumns.includes('grossPay') && (
                    <th
                      className="border-2 border-primaryText px-4 py-2 text-center"
                      rowSpan={2}
                    >
                      Gross Pay / Total
                    </th>
                  )}

                  {visibleColumns.includes('extraDuty') && (
                    <th
                      className="border-2 border-primaryText px-4 py-2 text-center"
                      rowSpan={2}
                    >
                      Extra Duty
                    </th>
                  )}

                  <th
                    className="border-2 border-primaryText px-4 py-2 text-center"
                    colSpan={4}
                  >
                    Deduction
                  </th>
                  {visibleColumns.includes('pTax') && (
                    <th
                      className="border-2 border-primaryText px-4 py-2 text-center"
                      rowSpan={2}
                    >
                      P. Tax
                    </th>
                  )}

                  {visibleColumns.includes('otherDeduction') && (
                    <th
                      className="border-2 border-primaryText px-4 py-2 text-center"
                      rowSpan={2}
                    >
                      Other Deduction
                    </th>
                  )}

                  {visibleColumns.includes('totalDeduction') && (
                    <th
                      className="border-2 border-primaryText px-4 py-2 text-center"
                      rowSpan={2}
                    >
                      Total Deduction
                    </th>
                  )}

                  {visibleColumns.includes('netPay') && (
                    <th
                      className="border-2 border-primaryText px-4 py-2 text-center"
                      rowSpan={2}
                    >
                      Net Pay
                    </th>
                  )}

                  <th
                    className="border-2 border-primaryText px-4 py-2 text-center"
                    rowSpan={2}
                  >
                    Sign
                  </th>
                </tr>
                <tr>
                  {visibleColumns.includes('empName') && (
                    <th className="border-2 border-primaryText px-4 py-2 text-center">
                      Emp Name
                    </th>
                  )}

                  {visibleColumns.includes('designation') && (
                    <th className="border-2 border-primaryText px-4 py-2 text-center">
                      Rank
                    </th>
                  )}

                  {visibleColumns.includes('empEPF') && (
                    <th className="border-2 border-primaryText px-4 py-2 text-center">
                      Employee EPF
                    </th>
                  )}

                  {visibleColumns.includes('empESI') && (
                    <th className="border-2 border-primaryText px-4 py-2 text-center">
                      Employee ESI
                    </th>
                  )}
                  {visibleColumns.includes('empPF') && (
                    <th className="border-2 border-primaryText px-4 py-2 text-center">
                      Employer EPF
                    </th>
                  )}
                  {visibleColumns.includes('empESIP') && (
                    <th className="border-2 border-primaryText px-4 py-2 text-center">
                      Employer ESI
                    </th>
                  )}
                </tr>
              </thead>
              <tbody>
                {/* {rowData.map((row, rowIndex) => (
                  <tr key={rowIndex}>
                    <td className="border-b border-dotted border-primaryText px-4 py-2">
                      {rowIndex + 1}
                    </td>
                    <td className="border-b border-dotted border-primaryText px-4 py-2">
                      {row.empName}
                    </td>
                    <td className="border-b border-dotted border-primaryText px-4 py-2">
                      {row.designation}
                    </td>
                    <td className="border-b border-dotted border-primaryText px-4 py-2">
                      {row.workingDays}
                    </td>
                    <td className="border-b border-dotted border-primaryText px-4 py-2">
                      {row.basicSalary}
                    </td>
                    <td className="border-b border-dotted border-primaryText px-4 py-2">
                      {row.uniform}
                    </td>
                    <td className="border-b border-dotted border-primaryText px-4 py-2">
                      {row.bonus}
                    </td>
                    <td className="border-b border-dotted border-primaryText px-4 py-2">
                      {row.grossPay}
                    </td>
                    <td className="border-b border-dotted border-primaryText px-4 py-2">
                      {row.extraDuty}
                    </td>
                    <td className="border-b border-dotted border-primaryText px-4 py-2">
                      {row.empEPF}
                    </td>
                    <td className="border-b border-dotted border-primaryText px-4 py-2">
                      {row.empESI}
                    </td>
                    <td className="border-b border-dotted border-primaryText px-4 py-2">
                      {row.empPF}
                    </td>
                    <td className="border-b border-dotted border-primaryText px-4 py-2">
                      {row.empESIP}
                    </td>
                    <td className="border-b border-dotted border-primaryText px-4 py-2">
                      {row.pTax}
                    </td>
                    <td className="border-b border-dotted border-primaryText px-4 py-2">
                      {row.otherDeduction}
                    </td>
                    <td className="border-b border-dotted border-primaryText px-4 py-2">
                      {row.totalDeduction}
                    </td>
                    <td className="border-b border-dotted border-primaryText px-4 py-2">
                      {row.netPay}
                    </td>
                    <td className="border-b border-dotted border-primaryText px-4 py-2"></td>
                  </tr>
                ))} */}
                {rowData.map((row, rowIndex) => (
                  <tr key={rowIndex} className="text-center">
                    <td className="border-b border-dotted border-primaryText px-4 py-2">
                      {rowIndex + 1}
                    </td>
                    {columns
                      .filter((col) => visibleColumns.includes(col.name))
                      .map((col) => (
                        <td
                          key={col.name}
                          className="border-b border-dotted border-primaryText px-4 py-2"
                        >
                          {row[col.name as keyof typeof row]}
                        </td>
                      ))}
                    <td className="border-b border-dotted border-primaryText px-4 py-2"></td>
                  </tr>
                ))}
                <tr className="mt-4">
                  <td className="border-t-2 border-primaryText px-4 py-2 font-bold text-center">
                    Total
                  </td>
                  <td className="border-t-2 border-primaryText px-4 py-2 font-bold"></td>
                  <td className="border-t-2 border-primaryText px-4 py-2 font-bold"></td>
                  <td className="border-t-2 border-primaryText px-4 py-2 font-bold"></td>
                  <td className="border-t-2 border-primaryText px-4 py-2 font-bold text-center">
                    {totalGrossPay.toFixed(2)}
                  </td>
                  <td className="border-t-2 border-primaryText px-4 py-2 font-bold"></td>
                  <td className="border-t-2 border-primaryText px-4 py-2 font-bold"></td>
                  <td className="border-t-2 border-primaryText px-4 py-2 font-bold"></td>
                  <td className="border-t-2 border-primaryText px-4 py-2 font-bold"></td>
                  {/* <td className="border-t-2 border-primaryText px-4 py-2 font-bold"></td> */}

                  <td className="border-t-2 border-primaryText px-4 py-2 font-bold text-center">
                    {totalNetPay.toFixed(2)}
                  </td>
                  <td className="border-t-2 border-primaryText px-4 py-2"></td>
                </tr>
              </tbody>
              {/* Footer section inside tfoot */}
              <tfoot>
                <tr>
                  <td colSpan={columns.length} className="p-4">
                    <div className="flex flex-col gap-4 items-center justify-center py-4">
                      <div className="flex items-center gap-4">
                        <h2 className="text-primaryText primaryLabels">
                          Rupees:
                        </h2>
                        <h3 className="text-primaryText primaryLabels uppercase">
                          fifty six thousand eight hundred seventy nine only
                        </h3>
                      </div>
                      <h2 className="text-primaryText primaryLabels">
                        Return after disbursement
                      </h2>
                      <div className="flex items-center gap-4">
                        <h2 className="text-primaryText primaryLabels">
                          Incharge:......................
                        </h2>
                        <h3 className="text-primaryText primaryLabels">
                          Date:..........................
                        </h3>
                      </div>
                    </div>
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

export default CustomReportTable;
