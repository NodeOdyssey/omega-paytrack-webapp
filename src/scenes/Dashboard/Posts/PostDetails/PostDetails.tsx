/* Libraries */
import React, { useEffect, useRef, useState } from 'react';
import axios, { AxiosError } from 'axios';

/* Configs */
import { api } from '../../../../configs/api';

/* Hooks */
// import useVerifyUserAuth from '../../../../hooks/useVerifyUserAuth';
import useHandleAxiosError from '../../../../hooks/useHandleAxiosError';
import useHandleYupError from '../../../../hooks/useHandleYupError';
import useClickOutside from '../../../../hooks/useClickOutside';
import useScrollToTop from '../../../../hooks/useScrollToTop';
import useTableSearch from '../../../../hooks/useTableSearch';

/* Types */
import { Post } from '../../../../types/post';

/* Helpers */
import { exportPostDetailsPdf } from '../../../../helpers/exportToPdf';
import { ExportPostsCsv } from '../../../../helpers/exportToCsv';

/* Components */

import NoPostDetails from './components/NoPostDetails';
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
import PostTable2 from './components/PostTable2';
import SearchCompo from '../../../../common/SearchCompo';
import useAuthStore from '../../../../store/auth';

/* Prop Types */
type PostDetailsProps = {
  onAddPostClick: () => void;
};

/* Post Details Main Component */
const PostDetails: React.FC<PostDetailsProps> = ({ onAddPostClick }) => {
  /* Scroll To Top */
  useScrollToTop();

  /* Verify User Auth */
  // const accessToken = useVerifyUserAuth();
  const { accessToken } = useAuthStore();

  /* Loader */
  const [isLoading, setIsLoading] = useState(false);

  /* Error Handling */
  const { setErrors } = useHandleYupError();
  const { handleAxiosError } = useHandleAxiosError(setErrors);

  /* All Posts Data Handling */
  const [allPostsData, setPostsData] = React.useState<Post[]>([]);

  const fetchAllPosts = async () => {
    setIsLoading(true);
    if (!accessToken) return;
    try {
      const response = await axios.get(`${api.baseUrl}/posts`, {
        headers: {
          'x-access-token': accessToken,
        },
      });
      if (response.data && response.data.success) {
        const allPosts: Post[] = response.data.posts;
        setPostsData(allPosts);
      }
    } catch (error) {
      handleAxiosError(error as AxiosError);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAllPosts();
  }, [accessToken]);

  /* Search Handling */
  const [searchTerm, setSearchTerm] = useState('');
  const filteredPostsData = useTableSearch(allPostsData, searchTerm);

  const handleSearchInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setSearchTerm(event.target.value);
  };

  /* Pagination Handling */
  const [currentPosts, setCurrentPosts] = useState<Post[]>([]);
  const [itemsPerPage] = useState(600);

  /* Kebab Modal Handling */
  const [isKebabModalOpen, setIsKebabModalOpen] = useState(false);
  const kebabModalRef = useRef<HTMLDivElement>(null);
  useClickOutside(kebabModalRef, () => setIsKebabModalOpen(false));

  /* Export PDF Handling */
  const handleExportPDF = () => {
    setIsKebabModalOpen(false);
    exportPostDetailsPdf(allPostsData);
  };

  /* JSX */
  return (
    <>
      {isLoading && <Loader />}
      <>
        {allPostsData && allPostsData.length > 0 ? (
          <div className="flex flex-col padding-responsive-header-container-type-2">
            <BreadCrumb total={allPostsData.length} />
            <div className="flex justify-between items-center py-1 2xl:py-2">
              <SearchCompo
                searchValue={searchTerm}
                handleSearchInputChange={handleSearchInputChange}
              />
              <div className="relative flex items-center gap-2 2xl:gap-4">
                <PrimaryButton
                  type="submit"
                  icon={Plus_White}
                  onClick={onAddPostClick}
                >
                  Add Post
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
                    <ExportPostsCsv
                      handleClose={() => setIsKebabModalOpen(false)}
                      postsData={allPostsData}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : null}
        <div className="flex-grow overflow-y-auto">
          {searchTerm && filteredPostsData.length === 0 ? (
            <NoSearchResultPage />
          ) : filteredPostsData && filteredPostsData.length > 0 ? (
            <div className="flex flex-col h-full px-4 2xl:px-8">
              <PostTable2
                postsData={currentPosts}
                refreshPostsData={fetchAllPosts} //TODO: Add refresh
              />
              <Pagination
                data={filteredPostsData}
                itemsPerPage={itemsPerPage}
                onPageChange={setCurrentPosts}
              />
            </div>
          ) : (
            !isLoading && <NoPostDetails onAddPostClick={onAddPostClick} />
          )}
        </div>
      </>
    </>
  );
};

export default PostDetails;
