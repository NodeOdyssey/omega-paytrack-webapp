// Libraries
import React from 'react';
import { useNavigate } from 'react-router';

// Components
import PrimaryButton from '../../common/Button/PrimaryButton';

// Assets
// import { Error404Img } from '../../assets/images';

const Error404: React.FC = () => {
  const navigate = useNavigate();
  return (
    <>
      <section className="h-auto w-full px-8 flex flex-col gap-10 mt-[5%]">
        <div className="mx-auto flex flex-col items-center justify-center gap-4">
          {/* image */}
          <div className="w-[30%] h-auto">
            <button>
              <img
                src="https://pscpl-paytrack.s3.ap-south-1.amazonaws.com/assets/404Img.svg"
                alt="Error404Img"
              />
            </button>
          </div>
          {/* content */}
          <div className="flex flex-col items-center justify-center gap-6">
            <h1 className="font-extrabold capitalize text-bgPrimaryButton text-sm sm:text-base md:text-lg lg:text-xl xl:text-3xl">
              page not found
            </h1>
            <p className="font-medium text-center text-primaryText text-sm md:text-base xl:text-lg">
              Something Went Wrong.
            </p>
            <PrimaryButton onClick={() => navigate(-1)} type="button">
              Back
            </PrimaryButton>
            {/* <PrimaryButton
              onClick={() => navigate('/organisation/employee-details')}
              type="button"
            >
              Home
            </PrimaryButton> */}
          </div>
        </div>
      </section>
    </>
  );
};

export default Error404;
