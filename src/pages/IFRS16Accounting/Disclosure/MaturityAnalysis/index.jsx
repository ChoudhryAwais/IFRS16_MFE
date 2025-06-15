import React from 'react'
import { formatDate } from '../../../../helper/FormateValues'
import { DisclosureReport } from '../../../../utils/tableCols/tableCols';
import Tables from '../../../../components/Tables/Tables';

export default function MaturityAnalysis({ disclosureData }) {
    return (
        <React.Fragment>
            <div className='text-sm text-white bg-[#97072A] p-2 font-medium mt-4'>
                <b>Maturity Analysis</b>
            </div>
            <Tables
                data={disclosureData.data.maturityAnalysis || []}
                columns={DisclosureReport}
                calcHeight="250px"
                isLoading={disclosureData.loading}
                totalRecord={1}
                pagination={false}
            />
        </React.Fragment>
    )
}
