import { formatCurrency, formatDate } from "../FormateValues";

export const leaseCols = {
    leaseName: "Lease Name",
    rental: [
        "Rental",
        (cell) => {
            return formatCurrency(cell)
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
            return formatCurrency(cell)
        }
    ],
    // Equivalent to NPV (decimal)
    npv: [
        "NPV",
        (cell) => {
            return formatCurrency(cell)
        }
    ],
};

export const leaseLiabilityCols =
{
    leaseLiability_Date: [
        "Date",
        (cell) => {
            return <div className="w-32">{formatDate(cell)}</div>
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

export const JournalEntires = {
    JE_date: [
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
            return formatCurrency(cell)
        }
    ],
    credit: [
        "Credit",
        (cell) => {
            return formatCurrency(cell)
        }
    ],
};