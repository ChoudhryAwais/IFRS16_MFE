import { useState } from "react";
import CommonButton from "../../../components/common/commonButton";
import { LoadingSpinner } from "../../../components/LoadingBar/LoadingBar";
import { ConfirmationSwalPopup, SwalPopup } from "../../../middlewares/SwalPopup/SwalPopup";
import { remeasureFCLeases } from "../../../apis/Cruds/RemeasureFCLeases";
import { formatDateForInput } from "../../../helper/FormateValues";

export default function RemeasureAllLeasesModal({ onClose, currencies, defaultCurrencyId, defaultDate }) {

    const [formData, setFormData] = useState({
        currencyID: defaultCurrencyId || (currencies[0]?.currencyID || ""),
        remeasurementDate: formatDateForInput(defaultDate)
    });
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(f => ({
            ...f,
            [name]: name === "remeasurementDate" ? formatDateForInput(value) : value
        }));
    };

    const RemeasureConfirmation = () => {
        ConfirmationSwalPopup(
            'Are you sure?',
            `This will remeasure all leases from ${formData.remeasurementDate} and you won't be able to revert this!`,
            'warning',
            'Yes, remeasure all!',
            () => {
                handleSubmit()
            }
        )
    }
    const handleSubmit = async () => {
        setIsLoading(true);
        try {
            const res = await remeasureFCLeases(formData);
            if (res && res.status) {
                SwalPopup("Success", "Remeasurement completed successfully!", "success");
                onClose && onClose();
            } else {
                SwalPopup("Error", res?.message || "Failed to remeasure leases.", "error");
            }
        } catch (err) {
            SwalPopup("Error", "Something went wrong.", "error");
        }
        setIsLoading(false);
    }

    const isDisabled = !formData.currencyID || !formData.remeasurementDate;
    return (
        <div className="space-y-4 relative">
            <LoadingSpinner isLoading={isLoading}/>
            <div>
                <label  className="block mb-1 pl-1 text-xs font-medium text-gray-900 dark:text-white">Currency</label>
                <select
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-xs rounded-sm focus:ring-blue-500 focus:border-blue-500 block w-full py-1 px-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    name="currencyID"
                    value={formData.currencyID}
                    onChange={handleChange}
                    required
                >
                    {currencies.map(c => (
                        <option key={c.currencyID} value={c.currencyID}>
                            {c.currencyCode} - {c.currencyName}
                        </option>
                    ))}
                </select>
            </div>
            <div>
                <label  className="block mb-1 pl-1 text-xs font-medium text-gray-900 dark:text-white">Remeasurement Date</label>
                <input
                    type="date"
                    name="remeasurementDate"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-xs rounded-sm focus:ring-blue-500 focus:border-blue-500 block w-full py-1 px-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    value={formData.remeasurementDate}
                    onChange={handleChange}
                    required
                />
            </div>
            <div className="flex justify-end gap-2">
                <CommonButton
                    handleValidateForm={() => false}
                    onSubmit={onClose}
                    extandedClass={"bg-gray-200 hover:bg-gray-300 text-black hover:text-black dark:bg-gray-800 dark:text-white dark:hover:text-black mt-3"}
                    text="Close"
                />
                <CommonButton
                    onSubmit={RemeasureConfirmation}
                    extandedClass={"bg-indigo-600 hover:bg-indigo-700 text-white hover:text-white dark:bg-gray-800 dark:text-white dark:hover:text-black mt-3"}
                    text="Remeasure"
                    handleValidateForm={() => isDisabled}
                />
            </div>
        </div>
    );
}
