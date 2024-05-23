import React, { useState } from 'react';
import './SelectSearch.css';
const SelectSearch =props => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [filteredOptions, setFilteredOptions] = useState(props.options);
  const handleInputChange = (event) => {
    const value = event.target.value;
    setSearchTerm(value);
    setFilteredOptions(props.options.filter(option => 
      option.toLowerCase().startsWith(value.toLowerCase())
    ));
  };

  const handleOptionClick = (option) => {
    setSearchTerm(option);
    setIsOpen(false);
  };

  const handleFocus = () => {
    setIsOpen(true);
  };

  const handleBlur = () => {
    setTimeout(() => setIsOpen(false), 100); 
  };
  const typeInput=props.type||'text';
  const placeholderInput=props.placeholder||'';
  return (
    <div className="select-search">
      <input
        type={typeInput}
        value={searchTerm}
        onChange={handleInputChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        placeholder={placeholderInput}
      />
      {isOpen && (
        <ul className="options-list">
          {filteredOptions.map((option, index) => (
            <li key={index} onClick={() => handleOptionClick(option)}>
              {option}
            </li>
          ))}
        </ul>
      )}
      
    </div>
  );
};

export default SelectSearch;