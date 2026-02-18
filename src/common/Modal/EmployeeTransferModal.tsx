/* Libraries */
import React, { useEffect, useState } from 'react';
import axios, { AxiosError } from 'axios';
import * as Yup from 'yup';

/* Configs */
import { api } from '../../configs/api';

/* Hooks */
import useVerifyUserAuth from '../../hooks/useVerifyUserAuth';
import useHandleYupError from '../../hooks/useHandleYupError';
import useHandleAxiosError from '../../hooks/useHandleAxiosError';

/* Types */
import { PostRankLink } from '../../types/postRankLink';
import { Post } from '../../types/post';

/* Components */

import PrimaryButton from '../Button/PrimaryButton';
import Loader from '../Loader/Loader';
import CancelButton from '../Button/CancelButton';

type EmployeeTransferModalProps = {
  message: string;
  onConfirm: (e: React.FormEvent) => void;
  onCancel: () => void;
  updateNewSelectedPostRankId: (postRankLinkId: number) => void;
  updateTransferPostingDate: (date: Date | null) => void;
  confirmButtonTitle: string;
  cancelButtonTitle?: string;
};

// Validation schema for schedule employee data row
const transferEmployeeValidationSchema = Yup.object().shape({
  currentSelectedPostId: Yup.number()
    .min(1, 'Please select a post')
    .required('Please select a post'),
  currentSelectedPostRankId: Yup.number()
    .min(1, 'Please select a rank')
    .required('Please select a rank'),
  transferPostingDate: Yup.date()
    .nonNullable()
    .required('Please enter the date of posting')
    .test('not-2000', 'Please select a valid date of posting', (value) => {
      return value && value.getFullYear() !== 2000;
    }),
});

const EmployeeTransferModal: React.FC<EmployeeTransferModalProps> = ({
  message,
  onConfirm,
  onCancel,
  updateNewSelectedPostRankId,
  updateTransferPostingDate,
  confirmButtonTitle,
  cancelButtonTitle,
}) => {
  /* Verify User Auth */
  const accessToken = useVerifyUserAuth();

  /* Error Handling */
  const { errors, handleYupError, setErrors } = useHandleYupError();
  const { handleAxiosError } = useHandleAxiosError(setErrors);

  /* Loader */
  const [isLoading, setIsLoading] = useState(false);

  /* Post and Post Rank Link Data and Controls */
  const [allPostsData, setAllPostsData] = useState<Post[]>([]);
  const [allPostRankLinksData, setAllPostRankLinksData] = useState<
    PostRankLink[]
  >([]);
  const [currentSelectedPostId, setCurrentSelectedPostId] = useState<number>(0);
  const [currentSelectedPostRankId, setCurrentSelectedPostRankId] =
    useState<number>(0);
  const [transferPostingDate, setTransferPostingDate] = useState<Date | null>(
    null
  );

  const fetchPosts = async () => {
    if (!accessToken) return;
    try {
      const response = await axios.get(`${api.baseUrl}${api.posts}`, {
        headers: { 'x-access-token': accessToken },
      });
      if (response.data && response.data.success) {
        setAllPostsData(response.data.posts);
      } else {
        console.error('Error:', response.data.message);
      }
    } catch (error) {
      if (error instanceof Yup.ValidationError) {
        handleYupError(error);
      } else {
        if (error instanceof AxiosError && error.response?.status === 404) {
          setAllPostsData([]);
          handleAxiosError(error as AxiosError);
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [accessToken]);

  useEffect(() => {
    if (!currentSelectedPostId) return;
    setErrors({});
  }, [currentSelectedPostId]);

  const fetchPostRanks = async () => {
    if (!accessToken) return;
    try {
      const response = await axios.get(
        `${api.baseUrl}${api.posts}/${currentSelectedPostId}/link-rank`,
        {
          headers: { 'x-access-token': accessToken },
        }
      );
      if (response.data && response.data.success) {
        setAllPostRankLinksData(response.data.postRankLinks);
      } else {
        console.error('Error:', response.data.message);
      }
    } catch (error) {
      setErrors({
        error:
          'No ranks have been set for this post. Please assign a rank first',
      });
      if (error instanceof Yup.ValidationError) {
        handleYupError(error);
      } else {
        if (error instanceof AxiosError && error.response?.status === 404) {
          setAllPostRankLinksData([]);
          handleAxiosError(error as AxiosError);
        }
      }
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    if (currentSelectedPostId) fetchPostRanks();
  }, [accessToken, currentSelectedPostId]);

  /* Update handlers */
  const handleSaveClick = async (e: React.FormEvent) => {
    if (!accessToken) return;
    setIsLoading(true);
    setErrors({});

    try {
      await transferEmployeeValidationSchema.validate(
        {
          currentSelectedPostId,
          currentSelectedPostRankId,
          transferPostingDate,
        },
        { abortEarly: false }
      );

      onConfirm(e);
    } catch (error) {
      if (error instanceof Yup.ValidationError) {
        setErrors({ error: error.inner[0].message });
      } else {
        handleAxiosError(error as AxiosError);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // console.log('all posts length', allPostsData.length);
    // console.log('all post ranks length', allPostRankLinksData.length);
    // console.log('errors', errors);
    // console.log('transferPostingDate', transferPostingDate);
  });
  // JSX here
  return (
    <>
      {isLoading && <Loader />}
      <section className="fixed inset-0 bg-gray-400 bg-opacity-30 flex justify-center items-center z-40">
        <main className="z-50 rounded-md py-[3%] w-[50%] h-auto bg-white shadow-md drop-shadow-md text-center flex flex-col justify-center items-center space-y-10">
          <p className="primaryHeadings font-medium px-6">{message}</p>
          <div className="w-[60%]">
            <div className="flex text-center overflow-x-auto max-h-[60vh]">
              <table className="min-w-full bg-white border border-accordionBg">
                <thead className="text-center text-primaryText border border-accordionBg sticky top-0">
                  <tr className="bg-tableHeadingColour">
                    <th
                      className="py-3 px-4 border border-tableBorder font-medium text-sm lg:text-base"
                      rowSpan={2}
                    >
                      Posting
                    </th>
                    <th
                      className="py-3 px-4 border border-tableBorder font-medium text-sm lg:text-base"
                      rowSpan={2}
                    >
                      Rank
                    </th>
                    <th
                      className="py-3 px-4 border border-tableBorder font-medium text-sm lg:text-base"
                      rowSpan={2}
                    >
                      Date of Posting
                    </th>
                  </tr>
                </thead>
                <tbody className="text-primaryText border border-tableBorder">
                  <tr className="border border-tableBorder h-16">
                    <td className="px-2 py-2 h-10 text-xs lg:text-sm xl:text-base border border-tableBorder">
                      <select
                        name=""
                        id=""
                        className="w-full h-full bg-white border rounded-lg py-2 px-2 max-h-60 cursor-pointer"
                        onChange={(e) => {
                          setCurrentSelectedPostId(Number(e.target.value));
                          setCurrentSelectedPostRankId(0);
                          // setTransferPostingDate(new Date());
                          setAllPostRankLinksData([]);
                        }}
                        disabled={allPostsData.length === 0}
                      >
                        <option value="">Select</option>
                        {allPostsData.map((post) => (
                          <option key={post.ID} value={post.ID}>
                            {post.postName}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-2 py-2 h-10 text-xs lg:text-sm xl:text-base border border-tableBorder">
                      <select
                        name=""
                        id=""
                        className="w-full h-full bg-white border rounded-lg py-2 px-2 max-h-60 cursor-pointer"
                        onChange={(e) => {
                          updateNewSelectedPostRankId(Number(e.target.value));
                          setCurrentSelectedPostRankId(Number(e.target.value));
                        }}
                        disabled={
                          allPostRankLinksData.length === 0 ||
                          currentSelectedPostId === 0
                        }
                      >
                        <option value="">Select</option>
                        {allPostRankLinksData.map((postRankLink) => (
                          <option
                            disabled={allPostRankLinksData.length === 0}
                            key={postRankLink.ID}
                            value={postRankLink.ID}
                          >
                            {postRankLink.designation}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-2 py-2 h-10 text-xs lg:text-sm xl:text-base border border-tableBorder">
                      <input
                        type="date"
                        name="date"
                        id="date"
                        disabled={
                          currentSelectedPostId === 0 ||
                          allPostRankLinksData.length === 0 ||
                          currentSelectedPostRankId === 0
                        }
                        onChange={(e) => {
                          updateTransferPostingDate(new Date(e.target.value));
                          setTransferPostingDate(new Date(e.target.value));
                        }}
                        className="w-full h-full bg-white border rounded-lg py-2 px-2 max-h-60 cursor-pointer"
                      />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            {errors.error && (
              <div className="text-red-500 mt-4 text-start">
                <p>{errors.error}</p>
              </div>
            )}
          </div>
          <div className="flex justify-center gap-8">
            <CancelButton onClick={onCancel}>{cancelButtonTitle}</CancelButton>
            <PrimaryButton
              onClick={handleSaveClick}
              colorType={
                confirmButtonTitle === 'Save Changes' ? 'normal' : 'warning'
              }
            >
              {confirmButtonTitle}
            </PrimaryButton>
            {/* <button
              onClick={handleSaveClick}
              className="primaryHeadings bg-errorColour border-errorColour text-white hover:scale-105 transition-transform rounded-md px-6 py-[6px] font-semibold  border-2"
              type="button"
            >
              {confirmButtonTitle}
            </button> */}
          </div>
        </main>
      </section>
    </>
  );
};

export default EmployeeTransferModal;
