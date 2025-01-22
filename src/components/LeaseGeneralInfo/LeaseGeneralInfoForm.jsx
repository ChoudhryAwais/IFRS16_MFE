import React, { useEffect, useState } from 'react'
import { addNewLease } from '../../apis/Cruds/LeaseData';
import { SwalPopup } from '../../middlewares/SwalPopup/SwalPopup';
import { statusCodeMessage } from '../../utils/enums/statusCode';
import { LoadingSpinner } from '../LoadingBar/LoadingBar';
import { useNavigate } from 'react-router-dom';
import { getCompanyProfile, getUserInfo } from '../../apis/Cruds/sessionCrud';
import { allowDecimalNumbers } from '../../helper/allowDecimalNum';

export default function LeaseGeneralInfoForm({ otherTabs, increment }) {
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()
    const { leaseTypes } = getCompanyProfile()
    const [incrementalFrequency, setincrementalFrequency] = useState([])
    const frequencies = leaseTypes.split(",").map(item => item.trim().toLowerCase())
    const [formData, setFormData] = useState({
        leaseId: 0,
        leaseName: '',
        rental: '',
        commencementDate: '',
        endDate: '',
        annuity: 'advance',
        ibr: '',
        frequency: 'annual',
        idc: null,
        grv: null,
        increment: null,
        incrementalFrequency: 'annual'
    });
    const handleChange = (e) => {
        const { name, value } = e.target;
        const newValue = !isNaN(value) ? (parseInt(value) || value) : value
        setFormData((prevData) => ({
            ...prevData,
            [name]: newValue,
        }));
    };
    const handleNumericChange = (e) => {
        const { name, value } = e.target;
        const inputValue = allowDecimalNumbers(value)
        setFormData((prevData) => ({
            ...prevData,
            [name]: inputValue,
        }));
    }
    // validate the form 
    const handleValidateForm = () => {
        if (otherTabs) {
            if (formData.idc === null || formData.idc === '' || formData.grv === '' || formData.grv === null)
                return true
        }
        if (increment) {
            if (formData.increment === null || formData.increment === '')
                return true
        }
        if (
            (formData.leaseName === '' ||
                formData.rental === '' ||
                formData.commencementDate === '' ||
                formData.endDate === '' ||
                formData.ibr === '')

        ) {
            return true
        }
        return false
    }
    // Submit the new lease along with initialRecognition, LeaseLiability, ROUSchedule Table
    const submitLease = async () => {
        const userInfo = getUserInfo()
        const companyProfile = getCompanyProfile()
        const leaseModal =
        {
            ...formData,
            userID: userInfo.userID,
            companyID: companyProfile.companyID
        }
        setLoading(true)
        try {
            const leaseResponse = await addNewLease(leaseModal)
            if (leaseResponse?.leaseId) {
                setLoading(false)
                SwalPopup(
                    "Lease Added",
                    statusCodeMessage.leaseAdded,
                    "success",
                    () => navigate("/IFRS16Accounting")
                )
            } else {
                setLoading(false)
            }
        } catch {
            setLoading(false)
            SwalPopup(
                "Try again",
                statusCodeMessage.somethingWentWrong,
                "error"
            )
        }
    }
    useEffect(() => {
        setFormData({
            ...formData,
            leaseId: 0,
            leaseName: '',
            rental: '',
            commencementDate: '',
            endDate: '',
            annuity: 'advance',
            ibr: '',
            frequency: 'annual',
            idc: null,
            grv: null,
            increment: null
        })
    }, [otherTabs, increment])

    useEffect(() => {
        const indexOfFrequency = frequencies.indexOf(formData.frequency)
        const incrementFreq = frequencies.filter((_, i) => i <= indexOfFrequency)
        setincrementalFrequency(incrementFreq)
        setFormData({
            ...formData,
            incrementalFrequency: "annual"
        })
    }, [formData.frequency])

    return (
        <React.Fragment>
            <LoadingSpinner isLoading={loading} />
            <form className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-white p-4 pb-7 shadow-md rounded-lg">
                {/* Lease Name */}
                <div>
                    <label htmlFor="leaseName" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                        Lease Name
                    </label>
                    <small className="text-gray-500 block mb-1">Enter the lease name.</small>
                    <input
                        type="text"
                        id="leaseName"
                        name="leaseName"
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        placeholder="Enter the lease name"
                        value={formData.leaseName}
                        onChange={handleChange}
                    />
                </div>
                {/* Rental */}
                <div>
                    <label htmlFor="rental" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                        Rental
                    </label>
                    <small className="text-gray-500 block mb-1">Enter the rental amount.</small>
                    <input
                        type="text"
                        id="rental"
                        name="rental"
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        placeholder="Enter rental amount"
                        value={formData.rental}
                        onChange={handleNumericChange}
                    />
                </div>
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
                        value={formData.commencementDate}
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
                        value={formData.endDate}
                        onChange={handleChange}
                    />
                </div>
                {/* Annuity */}
                <div>
                    <label htmlFor="annuity" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                        Annuity
                    </label>
                    <small className="text-gray-500 block mb-1">Choose annuity type.</small>
                    <select
                        id="annuity"
                        name="annuity"
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        value={formData.annuity}
                        onChange={handleChange}
                    >
                        <option value="advance">Advance</option>
                        <option value="arrears">Arrears</option>
                    </select>
                </div>
                {/* IBR */}
                <div>
                    <label htmlFor="ibr" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                        IBR
                    </label>
                    <small className="text-gray-500 block mb-1">Enter the IBR value in %.</small>
                    <input
                        type="text"
                        id="ibr"
                        name="ibr"
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        placeholder="Enter IBR value"
                        value={formData.ibr}
                        onChange={handleNumericChange}
                    />
                </div>
                {/* Frequency */}
                <div>
                    <label htmlFor="frequency" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                        Frequency
                    </label>
                    <small className="text-gray-500 block mb-1">Choose the frequency type.</small>
                    <select
                        id="frequency"
                        name="frequency"
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        value={formData.frequency}
                        onChange={handleChange}
                    >
                        {frequencies.map(freq => {
                            return (
                                <option value={freq}>{freq.replace(/\b\w/g, (char) => char.toUpperCase())}</option>
                            )
                        })}
                    </select>
                </div>
                {otherTabs ?
                    <React.Fragment>
                        {/* IDC */}
                        <div>
                            <label htmlFor="idc" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                Initial Direct Cost
                            </label>
                            <small className="text-gray-500 block mb-1">Enter the IDC amount.</small>
                            <input
                                type="text"
                                id="idc"
                                name="idc"
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                placeholder="Enter IDC amount"
                                value={formData.idc || ""}
                                onChange={handleChange}
                            />
                        </div>
                        {/* Guaranteed Residual Value */}
                        <div>
                            <label htmlFor="grv" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                Guaranteed Residual Value
                            </label>
                            <small className="text-gray-500 block mb-1">Enter the GRV amount.</small>
                            <input
                                type="text"
                                id="grv"
                                name="grv"
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                placeholder="Enter GRV amount"
                                value={formData.grv || ""}
                                onChange={handleChange}
                            />
                        </div>
                    </React.Fragment>
                    : increment ?
                        <React.Fragment>
                            {/* Increment Amount or Percentage*/}
                            <div>
                                <label htmlFor="increment" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                    Incremental Amount
                                </label>
                                <small className="text-gray-500 block mb-1">Enter the Incremental Amount.</small>
                                <input
                                    type="text"
                                    id="increment"
                                    name="increment"
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                    placeholder="Enter Incremental amount"
                                    value={formData.increment || ""}
                                    onChange={handleChange}
                                />
                            </div>
                            {/* Incremental Frequency */}
                            <div>
                                <label htmlFor="frequency" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                    Incremental Frequency
                                </label>
                                <small className="text-gray-500 block mb-1">Choose the frequency type.</small>
                                <select
                                    id="incrementalFrequency"
                                    name="incrementalFrequency"
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                    value={formData.incrementalFrequency}
                                    onChange={handleChange}
                                >
                                    {incrementalFrequency?.map(freq => {
                                        return (
                                            <option value={freq}>{freq.replace(/\b\w/g, (char) => char.toUpperCase())}</option>
                                        )
                                    })}
                                </select>
                            </div>
                        </React.Fragment>
                        : null
                }
            </form>
            <button
                disabled={handleValidateForm()}
                onClick={submitLease}
                type="button"
                className={(handleValidateForm() ? "cursor-no-drop" : " ") + " py-2.5 mt-3 px-5 me-2 mb-2 text-sm w-full font-medium text-white focus:outline-none bg-green-400 rounded-lg border border-gray-200 hover:bg-green-500 hover:text-white "}>
                Submit
            </button>
        </React.Fragment>
    )
}
