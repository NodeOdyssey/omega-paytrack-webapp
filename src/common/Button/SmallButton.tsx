import React from 'react';

type SmallButtonProps = {
  children: React.ReactNode;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  isError?: boolean;
  // onClick?: () => void;
  onClick?: (e: React.FormEvent) => Promise<void>; // Updated type
};
const SmallButton: React.FC<SmallButtonProps> = ({
  children,
  type,
  disabled,
  isError = false,
  onClick,
}) => {
  return (
    <>
      <button
        type={type}
        onClick={onClick}
        disabled={disabled}
        className={`flex items-center justify-center font-Mona_Sans h-8 2xl:h-10 text-responsive-button font-semibold text-white ${disabled ? 'bg-bgPrimaryButtonDisabled  cursor-not-allowed' : isError ? 'bg-errorColour hover:bg-errorColour' : 'bg-bgPrimaryButton hover:bg-bgPrimaryButtonHover'}  hover:duration-200 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-md px-4`}
      >
        {children}
      </button>
    </>
  );
};

export default SmallButton;
