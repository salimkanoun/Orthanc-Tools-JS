import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import { Col, FormControl, Row } from "react-bootstrap";

import apis from '../../../services/apis';

import {
    DateFilter,
    dateFilter as dFilter,
    InputFilter
} from "../../CommonComponents/RessourcesDisplay/ReactTable/ColumnFilters";
import { InputCell as EditableCell, SelectCell } from "../../CommonComponents/RessourcesDisplay/ReactTable/EditableCells";
import CommonSelectingAndFilteringTable
    from "../../CommonComponents/RessourcesDisplay/ReactTable/CommonSelectingAndFilteringTable";

import ExportCSVButton from "../../CommonComponents/RessourcesDisplay/ExportCSVButton";
import CsvLoader from "./CsvLoader";
import SelectModalities from "../../CommonComponents/SearchForm/SelectModalities";

function CustomHeader(setOverride, type = 'text') {
    return ({ column }) => {
        return (<>
            <p>{column.text}</p>
            <FormControl placeholder={'Override'} type={type} value={column.overrideValue || ''} onChange={event => {
                setOverride(column.id, event.target.value);
            }} />
        </>)
    }
}

function Table({ queries, aets, setOverride, overridesValues, onDataChange, onSelect, onFilter }) {
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
                row: { values },
                column: { id, accessor },
                onDataChange, // This is a custom function that we supplied to our table instance
            }) => {

                const [value, setValue] = React.useState(initialValue);
                const onChange = value => {
                    setValue(value);
                    if (onDataChange) onDataChange(initialValue, value, values, id || accessor);
                }

                return <div>
                    <SelectModalities previousModalities={value} onUpdate={onChange} />
                </div>
            }
        }, {
            accessor: 'Aet',
            text: 'AET',
            options: async () => aets.map(aet => ({ value: aet, label: aet })),
            Cell: SelectCell,
            style: ({ value }) => {
                if (value === '') {
                    return { backgroundColor: '#dc3545' }
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
        onDataChange={onDataChange} />
}

export default ({ switchTab }) => {
    const [overrides, setOverrides] = useState({})
    const [selected, setSelected] = useState([])
    const [filtered, setFiltered] = useState([])

    const dispatch = useDispatch()

    const store = useSelector(state => {
        return {
            aets: state.OrthancTools.OrthancAets,
            queries: state.AutoRetrieveQueryList.queries
        }
    })

    useEffect(() => {
        const getAets = async () => { await apis.aets.getAets() }
        try {
            let aets = getAets()
            dispatch.loadAvailableAETS(aets)
        } catch (error) {
            toast.error(error.statusText, { data: { type: 'notification' } })
        }
    }, [])

    const removeRow = () => {
        let selectedKeyRow = selected.map(x => x.key);
        dispatch.removeQuery(selectedKeyRow);
    }

    const emptyTable = () => {
        dispatch.emptyQueryTable()
    }

    const changeHandler = (initialValue, value, row, column) => {
        dispatch.editCellQuery(row.key, column, value);
    }

    const handleOverride = (label, val) => {
        let overrides = overrides;
        overrides[label] = val;
        setOverrides({ ...overrides })
    }

    const handleSelect = (selected) => {
        setSelected(selected.map(x => x.values))
    }

    const handleFilter = (filtered) => {
        setFiltered(filtered.map(x => x.values.key))
    }

    const query = async () => {
        const data = store.queries.filter(x => filtered.includes(x.key));
        const toastId = toast.info('Starting Studies Queries', { autoClose: false }, { data: { type: 'jobs' } });
        let i = 0

        for (const query of data) {
            i++
            toast.update(toastId, {
                render: 'Query study ' + i + '/' + data.length
            }, { data: { type: 'jobs' } });
            //For each line make dicom query and return results
            try {
                let answeredResults = await makeDicomQuery({ ...query, ...overrides })
                toast.update(toastId, {
                    render: 'Queried study ' + i + '/' + data.length
                }, { data: { type: 'jobs' } });
                //For each results, fill the result table through Redux
                answeredResults.forEach((answer) => {
                    dispatch.addStudyResult(answer)
                })
            } catch (err) {
                console.error(err)
            }

        }

        toast.dismiss(toastId)
        toast.success('Queries completed', { data: { type: 'notification' } })

        switchTab('Result')

    }

    const makeDicomQuery = async (queryParams) => {
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

    return (
        <React.Fragment>
            <Row>
                <Col>
                    <CsvLoader />
                </Col>
            </Row>
            <Row className="text-center mt-5">
                <Col sm={3}>
                    <input type="button" className="otjs-button otjs-button-blue w-7" value="Add"
                        onClick={dispatch.addRow} />
                </Col>
                <Col sm={3}>
                    <ExportCSVButton data={store.queries.map(row => ({
                        'Patient Name': row.PatientName,
                        'Patient ID': row.PatientID,
                        'Accession Number': row.AccessionNumber,
                        'Date From': row.DateFrom,
                        'Date To': row.DateTo,
                        'Study Description': row.StudyDescription,
                        'Modalities': row.ModalitiesInStudy,
                        'AET': row.Aet
                    }
                    ))} />
                </Col>
                <Col sm={6}>
                    <input type="button" className="otjs-button otjs-button-orange m-2 w-10" value="Delete Selected"
                        onClick={removeRow} />


                    <input type="button" className="otjs-button otjs-button-red m-2 w-10" value="Empty Table"
                        onClick={emptyTable} />
                </Col>
            </Row>
            <Row className="text-center mt-5">
                <Col>
                    <Table queries={store.queries} onDataChange={changeHandler} aets={store.aets}
                        setOverride={handleOverride} overridesValues={overrides}
                        onSelect={handleSelect} onFilter={handleFilter} />
                </Col>
            </Row>
            <Row className="text-center mt-5">
                <Col>
                    <input type="button" className="otjs-button otjs-button-blue" value="Query"
                        onClick={query} />
                </Col>
            </Row>

        </React.Fragment>
    )

}