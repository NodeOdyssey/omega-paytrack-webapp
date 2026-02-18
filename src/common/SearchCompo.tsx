import React from 'react';
import { SearchIcon } from '../assets/icons';

type SearchCompoProps = {
  searchValue?: string;
  handleSearchInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

const SearchCompo: React.FC<SearchCompoProps> = ({
  searchValue,
  handleSearchInputChange,
}) => {
  return (
    <>
      <div className="w-1/3 relative">
        <input
          type="search"
          name="employeeSearch"
          placeholder="Search"
          value={searchValue}
          onChange={handleSearchInputChange}
          id=""
          className="w-full h-8 2xl:h-10 pl-7 2xl:pl-11 pb-0.5 2xl:pb-0 pr-1.5 2xl:pr-2 border border-gray-outline-200 bg-white text-responsive-input rounded-md bg-transparent focus:outline-offset-1 focus:outline-1 focus:outline-inputBorder"
        />
        <img
          src={SearchIcon}
          alt="SearchIcon"
          className="absolute top-1/2 -translate-y-1/2 left-2 2xl:left-4 icon-responsive-button"
        />
      </div>
    </>
  );
};

export default SearchCompo;
