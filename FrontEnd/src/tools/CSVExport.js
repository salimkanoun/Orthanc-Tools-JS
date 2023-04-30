import Papa from 'papaparse'
import { errorMessage } from './toastify';
import { exportFileThroughFilesystemAPI } from '../services/exportDicom';

function getCSVCell(cell) {
    return (cell !== undefined && cell !== null ? cell.toString() : '');
}

function getAllKeys(data) {
    return Array.from(new Set(data.map(line => Object.keys(line)).flat()));
}

/**
 * Convert an array of data to a string containing the CSV formated data
 * @param {{String:any}[]} data to be formated into a csv string
 *      [{"key 1": val1},
 *       {"key 2": val2},
 *       {"key 1": val3, "key 2": val4, ...},
 *       ...]
 * @returns {String} the CSV string
 */
export function getCSVString(data) {
    if (!(data instanceof Array && (data[0] === undefined || data[0] instanceof Object))) throw new TypeError();
    let result = '';
    if (data.length === 0) return result;
    const keys = getAllKeys(data);
    if (keys.length === 0) return result;

    result += keys[0].toString();
    for (let i = 1; i < keys.length; i++) {
        result += ","
        result += keys[i].toString();
    }
    result += '\n';
    let body = data.map(row => {
        let line = '';
        line += getCSVCell(row[keys[0]]);
        for (let i = 1; i < keys.length; i++) {
            line += ","
            line += getCSVCell(row[keys[i]]);
        }
        return line;
    }).join('\n');

    result += body;
    return result;

}

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