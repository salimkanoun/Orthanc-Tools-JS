import React, {useMemo, useState} from 'react';
import {connect} from 'react-redux'

import {addStudiesFiltered, emptyResultsTable, removeResult} from '../../../actions/TableResult'
import {columnStudyFactory} from "../../CommonComponents/RessourcesDisplay/ReactTable/ColumnFactories";
import CommonSelectingSortingFilteringTable
    from "../../CommonComponents/RessourcesDisplay/ReactTable/CommonSelectingSortingFilteringTable";
import ExportCSVButton from '../../CommonComponents/RessourcesDisplay/ExportCSVButton'


/**
 * Result Table of Query for Study Level
 */
function TableResultStudy({results, emptyResultsTable, removeResult, addStudiesFiltered}) {
    const columns = useMemo(() => {
        return [
            ...columnStudyFactory(true, true, false, false, false, null, null, false, true, null, true), {
                accessor: 'NumberOfStudyRelatedSeries',
                Header: 'Series'
            }, {
                accessor: 'NumberOfSeriesRelatedInstances',
                Header: 'Instances'
            },
            {
                accessor: 'OriginAET',
                Header: 'AET'
            }
        ]
    }, []);
    const data = useMemo(() => Object.values(results).map(result => ({
        ...result,
        raw: result
    })), [results])

    const [selected, setSelected] = useState([]);
    return (
        <div>
            <input type="button" className="btn btn-warning m-2" value="Delete Selected" onClick={() => {
                removeResult(selected.map(x => x.key))
            }}/>
            <input type="button" className="btn btn-danger m-2" value="Empty Table" onClick={emptyResultsTable}/>
            <ExportCSVButton className='m-2' data={selected.map(({values: {raw, ...values}}) => raw)}/>
            <div className="mt-5">
                <CommonSelectingSortingFilteringTable tableData={data} columns={columns} onSelect={setSelected}
                                                      onFilter={filtered => {
                                                          let filteredStudiesUID = filtered.map(row => row.values.StudyInstanceUID)
                                                          addStudiesFiltered(filteredStudiesUID)
                                                      }}/>
            </div>
        </div>)
}


const mapStateToProps = (state) => {
    return {
        results: state.AutoRetrieveResultList.results,
        filters: state.AutoRetrieveResultList.filters
    }
}

const mapDispatchToProps = {
    emptyResultsTable,
    removeResult,
    addStudiesFiltered
}

export default connect(mapStateToProps, mapDispatchToProps)(TableResultStudy);