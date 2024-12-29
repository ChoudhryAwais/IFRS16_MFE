import React, { useEffect, useState } from 'react'
import Tabs from '../../../components/Tabs/Tabs'
import { getInitialRecognitionForLease } from '../../../apis/Cruds/InitialRecognition';
import Tables from '../../../components/Tables/Tables';
import { SwalPopup } from '../../../middlewares/SwalPopup/SwalPopup';
import { statusCode } from '../../../utils/enums/statusCode';
import { initialRecognitionCols, ROUScheduleCols } from '../../../utils/tableCols/tableCols';
import { getRouScheduleForLease } from '../../../apis/Cruds/RouSchedule';

export default function LeaseDetail(props) {
    const { selectedLease } = props
    const [InitialRecognitionData, setInitialRecognitionData] = useState({})
    const [rouScheduleData, setRouScheduleData] = useState([])
    const tabs = [
        {
            id: '1',
            label: 'Initial Recognition',
            component: (
                <Tables
                    columns={initialRecognitionCols}
                    data={InitialRecognitionData?.initialRecognition || []}
                    calcHeight="240px"
                />
            )
        },
        {
            id: '2',
            label: 'Lease Liability',
        },
        {
            id: '3',
            label: 'ROU',
            component: (
                <Tables
                    columns={ROUScheduleCols}
                    data={rouScheduleData}
                    calcHeight="240px"
                />
            ),
            callback: () => rouScheduleForLease()
        },
        { id: '4', label: 'Journal Entries' },
        { id: '5', label: 'Disclousure' },
    ];

    const InitialRecognitionForLease = async () => {
        const response = await getInitialRecognitionForLease(selectedLease)
        if (!response?.initialRecognition) {
            SwalPopup(
                "Try again",
                statusCode.somethingWentWrong,
                "error"
            )
            return
        }
        setInitialRecognitionData(response)
    }
    const rouScheduleForLease = async () => {
        const requestModal = {
            leaseData: selectedLease,
            totalNPV: InitialRecognitionData.totalNPV
        }
        const response = await getRouScheduleForLease(requestModal)
        setRouScheduleData(response)
    }

    useEffect(() => {
        InitialRecognitionForLease()
    }, [selectedLease])

    return (
        <Tabs tabs={tabs} />
    )
}
