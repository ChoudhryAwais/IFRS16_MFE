import { useEffect, useState } from "react";
import Tables from "../../components/Tables/Tables";
import { getExchangeRatesByCurrency } from "../../apis/Cruds/ExchangeRates";
import { exchangeRateCol } from "../../utils/tableCols/tableCols";

export default function ExchangeRatesTable({ currencyId, selectedDate }) {
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [totalRecord, setTotalRecord] = useState(0);

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
    }, [currencyId]);

    // Filter data by selectedDate if provided
    const filteredData = selectedDate
        ? data.filter(row => {
            if (!row.exchangeDate) return false;
            // Compare only the date part (YYYY-MM-DD)
            return row.exchangeDate.slice(0, 10) === selectedDate;
        })
        : data;

    return (
        <div>
            <Tables
                data={filteredData}
                columns={exchangeRateCol}
                calcHeight="290px"
                isLoading={isLoading}
                totalRecord={totalRecord}
                getPaginatedData={fetchRates}
                pagination={false}
            />
        </div>
    );
}
