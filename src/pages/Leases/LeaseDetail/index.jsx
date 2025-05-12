import React, { useState, useRef, useEffect } from 'react';
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
import { statusCode } from '../../../utils/enums/statusCode';
// import { getAllInitialRecognitionForLease, getAllJournalEntriesForLease, getAllLeaseLiabilityForLease, getAllRouScheduleForLease } from '../../../apis/Cruds/LeaseData';

export default function LeaseDetail(props) {
    const navigate = useNavigate();
    const { selectedLease } = props;
    const [activeTab, setActiveTab] = useState('1');
    const [showTerminateModal, setShowTerminateModal] = useState(false);
    const [filterModalContext, setFilterModal] = useState({
        startDate: null,
        endDate: null
    });

    // const [leaseData, setLeaseData] = useState({
    //     initialRecognition: [],
    //     journalEntries: [],
    //     leaseLiability: [],
    //     rouSchedule: []
    // });
    const initialRecognitionRef = useRef();
    const leaseLiabilityRef = useRef();
    const rouScheduleRef = useRef();
    const journalEntriesRef = useRef();

    // useEffect(() => {
    //     const fetchLeaseData = async () => {
    //         try {
    //             const [initialRecognition, journalEntries, leaseLiability, rouSchedule] = await Promise.all([
    //                 getAllInitialRecognitionForLease(selectedLease.leaseId),
    //                 getAllJournalEntriesForLease(selectedLease.leaseId),
    //                 getAllLeaseLiabilityForLease(selectedLease.leaseId),
    //                 getAllRouScheduleForLease(selectedLease.leaseId)
    //             ]);

    //             setLeaseData({
    //                 initialRecognition,
    //                 journalEntries,
    //                 leaseLiability,
    //                 rouSchedule
    //             });
    //         } catch (error) {
    //             console.error('Error fetching lease data:', error);
    //         }
    //     };

    //     fetchLeaseData();
    // }, [selectedLease.leaseId]);


    const onTerminated = () => {
        setShowTerminateModal(false);
        setActiveTab('1');
    };

    const handleExportClick = () => {
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
            const response = await getLeaseContract(selectedLease.leaseId);
            const blob = new Blob([response], { type: 'application/pdf' });
            const url = URL.createObjectURL(blob);
            const pdfWindow = window.open(url, '_blank');
            if (!pdfWindow) {
                SwalPopup(
                    "Popup Blocked",
                    statusCode.allowPopup,
                    "info"
                );
            }
        } catch (error) {
            SwalPopup(
                "No Contract Available",
                statusCode.contractNotAvailable,
                "info"
            );
        }
    };
    return (
        <div>
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
                    <CommonButton
                        onSubmit={handleExportClick}
                        text={`${CommonButtonTypes.EXPORT_LEASE}`}
                        extandedClass="bg-green-600 hover:bg-green-700 hover:text-white text-xs"
                    />
                    {
                        selectedLease.isActive &&
                        <CommonButton
                            onSubmit={() => { navigate(`/Leases?id=${selectedLease.leaseId}`); }}
                            text={CommonButtonTypes.MODIFY_LEASE}
                            extandedClass="bg-gray-600 hover:bg-gray-700 hover:text-white text-xs"
                        />
                    }
                    {
                        selectedLease.isActive &&
                        <CommonButton
                            onSubmit={() => { setShowTerminateModal(true); }}
                            text={CommonButtonTypes.TERMINATE_LEASE}
                            extandedClass="bg-red-600 hover:bg-red-700 hover:text-white text-xs"
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
