import React, {Component} from 'react'
import {connect} from 'react-redux'
import { Popover, Col, Row, Overlay} from 'react-bootstrap'

import TableStudiesWithNestedSeries from '../CommonComponents/RessourcesDisplay/ReactTable/TableStudiesWithNestedSeries'
import apis from '../../services/apis'
import SendAetDropdown from "../Export/SendAetDropdown"
import DownloadDropdown from "../Export/DownloadDropdown"
import {emptyExportList, removeSeriesFromExportList, removeStudyFromExportList} from '../../actions/ExportList'
import {toast} from 'react-toastify'

class ExportTool extends Component {

    state = {
        aets: []
    }

    componentDidMount = async () => {
        try {
            let aets = await apis.aets.getAets()
            this.setState({
                aets: aets
            })
        } catch (error) {
            this.setState({
                aets: []
            })
            toast.error(error.statusText)
        }

    }

    handleClickEmpty = () => {
        this.props.emptyExportList()
    }

    onDeleteSeries = (serieID) => {
        this.props.removeSeriesFromExportList(serieID)
    }

    onDeleteStudy = (studyID) => {
        this.props.removeStudyFromExportList(studyID)
    }

    getExportIDArray = () => {
        let ids = []
        this.props.seriesArray.forEach(serie => {
            ids.push(serie.ID)
        })
        return ids
    }

    render = () => {
        let idArray = this.getExportIDArray()
        return (
            <Overlay target={this.props.target} show={this.props.show} placement='bottom' onHide={this.props.onHide}
                     rootClose style={{width: '33%'}}>
                <Popover id='popover-export' style={{maxWidth: '100%'}}>
                    <Popover.Header as='h3'>Export List</Popover.Header>
                    <Popover.Body>
                        <div className="row mb-3">
                            <div className="col float-right">
                                <button type="button" className="btn otjs-button otjs-button-orange p-2"
                                        onClick={this.handleClickEmpty}>Empty List
                                </button>
                            </div>
                        </div>
                        <TableStudiesWithNestedSeries
                            series={this.props.seriesArray}
                            studies={this.props.studyArray}
                            hiddenRemoveRow={false}
                            hiddenAccessionNumber={true}
                            hiddenActionBouton={true}
                            hiddenName={false}
                            hiddenID={false}
                            onDeleteStudy={this.onDeleteStudy}
                            onDeleteSeries={this.onDeleteSeries}
                            pagination={true}
                            wrapperClasses="table-responsive"/>
                        <Row className="text-center mt-5">
                            <Col sm={6}>
                                <DownloadDropdown exportIds={idArray}/>
                            </Col>
                            <Col sm={6}>
                                <SendAetDropdown aets={this.state.aets} exportIds={idArray}/>
                            </Col>
                        </Row>
                    </Popover.Body>
                </Popover>
            </Overlay>
        )
    }
}

const mapStateToProps = state => {
    return {
        seriesArray: state.ExportList.seriesArray,
        studyArray: state.ExportList.studyArray
    }
}

const mapDispatchToProps = {
    emptyExportList,
    removeStudyFromExportList,
    removeSeriesFromExportList
}

export default connect(mapStateToProps, mapDispatchToProps)(ExportTool)
