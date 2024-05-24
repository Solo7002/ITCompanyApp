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

  const handleFocus = (event) => {
    setIsOpen(true);
    handleInputChange(event);
  };
  
  const handleBlur = () => {
    setTimeout(() => setIsOpen(false), 500); 
  };

  const typeInput=props.type||'text';
  const placeholderInput=props.placeholder||'';
  const elementId=props.id||'';
  const elementName=props.name||'';
  const disabled=props.disabled||'';
  return (
    <div className="select-search">
      <input
        type={typeInput}
        value={searchTerm}
        onChange={handleInputChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        placeholder={placeholderInput}
        id={elementId}
        name={elementName}
        className="form-control"
        disabled={disabled}
        required={props.required||''}
        autocomplete="off"  
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