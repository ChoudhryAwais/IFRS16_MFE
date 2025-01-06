import React, { useEffect, useState } from 'react'
import Tables from '../../components/Tables/Tables'
import { getAllLeases } from '../../apis/Cruds/LeaseData'
import { leaseCols } from '../../utils/tableCols/tableCols'
import { CustomModal } from '../../components/CustomModal/CustomModal'
import LeaseDetail from '../Leases/LeaseDetail'
// import { CollapsibleFilterBox } from '../../components/FilterBox/FilterBox'

export default function IFRS16Accounting() {
  const [filterModal, setfilterModal] = useState({
    commencementDate: '',
    endDate: '',
  })
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setfilterModal((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

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
    setLeasePopup(true)
  }
  const extandedTableFunc = {
    callBack: (leaseData) => getLeaseDetail(leaseData)
  }

  const filterBoxContent = () => {
    return (
      <React.Fragment>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Commencement Date */}
          <div>
            <label htmlFor="commencementDate" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
              Commencement Date
            </label>
            <small className="text-gray-500 block mb-1">Select the start date.</small>
            <input
              type="date"
              id="commencementDate"
              name="commencementDate"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              value={filterModal.commencementDate}
              onChange={handleChange}
            />
          </div>
          {/* End Date */}
          <div>
            <label htmlFor="endDate" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
              End Date
            </label>
            <small className="text-gray-500 block mb-1">Select the end date.</small>
            <input
              type="date"
              id="endDate"
              name="endDate"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              value={filterModal.endDate}
              onChange={handleChange}
            />
          </div>
        </div>
        {/* Apply Filters Button */}
        <div className="text-right mt-3">
          <button
            className={"p-3 text-sm font-medium text-white focus:outline-none bg-green-500 rounded-lg border border-gray-200 hover:bg-green-600 hover:text-white "}>
            Apply Filter
          </button>
        </div>

      </React.Fragment>
    )
  }


  return (
    <div>
      {/* <CollapsibleFilterBox filterBoxContent={filterBoxContent} /> */}
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
        data={allLeases?.data || []}
        columns={leaseCols}
        calcHeight="45px"
        isLoading={allLeases.loading}
        totalRecord={allLeases.totalRecord}
        getPaginatedData={getLeases}
      />
    </div>
  )
}
