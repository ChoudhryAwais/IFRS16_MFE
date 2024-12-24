import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { emailRegex, numberRegex } from '../../utils/inputValidation';
import { registerUser } from '../../utils/Cruds/User';
import { SwalPopup } from '../../middlewares/SwalPopup/SwalPopup';

export default function Register() {
    const navigate = useNavigate()
    const [userData, setUserData] = useState({
        UserID: 0, // Assuming this will be set later
        Username: '',
        PasswordHash: '',
        PhoneNumber: '',
        UserAddress: '',
        Email: '',
        CreatedAt: new Date(),
        IsActive: true,
    });
    const [isValidEmail, setIsValidEmail] = useState(true);
    // Handle Inputs
    const handleInputChange = (event) => {
        const { name, value } = event.target
        if (name == "PhoneNumber") {
            if (numberRegex.test(value))
                return
        }
        setUserData({
            ...userData,
            [name]: value
        })
    }
    // validate the form 
    const handleValidateForm = () => {
        if (
            userData.Email === "" ||
            userData.PasswordHash === "" ||
            userData.Username === "" ||
            userData.PhoneNumber === "" ||
            userData.UserAddress === ""
        ) {
            return true
        }
        return false
    }
    // Valid email on blur
    const handleValidEmail = () => {
        setIsValidEmail(emailRegex.test(userData.Email));
    }

    const handleSubmit = async (e) => {
        const response = await registerUser(userData)
        if (response.userID) {
            SwalPopup(
                "User Created",
                "New user has been created!",
                "success",
                () => navigate("/")
            )
        } else if (response.status == 400) {
            SwalPopup(
                "Sorry!",
                "User already exist",
                "error"
            )
        } else {
            SwalPopup(
                "Sorry!",
                "Something went wrong",
                "error"
            )
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-4xl">
                <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Register</h2>
                <div className='flex gap-2'>
                    <div className="mb-4 w-1/2">
                        <label htmlFor="username" className="block text-gray-700 font-medium mb-2">
                            User / Company Name
                        </label>
                        <input
                            type="text"
                            id="username"
                            name="Username"
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter your username"
                            value={userData.Username}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="mb-4 w-1/2">
                        <label htmlFor="email" className="block text-gray-700 font-medium mb-2">
                            Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="Email"
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter your email"
                            value={userData.Email}
                            onChange={handleInputChange}
                            onBlur={handleValidEmail}
                        />
                        {!isValidEmail && <p style={{ color: "red" }}>Invalid email address</p>}
                    </div>
                </div>
                <div className='flex gap-2'>
                    <div className="mb-4 relative w-1/2">
                        <label htmlFor="password" className="block text-gray-700 font-medium mb-2">
                            Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            name="PasswordHash"
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter your password"
                            value={userData.PasswordHash}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="mb-4 w-1/2">
                        <label htmlFor="phoneNumber" className="block text-gray-700 font-medium mb-2">
                            Phone Number
                        </label>
                        <input
                            type="number"
                            id="phoneNumber"
                            name="PhoneNumber"
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter your phone number"
                            value={userData.PhoneNumber}
                            onChange={handleInputChange}
                        />
                    </div>
                </div>
                <div className="mb-4">
                    <label htmlFor="userAddress" className="block text-gray-700 font-medium mb-2">
                        Address
                    </label>
                    <textarea
                        id="userAddress"
                        name="UserAddress"
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter your address"
                        value={userData.UserAddress}
                        onChange={handleInputChange}
                    />
                </div>

                <button
                    type="submit"
                    className={(handleValidateForm() ? "cursor-no-drop" : " ") + " w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors"}
                    onClick={handleSubmit}
                    disabled={handleValidateForm()}
                >
                    Register
                </button>
                <p className="text-center text-gray-600 mt-4">
                    Already have an account?{" "}
                    <Link to="/" className="text-blue-500 hover:underline">
                        Login
                    </Link>
                </p>
            </div>
        </div>
    );
}
