import React, { useEffect, useState, useImperativeHandle, forwardRef } from 'react'
import { ROUScheduleCols } from '../../../../utils/tableCols/tableCols'
import { getRouScheduleForLease } from '../../../../apis/Cruds/RouSchedule'
import Tables from '../../../../components/Tables/Tables'
import { handleExcelExport } from '../../../../utils/exportService/excelExportService';
import { rouScheduleExcelCols } from '../../../../utils/tableCols/tableColForExcelExport';

const ROUSchedule = forwardRef(({ selectedLease, activeTab, filterModalContext }, ref) => {
    const [resetTable, setResetTable] = useState(false)
    const [rouSchedule, setRouSchedule] = useState({
        data: [],
        loading: false,
        totalRecord: null,
    })
    // Method to get the rouSchedule for specific lease
    const rouScheduleForLease = async (pageNumber, pageSize) => {
        setRouSchedule({
            ...rouSchedule,
            loading: true,
        })
        const payload = {
            pageNumber,
            pageSize,
            leaseId: selectedLease.leaseId,
            startDate: filterModalContext.startDate,
            endDate: filterModalContext.endDate
        }
        const response = await getRouScheduleForLease(payload)
        setRouSchedule({
            ...rouSchedule,
            loading: false,
            data: response?.data || [],
            totalRecord: response?.totalRecords || 0
        })
    }
    // Handle Export
    const handleExport = () => {
        handleExcelExport({
            payload: rouSchedule.data || [],
            columnMapping: rouScheduleExcelCols,
            workSheetName: "ROU Schedule",
            fileName: "ROUSchedule"
        });
    };

    useImperativeHandle(ref, () => ({
        handleExport
    }));

    useEffect(() => {
        rouScheduleForLease(1, 10)
        setResetTable(!resetTable)
    }, [selectedLease.leaseId,filterModalContext])
    return (
        <React.Fragment>
            <Tables
                columns={ROUScheduleCols}
                data={rouSchedule.data}
                calcHeight="340px"
                isLoading={rouSchedule.loading}
                totalRecord={rouSchedule.totalRecord}
                getPaginatedData={rouScheduleForLease}
                tabChange={activeTab}
                resetTable={resetTable}
            />
        </React.Fragment>
    )
})
export default ROUSchedule;
