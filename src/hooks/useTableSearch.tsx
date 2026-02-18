// Libraries
import { useState, useEffect } from 'react';

// Types
import { Rank } from '../types/rank';
import { Post } from '../types/post';
import { Employee, EmployeeTable } from '../types/employee';

type SupportedTypes = Rank | Employee | EmployeeTable | Post;

const useTableSearch = <T extends SupportedTypes>(
  data: T[],
  searchTerm: string,
  delay: number = 300
): T[] => {
  const [filteredData, setFilteredData] = useState<T[]>(data);

  useEffect(() => {
    const handleSearch = () => {
      const trimmedInput = searchTerm.trim().toLowerCase();
      const filtered = data.filter((item) =>
        Object.values(item).some(
          (value) =>
            value && value.toString().toLowerCase().includes(trimmedInput)
        )
      );
      setFilteredData(filtered);
    };

    const timer = setTimeout(handleSearch, delay);

    return () => clearTimeout(timer);
  }, [data, searchTerm, delay]);

  return filteredData;
};

export default useTableSearch;
