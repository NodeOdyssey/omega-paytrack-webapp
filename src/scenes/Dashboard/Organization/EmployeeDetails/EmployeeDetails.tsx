// library imports
import React, { useEffect, useRef, useState } from 'react';
import axios, { AxiosError } from 'axios';
// components
import PrimaryButton from '../../../../common/Button/PrimaryButton';
import BreadCrumb from '../../../../common/BreadCrumb/BreadCrumb';

import NoEmployeeDetails from './components/NoEmployeeDetails';
import NoSearchResultPage from '../../../../common/NoSearchResultPage/NoSearchResultPage';
import Pagination from '../../../../common/Pagination/Pagination';
import Loader from '../../../../common/Loader/Loader';

// types
import { EmployeeTable } from '../../../../types/employee';

// configs
import { api } from '../../../../configs/api';

// hooks
import useScrollToTop from '../../../../hooks/useScrollToTop';
import useVerifyUserAuth from '../../../../hooks/useVerifyUserAuth';
import useHandleYupError from '../../../../hooks/useHandleYupError';
import useHandleAxiosError from '../../../../hooks/useHandleAxiosError';
import useTableSearch from '../../../../hooks/useTableSearch';
import useClickOutside from '../../../../hooks/useClickOutside';

// helpers
import { exportEmployeeDetailsPdf } from '../../../../helpers/exportToPdf';
import { ExportEmployeesCsv } from '../../../../helpers/exportToCsv';

// assets
import {
  PDFIcon,
  Plus_White,
  // SearchIcon,
  TableOptionsIcon,
} from '../../../../assets/icons';
import EmployeesTable2 from './components/EmployeesTable2';
import SearchCompo from '../../../../common/SearchCompo';

interface EmployeeDetailsProps {
  onAddEmployeeClick: () => void;
}
const EmployeeDetails: React.FC<EmployeeDetailsProps> = ({
  onAddEmployeeClick,
}) => {
  // Scroll to Top
  useScrollToTop();
  // verify user Auth
  const accessToken = useVerifyUserAuth();

  /* Loader */
  const [isLoading, setIsLoading] = useState(false);

  /* Error Handling */
  const { setErrors } = useHandleYupError();
  const { handleAxiosError } = useHandleAxiosError(setErrors);

  // All employees data handling
  const [employeesData, setEmployeesData] = useState<EmployeeTable[]>([]);

  // fetch all employees data on page load
  const fetchAllEmployees = async () => {
    setIsLoading(true);
    if (!accessToken) return;
    try {
      const response = await axios.get(`${api.baseUrl}${api.employees}`, {
        headers: {
          'x-access-token': accessToken,
        },
      });
      if (response.data && response.data.success) {
        const allEmployees: EmployeeTable[] = response.data.employees;
        console.log('Checking all employees: ', allEmployees);
        setEmployeesData(allEmployees);
      } else {
        console.error('Error:', response.data.message);
      }
    } catch (error) {
      handleAxiosError(error as AxiosError);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    fetchAllEmployees();
  }, [accessToken]);

  // serach handling
  const [searchValue, setSearchValue] = useState('');
  const filteredEmployeesData = useTableSearch(employeesData, searchValue);

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  };

  // Get paginated data
  const [currentEmployees, setCurrentEmployees] = useState<EmployeeTable[]>([]);
  // const itemsPerPage = 5; // You can adjust this number as needed
  const [itemsPerPage] = useState(600);

  /* Kebab Modal Handling */
  const [isKebabModalOpen, setIsKebabModalOpen] = useState(false);
  const kebabModalRef = useRef<HTMLDivElement>(null);
  useClickOutside(kebabModalRef, () => setIsKebabModalOpen(false));

  const handleExportPDF = () => {
    setIsKebabModalOpen(false);
    exportEmployeeDetailsPdf(employeesData);
  };

  //
  return (
    <>
      {isLoading && <Loader />}
      <>
        {/* <div className="flex-none"> */}
        {employeesData && employeesData.length > 0 ? (
          // <div className="bg-tableHeadingColour">
          <div className="flex flex-col padding-responsive-header-container-type-2">
            <BreadCrumb total={employeesData.length} />
            {/* search and button */}
            <div className="flex justify-between items-center py-1 2xl:py-2">
              <SearchCompo
                searchValue={searchValue}
                handleSearchInputChange={handleSearchInputChange}
              />
              <div className="relative flex items-center gap-2 2xl:gap-4">
                <PrimaryButton
                  type="submit"
                  icon={Plus_White}
                  onClick={onAddEmployeeClick}
                >
                  Add Employee
                </PrimaryButton>

                {/* Table Options */}
                <button
                  type="button"
                  onClick={() => setIsKebabModalOpen(!isKebabModalOpen)}
                  className="w-fit h-fit"
                >
                  <img
                    src={TableOptionsIcon}
                    className="table-outside-action-icon"
                    alt="TableOptionsIcon"
                  />
                </button>

                {isKebabModalOpen && (
                  <div
                    ref={kebabModalRef}
                    className="table-action-menu-container"
                  >
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleExportPDF();
                      }}
                      className="action-menu-button"
                    >
                      <img src={PDFIcon} alt="PDFIcon" className="w-4 h-4" />
                      <p className="text-responsive-button">Export as PDF</p>
                    </button>
                    <ExportEmployeesCsv
                      handleClose={() => setIsKebabModalOpen(false)}
                      employeesData={employeesData}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : // </div>
        null}
        {/* </div> */}

        <div className="overflow-y-auto ">
          {searchValue && filteredEmployeesData.length === 0 ? (
            <NoSearchResultPage />
          ) : filteredEmployeesData && filteredEmployeesData.length > 0 ? (
            <>
              <div className="flex flex-col h-full px-4 2xl:px-8">
                <EmployeesTable2
                  employeesData={currentEmployees}
                  refreshEmployeesData={fetchAllEmployees}
                />
                <Pagination
                  data={filteredEmployeesData}
                  itemsPerPage={itemsPerPage}
                  onPageChange={setCurrentEmployees}
                />
              </div>
            </>
          ) : (
            !isLoading && (
              <NoEmployeeDetails onAddEmployeeClick={onAddEmployeeClick} />
            )
          )}
        </div>
      </>
    </>
  );
};

export default EmployeeDetails;
