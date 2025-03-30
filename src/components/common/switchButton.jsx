import { useState } from "react";

const Switch = ({ label, onChange, isDisabled = false, isOpen = false }) => {
    const [enabled, setEnabled] = useState(isOpen);

    const handleClick = () => {
        setEnabled(!enabled)
        onChange(!enabled)
    }
    return (
        <div className="flex items-center space-x-2">
            <button
                disabled={isDisabled}
                onClick={handleClick}
                className={`relative w-14 h-4 flex items-center rounded-full p-1 transition-colors duration-300
          ${enabled ? "bg-green-500" : "bg-gray-300 dark:bg-gray-700"}`}
            >
                <span
                    className={`absolute left-1 w-6 h-3 bg-white rounded-full shadow-md transition-transform duration-300
            ${enabled ? "translate-x-6" : "translate-x-0"}`}
                />
            </button>
            <span className="text-xs font-medium text-gray-700 dark:text-gray-200 ">{label}</span>
        </div>
    );
};

export default Switch;
