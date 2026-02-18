/* Libraries */
import React from 'react';

/* Components */
import PrimaryButton from '../../../../../common/Button/PrimaryButton';
import SecondaryButton from '../../../../../common/Button/SecondaryButton';
import BreadCrumb from '../../../../../common/BreadCrumb/BreadCrumb';

/* Assets */
import { Plus_White, PlusBlueIcon } from '../../../../../assets/icons';
// import { Rank_Img } from '../../../../../assets/images';

/* Types */
type AddRankProps = {
  onAddRankClick: () => void;
};

/* No Rank Details Main Component */
const NoRankDetails: React.FC<AddRankProps> = ({ onAddRankClick }) => {
  return (
    <>
      <section className="h-full px-8 flex flex-col gap-2 py-4">
        {/* Bread Crumb and Add Button */}
        <BreadCrumb />
        <div className="flex justify-end">
          <PrimaryButton
            type="submit"
            icon={Plus_White}
            onClick={onAddRankClick}
          >
            Add Rank
          </PrimaryButton>
        </div>
        {/* Add Rank Section */}
        <div className="mx-auto flex flex-col items-center justify-center gap-4 py-20">
          {/* Image */}
          <div className="w-[30%] h-auto">
            <button>
              <img
                src="https://pscpl-paytrack.s3.ap-south-1.amazonaws.com/assets/createRankImg.svg"
                alt="Rank_Img"
              />
            </button>
          </div>
          {/* Content */}
          <div className="flex flex-col items-center justify-center gap-6">
            <h1 className=" font-semibold text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl">
              Create Your First Rank
            </h1>
            <p className="font-medium text-xs md:text-sm xl:text-base">
              Organize your workforce operations - Add your first rank now.
            </p>
            <SecondaryButton
              type="submit"
              icon={PlusBlueIcon}
              onClick={onAddRankClick}
            >
              Add Rank
            </SecondaryButton>
          </div>
        </div>
      </section>
    </>
  );
};

export default NoRankDetails;
