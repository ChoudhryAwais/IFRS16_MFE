import { getCompanyProfile } from "../../apis/Cruds/sessionCrud";
const { leaseTypes, assetType } = getCompanyProfile()
export const leaseTemp = [
    {
        leaseName: "Lease 1",
        rental: 100000,
        commencementDate: "2019-01-01",
        endDate: "2024-12-31",
        annuity: "advance/arrears",
        ibr: 12,
        frequency: "annual, bi-annual, quarterly, monthly, irregular",
        increment: 3,
        idc: null,
        grv: null,
        incrementalFrequency: "annual, bi-annual, quarterly, monthly, irregular",
        rouOpening: null,
        rouExRate: null,
        currencyCode: "USD",
        assetType: "BTS Sites,Land and buildings"
    },
    {
        leaseName: "Lease 2",
        rental: 100000,
        commencementDate: "2019-01-01",
        endDate: "2024-12-31",
        annuity: "advance/arrears",
        ibr: 12,
        frequency: "annual, bi-annual, quarterly, monthly, irregular",
        increment: 3,
        idc: null,
        grv: null,
        incrementalFrequency: "annual, bi-annual, quarterly, monthly, irregular",
        rouOpening: null,
        rouExRate: null,
        currencyCode: "USD",
        assetType: "BTS Sites,Land and buildings"
    }
];
export const leaseIRTemp = [
    {
        serialNo: 1,
        paymentDate: "2019-01-01",
        rental: 100000,

    },
    {
        serialNo: 2,
        rental: 100000,
        paymentDate: "2020-01-01",
    }
];
