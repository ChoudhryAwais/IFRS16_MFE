import React, { useEffect, useState } from 'react'

export default function Tabs({ tabs, active = "1" }) {
    const [activeTab, setActiveTab] = useState(active);

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

    useEffect(() => {
        setActiveTab(active)
    }, [active])


    return (
        <React.Fragment>
            <ul className="flex flex-wrap text-xs font-medium text-center text-gray-500 dark:text-gray-200 border-gray-200 ">
                {tabs.map((tab) => (
                    <li key={tab.id} className="me-2">
                        <button
                            onClick={() => handleHandleTabChange(tab)}
                            className={`inline-block p-2 rounded-t-lg transition-all duration-300 ${activeTab === tab.id
                                ? 'text-[#F00000] bg-gray-100 dark:bg-gray-700'
                                : 'hover:text-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 dark:hover:text-gray-300'
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
