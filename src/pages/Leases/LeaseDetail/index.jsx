import React, { useEffect, useState } from 'react'
import Tabs from '../../../components/Tabs/Tabs'
import { getInitialRecognitionForLease } from '../../../apis/Cruds/InitialRecognition';
import Tables from '../../../components/Tables/Tables';
import { initialRecognitionCols, leaseLiabilityCols, ROUScheduleCols } from '../../../utils/tableCols/tableCols';
import { getRouScheduleForLease } from '../../../apis/Cruds/RouSchedule';
import { getLeaseLiabilityForLease } from '../../../apis/Cruds/LeaseLiability';

export default function LeaseDetail(props) {
    const { selectedLease } = props
    const [InitialRecognition, setInitialRecognition] = useState({
        data: {},
        loading: false
    })
    const [rouSchedule, setRouSchedule] = useState({
        data: [],
        loading: false
    })
    const [leaseLiability, setLeaseLiability] = useState({
        data: [],
        loading: false
    })

    // Specific lease tabs
    const tabs = [
        {
            id: '1',
            label: 'Initial Recognition',
            component: (
                <Tables
                    columns={initialRecognitionCols}
                    data={InitialRecognition.data?.initialRecognition || []}
                    calcHeight="240px"
                    isLoading={InitialRecognition.loading}
                />
            ),
            callback: () => InitialRecognitionForLease()
        },
        {
            id: '2',
            label: 'Lease Liability',
            component: (
                <Tables
                    columns={leaseLiabilityCols}
                    data={leaseLiability.data}
                    calcHeight="240px"
                    isLoading={leaseLiability.loading}
                />
            ),
            callback: () => leaseLiabilityForLease()
        },
        {
            id: '3',
            label: 'ROU',
            component: (
                <Tables
                    columns={ROUScheduleCols}
                    data={rouSchedule.data}
                    calcHeight="240px"
                    isLoading={rouSchedule.loading}
                />
            ),
            callback: () => rouScheduleForLease()
        },
        { id: '4', label: 'Journal Entries' },
        { id: '5', label: 'Disclousure' },
    ];
    // Method to get the initialRecognition for specific lease
    const InitialRecognitionForLease = async () => {
        if (InitialRecognition?.data?.initialRecognition > 0)
            return
        setInitialRecognition({
            ...InitialRecognition,
            loading: true
        })
        const response = await getInitialRecognitionForLease(selectedLease.leaseId)
        setInitialRecognition({
            ...InitialRecognition,
            loading: false,
            data: response
        })
    }
    // Method to get the rouSchedule for specific lease
    const rouScheduleForLease = async () => {
        if (rouSchedule.data.length > 0)
            return
        setRouSchedule({
            ...rouSchedule,
            loading: true,
        })
        const response = await getRouScheduleForLease(selectedLease.leaseId)
        setRouSchedule({
            ...rouSchedule,
            loading: false,
            data: response
        })
    }
    // Method to get the leaseliability for specific lease
    const leaseLiabilityForLease = async () => {
        if (leaseLiability.data.length > 0)
            return
        setLeaseLiability({
            ...leaseLiability,
            loading: true,
        })
        const response = await getLeaseLiabilityForLease(selectedLease.leaseId)
        setLeaseLiability({
            ...leaseLiability,
            loading: false,
            data: response
        })
    }

    useEffect(() => {
        InitialRecognitionForLease()
    }, [selectedLease])

    return (
        <Tabs tabs={tabs} />
    )
}
