import React, { useEffect, useState } from 'react'
import Tabs from '../../../components/Tabs/Tabs'
import { getInitialRecognitionForLease } from '../../../apis/Cruds/InitialRecognition';
import Tables from '../../../components/Tables/Tables';
import { initialRecognitionCols, JournalEntires, leaseLiabilityCols, ROUScheduleCols } from '../../../utils/tableCols/tableCols';
import { getRouScheduleForLease } from '../../../apis/Cruds/RouSchedule';
import { getLeaseLiabilityForLease } from '../../../apis/Cruds/LeaseLiability';
import { getJournalEntriesForLease } from '../../../apis/Cruds/JournalEntries';

export default function LeaseDetail(props) {
    const { selectedLease } = props
    const [activeTab, setActiveTab] = useState('1');
    const [InitialRecognition, setInitialRecognition] = useState({
        data: {},
        totalRecord: null,
        loading: false,
        datesArr: []
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
    const [journalEntries, setJournalEntries] = useState({
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
            totalRecord: response?.totalRecords || 0,
            datesArr: response?.dates || [],
        })
    }
    // Method to get the rouSchedule for specific lease
    const rouScheduleForLease = async (pageNumber, pageSize) => {
        setRouSchedule({
            ...rouSchedule,
            loading: true,
        })
        const response = await getRouScheduleForLease(pageNumber, pageSize, selectedLease)
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
        const response = await getLeaseLiabilityForLease(pageNumber, pageSize, selectedLease)
        setLeaseLiability({
            ...leaseLiability,
            loading: false,
            data: response?.data || [],
            totalRecord: response?.totalRecords || 0
        })
    }
    // Method to get the leaseliability for specific lease
    const journalEntriesForLease = async (pageNumber, pageSize) => {
        setJournalEntries({
            ...journalEntries,
            loading: true,
        })
        const response = await getJournalEntriesForLease(pageNumber, pageSize, selectedLease)
        setJournalEntries({
            ...journalEntries,
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
                    calcHeight="230px"
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
                    calcHeight="230px"
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
                    calcHeight="230px"
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
        {
            id: '4',
            label: 'Journal Entries',
            component: (
                <Tables
                    columns={JournalEntires}
                    data={journalEntries.data}
                    calcHeight="230px"
                    isLoading={journalEntries.loading}
                    totalRecord={journalEntries.totalRecord}
                    getPaginatedData={journalEntriesForLease}
                    tabChange={activeTab}
                />
            ),
            callback: () => journalEntriesForLease(1, 10),
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
