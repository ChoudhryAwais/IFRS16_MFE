import React, { useEffect, useState } from 'react'
import { leaseLiabilityCols } from '../../../../utils/tableCols/tableCols'
import { getLeaseLiabilityForLease } from '../../../../apis/Cruds/LeaseLiability'
import Tables from '../../../../components/Tables/Tables'
import { GeneralFilter } from '../../../../components/FilterBox/GeneralFilter'

export default function LeaseLiability({ selectedLease, activeTab }) {
    const [resetTable, setResetTable] = useState(false)
    const [leaseLiability, setLeaseLiability] = useState({
        data: [],
        loading: false,
        totalRecord: null,
    })
    const [filterModal, setFilterModal] = useState({
        startDate: null,
        endDate: null
    })

    // Method to get the leaseliability for specific lease
    const leaseLiabilityForLease = async (pageNumber, pageSize, startDate = null, endDate = null) => {
        setLeaseLiability({
            ...leaseLiability,
            loading: true,
        })
        const payload = {
            pageNumber,
            pageSize,
            leaseId: selectedLease.leaseId,
            startDate: startDate === 0 ? null : (startDate || filterModal.startDate),
            endDate: endDate === 0 ? null : (endDate || filterModal.endDate)
        }
        const response = await getLeaseLiabilityForLease(payload)
        setLeaseLiability({
            ...leaseLiability,
            loading: false,
            data: response?.data || [],
            totalRecord: response?.totalRecords || 0
        })
    }
    // Get the filtered data
    const getFilteredData = (filterModal) => {
        const { startDate, endDate } = filterModal
        setFilterModal({
            startDate,
            endDate
        })
        setResetTable(!resetTable)
        leaseLiabilityForLease(1, 10, startDate, endDate)
    }
    // Handle reset filter functionality
    const handleResetFilter = () => {
        setFilterModal({
            ...filterModal,
            startDate: null,
            endDate: null
        })
        setResetTable(!resetTable)
        leaseLiabilityForLease(1, 10, 0, 0)
    }

    useEffect(() => {
        leaseLiabilityForLease(1, 10)
    }, [selectedLease.leaseId])

    return (
        <React.Fragment>
            <div className='border p-3'>
                <GeneralFilter
                    onApplyFilter={(filterModal) => getFilteredData(filterModal)}
                    showLeaseSelection={false}
                    btnLabel="Filter"
                    callBackReset={handleResetFilter}
                />
            </div>
            <Tables
                columns={leaseLiabilityCols}
                data={leaseLiability.data}
                calcHeight="340px"
                isLoading={leaseLiability.loading}
                totalRecord={leaseLiability.totalRecord}
                getPaginatedData={leaseLiabilityForLease}
                tabChange={activeTab}
                resetTable={resetTable}
            />
        </React.Fragment>
    )
}
