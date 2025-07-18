
import React, { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { removeSessionStorageVariable } from '../../apis/Cruds/sessionCrud'
import { sessionVariable } from '../../utils/enums/sessionStorage'

export default function LeftHandNav({ isCollapsed, onCollapse }) {
    const [activeTab, setactiveTab] = useState('')
    const locationPath = useLocation()

    const handleActiveTab = (tab) => {
        setactiveTab(tab)
    }
    const getTabClasses = (tab) => {
        const isActive = activeTab === tab;
        return [
            "flex items-center p-1.5 rounded-sm group text-xs",
            isActive ? "bg-[#97072A] text-white" : "text-gray-900 text-white hover:bg-[#97072A]",
            isCollapsed ? "justify-center" : "justify-left"
        ].join(" ");
    };
    const LHNItem = [
        {
            path: "/Dashboard",
            label: "Dashboard",
            icon: <svg
                fill="none"
                viewBox="0 0 26 26"
                strokeWidth="1.5"
                stroke="currentColor"
                className="size-5"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M10.5 6a7.5 7.5 0 1 0 7.5 7.5h-7.5V6Z"
                />
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13.5 10.5H21A7.5 7.5 0 0 0 13.5 3v7.5Z"
                />
            </svg>
        },
        {
            path: "/Leases",
            label: "Lease",
            icon:
                <svg
                    fill="none"
                    viewBox="0 0 26 26"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="size-5"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25ZM6.75 12h.008v.008H6.75V12Zm0 3h.008v.008H6.75V15Zm0 3h.008v.008H6.75V18Z"
                    />
                </svg>
        },
        {
            path: "/IFRS16Accounting",
            label: "Accounting",
            icon:
                <svg fill="none" viewBox="0 0 26 26" strokeWidth="1.5" stroke="currentColor" className="size-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 7.5V6.108c0-1.135.845-2.098 1.976-2.192.373-.03.748-.057 1.123-.08M15.75 18H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08M15.75 18.75v-1.875a3.375 3.375 0 0 0-3.375-3.375h-1.5a1.125 1.125 0 0 1-1.125-1.125v-1.5A3.375 3.375 0 0 0 6.375 7.5H5.25m11.9-3.664A2.251 2.251 0 0 0 15 2.25h-1.5a2.251 2.251 0 0 0-2.15 1.586m5.8 0c.065.21.1.433.1.664v.75h-6V4.5c0-.231.035-.454.1-.664M6.75 7.5H4.875c-.621 0-1.125.504-1.125 1.125v12c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V16.5a9 9 0 0 0-9-9Z" />
                </svg>
        },
        {
            path: "/BulkImport",
            label: "Bulk Import",
            icon:
                <svg fill="none" viewBox="0 0 26 26" strokeWidth="1.5" stroke="currentColor" className="size-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9.75v6.75m0 0-3-3m3 3 3-3m-8.25 6a4.5 4.5 0 0 1-1.41-8.775 5.25 5.25 0 0 1 10.233-2.33 3 3 0 0 1 3.758 3.848A3.752 3.752 0 0 1 18 19.5H6.75Z" />
                </svg>
        },
        {
            path: "/Setting",
            label: "Setting",
            icon:
                <svg fill="none" viewBox="0 0 26 26" strokeWidth="1.5" stroke="currentColor" className="size-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                </svg>

        },
    ]

    useEffect(() => {
        handleActiveTab(locationPath.pathname)
        getTabClasses(locationPath.pathname)
    }, [locationPath.pathname])

    return (
        <>
            <div className="border-b bg-gradient-to-r flex justify-between from-red-600 to-white bg-clip-text text-transparent">
                {!isCollapsed && <h1 className="2xl:text-md lg:text-sm font-bold p-2">IFRS16 Solution</h1>}

                <button
                    onClick={onCollapse}
                    className="text-white"
                >
                    <i className={"fa fa-bars p-2 shadow-gray-500"}></i>
                </button>
            </div>
            <nav className="mt-4">
                <ul className="space-y-2">
                    {LHNItem.map(item => {
                        return (
                            <li key={item.path}>
                                <Link to={item.path} className={getTabClasses(item.path)} onClick={() => {
                                    removeSessionStorageVariable({ key: sessionVariable.selectLease })
                                }}>
                                    <span>{item.icon}</span>
                                    {!isCollapsed && <span className="ms-2">{item.label}</span>}
                                </Link>
                            </li>
                        )
                    })}

                </ul>
            </nav>
        </>
    )
}
