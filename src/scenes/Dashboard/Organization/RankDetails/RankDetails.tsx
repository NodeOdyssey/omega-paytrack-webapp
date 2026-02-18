/* Libraries */
import React, { useEffect, useRef, useState } from 'react';
import axios, { AxiosError } from 'axios';

/* Configs */
import { api } from '../../../../configs/api';

/* Hooks */
import useVerifyUserAuth from '../../../../hooks/useVerifyUserAuth';
import useHandleAxiosError from '../../../../hooks/useHandleAxiosError';
import useHandleYupError from '../../../../hooks/useHandleYupError';
import useClickOutside from '../../../../hooks/useClickOutside';
import useScrollToTop from '../../../../hooks/useScrollToTop';
import useTableSearch from '../../../../hooks/useTableSearch';

/* Types */
import { Rank } from '../../../../types/rank';

/* Helpers */
import { exportRankDetailsPdf } from '../../../../helpers/exportToPdf';
import { ExportRanksCsv } from '../../../../helpers/exportToCsv';

/* Components */

import NoRankDetails from './components/NoRankDetails';
import NoSearchResultPage from '../../../../common/NoSearchResultPage/NoSearchResultPage';
import BreadCrumb from '../../../../common/BreadCrumb/BreadCrumb';
import Pagination from '../../../../common/Pagination/Pagination';
import Loader from '../../../../common/Loader/Loader';
import PrimaryButton from '../../../../common/Button/PrimaryButton';

/* Assets */
import {
  PDFIcon,
  Plus_White,
  // SearchIcon,
  TableOptionsIcon,
} from '../../../../assets/icons';
import RanksTable2 from './components/RanksTable2';
import SearchCompo from '../../../../common/SearchCompo';

/* Prop Types */
type RankDetailsProps = {
  onAddRankClick: () => void;
};

/* Rank Details Main Component */
const RankDetails: React.FC<RankDetailsProps> = ({ onAddRankClick }) => {
  /* Scroll To Top */
  useScrollToTop();

  /* Verify User Auth */
  const accessToken = useVerifyUserAuth();

  /* Loader */
  const [isLoading, setIsLoading] = useState(false);

  /* Error Handling */
  const { setErrors } = useHandleYupError();
  const { handleAxiosError } = useHandleAxiosError(setErrors);

  /* All Ranks Data Handling */
  const [allRanksData, setAllRanksData] = useState<Rank[]>([]);

  const fetchAllRanks = async () => {
    setIsLoading(true);
    if (!accessToken) return;
    try {
      const response = await axios.get(`${api.baseUrl}/ranks`, {
        headers: {
          'x-access-token': accessToken,
        },
      });
      if (response.data && response.data.success) {
        const allRanks: Rank[] = response.data.ranks;
        setAllRanksData(allRanks);
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
    fetchAllRanks();
  }, [accessToken]);

  /* Search Handling */
  const [searchTerm, setSearchTerm] = useState('');
  const filteredRanksData = useTableSearch(allRanksData, searchTerm);

  const handleSearchInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setSearchTerm(event.target.value);
  };

  /* Pagination Handling */
  const [currentRanks, setCurrentRanks] = useState<Rank[]>([]);
  const [itemsPerPage] = useState(600);

  /* Kebab Modal Handling */
  const [isKebabModalOpen, setIsKebabModalOpen] = useState(false);
  const kebabModalRef = useRef<HTMLDivElement>(null);
  useClickOutside(kebabModalRef, () => setIsKebabModalOpen(false));

  /* Export PDF Handling */
  const handleExportPDF = () => {
    setIsKebabModalOpen(false);
    exportRankDetailsPdf(allRanksData);
  };

  /* JSX */
  return (
    <>
      {isLoading && <Loader />}
      <>
        {allRanksData && allRanksData.length > 0 ? (
          <div className="flex flex-col padding-responsive-header-container-type-2">
            <BreadCrumb total={allRanksData.length} />

            <div className="flex justify-between items-center py-1 2xl:py-2">
              <SearchCompo
                searchValue={searchTerm}
                handleSearchInputChange={handleSearchInputChange}
              />
              <div className="relative flex items-center gap-2 2xl:gap-4">
                <PrimaryButton
                  type="submit"
                  icon={Plus_White}
                  onClick={onAddRankClick}
                >
                  Add Rank
                </PrimaryButton>

                {/* Table Options Kebab */}
                <button
                  onClick={() => setIsKebabModalOpen(!isKebabModalOpen)}
                  className="w-fit h-fit"
                >
                  <img
                    src={TableOptionsIcon}
                    alt="TableOptionsIcon"
                    className="table-outside-action-icon"
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
                    <ExportRanksCsv
                      handleClose={() => setIsKebabModalOpen(false)}
                      ranksData={allRanksData}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : null}
        <div className="flex-grow overflow-y-auto">
          {searchTerm && filteredRanksData.length === 0 ? (
            <NoSearchResultPage />
          ) : filteredRanksData && filteredRanksData.length > 0 ? (
            <div className="flex flex-col h-full px-4 2xl:px-8">
              <RanksTable2
                ranksData={currentRanks}
                refreshRanksData={fetchAllRanks}
              />
              <Pagination
                data={filteredRanksData}
                itemsPerPage={itemsPerPage}
                onPageChange={setCurrentRanks}
              />
            </div>
          ) : (
            !isLoading && <NoRankDetails onAddRankClick={onAddRankClick} />
          )}
        </div>
      </>
    </>
  );
};

export default RankDetails;
