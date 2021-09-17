import React, {Component, useMemo} from 'react';
import {connect} from 'react-redux'
import {toast} from 'react-toastify'
import {addRow, editCellQuery, emptyQueryTable, removeQuery} from '../../../actions/TableQuery'
import {addStudyResult} from '../../../actions/TableResult'
import {loadAvailableAETS} from '../../../actions/OrthancTools'

import apis from '../../../services/apis';
import {Col, FormControl, Row} from "react-bootstrap";
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
import SelectModalities from "../../CommonComponents/SearchForm/SelectModalities";

function CustomHeader(setOverride, type = 'text') {
    return ({column}) => {
        return (<>
            <p>{column.text}</p>
            <FormControl placeholder={'Override'} type={type} value={column.overrideValue || ''} onChange={event => {
                setOverride(column.id, event.target.value);
            }}/>
        </>)
    }
}

function Table({queries, aets, setOverride, overridesValues, onDataChange, onSelect, onFilter}) {
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
            Header: CustomHeader(setOverride, 'date'),
            overrideValue: overridesValues['DateFrom'],
            type: 'date',
            Cell: EditableCell
        }, {
            accessor: 'DateTo',
            text: 'Date To',
            Filter: DateFilter(),
            filter: dFilter,
            type: 'date',
            Header: CustomHeader(setOverride, 'date'),
            overrideValue: overridesValues['DateTo'],
            Cell: EditableCell
        }, {
            accessor: 'StudyDescription',
            text: 'Study Description',
            Filter: InputFilter('Study Description'),
            Header,
            overrideValue: overridesValues['StudyDescription'],
            Cell: EditableCell
        }, {
            accessor: 'ModalitiesInStudy',
            text: 'Modalities',
            Filter: InputFilter('Modalities'),
            Header,
            overrideValue: overridesValues['ModalitiesInStudy'],
            Cell: ({
                       value: initialValue,
                       row: {values},
                       column: {id, accessor},
                       onDataChange, // This is a custom function that we supplied to our table instance
                   }) => {

                const [value, setValue] = React.useState(initialValue);
                const onChange = value => {
                    setValue(value);
                    if (onDataChange) onDataChange(initialValue, value, values, id || accessor);
                }

                return <div>
                    <SelectModalities previousModalities={value} onUpdate={onChange}/>
                </div>
            }
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

    return <CommonSelectingAndFilteringTable tableData={data} columns={columns} onSelect={onSelect} onFilter={onFilter}
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

    removeRow = () => {
        let selectedKeyRow = this.state.selected.map(x => x.key);
        this.props.removeQuery(selectedKeyRow);
    }

    emptyTable = () => {
        this.props.emptyQueryTable()
    }

    state = {
        overrides: {},
        selected: [],
        filtered: []
    }

    render = () => {
        return (
            <React.Fragment>
                <Row>
                    <Col>
                        <CsvLoader/>
                    </Col>
                </Row>
                <Row className="text-center mt-5">
                    <Col sm={3}>
                        <input type="button" className="otjs-button otjs-button-blue w-7" value="Add"
                               onClick={this.props.addRow}/>
                    </Col>
                    <Col sm={3}>
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
                    </Col>
                    <Col sm={6}>
                        <input type="button" className="otjs-button otjs-button-orange m-2 w-10" value="Delete Selected"
                               onClick={this.removeRow}/>


                        <input type="button" className="otjs-button otjs-button-red m-2 w-10" value="Empty Table"
                               onClick={this.emptyTable}/>
                    </Col>
                </Row>
                <Row className="text-center mt-5">
                    <Col>
                        <Table queries={this.props.queries} onDataChange={this.changeHandler} aets={this.props.aets}
                               setOverride={this.handleOverride} overridesValues={this.state.overrides}
                               onSelect={this.handleSelect} onFilter={this.handleFilter}/>
                    </Col>
                </Row>
                <Row className="text-center mt-5">
                    <Col>
                        <input type="button" className="otjs-button otjs-button-blue" value="Query"
                               onClick={this.query}/>
                    </Col>
                </Row>

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
    handleFilter = (filtered) => {
        this.setState({filtered: filtered.map(x => x.values.key)});
    }

    query = async () => {
        const data = this.props.queries.filter(x => this.state.filtered.includes(x.key));
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
        return await apis.query.retrieveAnswer(createQueryRessource.ID)
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