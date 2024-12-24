import React from 'react'
import LeftHandNav from '../../components/LeftHandNav/LeftHandNav'
import Logout from '../../components/Logout/Logout'

export default function ProtectedRoute({ component }) {
  return (
    <div className="flex h-screen">
      <div className="w-1/5 bg-gray-100 dark:bg-gray-800 p-4 h-screen sticky top-0 flex flex-col">
        <div className='flex-1'>
          <LeftHandNav />
        </div>
        <div>
          {/* Logout Button */}
          <Logout />
        </div>
      </div>
      {/* Right Container */}
      <div className="flex-1 bg-gray-50 dark:bg-gray-900 p-4 overflow-y-auto">
        {component}
      </div>
    </div>
  )
}
