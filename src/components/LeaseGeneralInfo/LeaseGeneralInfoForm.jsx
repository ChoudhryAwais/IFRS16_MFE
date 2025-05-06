import React, { useEffect, useState } from 'react'
import { addNewLease, modifyLease } from '../../apis/Cruds/LeaseData';
import { ConfirmationSwalPopup, SwalPopup } from '../../middlewares/SwalPopup/SwalPopup';
import { statusCodeMessage } from '../../utils/enums/statusCode';
import { LoadingSpinner } from '../LoadingBar/LoadingBar';
import { useNavigate } from 'react-router-dom';
import { getCompanyProfile, getSelectLease, getUserInfo } from '../../apis/Cruds/sessionCrud';
import { allowDecimalNumbers } from '../../helper/checkForAllowVal';
import { getAllCurrencies } from '../../apis/Cruds/Currencies';
import CommonButton from '../common/commonButton';
import { formatDateForInput } from '../../helper/FormateValues';
import Switch from '../common/switchButton';
import IrregularLease from './IrregularLease';
import { handleExcelExport } from '../../utils/exportService/excelExportService';
import { leaseIRTemp } from '../../utils/ExportsTemplate/exportsTemplate';

export default function LeaseGeneralInfoForm({ otherTabs, increment }) {
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()
    const { leaseTypes, assetType } = getCompanyProfile()
    const [incrementalFrequency, setincrementalFrequency] = useState([])
    const [currencies, setCurrencies] = useState([])
    const [customSchedule, setCustomSchedule] = useState(false)
    const activeLease = getSelectLease()

    const frequencies = leaseTypes.split(",").map(item => item.trim().toLowerCase())
    const assetTypesValues = assetType.split(",").map(item => item.trim())
    const [formData, setFormData] = useState({
        leaseId: activeLease?.leaseId || 0,
        leaseName: activeLease?.leaseName || '',
        rental: activeLease?.rental || '',
        commencementDate: formatDateForInput(activeLease?.commencementDate) || '',
        lastModifiedDate: null,
        endDate: formatDateForInput(activeLease?.endDate) || '',
        annuity: activeLease?.annuity || 'advance',
        ibr: activeLease?.ibr || '',
        frequency: activeLease?.frequency || frequencies[0],
        idc: activeLease?.idc || null,
        grv: activeLease?.grv || null,
        increment: activeLease?.increment || null,
        incrementalFrequency: activeLease?.incrementalFrequency || frequencies[0],
        currencyID: activeLease?.currencyID || "",
        isActive: true,
        rouOpening: null,
        llOpening: null,
        isChangeInScope: false,
        assetType: activeLease?.assetType || assetTypesValues[0],
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
        if (formData.isChangeInScope) {
            if (formData.rouOpening === null || formData.rouOpening === '' || formData.llOpening === null || formData.llOpening === '')
                return true
        }
        if (activeLease?.leaseId) {
            if (formData.lastModifiedDate === null || formData.lastModifiedDate === '')
                return true
        }
        if (
            (formData.leaseName === '' ||
                formData.rental === '' ||
                formData.commencementDate === '' ||
                formData.endDate === '' ||
                formData.ibr === '' ||
                formData.currencyID === '')

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
            idc: null,
            grv: null,
            increment: null,
            incrementalFrequency: 'annual',
        })
    }, [otherTabs, increment])

    useEffect(() => {
        const indexOfFrequency = frequencies.indexOf(formData.frequency)
        const incrementFreq = frequencies.filter((_, i) => i <= indexOfFrequency)
        setincrementalFrequency(incrementFreq)
        setFormData({
            ...formData,
            incrementalFrequency: frequencies[0] // Set the first frequency as default which is annual
        })
    }, [formData.frequency])

    useEffect(() => {
        const getCurrency = async () => {
            const allCurrenciesRes = await getAllCurrencies()
            if (allCurrenciesRes.length)
                setCurrencies(allCurrenciesRes)
        }
        getCurrency()
        if (activeLease?.leaseId != undefined) {
            setCustomSchedule(true)
        }
    }, [])
    // handle dates 
    const handleDatesOnBlur = (e) => {
        const { name, value } = e.target;
        let newValue = value
        if (name === "commencementDate" && formData.endDate && value > formData.endDate) {
            newValue = ""
        }
        if (name === "endDate" && formData.commencementDate && value < formData.commencementDate) {
            newValue = ""
        }
        setFormData({
            ...formData,
            [name]: newValue
        });
    };
    const handleCustomSchedule = (bit) => {
        setCustomSchedule(bit)
        setFormData({
            ...formData,
            rental: '',
            commencementDate: '',
            endDate: '',
        })
        if (bit) {
            ConfirmationSwalPopup(
                "Download Template?",
                statusCodeMessage.download,
                "warning",
                statusCodeMessage.yes,
                () => handleDownloadTemp()
            )
        }
    }
    const handleDownloadTemp = () => {
        handleExcelExport({ payload: leaseIRTemp, workSheetName: "Schedule", fileName: "ScheduleTemplate" })
    };
    const handleIRTable = (uploadData) => {
        setFormData((prevData) => ({
            ...prevData,
            commencementDate: uploadData.commencementDate,
            endDate: uploadData.endDate,
            rental: uploadData.rental,
            customIRTable: uploadData.customIRTable,
        }));
    }
    const handleModification = async () => {
        const userInfo = getUserInfo()
        const companyProfile = getCompanyProfile()
        const leaseModal =
        {
            ...formData,
            userID: userInfo.userID,
            companyID: companyProfile.companyID,
            commencementDate: formData.lastModifiedDate
        }
        setLoading(true)
        const leaseModifyResponse = await modifyLease(leaseModal)
        if (leaseModifyResponse?.leaseId) {
            setLoading(false)
            SwalPopup(
                "Lease Modified",
                statusCodeMessage.leaseModified,
                "success",
                () => navigate("/IFRS16Accounting")
            )
        } else {
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
            <div>
                <div className='flex justify-end mb-5 mx-2 gap-2'>
                    {activeLease?.leaseId ?
                        <div className='me-3'>
                            <Switch
                                label="CHANGE IN SCOPE"
                                onChange={() => setFormData({
                                    ...formData,
                                    isChangeInScope: !formData.isChangeInScope
                                })}
                                isOpen={formData.isChangeInScope}
                            />
                        </div>
                        : null
                    }
                    <Switch
                        label="CUSTOM SCHEDULE"
                        onChange={handleCustomSchedule}
                        isDisabled={activeLease?.leaseId ? true : false}
                        isOpen={activeLease?.leaseId ? true : false}
                    />
                </div>
                <form className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-white dark:bg-gray-800 p-4 pb-7 shadow-md rounded-lg">
                    {
                        customSchedule &&
                        <div className='border p-2'>
                            <IrregularLease handleIRTable={handleIRTable} />
                        </div>
                    }
                    {/* Lease Name */}
                    <div>
                        <label htmlFor="leaseName" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                            Lease ID
                        </label>
                        <small className="text-gray-500 block mb-1 dark:text-gray-200 ">Enter the lease ID</small>
                        <input
                            disabled={activeLease?.leaseName ? true : false}
                            type="text"
                            id="leaseName"
                            name="leaseName"
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-sm focus:ring-blue-500 focus:border-blue-500 block w-full px-2.5 py-1.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            placeholder="Enter the lease ID"
                            value={formData.leaseName}
                            onChange={handleChange}
                        />
                    </div>
                    {/* Rental */}
                    {!customSchedule ?
                        <div>
                            <label htmlFor="rental" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                Rental
                            </label>
                            <small className="text-gray-500 block mb-1 dark:text-gray-200">Enter the rental amount</small>
                            <input
                                type="text"
                                id="rental"
                                name="rental"
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-sm focus:ring-blue-500 focus:border-blue-500 block w-full px-2.5 py-1.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                placeholder="Enter rental amount"
                                value={formData.rental}
                                onChange={handleNumericChange}
                            />
                        </div> : null
                    }
                    {/* Modification Date */}
                    {activeLease?.leaseId ? <div>
                        <label htmlFor="lastModifiedDate" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                            Modification Date
                        </label>
                        <small className="text-gray-500 block mb-1 dark:text-gray-200">Select the lease Modification date</small>
                        <input
                            type="date"
                            id="lastModifiedDate"
                            name="lastModifiedDate"
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-sm focus:ring-blue-500 focus:border-blue-500 block w-full px-2.5 py-1.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            value={formData.lastModifiedDate}
                            onChange={handleChange}
                            max={formData.endDate}
                            onBlur={handleDatesOnBlur}
                        />
                    </div> : null}
                    {/* Commencement Date */}
                    {!activeLease?.leaseId ?
                        <div>
                            <label htmlFor="commencementDate" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                Commencement Date
                            </label>
                            <small className="text-gray-500 block mb-1 dark:text-gray-200">Select the lease commencement  date</small>
                            <input
                                type="date"
                                id="commencementDate"
                                name="commencementDate"
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-sm focus:ring-blue-500 focus:border-blue-500 block w-full px-2.5 py-1.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                value={formData.commencementDate}
                                onChange={handleChange}
                                max={formData.endDate}
                                onBlur={handleDatesOnBlur}
                            />
                        </div> : null}

                    {/* End Date */}
                    <div>
                        <label htmlFor="endDate" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                            End Date
                        </label>
                        <small className="text-gray-500 block mb-1 dark:text-gray-200">Select the lease end date</small>
                        <input
                            type="date"
                            id="endDate"
                            name="endDate"
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-sm focus:ring-blue-500 focus:border-blue-500 block w-full px-2.5 py-1.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            value={formData.endDate}
                            onChange={handleChange}
                            min={formData.commencementDate}
                            onBlur={handleDatesOnBlur}
                            disabled={formData.commencementDate == ""}
                        />
                    </div>
                    {/* Change in Scope */}
                    {formData.isChangeInScope ?
                        <>
                            <div>
                                <label htmlFor="rouOpening" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                    ROU Opening
                                </label>
                                <small className="text-gray-500 block mb-1 dark:text-gray-200">Enter Opening amount</small>
                                <input
                                    type="text"
                                    id="rouOpening"
                                    name="rouOpening"
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-sm focus:ring-blue-500 focus:border-blue-500 block w-full px-2.5 py-1.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                    placeholder="Enter Opening amount"
                                    value={formData.rouOpening}
                                    onChange={handleNumericChange}
                                />
                            </div>
                            <div>
                                <label htmlFor="rouOpening" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                    Lease Liability Opening
                                </label>
                                <small className="text-gray-500 block mb-1 dark:text-gray-200">Enter Opening amount</small>
                                <input
                                    type="text"
                                    id="llOpening"
                                    name="llOpening"
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-sm focus:ring-blue-500 focus:border-blue-500 block w-full px-2.5 py-1.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                    placeholder="Enter Opening amount"
                                    value={formData.llOpening}
                                    onChange={handleNumericChange}
                                />
                            </div>
                        </>
                        : null}
                    {/* Annuity */}
                    <div>
                        <label htmlFor="annuity" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                            Annuity
                        </label>
                        <small className="text-gray-500 block mb-1 dark:text-gray-200">Choose annuity type</small>
                        <select
                            id="annuity"
                            name="annuity"
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-sm focus:ring-blue-500 focus:border-blue-500 block w-full px-2.5 py-1.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
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
                            Interest Rate Implicit in the Lease
                        </label>
                        <small className="text-gray-500 block mb-1 dark:text-gray-200">Enter the Interest Rate Implicit in the Lease, if not available use lessee's incremental borrowing rate in %</small>
                        <input
                            type="text"
                            id="ibr"
                            name="ibr"
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-sm focus:ring-blue-500 focus:border-blue-500 block w-full px-2.5 py-1.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            placeholder="Enter IBR value"
                            value={formData.ibr}
                            onChange={handleNumericChange}
                        />
                    </div>
                    {/* Frequency */}
                    <div>
                        <label htmlFor="frequency" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                            Payment Frequency
                        </label>
                        <small className="text-gray-500 block mb-1 dark:text-gray-200">Choose the payment frequency type</small>
                        <select
                            id="frequency"
                            name="frequency"
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-sm focus:ring-blue-500 focus:border-blue-500 block w-full px-2.5 py-1.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            value={formData.frequency}
                            onChange={handleChange}
                        >
                            {frequencies.map((freq, i) => {
                                return (
                                    <option key={i} value={freq}>{freq.replace(/\b\w/g, (char) => char.toUpperCase())}</option>
                                )
                            })}
                        </select>
                    </div>
                    {/* Currency */}
                    <div>
                        <label htmlFor="currency" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                            Currency
                        </label>
                        <small className="text-gray-500 block mb-1 dark:text-gray-200">Choose the lease Currency</small>
                        <select
                            id="currencyID"
                            name="currencyID"
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-sm focus:ring-blue-500 focus:border-blue-500 block w-full px-2.5 py-1.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            value={formData.currencyID}
                            onChange={handleChange}
                        >
                            <option value="">Select the currency</option>
                            {currencies.map((currency, i) => {
                                return (
                                    <option key={i} value={currency.currencyID}>{currency.currencyCode}</option>
                                )
                            })}
                        </select>
                    </div>
                    {/* AssetType */}
                    <div>
                        <label htmlFor="currency" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                            Asset Type
                        </label>
                        <small className="text-gray-500 block mb-1 dark:text-gray-200">Choose the lease Currency</small>
                        <select
                            id="assetType"
                            name="assetType"
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-sm focus:ring-blue-500 focus:border-blue-500 block w-full px-2.5 py-1.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            value={formData.assetType}
                            onChange={handleChange}
                        >
                            {assetTypesValues.map((type, i) => {
                                return (
                                    <option key={i} value={type}>{type}</option>
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
                                <small className="text-gray-500 block mb-1 dark:text-gray-200">Enter the IDC amount</small>
                                <input
                                    type="text"
                                    id="idc"
                                    name="idc"
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-sm focus:ring-blue-500 focus:border-blue-500 block w-full px-2.5 py-1.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
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
                                <small className="text-gray-500 block mb-1 dark:text-gray-200">Enter the GRV amount</small>
                                <input
                                    type="text"
                                    id="grv"
                                    name="grv"
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-sm focus:ring-blue-500 focus:border-blue-500 block w-full px-2.5 py-1.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
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
                                        Incremental Percentage
                                    </label>
                                    <small className="text-gray-500 block mb-1 dark:text-gray-200">Enter the Incremental Percentage</small>
                                    <input
                                        type="text"
                                        id="increment"
                                        name="increment"
                                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-sm focus:ring-blue-500 focus:border-blue-500 block w-full px-2.5 py-1.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                        placeholder="Enter Incremental value in %"
                                        value={formData.increment || ""}
                                        onChange={handleChange}
                                    />
                                </div>
                                {/* Incremental Frequency */}
                                <div>
                                    <label htmlFor="frequency" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                        Incremental Frequency
                                    </label>
                                    <small className="text-gray-500 block mb-1 dark:text-gray-200">Choose the frequency type</small>
                                    <select
                                        id="incrementalFrequency"
                                        name="incrementalFrequency"
                                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-sm focus:ring-blue-500 focus:border-blue-500 block w-full px-2.5 py-1.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                        value={formData.incrementalFrequency}
                                        onChange={handleChange}
                                    >
                                        {incrementalFrequency?.map((freq, i) => {
                                            return (
                                                <option key={i} value={freq}>{freq.replace(/\b\w/g, (char) => char.toUpperCase())}</option>
                                            )
                                        })}
                                    </select>
                                </div>
                            </React.Fragment>
                            : null
                    }
                </form>
                {(activeLease && activeLease?.leaseId != 0) ?
                    <CommonButton
                        handleValidateForm={handleValidateForm}
                        onSubmit={handleModification}
                        extandedClass={"bg-indigo-600 hover:bg-indigo-700 hover:text-white w-full mt-3"}
                        text="Modify"
                    /> :
                    <CommonButton
                        handleValidateForm={handleValidateForm}
                        onSubmit={submitLease}
                        extandedClass={"bg-indigo-600 hover:bg-indigo-700 hover:text-white w-full mt-3"}
                        text="Submit"
                    />
                }
            </div>
            {/* } */}


        </React.Fragment>
    )
}
