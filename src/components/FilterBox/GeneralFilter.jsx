import React, { useEffect, useState } from "react";
import { getAllLeasesforCompany } from "../../apis/Cruds/LeaseData";
import MultiSelectDropdown from "../MultiSelect/MultiSelect";

export const GeneralFilter = ({ onApplyFilter, showLeaseSelection, btnLabel, callBackReset }) => {
    const [filterModal, setFilterModal] = useState({
        startDate: '',
        endDate: '',
        leaseIdList: ''
    })
    const [allLeases, setAllLeases] = useState({
        data: [],
        loading: false
    })
    useEffect(() => {
        const getLeasesForCompany = async () => {
            if (!showLeaseSelection)
                return
            setAllLeases({
                ...allLeases,
                loading: true
            })
            const leases = []
            const response = await getAllLeasesforCompany()
            if (response.length > 0) {
                response.forEach(element => {
                    leases.push({ value: element.leaseId, label: element.leaseName },)
                });
            }
            setAllLeases({
                ...allLeases,
                loading: false,
                data: leases
            })
        }
        getLeasesForCompany()
    }, [])
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFilterModal((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };
    // validate the form 
    const handleValidateForm = () => {
        if (filterModal.startDate === "" || filterModal.endDate === '' || (showLeaseSelection && filterModal.leaseIdList === ''))
            return true
        return false
    }

    const handleDatesOnBlur = (e) => {
        const { name, value } = e.target;
        let newValue = value
        if (name === "startDate" && filterModal.endDate && value > filterModal.endDate) {
            newValue = ""
        }
        if (name === "endDate" && filterModal.startDate && value < filterModal.startDate) {
            newValue = ""
        }
        setFilterModal({
            ...filterModal,
            [name]: newValue
        });
    };

    const handleRestore = () => {
        if (typeof callBackReset === "function")
            callBackReset()
        setFilterModal({
            ...filterModal,
            startDate: "",
            endDate: "",
            leaseIdList: ""
        });
    }
    const handleLeaseSelect = (value) => {
        const leasesId = value?.map(item => item.value).join(",")
        setFilterModal({
            ...filterModal,
            leaseIdList: leasesId
        })
    }
    return (

        <div className='bg-white'>

            {showLeaseSelection ?
                <MultiSelectDropdown
                    options={allLeases.data}
                    handleChange={(value) => handleLeaseSelect(value)}
                /> : null}

            <div className={`grid grid-cols-1 md:grid-cols-2 gap-6 ${showLeaseSelection ? "mt-4" : ""}`}>
                {/* Commencement Date */}
                <div>
                    <label htmlFor="startDate" className="block mb-1 pl-1 text-xs font-medium text-gray-900 dark:text-white">
                        Start Date
                    </label>
                    <input
                        type="date"
                        id="startDate"
                        name="startDate"
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-xs rounded-sm focus:ring-blue-500 focus:border-blue-500 block w-full py-1 px-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        value={filterModal.startDate}
                        onChange={handleChange}
                        max={filterModal.endDate}
                        onBlur={handleDatesOnBlur}
                    />
                </div>
                {/* End Date */}
                <div>
                    <label htmlFor="endDate" className="block mb-1 text-xs pl-1 font-medium text-gray-900 dark:text-white">
                        End Date
                    </label>
                    <input
                        type="date"
                        id="endDate"
                        name="endDate"
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-xs rounded-sm focus:ring-blue-500 focus:border-blue-500 block w-full py-1 px-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        value={filterModal.endDate}
                        onChange={handleChange}
                        min={filterModal.startDate}
                        disabled={filterModal.startDate == ""}
                        onBlur={handleDatesOnBlur}
                    />
                </div>
            </div>
            <div className="flex justify-end">
                <button
                    onClick={handleRestore}
                    type="button"
                    className={"py-2 mt-3 me-1 px-3 mb-2 text-xs font-xs text-white focus:outline-none bg-gray-800 hover:bg-gray-900  rounded-sm border border-gray-200 hover:text-white "}>
                    Restore Default
                </button>
                <button
                    disabled={handleValidateForm()}
                    onClick={() => onApplyFilter(filterModal)}
                    type="button"
                    className={(handleValidateForm() ? "cursor-no-drop" : " ") + " mt-3 px-3 mb-2 text-xs font-xs text-white focus:outline-none bg-indigo-600  rounded-sm border border-gray-200 hover:bg-indigo-700 hover:text-white "}>
                    {btnLabel}
                </button>
            </div>
        </div>
    );
};