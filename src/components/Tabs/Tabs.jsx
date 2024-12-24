import React, { useState } from 'react'

export default function Tabs({ tabs }) {
    const [activeTab, setActiveTab] = useState('1');

    const currentTabContent = () => {
        const activeTabContent = tabs.filter(tab => tab.id == activeTab)[0].component
        return activeTabContent
    }

    return (
        <React.Fragment>
            <ul className="flex flex-wrap text-sm font-medium text-center text-gray-500 border-b border-gray-200">
                {tabs.map((tab) => (
                    <li key={tab.id} className="me-2">
                        <button
                            onClick={() => setActiveTab(tab.id)}
                            className={`inline-block p-4 rounded-t-lg transition-all duration-300 ${activeTab === tab.id
                                ? 'text-blue-600 bg-gray-100'
                                : 'hover:text-gray-600 hover:bg-gray-50'
                                }`}
                        >
                            {tab.label}
                        </button>
                    </li>
                ))}
            </ul>
            <div className="container mx-auto p-6">
                {currentTabContent()}
            </div>

        </React.Fragment>
    )
}
