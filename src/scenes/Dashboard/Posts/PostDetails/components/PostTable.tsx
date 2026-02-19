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
import useHorizontalScroll from '../../../../../hooks/useHorizontalScroll';
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

/* Prop Types */
type PostsTableProps = {
  postsData: Post[];
  refreshPostsData: () => void;
};

/* Post Table Main Component */
const PostTable: React.FC<PostsTableProps> = ({
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
  const tableRef = useHorizontalScroll();

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
    navigate(`/app/posts/post-details/edit-post?id=${id}`);
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

  /* JSX */
  return (
    <>
      {isLoading && <Loader />}
      <div
        ref={tableRef}
        className="relative overflow-x-auto overflow-y-auto whitespace-nowrap flex text-center border scrollbar border-opacity-40  scrollbar-thumb-scrollBarColor scrollbar-track-scrollBarBg"
      >
        <table
          id="postsTable"
          className="bg-white border border-tableBorder min-w-[105%]"
        >
          <thead className="text-center text-primaryText border border-tableBorder sticky top-0">
            <tr className="bg-tableHeadingColour">
              <th
                className="p-2 border border-tableBorder w-[8%] text-xs md:text-sm xl:text-base"
                rowSpan={2}
              >
                Post Name
              </th>
              <th
                className="p-2 border border-tableBorder w-[8%] text-xs md:text-sm xl:text-base"
                rowSpan={2}
              >
                Contact Person
              </th>
              <th
                className="p-2 border border-tableBorder w-[8%] text-xs md:text-sm xl:text-base"
                rowSpan={2}
              >
                GSTIN
              </th>
              <th
                className="p-2 border border-tableBorder w-[10%] text-xs md:text-sm xl:text-base"
                rowSpan={2}
              >
                Service Location
              </th>
              <th
                className="p-2 border border-tableBorder w-[5%] text-xs md:text-sm xl:text-base"
                rowSpan={2}
              >
                Contract Start Date
              </th>
              <th
                className="p-2 border border-tableBorder w-[5%] text-xs md:text-sm xl:text-base"
                rowSpan={2}
              >
                Status
              </th>
              <th
                className="p-2 border border-tableBorder w-[3%] text-xs md:text-sm xl:text-base"
                rowSpan={2}
              >
                Action
              </th>
            </tr>
          </thead>
          <tbody className="text-primaryText border border-tableBorder ">
            {postsData.map((post: Post, index: number) => (
              <tr
                key={post.ID}
                className="hover:bg-gray-200 border border-tableBorder"
              >
                {/* Post Name */}
                <td className="p-2 border border-tableBorder w-[8%] text-xs md:text-sm xl:text-base">
                  <button onClick={() => handleEdit(post.ID || 0)}>
                    {post.postName || '---'}
                  </button>
                </td>
                {/* Contact Person */}
                <td className="p-2 border border-tableBorder w-[8%] text-xs md:text-sm xl:text-base">
                  {post.contactPerson}
                </td>
                {/* GSTIN */}
                <td className="p-2 border border-tableBorder w-[8%] text-xs md:text-sm xl:text-base">
                  {post.gstin}
                </td>
                {/* Service Location */}
                <td className="p-2 border border-tableBorder w-[10%] text-xs md:text-sm xl:text-base">
                  {post.address}
                </td>
                {/* Contract Start Date */}
                <td className="p-2 border border-tableBorder w-[5%] text-xs md:text-sm xl:text-base">
                  {new Date(post.contractDate).toLocaleDateString('en-GB', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                  })}
                </td>
                {/* Status */}
                {/* action modal */}
                <td className="p-2 border border-tableBorder w-[5%] text-xs md:text-sm xl:text-base">
                  {/* {post.status} */}
                  {post.status === 'Active' ? (
                    <button className="bg-[#0C672B4D] text-[#0C672B] py-1 px-4 rounded-full font-medium text-xs md:text-sm xl:text-base">
                      Active
                    </button>
                  ) : (
                    <button className="bg-[#A1A1A1] text-white py-1 px-4 rounded-full font-medium text-xs md:text-sm xl:text-base">
                      Inactive
                    </button>
                  )}
                </td>
                {/* Action */}
                <td className="p-2 border border-tableBorder w-[3%] text-xs md:text-sm xl:text-base relative">
                  <button
                    onClick={() => {
                      setActionModalIndex(
                        actionModalIndex === index ? null : index
                      );
                      setCurrentRankId(post.ID ? post.ID : 0);
                      setCurrentRankName(post.postName);
                    }}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <img
                      src={TableOptionsIcon}
                      alt="TableOptionsIcon"
                      className="w-4 h-4 "
                    />
                  </button>
                  {actionModalIndex === index && (
                    <>
                      <div
                        ref={actionMenuRef}
                        className={`absolute right-[60%] ${actionModalIndex <= 2 ? 'top-[-75%] xl:top-[-85%]' : 'bottom-[10%] lg:bottom-[20%]'} w-24 md:w-28 lg:w-32 bg-white border border-gray-300 shadow-lg z-10`}
                      >
                        {/* Edit Post */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEdit(currentRankId);
                          }}
                          className="flex gap-2 items-center w-full px-2 lg:px-4 py-1 xl:py-[6px] text-xs md:text-sm  primaryLabels text-secondaryText hover:bg-smallMenuHover"
                        >
                          <img
                            src={EditPencil_Icon}
                            alt="EditPencil_Icon"
                            className="w-3 h-3 lg:w-4 lg:h-4"
                          />
                          <span>Edit</span>
                        </button>
                        {/* Delete Post */}
                        <button
                          onClick={(event) => {
                            event.stopPropagation();
                            setShowDeleteModal(true);
                          }}
                          className="flex gap-2 items-center w-full px-2 lg:px-4 py-1 xl:py-[6px] text-xs md:text-sm  primaryLabels text-secondaryText hover:bg-smallMenuHover"
                        >
                          <img
                            src={Delete_Icon}
                            alt="Delete_Icon"
                            className="w-3 h-3 lg:w-4 lg:h-4"
                          />
                          <span>Delete</span>
                        </button>
                        {/* Deactivate / Reactivate Post */}
                        {post.status === 'Active' ? (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setShowDeactivateModal(true);
                            }}
                            className="flex gap-2 items-center w-full px-2 lg:px-4 py-1 xl:py-[6px] text-xs md:text-sm  primaryLabels text-secondaryText hover:bg-smallMenuHover"
                          >
                            <img
                              src={DeactivateIcon}
                              alt="EditPencil_Icon"
                              className="w-3 h-3 lg:w-4 lg:h-4"
                            />
                            <span>Deactivate</span>
                          </button>
                        ) : (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setShowReactivateModal(true);
                            }}
                            className="flex gap-2 items-center w-full px-2 lg:px-4 py-1 xl:py-[6px] text-xs md:text-sm  primaryLabels text-secondaryText hover:bg-smallMenuHover"
                          >
                            <img
                              src={ReactivateIcon}
                              alt="EditPencil_Icon"
                              className="w-3 h-3 lg:w-4 lg:h-4"
                            />
                            <span>Reactivate</span>
                          </button>
                        )}
                      </div>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
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

export default PostTable;
