import React, { useEffect, useState } from 'react'
import Tables from '../../components/Tables/Tables'
import { getAllLeases } from '../../apis/Cruds/LeaseData'
import { SwalPopup } from '../../middlewares/SwalPopup/SwalPopup'
import { leaseCols } from '../../utils/tableCols/tableCols'
import { statusCode } from '../../utils/enums/statusCode'
import { CustomModal } from '../../components/CustomModal/CustomModal'
import LeaseDetail from '../Leases/LeaseDetail'

export default function IFRS16Accounting() {
  const [allLeases, setAllLeases] = useState([])
  const [leasePopup, setLeasePopup] = useState(false)
  const [selectedLease, setSelectedLease] = useState(null)

  useEffect(() => {
    getLeases()
  }, [])

  const getLeases = async () => {
    const response = await getAllLeases()
    if (!(response.length > 0)) {
      SwalPopup(
        "Try again",
        statusCode.somethingWentWrong,
        "error"
      )
      return
    }
    setAllLeases(response)
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
        openModal={leasePopup}
        closeModal={() => {
          setLeasePopup(false)
        }}
      />
      <Tables
        extandedTableFunc={extandedTableFunc}
        data={allLeases}
        columns={leaseCols}
        calcHeight="45px"
      />
    </div>
  )
}
