import React, { useEffect, useRef, useState } from 'react';
import { Keyboard_Arrow_Down, Keyboard_Arrow_Up } from '../../assets/icons';

type Database = {
  identifier: string;
  arn: string;
};

interface GenericDropdownProps {
  value: string | undefined;
  onChange: (
    event: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>
  ) => void;
  options: Database[];
  label: string;
  placeholder?: string;
  error?: string;
}

const DatabaseDropdown: React.FC<GenericDropdownProps> = ({
  value,
  onChange,
  options,
  label,
  placeholder = 'Select an option',
  error,
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleSelect = (database: string) => {
    // if (option === placeholder) {
    //   return;
    // }
    if (database === 'Select') return;
    onChange({
      target: { name: label.toLowerCase(), value: database },
    } as React.ChangeEvent<HTMLSelectElement>);
    setIsOpen(false); // Close dropdown after selection
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  return (
    <>
      <div className="relative w-full flex flex-col gap-2" ref={dropdownRef}>
        {/* Label */}
        <label className="font-medium text-secondaryText text-xs lg:text-sm xl:text-base">
          {label} <span className="text-red-500 pl-1">*</span>
        </label>

        {/* Dropdown Toggle */}
        <div
          className={`py-2 lg:py-3 xl:py-4 px-2 w-full h-auto border border-inputBorder rounded-md shadow-sm text-sm lg:text-base flex justify-between items-center cursor-pointer ${
            isOpen ? 'border-blue-500' : ''
          }`}
          onClick={() => setIsOpen((prev) => !prev)}
        >
          <span className="text-xs lg:text-sm xl:text-base">
            {value || placeholder}
          </span>
          {isOpen ? (
            <img
              src={Keyboard_Arrow_Up}
              alt="arrow up"
              className="w-4 lg:w-5 xl:w-6"
            />
          ) : (
            <img
              src={Keyboard_Arrow_Down}
              alt="arrow down"
              className="w-4 lg:w-5 xl:w-6"
            />
          )}
        </div>

        {/* Dropdown Options */}
        {isOpen && (
          <ul className="absolute z-10 top-16 lg:top-20 xl:top-24 bg-white w-full border border-inputBorder rounded-md shadow-lg mt-1 max-h-48 overflow-y-auto">
            <li
              className="px-2 py-1 hover:bg-gray-200 cursor-pointer text-xs lg:text-sm xl:text-base"
              onClick={() => handleSelect('')}
            >
              Select
            </li>
            {options.map((option, index) => (
              <li
                key={index}
                className="px-2 py-1 hover:bg-gray-200 cursor-pointer text-xs lg:text-sm xl:text-base"
                onClick={() => handleSelect(option.identifier)}
              >
                {option.identifier}
              </li>
            ))}
          </ul>
        )}

        {/* Error Message */}
        {error && <p className="text-red-500 mt-1">{error}</p>}
      </div>
    </>
  );
};

export default DatabaseDropdown;
