import React, { Component } from 'react';

class AetButton extends Component {

    render(){
        return(<div className="col-sm">
            <input type="button" onClick={this.props.clickListner} className="btn btn-info btn-large queryAET" value={this.props.aetName} />
        </div>)
    }

}

export default AetButton