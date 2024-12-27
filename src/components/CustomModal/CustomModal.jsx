import React, { useEffect, useState } from "react";

export const CustomModal = ({ mainContent, openModal, closeModal }) => {
    const [isModalOpen, setIsModalOpen] = useState(openModal);
    const [isModalVisible, setIsModalVisible] = useState(openModal);

    useEffect(() => {
        setIsModalOpen(openModal);
        setIsModalVisible(openModal)
    }, [openModal])
    
    return (
        <div>
            {/* Main modal */}
            {isModalOpen && (
                <div
                    className={`fixed inset-0 z-50 flex justify-center items-start w-full h-screen bg-black bg-opacity-50 transition-opacity duration-300 ${isModalVisible ? "opacity-100" : "opacity-0"
                        }`}
                >
                    <div
                        className={`relative p-4 w-full max-w-6xl max-h-full transition-transform duration-300 transform ${isModalVisible ? "scale-100" : "scale-95"
                            }`}
                    >
                        {/* Modal content */}
                        <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
                            {/* Modal header */}
                            <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
                                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                                    Terms of Service
                                </h3>
                                <button
                                    onClick={closeModal}
                                    type="button"
                                    className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                                >
                                    <svg
                                        className="w-3 h-3"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 14 14"
                                    >
                                        <path
                                            stroke="currentColor"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                                        />
                                    </svg>
                                    <span className="sr-only">Close modal</span>
                                </button>
                            </div>

                            {/* Modal body */}
                            <div className="p-4 md:p-5 space-y-4">
                                {mainContent}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

