import { ifrsServieForFile } from "../Gateways/ifrsServiceForFile"
import { ifrsService } from "../Gateways/ifrsService"
import { getCompanyProfile } from "./sessionCrud"


export const addNewLease = async (leaseModal) => {
    try {
        const response = await ifrsService(`/LeaseFormData`, "POST", leaseModal)
        return response
    } catch (error) {
        return error
    }
}

export const addBulkLeases = async (leases) => {
    try {
        const response = await ifrsService(`/LeaseFormData/BulkImport`, "POST", leases)
        return response
    } catch (error) {
        return error
    }
}
export const getAllLeases = async (pageNumber, pageSize, leaseName) => {
    const companyProfile = getCompanyProfile()
    const payload = {
        pageNumber: pageNumber,
        pageSize: pageSize,
        companyId: companyProfile.companyID,
        leaseName: leaseName
    }
    try {
        const response = await ifrsService(`/LeaseFormData/GetAllLeases`, "POST", payload)
        return response
    } catch (error) {
        return error
    }
}
export const getLeaseById = async (leaseId) => {
    try {
        const response = await ifrsService(`/LeaseFormData/GetLeaseById/${leaseId}`, "GET")
        return response
    } catch (error) {
        return error
    }
}

export const getAllLeasesforCompany = async () => {
    const companyProfile = getCompanyProfile()
    try {
        const response = await ifrsService(`/LeaseFormData/GetAllLeasesForCompany?companyId=${companyProfile.companyID}`, "GET")
        return response
    } catch (error) {
        return error
    }
}
export const deleteLeases = async (leasesId) => {
    try {
        const response = await ifrsService(`/LeaseFormData/Delete`, "POST", leasesId)
        return response
    } catch (error) {
        return error
    }
}
export const terminateLease = async (payload) => {
    try {
        const response = await ifrsService(`/LeaseFormData/TerminateLease`, "POST", payload)
        return response
    } catch (error) {
        return error
    }
}

export const modifyLease = async (payload) => {
    try {
        const response = await ifrsService(`/LeaseFormData/ModifyLease`, "POST", payload)
        return response
    } catch (error) {
        return error
    }
}

export const addLeaseContract = async (leaseContractModal) => {
    const response = await ifrsServieForFile(`/LeaseFormData/UploadLeaseContract`, "POST", leaseContractModal)
    return response
}

export const getLeaseContract = async (leaseId) => {
    const response = await ifrsServieForFile(`/LeaseFormData/GetLeaseContract/${leaseId}`, "GET")
    return response
}

export const updateLeaseFormData = async (leaseId, leaseFormData) => {
    try {
        const response = await ifrsService(`/LeaseFormData/UpdateLease/${leaseId}`, "PUT", leaseFormData);
        return response;
    } catch (error) {
        return error;
    }
};

export const updateLeaseContract = async (leaseId, contractDto) => {
    try {
        const formData = new FormData();
        formData.append('LeaseId', leaseId);
        formData.append('ContractDoc', contractDto);
        const response = await ifrsServieForFile(`/LeaseFormData/UpdateLeaseContract/${leaseId}`, "PUT", formData);
        return response;
    } catch (error) {
        return error;
    }
};