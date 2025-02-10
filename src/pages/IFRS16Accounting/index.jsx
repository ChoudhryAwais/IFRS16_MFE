import React, { useEffect, useState } from 'react'
import Tables from '../../components/Tables/Tables'
import { getAllLeases } from '../../apis/Cruds/LeaseData'
import { leaseCols } from '../../utils/tableCols/tableCols'
import { CustomModal } from '../../components/CustomModal/CustomModal'
import LeaseDetail from '../Leases/LeaseDetail'
import { GeneralFilter } from '../../components/FilterBox/GeneralFilter'
import { sessionVariable } from '../../utils/enums/sessionStorage'
import { removeSessionStorageVariable, setSessionStorage } from '../../apis/Cruds/sessionCrud'

export default function IFRS16Accounting() {
  const [allLeases, setAllLeases] = useState({
    data: [],
    totalRecord: null,
    loading: false
  })
  const [leasePopup, setLeasePopup] = useState(false)
  const [selectedLease, setSelectedLease] = useState(null)

  useEffect(() => {
    getLeases(1, 10)
  }, [])

  const getLeases = async (pageNumber, pageSize) => {
    setAllLeases({
      ...allLeases,
      loading: true
    })
    const response = await getAllLeases(pageNumber, pageSize)
    setAllLeases({
      ...allLeases,
      loading: false,
      data: response.data,
      totalRecord: response.totalRecords
    })
  }
  const getLeaseDetail = (leaseData) => {
    setSelectedLease(leaseData)
    setSessionStorage({
      key: sessionVariable.selectLease,
      value: leaseData
    })
    setLeasePopup(true)
  }
  const extandedTableFunc = {
    callBack: (leaseData) => getLeaseDetail(leaseData)
  }

  return (
    <div>
      <GeneralFilter onApplyFilter={(filterModal) => console.log(filterModal)} />
      <CustomModal
        mainContent={
          <LeaseDetail selectedLease={selectedLease} />
        }
        modalTitle={selectedLease?.leaseName || "Lease Detail"}
        openModal={leasePopup}
        closeModal={() => {
          setLeasePopup(false)
          removeSessionStorageVariable({ key: sessionVariable.selectLease })
        }}
      />
      <Tables
        extandedTableFunc={extandedTableFunc}
        data={allLeases?.data || []}
        columns={leaseCols}
        calcHeight="150px"
        isLoading={allLeases.loading}
        totalRecord={allLeases.totalRecord}
        getPaginatedData={getLeases}
      />
    </div>
  )
}
