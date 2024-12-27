import React from 'react'

export default function Tables(props) {
    const { data, columns, extandedTableFunc, calcHeight } = props
    const TableMaxHeight = `calc(100vh - ${calcHeight})`
    
    return (
        <React.Fragment>
            <div className="shadow-md sm:rounded-lg overflow-auto" style={{ maxHeight: TableMaxHeight }}>
                <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-100 dark:bg-gray-700 dark:text-gray-300 top-0 sticky ">
                        <tr>
                            {Object.values(columns).map(col => {
                                return <th className="px-6 py-3">{col}</th>
                            })}
                            {/* <th className="px-6 py-3">
                                    Action
                                </th> */}
                        </tr>
                    </thead>
                    <tbody>
                        {data.length > 0 ? (data || {}).map((row, index) => {
                            return (
                                <tr
                                    key={index}
                                    className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-blue-100 hover:text-blue-700 cursor-pointer"
                                    onClick={() => extandedTableFunc ? extandedTableFunc.callBack(row[extandedTableFunc.primaryKey]) : null}
                                >
                                    {Object.keys(columns).map(rowObj => {
                                        const columnValue = columns[rowObj]
                                        //check for extra value in column object 
                                        const extraObj = Array.isArray(columns[rowObj])
                                        const cellValue = extraObj ? columnValue[1](row[rowObj]) : row[rowObj]
                                    
                                        const finalCellValue = (!isNaN(cellValue)) ? Math.round((cellValue * 100)) / 100 : cellValue

                                        return (
                                            <td className="px-6 py-4" style={{ width: extraObj ? "150px" : "" }}>{finalCellValue}</td>
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
                            <div className='italic m-3'>No Record found</div>
                        }


                    </tbody>
                </table>
            </div>


        </React.Fragment>

    )
}
