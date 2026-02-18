// Libraries
import { Navigate, useRoutes } from 'react-router-dom';
import React, { useEffect } from 'react';

// Scenes
import { Auth } from './scenes/Auth/Auth';
import Dashboard from './scenes/Dashboard/Dashboard';
import Error404 from './scenes/Error/Error404';

// import DMSControlCustom from './scenes/DMSControl/DMSControlCustom';
// import DMSControlAuto from './scenes/DMSControl/DMSControlAuto';

import './App.css';
import SalaryReportTable from './scenes/Dashboard/Reports/components/TestingReport';
import { useAppStore } from './store/app';
// import DSReportTable from './scenes/Dashboard/Reports/components/ViewDSReport/components/DsReportTable';
// import 'react-datetime/css/react-datetime.css';
// import DSReportTable from './scenes/Dashboard/Reports/components/TestingDSReport';

const App = (): React.ReactElement => {
  const { initializeShowMenu } = useAppStore();
  useEffect(() => {
    initializeShowMenu();
  }, [initializeShowMenu]);
  const routes = useRoutes([
    // { path: 'dms-control', element: <DMSControlCustom /> },
    // { path: 'dms-control-auto', element: <DMSControlAuto /> },
    {
      path: 'paytrack',
      element: <Navigate to="/paytrack/home" />,
    },
    {
      path: 'paytrack/demo',
      element: <SalaryReportTable data={demoSalaryReportTableData} />,
    },
    {
      path: 'paytrack/viewds',
      // element: (
      //   <DSReportTable
      //     dsReportTotalGrossPay={1000}
      //     dsReportTotalNetPay={2000}
      //     periodEndDate="END"
      //     periodStartDate="START"
      //     tableData={demoDsReportTableData}
      //     selectedPostName={'POST NAME'}
      //   />
      // ),
    },
    { path: 'paytrack/auth/:action', element: <Auth /> },
    { path: 'paytrack/*', element: <Dashboard /> }, // Route for all dashboard related paths
    { path: '*', element: <Error404 /> }, // Catch-all for 404
  ]);

  return <section>{routes}</section>;
};

export default App;

// // Demo data and export remain unchanged
const demoSalaryReportTableData = Array(15)
  .fill(null)
  .map((_, i) => ({
    empName: `Employee ${i + 1}`,
    rank: 'Constable',
    days: 26,
    eightHourPay: 8000,
    vda: 1500,
    uniform: 500,
    hra: 2000,
    total: 13000,
    extraDuty: 1500,
    adv: 0,
    deduction: 500,
    netPay: 10700,
  }));

// Demo data for testing
export const demoDsReportTableData = Array(15) // Change 25 to any number for testing
  .fill(null)
  .map((_, i) => ({
    empName: `Employee ${i + 1}`,
    days: 26,
    basicSalary: 8000,
    allowances: {
      kitAllowances: 500,
      cityAllowances: 300,
      convHra: 2000,
    },
    grossPay: 10800,
    extraDuty: 1500,
    deduction: {
      empESI: 200,
      empEPF: 500,
      adv: 0,
      pTax: 200,
    },
    other: {
      belt: 50,
      boot: 100,
      uniform: 200,
    },
    otherDeduction: 100,
    totalDeduction: 1200,
    netPay: 11100,
  }));
