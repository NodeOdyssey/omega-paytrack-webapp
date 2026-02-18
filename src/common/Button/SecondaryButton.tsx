import React from 'react';
// libraries
import { useState } from 'react';

type SecondaryButtonProps = {
  children: React.ReactNode;
  type?: 'button' | 'submit' | 'reset';
  icon?: string;
  hoverIcon?: string;
  disabled?: boolean;
  // onClick?: () => void;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
};
const SecondaryButton: React.FC<SecondaryButtonProps> = ({
  children,
  type,
  icon,
  hoverIcon,
  onClick,
  disabled,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <>
      <button
        type={type}
        onClick={onClick}
        disabled={disabled}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={`flex items-center justify-center font-Mona_Sans text-sm 2xl:text-base font-semibold h-8 2xl:h-10 bg-white ${disabled ? 'text-bgPrimaryButtonDisabled  cursor-not-allowed' : 'text-bgPrimaryButton border border-bgPrimaryButton hover:text-secondaryText'}  hover:duration-200 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-md px-4 py-1`}
      >
        {icon && (
          <span className="mr-2">
            {' '}
            {/* <img src={icon} alt="" className={`w-5 h-5`} /> */}
            <img
              src={isHovered && hoverIcon ? hoverIcon : icon}
              alt=""
              className={`w-4 lg:w-5 h-4 lg:h-5`}
            />
          </span>
        )}
        {children}
      </button>
    </>
  );
};

export default SecondaryButton;
