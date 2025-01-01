import React, { useState } from "react";

export const CollapsibleFilterBox = (props) => {
    const { filterBoxContent } = props
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="w-full mb-6">
            {/* Filter Header */}
            <div
                className={"border p-4 rounded-md shadow-md cursor-pointer flex justify-between items-center"}
                onClick={() => setIsOpen(!isOpen)}
            >
                <div className="flex items-center gap-2">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-3 w-3"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L13 14.414V19a1 1 0 01-.553.894l-4 2A1 1 0 017 21v-6.586l-6.707-6.707A1 1 0 010 6V4a1 1 0 011-1z"
                        />
                    </svg>
                    <h2 className="text-sm font-semibold">Filters</h2>
                </div>
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className={`h-6 w-6 transform transition-transform ${isOpen ? "rotate-180" : "rotate-0"
                        }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                    />
                </svg>
            </div>
            {/* Collapsible Filter Content */}
            <div
                className={`overflow-hidden transition-all duration-500 ease-in-out ${isOpen ? "max-h-screen" : "max-h-0"
                    }`}
            >
                <div className=" bg-white p-4 shadow-md rounded-lg mt-3 border">
                    {filterBoxContent()}
                </div>

            </div>
        </div>
    );
};