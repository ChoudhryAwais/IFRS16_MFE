import { useEffect, useState } from "react";
import Tables from "../../components/Tables/Tables";
import { batchExchangeRatesByIds, getExchangeRatesByCurrency } from "../../apis/Cruds/ExchangeRates";
import { exchangeRateCol } from "../../utils/tableCols/tableCols";
import { ConfirmationSwalPopup, SwalPopup } from "../../middlewares/SwalPopup/SwalPopup";
import { statusCodeMessage } from "../../utils/enums/statusCode";
import { LoadingSpinner } from "../LoadingBar/LoadingBar";

export default function ExchangeRatesTable({ currencyId, selectedDate, refresh }) {
    const [loader, setloader] = useState(false)
    const [innerRefresh, setInnerRefresh] = useState(false)
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [totalRecord, setTotalRecord] = useState(0);
    const [selectedRows, setSelectedRows] = useState([]); // State to manage selected rows

    const fetchRates = async () => {
        setIsLoading(true);
        const res = await getExchangeRatesByCurrency(currencyId);
        if (res && Array.isArray(res)) {
            setData(res);
            setTotalRecord(res.length);
        } else {
            setData([]);
            setTotalRecord(0);
        }
        setIsLoading(false);
    };

    useEffect(() => {
        if (currencyId) fetchRates();
    }, [currencyId, refresh, innerRefresh]);

    // Filter data by selectedDate if provided
    const filteredData = selectedDate
        ? data.filter(row => {
            if (!row.exchangeDate) return false;
            // Compare only the date part (YYYY-MM-DD)
            return row.exchangeDate.slice(0, 10) === selectedDate;
        })
        : data;

    const handleSelectRow = (event, rowId) => {
        event.stopPropagation(); // Stop event propagation to prevent row click event
        if (event.target.checked) {
            if (selectedRows.length > 9)
                return SwalPopup(
                    "Limit Exceeded",
                    statusCodeMessage.limitedAccess,
                    "warning"
                )
            setSelectedRows([...selectedRows, rowId]);
        } else {
            const updatedRows = selectedRows.filter(id => id !== rowId);
            setSelectedRows(updatedRows);
        }
    };

    // Handler for batch endpoint
    const handleBatchDelete = async () => {
        const idsString = selectedRows.join(",");
        setloader(true)
        const res = await batchExchangeRatesByIds(idsString);
        if (res?.message === 'Exchange rates deleted successfully.') {
            setloader(false)
            SwalPopup(
                "Deleted",
                statusCodeMessage.leasesDeleted,
                "success",
                () => {
                    setInnerRefresh(!innerRefresh);
                    setSelectedRows([]); // Clear selected rows after deletion
                }
            )
            return
        }
        SwalPopup(
            "Something went wrong",
            statusCodeMessage.somethingWentWrong,
            "error"
        )
        setloader(false)
    };

    const handleConfirmDelete = () => {
        ConfirmationSwalPopup(
            "Are you sure?",
            statusCodeMessage.deleteConfirmExchange,
            "warning",
            statusCodeMessage.yesDelete,
            () => handleBatchDelete()
        )
    }

    return (
        <div>
            {/* This loader is for lease report */}
            <LoadingSpinner isLoading={loader} />
            <div className='flex justify-end gap-1'>
                <div className="text-[10px] font-xs mt-3 ml-2 text-gray-600 dark:text-gray-200">
                    {selectedRows.length === 0 ? "Select the Rows to perform the action" : "Selected Item: " + selectedRows.length}
                </div>
                <div className="text-right">
                    <button
                        disabled={selectedRows.length === 0}
                        onClick={handleConfirmDelete}
                        type="button"
                        className={(selectedRows.length === 0 ? "cursor-no-drop" : " ") + " py-1 mt-1 px-2 mb-1 text-xs font-sm text-white focus:outline-none bg-red-600  rounded-sm border border-gray-200 hover:bg-red-700 hover:text-white "}>
                        <i class="fa fa-trash"></i>
                    </button>
                </div>
            </div>
            <Tables
                selectableRows={true}
                data={filteredData}
                columns={exchangeRateCol}
                calcHeight="300px"
                isLoading={isLoading}
                totalRecord={totalRecord}
                getPaginatedData={fetchRates}
                pagination={false}
                selectableRowsFunc={handleSelectRow}
                selectedRows={selectedRows}
                selectItem="exchangeRateID"
            />
        </div>
    );
}
