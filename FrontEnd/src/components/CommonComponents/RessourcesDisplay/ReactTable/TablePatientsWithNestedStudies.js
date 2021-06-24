import ActionBouton from "../ActionBouton";

import React, {Component, useMemo} from "react";
import LabelDropdown from "../../../OrthancContent/LabelDropdown";
import apis from "../../../../services/apis";
import NestedTable from "./NestedTable";
import {studyArrayToPatientArray} from "../../../../tools/processResponse";


function isObject(item) {
    return (item && typeof item === 'object' && !Array.isArray(item));
}

function mergeDeep(target, ...sources) {
    if (!sources.length) return target;
    const source = sources.shift();

    if (isObject(target) && isObject(source)) {
        for (const key in source) {
            if (isObject(source[key])) {
                if (!target[key]) Object.assign(target, {[key]: {}});
                mergeDeep(target[key], source[key]);
            } else {
                Object.assign(target, {[key]: source[key]});
            }
        }
    }

    return mergeDeep(target, ...sources);
}

function TablePatientsWithNestedStudies({
                                            ref,
                                            studies,
                                            onDelete,
                                            onModify,
                                            refresh,
                                            hiddenAccessionNumber,
                                            hiddenActionBouton,
                                            hiddenRemoveRow,
                                            setSelected,
                                            hiddenSelect
                                        }) {
    const data = useMemo(() => studyArrayToPatientArray(studies).map(patient => {
        patient.studies = Object.entries(patient.studies).map(([key, val]) => ({StudyOrthancID: key, ...val}))
        return patient;
    }), [studies]);
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

    return <NestedTable columns={columns} data={data} setSelected={setSelected} hiddenSelect={hiddenSelect}/>
}

class TablePatientsWithNestedStudiesWrapper extends Component {
    selected = {
        root: [],
        sub: []
    }

    getSelectedRessources() {
        let studies = [];
        return {
            selectedPatients: this.selected.root.map(x => x.PatientOrthancID),
            selectedStudies: this.selected.sub.map(x => x.root).flat().map(x => x.StudyOrthancID)
        };
    }

    render() {
        return <TablePatientsWithNestedStudies {...this.props} setSelected={(s) => {
            this.selected = mergeDeep(this.selected, s);
            if (this.props.setSelectedStudies) this.props.setSelectedStudies(this.selected.root
                .map(patient => patient.studies)
                .flat().concat(
                    this.selected.sub
                        .map(x => x.root)
                        .flat()
                        .map(x => x.StudyOrthancID)));
        }}/>
    }
}

export default TablePatientsWithNestedStudiesWrapper;