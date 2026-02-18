import React, { useEffect, useState } from 'react';

// Assets
import { SearchIcon } from '../../../../assets/icons';
import useInputChangeDelay from '../../../../hooks/useInputChangeDelay';

type SearchAttendancePostsProps = {
  reset?: boolean;
  placeholder?: string;
  onDebouncedSearch?: (debouncedSearchTerm: string) => void;
};

const SearchAttendancePosts: React.FC<SearchAttendancePostsProps> = ({
  reset,
  placeholder = 'Search Post Name',
  onDebouncedSearch,
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (reset) {
      setSearchTerm('');
    }
  }, [reset]);

  // Handle input change delay using the hook
  useInputChangeDelay({
    input: searchTerm,
    delay: 500,
    updateInput: (debouncedInput) => {
      if (onDebouncedSearch) {
        onDebouncedSearch(debouncedInput); // Notify parent of the debounced search term
      }
    },
  });

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value); // Update search term immediately
  };

  return (
    <div className="relative min-w-60 2xl:min-w-72">
      <input
        type="search"
        placeholder={placeholder || 'Search'}
        autoComplete="on"
        value={searchTerm}
        onChange={handleSearchChange}
        className="w-full h-8 2xl:h-10 pl-7 2xl:pl-11 pb-0.5 2xl:pb-0 pr-1.5 2xl:pr-2 border border-gray-outline-200 bg-white text-responsive-input rounded-md bg-transparent focus:outline-offset-1 focus:outline-1 focus:outline-inputBorder"
      />
      <img
        src={SearchIcon}
        alt="SearchIcon"
        className="absolute top-1/2 -translate-y-1/2 left-2 2xl:left-4 icon-responsive-button"
      />
    </div>
  );
};

export default SearchAttendancePosts;
