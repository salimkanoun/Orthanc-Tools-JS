import React, {Component} from 'react'
import {connect} from 'react-redux'

import Overlay from 'react-bootstrap/Overlay'
import Popover from 'react-bootstrap/Popover'
import TablePatientsWithNestedStudies
    from '../CommonComponents/RessourcesDisplay/ReactTable/TablePatientsWithNestedStudies'

import {emptyAnonymizeList, removePatientFromAnonList, removeStudyFromAnonList} from '../../actions/AnonList'


class AnonTool extends Component {

    onDeletePatient = (patientOrthancID) => {
        this.props.removePatientFromAnonList(patientOrthancID)
    }

    onDeleteStudy = (studyOrthancID) => {
        this.props.removeStudyFromAnonList(studyOrthancID)
    }

    handleClickEmpty = () => {
        this.props.emptyAnonymizeList()
    }

    render = () => {
        return (
            <Overlay target={this.props.target} show={this.props.show} placement="bottom" onHide={this.props.onHide}
                     rootClose>
                <Popover id="popover-basic" style={{maxWidth: '100%'}}>
                    <Popover.Header as="h3">Anon List</Popover.Header>
                    <Popover.Body>
                        <div className="float-right mb-3">
                            <button type="button" className="btn otjs-button otjs-button-orange p-2" onClick={this.handleClickEmpty}>Empty
                                List
                            </button>
                        </div>
                        <TablePatientsWithNestedStudies
                            studies={this.props.anonList}
                            hiddenActionBouton={true}
                            hiddenRemoveRow={false}
                            onDeletePatient={this.onDeletePatient}
                            onDeleteStudy={this.onDeleteStudy}
                            hiddenSelect={true}
                            wrapperClasses="table-responsive"
                        />
                    </Popover.Body>
                </Popover>
            </Overlay>
        )
    }
}

const mapStateToProps = state => {
    return {
        anonList: state.AnonList.anonList
    }

}

const mapDispatchToProps = {
    emptyAnonymizeList,
    removePatientFromAnonList,
    removeStudyFromAnonList,
}

export default connect(mapStateToProps, mapDispatchToProps)(AnonTool)