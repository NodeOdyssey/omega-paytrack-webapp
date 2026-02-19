/* Libraries */
import React, { useRef, useState } from 'react';
import axios, { AxiosError } from 'axios';
import { useNavigate } from 'react-router';
import { toast } from 'react-toastify';

/* Configs */
import { api } from '../../../../../configs/api';

/* Hooks */
import useVerifyUserAuth from '../../../../../hooks/useVerifyUserAuth';
import useClickOutside from '../../../../../hooks/useClickOutside';
// import useHorizontalScroll from '../../../../../hooks/useHorizontalScroll';
import useScrollToTop from '../../../../../hooks/useScrollToTop';
import useHandleYupError from '../../../../../hooks/useHandleYupError';
import useHandleAxiosError from '../../../../../hooks/useHandleAxiosError';

/* Types */
import { Post } from '../../../../../types/post';

/* Components */
import ConfirmationModal from '../../../../../common/Modal/ConfirmationModal';
import Loader from '../../../../../common/Loader/Loader';

/* Assets */
import {
  DeactivateIcon,
  Delete_Icon,
  EditPencil_Icon,
  ReactivateIcon,
  TableOptionsIcon,
} from '../../../../../assets/icons';

import { Tooltip } from 'react-tooltip';

/* Prop Types */
type PostsTableProps = {
  postsData: Post[];
  refreshPostsData: () => void;
};

/* Post Table Main Component */
const PostTable2: React.FC<PostsTableProps> = ({
  postsData,
  refreshPostsData,
}) => {
  /* Scroll To Top */
  useScrollToTop();

  /* Verify User Auth */
  const accessToken = useVerifyUserAuth();

  /* Navigation */
  const navigate = useNavigate();

  /* Table Horizontal Scroll */
  // const tableRef = useHorizontalScroll();

  /* Loader */
  const [isLoading, setIsLoading] = useState(false);

  /* Error Handling */
  const { setErrors } = useHandleYupError();
  const { handleAxiosError } = useHandleAxiosError(setErrors);

  /* Table Action Modal Controls */
  const [actionModalIndex, setActionModalIndex] = useState<number | null>(null);
  const actionMenuRef = useRef<HTMLDivElement>(null);
  useClickOutside(actionMenuRef, () => setActionModalIndex(null));

  /* Edit and Delete Controls */
  const [currentRankId, setCurrentRankId] = useState<number>(0);
  const [currentRankName, setCurrentRankName] = useState<string>('');
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [showDeactivateModal, setShowDeactivateModal] =
    useState<boolean>(false);
  const [showReactivateModal, setShowReactivateModal] =
    useState<boolean>(false);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);

  const handleDelete = async (id: number) => {
    setIsLoading(true);
    try {
      const response = await axios.delete(`${api.baseUrl}/posts/${id}`, {
        headers: { 'x-access-token': accessToken },
      });
      if (response.data && response.data.success) {
        setShowDeleteModal(false);
        toast.success(response.data.message);
        refreshPostsData();
      }
    } catch (error) {
      handleAxiosError(error as AxiosError);
    } finally {
      setShowDeleteModal(false);
      setIsLoading(false);
    }
  };

  const handleEdit = (id: number) => {
    navigate(`/app/posts/edit-post?id=${id}`);
  };

  const handleDeactivate = async (id: number) => {
    if (!accessToken || !id) return;
    setIsLoading(true);
    try {
      const response = await axios.patch(
        `${api.baseUrl}/posts/${id}/deactivate`,
        {},
        {
          headers: { 'x-access-token': accessToken },
        }
      );
      if (response.data && response.data.success) {
        toast.success(response.data.message);
        refreshPostsData();
      }
    } catch (error) {
      handleAxiosError(error as AxiosError);
    } finally {
      setShowDeactivateModal(false);
      setIsLoading(false);
    }
  };

  const handleReactivate = async (id: number) => {
    if (!accessToken || !id) return;
    setIsLoading(true);
    try {
      const response = await axios.patch(
        `${api.baseUrl}/posts/${id}/reactivate`,
        {},
        {
          headers: { 'x-access-token': accessToken },
        }
      );
      if (response.data && response.data.success) {
        toast.success(response.data.message);
        refreshPostsData();
      }
    } catch (error) {
      handleAxiosError(error as AxiosError);
    } finally {
      setShowReactivateModal(false);
      setIsLoading(false);
    }
  };

  // action menu
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });

  const handleActionClick = (
    e: React.MouseEvent<HTMLButtonElement>,
    post: Post,
    index: number
  ) => {
    const button = e.currentTarget;
    const rect = button.getBoundingClientRect();

    setTimeout(() => {
      if (actionMenuRef.current) {
        const menuWidth = actionMenuRef.current.offsetWidth;
        setMenuPosition({
          top: rect.bottom + window.scrollY,
          left: rect.right + window.scrollX - menuWidth,
        });
      }
    }, 0);

    setActionModalIndex(index);
    setSelectedPost(post); // <-- THIS IS NEW
    setCurrentRankId(post.ID ?? 0);
    setCurrentRankName(post.postName);
  };

  /* JSX */
  return (
    <>
      {isLoading && <Loader />}
      <div
        // ref={tableRef}
        className="table-container"
      >
        <table
          id="postsTable"
          // className="bg-white w-full h-full table-fixed border-separate border-spacing-0"
          className="bg-white w-full h-full table-fixed border border-collapse"
        >
          <thead className="text-center text-primaryText sticky top-0 z-20 bg-tableHeadingColour border-none">
            <tr className="bg-tableHeadingColour">
              {/* <th className="text-left w-[25%]" rowSpan={2}>
                <div className="flex bg-blue-100 h-full w-full border border-black px-2 2xl:px-4 py-1 2xl:py-2 text-responsive-table items-center">
                  Post Name
                </div>
              </th> */}
              <th className="table-header w-[25%] text-left" rowSpan={2}>
                Post Name
              </th>
              <th className="table-header w-[9%]" rowSpan={2}>
                Contact Person
              </th>
              <th className="table-header w-[12%]" rowSpan={2}>
                GSTIN
              </th>
              <th className="table-header w-[12%]" rowSpan={2}>
                Service Location
              </th>
              <th className="table-header px-3 w-[7%]" rowSpan={2}>
                Contract Start Date
              </th>
              <th className="table-header w-[6%]" rowSpan={2}>
                Status
              </th>
              <th className="table-header px-1 w-[4%]" rowSpan={2}>
                Action
              </th>
            </tr>
          </thead>
          <tbody className="text-primaryText">
            {postsData.map((post: Post, index: number) => (
              <tr
                key={post.ID}
                className="hover:bg-gray-200 font-medium table-responsive-row-height"
              >
                {/* Post Name */}
                <td className="table-td-existing-data">
                  <button
                    className="items-start w-full text-left"
                    onClick={() => handleEdit(post.ID || 0)}
                    data-tooltip-id={`postName-tooltip-${index}`}
                    data-tooltip-content={post.postName || 'No Post Name'}
                  >
                    <p className="text-bgPrimaryButton hover:text-bgPrimaryButtonHover underline table-td-existing-data-overflow">
                      {post.postName || '-'}
                    </p>
                  </button>
                  <Tooltip id={`postName-tooltip-${index}`} place="bottom" />
                </td>
                {/* Contact Person */}
                <td className="table-td-existing-data text-left">
                  <div
                    data-tooltip-id={`contact-tooltip-${index}`}
                    data-tooltip-content={post.contactPerson}
                  >
                    {post.contactPerson ? (
                      <p className="break-words table-td-existing-data-overflow">
                        {post.contactPerson}
                      </p>
                    ) : (
                      <p className="text-center">-</p>
                    )}
                  </div>
                  <Tooltip
                    id={`contact-tooltip-${index}`}
                    place="bottom"
                    hidden={post.contactPerson ? false : true}
                  />
                </td>
                {/* GSTIN */}
                <td className="table-td-existing-data text-left">
                  <p className="table-td-existing-data-overflow">
                    {post.gstin}
                  </p>
                </td>
                {/* Service Location */}
                <td className="table-td-existing-data text-left">
                  <div
                    data-tooltip-id={`address-tooltip-${index}`}
                    data-tooltip-content={post.address}
                  >
                    {post.address ? (
                      // post.address
                      <p className="table-td-existing-data-overflow">
                        {post.address}
                      </p>
                    ) : (
                      <p className="text-center">-</p>
                    )}
                    <Tooltip
                      id={`address-tooltip-${index}`}
                      place="bottom"
                      hidden={post.address ? false : true}
                    />
                  </div>
                </td>
                {/* Contract Start Date */}
                <td className="table-td-existing-data ">
                  {new Date(post.contractDate).toLocaleDateString('en-GB', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                  })}
                </td>
                {/* Status */}
                <td className="table-td-existing-data overflow-hidden">
                  {/* {post.status} */}
                  {post.status === 'Active' ? (
                    <button className="bg-[#0C672B4D] text-[#0C672B] py-1 px-3 rounded-full font-medium">
                      Active
                    </button>
                  ) : (
                    <button className="bg-[#A1A1A1] text-white py-1 px-3 rounded-full font-medium text-responsive-table">
                      Inactive
                    </button>
                  )}
                </td>
                {/* Action */}
                <td className="table-td-existing-data relative">
                  <button
                    // onClick={() => {
                    //   setActionModalIndex(
                    //     actionModalIndex === index ? null : index
                    //   );
                    //   setCurrentRankId(post.ID ? post.ID : 0);
                    //   setCurrentRankName(post.postName);
                    // }}

                    onClick={(e) => handleActionClick(e, post, index)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <img
                      src={TableOptionsIcon}
                      alt="TableOptionsIcon"
                      className="w-4 h-4"
                    />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {actionModalIndex !== null && (
          <>
            <div
              ref={actionMenuRef}
              // className={`absolute right-[60%] ${actionModalIndex <= 2 ? 'top-[-75%] xl:top-[-85%]' : 'bottom-[10%] lg:bottom-[20%]'} w-24 md:w-28 lg:w-32 bg-white border border-gray-300 shadow-lg z-20`}
              className="fixed z-50 bg-white border border-gray-300 shadow-lg"
              style={{
                top: `${menuPosition.top}px`,
                left: `${menuPosition.left}px`,
              }}
            >
              {/* Edit Post */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleEdit(currentRankId);
                }}
                className="action-menu-button"
              >
                <img
                  src={EditPencil_Icon}
                  alt="EditPencil_Icon"
                  className="action-modal-responsive-icon"
                />
                <p className="text-responsive-table">Edit</p>
              </button>
              {/* Delete Post */}
              <button
                onClick={(event) => {
                  event.stopPropagation();
                  setShowDeleteModal(true);
                  setActionModalIndex(null);
                }}
                className="action-menu-button"
              >
                <img
                  src={Delete_Icon}
                  alt="Delete_Icon"
                  className="action-modal-responsive-icon"
                />
                <p className="text-responsive-table">Delete</p>
              </button>
              {/* Deactivate / Reactivate Post */}
              {selectedPost?.status === 'Active' ? (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowDeactivateModal(true);
                    setActionModalIndex(null);
                  }}
                  className="action-menu-button"
                >
                  <img
                    src={DeactivateIcon}
                    alt="EditPencil_Icon"
                    className="action-modal-responsive-icon"
                  />
                  <p className="text-responsive-table">Deactivate</p>
                </button>
              ) : (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowReactivateModal(true);
                    setActionModalIndex(null);
                  }}
                  className="action-menu-button"
                >
                  <img
                    src={ReactivateIcon}
                    alt="EditPencil_Icon"
                    className="action-modal-responsive-icon"
                  />
                  <p className="text-responsive-table">Reactivate</p>
                </button>
              )}
            </div>
          </>
        )}
        {showDeleteModal && (
          <ConfirmationModal
            confirmButtonTitle="Delete"
            cancelButtonTitle="Cancel"
            onConfirm={() => {
              handleDelete(currentRankId);
            }}
            onCancel={() => setShowDeleteModal(false)}
            message={`Are you sure you want to delete the post ${currentRankName}?`}
          />
        )}
        {showDeactivateModal && (
          <ConfirmationModal
            confirmButtonTitle="Deactivate"
            cancelButtonTitle="Cancel"
            onConfirm={() => {
              handleDeactivate(currentRankId);
            }}
            onCancel={() => setShowDeactivateModal(false)}
            message={`Are you sure you want to deactivate the post ${currentRankName}? This will automatically discharge all the employees associated with the post.`}
          />
        )}
        {showReactivateModal && (
          <ConfirmationModal
            confirmButtonTitle="Reactivate"
            cancelButtonTitle="Cancel"
            onConfirm={() => {
              handleReactivate(currentRankId);
            }}
            onCancel={() => setShowReactivateModal(false)}
            message={`Are you sure you want to reactivate the post ${currentRankName}?`}
          />
        )}
      </div>
    </>
  );
};

export default PostTable2;
