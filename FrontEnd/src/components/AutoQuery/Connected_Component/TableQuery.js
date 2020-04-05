import React, { Component } from 'react';
import { connect } from 'react-redux'

import BootstrapTable from 'react-bootstrap-table-next';
import filterFactory, { textFilter, dateFilter } from 'react-bootstrap-table2-filter';
import paginationFactory from 'react-bootstrap-table2-paginator';
import cellEditFactory, { Type } from 'react-bootstrap-table2-editor'
import ToolkitProvider, { CSVExport } from 'react-bootstrap-table2-toolkit';

import ColumnEditor from './ColumnEditor'
import { removeQuery, emptyQueryTable, addRow } from '../../../actions/TableQuery'
import { addStudyResult } from '../../../actions/TableResult'
import { loadAvailableAETS } from '../../../actions/OrthancTools'
import CsvLoader from './CsvLoader'
import SelectModalities from '../Component/SelectModalities';

import apis from '../../../services/apis';

const { ExportCSVButton } = CSVExport;

class TableQuery extends Component {

  

  constructor(props) {
    super(props)
    this.removeRow = this.removeRow.bind(this)
    this.query = this.query.bind(this)
    this.emptyTable = this.emptyTable.bind(this)
    this.deselectAll = this.deselectAll.bind(this)
  }

  async componentDidMount() {
    this.props.loadAvailableAETS(await apis.aets.getAets())
  }

  deselectAll() {
    this.node.selectionContext.selected = []
  }

  removeRow() {
    let selectedKeyRow = this.node.selectionContext.selected
    this.props.removeQuery(selectedKeyRow)
  }

  emptyTable() {
    this.props.emptyQueryTable()
  }

  customHeader(column, colIndex, { sortElement, filterElement }) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {column.text}
        {filterElement}
        <ColumnEditor columnName={column.dataField} />
      </div>
    );
  }



  selectRow = {
    mode: 'checkbox'
  };

  cellEdit = cellEditFactory({
    mode: 'click',
    blurToSave: true,
    autoSelectText: true
  });

  columns = [{
    dataField: 'number',
    hidden: true,
    csvExport: false
  }, {
    dataField: 'patientName',
    text: 'Patient Name',
    sort: true,
    filter: textFilter(),
    headerFormatter: this.customHeader
  }, {
    dataField: 'patientId',
    text: 'Patient ID',
    sort: true,
    filter: textFilter(),
    headerFormatter: this.customHeader
  }, {
    dataField: 'accessionNumber',
    text: 'Accession Number',
    sort: true,
    filter: textFilter(),
    headerFormatter: this.customHeader
  }, {
    dataField: 'dateFrom',
    text: 'Date From',
    sort: true,
    filter: dateFilter(),
    editor: {
      type: Type.DATE
    },
    headerFormatter: this.customHeader
  }, {
    dataField: 'dateTo',
    text: 'Date To',
    sort: true,
    filter: dateFilter(),
    editor: {
      type: Type.DATE
    },
    headerFormatter: this.customHeader
  }, {
    dataField: 'studyDescription',
    text: 'Study Description',
    sort: true,
    filter: textFilter(),
    headerFormatter: this.customHeader
  }, {
    dataField: 'modalities',
    text: 'Modality',
    sort: true,
    filter: textFilter(),
    headerFormatter: this.customHeader,
    editorRenderer: (editorProps, value, row, column, rowIndex, columnIndex) => (
      <SelectModalities {...editorProps} previousModalities={value} />
    )
  }, {
    dataField: 'aet',
    text: 'AET',
    sort: true,
    editor: {
      type: Type.SELECT,
      getOptions: (setOptions, { row, column }) => {
        return this.props.aets.map(function (aet) {
          return { value: aet, label: aet }
        })
      }
    },
    filter: textFilter(),
    headerFormatter: this.customHeader
  }];

  render() {
    return (
      <ToolkitProvider
        keyField="key"
        data={this.props.queries}
        columns={this.columns}
        exportCSV={{ onlyExportSelection: true, exportAll: true }}
      >{
          props => (
            <React.Fragment>
              <div className="jumbotron" style={this.props.style}>
                <div>
                  <ExportCSVButton {...props.csvProps} className="btn btn-primary m-2">Export CSV</ExportCSVButton>
                  <input type="button" className="btn btn-success m-2" value="Add" onClick={this.props.addRow} />
                  <input type="button" className="btn btn-danger m-2" value="Delete Selected" onClick={this.removeRow} />
                  <input type="button" className="btn btn-danger m-2" value="Empty Table" onClick={this.emptyTable} />
                  <CsvLoader />
                  <div className="mt-5">
                    <BootstrapTable wrapperClasses="table-responsive" ref={n => this.node = n} {...props.baseProps} striped={true} filter={filterFactory()} selectRow={this.selectRow} pagination={paginationFactory()} cellEdit={this.cellEdit} >
                    </BootstrapTable>
                  </div>
                </div>
                <div className="text-center">
                  <input type="button" className="btn btn-primary" value="Query" onClick={this.query} />
                </div>
              </div>

            </React.Fragment>
          )
        }
      </ToolkitProvider>
    )
  }

  async query() {

    let data = this.node.props.data
    for (const query of data) {
      //For each line make dicom query and return results
      let answeredResults = await this.makeDicomQuery(query)
      //For each results, fill the result table through Redux
      answeredResults.forEach((answer) => {
        this.props.addStudyResult(answer)
      })

    }
  }

  async makeDicomQuery(queryParams) {

    //Prepare Date string for post data
    let dateString = '*';
    queryParams.dateFrom = queryParams.dateFrom.split('-').join('')
    queryParams.dateTo = queryParams.dateTo.split('-').join('')
    if (queryParams.dateFrom !== '' && queryParams.dateTo !== '') {
      dateString = queryParams.dateFrom + '-' + queryParams.dateTo
    } else if (queryParams.dateFrom === '' && queryParams.dateTo !== '') {
      dateString = '-' + queryParams.dateTo
    }

    //Prepare POST payload for query (follow Orthanc APIs)
    let queryPost = {
      Level: 'Study',
      Query: {
        PatientName: queryParams.patientName,
        PatientID: queryParams.patientId,
        StudyDate: dateString,
        ModalitiesInStudy: queryParams.modalities,
        StudyDescription: queryParams.studyDescription,
        AccessionNumber: queryParams.accessionNumber,
        NumberOfStudyRelatedInstances: '',
        NumberOfStudyRelatedSeries: ''
      }
    }

    //Call Orthanc API to make Query
    let createQueryRessource = await apis.query.dicomQuery(queryParams.aet, queryPost)
    //Call OrthancToolsJS API to get a parsed answer of the results
    let queryAnswer = await apis.query.retrieveAnswer(createQueryRessource.ID)

    return queryAnswer
  }

}

const mapStateToProps = (state) => {
  return {
    aets: state.OrthancTools.OrthancAets,
    queries: state.QueryList.queries
  }
}

const mapDispatchToProps = {
  loadAvailableAETS,
  addRow,
  removeQuery,
  emptyQueryTable,
  addStudyResult,
};

export default connect(mapStateToProps, mapDispatchToProps)(TableQuery);