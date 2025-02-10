import React, { useState } from 'react'

import Tables from '../../components/Tables/Tables';
import { leaseLiabilityAggregationCols, ROUScheduleAggregationCols } from '../../utils/tableCols/tableCols';
import { getLeaseReport } from '../../apis/Cruds/leaseReport';
import { GeneralFilter } from '../../components/FilterBox/GeneralFilter';

export default function Dashboard() {
    const [leaseReport, setLeaseReport] = useState({
        data: [],
        loading: false,
        totalRecord: null,
    })
    // Method to get the aggregation report for lease
    const aggregationForLease = async (filterModal) => {
        setLeaseReport({
            ...leaseReport,
            loading: true
        })
        const response = await getLeaseReport(filterModal)
        setLeaseReport({
            ...leaseReport,
            loading: false,
            data: response?.leaseLiabilityAggregation ? response : [],
            totalRecord: 0
        })
    }

    return (
        <div>
            <GeneralFilter onApplyFilter={(filterModal) => aggregationForLease(filterModal)} />
            <div className="bg-white border rounded-md overflow-hidden p-3 mt-3">
                <h2 className="text-md font-semibold mb-3">Lease Liability</h2>
                <Tables
                    columns={leaseLiabilityAggregationCols}
                    data={leaseReport.data?.leaseLiabilityAggregation || []}
                    calcHeight="230px"
                    isLoading={leaseReport.loading}
                    totalRecord={leaseReport.totalRecord}
                    pagination={false}
                />
            </div>
            <div className="bg-white border rounded-md overflow-hidden p-3 mt-3">
                <h2 className="text-md font-semibold mb-3">ROU Schedule</h2>
                <Tables
                    columns={ROUScheduleAggregationCols}
                    data={leaseReport.data?.rouAggregation || []}
                    calcHeight="230px"
                    isLoading={leaseReport.loading}
                    totalRecord={leaseReport.totalRecord}
                    pagination={false}
                />
            </div>
        </div>
    )
}
