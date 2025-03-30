import React, { useState } from 'react'
import Tabs from '../../../components/Tabs/Tabs'
import InitialRecognition from './InitialRecognition';
import LeaseLiability from './LeaseLiability';
import ROUSchedule from './ROUSchedule';
import JournalEntires from './JournalEntries';
import { getInitialRecognitionForLease } from '../../../apis/Cruds/InitialRecognition'
import { getLeaseLiabilityForLease } from '../../../apis/Cruds/LeaseLiability'
import { getRouScheduleForLease } from '../../../apis/Cruds/RouSchedule'
import { getJournalEntriesForLease } from '../../../apis/Cruds/JournalEntries'
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
    const [leaseDetail, setleaseDetail] = useState({
        LeaseLiability: {},
        ROUSchedule: {},
        JournalEntries: {},
        InitialRecognition: {}
    })

    const fetchAllLeaseDetails = async () => {
        // const payload = {
        //     pageNumber,
        //     pageSize,
        //     leaseId: selectedLease.leaseId,
        //     startDate: startDate === 0 ? null : (startDate || filterModal.startDate),
        //     endDate: endDate === 0 ? null : (endDate || filterModal.endDate)
        // }
        const leaseId = selectedLease.leaseId;
        const initialRecognition = await getInitialRecognitionForLease({ leaseId });
        const leaseLiability = await getLeaseLiabilityForLease({ leaseId });
        const rouSchedule = await getRouScheduleForLease({ leaseId });
        const journalEntries = await getJournalEntriesForLease({ leaseId });

        setleaseDetail({
            InitialRecognition: initialRecognition,
            LeaseLiability: leaseLiability,
            ROUSchedule: rouSchedule,
            JournalEntries: journalEntries
        });
    }
    // Specific lease tabs
    const tabs = [
        {
            id: '1',
            label: 'Initial Recognition',
            component: (
                <InitialRecognition selectedLease={selectedLease} activeTab={activeTab} />
            ),
            tabChange: (tab) => {
                setActiveTab(tab)
            }
        },
        {
            id: '2',
            label: 'Lease Liability',
            component: (
                <LeaseLiability selectedLease={selectedLease} activeTab={activeTab} />
            ),
            tabChange: (tab) => {
                setActiveTab(tab)
            }
        },
        {
            id: '3',
            label: 'Right of Use Asset',
            component: (
                <ROUSchedule selectedLease={selectedLease} activeTab={activeTab} />
            ),
            tabChange: (tab) => {
                setActiveTab(tab)
            }
        },
        {
            id: '4',
            label: 'Journal Entries',
            component: (
                <JournalEntires selectedLease={selectedLease} activeTab={activeTab} />
            ),
            tabChange: (tab) => {
                setActiveTab(tab)
            }
        },
        // { id: '5', label: 'Disclousure' },
    ];

    const onTerminated = () => {
        setShowTerminateModal(false)
        setActiveTab('1')
    }

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
                    onSubmit={() => { }}
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
