import React, { useEffect, useState } from 'react'
import { ROUScheduleCols } from '../../../../utils/tableCols/tableCols'
import { getRouScheduleForLease } from '../../../../apis/Cruds/RouSchedule'
import Tables from '../../../../components/Tables/Tables'
import { GeneralFilter } from '../../../../components/FilterBox/GeneralFilter'

export default function ROUSchedule({ selectedLease, activeTab }) {
    const [rouSchedule, setRouSchedule] = useState({
        data: [],
        loading: false,
        totalRecord: null,
    })
    const [resetTable, setResetTable] = useState(false)
    const [filterModal, setFilterModal] = useState({
        startDate: null,
        endDate: null
    })

    // Method to get the rouSchedule for specific lease
    const rouScheduleForLease = async (pageNumber, pageSize, startDate = null, endDate = null) => {
        setRouSchedule({
            ...rouSchedule,
            loading: true,
        })
        const payload = {
            pageNumber,
            pageSize,
            leaseId: selectedLease.leaseId,
            startDate: startDate === 0 ? null : (startDate || filterModal.startDate),
            endDate: endDate === 0 ? null : (endDate || filterModal.endDate)
        }
        const response = await getRouScheduleForLease(payload)
        setRouSchedule({
            ...rouSchedule,
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
        rouScheduleForLease(1, 10, startDate, endDate)
    }
    // Handle reset filter functionality
    const handleResetFilter = () => {
        setFilterModal({
            ...filterModal,
            startDate: null,
            endDate: null
        })
        setResetTable(!resetTable)
        rouScheduleForLease(1, 10, 0, 0)
    }

    useEffect(() => {
        rouScheduleForLease(1, 10)
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
                columns={ROUScheduleCols}
                data={rouSchedule.data}
                calcHeight="340px"
                isLoading={rouSchedule.loading}
                totalRecord={rouSchedule.totalRecord}
                getPaginatedData={rouScheduleForLease}
                tabChange={activeTab}
            />
        </React.Fragment>
    )
}
