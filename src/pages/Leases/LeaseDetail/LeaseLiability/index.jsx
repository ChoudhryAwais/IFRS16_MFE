import React, { useEffect, useState, useImperativeHandle, forwardRef } from 'react'
import { leaseLiabilityCols } from '../../../../utils/tableCols/tableCols'
import { getLeaseLiabilityForLease } from '../../../../apis/Cruds/LeaseLiability'
import Tables from '../../../../components/Tables/Tables'
import { handleExcelExport } from '../../../../utils/exportService/excelExportService';
import { leaseLiabilityExcelCols } from '../../../../utils/tableCols/tableColForExcelExport';

const LeaseLiability = forwardRef(({ selectedLease, activeTab, filterModalContext }, ref) => {
    const [resetTable, setResetTable] = useState(false)
    const [leaseLiability, setLeaseLiability] = useState({
        data: [],
        loading: false,
        totalRecord: null,
    })
    // Method to get the leaseliability for specific lease
    const leaseLiabilityForLease = async (pageNumber, pageSize,) => {
        setLeaseLiability({
            ...leaseLiability,
            loading: true,
        })
        const payload = {
            pageNumber,
            pageSize,
            leaseId: selectedLease.leaseId,
            startDate: filterModalContext.startDate,
            endDate: filterModalContext.endDate
        }
        const response = await getLeaseLiabilityForLease(payload)
        setLeaseLiability({
            ...leaseLiability,
            loading: false,
            data: response?.data || [],
            totalRecord: response?.totalRecords || 0
        })
    }

    const handleExport = () => {
        handleExcelExport({
            payload: leaseLiability.data || [],
            columnMapping: leaseLiabilityExcelCols,
            workSheetName: "Lease Liability",
            fileName: "LeaseLiability"
        });
    };

    useImperativeHandle(ref, () => ({
        handleExport
    }));

    useEffect(() => {
        leaseLiabilityForLease(1, 10)
        setResetTable(!resetTable)
    }, [selectedLease.leaseId, filterModalContext])

    return (
        <React.Fragment>
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
})

export default LeaseLiability;
