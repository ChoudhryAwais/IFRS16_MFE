import React from 'react'
import { JEReportExcelCol } from '../../../../utils/tableCols/tableColForExcelExport'
import Tables from '../../../../components/Tables/Tables'
import { JEReportCol } from '../../../../utils/tableCols/tableCols'

export default function JEReport({ data, loading, handleExport }) {
    return (
        <React.Fragment>
            <div className='text-right'>
                {data.length !== 0 ?
                    <button
                        onClick={() => handleExport(data, JEReportExcelCol, "Journal Entry Report")}
                        type="button"
                        className={" py-2 px-3 mb-2 text-sm font-sm text-white focus:outline-none bg-green-600  rounded-sm border border-gray-200 hover:bg-green-700 hover:text-white "}
                        disabled={data.length == 0}
                    >
                        Export <i class="fa fa-download ml-2"></i>
                    </button> : null}
            </div>
            <Tables
                data={data || []}
                columns={JEReportCol}
                calcHeight="240px"
                isLoading={loading}
                totalRecord={0}
                pagination={false}
            />
        </React.Fragment>
    )
}
