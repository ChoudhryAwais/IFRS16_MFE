import React, { useState } from 'react'
import Tabs from '../../components/Tabs/Tabs';
import LeaseGeneralInfoForm from '../../components/LeaseGeneralInfo/LeaseGeneralInfoForm';

export default function Leases() {
    const tabs = [
        { id: '1', label: 'General Information', component: <LeaseGeneralInfoForm /> },
        { id: '2', label: 'Lease Rentals', component: <div>Lease Rentals</div> },
        { id: '3', label: 'Options', component: <div>Options</div> },
        { id: '4', label: 'Increment', component: <div>Increment</div> },
        { id: '5', label: 'Others', component: <div>Others</div> },
    ];

    return (
        <React.Fragment>
            <Tabs tabs={tabs} />
        </React.Fragment>
    )

}
