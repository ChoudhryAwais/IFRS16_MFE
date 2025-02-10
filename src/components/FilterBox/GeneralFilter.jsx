import React, { useEffect, useState } from "react";
import { CollapsibleFilterBox } from "./FilterBox";
import { getAllLeasesforCompany } from "../../apis/Cruds/LeaseData";
import Select from 'react-select'

export const GeneralFilter = ({ onApplyFilter }) => {
    const [filterModal, setfilterModal] = useState({
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
        setfilterModal((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };
    // validate the form 
    const handleValidateForm = () => {
        if (filterModal.startDate === "" || filterModal.endDate === '' || filterModal.leaseIdList === '')
            return true
        return false
    }
    const customStyles = {
        menu: (provided) => ({
            ...provided,
            maxHeight: "130px", // Limit height
            overflowY: "auto", // Enable scrolling
        }),
        menuList: (provided) => ({
            ...provided,
            maxHeight: "130px", // Apply height restriction here too
            overflowY: "auto", // Ensure scrolling works
        }),
    };
    return (
        <CollapsibleFilterBox>
            <div className='bg-white'>
                <div>
                    <label htmlFor="startDate" className="block mb-1 text-sm font-medium text-gray-900 dark:text-white">
                        Select Leases
                    </label>
                    <Select
                        name='leases'
                        options={allLeases.data}
                        isMulti
                        isDisabled={allLeases.loading}
                        closeMenuOnSelect={false}
                        onChange={(value) => {
                            const leasesId = value.map(item => item.value).join(",")
                            setfilterModal({
                                ...filterModal,
                                leaseIdList: leasesId
                            })
                        }}
                        styles={customStyles}
                    />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                    {/* Commencement Date */}
                    <div>
                        <label htmlFor="startDate" className="block mb-1 text-sm font-medium text-gray-900 dark:text-white">
                            Start Date
                        </label>
                        <input
                            type="date"
                            id="startDate"
                            name="startDate"
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-sm focus:ring-blue-500 focus:border-blue-500 block w-full py-1 px-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            value={filterModal.startDate}
                            onChange={handleChange}
                            max={filterModal.endDate}
                        />
                    </div>
                    {/* End Date */}
                    <div>
                        <label htmlFor="endDate" className="block mb-1 text-sm font-medium text-gray-900 dark:text-white">
                            End Date
                        </label>

                        <input
                            type="date"
                            id="endDate"
                            name="endDate"
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-sm focus:ring-blue-500 focus:border-blue-500 block w-full py-1 px-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            value={filterModal.endDate}
                            onChange={handleChange}
                            min={filterModal.startDate}
                        />
                    </div>
                </div>
                <div className="flex justify-end">
                    <button
                        disabled={handleValidateForm()}
                        onClick={() => onApplyFilter(filterModal)}
                        type="button"
                        className={(handleValidateForm() ? "cursor-no-drop" : " ") + " py-2.5 mt-5 px-5 me-2 mb-2 text-sm font-medium text-white focus:outline-none bg-indigo-600  rounded-lg border border-gray-200 hover:bg-indigo-700 hover:text-white "}>
                        Generate Report
                    </button>
                </div>
            </div>
        </CollapsibleFilterBox>
    );
};