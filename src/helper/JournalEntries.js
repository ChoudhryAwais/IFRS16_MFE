import { getLeaseLiabilityForLease } from "../apis/Cruds/LeaseLiability"
import { getRouScheduleForLease } from "../apis/Cruds/RouSchedule"

export const createJournalEntries = async (selectedLease, setJEData) => {
    const leaseLiability = await getLeaseLiabilityForLease(1, 10000, selectedLease.leaseId)
    const rouSchedule = await getRouScheduleForLease(1, 10000, selectedLease.leaseId)
    let startTableDates = 0
    if (selectedLease.annuity == "advance") {
        startTableDates += 1
    }
    const lesaeMustField = leaseLiability.data[0]
    const respectiveROU = rouSchedule.data[0]
    const finalTable = []

    finalTable.push(
        {
            JE_date: respectiveROU.roU_Date,
            particular: "ROU Asset",
            debit: respectiveROU.opening - (selectedLease.idc || 0),
            credit: 0
        },
        {
            JE_date: "-",
            particular: "Lease Liability",
            debit: 0,
            credit: lesaeMustField.opening - lesaeMustField.payment
        }
    )
    // Handle payment
    if (lesaeMustField.payment > 0) {
        finalTable.push({
            JE_date: "-",
            particular: "Bank",
            debit: 0,
            credit: lesaeMustField.payment
        });
    }
    // Handle IDC
    if (selectedLease.idc) {
        finalTable.push(
            {
                JE_date: lesaeMustField.leaseLiability_Date,
                particular: "ROU Asset",
                debit: selectedLease.idc,
                credit: 0
            },
            {
                JE_date: "-",
                particular: "Bank (IDC)",
                debit: 0,
                credit: selectedLease.idc
            }
        );
    }
    for (let i = startTableDates; i < leaseLiability.data.length; i++) {
        const leaseData = leaseLiability.data[i];
        const rouData = rouSchedule.data[i];
        // Create and push interest and lease interest journal entries
        finalTable.push(
            {
                JE_date: leaseData.leaseLiability_Date,
                particular: "Interest Expense",
                debit: leaseData.interest,
                credit: 0
            },
            {
                JE_date: "-",
                particular: "Lease Liability",
                debit: 0,
                credit: leaseData.interest
            }
        );
        // Create and push amortization and ROU journal entries
        finalTable.push(
            {
                JE_date: rouData.roU_Date,
                particular: "Amortization Expense",
                debit: rouData.amortization,
                credit: 0
            },
            {
                JE_date: "-",
                particular: "ROU Asset",
                debit: 0,
                credit: rouData.amortization
            }
        );
        // Handle payment entries if payment is greater than 0
        if (leaseData.payment > 0) {
            finalTable.push(
                {
                    JE_date: leaseData.leaseLiability_Date,
                    particular: "Lease Liability",
                    debit: leaseData.payment,
                    credit: 0
                },
                {
                    JE_date: "-",
                    particular: "Bank",
                    debit: 0,
                    credit: leaseData.payment
                }
            );
        }

    }

    console.log(finalTable.length)
    setJEData(finalTable)
}   