import React from 'react';
import { Plus_White, PlusBlueIcon } from '../../../../../assets/icons';
// import { Rank_Img } from '../../../../../assets/images';
import PrimaryButton from '../../../../../common/Button/PrimaryButton';
import SecondaryButton from '../../../../../common/Button/SecondaryButton';
import BreadCrumb from '../../../../../common/BreadCrumb/BreadCrumb';

interface NoEmployeeProps {
  onAddEmployeeClick: () => void;
}
const NoEmployeeDetails: React.FC<NoEmployeeProps> = ({
  onAddEmployeeClick,
}) => {
  return (
    <>
      <section className="h-screen px-8 flex flex-col gap-2 py-4">
        {/* Bread Crumb and Add Button */}
        <BreadCrumb />
        <div className="flex justify-end">
          <PrimaryButton
            type="submit"
            icon={Plus_White}
            onClick={onAddEmployeeClick}
          >
            Add Employee
          </PrimaryButton>
        </div>
        {/* add section */}
        <div className="mx-auto flex flex-col items-center justify-center gap-4 mt-40">
          {/* image */}
          <div className="w-[30%] h-auto">
            <button>
              <img
                src="https://pscpl-paytrack.s3.ap-south-1.amazonaws.com/assets/createRankImg.svg"
                alt="Rank_Img"
              />
            </button>
          </div>
          {/* content */}
          <div className="flex flex-col items-center justify-center gap-6">
            <h1 className=" font-semibold text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl">
              Create New Employee
            </h1>
            <p className="font-medium text-xs md:text-sm xl:text-base">
              Build your workforce-Add your first employee to get started.
            </p>
            <SecondaryButton
              type="submit"
              icon={PlusBlueIcon}
              onClick={onAddEmployeeClick}
            >
              Add Employee
            </SecondaryButton>
          </div>
        </div>
      </section>
    </>
  );
};

export default NoEmployeeDetails;
