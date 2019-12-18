import React, { Component } from 'react';

class CsvLoader extends Component {

    render () {
        return(
            <div style={this.props.style}>
                <div className="jumbotron">
                    <h2 className="card-title">CSV</h2>
                    <div className="row">
                        <input type="file" id="files" multiple=""/>
                        <input type="button" className="btn btn-primary" id="parseBtn" value="Parse"/>
                    </div>
                </div>
            </div>
        )
    }
}

export default CsvLoader;


