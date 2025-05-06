import * as XLSX from 'xlsx';

export const handleExcelExport = ({ payload, columnMapping, workBookName, fileName, filters = null }) => {
    let formattedPayload = payload;

    if (columnMapping) {
        formattedPayload = payload.map(item =>
            Object.fromEntries(Object.entries(item).map(([key, value]) => [columnMapping[key] || key, value]))
        );
    }

    // Create a new worksheet
    const worksheet = XLSX.utils.aoa_to_sheet([]);

    // If filters are provided, add them to the worksheet first
    if (filters) {
        const filterEntries = Object.entries(filters);
        filterEntries.forEach(([key, value], index) => {
            const rowIndex = index + 1; // Row index starts from 1
            worksheet[`A${rowIndex}`] = { t: 's', v: `${key}: ${value}` }; // Merge key and value into one cell
        });

        // Merge cells for filters to span the length of formattedPayload
        const colLength = Object.keys(formattedPayload[0] || {}).length || 1; // Default to 1 if payload is empty
        for (let i = 1; i <= filterEntries.length; i++) {
            worksheet[`!merges`] = worksheet[`!merges`] || [];
            worksheet[`!merges`].push({ s: { r: i - 1, c: 0 }, e: { r: i - 1, c: colLength - 1 } });
        }

        // Adjust column widths for better readability
        worksheet['!cols'] = Array(colLength).fill({ wch: 20 }); // Set width for all columns
    }

    // Add formattedPayload data after filters
    const payloadStartRow = filters ? Object.keys(filters).length + 2 : 1; // Leave a blank row after filters
    const payloadWorksheet = XLSX.utils.json_to_sheet(formattedPayload, { origin: `A${payloadStartRow}` });

    // Merge the two worksheets
    Object.assign(worksheet, payloadWorksheet);

    // Create a workbook and append the worksheet
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, workBookName);

    // Create a binary Excel file and trigger the download
    XLSX.writeFile(workbook, `${fileName}.xlsx`);
};