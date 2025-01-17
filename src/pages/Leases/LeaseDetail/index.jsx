import React, { useEffect, useState } from 'react'
import Tabs from '../../../components/Tabs/Tabs'
import { getInitialRecognitionForLease } from '../../../apis/Cruds/InitialRecognition';
import Tables from '../../../components/Tables/Tables';
import { initialRecognitionCols, leaseLiabilityCols, ROUScheduleCols } from '../../../utils/tableCols/tableCols';
import { getRouScheduleForLease } from '../../../apis/Cruds/RouSchedule';
import { getLeaseLiabilityForLease } from '../../../apis/Cruds/LeaseLiability';

export default function LeaseDetail(props) {
    const { selectedLease } = props
    const [activeTab, setActiveTab] = useState('1');
    const [InitialRecognition, setInitialRecognition] = useState({
        data: {},
        totalRecord: null,
        loading: false
    })
    const [rouSchedule, setRouSchedule] = useState({
        data: [],
        loading: false,
        totalRecord: null,
    })
    const [leaseLiability, setLeaseLiability] = useState({
        data: [],
        loading: false,
        totalRecord: null,
    })
    // Method to get the initialRecognition for specific lease
    const InitialRecognitionForLease = async (pageNumber, pageSize) => {
        setInitialRecognition({
            ...InitialRecognition,
            loading: true
        })
        const response = await getInitialRecognitionForLease(pageNumber, pageSize, selectedLease.leaseId)
        setInitialRecognition({
            ...InitialRecognition,
            loading: false,
            data: response?.initialRecognition || [],
            totalRecord: response?.totalRecords || 0
        })
    }
    // Method to get the rouSchedule for specific lease
    const rouScheduleForLease = async (pageNumber, pageSize) => {
        setRouSchedule({
            ...rouSchedule,
            loading: true,
        })
        const response = await getRouScheduleForLease(pageNumber, pageSize, selectedLease.leaseId)
        setRouSchedule({
            ...rouSchedule,
            loading: false,
            data: response?.data || [],
            totalRecord: response?.totalRecords || 0
        })
    }
    // Method to get the leaseliability for specific lease
    const leaseLiabilityForLease = async (pageNumber, pageSize) => {
        setLeaseLiability({
            ...leaseLiability,
            loading: true,
        })
        const response = await getLeaseLiabilityForLease(pageNumber, pageSize, selectedLease.leaseId)
        setLeaseLiability({
            ...leaseLiability,
            loading: false,
            data: response?.data || [],
            totalRecord: response?.totalRecords || 0
        })
    }
    useEffect(() => {
        InitialRecognitionForLease(1, 10)
    }, [selectedLease])
    // Specific lease tabs
    const tabs = [
        {
            id: '1',
            label: 'Initial Recognition',
            component: (
                <Tables
                    columns={initialRecognitionCols}
                    data={InitialRecognition.data || []}
                    calcHeight="240px"
                    isLoading={InitialRecognition.loading}
                    totalRecord={InitialRecognition.totalRecord}
                    getPaginatedData={InitialRecognitionForLease}
                    tabChange={activeTab}
                />
            ),
            callback: () => InitialRecognitionForLease(1, 10),
            tabChange: (tab) => {
                setActiveTab(tab)
            }
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
                    totalRecord={leaseLiability.totalRecord}
                    getPaginatedData={leaseLiabilityForLease}
                    tabChange={activeTab}
                />
            ),
            callback: () => leaseLiabilityForLease(1, 10),
            tabChange: (tab) => {
                setActiveTab(tab)
            }
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
                    totalRecord={rouSchedule.totalRecord}
                    getPaginatedData={rouScheduleForLease}
                    tabChange={activeTab}
                />
            ),
            callback: () => rouScheduleForLease(1, 10),
            tabChange: (tab) => {
                setActiveTab(tab)
            }
        },
        { id: '4', label: 'Journal Entries' },
        { id: '5', label: 'Disclousure' },
    ];

    return (
        <Tabs tabs={tabs} />
    )
}
