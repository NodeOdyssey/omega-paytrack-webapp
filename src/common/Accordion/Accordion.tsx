// Libraries
import React, { ReactNode, useEffect, useState } from 'react';

// Assets
import { CircleDownIcon, CircleUpIcon } from '../../assets/icons';

// Prop Types
type AccordionProps = {
  title: string;
  children: ReactNode;
  disabled?: boolean;
  className?: string;
};
const Accordion: React.FC<AccordionProps> = ({
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
          className={`h-10 2xl:h-14 flex items-center justify-between w-full px-4 2xl:px-8 py-2 text-left text-primaryText text-sm 2xl:text-base bg-tableHeadingColour border-b border-inputBorder ${className}`}
        >
          <h2
            className={`font-semibold ${disabled ? 'text-primaryTextDisabled text-sm 2xl:text-base' : 'text-primaryText text-sm 2xl:text-base'}`}
          >
            {title}
          </h2>
          <div>
            {isOpen ? (
              <img
                src={CircleUpIcon}
                alt="CircleUpIcon"
                className="w-4 h-4 lg:w-5 lg:h-5 "
              />
            ) : (
              <img
                src={CircleDownIcon}
                alt="CircleDownIcon"
                className="w-4 h-4 lg:w-5 lg:h-5 "
              />
            )}
          </div>
        </button>
        <div
          className={`transition-max-height duration-500 ease-in-out ${isOpen ? 'max-h-screen' : 'max-h-0 overflow-hidden'}`}
        >
          <div className="px-4 py-4 2xl:px-8 2xl:py-6 bg-white">{children}</div>
        </div>
      </div>
    </>
  );
};

export default Accordion;
