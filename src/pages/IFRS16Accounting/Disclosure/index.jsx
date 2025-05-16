import React from 'react'
import { handleExcelExport } from '../../../utils/exportService/excelExportService'
import { DisclosureReport } from '../../../utils/tableCols/tableCols'
import { formatDate } from '../../../helper/FormateValues'
import Tables from '../../../components/Tables/Tables'
import { disclosureReportExcelCols } from '../../../utils/tableCols/tableColForExcelExport'

export default function Disclosure({ disclosureData, filterModal }) {
    // Handle Export
    const handleExport = (mappingCol, reportName) => {
        const proccessPayload = [
            {
                label: "",
                value: ""
            },
            {
                label: "Right of Use Asset",
                value: ""
            },
            ...disclosureData?.data?.rouDisclousre,
            {
                label: "",
                value: ""
            },
            {
                label: "Lease Liability",
                value: ""
            },
            ...disclosureData?.data?.llDisclousre,
        ]
        const processFilter = {
            "Start Date": filterModal.startDate,
            "End Date": filterModal.endDate,
        }
        handleExcelExport({
            payload: proccessPayload,
            filters: processFilter,
            columnMapping: mappingCol,
            workSheetName: reportName,
            fileName: "Disclosure Report"
        })
    }
    return (
        <React.Fragment>
            <div>
                <div className='flex justify-between mb-2'>
                    <div className='text-sm border p-2 font-medium text-gray-600'>
                        <b>Duration</b>: {formatDate(filterModal?.startDate)} - {formatDate(filterModal?.endDate)}
                    </div>
                    <div>
                        {disclosureData?.data.length !== 0 ?
                            <button
                                onClick={() =>
                                    handleExport(
                                        disclosureReportExcelCols,
                                        "Disclosure Report",
                                    )
                                }
                                type="button"
                                className={"py-2 px-3 text-sm font-sm text-white focus:outline-none bg-green-600  rounded-sm border border-gray-200 hover:bg-green-700 hover:text-white "}
                                disabled={disclosureData?.data.length === 0}
                            >
                                Export <i className="fa fa-download ml-2"></i>
                            </button> : null}
                    </div>
                </div>
                <div className='text-sm text-white bg-[#97072A] p-2 font-medium mt-4'>
                    <b>Lease Liability</b>
                </div>
                <Tables
                    data={disclosureData.data.rouDisclousre || []}
                    columns={DisclosureReport}
                    calcHeight="420px"
                    isLoading={disclosureData.loading}
                    totalRecord={1}
                    pagination={false}
                />
                <div className='text-sm bg-[#97072A] p-2 font-medium text-white mt-4'>
                    <b>Right of Use Asset</b>
                </div>
                <Tables
                    data={disclosureData.data.llDisclousre || []}
                    columns={DisclosureReport}
                    calcHeight="420px"
                    isLoading={disclosureData.loading}
                    totalRecord={1}
                    pagination={false}
                />
            </div>
        </React.Fragment>
    )
}
