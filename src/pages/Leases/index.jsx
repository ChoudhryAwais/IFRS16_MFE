import React, { useEffect, useState } from 'react';
import Tabs from '../../components/Tabs/Tabs';
import LeaseGeneralInfoForm from '../../components/LeaseGeneralInfo/LeaseGeneralInfoForm';
import { useSearchParams } from 'react-router-dom';
import { getLeaseById } from '../../apis/Cruds/LeaseData';
import { LoadingSpinner } from '../../components/LoadingBar/LoadingBar';

export default function Leases() {
    const [activeTab, setactiveTab] = useState("1")
    const [searchParams] = useSearchParams();
    const leaseId = searchParams.get('id');
    const [formModal, setFormModal] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchLeaseData = async () => {
            if (leaseId) {
                setLoading(true);
                const leaseData = await getLeaseById(leaseId);
                if (leaseData) { // Ensure leaseData is not null or undefined
                    setFormModal(leaseData);
                    if (leaseData.increment != null) {
                        setactiveTab("2");
                    } else if (leaseData.grv != null) {
                        setactiveTab("3");
                    }
                }
                setLoading(false);
            }
        };
        fetchLeaseData();
    }, [leaseId]);

    const tabs = [
        { id: '1', label: 'General Information', component: <LeaseGeneralInfoForm increment={false} otherTabs={false} formModal={formModal} /> },
        { id: '2', label: 'Increment', component: <LeaseGeneralInfoForm increment={true} otherTabs={false} formModal={formModal} /> },
        { id: '3', label: 'Others', component: <LeaseGeneralInfoForm otherTabs={true} increment={false} formModal={formModal} /> },
    ];

    return (
        <React.Fragment>
            <LoadingSpinner isLoading={loading} />
            {!loading && <Tabs tabs={tabs} active={activeTab}/>}
        </React.Fragment>
    );
}
