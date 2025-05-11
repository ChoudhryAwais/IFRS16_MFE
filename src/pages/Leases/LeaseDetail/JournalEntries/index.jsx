import React, { useEffect, useState, useImperativeHandle, forwardRef } from 'react'
import { JournalEntiresCols } from '../../../../utils/tableCols/tableCols'
import { getJournalEntriesForLease } from '../../../../apis/Cruds/JournalEntries'
import Tables from '../../../../components/Tables/Tables'
import { handleExcelExport } from '../../../../utils/exportService/excelExportService';
import { JEReportExcelCol } from '../../../../utils/tableCols/tableColForExcelExport';

const JournalEntires = forwardRef(({ selectedLease, activeTab, filterModalContext }, ref) => {
    const [journalEntries, setJournalEntries] = useState({
        data: [],
        loading: false,
        totalRecord: null,
    })
    const [resetTable, setResetTable] = useState(false)
    // Method to get the leaseliability for specific lease
    const journalEntriesForLease = async (pageNumber, pageSize) => {
        setJournalEntries({
            ...journalEntries,
            loading: true,
        })
        const payload = {
            pageNumber,
            pageSize,
            leaseId: selectedLease.leaseId,
            startDate: filterModalContext.startDate,
            endDate: filterModalContext.endDate
        }
        const response = await getJournalEntriesForLease(payload)
        setJournalEntries({
            ...journalEntries,
            loading: false,
            data: response?.data || [],
            totalRecord: response?.totalRecords || 0
        })
    }
    // Handle Export
    const handleExport = () => {
        handleExcelExport({
            payload: journalEntries.data || [],
            columnMapping: JEReportExcelCol,
            workSheetName: "Journal Entries",
            fileName: "JournalEntries"
        });
    };

    useImperativeHandle(ref, () => ({
        handleExport
    }));

    useEffect(() => {
        journalEntriesForLease(1, 10)
        setResetTable(!resetTable)
    }, [selectedLease.leaseId, filterModalContext])

    return (
        <React.Fragment>
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
})

export default JournalEntires;
