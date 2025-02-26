import React, { useEffect, useState } from 'react'
import { initialRecognitionCols } from '../../../../utils/tableCols/tableCols'
import { GeneralFilter } from '../../../../components/FilterBox/GeneralFilter'
import Tables from '../../../../components/Tables/Tables'
import { getInitialRecognitionForLease } from '../../../../apis/Cruds/InitialRecognition'

export default function InitialRecognition({ selectedLease, activeTab }) {
    const [InitialRecognition, setInitialRecognition] = useState({
        data: {},
        totalRecord: null,
        loading: false,
        datesArr: []
    })
    const [filterModal, setFilterModal] = useState({
        startDate: null,
        endDate: null
    })
    const [resetTable, setResetTable] = useState(false)

    // Method to get the initialRecognition for specific lease
    const InitialRecognitionForLease = async (pageNumber, pageSize, startDate = null, endDate = null) => {
        setInitialRecognition({
            ...InitialRecognition,
            loading: true
        })
        const payload = {
            pageNumber,
            pageSize,
            leaseId: selectedLease.leaseId,
            startDate: startDate === 0 ? null : (startDate || filterModal.startDate),
            endDate: endDate === 0 ? null : (endDate || filterModal.endDate)
        }
        const response = await getInitialRecognitionForLease(payload)
        setInitialRecognition({
            ...InitialRecognition,
            loading: false,
            data: response?.initialRecognition || [],
            totalRecord: response?.totalRecords || 0,
            datesArr: response?.dates || [],
        })
    }
    // Get the filtered data
    const getFilteredData = (filterModal) => {
        const { startDate, endDate } = filterModal
        setFilterModal({
            startDate,
            endDate
        })
        InitialRecognitionForLease(1, 10, startDate, endDate)
    }
    // Handle reset filter functionality
    const handleResetFilter = () => {
        setFilterModal({
            ...filterModal,
            startDate: null,
            endDate: null
        })
        setResetTable(!resetTable)
        InitialRecognitionForLease(1, 10, 0, 0)
    }
    useEffect(() => {
        InitialRecognitionForLease(1, 10)
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
                columns={initialRecognitionCols}
                data={InitialRecognition.data || []}
                calcHeight="340px"
                isLoading={InitialRecognition.loading}
                totalRecord={InitialRecognition.totalRecord}
                getPaginatedData={InitialRecognitionForLease}
                tabChange={activeTab}
                resetTable={resetTable}
            />
        </React.Fragment>
    )
}
