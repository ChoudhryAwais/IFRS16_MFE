import React, { useState } from 'react'

export default function Tabs({ tabs }) {
    const [activeTab, setActiveTab] = useState('1');

    const currentTabContent = () => {
        const activeTabContent = tabs.filter(tab => tab.id === activeTab)[0].component
        return activeTabContent
    }

    const handleHandleTabChange = (tab) => {
        setActiveTab(tab.id)
        if (tab.callback) {
            tab.callback()
        } if (typeof tab.tabChange == "function") {
            tab.tabChange(tab.id)
        }
    }

    return (
        <React.Fragment>
            <ul className="flex flex-wrap text-xs font-medium text-center text-gray-500 border-gray-200">
                {tabs.map((tab) => (
                    <li key={tab.id} className="me-2">
                        <button
                            onClick={() => handleHandleTabChange(tab)}
                            className={`inline-block p-3 rounded-t-lg transition-all duration-300 ${activeTab === tab.id
                                ? 'text-[#F00000] bg-gray-100'
                                : 'hover:text-gray-600 hover:bg-gray-50'
                                }`}
                        >
                            {tab.label}
                        </button>
                    </li>
                ))}
            </ul>
            <div>
                {currentTabContent()}
            </div>

        </React.Fragment>
    )
}
