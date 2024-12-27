export const leaseCols = {
    leaseName: "Lease Name",
    rental: "Rental",
    commencementDate:
        [
            "Commencement Date",
            (cell) => {
                const formateDate = new Date(cell)
                return (<div className="w-16">{formateDate.toLocaleDateString()}</div>)
            }
        ],
    endDate:
        [
            "End Date",
            (cell) => {
                const formateDate = new Date(cell)
                return (<div className="w-16">{formateDate.toLocaleDateString()}</div>)
            }
        ],

    annuity: "Annuity",
    ibr: "IBR",
    frequency: "Frequency",
    userID: "User ID",
};

export const initialRecognitionCols ={
    serialNo: "No.",      // Equivalent to SerialNo (int)
    paymentDate: "Payment Date",  // Equivalent to PaymentDate (string)
    rental: "Rental",      // Equivalent to Rental (decimal)
    npv: "NPV"          // Equivalent to NPV (decimal)
};