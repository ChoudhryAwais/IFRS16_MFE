import React, { useState } from "react";

export const CollapsibleFilterBox = (props) => {
    const { heading } = props
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="w-full mb-2">
            {/* Filter Header */}
            <div
                className={"border dark:border-gray-400 p-1.5 shadow-sm dark:shadow-slate-500 cursor-pointer flex justify-between items-center"}
                onClick={() => setIsOpen(!isOpen)}
            >
                <div className="flex items-center gap-2">
                    <i className="fa fa-filter text-gray-600"></i>
                    <h2 className="text-xs font-semibold dark:text-white">{heading}</h2>
                </div>
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className={`dark:text-white h-6 w-6 transform transition-transform ${isOpen ? "rotate-180" : "rotate-0"
                        }`}
                    fill="none"
                    viewBox="0 0 28 28"
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
                <div className=" bg-white dark:bg-gray-800 p-2.5 shadow-md border">
                    {/* {filterBoxContent()} */}
                    {props.children}
                </div>

            </div>
        </div>
    );
};