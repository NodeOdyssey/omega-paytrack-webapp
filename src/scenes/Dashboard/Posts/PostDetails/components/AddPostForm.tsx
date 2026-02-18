/* Libraries */
import React, { useEffect, useRef, useState } from 'react';
import axios, { AxiosError } from 'axios';
import { useNavigate } from 'react-router';
import { toast } from 'react-toastify';
import * as Yup from 'yup';
import { Tooltip } from 'react-tooltip';

/* Configs */
import { api } from '../../../../../configs/api';

/* Hooks */
import useScrollToTop from '../../../../../hooks/useScrollToTop';
import useVerifyUserAuth from '../../../../../hooks/useVerifyUserAuth';
import useHandleAxiosError from '../../../../../hooks/useHandleAxiosError';
import useHandleYupError from '../../../../../hooks/useHandleYupError';

/* Types */
import { Post, PostDocuments, Status } from '../../../../../types/post';
// import { Rank } from '../../../../../types/rank';
import { PostRankLink } from '../../../../../types/postRankLink';

/* Helpers */
import {
  getFileIcon,
  extractNameFromFileObj,
  extractFileNameFromPath,
  formatDateToYMD,
  getLabel,
} from '../../../../../utils/formatter';

/* Components */
import BreadCrumb from '../../../../../common/BreadCrumb/BreadCrumb';
import Accordion from '../../../../../common/Accordion/Accordion';
import ClearButton from '../../../../../common/Button/ClearButton';
import SmallButton from '../../../../../common/Button/SmallButton';
// import PrimaryButton from '../../../../../common/Button/PrimaryButton';
import RequiredRanks from './RequiredRanks';
import Loader from '../../../../../common/Loader/Loader';
import ConfirmationModal from '../../../../../common/Modal/ConfirmationModal';

/* Assets */
import {
  // Arrow_Back,
  Arrow_Back_Blue,
  Delete_Icon,
} from '../../../../../assets/icons';

/* Form Validation Schema */
const postValidationSchema = Yup.object().shape({
  postName: Yup.string().required('Post Name is required'),
  contactPerson: Yup.string(), // Optional
  // phoneNum: Yup.string().optional(),
  // phoneNum: Yup.string(),
  // .nullable()
  // .transform((value, originalValue) =>
  //   originalValue.trim() === '' ? null : value
  // ) // Convert empty string to null
  // .matches(/^\d{10}$/, 'Phone Number must be exactly 10 digits')
  // .optional(), // Ensures the field is not required

  // .nullable()
  // .test('phoneNum', 'Phone Number must be 10 digits', (value) => {
  //   if (!value || value.trim() === '') return true;
  //   const phoneRegex = /^\d{10}$/;
  //   return phoneRegex.test(value) && !value.includes('-');
  // }),
  gstin: Yup.string().required('GSTIN is required'),
  pan: Yup.string(), // Optional
  address: Yup.string().required('Address is required'),
  contractDate: Yup.string().required('Contract Date is required'),
});

// Required Ranks Validation Schema
const requiredRanksValidationSchema = Yup.object().shape({
  // designation: Yup.string().required('Designation is required'),
  basicSalary: Yup.number()
    .required('Basic Salary is required')
    .integer('Basic Salary must be an integer')
    .min(1, 'Basic Salary is required'),
  hra: Yup.number()
    // .required('House Rent is required')
    .min(0, 'House Rent must be 0 or a positive number')
    .integer('House Rent must be an integer'),
  // vda: Yup.number()
  //   .min(0, 'VDA must be 0 or a positive number')
  //   .integer('VDA must be an integer'),
  kitWashingAllowance: Yup.number()
    .min(0, 'Kit/Washing Allowance must be 0 or a positive number')
    .integer('Kit/Washing Allowance must be an integer'),
  cityAllowance: Yup.number()
    .min(0, 'City Allowance must be 0 or a positive number')
    .integer('City Allowance must be an integer'),
  conveyance: Yup.number()
    .min(0, 'Conveyance must be 0 or a positive number')
    .integer('Conveyance must be an integer'),
  uniformAllowance: Yup.number()
    .min(0, 'Uniform Allowance must be 0 or a positive number')
    .integer('Uniform Allowance must be an integer'),
  // otherAllowance: Yup.number()
  //   .min(0, 'Others must be 0 or a positive number')
  //   .integer('Others must be an integer'),
  // added special allowance & weekly off
  specialAllowance: Yup.number()
    .min(0, 'Uniform Allowance must be 0 or a positive number')
    .integer('Uniform Allowance must be an integer'),
  weeklyOff: Yup.number()
    .min(0, 'Uniform Allowance must be 0 or a positive number')
    .integer('Uniform Allowance must be an integer'),
  taxDeductionId: Yup.number()
    .required('Tax Deduction ID is required')
    .min(1, 'Must assign a Tax Group to each Rank.'),
});

/* Default Post Info Form Data */
const defaultPostFormData: Post = {
  postName: '',
  contactPerson: '',
  phoneNum: '',
  address: '',
  gstin: '',
  pan: '',
  contractDate: '',
  status: Status.active,
};

/* Default Post Docs Form Data */
const defaultPostDocsFormData: PostDocuments = {
  postName: '',
  docContract: new File([], ''),
  docGst: new File([], ''),
  docPan: new File([], ''),
  docOther: new File([], ''),
};

/* Initial Requried Ranks Row Data */
const initialRanksRowData: PostRankLink = {
  postId: 0,
  rankId: 0,
  designation: '',
  basicSalary: 0,
  hra: 0,
  // vda: 0,
  kitWashingAllowance: 0,
  cityAllowance: 0,
  conveyance: 0,
  uniformAllowance: 0,
  // otherAllowance: 0,
  taxDeductionId: 0,
  taxDeducName: '',
  specialAllowance: 0,
  weeklyOff: 0,
};

const AddPostForm: React.FC = () => {
  /* Scroll To Top */
  useScrollToTop();

  /* Verify User Auth */
  const accessToken = useVerifyUserAuth();

  /* Navigation */
  const navigate = useNavigate();

  /* Loader */
  const [isLoading, setIsLoading] = useState(false);

  /* Error Handling */
  const { errors, handleYupError, setErrors } = useHandleYupError();
  const { handleAxiosError } = useHandleAxiosError(setErrors);

  /* Add Post Info Form Data Handling */
  const [postFormData, setPostFormData] = useState<Post>(defaultPostFormData);
  const [isPostFormSubmitted, setIsPostFormSubmitted] =
    useState<boolean>(false); // TODO: Change to false later
  const [savedPostId, setSavedPostId] = useState<number>(0);
  const [savedPostName, setSavedPostName] = useState<string>('');

  // const handlePostFormInputChange = (
  //   e: React.ChangeEvent<HTMLInputElement>
  // ) => {
  //   const { name, value } = e.target;
  //   setPostFormData((prevData) => ({
  //     ...prevData,
  //     [name]: value,
  //   }));
  //   setPostInfoChanged(true);
  // };

  const handlePostFormInputChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;

    setPostFormData((prevData) => {
      let updatedValue: string | number = value;

      if (name === 'phoneNum') {
        let numericValue = value.replace(/\D/g, ''); // Keep only digits
        numericValue = numericValue.slice(0, 10); // Limit to 10 digits

        updatedValue = numericValue; // Keep as string or convert to number

        // Set validation error if not 10 digits
        setErrors((prev) => ({
          ...prev,
          phoneNum:
            numericValue.length < 10 ? 'Phone number must be 10 digits' : '',
        }));
      }

      return {
        ...prevData,
        [name]: updatedValue,
      };
    });

    setPostInfoChanged(true);
  };

  // date copy function

  type DateFieldName = 'contractDate';

  // Define dobRefs with specific keys
  const dobRefs: Record<
    DateFieldName,
    React.MutableRefObject<HTMLInputElement | null>
  > = {
    contractDate: useRef<HTMLInputElement | null>(null),
  };
  // State to track copy status
  // const [isCopied, setIsCopied] = useState({
  //   dob: false,
  //   dateOfJoining: false,
  // });
  const [isCopied, setIsCopied] = useState<Record<DateFieldName, boolean>>({
    contractDate: false,
  });

  const handleCopyDob = (
    e: React.MouseEvent<HTMLButtonElement>,
    dateFieldName: DateFieldName // Use the specific type instead of string
  ) => {
    e.stopPropagation();
    e.preventDefault();

    const ref = dobRefs[dateFieldName]; // TypeScript now knows this is safe
    if (ref && ref.current) {
      const dateValue = ref.current.value;

      // Copy the date to the clipboard
      navigator.clipboard
        .writeText(dateValue)
        .then(() => {
          setIsCopied((prev) => ({
            ...prev,
            [dateFieldName]: true,
          }));
          console.log(`${dateFieldName} copied to clipboard:`, dateValue);

          // Revert "Copied" back to "Copy" after 2 seconds
          setTimeout(() => {
            setIsCopied((prev) => ({
              ...prev,
              [dateFieldName]: false,
            }));
          }, 2000);
        })
        .catch((err) => {
          console.error('Failed to copy to clipboard:', err);
        });
    }
  };

  const handleEditPost = (id: number) => {
    console.log('trying to edit post');
    navigate(`/paytrack/posts/edit-post?id=${id}`);
  };

  const handleSubmitPostForm = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      setErrors({});

      // **Manually validate phone number before Yup validation**
      // if (postFormData.phoneNum && postFormData.phoneNum.length !== 10) {
      //   setErrors((prev) => ({
      //     ...prev,
      //     phoneNum: 'Phone number must be exactly 10 digits',
      //   }));
      //   setIsLoading(false);
      //   return; // ⛔ Prevent form submission if invalid phone number
      // }
      const phoneNumber = postFormData.phoneNum
        ? String(postFormData.phoneNum).trim()
        : '';

      if (!/^\d{10}$/.test(phoneNumber)) {
        setErrors((prev) => ({
          ...prev,
          phoneNum: 'Phone number must be exactly 10 digits',
        }));
        setIsLoading(false);
        return; // ⛔ Prevent form submission if invalid phone number
      } else {
        setErrors((prev) => {
          const { phoneNum, ...rest } = prev;
          console.log(phoneNum);
          return rest; // ✅ Remove phoneNum error if valid
        });
      }

      // yup validation
      await postValidationSchema.validate(postFormData, { abortEarly: false });
      let response;
      if (!isPostFormSubmitted) {
        response = await axios.post(`${api.baseUrl}/posts`, postFormData, {
          headers: {
            'Content-Type': 'application/json',
            'x-access-token': accessToken,
          },
        });

        if (response.data.success) {
          toast.success(response.data.message);
          const postId = response.data.post.ID;
          const postName = postFormData.postName;
          handleEditPost(response.data.post.ID);
          setIsPostFormSubmitted(true);
          setSavedPostId(postId);
          setSavedPostName(postName);
          setPostInfoChanged(false);
          fetchPostData();
        }
      } else {
        if (postInfoChanged) {
          response = await axios.patch(
            `${api.baseUrl}/posts/${savedPostId}`,
            postFormData,
            {
              headers: {
                'Content-Type': 'application/json',
                'x-access-token': accessToken,
              },
            }
          );
          if (response.data.success) {
            toast.success(response.data.message);
            setPostInfoChanged(false);
          }
        }
        if (
          requiredRanks.length > 0
          // &&
          // requiredRanks[0].basicSalary !== undefined &&
          // requiredRanks[0]!.basicSalary > 0
        ) {
          handleSubmitRequiredRanks(requiredRanks, savedPostId);
        }
        if (postFilesChanged) {
          handleSubmitPostDocs(e);
        }
      }
    } catch (error) {
      if (error instanceof Yup.ValidationError) {
        handleYupError(error);
      } else {
        handleAxiosError(error as AxiosError);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const fetchPostData = async () => {
    if (!savedPostId) return;
    setIsLoading(true);
    try {
      const response = await axios.get(`${api.baseUrl}/posts/${savedPostId}`, {
        headers: {
          'x-access-token': accessToken,
        },
      });
      if (response.data.success) {
        setPostFormData({
          ...response.data.post,
          phoneNum: Number(response.data.post.phoneNum),
          contractDate: formatDateToYMD(response.data.post.contractDate),
        });
        setPostDocsFormData({
          postName: response.data.post.postName || '',
          docContract: response.data.post.docContract || new File([], ''),
          docGst: response.data.post.docGst || new File([], ''),
          docPan: response.data.post.docPan || new File([], ''),
          docOther: response.data.post.docOther || new File([], ''),
        });
      }
    } catch (error) {
      if (error instanceof Yup.ValidationError) {
        handleYupError(error);
      } else {
        handleAxiosError(error as AxiosError);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPostData();
  }, [savedPostId]);

  /* Required Ranks Data Handling */
  const [requiredRanks, setRequiredRanks] = useState<PostRankLink[]>([
    initialRanksRowData,
  ]);
  const [existingPostRankLinksData, setExistingPostRankLinksData] = useState<
    PostRankLink[]
  >([]);
  const [isRankFormSubmitted, setIsRankFormSubmitted] =
    useState<boolean>(false);
  const [resetTaxDropdown, setResetTaxDropdown] = useState(false);

  useEffect(() => {
    if (resetTaxDropdown) {
      setResetTaxDropdown(false);
    }
  }, [resetTaxDropdown]);

  const validateRequiredRanks = async () => {
    let hasErrors = false;
    for (const rank of requiredRanks) {
      try {
        await requiredRanksValidationSchema.validate(rank, {
          abortEarly: false,
        });
      } catch (error) {
        if (error instanceof Yup.ValidationError) {
          handleYupError(error);
          hasErrors = true;
        }
      }
    }
    return hasErrors;
  };

  const handleSubmitRequiredRanks = async (
    selectedRanksData: PostRankLink[],
    postId: number
  ) => {
    console.log('trying to submit required ranks');
    setIsLoading(true);
    if (!requiredRanks || !accessToken) return;

    const hasErrors = await validateRequiredRanks();
    console.log('Does required ranks have error', hasErrors);
    if (!hasErrors) {
      try {
        for (const postRank of selectedRanksData) {
          const postRankLinkData = {
            postId,
            postRankId: postRank.ID,
            basicSalary: postRank.basicSalary,
            hra: postRank.hra,
            // vda: postRank.vda,
            kitWashingAllowance: postRank.kitWashingAllowance,
            cityAllowance: postRank.cityAllowance,
            conveyance: postRank.conveyance,
            uniformAllowance: postRank.uniformAllowance,
            // otherAllowance: postRank.otherAllowance,
            specialAllowance: postRank.specialAllowance,
            weeklyOff: postRank.weeklyOff,
            taxDeductionId: postRank.taxDeductionId,
          };

          const response = await axios.post(
            `${api.baseUrl}/posts/${postId}/link-rank/${postRank.ID}`,
            postRankLinkData,
            {
              headers: {
                'x-access-token': accessToken,
              },
            }
          );

          if (response.data.success) {
            toast.success(response.data.message);
            setRequiredRanks([initialRanksRowData]);
            setResetTaxDropdown(true);
            setIsRankFormSubmitted(true);
            fetchPostRanks();
          }
        }
      } catch (error) {
        handleAxiosError(error as AxiosError);
      }
    }
    setIsLoading(false);
  };

  const fetchPostRanks = async () => {
    console.log('tried to refresh');
    if (!savedPostId || !accessToken) return;
    setIsLoading(true);
    try {
      const response = await axios.get(
        `${api.baseUrl}${api.posts}/${savedPostId}/link-rank`,
        {
          headers: {
            'x-access-token': accessToken,
          },
        }
      );

      if (response.data && response.data.success) {
        const allPostRanks = response.data.postRankLinks;
        // console.log('allPostRanks:', allPostRanks);
        setExistingPostRankLinksData(allPostRanks);
      }
    } catch (error) {
      setExistingPostRankLinksData([]);
      if (error instanceof Yup.ValidationError) {
        handleYupError(error);
      } else {
        handleAxiosError(error as AxiosError);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // useEffect(() => {
  //   if (!accessToken) return;
  //   fetchPostRanks();
  // }, [accessToken]);
  // useEffect(() => {
  //   if (!isPostFormSubmitted || !accessToken || !isRankFormSubmitted) return;
  //   fetchPostRanks();
  // }, [accessToken, isPostFormSubmitted, isRankFormSubmitted]);

  const updateRequiredRanks = (selectedRanks: PostRankLink[]) => {
    setRequiredRanks(selectedRanks);
  };

  /* Add Post Docs Form Data Handling */
  const [postDocsFormData, setPostDocsFormData] = useState<PostDocuments>(
    defaultPostDocsFormData
  );
  const [postFilesChanged, setPostFilesChanged] = useState<boolean>(false);
  const [postInfoChanged, setPostInfoChanged] = useState<boolean>(false);

  const handleFilesInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;
    if (files) {
      setPostDocsFormData((prevData) => ({
        ...prevData,
        [name]: files[0],
      }));
      setPostFilesChanged(true);
    }
  };

  const handleSubmitPostDocs = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // console.log('now running post docs form submit');
    try {
      //  setErrors({});
      //  await postValidationSchema.validate(postFormData, { abortEarly: false });
      if (
        !isPostFormSubmitted ||
        !savedPostId ||
        !postDocsFormData ||
        !postFilesChanged
      )
        return;
      postDocsFormData.postName = savedPostName;
      const response = await axios.post(
        `${api.baseUrl}/posts/${savedPostId}/upload`,
        postDocsFormData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            'x-access-token': accessToken,
          },
        }
      );

      if (response.data.success) {
        toast.success(response.data.message);
        setPostFilesChanged(false);
        // setPostDocsFormData(defaultPostDocsFormData);
        setPostDocsFormData({
          // postName: response.data.updatedPost.postName || '',
          docContract:
            response.data.updatedPost.docContract || new File([], ''),
          docGst: response.data.updatedPost.docGst || new File([], ''),
          docPan: response.data.updatedPost.docPan || new File([], ''),
          docOther: response.data.updatedPost.docOther || new File([], ''),
        });
        fetchPostData();
      }
    } catch (error) {
      if (error instanceof Yup.ValidationError) {
        handleYupError(error);
      } else {
        handleAxiosError(error as AxiosError);
      }
    } finally {
      setIsLoading(false);
    }
  };

  /* Delete File Modal Handling */
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [deleteFileName, setDeleteFileName] = useState<string>('');

  const handleDeleteFile = (fieldName: string) => {
    setPostDocsFormData((prevData) => ({
      ...prevData,
      [fieldName]: '',
    }));
    setShowDeleteModal(false);
  };

  // Test use effect
  useEffect(() => {
    // console.log('isRankFormSubmitted:', isRankFormSubmitted);
    // console.log('post doc form data: ', postDocsFormData);
    // console.log('post form data: ', postFormData);
    // console.log('saved post id is: ', savedPostId);
    // console.log('is post form submitted: ', isPostFormSubmitted);
    // console.log('is post files changed: ', postFilesChanged);
    // console.log('is post info changed: ', postInfoChanged);
    // console.log('existingPostRanks:', existingPostRankLinksData);
    console.log('requiredRanks:', requiredRanks);
    // console.log('disabledSelects:', disabledSelects);
    // console.log('selectedRankIds:', selectedRankIds);
    // console.log('selectedRanksData:', selectedRanksData);
    console.log('Errors: ', errors);
  });

  // JSX
  return (
    <>
      {isLoading && <Loader />}
      {/* breadcrumb and back button */}
      <div className="flex flex-col gap-2.5 2xl:gap-4 fixed z-20 padding-responsive-header-container-type-1">
        <BreadCrumb />
        <div className="flex ">
          <button
            onClick={() => navigate(-1)}
            className="flex w-fit items-center gap-1 2xl:gap-2"
          >
            <img
              src={Arrow_Back_Blue}
              alt="Arrow_Back_Blue"
              className="back-button-icon"
            />
            <button className="text-bgPrimaryButton hover:text-bgPrimaryButtonHover font-Mona_Sans text-responsive-button font-semibold">
              Back
            </button>
          </button>
        </div>
      </div>
      {/* form starts here */}
      <div className="bg-white mt-[70px] 2xl:mt-[92px] z-10 overflow-y-auto h-[calc(100vh-108px)] scrollbar scrollbar-thumb-scrollBarColor scrollbar-track-scrollBarBg">
        <form
          onSubmit={handleSubmitPostForm}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              handleSubmitPostForm(e);
            }
          }}
          className="w-[100%] mx-auto "
        >
          {/* <form onSubmit={handleSubmitPostDocs} className="w-[100%] mx-auto "> */}
          {/* Accordion 1 */}
          <Accordion title="Post Information">
            <div className="flex flex-col gap-4 2xl:gap-6 pb-4 2xl:pb-6 w-full">
              {/* First row */}
              <div className="flex justify-between gap-4 2xl:gap-6">
                {/* post name */}
                <div className="flex flex-col gap-1 2xl:gap-2 w-1/4 cursor-pointer">
                  <label className="input-label">
                    Post Name <span className="input-error pl-1">*</span>
                  </label>
                  <input
                    type="text"
                    name="postName"
                    disabled={isPostFormSubmitted}
                    value={postFormData.postName}
                    onChange={handlePostFormInputChange}
                    className="px-2 w-full h-10 2xl:h-12 text-responsive-input rounded-md shadow-sm border border-inputBorder"
                  />
                  {errors.postName && (
                    <p className="input-error">{errors.postName}</p>
                  )}
                </div>
                {/* contact person */}
                <div className="flex flex-col gap-1 2xl:gap-2 w-1/4 cursor-pointer">
                  <label className="input-label">Contact Person</label>
                  <input
                    type="text"
                    name="contactPerson"
                    value={postFormData.contactPerson || ''}
                    onChange={handlePostFormInputChange}
                    className="px-2 w-full h-10 2xl:h-12 text-responsive-input rounded-md shadow-sm border border-inputBorder"
                  />
                  {errors.contactPerson && (
                    <p className="input-error">{errors.contactPerson}</p>
                  )}
                </div>
                {/* phone */}
                <div className="flex flex-col gap-1 2xl:gap-2 w-1/4 cursor-pointer">
                  <label className="input-label">Phone</label>
                  <input
                    type="text"
                    name="phoneNum"
                    onKeyDown={(e) => {
                      if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
                        e.preventDefault();
                      }
                    }}
                    onWheel={(e) => e.currentTarget.blur()}
                    maxLength={10}
                    value={postFormData.phoneNum || ''}
                    onChange={handlePostFormInputChange}
                    className="px-2 w-full h-10 2xl:h-12 text-responsive-input rounded-md shadow-sm border border-inputBorder"
                  />
                  {errors.phoneNum && (
                    <p className="input-error">{errors.phoneNum}</p>
                  )}
                </div>
                {/* GSTIN */}
                <div className="flex flex-col gap-1 2xl:gap-2 w-1/4 cursor-pointer">
                  <label className="input-label">
                    GSTIN <span className=" input-error pl-1">*</span>
                  </label>
                  <input
                    type="text"
                    name="gstin"
                    value={postFormData.gstin || ''}
                    onChange={handlePostFormInputChange}
                    className="px-2 w-full h-10 2xl:h-12 text-responsive-input rounded-md shadow-sm border border-inputBorder"
                  />
                  {errors.gstin && (
                    <p className="input-error">{errors.gstin}</p>
                  )}
                </div>
              </div>

              {/* Second row */}
              <div className="flex justify-between gap-4 2xl:gap-6">
                {/* address */}
                <div className="flex flex-col gap-1 2xl:gap-2 w-[54%] xl:w-[53%]">
                  <label className="input-label">
                    Address <span className="input-error pl-1">*</span>
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={postFormData.address || ''}
                    onChange={handlePostFormInputChange}
                    className="px-2 w-full h-10 2xl:h-12 text-responsive-input rounded-md shadow-sm border border-inputBorder"
                  />
                  {errors.address && (
                    <p className="input-error">{errors.address}</p>
                  )}
                </div>
                {/* pan no */}
                <div className="flex flex-col gap-1 2xl:gap-2 w-1/4">
                  <label className="input-label">PAN No.</label>
                  <input
                    type="text"
                    name="pan"
                    value={postFormData.pan || ''}
                    onChange={handlePostFormInputChange}
                    className="px-2 w-full h-10 2xl:h-12 text-responsive-input rounded-md shadow-sm border border-inputBorder"
                  />
                  {errors.pan && <p className="input-error">{errors.pan}</p>}
                </div>
                {/*                {/* contract date */}
                <div className="flex flex-col gap-1 2xl:gap-2 w-1/4">
                  <label className="input-label flex flex-row justify-between">
                    <div>
                      Contract Date
                      <span className=" input-error pl-1">*</span>
                    </div>
                    <div>
                      {/* Conditionally render the Copy button if D.O.B is entered */}
                      {postFormData.contractDate && (
                        <button
                          type="button"
                          onClick={(e) => {
                            handleCopyDob(e, 'contractDate');
                          }}
                          className={` rounded-md ${
                            isCopied.contractDate
                              ? 'text-green-500 '
                              : 'input-label'
                          }`}
                        >
                          {isCopied.contractDate ? 'Copied' : 'Copy'}
                        </button>
                      )}
                    </div>
                  </label>
                  <input
                    type="date"
                    name="contractDate"
                    ref={dobRefs.contractDate}
                    onChange={handlePostFormInputChange}
                    value={postFormData.contractDate || ''}
                    className="px-2 w-full h-10 2xl:h-12 text-responsive-input rounded-md shadow-sm border border-inputBorder"
                  />
                  {errors.contractDate && (
                    <p className="input-error">{errors.contractDate}</p>
                  )}
                </div>
              </div>
            </div>
          </Accordion>
          {/* Accordion 2 */}
          <div
            data-tooltip-id="postDetails"
            data-tooltip-content="Fill and save the post information first to add the required ranks."
          >
            <Accordion title="Required Ranks" disabled={!isPostFormSubmitted}>
              <RequiredRanks
                existingPostRanks={existingPostRankLinksData}
                refreshPostRanks={fetchPostRanks}
                updateRequiredRanks={updateRequiredRanks}
                requiredRanks={requiredRanks}
                // resetTaxDropdown={resetTaxDropdown}
              />
              {errors && Object.keys(errors).length > 0 && (
                <p className="input-error">{Object.values(errors)[0]}</p>
              )}
            </Accordion>
          </div>
          {/* Schedule Buttons */}
          {/* <div
            className="flex justify-center gap-4 my-4"
            data-tooltip-id="postDetails"
            data-tooltip-content="Fill and save the post information and assign ranks to begin scheduling employees."
          ></div> */}
          {/* Accordion 3 */}
          <div
            data-tooltip-id="postDetails"
            data-tooltip-content="Fill and save the post information to upload documents."
          >
            <Accordion
              title="Upload Documents"
              disabled={
                !isPostFormSubmitted || !existingPostRankLinksData.length
              }
            >
              <div className="flex flex-col items-center lg:items-stretch gap-4 px-4 pb-20 border-b">
                <div className="flex flex-col lg:flex-row justify-between gap-6 sm:gap-8">
                  {/* Contract */}
                  <div className="flex flex-col gap-2 cursor-pointer">
                    <label className=" font-medium text-secondaryText">
                      Contract
                    </label>
                    <input
                      id="docContract"
                      type="file"
                      name="docContract"
                      onChange={handleFilesInputChange}
                      className="hidden"
                      accept=".pdf,.jpg,.jpeg,.png,.doc,.docx,.xls,.xlsx" // Adjust as needed
                    />
                    <div className="flex flex-row gap-2">
                      {postDocsFormData.docContract &&
                      typeof postDocsFormData.docContract === 'string' ? (
                        <>
                          <a
                            href={postDocsFormData.docContract}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 px-4 h-[50px] rounded-md shadow-sm border border-inputBorder cursor-pointer hover:shadow-md"
                          >
                            <img
                              src={getFileIcon(
                                extractFileNameFromPath(
                                  postDocsFormData.docContract
                                ) || ''
                              )}
                              alt="File Icon"
                              className="w-7 h-7"
                            />
                            <span className="text-labelColour font-medium text-sm md:text-base">
                              {extractFileNameFromPath(
                                postDocsFormData.docContract
                              ) || 'Upload Document'}
                            </span>
                          </a>
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              // handleDeleteFile('docContract');
                              setDeleteFileName('docContract');
                              setShowDeleteModal(true);
                            }}
                          >
                            <img src={Delete_Icon} alt="Delete" />
                          </button>
                        </>
                      ) : postDocsFormData.docContract &&
                        postDocsFormData.docContract instanceof File &&
                        postDocsFormData.docContract.name !== '' ? (
                        <label
                          htmlFor="docContract"
                          className="flex items-center gap-2 px-4 h-[50px] rounded-md shadow-sm border border-inputBorder cursor-pointer hover:shadow-md"
                        >
                          <img
                            src={getFileIcon(
                              extractNameFromFileObj(
                                postDocsFormData.docContract as File
                              ) || ''
                            )}
                            alt="File Icon"
                            className="w-7 h-7"
                          />
                          <span className="text-labelColour font-medium text-sm md:text-base">
                            {extractNameFromFileObj(
                              postDocsFormData.docContract as File
                            )}
                          </span>
                        </label>
                      ) : (
                        <label
                          htmlFor="docContract"
                          className="flex items-center gap-2 px-4 h-[50px] rounded-md shadow-sm border border-inputBorder cursor-pointer hover:shadow-md"
                        >
                          <img
                            src={getFileIcon('')}
                            alt="File Icon"
                            className="w-7 h-7"
                          />
                          <span className="text-labelColour font-medium text-sm md:text-base">
                            Upload Document
                          </span>
                        </label>
                      )}
                    </div>
                  </div>

                  {/* GSTIN */}
                  <div className="flex flex-col gap-2 cursor-pointer">
                    <label className=" font-medium text-secondaryText">
                      GSTIN
                    </label>
                    <input
                      id="docGst"
                      type="file"
                      name="docGst"
                      onChange={handleFilesInputChange}
                      className="hidden"
                      accept=".pdf,.jpg,.jpeg,.png,.doc,.docx,.xls,.xlsx"
                    />
                    <div className="flex flex-row gap-2">
                      {postDocsFormData.docGst &&
                      typeof postDocsFormData.docGst === 'string' ? (
                        <>
                          <a
                            href={postDocsFormData.docGst}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 px-4 h-[50px] rounded-md shadow-sm border border-inputBorder cursor-pointer hover:shadow-md"
                          >
                            <img
                              src={getFileIcon(
                                extractFileNameFromPath(
                                  postDocsFormData.docGst
                                ) || ''
                              )}
                              alt="File Icon"
                              className="w-7 h-7"
                            />
                            <span className="text-labelColour font-medium text-sm md:text-base">
                              {extractFileNameFromPath(
                                postDocsFormData.docGst
                              ) || 'Upload Document'}
                            </span>
                          </a>
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              setDeleteFileName('docGst');
                              setShowDeleteModal(true);
                            }}
                          >
                            <img src={Delete_Icon} alt="Delete" />
                          </button>
                        </>
                      ) : postDocsFormData.docGst &&
                        postDocsFormData.docGst instanceof File &&
                        postDocsFormData.docGst.name !== '' ? (
                        <label
                          htmlFor="docGst"
                          className="flex items-center gap-2 px-4 h-[50px] rounded-md shadow-sm border border-inputBorder cursor-pointer hover:shadow-md"
                        >
                          <img
                            src={getFileIcon(
                              extractNameFromFileObj(
                                postDocsFormData.docGst as File
                              ) || ''
                            )}
                            alt="File Icon"
                            className="w-7 h-7"
                          />
                          <span className="text-labelColour font-medium text-sm md:text-base">
                            {extractNameFromFileObj(
                              postDocsFormData.docGst as File
                            )}
                          </span>
                        </label>
                      ) : (
                        <label
                          htmlFor="docGst"
                          className="flex items-center gap-2 px-4 h-[50px] rounded-md shadow-sm border border-inputBorder cursor-pointer hover:shadow-md"
                        >
                          <img
                            src={getFileIcon('')}
                            alt="File Icon"
                            className="w-7 h-7"
                          />
                          <span className="text-labelColour font-medium text-sm md:text-base">
                            Upload Document
                          </span>
                        </label>
                      )}
                    </div>
                  </div>

                  {/* PAN Card */}
                  <div className="flex flex-col gap-2 cursor-pointer">
                    <label className=" font-medium text-secondaryText">
                      PAN Card
                    </label>
                    <input
                      id="docPan"
                      type="file"
                      name="docPan"
                      onChange={handleFilesInputChange}
                      className="hidden"
                      accept=".pdf,.jpg,.jpeg,.png,.doc,.docx,.xls,.xlsx"
                    />
                    <div className="flex flex-row gap-2">
                      {postDocsFormData.docPan &&
                      typeof postDocsFormData.docPan === 'string' ? (
                        <>
                          <a
                            href={postDocsFormData.docPan}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 px-4 h-[50px] rounded-md shadow-sm border border-inputBorder cursor-pointer hover:shadow-md"
                          >
                            <img
                              src={getFileIcon(
                                extractFileNameFromPath(
                                  postDocsFormData.docPan
                                ) || ''
                              )}
                              alt="File Icon"
                              className="w-7 h-7"
                            />
                            <span className="text-labelColour font-medium text-sm md:text-base">
                              {extractFileNameFromPath(
                                postDocsFormData.docPan
                              ) || 'Upload Document'}
                            </span>
                          </a>
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              setDeleteFileName('docPan');
                              setShowDeleteModal(true);
                            }}
                          >
                            <img src={Delete_Icon} alt="Delete" />
                          </button>
                        </>
                      ) : postDocsFormData.docPan &&
                        postDocsFormData.docPan instanceof File &&
                        postDocsFormData.docPan.name !== '' ? (
                        <label
                          htmlFor="docPan"
                          className="flex items-center gap-2 px-4 h-[50px] rounded-md shadow-sm border border-inputBorder cursor-pointer hover:shadow-md"
                        >
                          <img
                            src={getFileIcon(
                              extractNameFromFileObj(
                                postDocsFormData.docPan as File
                              ) || ''
                            )}
                            alt="File Icon"
                            className="w-7 h-7"
                          />
                          <span className="text-labelColour font-medium text-sm md:text-base">
                            {extractNameFromFileObj(
                              postDocsFormData.docPan as File
                            )}
                          </span>
                        </label>
                      ) : (
                        <label
                          htmlFor="docPan"
                          className="flex items-center gap-2 px-4 h-[50px] rounded-md shadow-sm border border-inputBorder cursor-pointer hover:shadow-md"
                        >
                          <img
                            src={getFileIcon('')}
                            alt="File Icon"
                            className="w-7 h-7"
                          />
                          <span className="text-labelColour font-medium text-sm md:text-base">
                            Upload Document
                          </span>
                        </label>
                      )}
                    </div>
                  </div>

                  {/* Others */}
                  <div className="flex flex-col gap-2 cursor-pointer">
                    <label className=" font-medium text-secondaryText">
                      Others
                    </label>
                    <input
                      id="docOther"
                      type="file"
                      name="docOther"
                      onChange={handleFilesInputChange}
                      className="hidden"
                      accept=".pdf,.jpg,.jpeg,.png,.doc,.docx,.xls,.xlsx"
                    />
                    <div className="flex flex-row gap-2">
                      {postDocsFormData.docOther &&
                      typeof postDocsFormData.docOther === 'string' ? (
                        <>
                          <a
                            href={postDocsFormData.docOther}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 px-4 h-[50px] rounded-md shadow-sm border border-inputBorder cursor-pointer hover:shadow-md"
                          >
                            <img
                              src={getFileIcon(
                                extractFileNameFromPath(
                                  postDocsFormData.docOther
                                ) || ''
                              )}
                              alt="File Icon"
                              className="w-7 h-7"
                            />
                            <span className="text-labelColour font-medium text-sm md:text-base">
                              {extractFileNameFromPath(
                                postDocsFormData.docOther
                              ) || 'Upload Document'}
                            </span>
                          </a>
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              setDeleteFileName('docOther');
                              setShowDeleteModal(true);
                            }}
                          >
                            <img src={Delete_Icon} alt="Delete" />
                          </button>
                        </>
                      ) : postDocsFormData.docOther &&
                        postDocsFormData.docOther instanceof File &&
                        postDocsFormData.docOther.name !== '' ? (
                        <label
                          htmlFor="docOther"
                          className="flex items-center gap-2 px-4 h-[50px] rounded-md shadow-sm border border-inputBorder cursor-pointer hover:shadow-md"
                        >
                          <img
                            src={getFileIcon(
                              extractNameFromFileObj(
                                postDocsFormData.docOther as File
                              ) || ''
                            )}
                            alt="File Icon"
                            className="w-7 h-7"
                          />
                          <span className="text-labelColour font-medium text-sm md:text-base">
                            {extractNameFromFileObj(
                              postDocsFormData.docOther as File
                            )}
                          </span>
                        </label>
                      ) : (
                        <label
                          htmlFor="docOther"
                          className="flex items-center gap-2 px-4 h-[50px] rounded-md shadow-sm border border-inputBorder cursor-pointer hover:shadow-md"
                        >
                          <img
                            src={getFileIcon('')}
                            alt="File Icon"
                            className="w-7 h-7"
                          />
                          <span className="text-labelColour font-medium text-sm md:text-base">
                            Upload Document
                          </span>
                        </label>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </Accordion>
          </div>
          <div className="flex justify-center gap-6 py-4 mb-4">
            <ClearButton
              type="button"
              onClick={() => setPostFormData(defaultPostFormData)}
            >
              Clear
            </ClearButton>
            <SmallButton type="submit">Save</SmallButton>
          </div>
        </form>
        {/* <Tooltip
          hidden={isPostFormSubmitted}
          id="postDetails"
          content="Post Information"
          place="right"
        /> */}
        <Tooltip
          hidden={!isPostFormSubmitted || isRankFormSubmitted}
          id="rankDetails"
          content="Rank Information"
          place="right"
        />
        {showDeleteModal && (
          <ConfirmationModal
            confirmButtonTitle="Delete"
            cancelButtonTitle="Cancel"
            onConfirm={() => {
              handleDeleteFile(deleteFileName);
            }}
            onCancel={() => setShowDeleteModal(false)}
            message={`Are you sure you want to delete the ${getLabel(
              deleteFileName
            )}?`}
          />
        )}
      </div>
    </>
  );
};

export default AddPostForm;
