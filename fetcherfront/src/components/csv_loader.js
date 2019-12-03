import React, { Component } from 'react';

class CsvLoader extends Component {

    render () {
        return(
        <div style={this.props.style}>
            <div class="jumbotron">
                <h2 class="card-title">CSV</h2>
                <div class="row">
                    <input type="file" id="files" multiple=""/>
                    <input type="button" class="btn btn-primary" id="parseBtn" value="Parse"/>
                </div>
            </div>
        </div>
      )
    }
}

export default CsvLoader;


