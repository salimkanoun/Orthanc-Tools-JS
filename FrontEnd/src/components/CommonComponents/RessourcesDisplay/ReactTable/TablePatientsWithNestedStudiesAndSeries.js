import ActionBouton from "../ActionBouton";

import React, {useMemo} from "react";
import LabelDropdown from "../../../OrthancContent/LabelDropdown";
import apis from "../../../../services/apis";
import NestedTable from "./NestedTable";


function TablePatientsWithNestedStudiesAndSeries({
                                                     patients,
                                                     onDelete,
                                                     onModify,
                                                     refresh,
                                                     hiddenAccessionNumber,
                                                     hiddenActionBouton,
                                                     hiddenRemoveRow,
                                                 }) {
    if (hiddenActionBouton === undefined) hiddenActionBouton = true;
    if (hiddenRemoveRow === undefined) hiddenRemoveRow = true;
    const data = useMemo(() => patients.map(patient => {
        patient.studies = Object.entries(patient.studies)
            .map(([key, val]) => ({StudyOrthancID: key, ...val}))
        patient.studies.forEach(study => {
            study.series = Object.entries(study.series)
                .map(([key, val]) => ({SeriesOrthancID: key, ...val}))
        })
        return patient;
    }), [patients]);
    const columnSerie = [
        {
            accessor: 'SeriesOrthancID',
            show: false,
        }, {
            accessor: 'SeriesDescription',
            Header: 'Series Description',
            sort: true,
            style: {whiteSpace: 'normal', wordWrap: 'break-word'}
        }, {
            accessor: 'Modality',
            Header: 'Modality',
            sort: true
        }, {
            accessor: 'Instances',
            Header: 'Instances',
            sort: true
        }, {
            accessor: 'SeriesNumber',
            Header: 'Series Number',
            sort: true
        }, {
            accessor: 'Action',
            Header: 'Action',
            show: !hiddenActionBouton,
            formatter: ((value, row, index) => <ActionBouton level='series' orthancID={row.SeriesOrthancID}
                                                             parentID={row.StudyID} onDelete={this.props.onDelete}
                                                             row={row} refresh={this.props.refreshSerie}
                                                             hiddenMetadata={false} hiddenCreateDicom={true}/>)
        }, {
            accessor: 'Remove',
            Header: 'Remove',
            show: !hiddenRemoveRow,
            formatter: (cell, row, index) => {
                return <button type="button" className="btn btn-danger" onClick={(e) => {
                    e.stopPropagation();
                    this.props.onDelete(row.SeriesOrthancID)
                }}>Remove</button>
            }

        }];
    const columnStudy = [
        {
            accessor: 'StudyOrthancID',
            Header: 'Study Orthanc ID',
            show: false
        }, {
            accessor: 'StudyInstanceUID',
            Header: 'StudyInstanceUID',
            show: false
        }, {
            accessor: 'StudyDate',
            Header: 'Study Date',
            sort: true,
            editable: false
        }, {
            accessor: 'StudyDescription',
            Header: 'Description',
            sort: true,
            title: (cell, row, rowIndex, colIndex) => row.StudyDescription,
            editable: false,
            style: {whiteSpace: 'normal', wordWrap: 'break-word'}
        }, {
            accessor: 'AccessionNumber',
            Header: 'Accession Number',
            sort: true,
            show: !hiddenAccessionNumber,
            editable: false
        }, {
            accessor: 'Action',
            Header: 'Action',
            show: !hiddenActionBouton,
            Cell: ((row) =>
                    (<>
                        <ActionBouton level='studies' orthancID={row.StudyOrthancID}
                                      StudyInstanceUID={row.StudyInstanceUID} onDelete={onDelete} row={row}
                                      refresh={refresh}/>
                        <LabelDropdown selectedStudiesGetter={async () => {
                            let study = await apis.content.getStudiesDetails(row.StudyOrthancID)
                            return ([{
                                ID: row.StudyOrthancID,
                                MainDicomTags: {
                                    StudyInstanceUID: row.StudyInstanceUID,
                                },
                                PatientMainDicomTags: {
                                    PatientID: row.PatientID
                                },
                                ParentPatient: study.ParentPatient
                            }])
                        }}/>
                    </>)
            ),
            editable: false,
            csvExport: false
        }, {
            accessor: 'Remove',
            Header: 'Remove',
            show: !hiddenRemoveRow,
            Cell: (row) => {
                return <button type="button" className="btn btn-danger" onClick={(e) => {
                    e.stopPropagation();
                    onDelete(row.StudyOrthancID)
                }}>Remove</button>
            },
            editable: false,
            csvExport: false
        }, {
            accessor: "series",
            table: columnSerie
        }];
    const columnsPatient = [
        {
            accessor: 'PatientOrthancID',
            show: false
        }, {
            accessor: 'PatientName',
            Header: 'Patient Name',
            sort: true,
            editable: false,
            style: {whiteSpace: 'normal', wordWrap: 'break-word'}
        }, {
            accessor: 'PatientID',
            Header: 'Patient ID',
            sort: true,
            editable: false,
            style: {whiteSpace: 'normal', wordWrap: 'break-word'}
        }, {
            accessor: 'Action',
            Header: 'Action',
            show: !hiddenActionBouton,
            Cell: (row) => {
                return <ActionBouton level='patients' orthancID={row.PatientOrthancID} onDelete={onDelete}
                                     onModify={onModify} row={row} refresh={refresh}/>
            }
        }, {
            accessor: 'studies',
            table: columnStudy
        }, {
            accessor: 'Remove',
            Header: 'Remove',
            show: !hiddenRemoveRow,
            Cell: (row) => {
                return <button type="button" className="btn btn-danger" onClick={(e) => {
                    e.stopPropagation();
                    onDelete(row.PatientOrthancID)
                }}>Remove</button>
            },
            editable: false
        }];
    const columns = useMemo(() => columnsPatient, [
        onDelete,
        onModify,
        refresh,
        hiddenAccessionNumber,
        hiddenActionBouton,
        hiddenRemoveRow]);

    return <NestedTable columns={columns} data={data} setSelected={() => {
    }} hiddenSelect={true}/>
}


export default TablePatientsWithNestedStudiesAndSeries;