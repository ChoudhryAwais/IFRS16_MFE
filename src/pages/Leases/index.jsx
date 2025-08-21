import React, { useEffect, useState } from 'react';
import Tabs from '../../components/Tabs/Tabs';
import LeaseGeneralInfoForm from '../../components/LeaseGeneralInfo/LeaseGeneralInfoForm';
import { useSearchParams } from 'react-router-dom';
import { LoadingSpinner } from '../../components/LoadingBar/LoadingBar';
import { getSelectLease } from '../../apis/Cruds/sessionCrud';

export default function Leases() {
    const [activeTab, setactiveTab] = useState("1")
    const [searchParams] = useSearchParams();
    const leaseId = searchParams.get('id');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchLeaseData = async () => {
            if (leaseId) {
                setLoading(true);
                const activeLease = getSelectLease()
                if (activeLease.increment != null) {
                    setactiveTab("2");
                } else if (activeLease.grv != null) {
                    setactiveTab("3");
                }
                setLoading(false);
            }
        };
        fetchLeaseData();
    }, [leaseId]);

    const tabs = [
        { id: '1', label: 'General Information', component: <LeaseGeneralInfoForm increment={false} otherTabs={false} /> },
        // { id: '2', label: 'Increment', component: <LeaseGeneralInfoForm increment={true} otherTabs={false} /> },
        // { id: '3', label: 'Others', component: <LeaseGeneralInfoForm otherTabs={true} increment={false} /> },
    ];

    return (
        <React.Fragment>
            <LoadingSpinner isLoading={loading} />
            {!loading && <Tabs tabs={tabs} active={activeTab} />}
        </React.Fragment>
    );
}
