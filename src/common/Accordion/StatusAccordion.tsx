import React, { ReactNode, useEffect, useState } from 'react';
import { CircleDownIcon, CircleUpIcon } from '../../assets/icons';
type StatusAccordionProps = {
  title: string;
  children: ReactNode;
  disabled?: boolean;
  className?: string;
};
const StatusAccordion: React.FC<StatusAccordionProps> = ({
  title,
  children,
  disabled = false,
  className,
}) => {
  const [isOpen, setIsOpen] = useState(true);

  useEffect(() => {
    if (disabled) {
      setIsOpen(false);
    } else {
      setIsOpen(true);
    }
  }, [disabled]);
  const toggleAccordion = () => {
    setIsOpen(!isOpen);
  };
  return (
    <>
      <div>
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleAccordion();
          }}
          disabled={disabled}
          className={`flex items-center justify-between w-full px-8 py-4 text-left text-primaryText bg-tableHeadingColour border-b border-inputBorder ${className}`}
        >
          <h2
            className={`font-bold ${disabled ? 'text-primaryTextDisabled text-sm xl:text-base' : 'text-primaryText text-sm xl:text-base'}`}
          >
            {title}
          </h2>
          <div>
            {isOpen ? (
              <img
                src={CircleUpIcon}
                alt="CircleUpIcon"
                className="w-4 h-4 lg:w-5 lg:h-5 xl:w-6 xl:h-6"
              />
            ) : (
              <img
                src={CircleDownIcon}
                alt="CircleDownIcon"
                className="w-4 h-4 lg:w-5 lg:h-5 xl:w-6 xl:h-6"
              />
            )}
          </div>
        </button>
        <div
          className={`transition-max-height duration-500 ease-in-out ${isOpen ? 'max-h-screen' : 'max-h-0 overflow-hidden'}`}
        >
          <div className="p-4 bg-white">{children}</div>
        </div>
      </div>
    </>
  );
};

export default StatusAccordion;
