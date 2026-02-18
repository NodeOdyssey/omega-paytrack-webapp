import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import axios from 'axios';
import * as Yup from 'yup';
import { api } from '../../configs/api';
import { Arrow_Back } from '../../assets/icons';
import { toast } from 'react-toastify';

const ForgotPassword = (): JSX.Element => {
  const navigate = useNavigate();
  const [isVerificationEmailSent, setIsVerificationEmailSent] =
    useState<boolean>(false);
  const [isVerifyingUser, setIsVerifyingUser] = useState<boolean>(false);
  const [isSendingVerificationEmail, setIsSendingVerificationEmail] =
    useState<boolean>(false);
  const [formData, setFormData] = useState({ email: '' });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Validation schema
  const validationSchema = Yup.object({
    email: Yup.string()
      .required('Email is required')
      .email('Invalid Email format'),
  });

  // Handle form change
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle form submission
  const handleEmailFormSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    setErrors({});
    setIsVerifyingUser(true);

    try {
      await validationSchema.validate(formData, { abortEarly: false });
      await requestSetNewPassword();
      toast.success('Check your email for verification link');
    } catch (error) {
      setIsVerifyingUser(false);
      const newError: { [key: string]: string } = {};
      if (error instanceof Yup.ValidationError) {
        error.inner.forEach((err) => {
          if (err.path) newError[err.path] = err.message;
        });
      }
      setErrors(newError);
    }
  };

  // Function to handle set new password
  const requestSetNewPassword = async () => {
    setIsVerifyingUser(false);
    setIsSendingVerificationEmail(true);

    try {
      const response = await axios.post(
        `${api.baseUrl}${api.sendPassVerificationEmail}`,
        {
          email: formData.email,
        }
      );

      if (!response.data.success) {
        setErrors({ [response.data.field]: response.data.message });
        setIsVerificationEmailSent(false);
      } else {
        setIsVerificationEmailSent(true);
      }
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response) {
        const { field, message } = error.response.data;
        toast.error(message || 'Request Failed');
        setErrors({ [field]: message });
      } else {
        console.error(error);
      }
    } finally {
      setIsVerifyingUser(false);
      setIsSendingVerificationEmail(false); // Move this line to ensure it runs after the try/catch block
    }
  };

  return (
    <>
      <div className="flex items-center justify-center h-screen mx-[25%] lg:mx-[30%] xl:mx-[32%]">
        <section className="relative border border-inputBorder font-Mona_Sans w-full max-w-sm lg:max-w-lg px-[10%] py-[20%] rounded-3xl flex flex-col md:gap-10 lg:gap-12">
          {!isVerifyingUser && !isSendingVerificationEmail ? (
            <div className="absolute top-[6%] left-[5%] flex gap-2">
              <button
                onClick={
                  isVerificationEmailSent
                    ? () => setIsVerificationEmailSent(false)
                    : () => navigate('/paytrack/auth/login')
                }
                className="flex flex-row items-center gap-2 text-black font-medium text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl"
              >
                <img src={Arrow_Back} alt="arrow_back" />
                Back
              </button>
            </div>
          ) : (
            <></>
          )}

          <div className="flex flex-col items-center justify-center md:gap-2 lg:gap-4 xl:gap-6 2xl:gap-8 mt-[8%]">
            <h2 className="text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl font-semibold text-center text-[#202020]">
              {isVerificationEmailSent ? 'Check Email' : 'Forgot Password?'}
            </h2>
            <p className=" text-center text-secondaryText text-xs md:text-sm lg:text-base xl:text-lg text-opacity-55 font-medium">
              {isVerifyingUser
                ? 'We are verifying the email address you entered. Please wait...'
                : isSendingVerificationEmail
                  ? 'Please wait while we are sending a reset password link to your email address...'
                  : isVerificationEmailSent
                    ? 'Please check your email and follow the instructions to reset your password.'
                    : "Enter your email address and we'll send you a link to reset your password."}
            </p>
          </div>

          {!isVerificationEmailSent && (
            <form
              onSubmit={handleEmailFormSubmit}
              className="flex flex-col gap-4 md:gap-6 lg:gap-8 xl:gap-10 2xl:gap-12"
            >
              <div
                className={`space-y-4 relative ${errors.email ? 'pb-7 transition-all duration-300 ease-in-out' : 'transition-all pb-7 duration-300 ease-in-out'}`}
              >
                <label
                  htmlFor="email"
                  className="text-secondaryText font-medium text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl"
                >
                  Email
                </label>
                <input
                  type="text"
                  name="email"
                  disabled={isVerifyingUser || isSendingVerificationEmail}
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your Email"
                  className={`w-full border rounded-md placeholder:text-xs md:placeholder:text-sm lg:placeholder:text-base xl:placeholder:text-lg text-xs md:text-base p-2 lg:p-3 xl:p-4 ${errors.email ? ' border-inputError' : 'border-inputBorder'}`}
                />
                {errors.email && (
                  <p className="text-inputError text-xs md:text-sm absolute left-0 bottom-0 transition-all duration-500 ease-in-out">
                    {errors.email}
                  </p>
                )}
              </div>

              <div
                className={`${isVerifyingUser || isSendingVerificationEmail ? 'hidden' : 'block'}`}
              >
                <button
                  type="submit"
                  className="bg-bgPrimaryButton hover:bg-bgPrimaryButtonHover hover:scale-110 text-white md:text-base lg:text-lg xl:text-xl font-medium rounded-md p-2 xl:p-3 w-full"
                >
                  Send
                </button>
              </div>
            </form>
          )}
        </section>
      </div>
    </>
  );
};

export default ForgotPassword;
