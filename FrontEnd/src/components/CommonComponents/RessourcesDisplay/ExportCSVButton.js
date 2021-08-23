import React, {Component} from "react";
import {getCSVString} from "../../../tools/CSVExport";

export default class ExportCSVButton extends Component {
    state = {
        fileDownloadUrl: null,
    }

    handleClick = () => {
        const blob = new Blob([getCSVString(this.props.data)]);                   // Step 3
        const fileDownloadUrl = URL.createObjectURL(blob); // Step 4
        this.setState({fileDownloadUrl: fileDownloadUrl}, // Step 5
            () => {
                this.dofileDownload.click();                   // Step 6
                URL.revokeObjectURL(fileDownloadUrl);          // Step 7
                this.setState({fileDownloadUrl: ""})
            })
    }

    render() {
        return (<>
            <button type="button" className="otjs-button otjs-button-blue w-7" onClick={this.handleClick}>{'Export CSV'}</button>
            <a style={{display: "none"}}
               download={this.props.fileName || "spreadsheet.csv"}
               href={this.state.fileDownloadUrl}
               ref={e => this.dofileDownload = e}
            >download it</a>
        </>)
    }
}