import React, { useEffect, useState } from 'react'
import Tables from '../../components/Tables/Tables'
import { getAllLeases } from '../../apis/Cruds/LeaseData'
import { SwalPopup } from '../../middlewares/SwalPopup/SwalPopup'
import { leaseCols } from '../../utils/tableCols/tableCols'
import { statusCode } from '../../utils/enums/statusCode'
import { CustomModal } from '../../components/CustomModal/CustomModal'
import LeaseDetail from '../Leases/LeaseDetail'

export default function IFRS16Accounting() {
  const [allLeases, setAllLeases] = useState({
    data: [],
    loading: false
  })
  const [leasePopup, setLeasePopup] = useState(false)
  const [selectedLease, setSelectedLease] = useState(null)

  useEffect(() => {
    getLeases()
  }, [])

  const getLeases = async () => {
    setAllLeases({
      ...allLeases,
      loading: true
    })
    const response = await getAllLeases()
    setAllLeases({
      ...allLeases,
      loading: false,
      data: response
    })
  }
  const getLeaseDetail = (leaseData) => {
    setSelectedLease(leaseData)
    setLeasePopup(true)
  }
  const extandedTableFunc = {
    callBack: (leaseData) => getLeaseDetail(leaseData)
  }

  return (
    <div>
      <CustomModal
        mainContent={
          <LeaseDetail selectedLease={selectedLease} />
        }
        modalTitle={"Lease Detail"}
        openModal={leasePopup}
        closeModal={() => {
          setLeasePopup(false)
        }}
      />
      <Tables
        extandedTableFunc={extandedTableFunc}
        data={allLeases.data}
        columns={leaseCols}
        calcHeight="45px"
        isLoading={allLeases.loading}
      />
    </div>
  )
}
