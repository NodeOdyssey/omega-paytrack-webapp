import React from 'react';
type ClearButtonProps = {
  children: React.ReactNode;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  onClick?: () => void;
};
const ClearButton: React.FC<ClearButtonProps> = ({
  children,
  type,
  onClick,
  disabled,
}) => {
  return (
    <>
      <button
        type={type}
        onClick={onClick}
        disabled={disabled}
        className={`flex items-center justify-center font-Mona_Sans text-responsive-button font-semibold ${disabled ? 'text-bgPrimaryButtonDisabled  cursor-not-allowed' : 'text-bgPrimaryButton hover:text-bgPrimaryButtonHover'} hover:duration-200 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-md px-4 py-2 h-8 2xl:h-10`}
      >
        {children}
      </button>
    </>
  );
};

export default ClearButton;
