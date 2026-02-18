import React from 'react';
import { useState } from 'react';

type ButtonProps = {
  children: React.ReactNode;
  type?: 'button' | 'submit' | 'reset';
  icon?: string;
  hoverIcon?: string;
  iconWidth?: string;
  iconHeight?: string;
  onClick?: () => void;
  disabled?: boolean;
  primaryColor?: string;
  hoverColor?: string;
  activeColor?: string;
  textColor?: string;
  fontweight?: string;
  rounded?: string;
  disabledColor?: string;
  disabledTextColor?: string;
  size?: string;
  padding?: string;
  width?: string;
  height?: string;
  border?: string;
  borderColor?: string;
  className?: string;
  // hoverTextColor?: string;
  // hoverScale?: string;
};

const ButtonComp: React.FC<ButtonProps> = ({
  type = 'button',
  children,
  icon,
  hoverIcon,
  iconWidth = 'w-6',
  iconHeight = 'h-6',
  onClick,
  disabled = false,
  primaryColor = 'bg-blue-500',
  activeColor = 'bg-blue-700',
  textColor = 'text-[#212529]',
  fontweight = 'font-medium',
  rounded = 'rounded-md',
  disabledColor = 'bg-gray-400',
  disabledTextColor = 'text-gray-200',
  size = 'text-base',
  padding = 'px-4 py-2',
  width = 'w-auto',
  height = 'h-auto',
  border = 'border',
  borderColor = 'border-gray-300',
  className = '',
  // hoverColor = 'bg-blue-600',
  // hoverTextColor = 'text-gray-100',
  // hoverScale = 'scale-105',
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const baseStyles = `flex items-center justify-center ${type} ${primaryColor} ${fontweight} ${rounded} ${size} ${padding} ${width} ${height} ${border} ${borderColor} ${textColor} focus:outline-none transition-all duration-200`;
  // const hoverStyles = !disabled ? `${hoverColor}  transform` : '';
  const activeStyles = !disabled ? activeColor : '';
  const disabledStyles = disabled
    ? `${disabledColor} ${disabledTextColor} opacity-50 cursor-not-allowed`
    : '';
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`${baseStyles} ${className} ${activeStyles} ${disabledStyles} flex items-center justify-center font-Mona_Sans`}
    >
      {icon && (
        <span className="mr-2">
          {' '}
          <img
            src={isHovered && hoverIcon ? hoverIcon : icon}
            alt=""
            className={`${iconWidth} ${iconHeight}`}
          />
        </span>
      )}
      {children}
    </button>
  );
};

export default ButtonComp;
