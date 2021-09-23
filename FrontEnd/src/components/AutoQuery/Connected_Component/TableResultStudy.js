import React, {useMemo, useState} from 'react';
import {connect} from 'react-redux'
import {Col, Row} from 'react-bootstrap'
import {addStudiesFiltered, emptyResultsTable, removeResult} from '../../../actions/TableResult'
import {
    commonColumns,
    patientColumns,
    seriesColumns,
    studyColumns
} from "../../CommonComponents/RessourcesDisplay/ReactTable/ColumnFactories";
import CommonSelectingSortingFilteringTable
    from "../../CommonComponents/RessourcesDisplay/ReactTable/CommonSelectingSortingFilteringTable";
import ExportCSVButton from '../../CommonComponents/RessourcesDisplay/ExportCSVButton'


/**
 * Result Table of Query for Study Level
 */
function TableResultStudy({results, emptyResultsTable, removeResult, addStudiesFiltered}) {
    const columns = useMemo(() => {
        return [
            commonColumns.RAW,
            studyColumns.ORTHANC_ID,
            studyColumns.INSTANCE_UID,
            studyColumns.ANONYMIZED_FROM,
            patientColumns.NAME(),
            patientColumns.ID(),
            studyColumns.DATE,
            studyColumns.DESCRIPTION,
            studyColumns.REQUESTED_PROCEDURE,
            studyColumns.MODALITIES,
            studyColumns.NB_STUDY_SERIES,
            seriesColumns.NB_SERIES_INSTANCES,
            commonColumns.AET,
        ]
    }, []);
    const data = useMemo(() => Object.values(results).map(result => ({
        ...result,
        raw: result
    })), [results])

    const [selected, setSelected] = useState([]);
    return (
        <div>
            <Row className="text-center">

                <Col sm={6}>
                    <ExportCSVButton className='m-2' data={selected.map(({values: {raw}}) => raw)}/>
                </Col>
                <Col sm={6}>
                    <input type="button" className="otjs-button otjs-button-orange w-10 me-3" value="Delete Selected"
                           onClick={() => {
                               removeResult(selected.map(x => x.values.StudyInstanceUID))
                           }}/>
                    <input type="button" className="otjs-button otjs-button-red w-10 ms-3" value="Empty Table"
                           onClick={emptyResultsTable}/>
                </Col>
            </Row>

            <div className="mt-5">
                <CommonSelectingSortingFilteringTable tableData={data} columns={columns} onSelect={setSelected}
                                                      onFilter={filtered => {
                                                          let filteredStudiesUID = filtered.map(row => row.values.raw.StudyInstanceUID)
                                                          addStudiesFiltered(filteredStudiesUID)
                                                      }} pagination/>
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