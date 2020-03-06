import React, { Component } from 'react';
import Papa from 'papaparse'
import moment from 'moment'

import { connect } from 'react-redux'
import * as actions from '../../../actions/FormInput'

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
            let acquisitionDate = moment(query['Acquisition Date'], 'YYYYMMDD').format("YYYY-MM-DD");
            let queryForList = {
                patientName : query['Patient Name'],
                patientId : query['Patient ID'],
                accessionNumber : query['Accession Number'],
                dateFrom : acquisitionDate,
                dateTo : acquisitionDate,
                studyDescription : query['Study Description'],
                modalities: query['Modalities'],
                aet : query['AET']
              }
              
            currentObject.props.addQueryToList(queryForList)

        })

    }

    render() {
        return (
            <form onSubmit={this.parseCSV}>
                    <input type="file" id="files" className="m-2" multiple={false} ref={this.fileInput} accept='.csv'  />
                    <input type="submit" className="btn btn-primary" id="parseBtn" value="Parse CSV" />
            </form>
        )
    }
}

const mapStateToProps = ( state )=>{
    return {
      form : state.FormInput
    }
  }
  
export default connect(mapStateToProps, actions)(CsvLoader);


