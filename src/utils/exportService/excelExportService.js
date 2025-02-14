import * as XLSX from 'xlsx';

export const handleExcelExport = ({ payload, columnMapping, workBookName, fileName }) => {
    let formattedPayload = payload
    if (columnMapping) {
        formattedPayload = payload.map(item =>
            Object.fromEntries(Object.entries(item).map(([key, value]) => [columnMapping[key] || key, value]))
        );
    }
    // Convert JSON to a worksheet
    const worksheet = XLSX.utils.json_to_sheet(formattedPayload);

    // Create a workbook and append the worksheet
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, workBookName);

    // Create a binary Excel file and trigger the download
    XLSX.writeFile(workbook, `${fileName}.xlsx`);
};