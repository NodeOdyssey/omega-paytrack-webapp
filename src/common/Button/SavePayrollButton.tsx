import React, { useState } from 'react';
type SAvePayrollButtonProps = {
  children: React.ReactNode;
  type?: 'button' | 'submit' | 'reset';
  icon?: string;
  hoverIcon?: string;
  disabled?: boolean;
  disabledIcon?: string;
  // onClick?: () => void;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
};

const SavePayrollButton: React.FC<SAvePayrollButtonProps> = ({
  children,
  type,
  icon,
  hoverIcon,
  onClick,
  disabled,
  disabledIcon,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const getIcon = () => {
    if (disabled && disabledIcon) return disabledIcon;
    if (isHovered && hoverIcon) return hoverIcon;
    return icon;
  };
  return (
    <>
      <button
        type={type}
        onClick={onClick}
        disabled={disabled}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={`flex items-center gap-2 justify-center font-Mona_Sans text-sm 2xl:text-base font-semibold bg-transparent ${disabled ? 'text-bgPrimaryButtonDisabled border border-bgPrimaryButtonDisabled cursor-not-allowed' : 'text-bgPrimaryButton border border-bgPrimaryButton'}  hover:duration-200 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-md h-8 2xl:h-10 px-3 2xl:px-4 py-1 2xl:py-2`}
      >
        {getIcon() && (
          <span className="">
            {' '}
            {/* <img src={icon} alt="" className={`w-5 h-5`} /> */}
            <img
              //   src={isHovered && hoverIcon ? hoverIcon : icon}
              src={getIcon()}
              alt="savePayrollIcon"
              className={`icon-responsive-button`}
            />
          </span>
        )}
        {children}
      </button>
    </>
  );
};

export default SavePayrollButton;
