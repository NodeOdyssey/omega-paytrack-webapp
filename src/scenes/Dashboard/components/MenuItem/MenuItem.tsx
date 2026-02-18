import React from 'react';

type MenuItemProps = {
  icon: string;
  label: string;
  isActive: boolean;
  showMenu?: boolean;
  onClick: () => void;
  'data-tooltip-id'?: string;
  'data-tooltip-content'?: string;
};
const MenuItem: React.FC<MenuItemProps> = ({
  icon,
  label,
  isActive,
  onClick,
  showMenu = false,
  'data-tooltip-id': tooltipId,
  'data-tooltip-content': tooltipContent,
}) => {
  return (
    <>
      <div
        onClick={onClick}
        className={`flex justify-between items-center cursor-pointer font-Mona_Sans ${
          isActive ? 'bg-gray-200' : ''
        }`}
      >
        <div
          className="flex gap-3 items-center"
          data-tooltip-id={tooltipId}
          data-tooltip-content={tooltipContent}
        >
          <img src={icon} alt={label} className="md:w-8" />
          {!showMenu && (
            <h3 className="font-Mona_Sans text-left font-medium text-sm sm:text-base md:text-lg lg:text-xl">
              {label}
            </h3>
          )}
        </div>
      </div>
    </>
  );
};

export default MenuItem;
