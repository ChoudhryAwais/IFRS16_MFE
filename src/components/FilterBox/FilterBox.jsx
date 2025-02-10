import React, { useState } from "react";

export const CollapsibleFilterBox = (props) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="w-full mb-2">
            {/* Filter Header */}
            <div
                className={"border p-2 shadow-md cursor-pointer flex justify-between items-center"}
                onClick={() => setIsOpen(!isOpen)}
            >
                <div className="flex items-center gap-2">
                    <i className="fa fa-filter text-gray-600"></i>
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
                className={`overflow-hidden transition-all ease-in-out ${isOpen ? "max-h-screen" : "max-h-0"
                    }`}
            >
                <div className=" bg-white p-4 shadow-md border">
                    {/* {filterBoxContent()} */}
                    {props.children}
                </div>

            </div>
        </div>
    );
};