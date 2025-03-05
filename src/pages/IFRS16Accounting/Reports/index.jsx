import React from 'react'
import { leaseReportCol } from '../../../utils/tableCols/tableCols'
import { handleExcelExport } from '../../../utils/exportService/excelExportService'
import { JEReportExcelCol, leaseReportExcelCol } from '../../../utils/tableCols/tableColForExcelExport'
import Tables from '../../../components/Tables/Tables'
import Tabs from '../../../components/Tabs/Tabs'
import JEReport from './JEReport'

export default function Reports({ report }) {

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
                <div>
                    <div className='text-right'>
                        {report?.leaseReport.length !== 0 ?
                            <button
                                onClick={() => handleExport(report?.leaseReport, leaseReportExcelCol, "Lease Report")}
                                type="button"
                                className={" py-2 px-3 mb-2 text-sm font-sm text-white focus:outline-none bg-green-600  rounded-sm border border-gray-200 hover:bg-green-700 hover:text-white "}
                                disabled={report?.leaseReport.length == 0}
                            >
                                Export <i class="fa fa-download ml-2"></i>
                            </button> : null}
                    </div>
                    <Tables
                        data={report?.leaseReport || []}
                        columns={leaseReportCol}
                        calcHeight="150px"
                        isLoading={report.loading}
                        totalRecord={report.totalRecord}
                        pagination={false}
                    />
                </div>
            ),
        },
        {
            id: '2',
            label: 'JE Report',
            component: (
                <JEReport data={report?.jeReport} loading={report.loading} handleExport={handleExport} />
            ),
        },

    ];




    return (
        <Tabs tabs={tabs} />
    )
}
