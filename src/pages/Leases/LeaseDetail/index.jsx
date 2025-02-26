import React, { useState } from 'react'
import Tabs from '../../../components/Tabs/Tabs'
import InitialRecognition from './InitialRecognition';
import LeaseLiability from './LeaseLiability';
import ROUSchedule from './ROUSchedule';
import JournalEntires from './JournalEntries';

export default function LeaseDetail(props) {
    const { selectedLease } = props
    const [activeTab, setActiveTab] = useState('1');

    // Specific lease tabs
    const tabs = [
        {
            id: '1',
            label: 'Initial Recognition',
            component: (
                <InitialRecognition selectedLease={selectedLease} activeTab={activeTab} />
            ),
            tabChange: (tab) => {
                setActiveTab(tab)
            }
        },
        {
            id: '2',
            label: 'Lease Liability',
            component: (
                <LeaseLiability selectedLease={selectedLease} activeTab={activeTab} />
            ),
            tabChange: (tab) => {
                setActiveTab(tab)
            }
        },
        {
            id: '3',
            label: 'ROU',
            component: (
                <ROUSchedule selectedLease={selectedLease} activeTab={activeTab} />
            ),
            tabChange: (tab) => {
                setActiveTab(tab)
            }
        },
        {
            id: '4',
            label: 'Journal Entries',
            component: (
                <JournalEntires selectedLease={selectedLease} activeTab={activeTab} />
            ),
            tabChange: (tab) => {
                setActiveTab(tab)
            }
        },
        // { id: '5', label: 'Disclousure' },
    ];

    return (
        <Tabs tabs={tabs} />
    )
}
