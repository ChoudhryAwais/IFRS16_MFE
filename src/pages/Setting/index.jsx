import React, { useState } from "react";
import Tabs from '../../components/Tabs/Tabs';
import ExchangeTab from './ExchangeRates/ViewExchange';


export default function Setting() {
    const [activeTab, setActiveTab] = useState('1');

    const tabs = [
        {
            id: '1',
            label: 'Exchange Rates',
            component: <ExchangeTab />,
            tabChange: (tab) => setActiveTab(tab)
        }
    ];

    return (
        <div className="p-2">
            <h2 className="text-sm font-semibold mb-3">Settings</h2>
            <hr />
            <div className="mt-2">
                <Tabs tabs={tabs} active={activeTab} />
            </div>
        </div>
    );
}
