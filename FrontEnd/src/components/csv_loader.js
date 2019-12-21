import React, { Component } from 'react';
import Papa from 'papaparse'

import { connect } from 'react-redux'
import * as actions from '../actions/FormInput'

class CsvLoader extends Component {

    constructor(props) {
        super(props)
        this.parseCSV = this.parseCSV.bind(this)
        this.fileInput = React.createRef();
        this.completeFn= this.completeFn.bind(this)
    }


    parseCSV(event) {
        event.preventDefault();
        this.parseCsv(this.fileInput.current.files[0]);

    }

    parseCsv = function (file) {
        let currentObject=this
        Papa.parse(file,{
                header: true,
                complete: currentObject.completeFn// base config to use for each file
        })
    };

    completeFn(result, file) {
        let currentObject=this
        let csvData = result.data;
        csvData.forEach((query)=>{

            let queryForList = {
                patientName : query['Patient Name'],
                patientId : query['Patient ID'],
                accessionNumber : query['Accession Number'],
                dateFrom : query['Acquisition Date'],
                dateTo : query['Acquisition Date'],
                studyDescription : query['Study Description'],
                modalities: query['Modalities'],
                aet : query['AET']
              }
              
            currentObject.props.addQueryToList(queryForList)

        })

    }

    render() {
        return (
            <div style={this.props.style}>
                <form className="jumbotron" onSubmit={this.parseCSV}>
                    <h2 className="card-title">CSV</h2>
                    <div className="row">
                        <input type="file" id="files" multiple="" ref={this.fileInput} accept='.csv'  />
                        <input type="submit" className="btn btn-primary" id="parseBtn" value="Parse" />
                    </div>
                </form>
            </div>
        )
    }
}

const mapStateToProps = ( state )=>{
    return {
      form : state.FormInput
    }
  }
  
export default connect(mapStateToProps, actions)(CsvLoader);


