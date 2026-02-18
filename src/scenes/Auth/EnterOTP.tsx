import React from 'react';

import { ChangeEvent, useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { Arrow_Back } from '../../assets/icons';

const EnterOTP = (): React.ReactElement => {
  const navigate = useNavigate();

  const [otp, setOtp] = useState<string[]>(new Array(6).fill(''));
  const [seconds, setSeconds] = useState<number>(60);

  useEffect(() => {
    let timer: number | undefined;
    if (seconds > 0) {
      timer = window.setInterval(() => setSeconds(seconds - 1), 1000);
    }
    return () => {
      if (timer) {
        clearInterval(timer);
      }
    };
  }, [seconds]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>, index: number) => {
    const element = e.target;
    if (isNaN(Number(element.value))) return;

    setOtp([...otp.map((d, idx) => (idx === index ? element.value : d))]);

    // Focus next input
    if (element.nextElementSibling) {
      (element.nextElementSibling as HTMLInputElement).focus();
    }
  };

  return (
    <>
      <section className="relative bg-bgPrimary font-Mona_Sans md:mx-[20%] lg:mx-[24%] xl:mx-[26%] 2xl:mx-[33%] my-[3%] md:px-12 lg:px-16 xl:px-20 md:py-20 lg:py-24 xl:py-32 rounded-3xl flex flex-col md:gap-10 lg:gap-12 xl:gap-14">
        <div className="absolute top-[5%] left-[5%] flex gap-2">
          <div className="flex items-center">
            <button>
              <img src={Arrow_Back} alt="arrow_back" />
            </button>
          </div>
          <button
            onClick={() => navigate('/paytrack/auth/login')}
            className="text-black font-medium md:text-base lg:text-lg xl:text-xl"
          >
            Back
          </button>
        </div>

        <div className="flex flex-col md:gap-4 lg:gap-6 xl:gap-8 2xl:gap-10">
          <h2 className="md:text-lg lg:text-xl xl:text-2xl font-semibold text-center text-[#202020]">
            Please Check your email
          </h2>
          <p className="text-left text-secondaryText text-opacity-55 font-medium">
            We have sent the code to abc@gmail.com. Please enter 6-digit code.
          </p>
        </div>
        <form className="flex flex-col gap-4 md:gap-6 lg:gap-8 xl:gap-10 2xl:gap-12">
          {/* OTP input */}
          <div className="flex items-center justify-between">
            {otp.map((data, index) => {
              return (
                <input
                  key={index}
                  type="text"
                  name="otp"
                  maxLength={1}
                  className="w-12 h-12 text-center border rounded-md p-3 md:p-4"
                  value={data}
                  onChange={(e) => handleChange(e, index)}
                  onFocus={(e) => e.target.select()}
                />
              );
            })}
          </div>

          {/* timer */}
          {/* <div>
            <p className="text-left text-secondaryText text-opacity-55 font-medium">
              Send the code again in 00:34 Sec
            </p>
          </div> */}
          <div>
            <p className="text-left text-secondaryText text-opacity-55 font-medium">
              Send the code again in{' '}
              {`00:${seconds < 10 ? `0${seconds}` : seconds}`} Sec
            </p>
          </div>

          {/* cta */}
          <div>
            <button
              onClick={() => navigate('/paytrack/auth/set-new-password')}
              className="bg-primaryText hover:bg-secondaryText hover:scale-110 text-white md:text-lg lg:text-xl xl:text-2xl font-medium rounded-md p-2 xl:p-3 w-full"
            >
              Verify
            </button>
          </div>
        </form>
      </section>
    </>
  );
};

export default EnterOTP;
