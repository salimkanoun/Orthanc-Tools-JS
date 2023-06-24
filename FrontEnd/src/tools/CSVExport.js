import Papa from 'papaparse'
import { errorMessage } from './toastify';
import { exportFileThroughFilesystemAPI } from '../services/exportDicom';

export const exportCsv = (data, fileType, filename) => {
    if (data.length === 0) {
        errorMessage('No data to export')
        return
    }

    // Parse object data to CSV format with Papaparse
    const csvString = Papa.unparse(data, { quotes: true })

    // Create Blob from data and prefered fileType
    const blob = new Blob([csvString], { type: fileType })

    // Export file to stream
    exportFileThroughFilesystemAPI(blob.stream(), 'text/csv', filename, false)
}