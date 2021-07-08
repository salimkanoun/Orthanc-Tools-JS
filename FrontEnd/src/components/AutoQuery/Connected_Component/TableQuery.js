import React, {Component, useMemo} from 'react';
import {connect} from 'react-redux'
import {toast} from 'react-toastify'
import {addRow, editCellQuery, emptyQueryTable, removeQuery} from '../../../actions/TableQuery'
import {addStudyResult} from '../../../actions/TableResult'
import {loadAvailableAETS} from '../../../actions/OrthancTools'

import apis from '../../../services/apis';
import {FormControl} from "react-bootstrap";
import {
    DateFilter,
    dateFilter as dFilter,
    InputFilter
} from "../../CommonComponents/RessourcesDisplay/ReactTable/ColumnFilters";
import {InputCell as EditableCell, SelectCell} from "../../CommonComponents/RessourcesDisplay/ReactTable/EditableCells";
import CommonSelectingAndFilteringTable
    from "../../CommonComponents/RessourcesDisplay/ReactTable/CommonSelectingAndFilteringTable";

import ExportCSVButton from "../../CommonComponents/RessourcesDisplay/ExportCSVButton";
import CsvLoader from "./CsvLoader";

function CustomHeader(setOverride) {
    return ({column}) => {
        return (<>
            <p>{column.text}</p>
            <FormControl placeholder={'Override'} value={column.overrideValue || ''} onChange={event => {
                setOverride(column.id, event.target.value);
            }}/>
        </>)
    }
}

function Table({queries, aets, setOverride, overridesValues, onDataChange, onSelect}) {
    const columns = useMemo(() => {
        const Header = CustomHeader(setOverride);
        const columns = [{
            accessor: 'key',
            show: false
        }, {
            accessor: 'PatientName',
            text: 'Patient Name',
            Filter: InputFilter('Patient Name'),
            Header,
            overrideValue: overridesValues['PatientName'],
            Cell: EditableCell
        }, {
            accessor: 'PatientID',
            text: 'Patient ID',
            Filter: InputFilter('Patient ID'),
            overrideValue: overridesValues['PatientID'],
            Header,
            Cell: EditableCell
        }, {
            accessor: 'AccessionNumber',
            text: 'Accession Number',
            Filter: InputFilter('Accession Number'),
            Header,
            overrideValue: overridesValues['AccessionNumber'],
            Cell: EditableCell
        }, {
            accessor: 'DateFrom',
            text: 'Date From',
            Filter: DateFilter(),
            filter: dFilter,
            Header,
            overrideValue: overridesValues['DateFrom'],
            Cell: EditableCell
        }, {
            accessor: 'DateTo',
            text: 'Date To',
            Filter: DateFilter(),
            filter: dFilter,
            Header,
            overrideValue: overridesValues['DateTo'],
            Cell: EditableCell
        }, {
            accessor: 'StudyDescription',
            text: 'Study Description',
            Filter: InputFilter(),
            Header,
            overrideValue: overridesValues['StudyDescription'],
            Cell: EditableCell
        }, {
            accessor: 'ModalitiesInStudy',
            text: 'Modalities',
            Filter: InputFilter(),
            Header,
            overrideValue: overridesValues['ModalitiesInStudy'],
            Cell: EditableCell
        }, {
            accessor: 'Aet',
            text: 'AET',
            options: async () => aets.map(aet => ({value: aet, label: aet})),
            Cell: SelectCell,
            style: ({value}) => {
                if (value === '') {
                    return {backgroundColor: '#dc3545'}
                }
            },
            Filter: InputFilter(),
            Header,
            overrideValue: overridesValues['Aet'],
        }];
        return columns;
    }, [overridesValues, setOverride, aets]);
    const data = useMemo(() => queries, [queries]);

    return <CommonSelectingAndFilteringTable tableData={data} columns={columns} onSelect={onSelect}
                                             onDataChange={onDataChange}/>
}

class TableQuery extends Component {

    componentDidMount = async () => {
        try {
            let aets = await apis.aets.getAets()
            this.props.loadAvailableAETS(aets)
        } catch (error) {
            toast.error(error.statusText)
        }
    }

    deselectAll = () => {
        this.node.selectionContext.selected = []
    }

    removeRow = () => {
        let selectedKeyRow = this.node.selectionContext.selected
        this.props.removeQuery(selectedKeyRow)
    }

    emptyTable = () => {
        this.props.emptyQueryTable()
    }

    state = {
        overrides: {},
        selected: []
    }

    render = () => {
        return (
            <React.Fragment>
                <div>
                    <div className="row">
                        <div className="col-sm">
                            <CsvLoader/>
                            <input type="button" className="btn btn-success m-2" value="Add"
                                   onClick={this.props.addRow}/>
                            <input type="button" className="btn btn-warning m-2" value="Delete Selected"
                                   onClick={this.removeRow}/>
                            <input type="button" className="btn btn-danger m-2" value="Empty Table"
                                   onClick={this.emptyTable}/>
                            <ExportCSVButton data={this.props.queries.map(row => ({
                                    'Patient Name': row.PatientName,
                                    'Patient ID': row.PatientID,
                                    'Accession Number': row.AccessionNumber,
                                    'Date From': row.DateFrom,
                                    'Date To': row.DateTo,
                                    'Study Description': row.StudyDescription,
                                    'Modality': row.ModalitiesInStudy,
                                    'AET': row.Aet
                                }
                            ))}/>
                        </div>
                    </div>
                    <div className="mt-5">
                        <Table queries={this.props.queries} onDataChange={this.changeHandler} aets={this.props.aets}
                               setOverride={this.handleOverride} overridesValues={this.state.overrides}
                               onSelect={this.handleSelect}/>
                    </div>
                </div>
                <div className="text-center">
                    <input type="button" className="btn btn-primary" value="Query" onClick={this.query}/>
                </div>

            </React.Fragment>
        )
    }

    changeHandler = (initialValue, value, row, column) => {
        this.props.editCellQuery(row.key, column, value);
    }

    handleOverride = (label, val) => {
        let overrides = this.state.overrides;
        overrides[label] = val;
        this.setState({overrides: {...overrides}})
    }

    handleSelect = (selected) => {
        this.setState({selected: selected.map(x => x.values)});
    }

    query = async () => {
        const data = this.state.selected;
        const toastId = toast.info('Starting Studies Queries', {autoClose: false});
        let i = 0

        for (const query of data) {
            i++
            toast.update(toastId, {
                render: 'Query study ' + i + '/' + data.length
            });
            //For each line make dicom query and return results
            try {
                let answeredResults = await this.makeDicomQuery({...query, ...this.state.overrides})
                toast.update(toastId, {
                    render: 'Queried study ' + i + '/' + data.length
                });
                //For each results, fill the result table through Redux
                answeredResults.forEach((answer) => {
                    this.props.addStudyResult(answer)
                })
            } catch (err) {
                console.error(err)
            }

        }

        toast.dismiss(toastId)
        toast.success('Queries completed')

        this.props.switchTab('Result')

    }

    makeDicomQuery = async (queryParams) => {
        //Prepare Date string for post data
        let DateString = '';
        queryParams.DateFrom = queryParams.DateFrom.split('-').join('')
        queryParams.DateTo = queryParams.DateTo.split('-').join('')

        if (queryParams.DateFrom !== '' && queryParams.DateTo !== '') {
            DateString = queryParams.DateFrom + '-' + queryParams.DateTo
        } else if (queryParams.DateFrom === '' && queryParams.DateTo !== '') {
            DateString = '-' + queryParams.DateTo
        } else if (queryParams.DateFrom !== '' && queryParams.DateTo === '') {
            DateString = queryParams.DateFrom + '-'
        }

        //Prepare POST payload for query (follow Orthanc APIs)
        let queryPost = {
            Level: 'Study',
            Query: {
                PatientName: queryParams.PatientName,
                PatientID: queryParams.PatientID,
                StudyDate: DateString,
                ModalitiesInStudy: queryParams.ModalitiesInStudy,
                StudyDescription: queryParams.StudyDescription,
                AccessionNumber: queryParams.AccessionNumber,
                NumberOfStudyRelatedInstances: '',
                NumberOfStudyRelatedSeries: ''
            }
        }

        //Call Orthanc API to make Query
        let createQueryRessource = await apis.query.dicomQuery(queryParams.Aet, queryPost)
        //Call OrthancToolsJS API to get a parsed answer of the results
        let queryAnswer = await apis.query.retrieveAnswer(createQueryRessource.ID)

        return queryAnswer
    }

}

const mapStateToProps = (state) => {
    return {
        aets: state.OrthancTools.OrthancAets,
        queries: state.AutoRetrieveQueryList.queries
    }
}

const mapDispatchToProps = {
    loadAvailableAETS,
    addRow,
    removeQuery,
    emptyQueryTable,
    editCellQuery,
    addStudyResult,
};

export default connect(mapStateToProps, mapDispatchToProps)(TableQuery);