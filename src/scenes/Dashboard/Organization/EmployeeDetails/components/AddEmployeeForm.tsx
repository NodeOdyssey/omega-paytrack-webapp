/* Libraries */
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router';
import { toast } from 'react-toastify';
import { Tooltip } from 'react-tooltip';
import axios, { AxiosError } from 'axios';
import Cropper from 'react-easy-crop';
import * as Yup from 'yup';

/* Configs */
import { api } from '../../../../../configs/api';

/* Hooks */
import useScrollToTop from '../../../../../hooks/useScrollToTop';
import useVerifyUserAuth from '../../../../../hooks/useVerifyUserAuth';
import useHandleAxiosError from '../../../../../hooks/useHandleAxiosError';
import useHandleYupError from '../../../../../hooks/useHandleYupError';

/* Types */
import { Employee, EmployeeDocuments } from '../../../../../types/employee';
import { PostRankLink } from '../../../../../types/postRankLink';
import { Post } from '../../../../../types/post';

/* Helpers */
import {
  getFileIcon,
  extractNameFromFileObj,
  extractFileNameFromPath,
  formatDateToYMD,
  getLabel,
  // getFormattedDateYyyyMmDdDash,
  formatDateDdMmYyyySlash,
} from '../../../../../utils/formatter';

// Components
import BreadCrumb from '../../../../../common/BreadCrumb/BreadCrumb';
import Accordion from '../../../../../common/Accordion/Accordion';
import ClearButton from '../../../../../common/Button/ClearButton';
import SmallButton from '../../../../../common/Button/SmallButton';
import Loader from '../../../../../common/Loader/Loader';
import ConfirmationModal from '../../../../../common/Modal/ConfirmationModal';
import EmployeeDischargeModal from '../../../../../common/Modal/EmployeeDischargeModal';
import EmployeeTransferModal from '../../../../../common/Modal/EmployeeTransferModal';

// Assets
import {
  // Arrow_Back,
  Arrow_Back_Blue,
  CheckGreen,
  Delete_Icon,
  EditPencil_Icon,
  TableOptionsIcon,
} from '../../../../../assets/icons';
// import { ProfileImg } from '../../../../../assets/images';
import PrimaryButton from '../../../../../common/Button/PrimaryButton';
import useClickOutside from '../../../../../hooks/useClickOutside';
// import GenderDropdown from '../../../../../common/GenderDropdown/GenderDropdown';
// import StateDropDown from '../../../../../common/StateDropDown/StateDropDown';
import { indianStates } from '../../../../../content/addEmployeeFormContent';
import { getCroppedImg } from '../../../../../utils/cropImage';

/* Types */
type EmployeeSchedule = {
  ID?: number & { __brand: 'unique' };
  postRankLinkId: number;
  postName: string;
  rankName: string;
  dateOfPosting: Date | null;
};

/* Form Validation Schema */
const employeeValidationSchema = Yup.object().shape({
  empName: Yup.string().required('Full Name is required'),
  fatherName: Yup.string().required(`Father's Name is required`),
  gender: Yup.string().required(`Gender is required`),
  dob: Yup.string().required(`Date of Birth is required`),
  phoneNum: Yup.string()
    .required('Phone Number is required')
    .matches(/^\d{10}$/, 'Phone Number must be exactly 10 digits')
    .test(
      'is-not-negative',
      'Phone number cannot contain negative values',
      (value) => !value?.includes('-') // Ensure no negative signs
    ),
  // altPhoneNum: Yup.string().test(
  //   'is-valid-phone',
  //   'Phone Number must be exactly 10 digits and cannot contain negative values',
  //   (value) => /^\d{10}$/.test(value ?? '') && !value?.includes('-') // Ensure 10 digits and no negative signs
  // ),
  // .test(
  //   'is-not-negative',
  //   'Phone number cannot contain negative values',
  //   (value) => !value?.includes('-') // Ensure no negative signs
  // ),
  villTown: Yup.string().required('Village/City/Town is required'),
  postOffice: Yup.string().required('Post Office is required'),
  policeStation: Yup.string().required('Police Station is required'),
  district: Yup.string().required('District is required'),
  pinCode: Yup.string()
    .required('Pin Code is required')
    .matches(/^\d{6}$/, 'Pincode must be exactly 6 digits')
    .test(
      'is-not-negative',
      'Pincode cannot contain negative values',
      (value) => !value?.includes('-') // Ensure no negative signs
    ),
  state: Yup.string().required('State is required'),
  qualification: Yup.string().required('Qualification is required'),
  // epfNo: Yup.string().required('EPF No is required'),
  // esiNo: Yup.string().required('ESIC No is required'),
  // pan: Yup.string().required('PAN No is required'),
  // aadhaarNo: Yup.string()
  //   //   .required('Aadhaar No is required')
  //   .optional()
  //   .matches(/^\d{12}$/, 'Aadhaar No must be exactly 12 digits'),
  dateOfJoining: Yup.string().required('Date of Joining is required'),
});

/* Default Employee Info Form Data */
const defaultEmployeeFormData: Employee = {
  empId: '',
  empName: '',
  fatherName: '',
  motherName: '',
  gender: '',
  dob: null,
  phoneNum: '',
  altPhoneNum: '',
  villTown: '',
  postOffice: '',
  policeStation: '',
  district: '',
  pinCode: '',
  state: '',
  qualification: '',
  height: 0,
  idMark: '',
  bankName: '',
  accNum: '',
  ifsc: '',
  epfNo: '',
  esiNo: '',
  pan: '',
  aadhaarNo: '',
  isPosted: false,
  dateOfJoining: null,
  bloodGroup: '',
  remarks: '',
  dateOfRejoining: null,
};

/* Default Employee Docs Form Data */
const defaultEmployeeDocsFormData: EmployeeDocuments = {
  empName: '',
  profilePhoto: new File([], ''),
  docContract: new File([], ''),
  docResume: new File([], ''),
  docPan: new File([], ''),
  docOther: new File([], ''),
  docAadhaar: new File([], ''),
};

// Assam Districts List
const assamDistricts = [
  'Bajali',
  'Baksa',
  'Barpeta',
  'Bongaigaon',
  'Cachar',
  'Charaideo',
  'Chirang',
  'Darrang',
  'Dhemaji',
  'Dhubri',
  'Dibrugarh',
  'Dima Hasao',
  'Goalpara',
  'Golaghat',
  'Hailakandi',
  'Jorhat',
  'Kamrup',
  'Kamrup Metropolitan',
  'Karbi Anglong',
  'Karimganj',
  'Kokrajhar',
  'Lakhimpur',
  'Majuli',
  'Morigaon',
  'Nagaon',
  'Nalbari',
  'Sivasagar',
  'Sonitpur',
  'South Salmara-Mankachar',
  'Tinsukia',
  'Udalguri',
  'West Karbi Anglong',
];

// Validation schema for schedule employee data row
const scheduleEmployeeValidationSchema = Yup.object().shape({
  // currentSelectedPostId: Yup.number()
  //   .min(1, 'Please select a post')
  //   .required('Please select a post'),
  currentSelectedPostRankId: Yup.number()
    .min(1, 'Please select a rank.')
    .required('Please select a rank.'),
  transferPostingDate: Yup.string().required(
    'Please enter the date of posting.'
  ),
});

type AddEmployeeFormProps = {
  showMenu: boolean;
};

const AddEmployeeForm: React.FC<AddEmployeeFormProps> = ({ showMenu }) => {
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

  /* Add Employee Info Form Data Handling */
  const [employeeFormData, setEmployeeFormData] = useState<Employee>(
    defaultEmployeeFormData
  );
  const [isEmployeeFormSubmitted, setIsEmployeeFormSubmitted] = useState(false);
  const [savedEmployeeId, setSavedEmployeeId] = useState<number>(0);
  const [savedEmployeeName, setSavedEmployeeName] = useState<string>('');
  const [profilePhoto, setProfilePhoto] = useState<File | null>(null);
  const [uploadMessage, setUploadMessage] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  console.log('profilePhoto: ', profilePhoto);
  const [profilePhotoAddedOrChanged, setProfilePhotoAddedOrChanged] =
    useState(false);

  const uploadProfilePhoto = async (
    empTableId: number,
    newProfilePhoto?: File
  ) => {
    if (!accessToken || !empTableId) {
      return;
    }
    setIsLoading(true);
    setIsUploading(true); // Start upload
    setUploadMessage('Uploading...'); // Show "Uploading..." message

    try {
      const response = await axios.post(
        `${api.baseUrl}/employees/${empTableId}/upload`,
        employeeDocsFormData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            'x-access-token': accessToken,
          },
        }
      );
      if (response.data.success) {
        // toast.success(response.data.message);
        setUploadMessage('Photo uploaded successfully!'); // Show success message
        setIsUploading(false); // Stop uploading state
        setProfilePhoto(newProfilePhoto || new File([], ''));
        setTimeout(() => {
          setTimeout(() => setUploadMessage(''), 1000);
        }, 2000);
        toast.success('Profile photo uploaded successfully');

        setEmployeeDocsFormData((prev) => ({
          ...prev,
          profilePhoto:
            response.data.updatedEmployee.profilePhoto ||
            'https://pscpl-paytrack.s3.ap-south-1.amazonaws.com/assets/profileImg.svg',
        }));
        setProfilePhotoAddedOrChanged(false);
      }
    } catch (error) {
      handleAxiosError(error as AxiosError);
    } finally {
      setIsLoading(false);
    }
    // Upload profile photo
  };

  const handleEmployeeFormInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    // Handle district selection
    if (name === 'district') {
      if (value === 'OTHER') {
        setIsCustomDistrict(true);
        setEmployeeFormData((prevData) => ({
          ...prevData,
          [name]: customDistrict || '',
        }));
      } else {
        setIsCustomDistrict(false);
        setCustomDistrict('');
        setEmployeeFormData((prevData) => ({
          ...prevData,
          [name]: value,
        }));
      }
    } else {
      setEmployeeFormData((prevData) => ({
        ...prevData,
        [name]:
          name === 'dob' || name === 'dateOfJoining'
            ? value || null
            : name === 'gender' || name === 'state'
              ? value.toUpperCase()
              : value,
      }));
    }
    setEmployeeInfoChanged(true);
  };

  const handleCustomDistrictChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { value } = e.target;
    setCustomDistrict(value);
    setEmployeeFormData((prevData) => ({
      ...prevData,
      district: value,
    }));
    setEmployeeInfoChanged(true);
  };

  type DateFieldName = 'dob' | 'dateOfJoining';

  // Define dobRefs with specific keys
  const dobRefs: Record<
    DateFieldName,
    React.MutableRefObject<HTMLInputElement | null>
  > = {
    dob: useRef<HTMLInputElement | null>(null),

    dateOfJoining: useRef<HTMLInputElement | null>(null),
  };
  // State to track copy status
  // const [isCopied, setIsCopied] = useState({
  //   dob: false,
  //   dateOfJoining: false,
  // });
  const [isCopied, setIsCopied] = useState<Record<DateFieldName, boolean>>({
    dob: false,
    dateOfJoining: false,
  });

  const handleCopyDob = (
    e: React.MouseEvent<HTMLDivElement>,
    dateFieldName: DateFieldName // Use the specific type instead of string
  ) => {
    e.stopPropagation();
    e.preventDefault();

    const ref = dobRefs[dateFieldName]; // TypeScript now knows this is safe
    if (ref && ref.current) {
      const dateValue = ref.current.value;

      // Convert YYYY-MM-DD to DD-MM-YYYY
      const formattedDate = dateValue.split('-').reverse().join('-');

      // Copy the date to the clipboard
      navigator.clipboard
        .writeText(formattedDate)
        .then(() => {
          setIsCopied((prev) => ({
            ...prev,
            [dateFieldName]: true,
          }));
          console.log(`${dateFieldName} copied to clipboard:`, formattedDate);

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

  // const handleEmployeeFormInputChange = (
  //   e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  // ) => {
  //   const { name, value, type } = e.target;

  //   let newValue = value;

  //   // Prevent non-numeric or negative values for number inputs
  //   if (type === 'number') {
  //     newValue = value.replace(/\D/g, ''); // Allow only digits

  //     // Ensure value doesn't start with 0 (for phone or PIN)
  //     if (newValue.startsWith('0')) {
  //       newValue = newValue.slice(1);
  //     }
  //   }

  //   setEmployeeFormData((prevData) => ({
  //     ...prevData,
  //     [name]: newValue,
  //   }));
  //   setEmployeeInfoChanged(true);
  // };

  const handleSubmitEmployeeForm = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // console.log('submitting employee form....');
    try {
      setErrors({});

      // **Gender validation**
      // if (
      //   employeeFormData.gender !== 'Male' &&
      //   employeeFormData.gender !== 'Female'
      // ) {
      //   toast.error('Please select a valid gender (Male or Female).');
      //   setIsLoading(false); // Stop loading if validation fails
      //   return;
      // }

      // Validate employee data
      await employeeValidationSchema.validate(employeeFormData, {
        abortEarly: false,
      });

      let response;

      // If this is the first time employee form is submitted
      if (!isEmployeeFormSubmitted) {
        // Add the Employee
        response = await axios.post(
          `${api.baseUrl}/employees`,
          employeeFormData,
          {
            headers: {
              'Content-Type': 'application/json',
              'x-access-token': accessToken,
            },
          }
        );

        if (response.data.success) {
          // Show success message
          toast.success(response.data.message);

          // Notify
          setIsEmployeeFormSubmitted(true);
          setEmployeeInfoChanged(false);

          // Set employee id and name for the new employee
          const empTableId = response.data.employee.ID;
          const empName = response.data.employee.empName;
          setSavedEmployeeId(empTableId);
          setSavedEmployeeName(empName);

          // If profile photo is changed
          if (profilePhotoAddedOrChanged) {
            await uploadProfilePhoto(empTableId);
          }

          // If employee files have been added, upload them
          if (employeeFilesChanged && employeeDocsFormData) {
            await handleSubmitEmployeeDocs(e, empTableId);
          }

          // Set Employee Data After Adding Employee to confirm new data is added
          // fetchEmployeeData();
          setEmployeeFormData({
            ...response.data.employee,
            empId: response.data.employee.empId,
            phoneNum: Number(response.data.employee.phoneNum),
            altPhoneNum: Number(response.data.employee.altPhoneNum),
            contractDate: formatDateToYMD(response.data.employee.contractDate),
          });
          setEmployeeDocsFormData({
            empName: response.data.employee.employeeName || '',
            profilePhoto: response.data.employee.profilePhoto || '',
            docContract: response.data.employee.docContract || '',
            docResume: response.data.employee.docResume || '',
            docPan: response.data.employee.docPan || '',
            docAadhaar: response.data.employee.docAadhaar || '',
            docOther: response.data.employee.docOther || '',
          });

          // If the user has selected a post, rank and posting date for the employee for scheduling
          if (isScheduleModified) {
            // console.log('scheduling employee first go....');
            // Then schedule the employee
            await handleScheduleEmployee(response.data.employee.ID);
          }

          // Redirect to edit employee page after successful creation and all uploads
          navigate(
            `/app/organisation/employee-details/edit-employee?id=${empTableId}`
          );
        }
      }
      // Else if the employee form has been submitted before and is being updated
      else {
        // If the employee info has changed
        if (employeeInfoChanged) {
          // Update the Employee info
          response = await axios.patch(
            `${api.baseUrl}/employees/${savedEmployeeId}`,
            employeeFormData,
            {
              headers: {
                'Content-Type': 'application/json',
                'x-access-token': accessToken,
              },
            }
          );
          if (response.data.success) {
            toast.success(response.data.message);
            setEmployeeInfoChanged(false);
          }
        }

        // If the employee files have changed
        if (employeeFilesChanged) {
          await handleSubmitEmployeeDocs(e);
        }

        // If profile photo is changed
        // if (profilePhotoAddedOrChanged) {
        //   uploadProfilePhoto(savedEmployeeId);
        // }

        // If employee is being re-scheduled
        if (isScheduleModified && savedEmployeeId && currentSelectedPostId) {
          await scheduleEmployeeValidationSchema.validate(
            {
              // currentSelectedPostId,
              currentSelectedPostRankId,
              transferPostingDate: postingDate,
            },
            { abortEarly: false }
          );

          // If the employee is discharged or not scheduled yet
          if (isEmployeeDischarged || !isEmployeeScheduled) {
            // Then schedule the employee
            handleScheduleEmployee(savedEmployeeId);
          } else {
            // If not, then transfer the employee
            setTransferPostRankId(currentSelectedPostRankId);
            setTransferPostingDate(new Date(postingDate));
            setShowDirectTransferEmployeeModal(true);
          }
        }
      }
    } catch (error) {
      if (error instanceof Yup.ValidationError) {
        handleYupError(error);
      } else {
        if (error instanceof AxiosError && error.response?.status === 409) {
          toast.error(error.response.data.message);
        }
        handleAxiosError(error as AxiosError);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const fetchEmployeeData = async () => {
    if (!savedEmployeeId) return;
    setIsLoading(true);
    try {
      const response = await axios.get(
        `${api.baseUrl}/employees/${savedEmployeeId}`,
        {
          headers: {
            'x-access-token': accessToken,
          },
        }
      );
      if (response.data.success) {
        console.log('fetchEmployeeData: ', response.data.employee);
        setEmployeeFormData({
          ...response.data.employee,
          phoneNum: Number(response.data.employee.phoneNum),
          contractDate: formatDateToYMD(response.data.employee.contractDate),
        });
        setEmployeeDocsFormData({
          empName: response.data.employee.employeeName || '',
          profilePhoto: response.data.employee.profilePhoto || '',
          docContract: response.data.employee.docContract || '',
          docResume: response.data.employee.docResume || '',
          docPan: response.data.employee.docPan || '',
          docAadhaar: response.data.employee.docAadhaar || '',
          docOther: response.data.employee.docOther || '',
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

  /* Add Employee Docs Form Data Handling */
  const [employeeDocsFormData, setEmployeeDocsFormData] =
    useState<EmployeeDocuments>(defaultEmployeeDocsFormData);
  const [employeeFilesChanged, setEmployeeFilesChanged] =
    useState<boolean>(false);
  const [employeeInfoChanged, setEmployeeInfoChanged] =
    useState<boolean>(false);

  // const handleFilesInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const { name, files } = e.target;
  //   if (files) {
  //     setEmployeeDocsFormData((prevData) => ({
  //       ...prevData,
  //       [name]: files[0], // Store the file object directly
  //     }));
  //     if (name === 'profilePhoto') {
  //       setProfilePhoto(files[0]); // Set the selected file in the profilePhoto state
  //       setProfilePhotoAddedOrChanged(true);
  //     } else {
  //       setEmployeeFilesChanged(true);
  //     }
  //   }
  // };

  //////////////////////////////////////

  // Image states
  const [originalPhoto, setOriginalPhoto] = useState<File | null>(null);
  const [croppedPhoto, setCroppedPhoto] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  // Cropper states
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [cropSize, setCropSize] = useState<{
    width: number;
    height: number;
  } | null>(null);
  const [minZoom, setMinZoom] = useState(1);
  type CroppedAreaPixels = {
    x: number;
    y: number;
    width: number;
    height: number;
  } | null;
  const [croppedAreaPixels, setCroppedAreaPixels] =
    useState<CroppedAreaPixels>(null);
  const [isCropping, setIsCropping] = useState(false);
  const cropContainerRef = useRef<HTMLDivElement | null>(null);

  const PROFILE_ASPECT = 721 / 795;

  const recomputeCropSize = () => {
    const container = cropContainerRef.current;
    if (!container) return;
    const rect = container.getBoundingClientRect();
    const targetWidth = rect.width * 0.85;
    const targetHeight = rect.height * 0.85;
    let width = targetWidth;
    let height = width / PROFILE_ASPECT;
    if (height > targetHeight) {
      height = targetHeight;
      width = height * PROFILE_ASPECT;
    }
    setCropSize({ width: Math.round(width), height: Math.round(height) });
  };

  useEffect(() => {
    recomputeCropSize();
  }, [isCropping, preview]);

  useEffect(() => {
    const onResize = () => recomputeCropSize();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const handleMediaLoaded = (mediaSize: {
    width: number;
    height: number;
    naturalWidth: number;
    naturalHeight: number;
  }) => {
    if (!cropSize) return;
    const requiredZoom = Math.max(
      cropSize.width / mediaSize.width,
      cropSize.height / mediaSize.height
    );
    setMinZoom(requiredZoom);
    if (zoom < requiredZoom) setZoom(requiredZoom);
  };

  // original
  // const handleFilesInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const { name, files } = e.target;

  //   if (files && files.length > 0) {
  //     const selectedFile = files[0];

  //     // Update the form data for all inputs (profile photo and other files)
  //     setEmployeeDocsFormData((prevData) => ({
  //       ...prevData,
  //       [name]: selectedFile, // Store the file object directly
  //     }));

  //     if (name === 'profilePhoto') {
  //       if (savedEmployeeId) {
  //         // setProfilePhoto(selectedFile);
  //         uploadProfilePhoto(savedEmployeeId, selectedFile);
  //       } else {
  //         setProfilePhoto(selectedFile);
  //       }
  //       // setIsUploading(true); // Start upload
  //       // setUploadMessage('Uploading...'); // Show "Uploading..." message

  //       // // Simulate a 3-second delay
  //       // setTimeout(() => {
  //       //   setProfilePhoto(selectedFile); // Set the photo after delay
  //       //   setUploadMessage('Photo uploaded successfully!'); // Show success message
  //       //   setIsUploading(false); // Stop uploading state

  //       //   // Clear the message after 2 seconds (optional)
  //       //   // setTimeout(() => setUploadMessage(null), 2000);
  //       //   setTimeout(() => setUploadMessage(''), 1000);
  //       // }, 2000);

  //       setProfilePhotoAddedOrChanged(true); // Track profile photo changes
  //     } else {
  //       setEmployeeFilesChanged(true); // Handle other files normally
  //     }
  //   }
  // };

  // 3rd

  const handleFilesInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;

    if (files && files.length > 0) {
      const selectedFile = files[0];
      const MAX_FILE_SIZE = 3 * 1024 * 1024; // 3MB (matches server multer limit)

      // Validate file size
      if (selectedFile.size > MAX_FILE_SIZE) {
        const fileSizeMB = (selectedFile.size / (1024 * 1024)).toFixed(2);
        toast.error(
          `File "${selectedFile.name}" is too large (${fileSizeMB} MB). Maximum file size is 3 MB.`
        );
        e.target.value = ''; // Clear the input
        return;
      }

      // Always update form data
      setEmployeeDocsFormData((prevData) => ({
        ...prevData,
        [name]: selectedFile,
      }));

      if (name === 'profilePhoto') {
        // Set original for cropping
        setOriginalPhoto(selectedFile);
        setPreview(URL.createObjectURL(selectedFile));
        setIsCropping(true);
        setProfilePhotoAddedOrChanged(true);
      } else {
        setEmployeeFilesChanged(true);
      }
    }
  };

  // 2nd attempt
  // const handleFilesInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const { name, files } = e.target;

  //   if (files && files.length > 0) {
  //     const selectedFile = files[0];

  //     // Always update form data for submission
  //     setEmployeeDocsFormData((prevData) => ({
  //       ...prevData,
  //       [name]: selectedFile,
  //     }));

  //     if (name === 'profilePhoto') {
  //       // Instead of uploading immediately, show cropper
  //       setProfilePhoto(selectedFile); // keep raw file reference
  //       setPreview(URL.createObjectURL(selectedFile)); // show preview in cropper
  //       setIsCropping(true); // open cropping mode
  //       setProfilePhotoAddedOrChanged(true); // track changes for submit
  //     } else {
  //       // For all other employee files, just mark as changed
  //       setEmployeeFilesChanged(true);
  //     }
  //   }
  // };

  // 2nd
  const handleCropConfirm = async () => {
    if (!preview || !croppedAreaPixels || !originalPhoto) return;

    try {
      const croppedBlob = await getCroppedImg(
        preview,
        croppedAreaPixels,
        721,
        795
      );

      const croppedFile = new File([croppedBlob], originalPhoto.name, {
        type: 'image/jpeg',
      });

      if (savedEmployeeId) {
        // Edit case → upload right away
        await uploadProfilePhoto(savedEmployeeId, croppedFile);
        setUploadMessage('Photo uploaded successfully!');
      } else {
        // New employee case → store cropped file in form
        setEmployeeDocsFormData((prevData) => ({
          ...prevData,
          profilePhoto: croppedFile,
        }));
      }

      // Save cropped version
      setCroppedPhoto(croppedFile);
      setPreview(URL.createObjectURL(croppedFile));
      setIsCropping(false);
    } catch (err) {
      console.error('Crop failed:', err);
    }
  };

  // 1st
  // const handleCropConfirm = async () => {
  //   if (!preview || !croppedAreaPixels || !profilePhoto) return;

  //   try {
  //     // Generate cropped image blob at 721x795
  //     const croppedBlob = await getCroppedImg(
  //       preview,
  //       croppedAreaPixels,
  //       721,
  //       795
  //     );

  //     // Convert blob to File object
  //     const croppedFile = new File([croppedBlob], profilePhoto.name, {
  //       type: 'image/jpeg',
  //     });

  //     if (savedEmployeeId) {
  //       // Edit case → upload right away
  //       await uploadProfilePhoto(savedEmployeeId, croppedFile);
  //       setUploadMessage('Photo uploaded successfully!');
  //     } else {
  //       // New employee case → just keep in form state
  //       setEmployeeDocsFormData((prevData) => ({
  //         ...prevData,
  //         profilePhoto: croppedFile,
  //       }));
  //     }

  //     // Update local state with cropped version
  //     setProfilePhoto(croppedFile);
  //     setPreview(URL.createObjectURL(croppedFile));
  //     setIsCropping(false);
  //   } catch (err) {
  //     console.error('Crop failed:', err);
  //   }
  // };

  const handleCancelCrop = () => {
    if (croppedPhoto) {
      // Restore last confirmed crop
      setPreview(URL.createObjectURL(croppedPhoto));
    } else {
      // Reset to placeholder if nothing saved yet
      setOriginalPhoto(null);
      setPreview(null);
    }
    setIsCropping(false);
  };

  /////////////////////////////////////////

  const handleSubmitEmployeeDocs = async (
    e: React.FormEvent,
    employeeId?: number
  ) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      // Use provided employeeId or fall back to savedEmployeeId
      const targetEmployeeId = employeeId || savedEmployeeId;

      if (!targetEmployeeId || !employeeDocsFormData || !employeeFilesChanged)
        return;
      // employeeDocsFormData.empName = savedEmployeeName;

      // Validate file sizes before upload (defensive check)
      const MAX_FILE_SIZE = 3 * 1024 * 1024; // 3MB
      const files = Object.entries(employeeDocsFormData).filter(
        ([, value]) => value instanceof File
      );
      for (const [fieldName, file] of files) {
        if ((file as File).size > MAX_FILE_SIZE) {
          const fileSizeMB = ((file as File).size / (1024 * 1024)).toFixed(2);
          toast.error(
            `File "${(file as File).name}" in field "${fieldName}" is too large (${fileSizeMB} MB). Maximum file size is 3 MB.`
          );
          setIsLoading(false);
          return;
        }
      }

      const response = await axios.post(
        `${api.baseUrl}/employees/${targetEmployeeId}/upload`,
        employeeDocsFormData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            'x-access-token': accessToken,
          },
        }
      );

      if (response.data.success) {
        toast.success(response.data.message);
        setEmployeeFilesChanged(false);
        setEmployeeDocsFormData((prev) => ({
          ...prev,
          docContract: response.data.updatedEmployee.docContract || '',
          docResume: response.data.updatedEmployee.docResume || '',
          docPan: response.data.updatedEmployee.docPan || '',
          docOther: response.data.updatedEmployee.docOther || '',
          profilePhoto:
            response.data.updatedEmployee.profilePhoto ||
            'https://pscpl-paytrack.s3.ap-south-1.amazonaws.com/assets/profileImg.svg',
        }));
        fetchEmployeeData();
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
    setEmployeeDocsFormData((prevData) => ({
      ...prevData,
      [fieldName]: '',
    }));
    setShowDeleteModal(false);
  };

  /** Employee Scheduling Controls */
  const [allPostsData, setAllPostsData] = useState<Post[]>([]);
  const [currentSelectedPostId, setCurrentSelectedPostId] = useState<number>(0);
  const [allPostRankLinksData, setAllPostRankLinksData] = useState<
    PostRankLink[]
  >([]);
  const [currentSelectedPostRankId, setCurrentSelectedPostRankId] =
    useState<number>(0);
  const [postingDate, setPostingDate] = useState<string>('');
  const [savedEmployeeScheduleData, setSavedEmployeeScheduleData] =
    useState<EmployeeSchedule>({} as EmployeeSchedule);
  const [isScheduleModified, setIsScheduleModified] = useState<boolean>(false);
  const [isEmployeeScheduled, setIsEmployeeScheduled] =
    useState<boolean>(false);

  const fetchPosts = async () => {
    if (!accessToken) return;
    try {
      const response = await axios.get(`${api.baseUrl}/posts`, {
        headers: { 'x-access-token': accessToken },
      });
      if (response.data && response.data.success) {
        setAllPostsData(response.data.posts);
        // setAllPostsData([]);
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

  const fetchPostRanks = async () => {
    if (!accessToken || !currentSelectedPostId) return;
    try {
      const response = await axios.get(
        `${api.baseUrl}${api.posts}/${currentSelectedPostId}/link-rank`,
        {
          headers: { 'x-access-token': accessToken },
        }
      );
      if (response.data && response.data.success) {
        // console.log(response.data.postRankLinks);
        setAllPostRankLinksData(response.data.postRankLinks);
      }
    } catch (error) {
      if (error instanceof Yup.ValidationError) {
        handleYupError(error);
      } else {
        if (error instanceof AxiosError && error.response?.status === 404) {
          setAllPostRankLinksData([]);
          handleAxiosError(error as AxiosError);
          toast.error(
            'No ranks assigned to the post yet. Select a different post or add a rank to the selected post first.'
          );
        }
      }
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    if (currentSelectedPostId) fetchPostRanks();
  }, [accessToken, currentSelectedPostId]);

  const handleScheduleEmployee = async (empTableId: number) => {
    if (!accessToken || !empTableId) {
      toast.error(
        'An error occurred while scheduling employee. Please try again'
      );
    }

    if (!currentSelectedPostId || !currentSelectedPostRankId || !postingDate) {
      toast.error(
        'Please fill all the required fields in the posting table for scheduling employee'
      );
      return;
    }

    // console.log('now schedule employee');
    setIsLoading(true);

    try {
      const response = await axios.post(
        `${api.baseUrl}/emp/${empTableId}/link-postrank/${currentSelectedPostRankId}`,
        {
          postRankLinkId: currentSelectedPostRankId,
          empTableId: empTableId,
          dateOfPosting: postingDate,
        },
        { headers: { 'x-access-token': accessToken } }
      );

      if (response.data && response.data.success) {
        toast.success(response.data.message);
        // console.log(
        //   'response data after scheduling employee : ',
        //   response.data
        // );
        setSavedEmployeeScheduleData({
          ID: response.data.empPostRank.postRankLinkId,
          postRankLinkId: response.data.empPostRank.postRankLinkId,
          postName: response.data.empPostRank.postName,
          rankName: response.data.empPostRank.rankName,
          dateOfPosting: response.data.empPostRank.dateOfPosting,
        });
        setIsEmployeeScheduled(true);
        setIsScheduleModified(false);
        setCurrentSelectedPostId(0);
        setCurrentSelectedPostRankId(0);
        setTransferPostRankId(0);
        setErrors({});
        setIsEmployeeDischarged(false);
        // fetchEmployeeSchedule();
      }
    } catch (error) {
      if (error instanceof AxiosError && error.response?.status === 400) {
        toast.error(error.response.data.message);
        setErrors({ [error.response.data.field]: error.response.data.message });
      }
      if (error instanceof Yup.ValidationError) {
        handleYupError(error);
      } else {
        handleAxiosError(error as AxiosError);
      }
    } finally {
      setIsLoading(false);
      setShowDirectTransferEmployeeModal(false);
      // setIsScheduleModified(false); // TODO: May need to be removed as not needed
      // setIsEmployeeDischarged(false);
      // setCurrentSelectedPostId(0);
      // setCurrentSelectedPostRankId(0);
      // setTransferPostRankId(0);
      // setSavedEmployeeScheduleData({} as EmployeeSchedule);
    }
  };

  const fetchEmployeeSchedule = async () => {
    //TODO: In edit mode this will be fetched iniitally
    setIsLoading(true);
    // console.log('fetchEmployeeSchedule:::::::::::::');
    if (!accessToken || !savedEmployeeId) return;
    try {
      const response = await axios.get(
        `${api.baseUrl}/empPostRankLink/${savedEmployeeId}`,
        {
          headers: { 'x-access-token': accessToken },
        }
      );
      if (response.data && response.data.success) {
        // console.log('response.data.empPostRank', response.data.empPostRank);
        setSavedEmployeeScheduleData(response.data.empPostRank);
        // console.log(response.data.empPostRank);
      }
    } catch (error) {
      if (error instanceof Yup.ValidationError) {
        handleYupError(error);
      } else {
        if (error instanceof AxiosError && error.response?.status === 404) {
          setSavedEmployeeScheduleData({} as EmployeeSchedule);
        } else {
          handleAxiosError(error as AxiosError);
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  /* Table Action Modal Controls */
  const [isActionModalOpen, setIsActionModalOpen] = useState<boolean>(false);
  const actionMenuRef = useRef<HTMLDivElement>(null);
  const editScheduleRef = useRef<HTMLDivElement>(null);
  useClickOutside(actionMenuRef, () => setIsActionModalOpen(false));

  /** Transfer and Discharge Employee Controls */
  const [showDischargeEmployeeModal, setShowDischargeEmployeeModal] =
    useState<boolean>(false);
  const [showTransferEmployeeModal, setShowTransferEmployeeModal] =
    useState<boolean>(false);
  const [transferPostRankId, setTransferPostRankId] = useState<number>(0);
  const [transferPostingDate, setTransferPostingDate] = useState<Date | null>(
    null
  );
  const [dischargePostingDate, setDischargePostingDate] = useState<Date | null>(
    null
  );
  const [showDirectTransferEmployeeModal, setShowDirectTransferEmployeeModal] =
    useState<boolean>(false);
  const [directTransferPostName, setDirectTransferPostName] =
    useState<string>('');
  const [directTransferRankName, setDirectTransferRankName] =
    useState<string>('');
  const [isEmployeeDischarged, setIsEmployeeDischarged] =
    useState<boolean>(false);

  /* District Dropdown State */
  const [isCustomDistrict, setIsCustomDistrict] = useState<boolean>(false);
  const [customDistrict, setCustomDistrict] = useState<string>('');

  const handleTransfer = async (empTableID: number) => {
    if (!accessToken || !transferPostRankId || !transferPostingDate) return;
    setIsLoading(true);
    try {
      const response = await axios.patch(
        `${api.baseUrl}/emp/${empTableID}/transfer/${transferPostRankId}`,
        { dateOfPosting: transferPostingDate },
        { headers: { 'x-access-token': accessToken } }
      );
      if (response.data && response.data.success) {
        toast.success(response.data.message);
        // console.log(
        //   'response.data in handle Transfer ::::::::::::::::::',
        //   response.data
        // );
        // console.log(
        //   'response.data.postName',
        //   response.data.empPostRank.postName
        // );
        // console.log(
        //   'response.data.rankName',
        //   response.data.empPostRank.rankName
        // );
        // console.log(
        //   'response.data.dateOfPosting',
        //   response.data.empPostRank.dateOfPosting
        // );
        setSavedEmployeeScheduleData({
          postRankLinkId: response.data.empPostRank.postRankLinkId,
          postName: response.data.empPostRank.postName,
          rankName: response.data.empPostRank.rankName,
          dateOfPosting: response.data.empPostRank.dateOfPosting,
        });
        setCurrentSelectedPostId(0);
        setCurrentSelectedPostRankId(0);
        setTransferPostRankId(0);
        setIsEmployeeScheduled(true);
        // fetchEmployeeSchedule();
      }
    } catch (error) {
      // catch (error) {
      //   toast.error(error.response?.data.message);
      //   if (error instanceof Yup.ValidationError) {
      //     handleYupError(error);
      //   }
      //   // console.log('isAxiosError: ', error instanceof AxiosError);
      //   if (error instanceof AxiosError && error.status === 400) {
      //     // console.log('ERROR: ', error.response?.data.message);
      //     toast.error(error.response?.data.message); // TODO:  Toast not working here check later. Instead toast shifited above
      //   }
      //   handleAxiosError(error as AxiosError);
      // }
      // First, check if the error is an AxiosError before accessing properties
      if (error instanceof AxiosError && error.response) {
        toast.error(error.response.data.message);
        // Additional handling if needed for AxiosError, e.g., logging
        if (error.status === 400) {
          toast.error(error.response.data.message); // Additional toast if 400 status
        }
        handleAxiosError(error); // You can add custom logic for Axios-specific errors
      } else if (error instanceof Yup.ValidationError) {
        handleYupError(error);
      } else {
        // Fallback for unexpected errors
        toast.error('An unexpected error occurred');
      }
    } finally {
      setIsLoading(false);
      setShowTransferEmployeeModal(false);
      setShowDirectTransferEmployeeModal(false);
      setIsScheduleModified(false);
    }
  };
  const handleDischarge = async (
    empTableID: number,
    postRankLinkID: number
  ) => {
    if (!accessToken || !dischargePostingDate) return;
    setIsLoading(true);
    try {
      const response = await axios.delete(
        `${api.baseUrl}/emp/${empTableID}/unlink-postrank/${postRankLinkID}/${new Date(dischargePostingDate).toISOString() as string}`,
        { headers: { 'x-access-token': accessToken } }
      );
      if (response.data && response.data.success) {
        toast.success(response.data.message);
        fetchEmployeeSchedule();
        setIsEmployeeDischarged(true);
      }
    } catch (error) {
      //  catch (error) {
      //   toast.error(error.response?.data.message);
      //   // console.log('isAxiosError: ', error instanceof AxiosError);
      //   if (error instanceof Yup.ValidationError) {
      //     handleYupError(error);
      //   } else {
      //     if (error instanceof AxiosError && error.status === 400) {
      //       // console.log('ERROR: ', error.response?.data.message);
      //       toast.error(error.response?.data.message); // TODO:  Toast not working here check later. Instead toast shifited above
      //     }
      //     handleAxiosError(error as AxiosError);
      //   }
      // }
      // First, check if the error is an AxiosError before accessing properties
      if (error instanceof AxiosError && error.response) {
        toast.error(error.response.data.message);
        // Additional handling if needed for AxiosError, e.g., logging
        if (error.status === 400) {
          toast.error(error.response.data.message); // Additional toast if 400 status
        }
        handleAxiosError(error); // You can add custom logic for Axios-specific errors
      } else if (error instanceof Yup.ValidationError) {
        handleYupError(error);
      } else {
        // Fallback for unexpected errors
        toast.error('An unexpected error occurred');
      }
    } finally {
      setIsLoading(false);
      setShowDischargeEmployeeModal(false);
    }
  };
  const handleUpdateTransferPostRank = async (newPostRankLinkId: number) => {
    //TODO: Check if we dont need function for a mere state update
    setTransferPostRankId(newPostRankLinkId);
  };

  const handleUpdateTransferPostingDate = (newPostingDate: Date | null) => {
    setTransferPostingDate(newPostingDate);
  };

  const handleUpdateDischargePostingDate = (newPostingDate: Date | null) => {
    setDischargePostingDate(newPostingDate);
  };

  // Test use effect
  useEffect(() => {
    // console.log('::::::::::::::START MONITORING STATE CHANGES::::::::::::::: ');
    // console.log('employeeFormData : ', employeeFormData);
    // console.log('profilePhotoAddedOrChanged :', profilePhotoAddedOrChanged);
    // console.log('isEmployeeFormSubmitted : ', isEmployeeFormSubmitted);
    // console.log('savedEmployeeId : ', savedEmployeeId);
    // console.log('savedEmployeeName : ', savedEmployeeName);
    // console.log('employeeInfoChanged : ', employeeInfoChanged);
    // console.log('employeeFilesChanged : ', employeeFilesChanged);
    // console.log('employeeDocsFormData', employeeDocsFormData);
    // console.log('current selected post id: ', currentSelectedPostId);
    // console.log('current selected post rank id :', currentSelectedPostRankId);
    // console.log('posting date : ', postingDate);
    // console.log('isEmployeeScheduled : ', isEmployeeScheduled);
    // console.log('savedEmployeeScheduleData : ', savedEmployeeScheduleData);
    // console.log('isScheduleModified : ', isScheduleModified);
    // // console.log(
    // //   'Testing rank::::: ',
    // //   allPostRankLinksData.find(
    // //     (postRankId) => postRankId.ID === currentSelectedPostRankId
    // //   )?.designation
    // // );
    // // console.log(
    // //   'Testing post::::: ',
    // //   allPostsData.find((postId) => postId.ID === currentSelectedPostId)
    // //     ?.postName
    // // );
    // console.log('isEmployeeDischarged : ', isEmployeeDischarged);
    // console.log('errors : ', errors);
    // console.log('::::::::::::::END OF MONITORING::::::::::::::: ');
  });

  // JSX here
  return (
    <>
      {isLoading && <Loader />}
      <div
        // className={`flex flex-col w-full fixed z-20 padding-responsive-table 2xl:px-8 gap-1 2xl:gap-2 ${showMenu ? 'transition-all ease-in-out' : 'w-[78vw] 2xl:w-[82vw] transition-all ease-in-out'}`}
        // className="flex flex-col w-full z-20 fixed padding-responsive-table 2xl:px-8 gap-1 2xl:gap-2"
        className={`flex flex-col ${showMenu ? 'w-[calc(100%-64px)] 2xl:w-[calc(100%-82px)]' : 'w-[calc(100%-210px)] 2xl:w-[calc(100%-218px)]'} z-20 fixed padding-responsive-header-container-type-1`}
      >
        <BreadCrumb />
        <div
          className={`flex flex-row items-center justify-between h-fit transition-all ease-in`}
        >
          {/* Back Button */}
          <div className="flex items-center">
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
          {/* Transfer & Discharge  */}
          <div className="flex flex-row justify-end gap-2 2xl:gap-4">
            <PrimaryButton
              disabled={
                !isEmployeeFormSubmitted ||
                isEmployeeDischarged ||
                !isEmployeeScheduled
              }
              type="button"
              onClick={() => setShowTransferEmployeeModal(true)}
            >
              Transfer
            </PrimaryButton>
            <ClearButton
              disabled={
                !isEmployeeFormSubmitted ||
                isEmployeeDischarged ||
                !isEmployeeScheduled
              }
              type="button"
              onClick={() => setShowDischargeEmployeeModal(true)}
            >
              Discharge
            </ClearButton>
          </div>
        </div>
      </div>
      <div className="bg-white mt-[70px] 2xl:mt-[92px] z-10 overflow-y-auto h-[calc(100vh-108px)] scrollbar scrollbar-thumb-scrollBarColor scrollbar-track-scrollBarBg">
        <form
          onSubmit={handleSubmitEmployeeForm}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              handleSubmitEmployeeForm(e);
            }
          }}
          className="w-full mx-auto mb-32"
        >
          {/* Accordion 1 : Personal Info */}
          <Accordion title="Personal Information">
            <div className="flex gap-4 2xl:gap-6">
              {/* <div className="w-[162px] 2xl:w-[194px]">
                <div className="w-full h-auto aspect-square border border-gray-300 bg-tableHeadingColour flex flex-col justify-center items-center rounded-md">
                  <input
                    id="profilePhoto"
                    type="file"
                    name="profilePhoto"
                    onChange={handleFilesInputChange}
                    className="hidden"
                    accept=".jpg,.jpeg,.png"
                  />

                  <label
                    htmlFor="profilePhoto"
                    className="cursor-pointer flex items-center justify-center bg-tableHeadingColour w-full h-full rounded-md"
                  >
                    <img
                      src={
                        profilePhoto
                          ? URL.createObjectURL(profilePhoto)
                          : 'https://pscpl-paytrack.s3.ap-south-1.amazonaws.com/assets/UploadPhotoImg.svg'
                      }
                      alt="ProfileImg"
                      className={`${profilePhoto ? 'w-full' : 'w-2/5'} h-full ${profilePhoto ? 'object-cover' : 'object-contain'} rounded-md`}
                    />
                  </label>
                </div>
                {uploadMessage && (
                  <div className="mt-2 flex items-center justify-center gap-2">
                    <img src={CheckGreen} alt="CheckGreen" />
                    <p
                      className={`font-semibold text-responsive-input ${isUploading ? 'text-primaryText' : 'text-[#4CAF50]'} font-Mona_Sans`}
                    >
                      {uploadMessage}
                    </p>
                  </div>
                )}
              </div> */}
              <div className="w-[162px] 2xl:w-[194px]">
                <div
                  ref={cropContainerRef}
                  className="relative w-full aspect-[721/795] border border-gray-300 bg-tableHeadingColour flex flex-col justify-center items-center rounded-md overflow-hidden"
                >
                  {/* File input */}
                  <input
                    id="profilePhoto"
                    type="file"
                    name="profilePhoto"
                    onChange={handleFilesInputChange}
                    className="hidden"
                    accept=".jpg,.jpeg,.png"
                  />

                  {/* CASE 1: No image uploaded → placeholder */}
                  {!preview && (
                    <label
                      htmlFor="profilePhoto"
                      className="cursor-pointer flex items-center justify-center w-full h-full"
                    >
                      <img
                        src="https://pscpl-paytrack.s3.ap-south-1.amazonaws.com/assets/UploadPhotoImg.svg"
                        alt="Upload"
                        className="w-2/5 h-2/5 object-contain"
                      />
                    </label>
                  )}

                  {/* CASE 2: Cropping mode */}
                  {preview && isCropping && (
                    <>
                      <Cropper
                        // image={URL.createObjectURL(originalPhoto!)}
                        image={preview!}
                        crop={crop}
                        zoom={zoom}
                        aspect={721 / 795}
                        cropSize={cropSize ?? undefined}
                        restrictPosition={true}
                        minZoom={minZoom}
                        onMediaLoaded={handleMediaLoaded}
                        onCropChange={setCrop}
                        onZoomChange={setZoom}
                        onCropComplete={(_, croppedAreaPixels) =>
                          setCroppedAreaPixels(croppedAreaPixels)
                        }
                      />
                      <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-2">
                        <button
                          type="button"
                          onClick={handleCropConfirm}
                          className="bg-bgPrimaryButton text-white px-3 py-1 rounded-md text-sm"
                        >
                          Ok
                        </button>
                        <button
                          type="button"
                          onClick={handleCancelCrop}
                          className="bg-gray-400 text-black px-3 py-1 rounded-md text-sm"
                        >
                          Cancel
                        </button>
                      </div>
                    </>
                  )}

                  {/* CASE 3: After confirm → show cropped preview + actions */}
                  {preview && !isCropping && (
                    <div className="w-full h-full relative">
                      <img
                        src={preview}
                        alt="Profile Preview"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-2">
                        {/* Change photo */}
                        <label
                          htmlFor="profilePhoto"
                          className="bg-green-600/60 text-white px-2 py-1 rounded-md text-xs cursor-pointer"
                        >
                          Change
                        </label>

                        {/* Edit photo */}
                        <button
                          type="button"
                          onClick={() => {
                            setPreview(URL.createObjectURL(originalPhoto!));
                            setIsCropping(true);
                          }}
                          className="bg-black/60 text-white px-2 py-1 rounded-md text-xs"
                        >
                          Edit
                        </button>
                      </div>
                    </div>
                  )}
                </div>
                {uploadMessage && (
                  <div className="mt-2 flex items-center justify-center gap-2">
                    <img src={CheckGreen} alt="CheckGreen" />
                    <p
                      className={`font-semibold text-responsive-input ${isUploading ? 'text-primaryText' : 'text-[#4CAF50]'} font-Mona_Sans`}
                    >
                      {uploadMessage}
                    </p>
                  </div>
                )}
              </div>
              <div className="flex flex-col gap-4 2xl:gap-6 pb-4 2xl:pb-6 w-full">
                {/* First row */}
                <div className="flex justify-between gap-4 2xl:gap-6">
                  {/* First name */}
                  <div className="input-wrapper cursor-pointer">
                    <label className="input-label">
                      Full Name
                      <span className="input-error pl-1">*</span>
                    </label>
                    <input
                      type="text"
                      name="empName"
                      value={employeeFormData.empName}
                      onChange={handleEmployeeFormInputChange}
                      className="px-2 w-full h-10 2xl:h-12 text-responsive-input rounded-md shadow-sm border border-inputBorder"
                    />
                    {errors.empName && (
                      <p className="input-error">{errors.empName}</p>
                    )}
                  </div>
                  {/* Father's name */}
                  <div className="input-wrapper cursor-pointer">
                    <label className="input-label">
                      Father&apos;s Name
                      <span className="input-error pl-1">*</span>
                    </label>
                    <input
                      type="text"
                      name="fatherName"
                      value={employeeFormData.fatherName || ''}
                      onChange={handleEmployeeFormInputChange}
                      className="input-field"
                    />
                    {errors.fatherName && (
                      <p className="input-error">{errors.fatherName}</p>
                    )}
                  </div>
                  {/* Mother's name */}
                  <div className="input-wrapper">
                    <label className="input-label">Mother&apos;s Name</label>
                    <input
                      type="text"
                      name="motherName"
                      value={employeeFormData.motherName || ''}
                      onChange={handleEmployeeFormInputChange}
                      className="input-field"
                    />
                    {errors.motherName && (
                      <p className="input-error">{errors.motherName}</p>
                    )}
                  </div>
                </div>
                {/* Second row */}
                <div className="flex justify-between gap-4 2xl:gap-6">
                  {/* Gender */}
                  {/* <div className="input-wrapper cursor-pointer">
                    <label className=" input-label">
                       Gender
   <span className=" input-error">*</span>                  </label>
                    <input
                      type="text"
                      name="gender"
                      value={employeeFormData.gender || ''}
                      onChange={handleEmployeeFormInputChange}
                      className="px-2 w-full h-10 2xl:h-12 border border-inputBorder rounded-md shadow-sm"
                    />
                    {errors.gender && (
                      <p className="input-error">{errors.gender}</p>
                    )}
                  </div> */}
                  {/* <div className="input-wrapper cursor-pointer">
                    <label className=" input-label">
                      <span className="input-error">*</span> Gender
                    </label>
                    <select
                      name="gender"
                      value={employeeFormData.gender || ''}
                      onChange={handleEmployeeFormInputChange}
                      className="px-2 w-full h-10 2xl:h-12 border border-inputBorder rounded-md shadow-sm"
                    >
                      <option value="" disabled>
                        Select Gender
                      </option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                    </select>
                    {errors.gender && (
                      <p className="input-error">{errors.gender}</p>
                    )}
                  </div> */}
                  {/* <div className="input-wrapper cursor-pointer">
                    <label className=" input-label">
                      Gender
                    </label>
                    <select
                      name="gender"
                      value={employeeFormData.gender || ''}
                      onChange={handleInputChange}
                      className="px-2 w-full h-10 2xl:h-12 border border-inputBorder rounded-md shadow-sm"
                    >
                      <option value="" disabled>
                        Select Gender
                      </option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                    </select>
                    {errors.gender && (
                      <p className="input-error">{errors.gender}</p>
                    )}
                  </div> */}
                  <div className="input-wrapper cursor-pointer">
                    {/* <GenderDropdown
                      value={employeeFormData.gender || ''}
                      onChange={handleEmployeeFormInputChange}
                      error={errors.gender}
                    /> */}
                    <label className="input-label">
                      Gender
                      <span className="input-error pl-1">*</span>
                    </label>

                    <select
                      name="gender"
                      value={employeeFormData.gender || ''}
                      onChange={handleEmployeeFormInputChange}
                      className="input-field cursor-pointer"
                    >
                      <option value="">Select Gender</option>
                      <option value="MALE">MALE</option>
                      <option value="FEMALE">FEMALE</option>
                    </select>
                    {errors.gender && (
                      <p className="input-error">{errors.gender}</p>
                    )}
                  </div>

                  {/* D.O.B */}
                  <div className="input-wrapper cursor-pointer">
                    <label className="input-label flex items-center justify-between">
                      <div>
                        D.O.B
                        <span className="input-error pl-1">*</span>
                      </div>
                      <div>
                        {/* Conditionally render the Copy button if D.O.B is entered */}
                        {employeeFormData.dob && (
                          <div
                            // type="button"
                            // onClick={handleCopyDob}
                            onClick={(e) => {
                              handleCopyDob(e, 'dob');
                            }}
                            className={`rounded-md cursor-pointer ${
                              isCopied.dob ? 'text-green-500' : 'input-label'
                            }`}
                          >
                            {isCopied.dob ? 'Copied' : 'Copy'}
                          </div>
                        )}
                      </div>
                    </label>
                    <input
                      type="date"
                      name="dob"
                      ref={dobRefs.dob}
                      onChange={handleEmployeeFormInputChange}
                      // value={
                      //   getFormattedDateYyyyMmDdDash(
                      //     new Date(employeeFormData.dob)
                      //   ) || ''
                      // }

                      value={
                        employeeFormData.dob
                          ? new Date(employeeFormData.dob)
                              .toISOString()
                              .split('T')[0]
                          : ''
                      }
                      className="input-field"
                    />

                    {errors.dob && <p className="input-error">{errors.dob}</p>}
                  </div>
                  {/* Phone Number */}
                  <div className="input-wrapper cursor-pointer">
                    <label className="input-label">
                      Phone
                      <span className="input-error pl-1">*</span>
                    </label>
                    <input
                      type="number"
                      name="phoneNum"
                      value={employeeFormData.phoneNum || ''}
                      onKeyDown={(e) => {
                        if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
                          e.preventDefault();
                        }
                      }}
                      onWheel={(e) => e.currentTarget.blur()}
                      onChange={handleEmployeeFormInputChange}
                      className="input-field"
                    />
                    {errors.phoneNum && (
                      <p className="input-error">{errors.phoneNum}</p>
                    )}
                  </div>
                  {/* Alt Phone Number */}
                  <div className="input-wrapper cursor-pointer">
                    <label className="input-label">Alternate Phone</label>
                    <input
                      type="number"
                      name="altPhoneNum"
                      value={employeeFormData.altPhoneNum || ''}
                      onKeyDown={(e) => {
                        if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
                          e.preventDefault();
                        }
                      }}
                      onWheel={(e) => e.currentTarget.blur()}
                      onChange={handleEmployeeFormInputChange}
                      className="input-field"
                    />
                    {errors.altPhoneNum && (
                      <p className="input-error">{errors.altPhoneNum}</p>
                    )}
                  </div>
                </div>
                {/* Third row   */}
                <div className="flex justify-between gap-4 2xl:gap-6">
                  {/* Vill/City/Town */}
                  <div className="input-wrapper cursor-pointer">
                    <label className="input-label">
                      Vill/City/Town{' '}
                      <span className=" input-error pl-1">*</span>
                    </label>
                    <input
                      type="text"
                      name="villTown"
                      value={employeeFormData.villTown || ''}
                      onChange={handleEmployeeFormInputChange}
                      className="input-field"
                    />
                    {errors.villTown && (
                      <p className="input-error">{errors.villTown}</p>
                    )}
                  </div>
                  {/* Post Office */}
                  <div className="input-wrapper cursor-pointer">
                    <label className=" input-label">
                      P.O
                      <span className="input-error pl-1">*</span>
                    </label>
                    <input
                      type="text"
                      name="postOffice"
                      value={employeeFormData.postOffice || ''}
                      onChange={handleEmployeeFormInputChange}
                      className="input-field"
                    />
                    {errors.postOffice && (
                      <p className="input-error">{errors.postOffice}</p>
                    )}
                  </div>
                  {/* Police Station */}
                  <div className="input-wrapper cursor-pointer">
                    <label className=" input-label">
                      P.S
                      <span className=" input-error pl-1">*</span>
                    </label>
                    <input
                      type="text"
                      name="policeStation"
                      value={employeeFormData.policeStation || ''}
                      onChange={handleEmployeeFormInputChange}
                      className="input-field"
                    />
                    {errors.policeStation && (
                      <p className="input-error">{errors.policeStation}</p>
                    )}
                  </div>
                </div>
                {/* Fourth row   */}
                <div className="flex justify-between gap-4 2xl:gap-6">
                  {/* District */}
                  <div className="input-wrapper cursor-pointer">
                    <label className="input-label">
                      District
                      <span className="input-error pl-1">*</span>
                    </label>
                    <select
                      name="district"
                      value={
                        isCustomDistrict
                          ? 'OTHER'
                          : employeeFormData.district || ''
                      }
                      onChange={handleEmployeeFormInputChange}
                      className="input-field cursor-pointer"
                    >
                      <option value="">Select District</option>
                      {assamDistricts.map((district) => (
                        <option key={district} value={district}>
                          {district}
                        </option>
                      ))}
                      <option value="OTHER">Other</option>
                    </select>
                    {isCustomDistrict && (
                      <input
                        type="text"
                        placeholder="Enter district name"
                        value={customDistrict}
                        onChange={handleCustomDistrictChange}
                        className="input-field mt-2"
                      />
                    )}
                    {errors.district && (
                      <p className="input-error">{errors.district}</p>
                    )}
                  </div>
                  {/* Pin Code */}
                  <div className="input-wrapper cursor-pointer">
                    <label className=" input-label">
                      PIN
                      <span className=" input-error pl-1">*</span>
                    </label>
                    <input
                      type="number"
                      name="pinCode"
                      value={employeeFormData.pinCode || ''}
                      onKeyDown={(e) => {
                        if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
                          e.preventDefault();
                        }
                      }}
                      onWheel={(e) => e.currentTarget.blur()}
                      onChange={handleEmployeeFormInputChange}
                      className="input-field"
                    />
                    {errors.pinCode && (
                      <p className="input-error">{errors.pinCode}</p>
                    )}
                  </div>
                  {/* State */}
                  <div className="input-wrapper cursor-pointer">
                    {/* <label className=" input-label">
                      State
                      <span className=" input-error pl-1">*</span>
                    </label>
                    <input
                      type="text"
                      name="state"
                      value={employeeFormData.state || ''}
                      onChange={handleEmployeeFormInputChange}
                      className="input-field"
                    /> */}
                    {/* <StateDropDown
                      value={employeeFormData.state || ''}
                      onChange={handleEmployeeFormInputChange}
                      options={indianStates} // Pass the array of Indian states
                      label="State"
                      placeholder="State"
                    /> */}
                    <label className=" input-label">State</label>
                    <select
                      name="state"
                      value={employeeFormData.state || ''}
                      onChange={handleEmployeeFormInputChange}
                      className="input-field cursor-pointer"
                    >
                      <option className="normal-case" value="">
                        Select State
                      </option>
                      {indianStates.map((state) => (
                        <option key={state} value={state.toUpperCase()}>
                          {state}
                        </option>
                      ))}
                    </select>
                    {errors.state && (
                      <p className="input-error">{errors.state}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <hr />
          </Accordion>

          {/* Accordion 2 : Professional Info*/}
          <Accordion title="Professional Information">
            <div className="flex flex-col gap-4 2xl:gap-6 pb-4 2xl:pb-6 border-b">
              {/* Employee Posting Table */}
              <div
                ref={editScheduleRef}
                className="flex flex-col text-center overflow-x-auto mx-24 2xl:mx-32"
              >
                <table
                  data-tooltip-id="noPosts"
                  data-tooltip-content="There are no posts available. Please add a post to access employee scheduling."
                  className="min-w-full bg-white border border-accordionBg"
                >
                  <thead className="text-center text-primaryText border border-accordionBg sticky top-0">
                    <tr className="bg-tableHeadingColour">
                      <th
                        className="emp-posting-table-th padding-y-responsive-table-header"
                        rowSpan={2}
                      >
                        Posting
                      </th>
                      <th
                        className="emp-posting-table-th padding-y-responsive-table-header w-[30%]"
                        rowSpan={2}
                      >
                        Rank
                      </th>
                      <th
                        className="emp-posting-table-th padding-y-responsive-table-header"
                        rowSpan={2}
                      >
                        W.E.F
                      </th>
                      <th
                        className="emp-posting-table-th padding-y-responsive-table-header"
                        rowSpan={2}
                      >
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody className="text-primaryText border border-tableBorder">
                    <tr className=" border border-tableBorder h-10">
                      {/* Select Post */}
                      <td className="emp-posting-table-td">
                        {isEmployeeScheduled &&
                        !isScheduleModified &&
                        savedEmployeeScheduleData.postName &&
                        !isEmployeeDischarged ? (
                          <p className="py-2 px-2 max-h-60">
                            {savedEmployeeScheduleData.postName}
                          </p>
                        ) : (
                          <select
                            name="selectPost"
                            className="w-full h-full bg-white border rounded-lg py-2 px-2 max-h-60 cursor-pointer"
                            onChange={(e) => {
                              const selectedPost = allPostsData.find(
                                (post) => post.postName === e.target.value
                              );
                              if (selectedPost) {
                                setCurrentSelectedPostId(
                                  selectedPost.ID as number
                                );
                                setCurrentSelectedPostRankId(0);
                                // setTransferPostingDate(new Date());
                                setAllPostRankLinksData([]);
                                setDirectTransferPostName(
                                  selectedPost.postName
                                );
                                setIsScheduleModified(true);
                              }
                            }}
                            disabled={allPostsData.length === 0}
                          >
                            <option value="">Select</option>
                            {allPostsData.map((post) => (
                              <option key={post.ID} value={post.postName}>
                                {post.postName}
                              </option>
                            ))}
                          </select>
                        )}
                      </td>
                      {/* Select Rank */}
                      <td className="emp-posting-table-td">
                        {isEmployeeScheduled &&
                        !isScheduleModified &&
                        savedEmployeeScheduleData.rankName &&
                        !isEmployeeDischarged ? (
                          <p className="py-2 px-2 max-h-60">
                            {savedEmployeeScheduleData.rankName}
                          </p>
                        ) : (
                          <select
                            name="select"
                            id=""
                            className={`w-full h-full bg-white border rounded-lg py-2 px-2 max-h-60 cursor-pointer ${
                              allPostRankLinksData.length === 0 ||
                              currentSelectedPostId === 0
                                ? 'text-gray-400'
                                : ''
                            }`}
                            disabled={
                              allPostRankLinksData.length === 0 ||
                              currentSelectedPostId === 0
                            }
                            onChange={(e) => {
                              const selectedRank = allPostRankLinksData.find(
                                (rank) => rank.designation === e.target.value
                              );
                              if (selectedRank) {
                                setCurrentSelectedPostRankId(
                                  selectedRank.ID as number
                                );
                                setDirectTransferRankName(
                                  selectedRank.designation
                                );
                                setIsScheduleModified(true);
                              }
                            }}
                          >
                            <option value="Select">Select</option>
                            {allPostRankLinksData.map((rank) => (
                              <option key={rank.ID} value={rank.designation}>
                                {rank.designation}
                              </option>
                            ))}
                          </select>
                        )}
                      </td>
                      {/* Posting Date */}
                      <td className="emp-posting-table-td">
                        {isEmployeeScheduled &&
                        !isScheduleModified &&
                        savedEmployeeScheduleData.dateOfPosting &&
                        !isEmployeeDischarged ? (
                          <p className="py-2 px-2 max-h-60">
                            {formatDateDdMmYyyySlash(
                              savedEmployeeScheduleData.dateOfPosting as Date
                            )}
                          </p>
                        ) : (
                          <input
                            type="date"
                            name="dateOfPosting"
                            onChange={(e) => {
                              setPostingDate(e.target.value);
                              setIsScheduleModified(true);
                            }}
                            disabled={
                              currentSelectedPostId === 0 ||
                              allPostRankLinksData.length === 0 ||
                              currentSelectedPostRankId === 0
                            }
                            className={`px-2 w-full h-10 2xl:h-12 rounded-md shadow-sm border text-responsive-table bg-transparent ${
                              currentSelectedPostId === 0 ||
                              allPostRankLinksData.length === 0 ||
                              currentSelectedPostRankId === 0
                                ? 'text-gray-400'
                                : ''
                            }`}
                          />
                        )}
                      </td>
                      {/* Action */}
                      <td className="relative emp-posting-table-td">
                        {isEmployeeFormSubmitted &&
                        // Object.keys(savedEmployeeScheduleData).length > 0 &&
                        savedEmployeeScheduleData.postName &&
                        isEmployeeScheduled ? (
                          isScheduleModified ? (
                            // Cancel button
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                e.preventDefault();
                                setIsScheduleModified(false);
                                setCurrentSelectedPostId(0);
                                setCurrentSelectedPostRankId(0);
                                setPostingDate('');
                                setErrors({});
                                // fetchEmployeeSchedule();
                              }}
                            >
                              Cancel
                            </button>
                          ) : (
                            // Ellipsis button
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                e.preventDefault();
                                setIsActionModalOpen(!isActionModalOpen);
                              }}
                              className="text-blue-600 hover:text-blue-800"
                            >
                              <img
                                src={TableOptionsIcon}
                                className="w-5 h-5"
                                alt="TableOptionsIcon"
                              />
                            </button>
                          )
                        ) : (
                          <p>-</p>
                        )}
                        {isActionModalOpen && (
                          <div
                            ref={actionMenuRef}
                            className="absolute right-[60%] bottom-[50%] mb-2 w-28 bg-white border border-gray-300 shadow-lg z-10"
                          >
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                e.preventDefault();
                                setIsScheduleModified(true);
                                setIsActionModalOpen(false);
                                setCurrentSelectedPostId(0);
                                setCurrentSelectedPostRankId(0);
                                setPostingDate('');
                                // handleEdit(currentRankId);
                              }}
                              className="flex gap-1 2xl:gap-2 items-center w-full px-4 py-2  font-medium text-secondaryText hover:bg-smallMenuHover"
                            >
                              <img
                                src={EditPencil_Icon}
                                alt="EditPencil_Icon"
                                className="w-4 h-4"
                              />
                              <span>Edit</span>
                            </button>
                            {/* <button
                              onClick={(event) => {
                                event.stopPropagation();
                                setShowDeleteModal(true);
                              }}
                              className="flex gap-1 2xl:gap-2 items-center w-full px-4 py-2  font-medium text-secondaryText hover:bg-smallMenuHover"
                            >
                              <img
                                src={Delete_Icon}
                                alt="Delete_Icon"
                                className="w-4 h-4"
                              />
                              <span>Delete</span>
                            </button> */}
                          </div>
                        )}
                      </td>
                    </tr>
                  </tbody>
                </table>
                <div className="flex justify-center text-center gap-1">
                  {errors.currentSelectedPostId && (
                    <p className="flex input-error ">
                      {errors.currentSelectedPostId}
                    </p>
                  )}
                  {errors.currentSelectedPostRankId && (
                    <p className="input-error">
                      {errors.currentSelectedPostRankId}
                    </p>
                  )}
                  {errors.transferPostingDate && (
                    <p className="input-error">{errors.transferPostingDate}</p>
                  )}
                  {errors.dateOfPosting && (
                    <p className="input-error">{errors.dateOfPosting}</p>
                  )}
                </div>
              </div>

              {/* Input section */}
              <div className="flex flex-col gap-4 px-4 mx-[6%]">
                {/* First row */}
                <div className="flex justify-between gap-4 2xl:gap-6">
                  {/* Employee Id */}
                  <div
                    data-tooltip-id="empIdTooltip"
                    data-tooltip-content="Employee ID will be generated automatically."
                    className="input-wrapper"
                  >
                    <label className=" input-label">Employee Id</label>
                    <input
                      type="text"
                      name="empId"
                      value={employeeFormData.empId || ''}
                      onChange={handleEmployeeFormInputChange}
                      className="input-field"
                      disabled
                    />

                    {errors.empId && (
                      <p className="input-error">{errors.empId}</p>
                    )}
                  </div>
                  {/* Qualification */}
                  <div className="input-wrapper">
                    <label className=" input-label">
                      Qualification <span className=" input-error pl-1">*</span>
                    </label>
                    <input
                      type="text"
                      name="qualification"
                      value={employeeFormData.qualification || ''}
                      onChange={handleEmployeeFormInputChange}
                      className="input-field"
                    />
                    {errors.qualification && (
                      <p className="input-error">{errors.qualification}</p>
                    )}
                  </div>
                  {/* Height */}
                  <div className="input-wrapper">
                    <label className=" input-label">Height (cm)</label>
                    <input
                      type="number"
                      name="height"
                      value={
                        employeeFormData.height === 0
                          ? ''
                          : employeeFormData.height
                      }
                      onKeyDown={(e) => {
                        if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
                          e.preventDefault();
                        }
                      }}
                      onChange={handleEmployeeFormInputChange}
                      onWheel={(e) => e.currentTarget.blur()}
                      className="input-field"
                    />
                    {errors.height && (
                      <p className="input-error">{errors.height}</p>
                    )}
                  </div>
                </div>
                {/* Second row */}
                <div className="flex justify-center gap-4 2xl:gap-6">
                  <div className="input-wrapper">
                    <label className=" input-label">Identification Mark</label>
                    <input
                      type="text"
                      name="idMark"
                      value={employeeFormData.idMark || ''}
                      onChange={handleEmployeeFormInputChange}
                      className="input-field"
                    />
                    {errors.idMark && (
                      <p className="input-error">{errors.idMark}</p>
                    )}
                  </div>
                  {/* Date of Joining */}
                  <div className="input-wrapper cursor-pointer">
                    <label className=" input-label flex items-center justify-between">
                      <div>
                        Date of Joining
                        <span className=" input-error pl-1">*</span>
                      </div>
                      <div>
                        {/* Conditionally render the Copy button if D.O.B is entered */}
                        {employeeFormData.dateOfJoining && (
                          <div
                            // type="button"
                            // onClick={handleCopyDob}
                            onClick={(e) => {
                              handleCopyDob(e, 'dateOfJoining');
                            }}
                            className={`rounded-md  ${
                              isCopied.dateOfJoining
                                ? 'text-green-500'
                                : 'input-label'
                            }`}
                          >
                            {isCopied.dateOfJoining ? 'Copied' : 'Copy'}
                          </div>
                        )}
                      </div>
                    </label>
                    <input
                      type="date"
                      name="dateOfJoining"
                      ref={dobRefs.dateOfJoining}
                      onChange={handleEmployeeFormInputChange}
                      // value={
                      //   getFormattedDateYyyyMmDdDash(
                      //     new Date(employeeFormData.dateOfJoining)
                      //   ) || ''
                      // }
                      value={
                        employeeFormData.dateOfJoining &&
                        !isNaN(
                          new Date(employeeFormData.dateOfJoining).getTime()
                        )
                          ? new Date(employeeFormData.dateOfJoining)
                              .toISOString()
                              .split('T')[0]
                          : ''
                      }
                      className="input-field"
                    />
                    {errors.dateOfJoining && (
                      <p className="input-error">{errors.dateOfJoining}</p>
                    )}
                  </div>
                  {/* Blood group */}
                  <div className="input-wrapper">
                    <label className=" input-label">Blood Group</label>
                    {/* <input
                      type="text"
                      name="bloodGroup"
                      value={employeeFormData.bloodGroup || ''}
                      onChange={handleEmployeeFormInputChange}
                      className="input-field"
                    /> */}
                    <select
                      name="bloodGroup"
                      value={employeeFormData.bloodGroup || ''}
                      onChange={handleEmployeeFormInputChange}
                      className="input-field"
                    >
                      <option value="">Select Blood Group</option>
                      <option value="A+">A+</option>
                      <option value="A-">A-</option>
                      <option value="B+">B+</option>
                      <option value="B-">B-</option>
                      <option value="O+">O+</option>
                      <option value="O-">O-</option>
                      <option value="AB+">AB+</option>
                      <option value="AB-">AB-</option>
                    </select>
                    {errors.bloodGroup && (
                      <p className="input-error">{errors.bloodGroup}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </Accordion>

          {/* Accordion 3 : Bank Details */}
          <Accordion title="Bank Details">
            <div className="flex flex-col gap-4 2xl:gap-6 pb-4 2xl:pb-6 border-b">
              {/* First row */}
              <div className="flex justify-between gap-4 2xl:gap-6">
                {/* Bank Name */}
                <div className="input-wrapper">
                  <label className=" input-label">Bank Name</label>
                  <input
                    type="text"
                    name="bankName"
                    value={employeeFormData.bankName || ''}
                    onChange={handleEmployeeFormInputChange}
                    className="input-field"
                  />
                  {errors.bankName && (
                    <p className="input-error">{errors.bankName}</p>
                  )}
                </div>
                {/* Account Number */}
                <div className="input-wrapper">
                  <label className=" input-label">Account No.</label>
                  <input
                    type="number"
                    name="accNum"
                    value={employeeFormData.accNum || ''}
                    onKeyDown={(e) => {
                      if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
                        e.preventDefault();
                      }
                    }}
                    onWheel={(e) => e.currentTarget.blur()}
                    onChange={handleEmployeeFormInputChange}
                    className="input-field"
                  />
                  {errors.accNum && (
                    <p className="input-error">{errors.accNum}</p>
                  )}
                </div>
                {/* IFSC */}
                <div className="input-wrapper">
                  <label className=" input-label">IFSC</label>
                  <input
                    type="text"
                    name="ifsc"
                    value={employeeFormData.ifsc || ''}
                    onChange={handleEmployeeFormInputChange}
                    className="input-field"
                  />
                  {errors.ifsc && <p className="input-error">{errors.ifsc}</p>}
                </div>
              </div>

              {/* Second row */}
              <div className="flex gap-4 2xl:gap-6">
                {/* EPF */}
                <div className="input-wrapper">
                  <label className=" input-label">UAN</label>
                  <input
                    type="text"
                    name="epfNo"
                    value={employeeFormData.epfNo || ''}
                    onChange={handleEmployeeFormInputChange}
                    className="input-field"
                  />
                  {errors.epfNo && (
                    <p className="input-error">{errors.epfNo}</p>
                  )}
                </div>
                {/* ESI */}
                <div className="input-wrapper">
                  <label className=" input-label">ESI No.</label>
                  <input
                    type="text"
                    name="esiNo"
                    value={employeeFormData.esiNo || ''}
                    onChange={handleEmployeeFormInputChange}
                    className="input-field"
                  />
                  {errors.esiNo && (
                    <p className="input-error">{errors.esiNo}</p>
                  )}
                </div>
                {/* PAN */}
                <div className="input-wrapper">
                  <label className=" input-label">PAN No.</label>
                  <input
                    type="text"
                    name="pan"
                    value={employeeFormData.pan || ''}
                    onChange={handleEmployeeFormInputChange}
                    className="input-field"
                  />
                  {errors.pan && <p className="input-error">{errors.pan}</p>}
                </div>
              </div>

              {/* Third row */}
              <div className="flex gap-4 2xl:gap-6">
                {/* Aadhaar */}
                <div className="input-wrapper">
                  <label className=" input-label">Aadhaar No.</label>
                  <input
                    type="number"
                    name="aadhaarNo"
                    value={employeeFormData.aadhaarNo || ''}
                    onKeyDown={(e) => {
                      if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
                        e.preventDefault();
                      }
                    }}
                    onWheel={(e) => e.currentTarget.blur()}
                    onChange={handleEmployeeFormInputChange}
                    className="input-field"
                  />
                  {errors.aadhaarNo && (
                    <p className="input-error">{errors.aadhaarNo}</p>
                  )}
                </div>
                {/* Remarks */}
                <div className="flex flex-col gap-1 2xl:gap-2 w-2/3">
                  <label className=" input-label">Remarks</label>
                  <input
                    type="text"
                    name="remarks"
                    value={employeeFormData.remarks || ''}
                    onChange={handleEmployeeFormInputChange}
                    className="input-field"
                  />
                  {errors.remarks && (
                    <p className="input-error">{errors.remarks}</p>
                  )}
                </div>
                {/* Hidden Input Field */}
                {/* <div className=" w-1/4 invisible">
                  <label className=" input-label">
                    Hidden Field
                  </label>
                  <input
                    type="text"
                    name="hiddenField" // Add appropriate name
                    // value={employeeFormData.hiddenField || ''} // Adjust state management
                    onChange={handleEmployeeFormInputChange}
                    className="input-field"
                  />
                </div> */}
              </div>
            </div>
          </Accordion>

          {/* Accordion 4 : Employee Documents */}
          <div
            data-tooltip-id="employeeDetails"
            data-tooltip-content="Fill and save the employee information to upload documents."
          >
            <Accordion
              title="Official Documents"
              // disabled={!isEmployeeFormSubmitted}
            >
              <div className="flex w-full items-center gap-4 2xl:gap-6 pb-4 2xl:pb-6 border-b ">
                <div className="flex justify-between gap-4 2xl:gap-6 w-full">
                  {/* Contract */}
                  <div className="flex flex-col gap-1 2xl:gap-2 cursor-pointer w-1/5">
                    <label className="input-label">Contract</label>
                    <input
                      id="docContract"
                      type="file"
                      name="docContract"
                      onChange={handleFilesInputChange}
                      className="hidden"
                      accept=".pdf,.jpg,.jpeg,.png,.doc,.docx,.xls,.xlsx" // Adjust as needed
                    />
                    <div className="flex flex-row gap-1 2xl:gap-2">
                      {employeeDocsFormData.docContract &&
                      typeof employeeDocsFormData.docContract === 'string' ? (
                        <>
                          <a
                            href={employeeDocsFormData.docContract}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 2xl:gap-2 px-2 h-10 2xl:h-12 rounded-md shadow-sm border border-inputBorder cursor-pointer hover:shadow-md w-full"
                          >
                            <img
                              src={getFileIcon(
                                extractFileNameFromPath(
                                  employeeDocsFormData.docContract
                                ) || ''
                              )}
                              alt="File Icon"
                              className="upload-doc-icon"
                            />
                            <span className="text-labelColour font-medium text-responsive-input overflow-hidden text-ellipsis">
                              {extractFileNameFromPath(
                                employeeDocsFormData.docContract
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
                      ) : employeeDocsFormData.docContract &&
                        employeeDocsFormData.docContract instanceof File &&
                        employeeDocsFormData.docContract.name !== '' ? (
                        <label
                          htmlFor="docContract"
                          className="flex items-center gap-1 2xl:gap-2 px-2 h-10 2xl:h-12 rounded-md shadow-sm border border-inputBorder cursor-pointer hover:shadow-md  w-full"
                        >
                          <img
                            src={getFileIcon(
                              extractNameFromFileObj(
                                employeeDocsFormData.docContract as File
                              ) || ''
                            )}
                            alt="File Icon"
                            className="upload-doc-icon"
                          />
                          <span className="text-labelColour font-medium text-responsive-input overflow-hidden text-ellipsis">
                            {extractNameFromFileObj(
                              employeeDocsFormData.docContract as File
                            )}
                          </span>
                        </label>
                      ) : (
                        <label
                          htmlFor="docContract"
                          className="flex items-center gap-1 2xl:gap-2 px-2 h-10 2xl:h-12 rounded-md shadow-sm border border-inputBorder cursor-pointer hover:shadow-md w-full"
                        >
                          <img
                            src={getFileIcon('')}
                            alt="File Icon"
                            className="upload-doc-icon"
                          />
                          <span className="text-labelColour font-medium text-responsive-input overflow-hidden text-ellipsis w-full">
                            Upload Document
                          </span>
                        </label>
                      )}
                    </div>
                  </div>
                  {/* Resume */}
                  <div className="flex flex-col gap-1 2xl:gap-2 cursor-pointer w-1/5">
                    <label className="input-label">Resume</label>
                    <input
                      id="docResume"
                      type="file"
                      name="docResume"
                      onChange={handleFilesInputChange}
                      className="hidden"
                      accept=".pdf,.jpg,.jpeg,.png,.doc,.docx,.xls,.xlsx"
                    />
                    <div className="flex flex-row gap-1 2xl:gap-2">
                      {employeeDocsFormData.docResume &&
                      typeof employeeDocsFormData.docResume === 'string' ? (
                        <>
                          <a
                            href={employeeDocsFormData.docResume}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 2xl:gap-2 px-2 h-10 2xl:h-12 rounded-md shadow-sm border border-inputBorder cursor-pointer hover:shadow-md  w-full"
                          >
                            <img
                              src={getFileIcon(
                                extractFileNameFromPath(
                                  employeeDocsFormData.docResume
                                ) || ''
                              )}
                              alt="File Icon"
                              className="upload-doc-icon"
                            />
                            <span className="text-labelColour font-medium text-responsive-input overflow-hidden text-ellipsis">
                              {extractFileNameFromPath(
                                employeeDocsFormData.docResume
                              ) || 'Upload Document'}
                            </span>
                          </a>
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              setDeleteFileName('docResume');
                              setShowDeleteModal(true);
                            }}
                          >
                            <img src={Delete_Icon} alt="Delete" />
                          </button>
                        </>
                      ) : employeeDocsFormData.docResume &&
                        employeeDocsFormData.docResume instanceof File &&
                        employeeDocsFormData.docResume.name !== '' ? (
                        <label
                          htmlFor="docResume"
                          className="flex items-center gap-1 2xl:gap-2 px-2 h-10 2xl:h-12 rounded-md shadow-sm border border-inputBorder cursor-pointer hover:shadow-md  w-full"
                        >
                          <img
                            src={getFileIcon(
                              extractNameFromFileObj(
                                employeeDocsFormData.docResume as File
                              ) || ''
                            )}
                            alt="File Icon"
                            className="upload-doc-icon"
                          />
                          <span className="text-labelColour font-medium text-responsive-input overflow-hidden text-ellipsis">
                            {extractNameFromFileObj(
                              employeeDocsFormData.docResume as File
                            )}
                          </span>
                        </label>
                      ) : (
                        <label
                          htmlFor="docResume"
                          className="flex items-center gap-1 2xl:gap-2 px-2 h-10 2xl:h-12 rounded-md shadow-sm border border-inputBorder cursor-pointer hover:shadow-md  w-full"
                        >
                          <img
                            src={getFileIcon('')}
                            alt="File Icon"
                            className="upload-doc-icon"
                          />
                          <span className="text-labelColour font-medium text-responsive-input overflow-hidden text-ellipsis">
                            Upload Document
                          </span>
                        </label>
                      )}
                    </div>
                  </div>
                  {/* PAN Card */}
                  <div className="flex flex-col gap-1 2xl:gap-2 cursor-pointer w-1/5">
                    <label className="input-label">PAN Card</label>
                    <input
                      id="docPan"
                      type="file"
                      name="docPan"
                      onChange={handleFilesInputChange}
                      className="hidden"
                      accept=".pdf,.jpg,.jpeg,.png,.doc,.docx,.xls,.xlsx"
                    />
                    <div className="flex flex-row gap-1 2xl:gap-2">
                      {employeeDocsFormData.docPan &&
                      typeof employeeDocsFormData.docPan === 'string' ? (
                        <>
                          <a
                            href={employeeDocsFormData.docPan}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 2xl:gap-2 px-2 h-10 2xl:h-12 rounded-md shadow-sm border border-inputBorder cursor-pointer hover:shadow-md  w-full"
                          >
                            <img
                              src={getFileIcon(
                                extractFileNameFromPath(
                                  employeeDocsFormData.docPan
                                ) || ''
                              )}
                              alt="File Icon"
                              className="w-7 h-7"
                            />
                            <span className="text-labelColour font-medium text-responsive-input overflow-hidden text-ellipsis">
                              {extractFileNameFromPath(
                                employeeDocsFormData.docPan
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
                      ) : employeeDocsFormData.docPan &&
                        employeeDocsFormData.docPan instanceof File &&
                        employeeDocsFormData.docPan.name !== '' ? (
                        <label
                          htmlFor="docPan"
                          className="flex items-center gap-1 2xl:gap-2 px-2 h-10 2xl:h-12 rounded-md shadow-sm border border-inputBorder cursor-pointer hover:shadow-md  w-full"
                        >
                          <img
                            src={getFileIcon(
                              extractNameFromFileObj(
                                employeeDocsFormData.docPan as File
                              ) || ''
                            )}
                            alt="File Icon"
                            className="upload-doc-icon"
                          />
                          <span className="text-labelColour font-medium text-responsive-input overflow-hidden text-ellipsis">
                            {extractNameFromFileObj(
                              employeeDocsFormData.docPan as File
                            )}
                          </span>
                        </label>
                      ) : (
                        <label
                          htmlFor="docPan"
                          className="flex items-center gap-1 2xl:gap-2 px-2 h-10 2xl:h-12 rounded-md shadow-sm border border-inputBorder cursor-pointer hover:shadow-md  w-full"
                        >
                          <img
                            src={getFileIcon('')}
                            alt="File Icon"
                            className="upload-doc-icon"
                          />
                          <span className="text-labelColour font-medium text-responsive-input overflow-hidden text-ellipsis">
                            Upload Document
                          </span>
                        </label>
                      )}
                    </div>
                  </div>
                  {/* Aadhaar */}
                  <div className="flex flex-col gap-1 2xl:gap-2 cursor-pointer w-1/5">
                    <label className="input-label">Aadhaar</label>
                    <input
                      id="docAadhaar"
                      type="file"
                      name="docAadhaar"
                      onChange={handleFilesInputChange}
                      className="hidden"
                      accept=".pdf,.jpg,.jpeg,.png,.doc,.docx,.xls,.xlsx"
                    />
                    <div className="flex flex-row gap-1 2xl:gap-2">
                      {employeeDocsFormData.docAadhaar &&
                      typeof employeeDocsFormData.docAadhaar === 'string' ? (
                        <>
                          <a
                            href={employeeDocsFormData.docAadhaar}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 2xl:gap-2 px-2 h-10 2xl:h-12 rounded-md shadow-sm border border-inputBorder cursor-pointer hover:shadow-md  w-full"
                          >
                            <img
                              src={getFileIcon(
                                extractFileNameFromPath(
                                  employeeDocsFormData.docAadhaar
                                ) || ''
                              )}
                              alt="File Icon"
                              className="upload-doc-icon"
                            />
                            <span className="text-labelColour font-medium text-responsive-input overflow-hidden text-ellipsis">
                              {extractFileNameFromPath(
                                employeeDocsFormData.docAadhaar
                              ) || 'Upload Document'}
                            </span>
                          </a>
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              setDeleteFileName('docAadhaar');
                              setShowDeleteModal(true);
                            }}
                          >
                            <img src={Delete_Icon} alt="Delete" />
                          </button>
                        </>
                      ) : employeeDocsFormData.docAadhaar &&
                        employeeDocsFormData.docAadhaar instanceof File &&
                        employeeDocsFormData.docAadhaar.name !== '' ? (
                        <label
                          htmlFor="docAadhaar"
                          className="flex items-center gap-1 2xl:gap-2 px-2 h-10 2xl:h-12 rounded-md shadow-sm border border-inputBorder cursor-pointer hover:shadow-md  w-full"
                        >
                          <img
                            src={getFileIcon(
                              extractNameFromFileObj(
                                employeeDocsFormData.docAadhaar as File
                              ) || ''
                            )}
                            alt="File Icon"
                            className="upload-doc-icon"
                          />
                          <span className="text-labelColour font-medium text-responsive-input overflow-hidden text-ellipsis">
                            {extractNameFromFileObj(
                              employeeDocsFormData.docAadhaar as File
                            )}
                          </span>
                        </label>
                      ) : (
                        <label
                          htmlFor="docAadhaar"
                          className="flex items-center gap-1 2xl:gap-2 px-2 h-10 2xl:h-12 rounded-md shadow-sm border border-inputBorder cursor-pointer hover:shadow-md  w-full"
                        >
                          <img
                            src={getFileIcon('')}
                            alt="File Icon"
                            className="upload-doc-icon"
                          />
                          <span className="text-labelColour font-medium text-responsive-input overflow-hidden text-ellipsis">
                            Upload Document
                          </span>
                        </label>
                      )}
                    </div>
                  </div>
                  {/* Others */}
                  <div className="flex flex-col gap-1 2xl:gap-2 cursor-pointer w-1/5">
                    <label className="input-label">Others</label>
                    <input
                      id="docOther"
                      type="file"
                      name="docOther"
                      onChange={handleFilesInputChange}
                      className="hidden"
                      accept=".pdf,.jpg,.jpeg,.png,.doc,.docx,.xls,.xlsx"
                    />
                    <div className="flex flex-row gap-1 2xl:gap-2">
                      {employeeDocsFormData.docOther &&
                      typeof employeeDocsFormData.docOther === 'string' ? (
                        <>
                          <a
                            href={employeeDocsFormData.docOther}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 px-2 h-10 2xl:h-12 rounded-md shadow-sm border border-inputBorder cursor-pointer hover:shadow-md  w-full"
                          >
                            <img
                              src={getFileIcon(
                                extractFileNameFromPath(
                                  employeeDocsFormData.docOther
                                ) || ''
                              )}
                              alt="File Icon"
                              className="upload-doc-icon"
                            />
                            <span className="text-labelColour font-medium text-responsive-input overflow-hidden text-ellipsis">
                              {extractFileNameFromPath(
                                employeeDocsFormData.docOther
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
                      ) : employeeDocsFormData.docOther &&
                        employeeDocsFormData.docOther instanceof File &&
                        employeeDocsFormData.docOther.name !== '' ? (
                        <label
                          htmlFor="docOther"
                          className="flex items-center gap-1 2xl:gap-2 px-2 h-10 2xl:h-12 rounded-md shadow-sm border border-inputBorder cursor-pointer hover:shadow-md  w-full"
                        >
                          <img
                            src={getFileIcon(
                              extractNameFromFileObj(
                                employeeDocsFormData.docOther as File
                              ) || ''
                            )}
                            alt="File Icon"
                            className="upload-doc-icon"
                          />
                          <span className="text-labelColour font-medium text-responsive-input overflow-hidden text-ellipsis">
                            {extractNameFromFileObj(
                              employeeDocsFormData.docOther as File
                            )}
                          </span>
                        </label>
                      ) : (
                        <label
                          htmlFor="docOther"
                          className="flex items-center gap-1 2xl:gap-2 px-2 h-10 2xl:h-12 rounded-md shadow-sm border border-inputBorder cursor-pointer hover:shadow-md  w-full"
                        >
                          <img
                            src={getFileIcon('')}
                            alt="File Icon"
                            className="upload-doc-icon"
                          />
                          <span className="text-labelColour font-medium text-responsive-input overflow-hidden text-ellipsis">
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
          <div className="flex justify-center gap-6 py-2 mb-4">
            <ClearButton
              type="button"
              onClick={() => setEmployeeFormData(defaultEmployeeFormData)}
            >
              Clear
            </ClearButton>
            <SmallButton type="submit">Save</SmallButton>
          </div>
        </form>
        <Tooltip
          hidden={isEmployeeFormSubmitted}
          id="employeeDetails"
          content="Employee Information"
          place="right"
        />
        <Tooltip
          float
          hidden={allPostsData.length > 0}
          id="noPosts"
          place="right"
        />
        <Tooltip
          // float
          hidden={isEmployeeFormSubmitted}
          id="empIdTooltip"
          place="bottom"
        />
        {showDeleteModal && (
          <ConfirmationModal
            confirmButtonTitle="Delete"
            cancelButtonTitle="Cancel"
            onConfirm={() => {
              handleDeleteFile(deleteFileName);
            }}
            onCancel={() => setShowDeleteModal(false)}
            message={`Are you sure you want to delete the ${getLabel(deleteFileName)}?`}
          />
        )}
      </div>
      {showTransferEmployeeModal && (
        <EmployeeTransferModal
          confirmButtonTitle="Save Changes"
          cancelButtonTitle="Cancel"
          updateNewSelectedPostRankId={handleUpdateTransferPostRank}
          updateTransferPostingDate={handleUpdateTransferPostingDate}
          onConfirm={(e) => {
            e.stopPropagation();
            e.preventDefault();
            handleTransfer(savedEmployeeId);
          }}
          onCancel={() => setShowTransferEmployeeModal(false)}
          message={`Please confirm that you want to transfer ${savedEmployeeName} to another post?`}
        />
      )}
      {showDischargeEmployeeModal && (
        <EmployeeDischargeModal
          confirmButtonTitle="Discharge"
          cancelButtonTitle="Cancel"
          updateDischargePostingDate={handleUpdateDischargePostingDate}
          onConfirm={(e) => {
            e.stopPropagation();
            e.preventDefault();
            // console.log(
            //   'What is the savedEmployeeScheduleData ID:',
            //   savedEmployeeScheduleData.ID
            // );
            handleDischarge(
              savedEmployeeId,
              savedEmployeeScheduleData.postRankLinkId
            );
          }}
          onCancel={() => setShowDischargeEmployeeModal(false)}
          message={`Are you sure you want to discharge the employee ${savedEmployeeName} from the current post?`}
        />
      )}
      {showDirectTransferEmployeeModal && (
        <ConfirmationModal
          confirmButtonTitle="Transfer"
          cancelButtonTitle="Cancel"
          onConfirm={() => {
            // handleScheduleEmployee(savedEmployeeId); // TODO: Change it to transfer employee ???
            handleTransfer(savedEmployeeId);
          }}
          onCancel={() => {
            setShowDirectTransferEmployeeModal(false);
            setCurrentSelectedPostId(0);
            setCurrentSelectedPostRankId(0);
            setPostingDate('');
            setIsScheduleModified(false);
            fetchEmployeeSchedule();
          }}
          message={`Are you sure you want to transfer the employee ${savedEmployeeName} to ${directTransferPostName} as ${directTransferRankName}?`}
        />
      )}
    </>
  );
};

export default AddEmployeeForm;
