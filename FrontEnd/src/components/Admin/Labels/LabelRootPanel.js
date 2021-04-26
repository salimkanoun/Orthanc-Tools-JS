import React, {Component} from "react";
import LabelsTable from "./LabelsTable";

class LabelRootPanel extends Component {
    render() {
        return (<>
            <h2>Labels</h2>
            <LabelsTable/>
        </>)
    }
}

export default LabelRootPanel