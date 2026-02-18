import React, { useEffect, useRef, useState } from 'react';
import { Keyboard_Arrow_Down, Keyboard_Arrow_Up } from '../../assets/icons';
interface GenderDropdownProps {
  value: string | undefined;
  onChange: (
    event: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>
  ) => void;
  error?: string;
}
const GenderDropdown: React.FC<GenderDropdownProps> = ({
  value,
  onChange,
  error,
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false); // Track dropdown state
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Helper function to capitalize gender value
  const getDisplayText = (gender: string | undefined) => {
    if (!gender) return 'Gender'; // Default placeholder
    return gender.charAt(0).toUpperCase() + gender.slice(1); // Capitalize first letter
  };

  const handleSelect = (gender: string) => {
    if (gender === 'Select') {
      return; // Do not allow "Select" to pass
    }
    // Simulate an input change event to integrate with form handler
    onChange({
      target: { name: 'gender', value: gender },
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
        setIsOpen(false); // Close dropdown
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
        <label className=" font-medium text-secondaryText text-xs lg:text-sm xl:text-base">
          Gender <span className="text-red-500 pl-1">*</span>
        </label>

        {/* Dropdown Toggle */}
        <div
          className={`py-2 lg:py-3 xl:py-4 px-2 w-full h-auto border border-inputBorder rounded-md shadow-sm text-sm lg:text-base flex justify-between items-center cursor-pointer ${
            isOpen ? 'border-blue-500' : ''
          }`}
          onClick={() => setIsOpen((prev) => !prev)}
        >
          {/* <span>{value || 'Select Gender'}</span> */}
          <span className="text-xs lg:text-sm xl:text-base">
            {getDisplayText(value)}
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
          <ul className="absolute z-10 top-16 lg:top-20 xl:top-24 bg-white w-full border border-inputBorder rounded-md shadow-lg mt-1 ">
            <li
              className="px-2 py-2 hover:bg-gray-200 cursor-pointer text-xs lg:text-sm xl:text-base"
              onClick={() => handleSelect('')}
            >
              Select
            </li>
            <li
              className="px-2 py-2 hover:bg-gray-200 cursor-pointer text-xs lg:text-sm xl:text-base"
              onClick={() => handleSelect('Male')}
            >
              Male
            </li>
            <li
              className="px-2 py-2 hover:bg-gray-200 cursor-pointer text-xs lg:text-sm xl:text-base"
              onClick={() => handleSelect('Female')}
            >
              Female
            </li>
          </ul>
        )}

        {/* Error Message */}
        {error && <p className="text-red-500 mt-1">{error}</p>}
      </div>
    </>
  );
};

export default GenderDropdown;
