import React, {Component, createRef} from 'react'
import SearchForm from './SearchForm'
import SendTo from '../CommonComponents/RessourcesDisplay/SendToAnonExportDeleteDropdown'
import apis from '../../services/apis'

import TableSeriesFillFromParent from '../CommonComponents/RessourcesDisplay/TableSeriesFillFromParent'
import TablePatientsWithNestedStudies
    from '../CommonComponents/RessourcesDisplay/ReactTable/TablePatientsWithNestedStudies'
import {connect} from 'react-redux'
import {addStudiesToDeleteList} from '../../actions/DeleteList'
import {addStudiesToExportList} from '../../actions/ExportList'
import {addStudiesToAnonList} from '../../actions/AnonList'
import {toast} from 'react-toastify'
import LabelDropdown from "./labels/LabelDropdown";
import LabelModal from "./labels/LabelModal";


class ContentRootPanel extends Component {

    state = {
        currentSelectedStudyId: '',
        dataForm: {},
        orthancContent: [],
        selectedStudies: []
    }

    modalRef = {open: null};

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
            this.setState({
                orthancContent: studies
            })
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
        this.sendSearch()
        this.setState({currentSelectedStudyId: ''})
    }

    //rappelé par le dropdow lors du delete de study sur Orthanc
    onDeleteStudy = (idDeleted) => {
        this.sendSearch()
        this.setState({currentSelectedStudyId: ''})
    }

    rowEventsStudies = (row) => {
        this.setState({currentSelectedStudyId: row.StudyOrthancID});
    }

    rowStyleStudies = (row) => {
        const style = {};
        if (row.StudyOrthancID === this.state.currentSelectedStudyId) {
            style.backgroundColor = 'rgba(255,153,51)'
        }
        style.borderTop = 'none';

        return style;
    }

    getStudySelectedDetails = () => {
        let selectedIds = this.child.current.getSelectedRessources()
        let studiesOfSelectedPatients = []
        //Add all studies of selected patient
        selectedIds.selectedPatients.forEach(orthancPatientId => {
            //loop the redux and add all studies that had one of the selected patient ID
            let studyArray = this.state.orthancContent.filter(study => study.ParentPatient === orthancPatientId);
            //Add to the global list of selected studies
            studiesOfSelectedPatients.push(...studyArray)
        })

        //add selected level studies
        selectedIds.selectedStudies.forEach(element => {
            this.state.orthancContent.forEach(study => {
                if (element === study.ID)
                    studiesOfSelectedPatients.push(study)
            });
        });
        //Get only unique study ids
        let uniqueSelectedOrthancStudyId = [...new Set(studiesOfSelectedPatients)];
        return uniqueSelectedOrthancStudyId
    }

    setSelectedStudies = (studies) => {
        let selectedStudies = studies
            .map(study => this.state.orthancContent
                .filter(content => content.ID === study.StudyOrthancID))
            .flat();
        this.setState({selectedStudies})
    }

    render = () => {
        return (
            <div className='jumbotron'>
                <SearchForm onSubmit={this.sendSearch}/>
                <div className='row'>
                    <div className='col-sm'>
                        <div className={'d-flex flex-row justify-content-between'}>
                            <LabelDropdown studies={this.state.selectedStudies}/>
                            <SendTo
                                studiesFull={this.state.selectedStudies}
                            />
                        </div>
                        <LabelModal fwRef={this.modalRef}/>
                        <TablePatientsWithNestedStudies
                            studies={this.state.orthancContent}
                            rowEventsStudies={this.rowEventsStudies}
                            rowStyle={this.rowStyleStudies}
                            onDeletePatient={this.onDeletePatient}
                            onDeleteStudy={this.onDeleteStudy}
                            setSelectedStudies={this.setSelectedStudies}
                            onModify={this.sendSearch}
                            refresh={this.sendSearch}
                            hiddenRemoveRow={true}
                            openLabelModal={this.modalRef.open}
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

const mapDispatchToProps = {
    addStudiesToDeleteList,
    addStudiesToAnonList,
    addStudiesToExportList
}

export default connect(null, mapDispatchToProps)(ContentRootPanel)