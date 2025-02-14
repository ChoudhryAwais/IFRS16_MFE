import React, { useEffect, useState } from 'react'
import Tables from '../../components/Tables/Tables'
import { getAllLeases } from '../../apis/Cruds/LeaseData'
import { leaseCols, leaseReportCol } from '../../utils/tableCols/tableCols'
import { CustomModal } from '../../components/CustomModal/CustomModal'
import LeaseDetail from '../Leases/LeaseDetail'
import { GeneralFilter } from '../../components/FilterBox/GeneralFilter'
import { sessionVariable } from '../../utils/enums/sessionStorage'
import { removeSessionStorageVariable, setSessionStorage } from '../../apis/Cruds/sessionCrud'
import { getAllLeaseReport } from '../../apis/Cruds/leaseReport'
import { LoadingSpinner } from '../../components/LoadingBar/LoadingBar'
import { handleExcelExport } from '../../utils/exportService/excelExportService'
import { leaseReportExcelCol } from '../../utils/tableCols/tableColForExcelExport'

export default function IFRS16Accounting() {
  const [leaseReport, setLeaseReport] = useState({
    data: [],
    loading: false,
    totalRecord: null,
  })
  const [allLeases, setAllLeases] = useState({
    data: [],
    totalRecord: null,
    loading: false
  })
  const [leasePopup, setLeasePopup] = useState(false)
  const [leaseReportPopup, setLeaseReportPopup] = useState(false)

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

  // Method to get the aggregation report for lease
  const allLeaseReport = async (filterModal) => {
    setLeaseReport({
      ...leaseReport,
      loading: true
    })
    try {
      const response = await getAllLeaseReport(filterModal)
      setLeaseReport({
        ...leaseReport,
        loading: false,
        data: response.length > 0 ? response : [],
        totalRecord: 0
      })
      setLeaseReportPopup(true)
    } catch {
      setLeaseReport({
        ...leaseReport,
        loading: false
      })
    }

  }


  const handleExport = () => {
    handleExcelExport({
      payload: leaseReport.data,
      columnMapping: leaseReportExcelCol,
      workSheetName: "Leases Report",
      fileName: "Report"
    })
  }

  return (
    <div>
      <LoadingSpinner isLoading={leaseReport.loading} />

      <GeneralFilter
        onApplyFilter={(filterModal) => allLeaseReport(filterModal)}
        leaseSelection={false}
      />
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

      <CustomModal
        mainContent={
          <div>
            <div className='text-right'>
              <button
                onClick={handleExport}
                type="button"
                className={" py-2 px-3 mb-2 text-sm font-sm text-white focus:outline-none bg-green-600  rounded-sm border border-gray-200 hover:bg-green-700 hover:text-white "}>
                Export <i class="fa fa-download ml-2"></i>
              </button>
            </div>
            <Tables
              data={leaseReport?.data || []}
              columns={leaseReportCol}
              calcHeight="150px"
              isLoading={leaseReport.loading}
              totalRecord={leaseReport.totalRecord}
              getPaginatedData={getLeases}
              pagination={false}
            />
          </div>
        }
        modalTitle={"Leases Report"}
        openModal={leaseReportPopup}
        closeModal={() => {
          setLeaseReportPopup(false)
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
