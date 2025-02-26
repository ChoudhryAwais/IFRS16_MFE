import React, { useEffect, useState } from 'react'
import { TableLoadingSpinner } from '../LoadingBar/LoadingBar'

export default function Tables(props) {
    const {
        data,
        columns,
        extandedTableFunc,
        calcHeight,
        isLoading,
        totalRecord,
        getPaginatedData,
        tabChange,
        pagination = true,
        hideHorzScroll = false,
        selectableRows = false,
        selectableRowsFunc = () => { },
        selectableAllRowsFunc = () => { },
        selectItem = "",
        selectedRows = [],
        resetTable = false
    } = props
    const TableMaxHeight = `calc(100vh - ${calcHeight})`
    const [pageSize, setPageSize] = useState(10); // Default page size
    const [pageNumber, setPageNumber] = useState(1); // Default page number
    const [totalPages, setTotalPages] = useState(0); // Default total pages
    const columnWidth = 15; // Each column takes 20% of the viewport
    const tableWidth = Object.keys(columns).length * columnWidth; // Total table width in %

    // handle page size
    const handlePageSizeChange = (event) => {
        const size = parseInt(event.target.value)
        const totalPage = (totalRecord / size) < 1 ? 1 : (totalRecord / size)
        setTotalPages(totalPage)
        setPageSize(size);
        setPageNumber(1)
        getPaginatedData(1, size)
    };

    const handlePageNumberChange = (number) => {
        setPageNumber(number)
        getPaginatedData(number, pageSize)
    }

    useEffect(() => {
        const divisionRes = totalRecord / pageSize
        const totalPage = Number.isInteger(divisionRes) ? divisionRes : (Math.floor(divisionRes) + 1)
        setTotalPages(totalPage)
    }, [data])

    useEffect(() => {
        if (tabChange) {
            setPageSize(10);
            setPageNumber(1)
        }
    }, [tabChange, resetTable])

    return (
        <React.Fragment>
            <div
                className={`shadow-md sm:rounded-sm overflow-auto`}
                style={{ maxHeight: TableMaxHeight }}
            >
                <div className={`min-w-[${tableWidth}%]`}>
                    <table className="w-full text-sm text-left text-gray-500">
                        <thead
                            className="text-xs text-white uppercase bg-[#97072A] sticky top-0 z-20"
                            style={{ minWidth: `${columnWidth}vw` }}
                        >
                            <tr>
                                {selectableRows ? <th className="p-2 px-4 border border-gray-300 text-left">
                                    <input type="checkbox" onChange={(e) => selectableAllRowsFunc(e, data)} />
                                </th> : null}

                                {Object.values(columns).map((col, i) => {
                                    return (
                                        <th
                                            key={i}
                                            className={`p-2 px-4 border border-gray-300 text-left " ${(i === 0 && !hideHorzScroll) ? "sticky bg-[#97072A] left-0 z-10 shadow-md" : ""
                                                }`}
                                            style={{ minWidth: `${columnWidth}vw` }} // Set column width dynamically
                                        >
                                            {col}
                                        </th>
                                    )
                                })}
                                {/* <th className="px-6 py-3">
                                    Action
                                </th> */}
                            </tr>
                        </thead>
                        <tbody>
                            {isLoading === true ? <tr><td colSpan={Object.keys(columns).length} className="p-3" > <TableLoadingSpinner /></td></tr>
                                :
                                data.length > 0 ? (data || {}).map((row, index) => {
                                    return (
                                        <tr
                                            key={`${index}_table`}
                                            className=" border hover:bg-blue-100 hover:text-[#DB1118] cursor-pointer"
                                            onClick={(e) => {
                                                if (!e.target.closest('input[type="checkbox"]')) {
                                                    return extandedTableFunc ? extandedTableFunc.callBack(row) : () => { }
                                                }
                                            }}
                                        >
                                            {selectableRows ? <td className="py-3 px-4 bg-white">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedRows.includes(row[selectItem])}
                                                    onChange={(event) => selectableRowsFunc(event, row[selectItem])}
                                                />
                                            </td> : null}

                                            {Object.keys(columns).map((rowObj, i) => {
                                                const columnValue = columns[rowObj]
                                                //check for extra value in column object 
                                                const extraObj = Array.isArray(columns[rowObj])
                                                const cellValue = extraObj ? columnValue[1](row[rowObj]) : row[rowObj]
                                                const finalCellValue = (!isNaN(cellValue)) ? Math.round((cellValue * 100)) / 100 : cellValue

                                                return (
                                                    <td
                                                        key={i}
                                                        className={`py-3 px-4 " ${(i === 0 && !hideHorzScroll) ? "sticky bg-red-200 text-black left-0 z-10 shadow-md" : ""
                                                            }`}
                                                        style={{ minWidth: `${columnWidth}vw` }} // Apply same column width to cells
                                                    >
                                                        {finalCellValue}
                                                    </td>
                                                )
                                            })}
                                            {/* {deleteRow &&
                                                <td className="px-6 py-4">
                                                    <button onClick={() => deleteRow(row)} className='btn btn-danger'>Delete</button>
                                                </td>
                                            } */}

                                        </tr>
                                    )
                                }) :
                                    <tr> <td className='italic p-3'>No Record found</td></tr>
                            }
                        </tbody>
                    </table>
                </div>

            </div>
            <React.Fragment>
                {pagination && data.length > 0 ?
                    <div className="flex justify-between">
                        <div className="text-right mt-2">
                            <span className="text-sm text-gray-600 mt-2 p-2 mr-2">Total Records: {totalRecord}</span>

                        </div>
                        <nav aria-label="Page navigation example" className='mt-2'>
                            <ul className="inline-flex text-sm">
                                <li>
                                    <select
                                        id="pageSize"
                                        value={pageSize}
                                        onChange={handlePageSizeChange}
                                        className="h-8 px-2 mr-1 text-sm text-gray-500 bg-white border border-gray-300 rounded-sm"
                                    >
                                        <option value={10}>10</option>
                                        <option value={20}>20</option>
                                        <option value={50}>50</option>
                                        <option value={100}>100</option>
                                        <option value={500}>500</option>

                                    </select>
                                </li>
                                <li>
                                    <button
                                        onClick={() => handlePageNumberChange(1)}
                                        className="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 rounded-s-lg hover:bg-gray-100 hover:text-gray-700 fa fa-backward"
                                        disabled={pageNumber === 1}
                                    >
                                    </button>
                                </li>
                                <li>
                                    <button
                                        className="flex items-center justify-center px-3 h-8 ms-0 leading-tight text-gray-500 bg-white border border-e-0 border-gray-300 rounded-s-lg hover:bg-gray-100 hover:text-gray-700"
                                        disabled={pageNumber === 1}
                                        onClick={() => handlePageNumberChange(pageNumber - 1)}
                                    >
                                        Previous
                                    </button>
                                </li>
                                <li>
                                    <button
                                        className="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 rounded-e-lg hover:bg-gray-100 hover:text-gray-700"
                                        disabled={pageNumber === totalPages}
                                        onClick={() => handlePageNumberChange(pageNumber + 1)}
                                    >
                                        Next
                                    </button>
                                </li>
                                <li>
                                    <button
                                        onClick={() => handlePageNumberChange(totalPages)}
                                        className="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 rounded-e-lg hover:bg-gray-100 hover:text-gray-700 fa fa-forward"
                                        disabled={pageNumber === totalPages}
                                    >
                                    </button>
                                </li>

                                <li>
                                    <div className="ml-2 flex items-center justify-center px-5  h-8 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700"> {pageNumber + ' / ' + totalPages}</div>
                                </li>
                            </ul>
                        </nav>
                    </div> : null}

            </React.Fragment>
        </React.Fragment>

    )
}
