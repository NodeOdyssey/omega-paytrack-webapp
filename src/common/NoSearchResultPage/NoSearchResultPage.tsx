import React from 'react';
// import { NoResultsIPageImg } from '../../assets/images';

const NoSearchResultPage: React.FC = () => {
  //   const navigate = useNavigate();
  return (
    <>
      <section className="h-full px-8 flex flex-col justify-center gap-10 mt-20">
        {/* add section */}
        <div className="mx-auto flex flex-col items-center justify-center gap-4">
          {/* image */}
          <div className="w-[30%] h-auto">
            <button>
              <img
                src="https://pscpl-paytrack.s3.ap-south-1.amazonaws.com/assets/NoResultsImg.svg"
                alt="NoResultsImg"
              />
            </button>
          </div>
          {/* content */}
          <div className="flex flex-col items-center justify-center gap-6">
            <h1 className=" font-semibold text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl">
              No results found
            </h1>
            <p className="font-medium text-xs md:text-sm xl:text-base">
              We couldn&apos;t find what you searched for. Try searching again.
            </p>
            {/* <button
              onClick={() => navigate('/organisation/rank-details')}
              className="flex items-center gap-2 py-3 px-9"
            >
              <img src={Arrow_Back} alt="" />
              <h2 className="primaryHeadings text-secondaryText">Back</h2>
            </button> */}
          </div>
        </div>
      </section>
    </>
  );
};

export default NoSearchResultPage;
