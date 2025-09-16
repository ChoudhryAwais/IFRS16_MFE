import React, { useState } from 'react'
import LeftHandNav from '../../components/LeftHandNav/LeftHandNav'
import Logout from '../../components/Logout/Logout'
import { getSessionStorage } from '../../apis/Cruds/sessionCrud'
import { Navigate } from 'react-router-dom'
import { sessionVariable } from '../../utils/enums/sessionStorage'

export default function ProtectedRoute({ Component }) {
  const jwtToken = JSON.parse(getSessionStorage({ key: sessionVariable.token }))
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="flex h-screen">
      <div className={`${isCollapsed ? "w-16" : "md:w-1/5 lg:w-1/6 xl:w-1/6 2xl:w-[15%]"
        } bg-[#1D2E64] dark:bg-gray-800 p-4 h-screen sticky top-0 flex flex-col transition-all duration-300`}>

        {/* Toggle Button */}

        <div className='flex-1'>
          
          <LeftHandNav isCollapsed={isCollapsed} onCollapse={() => setIsCollapsed(!isCollapsed)} />
        </div>
        <div>
          {/* Logout Button */}
          <Logout isCollapsed={isCollapsed} />
        </div>
      </div>
      {/* Right Container */}
      {
        (jwtToken && jwtToken.length > 0) ?
          <div className="flex-1 bg-gray-50 dark:bg-gray-900 p-4 overflow-y-auto">
            {<Component />}
          </div>
          :
          <Navigate to="/" />
      }
    </div>
  )
}
