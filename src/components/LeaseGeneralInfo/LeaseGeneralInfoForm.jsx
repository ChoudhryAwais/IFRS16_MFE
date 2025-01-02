import React, { useState } from 'react'
import { addNewLease } from '../../apis/Cruds/LeaseData';
import { SwalPopup } from '../../middlewares/SwalPopup/SwalPopup';
import { statusCodeMessage } from '../../utils/enums/statusCode';
import { LoadingSpinner } from '../LoadingBar/LoadingBar';
import { useNavigate } from 'react-router-dom';
import { getUserInfo } from '../../utils/SessionStorage/sessionCrud';
import { postInitialRecognitionForLease } from '../../apis/Cruds/InitialRecognition';
import { postRouScheduleForLease } from '../../apis/Cruds/RouSchedule';
import { postLeaseLiabilityForLease } from '../../apis/Cruds/LeaseLiability';

export default function LeaseGeneralInfoForm() {
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()
    const [formData, setFormData] = useState({
        leaseId: 0,
        leaseName: '',
        rental: '',
        commencementDate: '',
        endDate: '',
        annuity: 'advance',
        ibr: '',
        frequency: 'annual',
    });
    const handleChange = (e) => {
        const { name, value } = e.target;
        const newValue = !isNaN(value) ? (parseInt(value) || value) : value
        setFormData((prevData) => ({
            ...prevData,
            [name]: newValue,
        }));
    };
    // validate the form 
    const handleValidateForm = () => {
        if (
            formData.leaseName === '' ||
            formData.rental === '' ||
            formData.commencementDate === '' ||
            formData.endDate === '' ||
            formData.ibr === ''
        ) {
            return true
        }
        return false
    }
    // Submit the new lease along with initialRecognition, LeaseLiability, ROUSchedule Table
    const submitLease = async () => {
        const userInfo = getUserInfo()
        const leaseModal = { ...formData, userID: userInfo.userID }
        setLoading(true)
        try {
            const leaseResponse = await addNewLease(leaseModal)
            if (leaseResponse?.leaseId) {
                const initialRecognitionResponse = await postInitialRecognitionForLease(leaseResponse)
                if (initialRecognitionResponse.initialRecognition.length > 0) {
                    const requestModalForlease = {
                        totalNPV: initialRecognitionResponse?.totalNPV,
                        cashFlow: initialRecognitionResponse?.cashFlow,
                        dates: initialRecognitionResponse?.dates,
                        leaseData: leaseResponse,
                    }
                    const leaseLiabilityResponse = await postLeaseLiabilityForLease(requestModalForlease)
                    if (leaseLiabilityResponse == true) {
                        const requestModalForRou = {
                            leaseData: leaseResponse,
                            totalNPV: initialRecognitionResponse?.totalNPV,
                        }
                        const RouResponse = await postRouScheduleForLease(requestModalForRou)
                        setLoading(false)
                        if (RouResponse == true)
                            SwalPopup(
                                "Lease Added",
                                statusCodeMessage.userCreated,
                                "success",
                                () => navigate("/IFRS16Accounting")
                            )
                    }
                }
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
    return (
        <React.Fragment>
            <LoadingSpinner isLoading={loading} />
            <form className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-white p-4 shadow-md rounded-lg">
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
                        type="number"
                        id="rental"
                        name="rental"
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        placeholder="Enter rental amount"
                        value={formData.rental}
                        onChange={handleChange}
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
                    <small className="text-gray-500 block mb-1">Enter the IBR value.</small>
                    <input
                        type="number"
                        id="ibr"
                        name="ibr"
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        placeholder="Enter IBR value"
                        value={formData.ibr}
                        onChange={handleChange}
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
                        <option value="annual">Annual</option>
                        <option value="bi-annual">Bi Annual</option>
                        <option value="quarterly">Quarterly</option>
                        <option value="monthly">Monthly</option>
                    </select>
                </div>

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
