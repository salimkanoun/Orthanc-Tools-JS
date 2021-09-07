import React, {Component, createRef} from "react"
import Dropdown from "react-bootstrap/Dropdown"
import {ButtonGroup, InputGroup} from "react-bootstrap"
import {toast} from "react-toastify"

import apis from "../../services/apis"
import MonitorTask from "../../tools/MonitorTask"

const EXPORT_FAILED_TOAST = {
    position: "top-right",
    autoClose: 4000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
};

const EXPORT_PROGRESS_TOAST = {
    position: "top-right",
    autoClose: false,
    hideProgressBar: false,
    closeOnClick: false,
    pauseOnHover: false,
    draggable: false,
    progress: undefined,
};

const EXPORT_SUCCESS_TOAST = {
    position: "top-right",
    autoClose: false,
    hideProgressBar: false,
    closeOnClick: false,
    pauseOnHover: false,
    draggable: false,
    progress: undefined,
};

export default class SendExternalDropdown extends Component {
    state = {
        disabled: false,
        title: "Send To Endpoint"
    }

    toastRef = null;

    constructor(props) {
        super(props);
        this.toastRef = createRef();
    }

    _toastContent = (fileName, finished = false) => <div>
        <p>Your DICOMs {finished ? 'has been' : 'will be'} exported as : </p>
        <InputGroup className={'bg-light'} style={{'border-radius': '4px'}}>
            <input className={'form-control'} onClick={(e) => e.stopPropagation()} disabled value={fileName}/>
            <button type={'button'}
                    className={`btn btn-outline-${finished ? "success" : "primary"}  btn-otjs `}
                    onClick={() => navigator.clipboard.writeText(fileName)}>copy
            </button>
        </InputGroup>

    </div>

    handleClickDownload = async (event) => {
        let endpointId = event.currentTarget.id

        let taskAnswer
        try {
            taskAnswer = await apis.exportDicom.exportStudiesToExternal(this.props.username, this.props.exportIds, endpointId)
        } catch (error) {
            toast.error(error.statusText)
        }

        let jobMonitoring = new MonitorTask(taskAnswer)

        jobMonitoring.onUpdate((info) => {
            this.updateProgress(info)
            toast.update(this.toastRef.current, {
                render: this._toastContent(info.details.result),
                progress: ((info.progress.archiving || 0) + (info.progress.sending || 0)) / 200
            })
        })

        jobMonitoring.onFinish(async (info) => {
            this.resetProgress()
            if (info.state === "failed") toast.error("Export to endpoint failed", EXPORT_FAILED_TOAST);
            else toast.success(this._toastContent(info.details.result, true), EXPORT_SUCCESS_TOAST)
        })

        this.toastRef.current = toast(this._toastContent(''), EXPORT_PROGRESS_TOAST);
        jobMonitoring.startMonitoringJob()
        this.job = jobMonitoring
    }

    updateProgress = (info) => {
        this.setState({
            disabled: true,
            title: (['archiving', 'sending'].includes(info.state) ? info.state + ' ' + info.progress[info.state] + ' %' : info.state),
            fileName: info.details.result
        })
    }

    resetProgress = () => {
        this.setState({
            disabled: false,
            title: "Send To Endpoint"
        })

    }

    componentWillUnmount() {
        if (this.job) this.job.stopMonitoringJob();
    }

    render = () => {
        let dropDownItems = []
        this.props.endpoints.forEach(endpoint => {
            dropDownItems.push(<Dropdown.Item key={endpoint.id} id={endpoint.id}
                                              onClick={this.handleClickDownload}>{endpoint.label}</Dropdown.Item>)
        })
        return (<div>
            <Dropdown as={ButtonGroup}>
                <Dropdown.Toggle variant="button-dropdown-orange"
                                 className="button-dropdown button-dropdown-orange w-10" id="dropdown-basic"
                                 disabled={this.state.disabled}>
                    {this.state.title}
                </Dropdown.Toggle>
                <Dropdown.Menu className="mt-2 border border-dark border-2">
                    {dropDownItems}
                </Dropdown.Menu>
            </Dropdown>
        </div>)
    }

}