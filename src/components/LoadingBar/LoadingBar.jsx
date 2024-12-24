import React from 'react';

const LoadingSpinner = ({ isLoading }) => {
    if (!isLoading) return null;

    return (
        <div className="fixed inset-0 z-50 bg-gray-500 bg-opacity-50 flex items-center justify-center">
            <div className="w-16 h-16 border-4 border-t-transparent border-blue-500 border-solid rounded-full animate-spin"></div>
        </div>
    );
};

export default LoadingSpinner;
