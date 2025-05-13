import React, { useState } from 'react'
import * as XLSX from 'xlsx';
import { leaseTemp } from '../../utils/ExportsTemplate/exportsTemplate';
import { getCompanyProfile, getUserInfo } from '../../apis/Cruds/sessionCrud';
import { allowAnnuity, allowFrequencies } from '../../helper/checkForAllowVal';
import { useNavigate } from 'react-router-dom';
import { addBulkLeases } from '../../apis/Cruds/LeaseData';
import { SwalPopup } from '../../middlewares/SwalPopup/SwalPopup';
import { statusCodeMessage } from '../../utils/enums/statusCode';
import { LoadingSpinner } from '../../components/LoadingBar/LoadingBar';
import { handleExcelExport } from '../../utils/exportService/excelExportService';
import { excelDateToJSDate } from '../../helper/getDate';
import { LeaseTemplateEnum as LTE } from '../../utils/enums/leaseTemplateEnum';

export default function BulkImport() {
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()
    const [fileName, setFileName] = useState('');  // State to store the file name
    const [leasesData, setLeasesData] = useState([]);
    const [error, setError] = useState(''); // State to store error messages
    const user = getUserInfo()
    const company = getCompanyProfile()

    const handleFileChange = (event) => {
        event.preventDefault();
        const file = (event?.target?.files || "")[0] ? event.target.files[0] : event.dataTransfer.files[0]; // Get the selected file
        const validExtensions = ['.xlsx', '.csv', '.xls']; // Allowed extensions
        if (file && validExtensions.some((ext) => file.name.toLowerCase().endsWith(ext))) {
            setFileName(file.name);
            setError(''); // Clear any previous error
            // Read the file using FileReader
            const reader = new FileReader();
            reader.onload = (event) => {
                const arrayBuffer = event.target.result;
                const wb = XLSX.read(arrayBuffer, { type: 'array' });
                // Assuming data is in the first sheet
                const ws = wb.Sheets[wb.SheetNames[0]];
                // Parse the data from the sheet into JSON format, skip the first row (headers)
                const data = XLSX.utils.sheet_to_json(ws, { header: 1 }); // Read rows as arrays
                let formattedData = []
                try {
                    // Remove the first row (headers)
                    for (let i = 1; i < data.length; i++) { // Start from index 1 to skip the header
                        const row = data[i];
                        if (row.length == 0) break;
                        if (row[LTE.leaseName] && allowFrequencies(row[LTE.frequency]?.toLowerCase()) && (allowFrequencies(row[LTE.incrementalFrequency]?.toLowerCase()) || row[LTE.incrementalFrequency] === undefined) && allowAnnuity(row[LTE.annuity]?.toLowerCase())) {
                            formattedData.push({
                                leaseName: row[LTE.leaseName],
                                rental: row[LTE.rental],
                                commencementDate: excelDateToJSDate(row[LTE.commencementDate]),
                                endDate: excelDateToJSDate(row[LTE.endDate]),
                                annuity: row[LTE.annuity],
                                ibr: row[LTE.ibr],
                                frequency: row[LTE.frequency],
                                increment: row[LTE.increment],
                                idc: row[LTE.idc] ?? null,  // Null if empty
                                grv: row[LTE.grv] ?? null,  // Null if empty
                                incrementalFrequency: row[LTE.incrementalFrequency] ?? null,  // Null if empty
                                companyID: company.companyID,
                                currencyID: row[LTE.currencyID] ?? company.reportingCurrencyId,
                                assetType: row[LTE.assetType] ?? null, // Null if empty
                                userID: user.userID,
                                rouOpening: row[LTE.rouOpening] ?? null, // Null if empty
                                rouExRate: row[LTE.rouExRate] ?? null, // Null if empty
                                isActive: true,
                            });
                        } else {
                            setError("Incorrect Format");
                            setFileName('');
                            formattedData = []
                            break; // Exit the loop early
                        }
                    }
                    if (formattedData.length > 0) {
                        setLeasesData(formattedData);
                        setError("");
                    }
                } catch (error) {
                    setError("Incorrect File");
                    setFileName('');
                    formattedData = []
                }

            };
            reader.readAsArrayBuffer(file);
        } else {
            setFileName(''); // Clear the file name
            setError('Invalid file type. Please upload an .xlsx, .csv, or .xls file.'); // Show error
        }
        event.target.value = null;
    };
    const handleDownload = () => {
        handleExcelExport({ payload: leaseTemp, workSheetName: "Leases", fileName: "LeaseTemplate" })
    };
    const handleSubmit = async () => {
        setLoading(true)
        const leaseResponse = await addBulkLeases(leasesData)
        if (leaseResponse.length > 0) {
            setLoading(false)
            SwalPopup(
                "Imported Successfully",
                statusCodeMessage.bulkleasesAdded,
                "success",
                () => navigate("/IFRS16Accounting")
            )
        } else {
            SwalPopup(
                "Try again",
                statusCodeMessage.somethingWentWrong,
                "error"
            )
            setLoading(false)
        }
    }
    const handleDragOver = (e) => {
        e.preventDefault();
    };

    return (
        <React.Fragment>
            <LoadingSpinner isLoading={loading} />
            <div className="min-h-[94vh] flex items-center justify-center bg-gradient-to-br from-blue-50 px-4">
                {/* Top-right button */}
                <button
                    className="text-xs absolute m-2 top-4 right-4 bg-indigo-600 text-white py-2 px-4 rounded-sm shadow-lg hover:bg-indigo-700"
                    onClick={handleDownload}
                >
                    Download Template
                </button>
                <div className="bg-white rounded-2xl shadow-2xl p-10 w-full max-w-md text-center transition-all duration-300 hover:shadow-indigo-300">
                    <h2 className="text-xl font-bold mb-4">Upload Leases</h2>
                    <p className="text-xs text-gray-500 mb-6">XLSX, XLS, or CSV formats.</p>

                    <div
                        onDrop={handleFileChange}
                        onDragOver={handleDragOver}
                        className="border-dashed border-[#DB1118] text-[#DB1118] border-2 bg-red-50 rounded-xl p-6 cursor-pointer hover:bg-indigo-100 transition-all"
                    >
                        <label htmlFor="fileUpload" className="block cursor-pointer">
                            <svg
                                className="mx-auto h-12 w-12"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.5"
                                viewBox="0 0 24 24"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                            </svg>
                            <input
                                type="file"
                                id="fileUpload"
                                className="hidden"
                                accept=".xlsx,.xls,.csv"
                                onChange={handleFileChange}
                            />
                            <p className="mt-3">
                                {fileName ? fileName : 'Click or drag file to upload'}
                            </p>
                        </label>
                    </div>

                    <button
                        className={`mt-6 text-sm w-full bg-indigo-600 text-white py-1.5 rounded-sm hover:bg-indigo-700 transition-all ${!fileName ? 'opacity-50 cursor-not-allowed' : ''
                            }`}
                        disabled={!fileName}
                        onClick={handleSubmit}
                    >
                        Upload
                    </button>
                    {/* Error message */}
                    {error && (
                        <p className="text-sm text-red-600 mt-2">
                            {error}
                        </p>
                    )}
                </div>
            </div>

        </React.Fragment>
    )
}
