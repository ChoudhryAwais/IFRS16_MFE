import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { loginUser } from '../../apis/Cruds/User';
import { emailRegex } from '../../helper/inputValidation';
import { SwalPopup } from '../../middlewares/SwalPopup/SwalPopup';
import { statusCode, statusCodeMessage } from '../../utils/enums/statusCode';
import { sessionVariable } from '../../utils/enums/sessionStorage';
import { getSessionStorage, setSessionStorage } from '../../apis/Cruds/sessionCrud';
import { LoadingSpinner } from '../../components/LoadingBar/LoadingBar';

export default function Login() {
    const navigate = useNavigate()
    const [passwordVisible, setPasswordVisible] = useState(false)
    const [loading, setLoading] = useState(false)
    const [isValidEmail, setIsValidEmail] = useState(true);
    const [formData, setFormData] = useState({
        email: '',
        passwordHash: '',
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };
    const togglePasswordVisibility = () => {
        setPasswordVisible((prevData) => {
            return !prevData
        })
    };
    // validate the form 
    const handleValidateForm = () => {
        if (
            formData.email === "" ||
            formData.passwordHash === "" ||
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
    const handleSubmit = async () => {
        setLoading(true)
        const response = await loginUser(formData)
        setLoading(false)
        if (response?.token) {
            setSessionStorage({
                key: sessionVariable.token,
                value: response.token
            })
            setSessionStorage({
                key: sessionVariable.userInfo,
                value: response.user
            })
            setSessionStorage({
                key: sessionVariable.companyProfile,
                value: response.companyProfile
            })

            navigate("/Dashboard")
        } else if (response.status === statusCode.unauthorized) {
            SwalPopup(
                "Unauthorized",
                statusCodeMessage.unauthorized,
                "error"
            )
        } else {
            SwalPopup(
                "Sorry!",
                statusCodeMessage.somethingWentWrong,
                "error"
            )
        }
    };
    // check for login 
    useEffect(() => {
        const checkForLogin = () => {
            const jwtToken = JSON.parse(getSessionStorage({ key: sessionVariable.token }))
            if (jwtToken && jwtToken.length > 0) {
                navigate("/Dashboard")
            }
        }
        checkForLogin()
    }, [navigate])

    return (
        <>
            <LoadingSpinner isLoading={loading} />
            <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-red-800 to-blue-900">
                <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-sm">
                    <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Login</h2>

                    <div className="mb-4">
                        <label htmlFor="email" className="block text-gray-700 font-medium mb-2">
                            Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter your email"
                            value={formData.email}
                            onChange={handleInputChange}
                            onBlur={handleValidEmail}
                        />
                    </div>
                    <div className="mb-4 relative">
                        <label htmlFor="passwordHash" className="block text-gray-700 font-medium mb-2">
                            Password
                        </label>
                        <input
                            type={passwordVisible ? "text" : "password"}
                            id="passwordHash"
                            name="passwordHash"
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
                            placeholder="Enter your password"
                            value={formData.password}
                            onChange={handleInputChange}
                        />
                        <div
                            className="absolute inset-y-0 right-3 flex items-center cursor-pointer text-gray-500 h-[100px]"
                            onClick={togglePasswordVisibility}
                        >
                            {passwordVisible ? (
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
                    </div>

                    <button
                        type="submit"
                        className={(handleValidateForm() ? "cursor-no-drop" : " ") + " w-full bg-[#DB1118] text-white py-2 px-4 rounded-lg hover:bg-red-500 transition-colors"}
                        onClick={handleSubmit}
                        disabled={handleValidateForm()}
                    >
                        Login
                    </button>

                    <p className="text-center text-gray-600 mt-4">
                        Don’t have an account?{" "}
                        <Link to="/Registration" className="text-blue-500 hover:underline">
                            Sign up
                        </Link>
                    </p>
                </div>
            </div>
        </>
    );
}
