import React, { useState } from 'react'
import { addNewLease } from '../../apis/Cruds/LeaseData';
import { SwalPopup } from '../../middlewares/SwalPopup/SwalPopup';
import { statusCodeMessage } from '../../utils/enums/statusCode';
import { LoadingSpinner } from '../LoadingBar/LoadingBar';
import { useNavigate } from 'react-router-dom';
import { getUserInfo } from '../../utils/SessionStorage/sessionCrud';

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
    const CalculateTotalsYearsAndDays = () => {
        // Ensure both inputs are Date objects
        const start = new Date(formData.commencementDate);
        const end = new Date(formData.endDate);
        // Validate the dates
        if (isNaN(start.getTime()) || isNaN(end.getTime())) {
            throw new Error("Invalid date format. Use a valid date format like 'YYYY-MM-DD'.");
        }
        // Calculate the difference in time (milliseconds)
        const differenceInTime = end.getTime() - start.getTime();
        // Convert time difference to days (milliseconds to days)
        const differenceInDays = (differenceInTime / (1000 * 3600 * 24)) + 1;
        const totalYears = (differenceInDays / 365)
        return { totalYears, differenceInDays }
    }
    const formatDate = (newDate) => {
        // Format the new date as mm/dd/yyyy
        const month = (newDate.getMonth() + 1).toString().padStart(2, '0'); // Get month (1-based)
        const day = newDate.getDate().toString().padStart(2, '0'); // Get day
        const year = newDate.getFullYear(); // Get years

        return `${month}/${day}/${year}`
    }
    const formatDateForXirr = (newDate) => {
        // Format the new date as mm/dd/yyyy
        const month = (newDate.getMonth() + 1).toString().padStart(2, '0'); // Get month (1-based)
        const day = newDate.getDate().toString().padStart(2, '0'); // Get day
        const year = newDate.getFullYear(); // Get years

        return `${year}-${month}-${day}`
    }
    const initialRecognitionCalculation = () => {
        const { totalYears } = CalculateTotalsYearsAndDays()
        const startTable = formData.annuity === "advance" ? 0 : 1
        const endTable = formData.annuity === "advance" ? totalYears - 1 : totalYears
        const rental = parseInt(formData.rental)
        const IBR = parseInt(formData.ibr)
        const initialRecognition = []
        let totalNPV = 0
        const cashFlow = []
        const dates = []
        for (let i = startTable; i <= endTable; i++) {
            const NPV = (rental / Math.pow((1 + (IBR / 100)), i));
            const newDate = new Date(formData.commencementDate);
            newDate.setFullYear(newDate.getFullYear() + i);
            if (formData.annuity === "arrears")
                newDate.setDate(newDate.getDate() - 1);
            const formatedDate = formatDate(newDate)
            const formatedDateForXirr = formatDateForXirr(newDate)

            totalNPV += NPV
            const tableObj = {
                no: startTable == 0 ? i + 1 : i,
                paymentDate: formatedDate,
                rental: rental,
                npv: NPV
            }
            cashFlow.push(rental)
            dates.push(formatedDateForXirr)
            initialRecognition.push(tableObj)
        }
        cashFlow.unshift(-totalNPV)
        dates.unshift(formatDateForXirr(new Date(formData.commencementDate)))

        return { totalNPV, initialRecognition, cashFlow, dates }
    }
    const rouScheduleCal = (totalNPV) => {
        const { differenceInDays } = CalculateTotalsYearsAndDays()
        const ammortization = (((totalNPV / differenceInDays) + Number.EPSILON) * 100) / 100;
        let closing = (((totalNPV - ammortization) + Number.EPSILON) * 100) / 100;
        let opening = totalNPV
        const rouSchedule = []
        let formatedDate = formatDate(new Date(formData.commencementDate));

        for (let i = 1; i <= differenceInDays; i++) {
            const rouObj = {
                date: formatedDate,
                opening: opening,
                ammortization: ammortization,
                closing: closing
            }
            const newDate = new Date(formatedDate); // Create a new Date object from the input
            newDate.setDate(newDate.getDate() + 1); // Add one day to the current date
            formatedDate = formatDate(newDate)
            opening = closing
            closing = (((opening - ammortization) + Number.EPSILON) * 100) / 100;
            rouSchedule.push(rouObj)
        }
        return rouSchedule
    }
    const leaseLiabilityCal = (xirr, totalNPV, cashFlow, dates) => {
        const { differenceInDays } = CalculateTotalsYearsAndDays()
        const xirrDaily = Math.pow(1 + xirr, 1 / 365) - 1
        let opening = totalNPV
        let interest
        let closing
        cashFlow.shift()
        dates.shift()
        const newDate = new Date(formData.commencementDate);
        const leaseTable = []
        for (let i = 1; i <= differenceInDays; i++) {
            // Create a new Date object from the input
            const formatedDateForXirr = formatDateForXirr(newDate)
            let formatedDate = formatDate(newDate)

            let rental = 0
            if (dates.includes(formatedDateForXirr)) {
                const indexOfDate = dates.indexOf(formatedDateForXirr)
                rental = cashFlow[indexOfDate]
            }
            interest = (opening - rental) * xirrDaily
            closing = (opening + interest) - rental
            const tableObj = {
                date: formatedDate,
                opening,
                interest,
                payment: rental,
                closing,
            }

            newDate.setDate(newDate.getDate() + 1);
            opening = closing

            leaseTable.push(tableObj)
        }

        return leaseTable
    }
    function XIRR(cashFlows, dates, guess = 0.1) {
        if (cashFlows.length !== dates.length) {
            throw new Error("Cash flows and dates arrays must have the same length.");
        }

        // Convert dates to timestamps for calculation
        const times = dates.map((date) => new Date(date).getTime());

        // Helper function to calculate the XNPV
        const XNPV = (rate) => {
            const t0 = times[0]; // First date as the base date
            return cashFlows.reduce((sum, cf, i) => {
                const t = times[i];
                const diffInYears = (t - t0) / (1000 * 60 * 60 * 24 * 365); // Difference in years
                return sum + cf / Math.pow(1 + rate, diffInYears);
            }, 0);
        };

        // Helper function to calculate the derivative of XNPV (used for Newton-Raphson)
        const dXNPV = (rate) => {
            const t0 = times[0];
            return cashFlows.reduce((sum, cf, i) => {
                const t = times[i];
                const diffInYears = (t - t0) / (1000 * 60 * 60 * 24 * 365); // Difference in years
                return sum - (diffInYears * cf) / Math.pow(1 + rate, diffInYears + 1);
            }, 0);
        };

        // Newton-Raphson method to find the root (XIRR)
        let rate = guess;
        const maxIterations = 1000;
        const tolerance = 1e-6;

        for (let i = 0; i < maxIterations; i++) {
            const npv = XNPV(rate);
            const derivative = dXNPV(rate);

            if (Math.abs(npv) < tolerance) {
                return ((rate + Number.EPSILON)); // Return as percentage
            }

            if (Math.abs(derivative) < tolerance) {
                throw new Error("Derivative too small; Newton-Raphson method failed.");
            }

            rate -= npv / derivative;
        }

        throw new Error("Newton-Raphson method did not converge.");
    }
    const Calculate = () => {
        const { totalNPV, initialRecognition, cashFlow, dates } = initialRecognitionCalculation()
        const rouSchedule = rouScheduleCal(totalNPV)
        const xirr = XIRR(cashFlow, dates)
        const leaseLiability = leaseLiabilityCal(xirr, totalNPV, cashFlow, dates)
        const allLeases = JSON.parse(localStorage.getItem("allLeases") || "[]")
        const newLease = {
            leaseName: formData.leaseName,
            initialRecognition,
            rouSchedule,
            totalNPV,
            leaseLiability
        }
        allLeases.push(newLease)
        localStorage.setItem("allLeases", JSON.stringify(allLeases))
    }
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
    // Submit the new lease
    const submitLease = async () => {
        SwalPopup(
            "Lease Added",
            statusCodeMessage.userCreated,
            "success",
            () => navigate("/IFRS16Accounting")
        )
        const userInfo = getUserInfo()
        const leaseModal = { ...formData, userID: userInfo.userID }
        setLoading(true)
        const response = await addNewLease(leaseModal)
        setLoading(false)
        if (response?.leaseId) {
            SwalPopup(
                "Lease Added",
                statusCodeMessage.userCreated,
                "success",
                () => navigate("/IFRS16Accounting")
            )
        } else {
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
