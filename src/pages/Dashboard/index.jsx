import React, { useState } from 'react'

import Tables from '../../components/Tables/Tables';
import { leaseReportSummaryCol } from '../../utils/tableCols/tableCols';
import { getLeaseReportSummary } from '../../apis/Cruds/leaseReport';
import { GeneralFilter } from '../../components/FilterBox/GeneralFilter';
import DashboardCards from '../../components/DashboardCard/DashboardCards';

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
        try {
            const response = await getLeaseReportSummary(filterModal)
            setLeaseReport({
                ...leaseReport,
                loading: false,
                data: response || [],
                totalRecord: 0
            })
        } catch {
            setLeaseReport({
                ...leaseReport,
                loading: true
            })
        }
    }

    return (
        <div>
            <div className='mb-5'>
                <DashboardCards />
            </div>
            <GeneralFilter
                onApplyFilter={(filterModal) => aggregationForLease(filterModal)}
                leaseSelection={true}
            />
            <div className="bg-white border rounded-md overflow-hidden p-3 mt-3">
                <h2 className="text-md font-semibold mb-3">Summarize Report</h2>
                <Tables
                    hideHorzScroll={true}
                    columns={leaseReportSummaryCol}
                    data={leaseReport?.data || []}
                    calcHeight="230px"
                    isLoading={leaseReport.loading}
                    totalRecord={leaseReport.totalRecord}
                    pagination={false}
                />
            </div>
        </div>
    )
}
