import React from 'react'
import Tabs from '../../components/Tabs/Tabs';
import LeaseGeneralInfoForm from '../../components/LeaseGeneralInfo/LeaseGeneralInfoForm';

export default function Leases() {
    const tabs = [
        { id: '1', label: 'General Information', component: <LeaseGeneralInfoForm increment={false} otherTabs={false} /> },
        { id: '4', label: 'Increment', component: <LeaseGeneralInfoForm increment={true} otherTabs={false} /> },
        { id: '5', label: 'Others', component: <LeaseGeneralInfoForm otherTabs={true} increment={false} /> },
    ];

    return (
        <React.Fragment>
            <Tabs tabs={tabs} />
        </React.Fragment>
    )

}
