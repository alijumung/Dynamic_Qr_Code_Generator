import React, { useState } from "react";

const CustomSelect = ({ options, onSelect }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [selected, setSelected] = useState(options[0]);

    const handleSelect = (option) => {
        setSelected(option);
        setIsOpen(false);
        onSelect(option); // Trigger callback for parent component
    };

    return (
        <div className="relative flex flex-col space-y-2 w-full">
            {/* Selected Option */}
            <div
                onClick={() => setIsOpen(!isOpen)}
                className="cursor-pointer border-textColor rounded-md bg-transparent text-textColor border-2 p-3 w-full flex justify-between items-center shadow-sm"
            >
                <span>{selected}</span>
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className={`h-5 w-5 transform transition-transform ${
                        isOpen ? "rotate-180" : ""
                    }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M19 9l-7 7-7-7"
                    />
                </svg>
            </div>

            {/* Dropdown Options */}
            {isOpen && (
                <ul className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
                    {options.map((option, index) => (
                        <li
                            key={index}
                            onClick={() => handleSelect(option)}
                            className="cursor-pointer px-4 py-2 hover:bg-gray-100"
                        >
                            {option}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default CustomSelect;
