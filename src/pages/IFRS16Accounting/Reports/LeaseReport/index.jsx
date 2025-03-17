import React from 'react'
import { leaseReportCol } from '../../../../utils/tableCols/tableCols'
import { leaseReportExcelCol } from '../../../../utils/tableCols/tableColForExcelExport'
import Tables from '../../../../components/Tables/Tables'
import { formatDate } from '../../../../helper/FormateValues'

export default function LeaseReport({ data, loading, handleExport, filterModal }) {
    return (
        <React.Fragment>
            <div>

                <div className='flex justify-between mb-2'>
                    <div className='text-sm border p-2 font-medium text-gray-600'>
                        <b>Duration</b>: {formatDate(filterModal?.startDate)} - {formatDate(filterModal?.endDate)}
                    </div>
                    <div>
                        {data.length !== 0 ?
                            <button
                                onClick={() => handleExport(data, leaseReportExcelCol, "Lease Report")}
                                type="button"
                                className={" py-2 px-3 text-sm font-sm text-white focus:outline-none bg-green-600  rounded-sm border border-gray-200 hover:bg-green-700 hover:text-white "}
                                disabled={data.length === 0}
                            >
                                Export <i class="fa fa-download ml-2"></i>
                            </button> : null}
                    </div>
                </div>
                <Tables
                    data={data || []}
                    columns={leaseReportCol}
                    calcHeight="240px"
                    isLoading={loading}
                    totalRecord={0}
                    pagination={false}
                />
            </div>
        </React.Fragment>
    )
}
