import React, { useEffect, useState } from 'react'
import Tabs from '../../../components/Tabs/Tabs'
import { getInitialRecognitionForLease } from '../../../apis/Cruds/InitialRecognition';
import Tables from '../../../components/Tables/Tables';
import { SwalPopup } from '../../../middlewares/SwalPopup/SwalPopup';
import { statusCode } from '../../../utils/enums/statusCode';
import { initialRecognitionCols } from '../../../utils/tableCols/tableCols';

export default function LeaseDetail(props) {
    const [InitialRecognitionData, setInitialRecognitionData] = useState([])

    const { selectedLeaseId } = props
    const tabs = [
        {
            id: '1',
            label: 'Initial Recognition',
            component: <Tables columns={initialRecognitionCols} data={InitialRecognitionData} calcHeight="240px" />
        },
        { id: '2', label: 'Lease Liability' },
        { id: '3', label: 'ROU' },
        { id: '4', label: 'Journal Entries' },
        { id: '5', label: 'Disclousure' },
    ];


    const InitialRecognitionForLease = async () => {
        const response = await getInitialRecognitionForLease(selectedLeaseId)
        if (!response?.initialRecognition) {
            SwalPopup(
                "Try again",
                statusCode.somethingWentWrong,
                "error"
            )
            return
        }
        setInitialRecognitionData(response?.initialRecognition)
    }

    useEffect(() => {
        InitialRecognitionForLease()
    }, [selectedLeaseId])

    return (
        <Tabs tabs={tabs} />
    )
}
