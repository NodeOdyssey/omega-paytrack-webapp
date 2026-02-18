import React from 'react';
import { Select_Report } from '../../assets/icons';

const SelectReport: React.FC = () => {
  return (
    <>
      <section className="h-auto px-8 flex flex-col justify-center gap-10 mt-20">
        {/* add section */}
        <div className="mx-auto flex flex-col items-center justify-center gap-4">
          {/* image */}
          <div className="w-[30%] h-auto">
            <button>
              <img src={Select_Report} alt="SelectReport_Icon" />
            </button>
          </div>
          {/* content */}
          <div className="flex flex-col items-center justify-center gap-6">
            {/* <h1 className=" font-semibold text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl">
              Please Select from dropdown
            </h1> */}
            <p className="font-medium text-xs md:text-sm xl:text-base">
              {/* We couldn&apos;t find what you searched for. Try searching again. */}
              Let&apos;s get started — select a post and report type to generate
              your report.
            </p>
          </div>
        </div>
      </section>
    </>
  );
};

export default SelectReport;
