import React from 'react'
import { DisclosureReport } from '../../../../utils/tableCols/tableCols'
import Tables from '../../../../components/Tables/Tables'

export default function GeneralDisclosure({ disclosureData }) {

    return (
        <React.Fragment>
            <div>
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
