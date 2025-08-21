import { useState } from "react";
import { LoadingSpinner } from "../../../components/LoadingBar/LoadingBar";
import CommonButton from "../../../components/common/commonButton";
import { allowDecimalNumbers } from "../../../helper/checkForAllowVal";
import { addExchangeRate } from "../../../apis/Cruds/ExchangeRates";

export default function AddExchangeRateModal({ open, onClose, currencies, defaultCurrencyId, defaultDate }) {
    const [formData, setFormData] = useState({
        currencyID: defaultCurrencyId || (currencies[0]?.currencyID || ""),
        exchangeDate: defaultDate || "",
        exchangeRate: ""
    });
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        if (e) e.preventDefault();
        setIsLoading(true);
        await addExchangeRate(formData);
        setIsLoading(false);
        onClose && onClose();
    };
    const handleNumericChange = (e) => {
        const { name, value } = e.target;
        const inputValue = allowDecimalNumbers(value)
        setFormData({
            ...formData,
            [name]: inputValue
        });
    }
    const handleChange = (e) => {
        const { name, value } = e.target;
        const newValue = !isNaN(value) ? (parseInt(value) || value) : value
        setFormData({
            ...formData,
            [name]: newValue
        });
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4 relative">
            <LoadingSpinner isLoading={isLoading} />
            <div>
                <label className="block text-xs font-medium mb-1">Currency</label>
                <select
                    className="w-full border rounded px-2 py-1 text-xs"
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
                <label className="block text-xs font-medium mb-1">Date</label>
                <input
                    type="date"
                    name="exchangeDate"
                    className="w-full border rounded px-2 py-1 text-xs"
                    value={formData.exchangeDate}
                    onChange={handleChange}
                />
            </div>
            <div>
                <label className="block text-xs font-medium mb-1">Exchange Rate</label>
                <input
                    type="text"
                    step="0.0001"
                    name="exchangeRate"
                    className="w-full border rounded px-2 py-1 text-xs"
                    value={formData.exchangeRate}
                    onChange={handleNumericChange}
                    required
                />
            </div>
            <div className="flex justify-end gap-2">
                <CommonButton
                    handleValidateForm={() => false}
                    onSubmit={onClose}
                    extandedClass={"bg-gray-200 hover:bg-gray-300 text-black hover:text-black mt-3"}
                    text="Close"
                />
                <CommonButton
                    handleValidateForm={() => false}
                    onSubmit={handleSubmit}
                    extandedClass={"bg-indigo-600 hover:bg-indigo-700 text-white hover:text-white mt-3"}
                    text="Add"
                />
            </div>
        </form>
    );
}