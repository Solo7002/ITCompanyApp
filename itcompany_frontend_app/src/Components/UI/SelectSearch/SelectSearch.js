import React, { useState } from 'react';
import './SelectSearch.css';
const SelectSearch = props => {
  const [searchTerm, setSearchTerm] = useState(props.value||'');
  const [isOpen, setIsOpen] = useState(false);
  const [filteredOptions, setFilteredOptions] = useState(props.options);
  const [isAlreadyOnChange, setIsAlreadyOnChange] = useState(false);

  const handleInputChange = (event) => {
    const value = event.target.value;
    setSearchTerm(value);
    setFilteredOptions(props.options.filter(option => 
      option.toLowerCase().startsWith(value.toLowerCase())
    ));
    setIsAlreadyOnChange(true);
  };

  const handleOptionClick = (option) => {
    setSearchTerm(option);
    setIsOpen(false);
    setIsAlreadyOnChange(true);
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
    <div className={`select-search ${props.classListDiv}`} style={props.styleDiv}>
      <input
        type={typeInput}
        value={isAlreadyOnChange?searchTerm:props.value}
        onChange={handleInputChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        placeholder={placeholderInput}
        id={elementId}
        name={elementName}
        className={`form-control ${props.classList}`}
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