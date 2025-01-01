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
            )
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

    const InitialRecognitionForLease = async () => {
        setInitialRecognition({
            ...InitialRecognition,
            loading: true
        })
        const response = await getInitialRecognitionForLease(selectedLease)
        setInitialRecognition({
            ...InitialRecognition,
            loading: false,
            data: response
        })
    }
    const rouScheduleForLease = async () => {
        if (rouSchedule.data.length > 0)
            return
        const requestModal = {
            leaseData: selectedLease,
            totalNPV: InitialRecognition.data.totalNPV
        }
        setRouSchedule({
            ...rouSchedule,
            loading: true,
        })
        const response = await getRouScheduleForLease(requestModal)
        setRouSchedule({
            ...rouSchedule,
            loading: false,
            data: response
        })
    }
    const leaseLiabilityForLease = async () => {
        if (leaseLiability.data.length > 0)
            return
        const requestModal = {
            totalNPV: InitialRecognition.data?.totalNPV,
            cashFlow: InitialRecognition.data?.cashFlow,
            dates: InitialRecognition.data?.dates,
            leaseData: selectedLease,

        }
        setLeaseLiability({
            ...leaseLiability,
            loading: true,
        })
        const response = await getLeaseLiabilityForLease(requestModal)
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
