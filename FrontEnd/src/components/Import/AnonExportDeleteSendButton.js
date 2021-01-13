import React, { Component } from "react";

export default class AnonExportDeleteSendButton extends Component{

    render =() => {
        return (
            <div className="row text-center mt-3">
                <div className="col">
                    <input type="button" className="btn btn-info" value="To Anonymize" onClick={this.props.onAnonClick} />
                </div>
                <div className="col">
                    <input type="button" className="btn btn-primary" value="To Export" onClick ={this.props.onExportClick}/>
                </div>
                <div className="col">
                    <input type="button" className="btn btn-warning" value="To Delete" onClick ={this.props.onDeleteClick} />
                </div>
            </div>
        )
    }
}