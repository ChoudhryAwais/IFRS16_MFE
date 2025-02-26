import React, { useEffect, useState } from 'react'
import { JournalEntiresCols } from '../../../../utils/tableCols/tableCols'
import { getJournalEntriesForLease } from '../../../../apis/Cruds/JournalEntries'
import Tables from '../../../../components/Tables/Tables'
import { GeneralFilter } from '../../../../components/FilterBox/GeneralFilter'

export default function JournalEntires({ selectedLease, activeTab }) {
    const [journalEntries, setJournalEntries] = useState({
        data: [],
        loading: false,
        totalRecord: null,
    })
    const [filterModal, setFilterModal] = useState({
        startDate: null,
        endDate: null
    })
    const [resetTable, setResetTable] = useState(false)
    // Method to get the leaseliability for specific lease
    const journalEntriesForLease = async (pageNumber, pageSize, startDate = null, endDate = null) => {
        setJournalEntries({
            ...journalEntries,
            loading: true,
        })
        const payload = {
            pageNumber,
            pageSize,
            leaseId: selectedLease.leaseId,
            startDate: startDate === 0 ? null : (startDate || filterModal.startDate),
            endDate: endDate === 0 ? null : (endDate || filterModal.endDate)
        }
        const response = await getJournalEntriesForLease(payload)
        setJournalEntries({
            ...journalEntries,
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
        journalEntriesForLease(1, 10, startDate, endDate)
    }
    // Handle reset filter functionality
    const handleResetFilter = () => {
        setFilterModal({
            ...filterModal,
            startDate: null,
            endDate: null
        })
        setResetTable(!resetTable)
        journalEntriesForLease(1, 10, 0, 0)
    }

    useEffect(() => {
        journalEntriesForLease(1, 10)
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
                columns={JournalEntiresCols}
                data={journalEntries.data}
                calcHeight="340px"
                isLoading={journalEntries.loading}
                totalRecord={journalEntries.totalRecord}
                getPaginatedData={journalEntriesForLease}
                tabChange={activeTab}
                resetTable={resetTable}
            />
        </React.Fragment>
    )
}
