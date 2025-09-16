import React, { useState } from "react";
import { getCompanyProfile } from "../../apis/Cruds/sessionCrud";
import { registerUser } from "../../apis/Cruds/User";
import { statusCodeMessage } from "../../utils/enums/statusCode";
import { SwalPopup } from "../../middlewares/SwalPopup/SwalPopup";
import { emailRegex } from "../../helper/inputValidation";
import { LoadingSpinner } from "../../components/LoadingBar/LoadingBar";
import CommonButton from "../../components/common/commonButton";
export default function AddUserTab() {
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false)
    const companyProfile = getCompanyProfile();
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        phoneNumber: "",
        userAddress: "",
        companyID: companyProfile?.companyID || "",
        role: "Admin",
        password: "",
        CreatedAt: new Date(),
        IsActive: true,
    });
    const [isValidEmail, setIsValidEmail] = useState(true);

    const handleChange = e => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };
    const handleSubmit = async (e) => {
        const user = {
            UserID: 0, // Assuming this will be set later
            Username: formData.username.trim(),
            PasswordHash: formData.password,
            PhoneNumber: formData.phoneNumber.trim(),
            UserAddress: formData.userAddress.trim(),
            Email: formData.email.trim(),
            CreatedAt: formData.CreatedAt,
            IsActive: formData.IsActive,
            companyID: formData.companyID,
            role: formData.role
        }
        setLoading(true)
        const response = await registerUser(user)
        setLoading(false)
        if (response?.userID) {
            SwalPopup(
                "User Created",
                statusCodeMessage.userCreated,
                "success",
                () => resetModal()
            )
        } else if (response.status === 400) {
            SwalPopup(
                "Sorry!",
                statusCodeMessage.alreadyExist,
                "error",
                () => resetModal()
            )
        } else {
            SwalPopup(
                "Sorry!",
                statusCodeMessage.somethingWentWrong,
                "error"
            )
        }
    };

    // validate the form 
    const handleValidateForm = () => {
        if (
            formData.email === "" ||
            formData.password === "" ||
            formData.username === "" ||
            formData.phoneNumber === "" ||
            formData.userAddress === "" ||
            isValidEmail === false
        ) {
            return true
        }
        return false
    }
    // Valid email on blur
    const handleValidEmail = () => {
        setIsValidEmail(emailRegex.test(formData.email));
    }
    // reset modal
    const resetModal = () => {
        setFormData({
            username: "",
            email: "",
            phoneNumber: "",
            userAddress: "",
            companyID: companyProfile?.companyID || "",
            role: "Admin",
            password: "",
            CreatedAt: new Date(),
            IsActive: true,
        })
    }
    return (
        <React.Fragment>
            <LoadingSpinner isLoading={loading} />
            <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-8 max-w-lg mx-auto mt-6 border border-gray-200 dark:border-gray-700">
                <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-6 text-center">Add New User</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                    <div className="flex flex-col">
                        <label className="block text-xs font-semibold mb-2 text-gray-700 dark:text-gray-200">Username</label>
                        <input name="username" value={formData.username} onChange={handleChange} className="w-full border border-gray-300 dark:border-gray-600 rounded px-3 py-2 text-xs focus:ring-2 focus:ring-green-500 focus:border-green-500 dark:bg-gray-700 dark:text-white transition" placeholder="Enter username" />
                    </div>
                    <div className="flex flex-col">
                        <label className="block text-xs font-semibold mb-2 text-gray-700 dark:text-gray-200">Email</label>
                        <input name="email" value={formData.email} onChange={handleChange} onBlur={handleValidEmail} className="w-full border border-gray-300 dark:border-gray-600 rounded px-3 py-2 text-xs focus:ring-2 focus:ring-green-500 focus:border-green-500 dark:bg-gray-700 dark:text-white transition" placeholder="Enter email" />
                        {!isValidEmail && <p className="text-xs" style={{ color: "red" }}>Invalid email address</p>}
                    </div>
                    {/* Password with eye icon */}
                    <div className="relative flex flex-col">
                        <label className="block text-xs font-semibold mb-2 text-gray-700 dark:text-gray-200">Password</label>
                        <input
                            name="password"
                            type={showPassword ? "text" : "password"}
                            value={formData.password}
                            onChange={handleChange}
                            className="w-full border border-gray-300 dark:border-gray-600 rounded px-3 py-2 text-xs focus:ring-2 focus:ring-green-500 focus:border-green-500 dark:bg-gray-700 dark:text-white transition pr-10"
                            placeholder="Enter password"
                            autoComplete="new-password"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword((prev) => !prev)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 focus:outline-none flex items-center"
                            tabIndex={-1}
                            aria-label={showPassword ? "Hide password" : "Show password"}
                        >
                            <div
                                className="absolute inset-y-0 right-2 flex items-center cursor-pointer text-gray-500 h-[24px]"
                            // onClick={() => setShowPassword((prev) => !prev)}
                            >
                                {showPassword ? (
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-5 w-5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
                                    </svg>
                                ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-5 w-5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                                    </svg>
                                )}
                            </div>
                        </button>
                    </div>
                    <div className="flex flex-col">
                        <label className="block text-xs font-semibold mb-2 text-gray-700 dark:text-gray-200">Phone Number</label>
                        <input name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} className="w-full border border-gray-300 dark:border-gray-600 rounded px-3 py-2 text-xs focus:ring-2 focus:ring-green-500 focus:border-green-500 dark:bg-gray-700 dark:text-white transition" placeholder="Enter phone number" />
                    </div>
                    <div className="flex flex-col">
                        <label className="block text-xs font-semibold mb-2 text-gray-700 dark:text-gray-200">Address</label>
                        <input name="userAddress" value={formData.userAddress} onChange={handleChange} className="w-full border border-gray-300 dark:border-gray-600 rounded px-3 py-2 text-xs focus:ring-2 focus:ring-green-500 focus:border-green-500 dark:bg-gray-700 dark:text-white transition" placeholder="Enter address" />
                    </div>
                    {/* Role */}
                    <div className="flex flex-col">
                        <label htmlFor="role" className="block mb-2 text-xs font-medium text-gray-900 dark:text-white">
                            Role
                        </label>
                        <select
                            id="role"
                            name="role"
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-xs rounded-sm focus:ring-blue-500 focus:border-blue-500 block w-full px-2.5 py-1.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            value={formData.role}
                            onChange={handleChange}
                        >
                            <option value="Admin">Admin</option>
                            <option value="User">User</option>
                        </select>
                    </div>
                </div>

                <div className="flex justify-center mt-8 w-full">
                    <CommonButton
                        extandedClass={"bg-indigo-600 hover:bg-indigo-700 text-white hover:text-white w-full mt-3"}
                        text="Add User"
                        onSubmit={handleSubmit}
                        handleValidateForm={handleValidateForm}
                    />
                </div>
            </div>
        </React.Fragment>
    );
}
