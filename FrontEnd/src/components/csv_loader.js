import React, { Component } from 'react';
import Papa from 'papaparse'

class CsvLoader extends Component {

    constructor(props) {
        super(props)
        this.parseCSV = this.parseCSV.bind(this)
        this.fileInput = React.createRef();
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
        console.log('resultats CSV')
        console.log(result)
        let csvData = result.data;
        for (let i = 1; i < csvData.length; i++) {
            console.log(csvData)
        }
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

export default CsvLoader;


