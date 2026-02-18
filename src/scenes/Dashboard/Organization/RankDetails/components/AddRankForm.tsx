/* Libraries */
import React, { useState } from 'react';
import axios, { AxiosError } from 'axios';
import { useNavigate } from 'react-router';
import { toast } from 'react-toastify';
import * as Yup from 'yup';

/* Configs */
import { api } from '../../../../../configs/api';

/* Hooks */
import useScrollToTop from '../../../../../hooks/useScrollToTop';
import useVerifyUserAuth from '../../../../../hooks/useVerifyUserAuth';
import useHandleAxiosError from '../../../../../hooks/useHandleAxiosError';
import useHandleYupError from '../../../../../hooks/useHandleYupError';

/* Types */
import { Rank } from '../../../../../types/rank';

/* Components */
import BreadCrumb from '../../../../../common/BreadCrumb/BreadCrumb';
import ClearButton from '../../../../../common/Button/ClearButton';
import SmallButton from '../../../../../common/Button/SmallButton';
import Loader from '../../../../../common/Loader/Loader';

/* Assets */
import { Arrow_Back_Blue } from '../../../../../assets/icons';

// css
import '../../../../../App.css';

/* Form Validation Schema */
const rankValidationSchema = Yup.object().shape({
  designation: Yup.string().required('Designation is required'),
  basicSalary: Yup.number()
    .required('Basic Salary is required')
    .integer('Basic Salary must be an integer')
    .min(1, 'Basic Salary is required'),
  hra: Yup.number()
    .integer('House Rent must be an integer')
    .min(0, 'House Rent must be 0 or a positive number'),
  kitWashingAllowance: Yup.number()
    .integer('Kit/Washing Allowance must be an integer')
    .min(0, 'Kit/Washing Allowance must be 0 or a positive number'),
  cityAllowance: Yup.number()
    .integer('City Allowance must be an integer')
    .min(0, 'City Allowance must be 0 or a positive number'),
  conveyance: Yup.number()
    .integer('Conveyance must be an integer')
    .min(0, 'Conveyance must be 0 or a positive number'),
  vda: Yup.number()
    .integer('VDA must be an integer')
    .min(0, 'VDA must be 0 or a positive number'),
  uniformAllowance: Yup.number()
    .integer('Uniform Allowance must be an integer')
    .min(0, 'Uniform Allowance must be 0 or a positive number'),
  otherAllowance: Yup.number()
    .integer('Others must be an integer')
    .min(0, 'Others must be 0 or a positive number'),
  specialAllowance: Yup.number()
    .integer('Special Allowance must be an integer')
    .min(0, 'Special Allowance must be 0 or a positive number'),
  weeklyOff: Yup.number()
    .integer('Weekly Off must be an integer')
    .min(0, 'Weekly Off must be 0 or a positive number'),
});

/* Default Form Data */
const defaultRankFormData = {
  designation: '',
  basicSalary: 0,
  hra: 0,
  kitWashingAllowance: 0,
  cityAllowance: 0,
  conveyance: 0,
  vda: 0,
  uniformAllowance: 0,
  otherAllowance: 0,
  specialAllowance: 0,
  weeklyOff: 0,
};

/* Add Rank Form Main Component */
const AddRankForm: React.FC = () => {
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

  /* Add Rank Form Data Handling */
  const [rankFormData, setRankFormData] = useState<Rank>(defaultRankFormData);

  const handleFormInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setRankFormData((prevData) => ({
      ...prevData,
      [name]: name === 'designation' ? value : Math.max(0, Number(value) || 0),
    }));
  };

  const handleSubmitRankForm = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      setErrors({});
      await rankValidationSchema.validate(rankFormData, { abortEarly: false });

      console.log('Submitting Data:', rankFormData);

      const response = await axios.post(`${api.baseUrl}/ranks`, rankFormData, {
        headers: {
          'x-access-token': accessToken,
        },
      });

      console.log('api response', response.data);

      if (response.data.success) {
        toast.success(response.data.message);
        navigate('/paytrack/organisation/rank-details');
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

  /* JSX */
  return (
    <>
      {isLoading && <Loader />}
      {/* bradcrumb and back button */}
      <div className="flex flex-col gap-2.5 2xl:gap-4 fixed z-20 padding-responsive-header-container-type-1">
        <BreadCrumb />
        {/* back button */}
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
            <button className="text-bgPrimaryButton hover:text-bgPrimaryButtonHover font-Mona_Sans text-sm 2xl:text-base font-semibold">
              Back
            </button>
          </button>
        </div>
      </div>
      {/* rank information highlight section */}
      <div className="flex items-center mt-[70px] 2xl:mt-24 h-10 2xl:h-14 padding-responsive-header-container-type-1 bg-tableHeadingColour">
        <h2 className="font-semibold text-primaryText text-sm 2xl:text-base">
          Rank Information
        </h2>
      </div>
      {/* form */}
      <div className="bg-white  z-10 overflow-y-auto h-[calc(100vh-110px)] 2xl:h-[100vh] scrollbar scrollbar-thumb-scrollBarColor scrollbar-track-scrollBarBg">
        <form
          onSubmit={handleSubmitRankForm}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              handleSubmitRankForm(e);
            }
          }}
          className="relative w-full h-full mx-auto px-4 2xl:px-8 py-4 2xl:py-6 shadow-md"
        >
          <div className="flex flex-col space-y-4 lg:space-y-0 lg:flex-row lg:space-x-12 xl:space-x-16 2xl:space-x-20">
            {/* First Column */}
            <div className="flex flex-1 flex-col gap-4 2xl:gap-6 ">
              {/* Rank */}
              <div className="flex flex-col gap-1 2xl:gap-2">
                <h2 className="primaryHeadings text-secondaryText">&nbsp;</h2>
                <label className="input-label mt-2 lg:mt-4">
                  Rank <span className="input-error pl-1">*</span>
                </label>
                <input
                  type="text"
                  name="designation"
                  value={rankFormData.designation || ''}
                  onChange={handleFormInputChange}
                  className="px-2 w-full h-10 2xl:h-12 text-responsive-input rounded-md shadow-sm border border-inputBorder"
                />
                {errors.designation && (
                  <p className="input-error">{errors.designation}</p>
                )}
              </div>
              {/* Basic Salary */}
              <div className="flex flex-col gap-1 2xl:gap-2">
                <label className="input-label">
                  Basic Salary <span className="input-error pl-1">*</span>
                </label>
                <input
                  type="number"
                  name="basicSalary"
                  value={rankFormData.basicSalary || ''}
                  onKeyDown={(e) => {
                    if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
                      e.preventDefault();
                    }
                  }}
                  onWheel={(e) => e.currentTarget.blur()}
                  onChange={handleFormInputChange}
                  className="px-2 w-full h-10 2xl:h-12 text-responsive-input rounded-md shadow-sm border border-inputBorder"
                />
                {errors.basicSalary && (
                  <p className="input-error">{errors.basicSalary}</p>
                )}
              </div>
            </div>

            {/* Second Column */}
            <div className="lg:flex-1 flex flex-col gap-4 2xl:gap-6 lg:pl-12 xl:pl-16 2xl:pl-20">
              {/* House Rent */}
              <div className="flex flex-col gap-1 2xl:gap-2">
                <h2 className="font-semibold text-primaryText text-sm 2xl:text-base">
                  Allowances
                </h2>
                <label className="input-label mt-6 2xl:mt-[19px]">
                  House Rent
                </label>
                <input
                  type="number"
                  name="hra"
                  value={rankFormData.hra || ''}
                  onKeyDown={(e) => {
                    if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
                      e.preventDefault();
                    }
                  }}
                  onWheel={(e) => e.currentTarget.blur()}
                  onChange={handleFormInputChange}
                  className="px-2 w-full h-10 2xl:h-12 text-responsive-input rounded-md shadow-sm border border-inputBorder"
                />
                {errors.hra && <p className="input-error">{errors.hra}</p>}
              </div>
              {/* Conveyance */}
              <div className="flex flex-col gap-1 2xl:gap-2">
                <label className="input-label">Conveyance</label>
                <input
                  type="number"
                  name="conveyance"
                  value={rankFormData.conveyance || ''}
                  onKeyDown={(e) => {
                    if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
                      e.preventDefault();
                    }
                  }}
                  onWheel={(e) => e.currentTarget.blur()}
                  onChange={handleFormInputChange}
                  className="px-2 w-full h-10 2xl:h-12 text-responsive-input rounded-md shadow-sm border border-inputBorder"
                />
                {errors.conveyance && (
                  <p className="input-error">{errors.conveyance}</p>
                )}
              </div>
              {/* Kit/Washing Allowance */}
              <div className="flex flex-col gap-1 2xl:gap-2">
                <label className="input-label">Kit/Washing Allowance</label>
                <input
                  type="number"
                  name="kitWashingAllowance"
                  value={rankFormData.kitWashingAllowance || ''}
                  onChange={handleFormInputChange}
                  onKeyDown={(e) => {
                    if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
                      e.preventDefault();
                    }
                  }}
                  onWheel={(e) => e.currentTarget.blur()}
                  className="px-2 w-full h-10 2xl:h-12 text-responsive-input rounded-md shadow-sm border border-inputBorder"
                />
                {errors.kitWashingAllowance && (
                  <p className="input-error">{errors.kitWashingAllowance}</p>
                )}
              </div>
              {/* Uniform Allowance */}
              <div className="flex flex-col gap-1 2xl:gap-2">
                <label className="input-label">Uniform</label>
                <input
                  type="number"
                  name="uniformAllowance"
                  value={rankFormData.uniformAllowance || ''}
                  onKeyDown={(e) => {
                    if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
                      e.preventDefault();
                    }
                  }}
                  onWheel={(e) => e.currentTarget.blur()}
                  onChange={handleFormInputChange}
                  className="px-2 w-full h-10 2xl:h-12 text-responsive-input rounded-md shadow-sm border border-inputBorder"
                />
                {errors.uniformAllowance && (
                  <p className="input-error">{errors.uniformAllowance}</p>
                )}
              </div>
            </div>

            {/* Third Column */}
            <div className="flex-1 flex flex-col gap-4 2xl:gap-6">
              {/* City Allowance */}
              <div className="flex flex-col gap-1 2xl:gap-2">
                <h2 className="primaryHeadings text-secondaryText">&nbsp;</h2>
                <label className="input-label mt-2 lg:mt-4">
                  City Allowance
                </label>
                <input
                  type="number"
                  name="cityAllowance"
                  value={rankFormData.cityAllowance || ''}
                  onChange={handleFormInputChange}
                  onKeyDown={(e) => {
                    if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
                      e.preventDefault();
                    }
                  }}
                  onWheel={(e) => e.currentTarget.blur()}
                  className="px-2 w-full h-10 2xl:h-12 text-responsive-input rounded-md shadow-sm border border-inputBorder"
                />
                {errors.cityAllowance && (
                  <p className="input-error">{errors.cityAllowance}</p>
                )}
              </div>
              {/* VDA */}
              {/* <div className="flex flex-col gap-2">
                <label className="primaryLabels text-secondaryText">VDA</label>
                <input
                  type="number"
                  name="vda"
                  value={rankFormData.vda || ''}
                  onChange={handleFormInputChange}
                  onKeyDown={(e) => {
                    if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
                      e.preventDefault();
                    }
                  }}
                  onWheel={(e) => e.currentTarget.blur()}
                  className="p-2 h-[48px] md:h-[56px] 2xl:h-[60px] border border-inputBorder rounded-md shadow-sm"
                />
                {errors.vda && <p className="text-red-500">{errors.vda}</p>}
              </div> */}
              {/* Others */}
              {/* <div className="flex flex-col gap-2">
                <label className="primaryLabels text-secondaryText">
                  Other Allowances
                </label>
                <input
                  type="number"
                  name="otherAllowance"
                  value={rankFormData.otherAllowance || ''}
                  onChange={handleFormInputChange}
                  onKeyDown={(e) => {
                    if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
                      e.preventDefault();
                    }
                  }}
                  onWheel={(e) => e.currentTarget.blur()}
                  className="p-2 h-[48px] md:h-[56px] 2xl:h-[60px] border border-inputBorder rounded-md shadow-sm"
                />
                {errors.otherAllowance && (
                  <p className="text-red-500">{errors.otherAllowance}</p>
                )}
              </div> */}
              {/* special allowance */}
              <div className="flex flex-col gap-1 2xl:gap-2">
                <label className="input-label">Special Allowance</label>
                <input
                  type="number"
                  name="specialAllowance"
                  value={rankFormData.specialAllowance || ''}
                  onChange={handleFormInputChange}
                  onKeyDown={(e) => {
                    if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
                      e.preventDefault();
                    }
                  }}
                  onWheel={(e) => e.currentTarget.blur()}
                  className="px-2 w-full h-10 2xl:h-12 text-responsive-input rounded-md shadow-sm border border-inputBorder"
                />
                {errors.specialAllowance && (
                  <p className="input-error">{errors.specialAllowance}</p>
                )}
              </div>
              {/* weekly off */}
              <div className="flex flex-col gap-1 2xl:gap-2">
                <label className="input-label">Weekly Off</label>
                <input
                  type="number"
                  name="weeklyOff"
                  value={rankFormData.weeklyOff || ''}
                  onChange={handleFormInputChange}
                  onKeyDown={(e) => {
                    if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
                      e.preventDefault();
                    }
                  }}
                  onWheel={(e) => e.currentTarget.blur()}
                  className="px-2 w-full h-10 2xl:h-12 text-responsive-input rounded-md shadow-sm border border-inputBorder"
                />
                {errors.weeklyOff && (
                  <p className="input-error">{errors.weeklyOff}</p>
                )}
              </div>
            </div>
          </div>
          {/* Buttons */}
          <div className="flex justify-center gap-4 2xl:gap-6 py-4 mt-4">
            <ClearButton
              type="button"
              onClick={() => {
                setErrors({});
                setRankFormData(defaultRankFormData);
              }}
            >
              Clear
            </ClearButton>
            <SmallButton type="submit">Save</SmallButton>
          </div>
        </form>
      </div>
    </>
  );
};

export default AddRankForm;
