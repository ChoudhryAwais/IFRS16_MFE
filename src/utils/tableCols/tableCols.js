import { exchangeGainLoss, formatCurrency, formatDate, IRformatCurrency, UnsignedformatCurrency } from "../FormateValues";

export const leaseCols = {
    leaseName: "Lease Name",
    rental: [
        "Rental",
        (cell) => {
            return UnsignedformatCurrency(cell)
        }
    ],
    commencementDate:
        [
            "Commencement Date",
            (cell) => {
                return formatDate(cell)
            }
        ],
    endDate:
        [
            "End Date",
            (cell) => {
                return formatDate(cell)
            }
        ],
    annuity:
        [
            "Annuity",
            (cell) => {
                return cell.toUpperCase()
            }
        ],
    ibr: [
        "IBR",
        (cell) => {
            return (cell + "%")
        }
    ],
    frequency: [
        "Frequency",
        (cell) => {
            return cell.toUpperCase()
        }
    ],
    currencyCode: [
        "Currency",
        (cell) => {
            return cell.toUpperCase()
        }
    ],
    username: "User Name",
};
export const initialRecognitionCols = {
    serialNo: "No.",      // Equivalent to SerialNo (int)
    // Equivalent to PaymentDate (string)
    paymentDate: [
        "Payment Date",
        (cell) => {
            return <div className="w-28">{formatDate(cell)}</div>
        }
    ],
    // Equivalent to Rental (decimal)
    rental: [
        "Rental / GRV",
        (cell) => {
            return IRformatCurrency(cell)
        }
    ],
    // Equivalent to NPV (decimal)
    npv: [
        "NPV",
        (cell) => {
            return IRformatCurrency(cell)
        }
    ],
};
export const leaseLiabilityCols =
{
    leaseLiability_Date: [
        "Date",
        (cell) => {
            return <div className="w-20">{formatDate(cell)}</div>
        }
    ],
    opening: [
        "Opening",
        (cell) => {
            return formatCurrency(cell)
        }
    ],
    interest: [
        "Interest",
        (cell) => {
            return formatCurrency(cell)
        }
    ],
    payment: [
        "Payment",
        (cell) => {
            return formatCurrency(cell)
        }
    ],
    closing: [
        "Closing",
        (cell) => {
            return formatCurrency(cell)
        }
    ],
    exchange_Gain_Loss: [
        "Exchange Gain/Loss",
        (cell) => {
            return exchangeGainLoss(cell)
        }
    ],
}
export const leaseLiabilityAggregationCols =
{
    openingAtStartDate: [
        "Opening",
        (cell) => {
            return formatCurrency(cell)
        }
    ],
    totalInterest: [
        "Interest",
        (cell) => {
            return formatCurrency(cell)
        }
    ],
    totalPayment: [
        "Payment",
        (cell) => {
            return formatCurrency(cell)
        }
    ],
    closingAtEndDate: [
        "Closing",
        (cell) => {
            return formatCurrency(cell)
        }
    ],
}
export const ROUScheduleCols = {
    roU_Date: [
        "Date",
        (cell) => {
            return formatDate(cell)
        }
    ],
    opening: [
        "Opening",
        (cell) => {
            return formatCurrency(cell)
        }
    ],
    amortization: [
        "Amortization",
        (cell) => {
            return formatCurrency(cell)
        }
    ],
    closing: [
        "Closing",
        (cell) => {
            return formatCurrency(cell)
        }
    ],
};
export const ROUScheduleAggregationCols = {
    openingAtStartDate: [
        "Opening",
        (cell) => {
            return formatCurrency(cell)
        }
    ],
    totalAmmortization: [
        "Amortization",
        (cell) => {
            return formatCurrency(cell)
        }
    ],
    closingAtEndDate: [
        "Closing",
        (cell) => {
            return formatCurrency(cell)
        }
    ],
};
export const JournalEntires = {
    jE_Date: [
        "Date",
        (cell) => {
            if (cell == "-")
                return <div>{" "}</div>
            return formatDate(cell)
        }
    ],
    particular: "Particular",
    debit: [
        "Debit",
        (cell) => {
            return UnsignedformatCurrency(cell)
        }
    ],
    credit: [
        "Credit",
        (cell) => {
            return UnsignedformatCurrency(cell)
        }
    ],
};