import React from 'react';
import Tabs from '../../../components/Tabs/Tabs'
import GeneralDisclosure from './General'
import MaturityAnalysis from './MaturityAnalysis';
import { handleExcelExport } from '../../../utils/exportService/excelExportService';
import { formatDate } from '../../../helper/FormateValues';
import { disclosureReportExcelCols } from '../../../utils/tableCols/tableColForExcelExport';

export default function Disclosure({ disclosureData, filterModal }) {
    // Handle Export
    // Specific Report tabs
    const tabs = [
        {
            id: '1',
            label: 'General',
            component: (
                <GeneralDisclosure disclosureData={disclosureData}/>
            ),
        },
        {
            id: '2',
            label: 'Maturity Analysis',
            component: (
                <MaturityAnalysis disclosureData={disclosureData}/>
            ),
        },

    ];
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
            {
                label: "",
                value: ""
            },
            {
                label: "Maturity Analysis",
                value: ""
            },
            ...disclosureData?.data?.maturityAnalysis,
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
            <div className='flex justify-between mb-1'>
                <div className='text-xs border p-2 font-medium text-gray-600'>
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
                            className={"py-1.5 px-1.5 rounded-sm text-xs font-sm text-white focus:outline-none bg-green-600 border border-gray-200 hover:bg-green-700 hover:text-white "}
                            disabled={disclosureData?.data.length === 0}
                        >
                            Export <i className="fa fa-download ml-1"></i>
                        </button> : null}
                </div>
            </div>
            <Tabs tabs={tabs} />
        </React.Fragment>
    )
}
