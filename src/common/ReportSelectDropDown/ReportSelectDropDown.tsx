import React, { useEffect, useRef, useState } from 'react';
import { Keyboard_Arrow_Down, Keyboard_Arrow_Up } from '../../assets/icons';
import { ReportName, ReportType } from '../../types/report';

type ReportDropdownProps = {
  label: string;
  reportTypes: ReportType[];
  width?: number | string;
  value?: string;
  onChangeSelectPost?: (reportName: string) => void;
  onChangeReportType?: (reportType: ReportType) => void;
};

const ReportSelectDropDown: React.FC<ReportDropdownProps> = ({
  label,
  reportTypes,
  width,
  value,
  onChangeSelectPost,
  onChangeReportType,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const [selectedReportName, setSelectedReportName] = useState<string>(
    ReportName.NONE
  );

  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleReportChange = (reportType: ReportType) => {
    setSelectedReportName(reportType.name);
    setIsOpen(false);
    if (onChangeSelectPost) onChangeSelectPost(reportType.name);
    if (onChangeReportType) {
      console.log('Selected report type:', reportType);
      console.log('Calling for onChangeReportType');
      if (reportType) onChangeReportType(reportType);
    }
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

  useEffect(() => {
    if (value) {
      setSelectedReportName(value);
    }
  }, [value]);

  return (
    <>
      <div
        className={`dropdown-select-container text-left ${width ? `w-${width}` : ''}`}
        ref={dropdownRef}
      >
        <div className="dropdown-select-button" onClick={toggleDropdown}>
          <span className="dropdown-select-span">
            {selectedReportName || label}
          </span>
          <span className={`transform transition-transform`}>
            {isOpen ? (
              <img
                src={Keyboard_Arrow_Up}
                alt="Keyboard_Arrow_Up"
                className="dropdown-menu-icon"
              />
            ) : (
              <img
                src={Keyboard_Arrow_Down}
                alt="Keyboard_Arrow_Down"
                className="dropdown-menu-icon"
              />
            )}
          </span>
        </div>
        {isOpen && (
          <div className="dropdown-dropped-container">
            <ul className="max-h-64 overflow-y-auto">
              {reportTypes.length > 0 ? (
                reportTypes.map((rType, index) => (
                  <li
                    key={index}
                    className="dropdown-list-item"
                    onClick={() => handleReportChange(rType)}
                  >
                    {rType.name}
                  </li>
                ))
              ) : (
                <li className="px-2 text-gray-500 text-responsive-input">
                  No results found
                </li>
              )}
            </ul>
          </div>
        )}
      </div>
    </>
  );
};

export default ReportSelectDropDown;
