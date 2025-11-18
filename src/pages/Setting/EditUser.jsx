import React, { useState, useEffect, useRef } from "react";
import CommonButton from "../../components/common/commonButton";
import { getCompanyProfile, getUserInfo, setSessionStorage } from "../../apis/Cruds/sessionCrud";
import { verifyPassword, updateUser } from "../../apis/Cruds/User";
import { statusCodeMessage } from "../../utils/enums/statusCode";
import { SwalPopup } from "../../middlewares/SwalPopup/SwalPopup";
import { useNavigate } from "react-router-dom";
import { LoadingSpinner } from "../../components/LoadingBar/LoadingBar";
import { sessionVariable } from "../../utils/enums/sessionStorage";
import { isStrongPassword } from "../../helper/inputValidation";

export default function EditUserTab() {
    const navigate = useNavigate()
    const userInfo = getUserInfo();
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({
        userID: "",
        username: "",
        phoneNumber: "",
        userAddress: "",
    });
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [passwordMatch, setPasswordMatch] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPwdToggle, setShowNewPwdToggle] = useState(false);
    const [checkingPassword, setCheckingPassword] = useState(false);
    const [passwordError, setPasswordError] = useState("");
    const [isPwdStrong, setIsPwdStrong] = useState(true);
    const [pwdStrengthError, setPwdStrengthError] = useState("");
    const pwdValidateTimer = useRef(null);

    useEffect(() => {
        if (userInfo) {
            setFormData({
                userID: userInfo.userID || "",
                username: userInfo.username || "",
                phoneNumber: userInfo.phoneNumber || "",
                userAddress: userInfo.userAddress || "",
            });
        }
    }, []);

    const handleChange = e => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleCurrentPasswordChange = (e) => {
        setCurrentPassword(e.target.value);
    };

    const handleCurrentPasswordBlur = async () => {
        if (userInfo && currentPassword) {
            setCheckingPassword(true);
            try {
                const res = await verifyPassword({ userId: userInfo.userID, password: currentPassword });
                if (res && (res.isValid || res.success)) {
                    setPasswordMatch(true);
                    setShowNewPassword(true);
                } else {
                    setPasswordMatch(false);
                    setShowNewPassword(false);
                }
            } catch {
                setPasswordMatch(false);
                setShowNewPassword(false);
            }
            setCheckingPassword(false);
        } else {
            setPasswordMatch(false);
            setShowNewPassword(false);
        }
    };

    const handleNewPasswordChange = e => {
        setNewPassword(e.target.value);
        setPasswordError("");
        setPwdStrengthError('');
    };

    const handleConfirmPasswordChange = e => {
        setConfirmPassword(e.target.value);
        setPasswordError("");
    };

    // Debounced password strength validation for Edit User (new password)
    useEffect(() => {
        if (pwdValidateTimer.current) clearTimeout(pwdValidateTimer.current);
        const pwd = newPassword || '';
        if (!pwd) {
            setIsPwdStrong(true);
            setPwdStrengthError('');
            return;
        }
        pwdValidateTimer.current = setTimeout(() => {
            const ok = isStrongPassword(pwd);
            setIsPwdStrong(ok);
            setPwdStrengthError(ok ? '' : 'Password must be at least 8 characters and include uppercase, lowercase, number and special character.');
        }, 700);

        return () => {
            if (pwdValidateTimer.current) clearTimeout(pwdValidateTimer.current);
        }
    }, [newPassword]);

    const handleSubmit = async () => {
        if (showNewPassword && newPassword) {
            if (newPassword !== confirmPassword) {
                setPasswordError("Passwords do not match.");
                return;
            }
            if (!isPwdStrong) {
                setPasswordError('New password is not strong enough.');
                return;
            }
        }
        const updatedData = { ...formData };
        if (showNewPassword && newPassword) {
            updatedData.passwordHash = newPassword;
        }
        setLoading(true)
        try {
            const res = await updateUser(updatedData);
            if (res && res.status) {
                SwalPopup(
                    "Updated",
                    statusCodeMessage.userUpdated,
                    "success",
                    () => {
                        const userInfo = getUserInfo();
                        userInfo.username = formData.username;
                        userInfo.phoneNumber = formData.phoneNumber;
                        userInfo.userAddress = formData.userAddress;
                        setSessionStorage({ key: sessionVariable.userInfo, value: userInfo });
                        navigate("/Dashboard")
                    }
                )
            } else {
                SwalPopup(
                    "Sorry!",
                    statusCodeMessage.userUpdatedFail,
                    "error"
                )
            }
        } catch (err) {
            SwalPopup(
                "Sorry!",
                statusCodeMessage.somethingWentWrong,
                "error"
            )
        }
        setLoading(false)
    };

    return (
        <React.Fragment>
            <LoadingSpinner isLoading={loading} />
            <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-8 max-w-lg mx-auto mt-6 border border-gray-200 dark:border-gray-700">
                <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-6 text-center">Edit User</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2">
                    <div>
                        <label className="block text-xs font-semibold mb-2 text-gray-700 dark:text-gray-200">Username</label>
                        <input name="username" value={formData.username} onChange={handleChange} className="w-full border border-gray-300 dark:border-gray-600 rounded px-3 py-2 text-xs focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition" placeholder="Enter username" />
                    </div>
                    <div>
                        <label className="block text-xs font-semibold mb-2 text-gray-700 dark:text-gray-200">Phone Number</label>
                        <input name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} className="w-full border border-gray-300 dark:border-gray-600 rounded px-3 py-2 text-xs focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition" placeholder="Enter phone number" />
                    </div>
                    <div>
                        <label className="block text-xs font-semibold mb-2 text-gray-700 dark:text-gray-200">Address</label>
                        <input name="userAddress" value={formData.userAddress} onChange={handleChange} className="w-full border border-gray-300 dark:border-gray-600 rounded px-3 py-2 text-xs focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition" placeholder="Enter address" />
                    </div>
                </div>

                <div className="mt-4">
                    <label className="block text-xs font-semibold mb-2 text-gray-700 dark:text-gray-200">Current Password</label>
                    <div className="flex items-center gap-2">
                        <div className="relative flex-1">
                            <input
                                type={showCurrentPassword ? "text" : "password"}
                                value={currentPassword}
                                onChange={handleCurrentPasswordChange}
                                onBlur={handleCurrentPasswordBlur}
                                className="w-full border border-gray-300 dark:border-gray-600 rounded px-3 py-2 text-xs focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition pr-10"
                                placeholder="Enter current password"
                            />
                            <button
                                type="button"
                                onClick={() => setShowCurrentPassword(prev => !prev)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 focus:outline-none flex items-center"
                                tabIndex={-1}
                                aria-label={showCurrentPassword ? "Hide password" : "Show password"}
                            >
                                {showCurrentPassword ? (
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-5 w-5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
                                    </svg>
                                ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-5 w-5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                                    </svg>
                                )}
                            </button>
                        </div>
                        {checkingPassword && (
                            <span className="text-xs text-gray-500 animate-pulse">Validating...</span>
                        )}
                    </div>
                    {!passwordMatch && currentPassword && !checkingPassword && (
                        <span className="text-xs text-red-500">Current password is incorrect.</span>
                    )}
                </div>

                {showNewPassword && (
                    <>
                        <div className="mt-4">
                            <label className="block text-xs font-semibold mb-2 text-gray-700 dark:text-gray-200">New Password</label>
                            <div className="relative">
                                <input
                                    type={showNewPwdToggle ? "text" : "password"}
                                    value={newPassword}
                                    onChange={handleNewPasswordChange}
                                    className="w-full border border-gray-300 dark:border-gray-600 rounded px-3 py-2 text-xs focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition pr-10"
                                    placeholder="Enter new password"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowNewPwdToggle(prev => !prev)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 focus:outline-none flex items-center"
                                    tabIndex={-1}
                                    aria-label={showNewPwdToggle ? "Hide password" : "Show password"}
                                >
                                    {showNewPwdToggle ? (
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-5 w-5">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
                                        </svg>
                                    ) : (
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-5 w-5">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                                        </svg>
                                    )}
                                </button>
                            </div>
                            {!isPwdStrong && (
                                <span className="text-xs text-red-500">{pwdStrengthError}</span>
                            )}
                        </div>
                        <div className="mt-4">
                            <label className="block text-xs font-semibold mb-2 text-gray-700 dark:text-gray-200">Confirm Password</label>
                            <input
                                type="password"
                                value={confirmPassword}
                                onChange={handleConfirmPasswordChange}
                                className="w-full border border-gray-300 dark:border-gray-600 rounded px-3 py-2 text-xs focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition"
                                placeholder="Confirm new password"
                            />
                        </div>
                        {passwordError && (
                            <span className="text-xs text-red-500">{passwordError}</span>
                        )}
                    </>
                )}

                <CommonButton
                    extandedClass={"bg-indigo-600 hover:bg-indigo-700 text-white hover:text-white w-full mt-3"}
                    text="Submit"
                    onSubmit={handleSubmit}
                />
            </div>
        </React.Fragment>
    );
}
