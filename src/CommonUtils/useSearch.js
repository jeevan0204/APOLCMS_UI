import { useState } from 'react';

const useSearch = (initialData) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredData, setFilteredData] = useState(initialData);

  const handleSearchChange = (event) => {
    const term = event.target.value;
    setSearchTerm(term);
    filterData(term);
  };

  const filterData = (term) => {
    const filteredResults = initialData.filter((item) =>
      Object.values(item).some((value) =>
        value.toString().toLowerCase().includes(term.toLowerCase())
      
      )
    );
    
    setFilteredData(filteredResults);
  };

  return {
    searchTerm,
    filteredData,
    handleSearchChange,
  };
};

export default useSearch;
