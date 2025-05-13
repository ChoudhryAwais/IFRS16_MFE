import { useState, useRef } from 'react';
import Tabs from '../../../components/Tabs/Tabs';
import InitialRecognition from './InitialRecognition';
import LeaseLiability from './LeaseLiability';
import ROUSchedule from './ROUSchedule';
import JournalEntires from './JournalEntries';
import CommonButton from '../../../components/common/commonButton';
import { CommonButtonTypes } from '../../../utils/enums/common';
import { CustomModal } from '../../../components/common/commonModal';
import TerminateLease from './TerminateLease';
import { useNavigate } from 'react-router-dom';
import { GeneralFilter } from '../../../components/FilterBox/GeneralFilter';
import { getLeaseContract } from '../../../apis/Cruds/LeaseData';
import { SwalPopup } from '../../../middlewares/SwalPopup/SwalPopup';
import { statusCodeMessage } from '../../../utils/enums/statusCode';
import { LoadingSpinner } from '../../../components/LoadingBar/LoadingBar';
import { getAllInitialRecognitionForLease } from '../../../apis/Cruds/InitialRecognition';
import { getAllJournalEntriesForLease } from '../../../apis/Cruds/JournalEntries';
import { getAllLeaseLiabilityForLease } from '../../../apis/Cruds/LeaseLiability';
import { getAllRouScheduleForLease } from '../../../apis/Cruds/RouSchedule';
import { initialRecognitionExcelCols, JEReportExcelCol, leaseExelCols, leaseLiabilityExcelCols, leaseWorkSheetsExcelCol, rouScheduleExcelCols } from '../../../utils/tableCols/tableColForExcelExport';
import { handleMultiExcelExport } from '../../../utils/exportService/excelExportService';

export default function LeaseDetail(props) {
    const navigate = useNavigate();
    const { selectedLease } = props;
    const [activeTab, setActiveTab] = useState('1');
    const [loading, setLoading] = useState(false);
    const [showTerminateModal, setShowTerminateModal] = useState(false);
    const [isExportOpen, setIsExportOpen] = useState(false);
    const [filterModalContext, setFilterModal] = useState({
        startDate: null,
        endDate: null
    });
    const [leaseData, setLeaseData] = useState({
        initialRecognition: [],
        journalEntries: [],
        leaseLiability: [],
        rouSchedule: []
    });

    const initialRecognitionRef = useRef();
    const leaseLiabilityRef = useRef();
    const rouScheduleRef = useRef();
    const journalEntriesRef = useRef();

    const fetchAllLeaseDataForExports = async () => {
        if (leaseData.initialRecognition.length > 0 && leaseData.journalEntries.length > 0 && leaseData.leaseLiability.length > 0 && leaseData.rouSchedule.length > 0) {
            return leaseData
        }
        try {
            setLoading(true);
            const [initialRecognition, journalEntries, leaseLiability, rouSchedule] = await Promise.all([
                getAllInitialRecognitionForLease(selectedLease.leaseId),
                getAllJournalEntriesForLease(selectedLease.leaseId),
                getAllLeaseLiabilityForLease(selectedLease.leaseId),
                getAllRouScheduleForLease(selectedLease.leaseId)
            ]);
            setLoading(false);
            setLeaseData({
                initialRecognition,
                journalEntries,
                leaseLiability,
                rouSchedule
            });
            return {
                initialRecognition,
                journalEntries,
                leaseLiability,
                rouSchedule
            }
        } catch (error) {
            setLoading(false);
            return null
        }
    };

    const onTerminated = () => {
        setShowTerminateModal(false);
        setActiveTab('1');
    };

    const handleExportAllClick = async () => {
        setIsExportOpen(!isExportOpen)
        const result = await fetchAllLeaseDataForExports()
        const exportData = {
            leaseData: {
                data: [selectedLease],
                columns: leaseExelCols
            },
            initialRecognition: {
                data: result.initialRecognition,
                columns: initialRecognitionExcelCols
            },
            leaseLiability: {
                data: result.leaseLiability,
                columns: leaseLiabilityExcelCols
            },
            rouSchedule: {
                data: result.rouSchedule,
                columns: rouScheduleExcelCols
            },
            journalEntries: {
                data: result.journalEntries,
                columns: JEReportExcelCol
            },

        }
        handleMultiExcelExport({
            payload: exportData,
            columnMapping: leaseWorkSheetsExcelCol,
            fileName: selectedLease.leaseName
        })
    };
    const handleExportClick = () => {
        setIsExportOpen(!isExportOpen)
        if (activeTab === '1' && initialRecognitionRef.current) {
            initialRecognitionRef.current.handleExport();
        } else if (activeTab === '2' && leaseLiabilityRef.current) {
            leaseLiabilityRef.current.handleExport();
        } else if (activeTab === '3' && rouScheduleRef.current) {
            rouScheduleRef.current.handleExport();
        } else if (activeTab === '4' && journalEntriesRef.current) {
            journalEntriesRef.current.handleExport();
        }
    };

    // Method to get the filtered data
    const getFilteredData = (filterModal) => {
        const { startDate, endDate } = filterModal;
        setFilterModal({
            startDate,
            endDate
        });
    };

    // Handle reset filter functionality
    const handleResetFilter = () => {
        setFilterModal({
            ...filterModalContext,
            startDate: null,
            endDate: null
        });
    };

    // Specific lease tabs
    const tabs = [
        {
            id: '1',
            label: 'Initial Recognition',
            component: (
                <InitialRecognition
                    ref={initialRecognitionRef}
                    selectedLease={selectedLease}
                    activeTab={activeTab}
                    filterModalContext={filterModalContext}
                />
            ),
            tabChange: (tab) => {
                setActiveTab(tab);
            }
        },
        {
            id: '2',
            label: 'Lease Liability',
            component: (
                <LeaseLiability
                    ref={leaseLiabilityRef}
                    selectedLease={selectedLease}
                    activeTab={activeTab}
                    filterModalContext={filterModalContext}
                />
            ),
            tabChange: (tab) => {
                setActiveTab(tab);
            }
        },
        {
            id: '3',
            label: 'Right of Use Asset',
            component: (
                <ROUSchedule
                    ref={rouScheduleRef}
                    selectedLease={selectedLease}
                    activeTab={activeTab}
                    filterModalContext={filterModalContext}
                />
            ),
            tabChange: (tab) => {
                setActiveTab(tab);
            }
        },
        {
            id: '4',
            label: 'Journal Entries',
            component: (
                <JournalEntires
                    ref={journalEntriesRef}
                    selectedLease={selectedLease}
                    activeTab={activeTab}
                    filterModalContext={filterModalContext}
                />
            ),
            tabChange: (tab) => {
                setActiveTab(tab);
            }
        },
    ];

    const viewLeaseContract = async () => {
        try {
            setLoading(true);
            const response = await getLeaseContract(selectedLease.leaseId);
            setLoading(false);
            const blob = new Blob([response], { type: 'application/pdf' });
            const url = URL.createObjectURL(blob);
            const pdfWindow = window.open(url, '_blank');
            if (!pdfWindow) {
                SwalPopup(
                    "Popup Blocked",
                    statusCodeMessage.allowPopup,
                    "info"
                );
            }
        } catch (error) {
            setLoading(false);
            SwalPopup(
                "No Contract Available",
                statusCodeMessage.contractNotAvailable,
                "info"
            );
        }
    };
    return (
        <div>
            <LoadingSpinner isLoading={loading} />
            <CustomModal
                closeModal={() => setShowTerminateModal(false)}
                mainContent={<TerminateLease selectedLease={selectedLease} callBack={onTerminated} />}
                modalTitle={`Terminate ${selectedLease.leaseName}`}
                openModal={showTerminateModal}
                position="center"
            />
            <div className='flex justify-between gap-1'>
                <div>
                    <h2
                        onClick={viewLeaseContract}
                        className="text-sm font-bold ms-1 underline text-blue-600 cursor-pointer"
                        title='Click to view the contract'
                    >
                        Preview Contract
                    </h2>
                </div>
                <div>
                    <div className="relative inline-block text-left" >
                        <CommonButton
                            onSubmit={() => setIsExportOpen(!isExportOpen)}
                            text={
                                <>
                                    {CommonButtonTypes.EXPORT}
                                    <svg className="ml-1 h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                    </svg>
                                </>

                            }
                            extandedClass="inline-flex justify-center items-center text-xs font-medium text-white bg-green-600 hover:bg-green-700"
                        />

                        {isExportOpen && (
                            <div className="origin-top-right absolute right-0 mt-2 w-48 border-1 shadow-sm shadow-gray-700 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                                <div className="py-1">
                                    <CommonButton
                                        onSubmit={handleExportAllClick}
                                        text={CommonButtonTypes.EXPORT_ALL_LEASE}
                                        extandedClass="bg-white text-black text-xs block w-full text-left text-black hover:text-black hover:bg-gray-100"
                                    />
                                    <CommonButton
                                        onSubmit={handleExportClick}
                                        text={CommonButtonTypes.EXPORT_LEASE}
                                        extandedClass="bg-white text-black text-xs block w-full text-left text-black hover:text-black hover:bg-gray-100"
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                    {
                        selectedLease.isActive &&
                        <CommonButton
                            onSubmit={() => { navigate(`/Leases?id=${selectedLease.leaseId}`); }}
                            text={CommonButtonTypes.MODIFY_LEASE}
                            extandedClass="bg-gray-600 hover:bg-gray-700 hover:text-white text-xs text-white hover:text-white"
                        />
                    }
                    {
                        selectedLease.isActive &&
                        <CommonButton
                            onSubmit={() => { setShowTerminateModal(true); }}
                            text={CommonButtonTypes.TERMINATE_LEASE}
                            extandedClass="bg-red-600 hover:bg-red-700 hover:text-white text-xs text-white hover:text-white"
                        />
                    }
                </div>
            </div>
            <div>
                <div className='border p-2 mt-1 mb-1'>
                    <GeneralFilter
                        onApplyFilter={(filterModal) => getFilteredData(filterModal)}
                        showLeaseSelection={false}
                        btnLabel="Filter"
                        callBackReset={handleResetFilter}
                    />
                </div>
                <Tabs tabs={tabs} active={activeTab} />
            </div>
        </div>
    );
}
