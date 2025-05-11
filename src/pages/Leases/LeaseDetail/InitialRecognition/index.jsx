import React, { forwardRef, useImperativeHandle, useEffect, useState } from 'react';
import { initialRecognitionCols } from '../../../../utils/tableCols/tableCols';
import Tables from '../../../../components/Tables/Tables';
import { getInitialRecognitionForLease } from '../../../../apis/Cruds/InitialRecognition';
import { handleExcelExport } from '../../../../utils/exportService/excelExportService';
import { initialRecognitionExcelCols } from '../../../../utils/tableCols/tableColForExcelExport';

const InitialRecognition = forwardRef(({ selectedLease, activeTab, filterModalContext }, ref) => {
    const [InitialRecognition, setInitialRecognition] = useState({
        data: {},
        totalRecord: null,
        loading: false,
        datesArr: []
    });
    const [resetTable, setResetTable] = useState(false);

    // Method to get the initialRecognition for specific lease
    const InitialRecognitionForLease = async (pageNumber, pageSize) => {
        setInitialRecognition({
            ...InitialRecognition,
            loading: true
        });
        const payload = {
            pageNumber,
            pageSize,
            leaseId: selectedLease.leaseId,
            startDate: filterModalContext.startDate,
            endDate: filterModalContext.endDate
        };
        const response = await getInitialRecognitionForLease(payload);
        setInitialRecognition({
            ...InitialRecognition,
            loading: false,
            data: response?.initialRecognition || [],
            totalRecord: response?.totalRecords || 0,
            datesArr: response?.dates || [],
        });
    };
    // Handle Export
    const handleExport = () => {
        handleExcelExport({
            payload: InitialRecognition.data || [],
            columnMapping: initialRecognitionExcelCols,
            workSheetName: "Initial Recognition",
            fileName: "InitialRecognition"
        });
    };
    useImperativeHandle(ref, () => ({
        handleExport
    }));
    useEffect(() => {
        InitialRecognitionForLease(1, 10);
        setResetTable(!resetTable)
    }, [selectedLease.leaseId, filterModalContext]);

    return (
        <React.Fragment>
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
    );
});

export default InitialRecognition;
