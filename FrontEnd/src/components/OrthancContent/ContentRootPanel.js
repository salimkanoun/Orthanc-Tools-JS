import React, {Component, createRef} from 'react'
import SearchForm from './SearchForm'
import SendTo from '../CommonComponents/RessourcesDisplay/SendToAnonExportDeleteDropdown'
import apis from '../../services/apis'

import TableSeriesFillFromParent from '../CommonComponents/RessourcesDisplay/TableSeriesFillFromParent'
import TablePatientsWithNestedStudies from '../CommonComponents/RessourcesDisplay/TablePatientsWithNestedStudies'

import {studyArrayToPatientArray} from '../../tools/processResponse'

import {connect} from 'react-redux'
import {addStudiesToDeleteList} from '../../actions/DeleteList'
import {addStudiesToExportList} from '../../actions/ExportList'
import {addStudiesToAnonList} from '../../actions/AnonList'
import {addOrthancContent, removeOrthancContentPatient, removeOrthancContentStudy} from '../../actions/OrthancContent'
import {toast} from 'react-toastify'
import LabelDropdown from "./LabelDropdown";


class ContentRootPanel extends Component {

    state = {
        currentSelectedStudyId: '',
        dataForm: {}
    }

    constructor(props) {
        super(props)
        this.child = createRef()
    }

    sendSearch = async (dataForm) => {
        if (dataForm) {
            //Store new form find value and send request to back
            this.setState({
                dataForm: dataForm,
                currentSelectedStudyId: ''
            }, () => this.sendFindRequest(dataForm))
        } else {
            //refresh value using the same current form search value
            this.sendFindRequest(this.state.dataForm)
        }
    }


    sendFindRequest = async (dataForm) => {
        try {
            let studies = await apis.content.getOrthancFind(dataForm)
            this.props.addOrthancContent(studies)
        } catch (error) {
            toast.error(error.statusText)
        }

    }

    refreshSerie = () => {
        let id = this.state.currentSelectedStudyId
        this.setState({
            currentSelectedStudyId: ''
        })
        this.setState({
            currentSelectedStudyId: id
        })
    }

    //Rappelé par le dropdown lors du delete de Patietn sur Orthanc
    onDeletePatient = (idDeleted) => {
        this.props.removeOrthancContentPatient(idDeleted)
        this.setState({currentSelectedStudyId: ''})
    }

    //rappelé par le dropdow lors du delete de study sur Orthanc
    onDeleteStudy = (idDeleted) => {
        this.props.removeOrthancContentStudy(idDeleted)
        this.setState({currentSelectedStudyId: ''})
    }

    rowEventsStudies = {
        onClick: (e, row) => {
            this.setState({currentSelectedStudyId: row.StudyOrthancID})
        }
    }

    rowStyleStudies = (row) => {
        const style = {};
        if (row.StudyOrthancID === this.state.currentSelectedStudyId) {
            style.backgroundColor = 'rgba(255,153,51)'
        }
        style.borderTop = 'none';

        return style;
    }

    render = () => {
        return (
            <div className='jumbotron'>
                <SearchForm onSubmit={this.sendSearch}/>
                <div className='row'>
                    <div className='col-sm'>
                        <div className={'d-flex flex-row justify-content-between'}>
                            <LabelDropdown selectedStudiesGetter={this.getStudySelectedDetails}/>                            
                            <SendTo 
                                studies={this.child.current===null ? [] : this.child.current.getSelectedRessources().selectedStudies} 
                                patients={this.child.current===null ? [] : this.child.current.getSelectedRessources().selectedPatients}
                            />
                        </div>


                        <TablePatientsWithNestedStudies
                            patients={studyArrayToPatientArray(this.props.orthancContent)}
                            rowEventsStudies={this.rowEventsStudies}
                            rowStyle={this.rowStyleStudies}
                            onDeletePatient={this.onDeletePatient}
                            onDeleteStudy={this.onDeleteStudy}
                            setSelection={true}
                            ref={this.child}
                            refresh={this.sendSearch}
                        />
                    </div>
                    <div className='col-sm'>
                        <TableSeriesFillFromParent
                            studyID={this.state.currentSelectedStudyId}
                            onDeleteStudy={this.onDeleteStudy}
                            onEmptySeries={() => console.log('No Series')}
                            refreshSerie={this.refreshSerie}/>
                    </div>
                </div>
            </div>
        )
    }

}

const mapStateToProps = state => {
    return {
        orthancContent: state.OrthancContent.orthancContent
    }
}

const mapDispatchToProps = {
    addStudiesToDeleteList,
    addStudiesToAnonList,
    addOrthancContent,
    removeOrthancContentStudy,
    removeOrthancContentPatient,
    addStudiesToExportList
}

export default connect(mapStateToProps, mapDispatchToProps)(ContentRootPanel)