import React from 'react'
import { handleExcelExport } from '../../../utils/exportService/excelExportService'
import Tabs from '../../../components/Tabs/Tabs'
import JEReport from './JEReport'
import LeaseReport from './LeaseReport'

export default function Reports({ report, filterModal }) {

    // Handle Export
    const handleExport = (payload, mappingCol, reportName) => {
        handleExcelExport({
            payload: payload,
            columnMapping: mappingCol,
            workSheetName: reportName,
            fileName: "Report"
        })
    }
    // Specific Report tabs
    const tabs = [
        {
            id: '1',
            label: 'Lease Report',
            component: (
                <LeaseReport filterModal={filterModal} data={report?.leaseReport} loading={report.loading} handleExport={handleExport} />
            ),
        },
        {
            id: '2',
            label: 'JE Report',
            component: (
                <JEReport filterModal={filterModal} data={report?.jeReport} loading={report.loading} handleExport={handleExport} />
            ),
        },

    ];
    return (
        <Tabs tabs={tabs} />
    )
}
