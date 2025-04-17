import React, { useState, useRef } from 'react'
import Tabs from '../../../components/Tabs/Tabs'
import InitialRecognition from './InitialRecognition';
import LeaseLiability from './LeaseLiability';
import ROUSchedule from './ROUSchedule';
import JournalEntires from './JournalEntries';
import CommonButton from '../../../components/common/commonButton';
import { CommonButtonTypes } from '../../../utils/enums/common'
import { CustomModal } from '../../../components/common/commonModal';
import TerminateLease from './TerminateLease';
import { useNavigate } from 'react-router-dom';

export default function LeaseDetail(props) {
    const navigate = useNavigate()
    const { selectedLease } = props
    const [activeTab, setActiveTab] = useState('1');
    const [showTerminateModal, setShowTerminateModal] = useState(false)
    const initialRecognitionRef = useRef();
    const leaseLiabilityRef = useRef();
    const rouScheduleRef = useRef();
    const journalEntriesRef = useRef();

    const onTerminated = () => {
        setShowTerminateModal(false)
        setActiveTab('1')
    }

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

    // Specific lease tabs
    const tabs = [
        {
            id: '1',
            label: 'Initial Recognition',
            component: (
                <InitialRecognition ref={initialRecognitionRef} selectedLease={selectedLease} activeTab={activeTab} />
            ),
            tabChange: (tab) => {
                setActiveTab(tab)
            }
        },
        {
            id: '2',
            label: 'Lease Liability',
            component: (
                <LeaseLiability ref={leaseLiabilityRef} selectedLease={selectedLease} activeTab={activeTab} />
            ),
            tabChange: (tab) => {
                setActiveTab(tab)
            }
        },
        {
            id: '3',
            label: 'Right of Use Asset',
            component: (
                <ROUSchedule ref={rouScheduleRef} selectedLease={selectedLease} activeTab={activeTab} />
            ),
            tabChange: (tab) => {
                setActiveTab(tab)
            }
        },
        {
            id: '4',
            label: 'Journal Entries',
            component: (
                <JournalEntires ref={journalEntriesRef} selectedLease={selectedLease} activeTab={activeTab} />
            ),
            tabChange: (tab) => {
                setActiveTab(tab)
            }
        },
    ];
    return (
        <div>
            <CustomModal
                closeModal={() => setShowTerminateModal(false)}
                mainContent={<TerminateLease selectedLease={selectedLease} callBack={onTerminated} />}
                modalTitle={`Terminate ${selectedLease.leaseName}`}
                openModal={showTerminateModal}
                position="center"
            />
            <div className='flex justify-end gap-1'>
                {
                    selectedLease.isActive &&
                    <CommonButton
                        onSubmit={() => { navigate(`/Leases?id=${selectedLease.leaseId}`) }}
                        text={CommonButtonTypes.MODIFY_LEASE}
                        extandedClass="bg-gray-600 hover:bg-gray-700 hover:text-white text-xs"
                    />
                }
                {
                    selectedLease.isActive &&
                    <CommonButton
                        onSubmit={() => { setShowTerminateModal(true) }}
                        text={CommonButtonTypes.TERMINATE_LEASE}
                        extandedClass="bg-red-600 hover:bg-red-700 hover:text-white text-xs"
                    />
                }

                <CommonButton
                    onSubmit={handleExportClick}
                    text={`${CommonButtonTypes.EXPORT_LEASE}`}
                    extandedClass="bg-green-600 hover:bg-green-700 hover:text-white text-xs"
                />
            </div>
            <div>
                <Tabs tabs={tabs} active={activeTab} />
            </div>
        </div>
    )
}
