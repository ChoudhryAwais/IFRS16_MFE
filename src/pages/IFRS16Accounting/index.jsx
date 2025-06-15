import React, { useEffect, useState } from 'react'
import Tables from '../../components/Tables/Tables'
import { deleteLeases, getAllLeases } from '../../apis/Cruds/LeaseData'
import { leaseCols } from '../../utils/tableCols/tableCols'
import { CustomModal } from '../../components/common/commonModal'
import LeaseDetail from '../Leases/LeaseDetail'
import { GeneralFilter } from '../../components/FilterBox/GeneralFilter'
import { sessionVariable } from '../../utils/enums/sessionStorage'
import { removeSessionStorageVariable, setSessionStorage } from '../../apis/Cruds/sessionCrud'
import { getAllLeaseReport, getJournalEntryReport } from '../../apis/Cruds/Report'
import { LoadingSpinner } from '../../components/LoadingBar/LoadingBar'
import { statusCodeMessage } from '../../utils/enums/statusCode'
import { ConfirmationSwalPopup, SwalPopup } from '../../middlewares/SwalPopup/SwalPopup';
import { CollapsibleFilterBox } from '../../components/FilterBox/FilterBox'
import Reports from './Reports'
import { getDisclosureMaturityReport, getDisclosureReport } from '../../apis/Cruds/Disclosure'
import Disclosure from './Disclosure'
import { DisclosureMaturity, LLDisclosure, ROUDisclosure } from '../../utils/enums/disclosure'


export default function IFRS16Accounting() {
  const [loader, setloader] = useState(false)
  const [selectedRows, setSelectedRows] = useState([]); // State to manage selected rows
  const [report, setReport] = useState({
    leaseReport: [],
    jeReport: [],
    loading: false,
    totalRecord: null,
  })
  const [disclosureData, setDisclosureData] = useState({
    data: [],
    loading: false,
    totalRecord: null,
  })
  const [filterModal, setFilterModal] = useState({})
  const [allLeases, setAllLeases] = useState({
    data: [],
    totalRecord: null,
    loading: false
  })
  const [leasePopup, setLeasePopup] = useState(false)
  const [leaseReportPopup, setLeaseReportPopup] = useState(false)
  const [disclosureReportPopup, setDisclosureReportPopup] = useState(false)
  const [selectedLease, setSelectedLease] = useState(null)

  useEffect(() => {
    getLeases(1, 10)
  }, [])

  const getLeases = async (pageNumber, pageSize) => {
    setAllLeases({
      ...allLeases,
      loading: true
    })
    setloader(true)
    const response = await getAllLeases(pageNumber, pageSize)
    setAllLeases({
      ...allLeases,
      loading: false,
      data: response.data,
      totalRecord: response.totalRecords
    })
    setloader(false)
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
    setFilterModal(filterModal)
    setReport({
      ...report,
      loading: true
    })
    try {
      const response = await getAllLeaseReport(filterModal)
      const jeResponse = await getJournalEntryReport(filterModal)
      setReport({
        ...report,
        loading: false,
        leaseReport: response.length > 0 ? response : [],
        jeReport: jeResponse.length > 0 ? jeResponse : [],
        totalRecord: 0
      })
      setLeaseReportPopup(true)
    } catch {
      setReport({
        ...report,
        loading: false
      })
    }

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
      console.log(selectedRows)
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
    if (response?.status === 200) {
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
  const handleConfirmDelete = () => {
    ConfirmationSwalPopup(
      "Are you sure?",
      statusCodeMessage.deleteConfirm,
      "warning",
      statusCodeMessage.yesDelete,
      () => handleDeleteLeases()
    )
  }

  const handleDisclosure = async (filterModal) => {
    setFilterModal(filterModal)
    setDisclosureData({
      ...disclosureData,
      loading: true
    })
    try {
      const disclosureResp = await getDisclosureReport(filterModal)
      const disclosureMaturityResp = await getDisclosureMaturityReport(filterModal)

      if (disclosureResp?.openingLL !== undefined & disclosureMaturityResp.length > 0) {
        const rouDisclousre = Object.keys(ROUDisclosure).map((key) => {
          return { label: ROUDisclosure[key], value: disclosureResp[key] }
        })
        const llDisclousre = Object.keys(LLDisclosure).map((key) => {
          return { label: LLDisclosure[key], value: disclosureResp[key] }
        })
        const disclousreMaturity = Object.keys(DisclosureMaturity).map((key) => {
          return { label: DisclosureMaturity[key], value: (disclosureMaturityResp[0] || "")[key] }
        })
        setDisclosureData({
          ...disclosureData,
          loading: false,
          data: {
            rouDisclousre: rouDisclousre,
            llDisclousre: llDisclousre,
            maturityAnalysis: disclousreMaturity 
          },
          totalRecord: 0
        })
        setDisclosureReportPopup(true)
      }
    } catch {
      setDisclosureData({
        ...disclosureData,
        loading: false
      })
    }
  }
  return (
    <div>
      {/* This loader is for lease report */}
      <LoadingSpinner isLoading={report.loading || loader || disclosureData.loading} />
      {/* This modal is diclosure report */}
      <CustomModal
        mainContent={
          <Disclosure disclosureData={disclosureData} filterModal={filterModal} />
        }
        modalTitle={"Disclosure"}
        openModal={disclosureReportPopup}
        closeModal={() => {
          setDisclosureReportPopup(false)
        }}
      />
      {/* This modal is for lease report */}
      <CustomModal
        mainContent={
          <Reports report={report} filterModal={filterModal} />
        }
        modalTitle={"Report"}
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
      <CollapsibleFilterBox heading="Report" >
        <GeneralFilter
          onApplyFilter={(filterModal) => allLeaseReport(filterModal)}
          showLeaseSelection={false}
          btnLabel="Generate Report"
          extraButtons={(handleValidation, filterModal) => {
            return (
              <button
                onClick={() => handleDisclosure(filterModal)}
                disabled={handleValidation()}
                type="button"
                className={(handleValidation() ? "cursor-no-drop" : " ") + " mt-3 px-3 mb-2 text-xs font-xs text-white focus:outline-none bg-yellow-700  rounded-sm border border-gray-200 hover:bg-yellow-800 hover:text-white "}>
                Generate Disclosure
              </button>
            )
          }
          }
        />
      </CollapsibleFilterBox>
      <div className='flex justify-end gap-1'>
        <div className="text-[10px] font-xs mt-3 ml-2 text-gray-600 dark:text-gray-200">
          {selectedRows.length === 0 ? "Select the Rows to perform the action" : "Selected Item: " + selectedRows.length}
        </div>
        <div className="text-right">
          <button
            disabled={selectedRows.length === 0}
            onClick={handleConfirmDelete}
            type="button"
            className={(selectedRows.length === 0 ? "cursor-no-drop" : " ") + " py-1 mt-1 px-2 mb-1 text-xs font-sm text-white focus:outline-none bg-red-600  rounded-sm border border-gray-200 hover:bg-red-700 hover:text-white "}>
            <i class="fa fa-trash"></i>
          </button>
        </div>
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
