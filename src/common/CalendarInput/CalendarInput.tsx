import React from 'react';
import { useState } from 'react';
import { CalendarIcon } from '../../assets/icons';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const CalendarInput: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const handleDateChange = (date: Date | null) => {
    setSelectedDate(date);
    // You can use the selected date here or pass it to a parent component
  };
  return (
    <>
      {/* <div className="relative w-full"> */}
      <div className="relative w-full pb-0.5 2xl:pb-1">
        <DatePicker
          selected={selectedDate}
          onChange={handleDateChange}
          placeholderText="Select date"
          className="w-full p-2 border border-gray-300 rounded-md shadow-sm pl-10"
          dateFormat="dd/MM/yyyy" // Customize the date format
        />
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <img src={CalendarIcon} alt="" />
        </div>
      </div>
    </>
  );
};

export default CalendarInput;
