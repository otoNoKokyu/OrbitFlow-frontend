import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';
import '../../css/components/Select.css';
import classNames from 'classnames';

interface Option {
    id: string;
    label: string;
}

interface GenericSelectProps {
    options: Option[] | []; 
    isMultiSelect?: boolean;
    onChange: (selectedOptions: Option| Option[]) => void;
    placeholder?: string;
    classnames?: string
}

const GenericSelect: React.FC<GenericSelectProps> = ({
    classnames,
    options = [],
    isMultiSelect = false,
    onChange,
    placeholder = 'Select...',
}) => {
    const [selectedOptions, setSelectedOptions] = useState<Option[]>([]);
    const [isOpen, setIsOpen] = useState(false);

    const handleOptionClick = (option: Option) => {
        if (isMultiSelect) {
            setSelectedOptions((prev) => {
                const isSelected = prev.some((selected) => selected.id === option.id);
                const newSelection = isSelected
                    ? prev.filter((selected) => selected.id !== option.id)
                    : [...prev, option];

                onChange(newSelection);
                return newSelection;
            });
        } else {
            setSelectedOptions([option]);
            onChange(option);
            setIsOpen(false); // Close dropdown on selection for single select
        }
    };

    const toggleDropdown = () => {
        setIsOpen((prev) => !prev);
    };

    const renderSelectedOptions = () => {
        return selectedOptions.length > 0 ? (
            selectedOptions.map((option) => (
                <span key={option.id} className="selected-option">
                    {option.label}
                </span>
            ))
        ) : (
            <span className="placeholder">{placeholder}</span>
        );
    };

    return (
        <div>
            <div className={classNames("select-box",classnames)} onClick={toggleDropdown}>
                <div className="selected-options">{renderSelectedOptions()}</div>
                <FontAwesomeIcon icon={isOpen ? faChevronUp : faChevronDown} className="arrow-icon" />
            </div>
            {isOpen && (
                <ul className="options-list">
                    {options.length > 0 ? (
                        options.map((option) => (
                            <li key={option.id} onClick={() => handleOptionClick(option)} className="option-item">
                                {option.label}
                                {selectedOptions.some((selected) => selected.id === option.id) && (
                                    <FontAwesomeIcon icon={faCheck} className="check-icon" />
                                )}
                            </li>
                        ))
                    ) : (
                        <li className="no-data" onClick={(e) => e.stopPropagation()}>
                            No Data
                        </li>
                    )}
                </ul>
            )}
        </div>
    );
};

export default GenericSelect;
