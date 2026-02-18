// libraries
import { useState } from 'react';
import React from 'react';

enum ColorType {
  NORMAL = 'normal',
  WARNING = 'warning',
}

type PrimaryButtonProps = {
  children: React.ReactNode;
  type?: 'button' | 'submit' | 'reset';
  icon?: string;
  hoverIcon?: string;
  disabled?: boolean;
  colorType?: 'normal' | 'warning';
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  height?: number | string;
  fontSize?: string;
};
const PrimaryButton: React.FC<PrimaryButtonProps> = ({
  children,
  type,
  icon,
  hoverIcon,
  onClick,
  disabled,
  colorType = ColorType.NORMAL,
  height,
  fontSize,
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
        //  border-errorColour
        className={`flex gap-1 2xl:gap-2 items-center justify-center font-Mona_Sans font-semibold ${disabled ? 'bg-bgPrimaryButtonDisabled  cursor-not-allowed' : `${colorType === 'warning' ? 'bg-errorColour' : 'bg-bgPrimaryButton hover:bg-bgPrimaryButtonHover focus:ring-blue-500'} `}  text-white hover:duration-200 focus:ring-2 focus:ring-offset-2 rounded-md px-3 2xl:px-4 py-1 2xl:py-2 ${height ? `h-${height}` : 'h-8 2xl:h-10'} ${fontSize ? `text-${fontSize}` : 'text-responsive-button'}`}
      >
        {icon && (
          <span className="">
            {/* <img src={icon} alt="" className={`w-5 h-5`} /> */}
            <img
              src={isHovered && hoverIcon ? hoverIcon : icon}
              alt=""
              className={`icon-responsive-button`}
            />
          </span>
        )}
        {children}
      </button>
    </>
  );
};

export default PrimaryButton;
