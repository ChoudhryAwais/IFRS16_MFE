import React, { useEffect, useState } from 'react'
import Tables from '../../components/Tables/Tables'
import { deleteLeases, getAllLeases } from '../../apis/Cruds/LeaseData'
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
import { statusCodeMessage } from '../../utils/enums/statusCode'
import { SwalPopup } from '../../middlewares/SwalPopup/SwalPopup';


export default function IFRS16Accounting() {
  const [loader, setloader] = useState(false)
  const [selectedRows, setSelectedRows] = useState([]); // State to manage selected rows
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
  const handleSelectAll = (event, data) => {
    if (event.target.checked) {
      setSelectedRows(data.map(row => row.leaseId));
    } else {
      setSelectedRows([]);
    }
  };
  const handleSelectRow = (event, rowId) => {
    event.stopPropagation(); // Stop event propagation to prevent row click event
    if (event.target.checked) {
      setSelectedRows([...selectedRows, rowId]);
    } else {
      setSelectedRows(selectedRows.filter(id => id !== rowId));
    }
  };
  const handleDeleteLeases = async () => {
    setloader(true)
    const selectedRowsObj = {
      LeaseIds: selectedRows.join(",")
    }
    const response = await deleteLeases(selectedRowsObj)
    if (response?.status == 200) {
      setloader(false)
      SwalPopup(
        "Deleted",
        statusCodeMessage.leasesDeleted,
        "success",
        () => {
          getLeases(1, 10)
          setSelectedRows([])
        }
      )
      return
    }
    SwalPopup(
      "Something went wrong",
      statusCodeMessage.somethingWentWrong,
      "error"
    )
    setloader(false)
  }

  return (
    <div>
      {/* This loader is for lease report */}
      <LoadingSpinner isLoading={leaseReport.loading || loader} />
      {/* This modal is for lease report */}
      <CustomModal
        mainContent={
          <div>
            <div className='text-right'>
              {leaseReport?.data.length !== 0 ?
                <button
                  onClick={handleExport}
                  type="button"
                  className={" py-2 px-3 mb-2 text-sm font-sm text-white focus:outline-none bg-green-600  rounded-sm border border-gray-200 hover:bg-green-700 hover:text-white "}
                  disabled={leaseReport?.data.length == 0}
                >
                  Export <i class="fa fa-download ml-2"></i>
                </button> : null}
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
      {/* This modal is for lease detail which include IR,LL,ROU... */}
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
      <GeneralFilter
        onApplyFilter={(filterModal) => allLeaseReport(filterModal)}
        leaseSelection={false}
      />
      <div className="text-right">
        <button
          disabled={selectedRows.length == 0}
          onClick={handleDeleteLeases}
          type="button"
          className={(selectedRows.length == 0 ? "cursor-no-drop" : " ") + " py-2 mt-1 px-3 mb-1 text-xs font-sm text-white focus:outline-none bg-red-600  rounded-sm border border-gray-200 hover:bg-red-700 hover:text-white "}>
          <i class="fa fa-trash"></i>
        </button>
      </div>
      <Tables
        extandedTableFunc={extandedTableFunc}
        data={allLeases?.data || []}
        columns={leaseCols}
        calcHeight="170px"
        isLoading={allLeases.loading}
        totalRecord={allLeases.totalRecord}
        getPaginatedData={getLeases}
        selectableRows={true}
        selectableRowsFunc={handleSelectRow}
        selectableAllRowsFunc={handleSelectAll}
        selectItem="leaseId"
        selectedRows={selectedRows}
      />
    </div>
  )
}
