import React from 'react'
import { removeSessionStorageVariable } from '../../utils/SessionStorage/sessionCrud'
import { sessionVariable } from '../../utils/enums/sessionStorage'
import { useNavigate } from 'react-router-dom'

export default function Logout() {
    const navigate = useNavigate()

    const logout=()=>{
        removeSessionStorageVariable({key:sessionVariable.token})
        removeSessionStorageVariable({key:sessionVariable.userInfo})
        navigate("/")
    }

    return (
        <div>
            <button
                onClick={logout}
                className="w-full flex items-center justify-center text-white bg-gray-400 hover:bg-gray-600 rounded-lg p-2"
            >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15m-3 0-3-3m0 0 3-3m-3 3H15" />
                </svg>

                <span>Logout</span>
            </button>
        </div>
    )
}
