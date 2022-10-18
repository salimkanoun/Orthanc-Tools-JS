import CommonTable from "./CommonTable";
import { useMemo } from "react";
import { commonColumns, patientColumns } from "./ColumnFactories";
import { EditableCell } from "./EditableCells";

export default ({
    patients,
    onDelete,
    onRemovePatient,
    onModify,
    refresh,
    actionBouton,
    removeRow,
    onRowClick,
    onEdit,
    textNameColumn = 'Patient Name',
    textIDColumn = 'Patient ID',
    showEditable = false,
    rowEvents,
    rowStyle,
    pagination
}) => {
    const columns = useMemo(() => [
        commonColumns.RAW,
        patientColumns.ORTHANC_ID,
        patientColumns.NAME(textNameColumn),
        patientColumns.ID(textIDColumn),
        ...(showEditable ? [
            {
                accessor: 'newPatientID',
                Header: 'New Patient ID',
                Cell: ({value, row}) => {
                    return (<EditableCell value={value} onChange={(newValue) => onEdit(row.id, 'newPatientID', newValue)} />)
                },
                style: { whiteSpace: 'normal', wordWrap: 'break-word' }
            },
            {
                accessor: 'newPatientName',
                Header: 'New Patient Name',
                Cell: ({value, row}) => {
                    return (<EditableCell value={value} onChange={(newValue) => onEdit(row.id, 'newPatientName', newValue)} />)
                },
                style: { whiteSpace: 'normal', wordWrap: 'break-word' }
            },
        ] : []),
        ...(actionBouton ? [patientColumns.ACTION(onDelete, onModify, refresh)] : []),
        ...(removeRow ? [patientColumns.REMOVE(onRemovePatient)] : [])
    ], [
        actionBouton,
        removeRow,
        onDelete,
        onModify,
        refresh,
        showEditable,
        textNameColumn,
        textIDColumn]);
    const data = useMemo(() => patients.map(x => ({
        raw: { ...x },
        ...x
    })), [patients]);
    return <CommonTable getRowId={(originalRow) => originalRow.PatientOrthancID} columns={columns} data={data} rowEvents={rowEvents}
        rowStyle={rowStyle} pagination={pagination} onRowClick={onRowClick} />
}
