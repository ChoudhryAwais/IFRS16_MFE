import React from 'react'
import LeftHandNav from '../../components/LeftHandNav/LeftHandNav'
import Logout from '../../components/Logout/Logout'
import { getSessionStorage } from '../../apis/Cruds/sessionCrud'
import { Navigate } from 'react-router-dom'
import { sessionVariable } from '../../utils/enums/sessionStorage'

export default function ProtectedRoute({ component }) {
  const jwtToken = JSON.parse(getSessionStorage({ key: sessionVariable.token }))

  return (
    <div className="flex h-screen">
      <div className="w-1/5 bg-[#1D2E64] dark:bg-gray-800 p-4 h-screen sticky top-0 flex flex-col">
        <div className='flex-1'>
          <LeftHandNav />
        </div>
        <div>
          {/* Logout Button */}
          <Logout />
        </div>
      </div>
      {/* Right Container */}
      {
        (jwtToken && jwtToken.length > 0) ?
          <div className="flex-1 bg-gray-50 dark:bg-gray-900 p-4 overflow-y-auto">
            {component}
          </div>
          :
          <Navigate to="/" />
      }
    </div>
  )
}
