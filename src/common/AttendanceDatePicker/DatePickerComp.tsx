// Libraries
import React, { useState, useRef, useEffect } from 'react';

// CSS
import DatePicker from 'react-datepicker';

// CSS
import 'react-datepicker/dist/react-datepicker.css';

// Assets
import { Keyboard_Arrow_Down, Keyboard_Arrow_Up } from '../../assets/icons';

type CustomDatePickerProps = {
  className?: string;
  label: string;
  onChangeDate: (date: Date) => void;
  disabled?: boolean;
  reset?: boolean;
  externalSelectedDate?: Date | null;
  pickerMode?: 'monthYear' | 'date';
  minDate?: Date;
  maxDate?: Date;
};

const DatePickerComp: React.FC<CustomDatePickerProps> = ({
  className = '',
  label,
  onChangeDate,
  disabled = false,
  reset,
  externalSelectedDate,
  pickerMode = 'monthYear',
  minDate,
  maxDate,
}) => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const calendarRef = useRef<HTMLDivElement>(null);

  const toggleCalendar = () => {
    setIsCalendarOpen((prev) => !prev);
  };

  const handleDateChange = (date: Date | null) => {
    if (date) {
      setSelectedDate(date);
      onChangeDate(date);
      setIsCalendarOpen(false);
    }
  };

  useEffect(() => {
    if (reset) {
      setSelectedDate(new Date()); // Reset to current date
    }
  }, [reset]);

  // populate date
  useEffect(() => {
    if (externalSelectedDate) {
      setSelectedDate(new Date(externalSelectedDate)); // Clone to avoid direct mutation
    }
  }, [externalSelectedDate]);

  // Close the calendar when clicked outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        calendarRef.current &&
        !calendarRef.current.contains(event.target as Node)
      ) {
        setIsCalendarOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <>
      <div
        // className="relative w-52 md:w-40 lg:w-52 xl:w-64 h-8 2xl:h-10"
        // className="relative w-[238px] 2xl:w-64 h-8 2xl:h-10"
        className={`relative w-[238px] 2xl:w-64 h-8 2xl:h-10 ${className}`}
        ref={calendarRef}
      >
        {/* Button to toggle the calendar */}

        <button
          disabled={disabled}
          className={`dropdown-select-button ${!disabled ? 'bg-white' : 'bg-gray-100'} ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}`}
          onClick={toggleCalendar}
        >
          <span className="font-medium text-gray-700">
            {selectedDate
              ? pickerMode === 'monthYear'
                ? selectedDate
                    .toLocaleDateString('en-US', {
                      month: 'long',
                      year: 'numeric',
                    })
                    .replace(' ', ', ')
                : selectedDate.toLocaleDateString('en-GB')
              : label}
          </span>
          <span className={`transform transition-transform`}>
            {isCalendarOpen ? (
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
        </button>

        {isCalendarOpen && (
          <div className="dropdown-dropped-container datePickerFont pb-0.5 2xl:pb-1">
            <DatePicker
              selected={selectedDate}
              onChange={handleDateChange}
              showMonthYearPicker={pickerMode === 'monthYear'}
              dateFormat={pickerMode === 'monthYear' ? 'MM/yyyy' : 'dd/MM/yyyy'}
              minDate={minDate}
              maxDate={maxDate}
              inline
            />
          </div>
        )}
      </div>
    </>
  );
};

export default DatePickerComp;
