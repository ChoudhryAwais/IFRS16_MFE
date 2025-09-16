import React, { useState, useEffect } from "react";
import CommonButton from "../../components/common/commonButton";
import { getCompanyProfile, getUserInfo, setSessionStorage } from "../../apis/Cruds/sessionCrud";
import { verifyPassword, updateUser } from "../../apis/Cruds/User";
import { statusCodeMessage } from "../../utils/enums/statusCode";
import { SwalPopup } from "../../middlewares/SwalPopup/SwalPopup";
import { useNavigate } from "react-router-dom";
import { LoadingSpinner } from "../../components/LoadingBar/LoadingBar";
import { sessionVariable } from "../../utils/enums/sessionStorage";

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
    const [checkingPassword, setCheckingPassword] = useState(false);
    const [passwordError, setPasswordError] = useState("");

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
    };

    const handleConfirmPasswordChange = e => {
        setConfirmPassword(e.target.value);
        setPasswordError("");
    };

    const handleSubmit = async () => {
        if (showNewPassword && newPassword) {
            if (newPassword !== confirmPassword) {
                setPasswordError("Passwords do not match.");
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
                        debugger
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
                        <input
                            type="password"
                            value={currentPassword}
                            onChange={handleCurrentPasswordChange}
                            onBlur={handleCurrentPasswordBlur}
                            className="w-full border border-gray-300 dark:border-gray-600 rounded px-3 py-2 text-xs focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition"
                            placeholder="Enter current password"
                        />
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
                        <input
                            type="password"
                            value={newPassword}
                            onChange={handleNewPasswordChange}
                            className="w-full border border-gray-300 dark:border-gray-600 rounded px-3 py-2 text-xs focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition"
                            placeholder="Enter new password"
                        />
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
