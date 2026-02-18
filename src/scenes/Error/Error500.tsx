// Libraries
import React from 'react';

// Hooks
import useBackButtonHandler from '../../hooks/useBackButtonHandler';

// Components
import PrimaryButton from '../../common/Button/PrimaryButton';

// Assets
// import { Error500Img } from '../../assets/images';

const Error500: React.FC = () => {
  return (
    <>
      <section className="h-auto w-full px-8 flex flex-col gap-10 mt-[5%]">
        <div className="mx-auto flex flex-col items-center justify-center gap-4">
          {/* image */}
          <div className="w-[30%] h-auto">
            <button>
              <img
                src="https://pscpl-paytrack.s3.ap-south-1.amazonaws.com/assets/500Img.svg"
                alt="Error404Img"
              />
            </button>
          </div>
          {/* content */}
          <div className="flex flex-col items-center justify-center gap-6">
            <h1 className="font-extrabold text-bgPrimaryButton text-sm sm:text-base md:text-lg lg:text-xl xl:text-3xl">
              Internal Server Error
            </h1>
            <p className="font-medium text-primaryText text-xs md:text-sm xl:text-lg text-center">
              The server encountered an internal error and was unable to
              complete your request.
            </p>
            <p className="font-medium text-tableBorder text-sm lg:text-base">
              We are preparing it to serve you better.
            </p>
            <PrimaryButton type="submit" onClick={useBackButtonHandler()}>
              Back
            </PrimaryButton>
          </div>
        </div>
      </section>
    </>
  );
};

export default Error500;
