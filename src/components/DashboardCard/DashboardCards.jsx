import React, { useEffect, useState } from 'react'
import CustomCard from './Card'
import { getLeaseReportSummary } from '../../apis/Cruds/Report';
import { addOneDay, getDateForCards } from '../../helper/getDate';
import { getCompanyProfile, getTotalLeases } from '../../apis/Cruds/sessionCrud';
import { exchangeGainLoss } from '../../helper/FormateValues';

export default function DashboardCards({ allLeases }) {
    const [leaseSummary, setLeaseSummary] = useState({
        data: [],
        loading: false
    })
    const { currentDate } = getDateForCards();
    const activeLeases = allLeases?.length > 0 ? allLeases.filter(lease => lease.isActive === true)?.length : 0
    // Use it get the data on current date
    useEffect(() => {
        const cardsInfo = async () => {
            const companyProfile = getCompanyProfile()
            const model = {
                startDate: addOneDay(companyProfile?.financialYearEnd),
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
            title: "TOTAL LEASES",
            color: "text-purple-600",
            subTitle: currentDate,
            value: ("" + activeLeases) || 0
        },
        {
            title: "LEASE LIABILITY",
            color: "text-yellow-600",
            subTitle: currentDate,
            value: leaseSummary.data?.closingLL || 0
        },
        {
            title: "RIGHT OF USE ASSET",
            subTitle: currentDate,
            color: "text-yellow-600",
            value: leaseSummary.data?.closingROU || 0
        },
        {
            title: "INTEREST EXPENSE",
            subTitle: 'Year to Date (YTD)',
            color: "text-blue-600",
            value: leaseSummary.data?.interest || 0
        },
        {
            title: "AMMOITIZATION EXPENSE",
            subTitle: 'Year to Date (YTD)',
            color: "text-green-600",
            value: leaseSummary.data?.amortization || 0
        },
        {
            title: "PAYMENTS DUE",
            subTitle: 'Year to Date (YTD)',
            color: "text-green-600",
            value: leaseSummary.data?.payment || 0
        },
        {
            title: "EXCHANGE GAIN / (LOSS)",
            subTitle: 'Year to Date (YTD)',
            color: "text-green-600",
            value: exchangeGainLoss(leaseSummary.data?.exchange_Gain_Loss || 0) || 0
        },

    ]

    return (
        <div className='flex flex-wrap w-full'>
            {
                cards.map((card, i) => {
                    return (
                        <div className='w-full md:w-1/4 ' key={i}>
                            <CustomCard card={card} loading={leaseSummary.loading} />
                        </div>
                    )
                })
            }
        </div>
    )
}
