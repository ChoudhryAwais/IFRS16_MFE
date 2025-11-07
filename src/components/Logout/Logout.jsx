import React, { useState } from 'react'
import { clearAllSessionStorage } from '../../apis/Cruds/sessionCrud'
import { useNavigate } from 'react-router-dom'
import { logoutUser } from '../../apis/Cruds/User'
import { apiResponses } from '../../utils/enums/statusCode'
import { LoadingSpinner } from '../LoadingBar/LoadingBar'

export default function Logout({ isCollapsed }) {
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)

    const logout = async () => {
        setLoading(true)
        const response = await logoutUser();
        setLoading(false)
        if (response && response.message === apiResponses.logoutSuccess) {
            clearAllSessionStorage()
            navigate("/")
        }
    }

    return (
        <React.Fragment>
            <LoadingSpinner isLoading={loading} />
            <button
                onClick={logout}
                className="text-xs w-full flex items-center justify-center text-white bg-gray-600 hover:bg-gray-700 rounded-lg p-2"
            >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-5 mr-1">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15m-3 0-3-3m0 0 3-3m-3 3H15" />
                </svg>
                {!isCollapsed ? <span>Logout</span> : null}

            </button>
        </React.Fragment>

    )
}
