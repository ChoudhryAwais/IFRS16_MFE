import React, { useState } from 'react';
import CommonButton from '../../../../components/common/commonButton';
import { allowDecimalNumbers } from '../../../../helper/checkForAllowVal';
import { ConfirmationSwalPopup, SwalPopup } from '../../../../middlewares/SwalPopup/SwalPopup';
import { statusCodeMessage } from '../../../../utils/enums/statusCode';
import { terminateLease } from '../../../../apis/Cruds/LeaseData';
import { LoadingSpinner } from '../../../../components/LoadingBar/LoadingBar';

export default function TerminateLease({ selectedLease, callBack }) {
    const [loader, setloader] = useState(false)
    const [formData, setFormData] = useState({
        terminateDate: '',
        penalty: '',
        leaseId: selectedLease?.leaseId
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };
    const handleNumericChange = (e) => {
        const { name, value } = e.target;
        const inputValue = allowDecimalNumbers(value)
        setFormData((prevData) => ({
            ...prevData,
            [name]: inputValue,
        }));
    }

    const handleSubmit = () => {
        ConfirmationSwalPopup(
            "Are you sure?",
            statusCodeMessage.terminateLease,
            "warning",
            statusCodeMessage.termiated,
            () => handleTerminateLease()
        )
    };

    const handleTerminateLease = async () => {
        setloader(true)
        const result = await terminateLease(formData)
        if (result?.status === 200) {
            setloader(false)
            SwalPopup(
                "Terminated",
                statusCodeMessage.leaseTermiated,
                "success",
                () => {
                    callBack()
                }
            )
            return
        }
        SwalPopup(
            "Something went wrong",
            statusCodeMessage.somethingWentWrong,
            "error"
        )
        setloader(false)
    }

    return (
        <React.Fragment>
            {/* This loader is for lease report */}
            <LoadingSpinner isLoading={loader} />
            <div className="p-2">
                <form className="grid grid-cols-2 gap-6">
                    {/* Termination Lease Date */}
                    <div>
                        <label htmlFor="terminateDate" className="block mb-1 text-xs pl-1 font-medium text-gray-900 dark:text-white">
                            Date of Termination
                        </label>
                        <input
                            type="date"
                            id="terminateDate"
                            name="terminateDate"
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-xs rounded-sm focus:ring-blue-500 focus:border-blue-500 block w-full py-1 px-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            value={formData.terminateDate}
                            onChange={handleChange}
                        />
                    </div>
                    {/* Termination Penalty */}
                    <div>
                        <label htmlFor="penalty" className="block mb-1 text-xs pl-1 font-medium text-gray-900 dark:text-white">
                            Penalty
                        </label>
                        <input
                            type="text"
                            id="penalty"
                            name="penalty"
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-xs rounded-sm focus:ring-blue-500 focus:border-blue-500 block w-full py-1 px-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            placeholder="Enter termination penalty amount"
                            value={formData.penalty}
                            onChange={handleNumericChange}
                        />
                    </div>
                </form>
                {/* Submit Button */}
                <div className='flex justify-end'>
                    <CommonButton
                        onSubmit={handleSubmit}
                        handleValidateForm={() => !formData.terminateDate}
                        text="Terminate"
                        extandedClass="bg-red-600 hover:bg-red-700 hover:text-white text-xs mt-4"
                    />
                </div>
            </div>
        </React.Fragment>
    );
}
