// Libraries
import React, { useState } from 'react';
import { useNavigate } from 'react-router';

// Store
import useAuthStore from '../../store/auth';

// Validators
import { validateLogin } from '../../validators/login';

// Components
import Loader from '../../common/Loader/Loader';

// Assets
import { Eye_Off, Eye_On } from '../../assets/icons';

// Main Component
const Login = () => {
  const navigate = useNavigate();

  // Store
  const { isLoading, login } = useAuthStore();

  // State variable to track form data
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  // State variable to track form errors
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // State variable to track password visibility
  const [passwordVisible, setPasswordVisible] = useState(false);

  // Handle form change
  const handleFormDataChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle form submission
  const handleLoginFormSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    setErrors({});

    const result = await validateLogin(formData);

    if (!result.success) {
      setErrors(result.errors || {});
      return;
    }

    try {
      const { redirectUrl } = await login(formData.email, formData.password);
      navigate(redirectUrl);
    } catch (error) {
      // Handle login error
    }
  };

  // Function to toggle password visibility
  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  return (
    <>
      {isLoading && <Loader />}
      <div className="flex items-center justify-center h-screen">
        {/* <section className="bg-bgPrimary border border-inputBorder font-Mona_Sans mx-[10%] sm:mx-[16%] md:mx-[25%] lg:mx-[28%] xl:mx-[30%] 2xl:mx-[34%] md:my-[10%] lg:my-[5%] xl:my-[3%] px-[5%] py-[6%] rounded-3xl flex flex-col  gap-8 md:gap-10 lg:gap-12 xl:gap-14"> */}
        <section className="border border-inputBorder font-Mona_Sans w-full max-w-sm lg:max-w-lg px-[5%] 2xl:px-[4%] py-[2%] rounded-3xl flex flex-col space-y-2">
          <header>
            {/* <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-bold text-center text-primaryText">
          Purbanchal PayTrack
        </h1> */}
            <div className="flex items-center justify-center">
              <img
                src="https://pscpl-paytrack.s3.ap-south-1.amazonaws.com/assets/logo_login.svg"
                alt=""
              />
            </div>
          </header>
          <form
            onSubmit={handleLoginFormSubmit}
            className="flex flex-col gap-2 md:gap-6"
          >
            {/* email */}
            <div
              className={`space-y-2 relative ${errors.email ? 'pb-6 transition-all duration-300 ease-in-out' : 'transition-all duration-300 ease-in-out'}`}
            >
              <label
                htmlFor="email"
                className="text-secondaryText font-medium text-xs sm:text-sm md:text-base"
              >
                Email
              </label>
              <div className="flex flex-col gap-2">
                <input
                  type="text"
                  name="email"
                  value={formData.email}
                  onChange={handleFormDataChange}
                  placeholder="Enter your Email"
                  className={`w-full border rounded-md placeholder:text-xs md:placeholder:text-sm text-xs md:text-base p-3 lg:p-4 ${errors.email ? ' border-inputError' : 'border-inputBorder'}`}
                />
                {errors.email && (
                  <p className="text-inputError text-xs md:text-sm absolute left-0 bottom-0 transition-all duration-500 ease-in-out">
                    {errors.email}
                  </p>
                )}
              </div>
            </div>
            {/* password */}
            <div
              className={`space-y-2 relative ${errors.password ? 'pb-12 lg:pb-10 xl:pb-16 2xl:pb-20 transition-all duration-300 ease-in-out' : 'transition-all duration-300 ease-in-out'} `}
            >
              <label
                htmlFor="password"
                className="text-secondaryText font-medium text-xs sm:text-sm md:text-base"
              >
                Password
              </label>
              <div className="flex flex-col gap-2 relative">
                <input
                  type={passwordVisible ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleFormDataChange}
                  placeholder="Enter your Password"
                  className={`w-full border rounded-md p-3 lg:p-4 placeholder:text-xs md:placeholder:text-sm text-xs md:text-base ${errors.password ? 'border-inputError' : 'border-inputBorder'}`}
                />
                <div
                  className="absolute top-[50%] transform -translate-y-1/2 right-4"
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
                <p className="text-inputError text-xs md:text-sm absolute left-0 bottom-5 transition-all duration-500 ease-in-out">
                  {errors.password}
                </p>
              )}
            </div>

            <div>
              <button
                type="submit"
                className=" bg-bgPrimaryButton hover:bg-bgPrimaryButtonHover text-white text-sm md:text-base  font-semibold rounded-md p-3 xl:p-4 w-full"
              >
                Login
              </button>
            </div>
            {/* forgot password */}
          </form>
          <div className="flex justify-end">
            <button
              type="button"
              className="text-bgPrimaryButton text-sm font-medium"
              onClick={() => navigate('/app/auth/reset-password')}
            >
              Forgot Password?
            </button>
          </div>
        </section>
      </div>
    </>
  );
};

export default Login;
