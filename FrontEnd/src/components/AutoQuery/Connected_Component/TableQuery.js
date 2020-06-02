import React, { Component } from 'react';
import { connect } from 'react-redux'
import { toast } from 'react-toastify'
import moment from 'moment'

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
import SelectModalities from '../../CommonComponents/SearchForm/SelectModalities';

import apis from '../../../services/apis';
import AutoQueryRoot from '../Component/AutoQueryRoot';

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
    dataField: 'key',
    hidden: true,
    csvExport: false
  }, {
    dataField: 'PatientName',
    text: 'Patient Name',
    sort: true,
    filter: textFilter(),
    headerFormatter: this.customHeader
  }, {
    dataField: 'PatientID',
    text: 'Patient ID',
    sort: true,
    filter: textFilter(),
    headerFormatter: this.customHeader
  }, {
    dataField: 'AccessionNumber',
    text: 'Accession Number',
    sort: true,
    filter: textFilter(),
    headerFormatter: this.customHeader
  }, {
    dataField: 'DateFrom',
    text: 'Date From',
    sort: true,
    filter: dateFilter(),
    formatter: (cell) => {
      let dateObj
      if (cell !== '') {
        dateObj = moment(cell, "YYYYMMDD")
      }else{
        return ''
      }
      return moment(dateObj).format("YYYYMMDD")
    },
    editor: {
      type: Type.DATE
    },
    headerFormatter: this.customHeader
  }, {
    dataField: 'DateTo',
    text: 'Date To',
    sort: true,
    filter: dateFilter(),
    formatter: (cell) => {
      let dateObj
      if (cell !== '') {
        dateObj = moment(cell, "YYYYMMDD")
      }else{
        return ''
      }
      return moment(dateObj).format("YYYYMMDD")
    },
    editor: {
      type: Type.DATE
    },
    headerFormatter: this.customHeader
  }, {
    dataField: 'StudyDescription',
    text: 'Study Description',
    sort: true,
    filter: textFilter(),
    headerFormatter: this.customHeader
  }, {
    dataField: 'ModalitiesInStudy',
    text: 'Modality',
    sort: true,
    filter: textFilter(),
    headerFormatter: this.customHeader,
    editorRenderer: (editorProps, value, row, column, rowIndex, columnIndex) => (
      <SelectModalities {...editorProps} previousModalities={value} />
    )
  }, {
    dataField: 'Aet',
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
                <div>
                  <ExportCSVButton {...props.csvProps} className="btn btn-primary m-2">Export CSV</ExportCSVButton>
                  <input type="button" className="btn btn-success m-2" value="Add" onClick={this.props.addRow} />
                  <input type="button" className="btn btn-warning m-2" value="Delete Selected" onClick={this.removeRow} />
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

            </React.Fragment>
          )
        }
      </ToolkitProvider>
    )
  }

  async query() {
    let data = this.node.props.data
    const id = toast.info('Starting Studies Queries');
    let i = 0
    console.log(data)
    //SK ICI GERER LA PROGRESSION ET LA FIN FAIRE SWITCH DE TAB
    for (const query of data) {
      i++

      //For each line make dicom query and return results
      let answeredResults = await this.makeDicomQuery(query)
      toast.update(id, {
        render : 'Queried study '+i+'/'+data.length
      });
      //For each results, fill the result table through Redux
      answeredResults.forEach((answer) => {
        this.props.addStudyResult(answer)
      })

    }
    
    this.props.switchTab(AutoQueryRoot.Results)

  }

  async makeDicomQuery(queryParams) {
    //Prepare Date string for post data
    let DateString = '';
    queryParams.DateFrom = queryParams.DateFrom.split('-').join('')
    queryParams.DateTo = queryParams.DateTo.split('-').join('')

    if (queryParams.DateFrom !== '' && queryParams.DateTo !== '') {
      DateString = queryParams.DateFrom + '-' + queryParams.DateTo
    } else if (queryParams.DateFrom === '' && queryParams.DateTo !== '') {
      DateString = '-' + queryParams.DateTo
    } else if (queryParams.DateFrom !== '' && queryParams.DateTo === '') {
      DateString =  queryParams.DateFrom+'-'
    }

    //Prepare POST payload for query (follow Orthanc APIs)
    let queryPost = {
      Level: 'Study',
      Query: {
        PatientName: queryParams.PatientName,
        PatientID: queryParams.PatientId,
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
  addStudyResult,
};

export default connect(mapStateToProps, mapDispatchToProps)(TableQuery);