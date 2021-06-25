import React, {Component, useMemo} from "react";
import NestedTable from "./NestedTable";
import {studyArrayToPatientArray} from "../../../../tools/processResponse";
import {columnPatientsFactory, columnStudyFactory} from "./ColumnFactories";


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
    const columns = useMemo(() => {
        let patientsColumns = columnPatientsFactory(
            hiddenActionBouton,
            hiddenRemoveRow,
            onDelete,
            onModify,
            refresh);
        let studiesColumns = columnStudyFactory(hiddenActionBouton, hiddenRemoveRow, hiddenAccessionNumber, true, true, onDelete, refresh);
        patientsColumns.push({
            accessor: "studies",
            table: studiesColumns
        });
        return patientsColumns;
    }, [
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