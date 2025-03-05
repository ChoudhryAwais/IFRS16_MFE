import React, { useEffect, useState } from 'react'
import CustomCard from './Card'
import { getLeaseReportSummary } from '../../apis/Cruds/Report';
import { getDateForCards } from '../../helper/getDate';

export default function DashboardCards() {
    const [leaseSummary, setLeaseSummary] = useState({
        data: [],
        loading: false
    })
    const { currentDate, startDate } = getDateForCards();

    // Use it get the data on current date
    useEffect(() => {
        const cardsInfo = async () => {
            const model = {
                startDate: startDate,
                endDate: currentDate,
            }
            setLeaseSummary({
                loading: true
            })
            try {
                const response = await getLeaseReportSummary(model)
                setLeaseSummary({
                    data: response && response[0] || [],
                    loading: false
                })
            } catch {
                setLeaseSummary({
                    loading: false
                })
            }

        }
        cardsInfo()
    }, [])

    const cards = [
        {
            title: "LL CLOSING",
            color: "text-yellow-600",
            subTitle: currentDate,
            value: leaseSummary.data?.closingLL || 0
        },
        {
            title: "ROU CLOSING",
            subTitle: currentDate,
            color: "text-yellow-600",
            value: leaseSummary.data?.closingROU || 0
        },
        {
            title: "INTEREST",
            subTitle: 'Year to Date (YTD)',
            color: "text-blue-600",
            value: leaseSummary.data?.interest || 0
        },
        {
            title: "PAYMENT",
            subTitle: 'Year to Date (YTD)',
            color: "text-green-600",
            value: leaseSummary.data?.payment || 0
        },
    ]

    return (
        <div className='flex gap-3 w-full'>
            {
                cards.map((card, i) => {
                    return (
                        <CustomCard card={card} loading={leaseSummary.loading} key={i} />
                    )
                })
            }

        </div>
    )
}
