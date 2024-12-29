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
                formatDate(cell)
            }
        ],

    annuity: "Annuity",
    ibr: "IBR",
    frequency: "Frequency",
    userID: "User ID",
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
        "Rental",
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

export const ROUScheduleCols = {
    date: [
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