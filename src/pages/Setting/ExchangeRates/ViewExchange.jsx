import React, { useState, useEffect } from "react";
import { getAllCurrencies } from "../../../apis/Cruds/Currencies";
import AddExchangeRateModal from "./AddExchangeRateModal";
import { CustomModal } from "../../../components/common/commonModal";
import ExchangeRatesTable from "../../../components/ExchangeRate/ExchangeRate";
import CommonButton from "../../../components/common/commonButton";
import { getCompanyProfile } from "../../../apis/Cruds/sessionCrud";

function ViewExchangeRates() {
    const [currencyId, setCurrencyId] = useState(0);
    const [currencies, setCurrencies] = useState([]);
    const [selectedDate, setSelectedDate] = useState("");
    const [showAddModal, setShowAddModal] = useState(false);
    const companyProfile = getCompanyProfile();
    useEffect(() => {
        async function fetchCurrencies() {
            const res = await getAllCurrencies();
            const foreignCurrencies = res?.filter(c => c.currencyID !== companyProfile?.reportingCurrencyId) || [];
            if (Array.isArray(foreignCurrencies)) {
                setCurrencies(foreignCurrencies);
                if (foreignCurrencies.length > 0) setCurrencyId(foreignCurrencies[0].currencyID);
            }
        }
        fetchCurrencies();
    }, []);

    return (
        <div className="border rounded-md bg-white dark:bg-gray-800 p-4 shadow-sm">
            <div className="flex flex-col lg:flex-row gap-4 items-end mb-2">
                <div className="w-full lg:w-1/2">
                    <label htmlFor="currency" className="block mb-2 text-xs font-medium text-gray-900 dark:text-white">
                        Foreign Currency
                    </label>
                    <select
                        id="currencyId"
                        name="currencyID"
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-xs rounded-sm focus:ring-blue-500 focus:border-blue-500 block w-full px-2.5 py-1.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        value={currencyId}
                        onChange={e => setCurrencyId(Number(e.target.value))}
                    >
                        {currencies.map(c => (
                            <option key={c.currencyID} value={c.currencyID}>
                                {c.currencyCode} - {c.currencyName}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="w-full lg:w-1/2">
                    <label htmlFor="date" className="block mb-2 text-xs font-medium text-gray-900 dark:text-white">
                        Date
                    </label>
                    <input
                        id="date"
                        type="date"
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-xs rounded-sm focus:ring-blue-500 focus:border-blue-500 block w-full px-2.5 py-1.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        value={selectedDate}
                        onChange={e => setSelectedDate(e.target.value)}
                    />
                </div>

            </div>
            <div className="w-full lg:w-auto flex justify-end lg:mt-0">
                <CommonButton
                    handleValidateForm={() => { return false }}
                    onSubmit={() => {
                        setCurrencyId(currencies[0]?.currencyID || 0);
                        setSelectedDate("");
                    }}
                    extandedClass={"bg-gray-500 hover:bg-gray-700 text-white hover:text-white"}
                    text="Reset Filter"
                />
                <CommonButton
                    handleValidateForm={() => { return false }}
                    onSubmit={() => setShowAddModal(true)}
                    extandedClass={"bg-indigo-600 hover:bg-indigo-700 text-white hover:text-white"}
                    text="Add New"
                />
            </div>
            <ExchangeRatesTable currencyId={currencyId} selectedDate={selectedDate} />
            <CustomModal
                openModal={showAddModal}
                closeModal={() => setShowAddModal(false)}
                modalTitle="Add Exchange Rate"
                mainContent={
                    <AddExchangeRateModal
                        open={showAddModal}
                        onClose={() => setShowAddModal(false)}
                        currencies={currencies}
                        defaultCurrencyId={currencyId}
                        defaultDate={selectedDate}
                    />
                }
            />
        </div>
    );
}

export default ViewExchangeRates;
