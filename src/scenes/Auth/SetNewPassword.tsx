// Libraries
import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import * as Yup from 'yup';
import axios from 'axios';

// Configs
import { api } from '../../configs/api';

// Assets
import { Arrow_Back, Eye_Off, Eye_On } from '../../assets/icons';
import { toast } from 'react-toastify';

// Main component
const SetNewPassword = () => {
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: '',
  });
  const [isResetSuccessful, setIsResetSuccessful] = useState(false);

  // Get resetToken from URL parameters using native JavaScript
  const urlParams = new URLSearchParams(window.location.search);
  const resetToken = urlParams.get('resetToken');

  // console.log('resetToken: ', resetToken);

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // validation schema
  const validationSchema = Yup.object({
    password: Yup.string()
      .required('Password is required')
      .min(8, 'Password must be at least 6 characters')
      .max(20, 'Password must not exceed 20 characters')
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*()]).{8,}$/,
        'Password must contain at least one uppercase letter, one lowercase letter, one number and one special character'
      ),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password')], 'Password must match')
      .required('Confirm password is required'),
  });

  // handle form change
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  // handle form submission
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      setErrors({});
      await validationSchema.validate(formData, { abortEarly: false });
      // toast.success('Password set successfully');
      // console.log('Reset now');
      const response = await axios.post(
        `${api.baseUrl}${api.setNewPassword}/${resetToken}`,
        {
          newPassword: formData.password,
        }
      );

      if (response.data && response.data.success) {
        // console.log('response.data:', response.data);
        toast.success('Password set successfully');
        setIsResetSuccessful(true);
      } else {
        // Set errors based on the response field and message
        setErrors({
          [response.data.field]: response.data.message,
        });
        toast.error(response.data.message || 'Something went wrong');
      }
    } catch (error) {
      const newError: { [key: string]: string } = {};
      if (error instanceof Yup.ValidationError) {
        error.inner.forEach((err) => {
          if (err.path) newError[err.path] = err.message;
        });
        toast.error('Validation error');
      }
      if (axios.isAxiosError(error) && error.response) {
        const { field, message } = error.response.data;
        newError[field] = message;
        toast.error(message || 'API error occurred');
        setErrors(newError);
      }
      setErrors(newError);
    }
  };

  // State variable to track password visibility
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setconfirmPasswordVisible] = useState(false);

  // Function to toggle password visibility
  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };
  const toggleConfirmPasswordVisibility = () => {
    setconfirmPasswordVisible(!confirmPasswordVisible);
  };
  const navigate = useNavigate();
  return (
    <>
      {/* <div className="flex items-center justify-center h-screen">
        <section className="relative bg-bgPrimary font-Mona_Sans w-full max-w-screen-sm px-[5%] py-[5%]  rounded-3xl flex flex-col md:gap-8 lg:gap-10 xl:gap-12">
          <div className="absolute top-[5%] left-[5%] flex gap-2">
            <button
              onClick={() => navigate('/paytrack/auth/login')}
              className="flex flex-row items-center gap-2 text-black font-medium text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl"
            >
              <img src={Arrow_Back} alt="arrow_back" />
              Back
            </button>
          </div>
          <div className="w-full flex flex-col gap-6">
            <h2 className="md:text-lg lg:text-xl xl:text-2xl font-semibold text-center text-[#202020]">
              {isResetSuccessful
                ? 'Password Reset Successful'
                : 'Set New Password'}
            </h2>

            {isResetSuccessful && (
              <p className="text-left text-secondaryText text-xs md:text-sm lg:text-base xl:text-lg text-opacity-55 font-medium">
                Password has been set. You can now login with your new password.
                Click below to login.
              </p>
            )}
            {!isResetSuccessful ? (
              <form
                onSubmit={handleSubmit}
                className="flex flex-col gap-4 md:gap-6 lg:gap-8 xl:gap-10 2xl:gap-12 w-full"
              >
                <div
                  className={`space-y-4 relative ${errors.password ? 'pb-24 transition-all duration-300 ease-in-out' : 'pb-0 transition-all duration-300 ease-in-out'}`}
                >
                  <label
                    htmlFor="password"
                    className="text-secondaryText font-medium text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl"
                  >
                    Password
                  </label>
                  <div className="flex flex-col gap-2 relative">
                    <input
                      type={passwordVisible ? 'text' : 'password'}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Enter new Password"
                      className={`w-full border rounded-md p-2 lg:p-3 xl:p-4 placeholder:text-xs md:placeholder:text-sm lg:placeholder:text-base xl:placeholder:text-lg text-xs md:text-base ${errors.password ? 'border-inputError' : 'border-inputBorder'}`}
                    />
                    <div
                      className="absolute md:top-[50%]  transform -translate-y-1/2 right-4"
                      onClick={togglePasswordVisibility}
                    >
                      {passwordVisible ? (
                        <img
                          src={Eye_On}
                          alt="eye"
                          className="cursor-pointer w-4 lg:w-5"
                        />
                      ) : (
                        <img
                          src={Eye_Off}
                          alt="eye"
                          className="cursor-pointer w-4 lg:w-5"
                        />
                      )}
                    </div>
                  </div>

                  {errors.password && (
                    <p className="text-inputError text-xs md:text-sm absolute left-0 bottom-0 transition-all duration-500 ease-in-out">
                      {errors.password}
                    </p>
                  )}
                </div>

                <div
                  className={`space-y-4 relative ${errors.confirmPassword ? 'pb-16 xl:pb-12 transition-all duration-300 ease-in-out' : 'pb-0 transition-all duration-300 ease-in-out'}`}
                >
                  <label
                    htmlFor="password"
                    className="text-secondaryText font-medium text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl"
                  >
                    Confirm Password
                  </label>
                  <div className="flex flex-col gap-2 relative">
                    <input
                      type={confirmPasswordVisible ? 'text' : 'password'}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="Confirm Password"
                      className={`w-full border rounded-md p-2 lg:p-3 xl:p-4 placeholder:text-xs md:placeholder:text-sm lg:placeholder:text-base xl:placeholder:text-lg text-xs md:text-base ${errors.confirmPassword ? 'border-inputError' : 'border-inputBorder'}`}
                    />
                    <div
                      className="absolute top-[50%] transform -translate-y-1/2 right-4"
                      onClick={toggleConfirmPasswordVisibility}
                    >
                      {confirmPasswordVisible ? (
                        <img
                          src={Eye_On}
                          alt="eye"
                          className="cursor-pointer w-4 lg:w-5"
                        />
                      ) : (
                        <img
                          src={Eye_Off}
                          alt="eye"
                          className="cursor-pointer w-4 lg:w-5"
                        />
                      )}
                    </div>
                  </div>

                  {errors.confirmPassword && (
                    <p className="text-inputError text-xs md:text-sm absolute left-0 bottom-0 transition-all duration-500 ease-in-out">
                      {errors.confirmPassword}
                    </p>
                  )}
                </div>

                <div className="flex flex-col gap-2 md:gap-4">
                  <button className="bg-primaryText hover:bg-secondaryText hover:scale-110 text-white text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl font-medium rounded-md p-2 xl:p-3 w-full">
                    Reset
                  </button>

                  <button
                    onClick={() => navigate('/login')}
                    className="text-secondaryText hover:scale-110 text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl font-medium rounded-md p-2 xl:p-3 w-full"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <button
                className="bg-primaryText hover:bg-secondaryText hover:scale-110 text-white text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl font-medium rounded-md p-2 xl:p-3 w-full"
                onClick={() => navigate('/paytrack/auth/login')}
              >
                Continue
              </button>
            )}
          </div>
        </section>
      </div> */}
      <div className="flex items-center justify-center h-screen">
        <section className="relative border border-inputBorder font-Mona_Sans w-full max-w-sm lg:max-w-lg px-[5%] 2xl:px-[3%] pt-[10%] 2xl:pt-[6%] pb-[5%] 2xl:pb-[3%] rounded-3xl flex flex-col md:gap-8 lg:gap-10 xl:gap-12">
          {/* Back button */}
          <div className="absolute top-[5%] left-[5%] flex gap-2">
            <button
              onClick={() => navigate('/paytrack/auth/login')}
              className="flex flex-row items-center gap-2 text-black font-medium text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl"
            >
              <img src={Arrow_Back} alt="arrow_back" />
              Back
            </button>
          </div>

          {/* Heading */}
          <div className="w-full flex flex-col gap-6 xl:gap-8">
            <h2 className="md:text-lg lg:text-xl xl:text-2xl font-semibold text-center text-[#202020]">
              {isResetSuccessful
                ? 'Password Reset Successful'
                : 'Set New Password'}
            </h2>

            {/* Success Message */}
            {isResetSuccessful && (
              <p className="text-left text-secondaryText text-xs md:text-sm lg:text-base xl:text-lg text-opacity-55 font-medium">
                Password has been set. You can now login with your new password.
                Click below to login.
              </p>
            )}

            {/* Form Section */}
            {!isResetSuccessful ? (
              <form
                onSubmit={handleSubmit}
                className="flex flex-col gap-4 md:gap-6 lg:gap-8 xl:gap-10 2xl:gap-12 w-full"
              >
                {/* Password Field */}
                <div
                  className={`space-y-4 relative ${errors.password ? 'pb-16 lg:pb-12' : 'pb-16 lg:pb-12'} transition-all duration-300 ease-in-out`}
                >
                  <label
                    htmlFor="password"
                    className="text-secondaryText font-medium text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl"
                  >
                    Password
                  </label>
                  <div className="flex flex-col gap-2 relative">
                    <input
                      type={passwordVisible ? 'text' : 'password'}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Enter new Password"
                      className={`w-full border rounded-md p-3 xl:p-4 placeholder:text-xs md:placeholder:text-sm lg:placeholder:text-base xl:placeholder:text-lg text-xs md:text-base ${errors.password ? 'border-inputError' : 'border-inputBorder'}`}
                    />
                    <div
                      className="absolute md:top-[50%] transform -translate-y-1/2 right-4"
                      onClick={togglePasswordVisibility}
                    >
                      <img
                        src={passwordVisible ? Eye_On : Eye_Off}
                        alt="eye"
                        className="cursor-pointer w-4 lg:w-5"
                      />
                    </div>
                  </div>
                  {errors.password && (
                    <p className="text-inputError text-xs md:text-sm absolute left-0 bottom-0 transition-all duration-500 ease-in-out">
                      {errors.password}
                    </p>
                  )}
                </div>

                {/* Confirm Password Field */}
                <div
                  className={`space-y-4 relative ${errors.confirmPassword ? 'pb-7' : 'pb-7'} transition-all duration-300 ease-in-out`}
                >
                  <label
                    htmlFor="password"
                    className="text-secondaryText font-medium text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl"
                  >
                    Confirm Password
                  </label>
                  <div className="flex flex-col gap-2 relative">
                    <input
                      type={confirmPasswordVisible ? 'text' : 'password'}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="Confirm Password"
                      className={`w-full border rounded-md p-3 xl:p-4 placeholder:text-xs md:placeholder:text-sm lg:placeholder:text-base xl:placeholder:text-lg text-xs md:text-base ${errors.confirmPassword ? 'border-inputError' : 'border-inputBorder'}`}
                    />
                    <div
                      className="absolute top-[50%] transform -translate-y-1/2 right-4"
                      onClick={toggleConfirmPasswordVisibility}
                    >
                      <img
                        src={confirmPasswordVisible ? Eye_On : Eye_Off}
                        alt="eye"
                        className="cursor-pointer w-4 lg:w-5"
                      />
                    </div>
                  </div>
                  {errors.confirmPassword && (
                    <p className="text-inputError text-xs md:text-sm absolute left-0 bottom-0 transition-all duration-500 ease-in-out">
                      {errors.confirmPassword}
                    </p>
                  )}
                </div>

                {/* CTA Buttons */}
                <div className="flex flex-col gap-2 md:gap-4">
                  <button className="bg-bgPrimaryButton hover:bg-bgPrimaryButtonHover hover:scale-110 text-white text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl font-medium rounded-md p-3 xl:p-4 w-full">
                    Reset
                  </button>

                  <button
                    onClick={() => navigate('/login')}
                    className="text-secondaryText hover:scale-110 text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl font-medium rounded-md p-3 xl:p-4 w-full"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <button
                className="bg-bgPrimaryButton hover:bg-bgPrimaryButtonHover hover:scale-110 text-white text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl font-medium rounded-md p-3 xl:p-4 w-full"
                onClick={() => navigate('/paytrack/auth/login')}
              >
                Continue
              </button>
            )}
          </div>
        </section>
      </div>
    </>
  );
};

export default SetNewPassword;
