import React, { forwardRef, useImperativeHandle, useEffect, useState } from 'react';
import { initialRecognitionCols } from '../../../../utils/tableCols/tableCols';
import { GeneralFilter } from '../../../../components/FilterBox/GeneralFilter';
import Tables from '../../../../components/Tables/Tables';
import { getInitialRecognitionForLease } from '../../../../apis/Cruds/InitialRecognition';
import { handleExcelExport } from '../../../../utils/exportService/excelExportService';
import { initialRecognitionExcelCols } from '../../../../utils/tableCols/tableColForExcelExport';

const InitialRecognition = forwardRef(({ selectedLease, activeTab, setFilterModalContext, filterModalContext }, ref) => {
    const [InitialRecognition, setInitialRecognition] = useState({
        data: {},
        totalRecord: null,
        loading: false,
        datesArr: []
    });
    const [filterModal, setFilterModal] = useState({
        startDate: null,
        endDate: null
    });
    const [resetTable, setResetTable] = useState(false);

    // Method to get the initialRecognition for specific lease
    const InitialRecognitionForLease = async (pageNumber, pageSize, startDate = null, endDate = null) => {
        setInitialRecognition({
            ...InitialRecognition,
            loading: true
        });
        const payload = {
            pageNumber,
            pageSize,
            leaseId: selectedLease.leaseId,
            startDate: startDate === 0 ? null : (startDate || filterModal.startDate),
            endDate: endDate === 0 ? null : (endDate || filterModal.endDate)
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

    // Get the filtered data
    const getFilteredData = (filterModal) => {
        const { startDate, endDate } = filterModal;
        setFilterModal({
            startDate,
            endDate
        });
        InitialRecognitionForLease(1, 10, startDate, endDate);
    };

    // Handle reset filter functionality
    const handleResetFilter = () => {
        setFilterModal({
            ...filterModal,
            startDate: null,
            endDate: null
        });
        setResetTable(!resetTable);
        InitialRecognitionForLease(1, 10, 0, 0);
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
    }, [selectedLease.leaseId]);

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
    );
});

export default InitialRecognition;
