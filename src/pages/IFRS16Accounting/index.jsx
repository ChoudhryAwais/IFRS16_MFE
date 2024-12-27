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
  const [selectedLeaseId, setSelectedLeaseId] = useState(null)

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
  const getLeaseDetail = (leaseId) => {
    setSelectedLeaseId(leaseId)
    setLeasePopup(true)
  }
  const extandedTableFunc = {
    primaryKey: "leaseId",
    callBack: (leaseId) => getLeaseDetail(leaseId)
  }

  return (
    <div>
      <CustomModal
        mainContent={
          <LeaseDetail selectedLeaseId={selectedLeaseId} />
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
