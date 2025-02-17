import { useState, useRef, useEffect } from "react";

const MultiSelectDropdown = ({ options, handleChange }) => {
    const [selectedOptions, setSelectedOptions] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    // Toggle dropdown visibility
    const toggleDropdown = () => setIsOpen(!isOpen);

    // Select or deselect an option
    const handleSelect = (option) => {
        const values = selectedOptions.includes(option) ? selectedOptions.filter((item) => item !== option)
            : [...selectedOptions, option]
        setSelectedOptions(values);
        handleChange(values)
    };

    // Select all options
    const selectAll = () => {
        handleChange(options)
        setSelectedOptions(options)
    }

    // Clear all selections
    const clearAll = () => {
        handleChange([])
        setSelectedOptions([])
    }

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="relative w-full" ref={dropdownRef}>
            {/* Dropdown Button */}
            <button
                onClick={toggleDropdown}
                className="w-full px-3 text-sm py-1 text-left bg-white border rounded-sm shadow-sm"
            >
                {selectedOptions.length > 0
                    ? `${selectedOptions.length} selected`
                    : "Select options"}
            </button>

            {/* Dropdown Menu */}
            {isOpen && (
                <div className="absolute z-10 w-full bg-white border">
                    {/* Select All & Clear All */}
                    <div className="flex justify-between p-2 border-b">
                        <button className="text-blue-600 text-xs" onClick={selectAll}>
                            Select All
                        </button>
                        <button className="text-red-600 text-xs" onClick={clearAll}>
                            Clear All
                        </button>
                    </div>

                    {/* Options List */}
                    <ul className="max-h-20 overflow-y-auto">
                        {options?.map((option) => (
                            <li
                                key={option.value}
                                className="flex items-center p-2 hover:bg-gray-100 cursor-pointer text-xs"
                                onClick={() => handleSelect(option)}
                            >
                                <input
                                    type="checkbox"
                                    checked={selectedOptions.includes(option)}
                                    readOnly
                                    className="mr-2 w-3 h-3"
                                />
                                {option.label}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default MultiSelectDropdown;
