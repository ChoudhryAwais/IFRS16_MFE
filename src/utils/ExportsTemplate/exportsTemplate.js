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
        frequency: leaseTypes.toLowerCase(),
        increment: 3,
        idc: null,
        grv: null,
        incrementalFrequency: leaseTypes.toLowerCase(),
        rouOpening: null,
        rouExRate: null,
        currencyID: 1,
        assetType: assetType.toLowerCase()
    },
    {
        leaseName: "Lease 2",
        rental: 100000,
        commencementDate: "2019-01-01",
        endDate: "2024-12-31",
        annuity: "advance/arrears",
        ibr: 12,
        frequency: leaseTypes.toLowerCase(),
        increment: 3,
        idc: null,
        grv: null,
        incrementalFrequency: leaseTypes.toLowerCase(),
        rouOpening: null,
        rouExRate: null,
        currencyID: 1,
        assetType: assetType.toLowerCase()
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
