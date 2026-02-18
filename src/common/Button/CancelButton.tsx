import React, { useState } from 'react';
type CancelButtonProps = {
  children: React.ReactNode;
  type?: 'button' | 'submit' | 'reset';
  icon?: string;
  hoverIcon?: string;
  disabled?: boolean;
  // onClick?: () => void;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
};
const CancelButton: React.FC<CancelButtonProps> = ({
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
        className={`flex items-center justify-center font-Mona_Sans text-sm 2xl:text-base font-semibold bg-white ${disabled ? 'text-bgPrimaryButtonDisabled  cursor-not-allowed' : 'text-errorColour border border-errorColour hover:text-secondaryText hover:border-secondaryText'} hover:scale-105  hover:duration-200 focus:ring-2 focus:ring-errorColour focus:ring-offset-2 rounded-md px-4 py-2`}
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

export default CancelButton;
