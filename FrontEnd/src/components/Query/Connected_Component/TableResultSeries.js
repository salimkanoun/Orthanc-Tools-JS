import React, { Component } from 'react';
import BootstrapTable from 'react-bootstrap-table-next';
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import 'react-bootstrap-table2-filter/dist/react-bootstrap-table2-filter.min.css';
import filterFactory, { textFilter } from 'react-bootstrap-table2-filter';
import ToolkitProvider from 'react-bootstrap-table2-toolkit';

import { connect } from 'react-redux'
import * as actions from '../../../actions/TableResult'


class TableResultSeries extends Component {

    constructor(props) {
        super(props)
        console.log(props.rowData)
    }

    async getSeriesDetails(studyUID, aet){

        let post = {
            level : 'Serie',
            studyUID: studyUID,
            aet : aet
        }

        let queryAnswers = await fetch("/api/query",
        {
          method: "POST",
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(post)
        }).then((answer)=>{
          return(answer.json())
        })

        console.log(queryAnswers)
        return queryAnswers

    }

    selectRow = {
        mode: 'checkbox',
        clickToSelect: true
        //,onSelectAll: this.onSelectAll
    };

    columns = [{
        dataField: 'number',
        hidden: true,
        csvExport: false
    }, {
        dataField: 'studyUID',
        hidden: true,
        csvExport: false
    }, {
        dataField: 'serieUID',
        hidden: true,
        csvExport: false
    }, {
        dataField: 'serieDescription',
        text: 'Serie Description',
        sort: true,
        filter: textFilter()
    }, {
        dataField: 'serieModality',
        text: 'Modality',
        sort: true,
        filter: textFilter()
    }, {
        dataField: 'serieNumber',
        text: 'Serie Number',
        sort: true,
        filter: textFilter()
    }];

    render() {

        return (
            <ToolkitProvider
                keyField="key"
                data={this.props.results.results}
                columns={this.columns}
            >{
                    props => (
                        <React.Fragment>
                            <div className="jumbotron" style={this.props.style}>
                                <div>
                                        <BootstrapTable ref={n => this.node = n} {...props.baseProps} filter={filterFactory()} striped={true} selectRow={this.selectRow} >
                                        </BootstrapTable>
                                </div>
                            </div>
                        </React.Fragment>
                    )
                }
            </ToolkitProvider>
        )
    }



}



const mapStateToProps = (state) => {
    return {
        results: state.ResultList
    }
}

export default connect(mapStateToProps, actions)(TableResultSeries);