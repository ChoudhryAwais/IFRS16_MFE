export const statusCode = {
    unauthorized: 401,
    contentCreated: 201,
    badRequest: 400
}

export const statusCodeMessage = {
    unauthorized: "Invalid credentials",
    somethingWentWrong: "Something went Wrong",
    alreadyExist: "User already exis",
    userCreated: "New user has been created!",
    userUpdated: "User has been updated successfully!",
    userUpdatedFail: "Failed to update user!",
    leaseAdded: "New lease has been added!",
    bulkleasesAdded: "Leases Imported Successfully!",
    leasesDeleted: "Leases Deleted Successfully!",
    deleteConfirm: "Are you sure you want to delete this lease?",
    deleteConfirmExchange: "Are you sure you want to delete selected rates?",
    yesDelete: "Yes, delete it!",
    terminateLease: "Are you sure you want to terminate this lease?",
    termiated: "Yes, Terminate!",
    leaseTermiated: "Lease has been terminated successfully!",
    download: "Do you want to download the Custom Schedule Template?",
    yes: "Yes",
    inValidExcelFileExtension: 'Invalid file type. Please upload an .xlsx, .csv, or .xls file.',
    inValidPDFFileExtension: 'Invalid file type. Please upload a .pdf file.',
    leaseModified: "Lease has been modified successfully!",
    leaseUpdated: "Lease has been updated successfully!",
    allowPopup: "Please allow popups to view the PDF.",
    contractNotAvailable: "No contract available for this lease.",
    limitedAccess: "You can select a maximum of 10 leases at a time."
}

export const apiResponses = {
    leaseContractUploaded: "Lease contract uploaded successfully.",
    logoutSuccess: "Logged out successfully."
}