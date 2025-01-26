import React, { useState } from 'react'
import * as XLSX from 'xlsx';
import { leaseTemp } from '../../utils/LeaseTemplate/leaseTemplate';
import { getCompanyProfile, getUserInfo } from '../../apis/Cruds/sessionCrud';
import { allowAnnuity, allowFrequencies } from '../../helper/checkForAllowVal';
import { useNavigate } from 'react-router-dom';
import { addBulkLeases } from '../../apis/Cruds/LeaseData';
import { SwalPopup } from '../../middlewares/SwalPopup/SwalPopup';
import { statusCodeMessage } from '../../utils/enums/statusCode';
import { LoadingSpinner } from '../../components/LoadingBar/LoadingBar';

export default function BulkImport() {
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()
    const [fileName, setFileName] = useState('');  // State to store the file name
    const [leasesData, setLeasesData] = useState([]);
    const [error, setError] = useState(''); // State to store error messages
    const user = getUserInfo()
    const company = getCompanyProfile()

    const handleFileChange = (event) => {
        const file = event.target.files[0]; // Get the selected file
        const validExtensions = ['.xlsx', '.csv', '.xls']; // Allowed extensions
        debugger
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
                // Remove the first row (headers)
                for (let i = 1; i < data.length; i++) { // Start from index 1 to skip the header
                    const row = data[i];
                    debugger
                    if (allowFrequencies(row[6]) && (allowFrequencies(row[10]) || row[10] === undefined) && allowAnnuity(row[4])) {
                        formattedData.push({
                            leaseName: row[0],
                            rental: row[1],
                            commencementDate: row[2],
                            endDate: row[3],
                            annuity: row[4],
                            ibr: row[5],
                            frequency: row[6],
                            increment: row[7],
                            idc: row[8] ?? null,  // Null if empty
                            grv: row[9] ?? null,  // Null if empty
                            incrementalFrequency: row[10] ?? null,  // Null if empty
                            companyID: company.companyID,
                            userID: user.userID
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
            };
            reader.readAsArrayBuffer(file);
        } else {
            setFileName(''); // Clear the file name
            setError('Invalid file type. Please upload an .xlsx, .csv, or .xls file.'); // Show error
        }
        event.target.value = null;
    };
    const handleDownload = () => {
        // Convert JSON to a worksheet
        const worksheet = XLSX.utils.json_to_sheet(leaseTemp);

        // Create a workbook and append the worksheet
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Leases');

        // Create a binary Excel file and trigger the download
        XLSX.writeFile(workbook, 'LeaseTemplate.xlsx');
    };
    const handleSubmit = async () => {
        setLoading(true)
        try {
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
                setLoading(false)
            }
        } catch {
            setLoading(false)
            SwalPopup(
                "Try again",
                statusCodeMessage.somethingWentWrong,
                "error"
            )
        }
    }
    console.log("leasesData", leasesData)
    return (
        <React.Fragment>
            <LoadingSpinner isLoading={loading} />
            <div className="relative h-[94vh] bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
                {/* Top-right button */}
                <button
                    className="absolute top-4 right-4 bg-indigo-600 text-white py-2 px-4 rounded-lg shadow-lg hover:bg-indigo-700"
                    onClick={handleDownload}
                >
                    Download Template
                </button>

                {/* Center upload section */}
                <div className="w-full max-w-md p-6 bg-white rounded-2xl shadow-xl text-center">
                    <div className="flex flex-col items-center justify-center">
                        {/* Icon */}
                        <i className="fas fa-cloud-upload-alt text-[#DB1118] text-5xl mb-4"></i>
                        <h2 className="text-xl font-semibold mb-2 text-gray-700">
                            Drag & Drop Your Files Here
                        </h2>
                        <p className="text-sm text-gray-500 mb-4">
                            or click to browse from your device
                        </p>
                    </div>

                    {/* File input */}
                    <label
                        htmlFor="file-upload"
                        className="cursor-pointer w-full flex items-center justify-center px-4 py-6 border-2 border-dashed border-[#DB1118] text-[#DB1118] rounded-lg hover:bg-indigo-50 transition"
                    >
                        <input
                            id="file-upload"
                            type="file"
                            className="hidden"
                            accept=".xlsx,.csv,.xls"
                            onChange={handleFileChange}
                        />
                        <span className="font-medium">
                            {fileName || 'Choose a file'}
                        </span>
                    </label>
                    <button
                        className="bg-indigo-600 mt-4 text-white py-2 px-4 rounded-lg shadow-lg hover:bg-indigo-700"
                        disabled={leasesData.length === 0}
                        onClick={handleSubmit}
                    >
                        Submit Leases
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
