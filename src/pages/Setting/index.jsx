import React, { useState } from "react";
import Tabs from '../../components/Tabs/Tabs';
import ExchangeTab from './ExchangeRates/ViewExchange';
import EditUserTab from './EditUser';
import AddUserTab from './AddUser';
import { getUserInfo } from "../../apis/Cruds/sessionCrud";


export default function Setting() {
    const [activeTab, setActiveTab] = useState('1');
    const userInfo = getUserInfo();

    const tabs = [
        {
            id: '1',
            label: 'Exchange Rates',
            component: <ExchangeTab />,
            tabChange: (tab) => setActiveTab(tab)
        },
        {
            id: '2',
            label: 'Edit User',
            component: <EditUserTab />,
            tabChange: (tab) => setActiveTab(tab)
        },
        userInfo?.role === "Admin" &&
        {
            id: '3',
            label: 'Add User',
            component: <AddUserTab />,
            tabChange: (tab) => setActiveTab(tab)
        }
    ].filter(Boolean); // Filter out false values

    return (

        <Tabs tabs={tabs} active={activeTab} />

    );
}
