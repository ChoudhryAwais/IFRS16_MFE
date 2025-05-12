import React, { useState } from 'react'
import * as XLSX from 'xlsx';
import { SwalPopup } from '../../middlewares/SwalPopup/SwalPopup';
import { statusCodeMessage } from '../../utils/enums/statusCode';
import { LeaseIRTemplateEnum as LIRT } from '../../utils/enums/leaseTemplateEnum';
import { excelDateToJSDate } from '../../helper/getDate';
import { allowDecimalNumbers } from '../../helper/checkForAllowVal';
import { CommonFileInput } from '../common/commonFileInput';

export default function IrregularLease({ handleIRTable }) {
    const [fileName, setFileName] = useState("");

    const handleFileChange = (event) => {
        const file = event.target.files[0]; // Get the selected file
        const validExtensions = ['.xlsx', '.csv', '.xls']; // Allowed extensions
        if (file && validExtensions.some((ext) => file.name.toLowerCase().endsWith(ext))) {
            setFileName(file.name);
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
                    if (row.length == 0) break;
                    if (allowDecimalNumbers(row[LIRT.rental])) {
                        formattedData.push({
                            serialNo: row[LIRT.serialNo],
                            paymentDate: excelDateToJSDate(row[LIRT.paymentDate]),
                            rental: row[LIRT.rental],
                        });
                    } else {
                        SwalPopup(
                            "Invalid Format",
                            statusCodeMessage.inValidExcelFileExtension,
                            "error"
                        )
                        setFileName('');
                        formattedData = []
                        break; // Exit the loop early
                    }
                }
                if (formattedData.length > 0) {
                    const formModal = {
                        // commencementDate: formattedData[0].paymentDate,
                        // endDate: formattedData[formattedData.length - 1].paymentDate,
                        rental: formattedData[0].rental,
                        customIRTable: formattedData
                    }
                    handleIRTable(formModal)
                }
            };
            reader.readAsArrayBuffer(file);
        } else {
            setFileName(''); // Clear the file name
            SwalPopup(
                "Invalid File",
                statusCodeMessage.inValidExcelFileExtension,
                "error"
            )
        }
        event.target.value = null;
    };
    return (
        <CommonFileInput
            fileName={fileName}
            handleFileChange={handleFileChange}
            content={"Upload Schedule"}
            acceptableFileType={".xlsx, .xls, .csv"}
        />
    )
}
