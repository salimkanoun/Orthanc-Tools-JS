import React, { Component, createRef } from 'react'
import SearchForm from './SearchForm'
import SendTo from '../CommonComponents/RessourcesDisplay/SendToAnonExportDeleteDropdown'
import apis from '../../services/apis'

import { Col, Row } from 'react-bootstrap';

import TablePatientsWithNestedStudies from '../CommonComponents/RessourcesDisplay/ReactTable/TablePatientsWithNestedStudies'
import { connect } from 'react-redux'
import { addStudiesToDeleteList } from '../../actions/DeleteList'
import { addStudiesToExportList } from '../../actions/ExportList'
import { addStudiesToAnonList } from '../../actions/AnonList'
import { toast } from 'react-toastify'
import LabelDropdown from "./labels/LabelDropdown";
import LabelModal from "./labels/LabelModal";
import { studyArrayToNestedData } from '../../tools/processResponse';
import TableSeries from '../CommonComponents/RessourcesDisplay/ReactTable/TableSeries';

//a passer en fonctionnal component 
class ContentRootPanel extends Component {

    state = {
        currentSelectedStudyId: '',
        dataForm: {},
        orthancContent: [],
        selectedStudies: [],
        resultVisible: false,
        series: []
    }

    modalRef = { open: null };

    sendSearch = async (dataForm) => {
        //Show result
        this.setState({ resultVisible: true });
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
            let answer = await apis.content.getOrthancFind(dataForm)
            console.log(answer)
            this.setState({
                orthancContent: this.nestStudiesByPatient(answer)
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
        this.setState({ currentSelectedStudyId: '' })
    }

    //rappelé par le dropdow lors du delete de study sur Orthanc
    onDeleteStudy = (idDeleted) => {
        this.sendSearch()
        this.setState({ currentSelectedStudyId: '' })
    }

    onClickStudy = (StudyOrthancID) => {
        console.log(StudyOrthancID)

        apis.content.getSeriesDetails(StudyOrthancID).then(seriesAnswer => {
            console.log(seriesAnswer)
            let seriesData = []
            seriesAnswer.forEach((serie) => {
                seriesData.push({
                    StudyOrthancID: StudyOrthancID,
                    SeriesOrthancID: serie.ID,
                    Instances: serie.Instances.length,
                    ...serie.MainDicomTags
                })

            })

            this.setState({
                series: seriesData,
                currentSelectedStudyId : StudyOrthancID
            })
        })

    }

    rowStyleStudies = (row) => {
        console.log(row)
        const style = {};
        if (row.StudyOrthancID === this.state.currentSelectedStudyId) {
            style.backgroundColor = 'rgba(255,153,51)'
        }
        style.borderTop = 'none';

        return style;
    }

    nestStudiesByPatient = (studies) => {
        let nestedData = studyArrayToNestedData(studies)
        console.log(nestedData)
        return Object.values(nestedData)
    }


    setSelectedStudies = (resources) => {
        let selectedIds = resources
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
        this.setState({ selectedStudies: uniqueSelectedOrthancStudyId });
    }


    render = () => {
        return (
            <div>
                <SearchForm onSubmit={this.sendSearch} />
                <Row id="showResult" className={'mt-5' + (this.state.resultVisible ? ' show-result-opened' : '')}>
                    <Row>
                        <Col sm={6}>
                            <div className='d-flex flex-row justify-content-between mt-4'>
                                <LabelDropdown studies={this.state.selectedStudies} />
                                <SendTo
                                    studiesFull={this.state.selectedStudies}
                                />
                            </div>
                        </Col>
                    </Row>
                    <Row>
                        <Col sm>
                            <LabelModal fwRef={this.modalRef} />
                            <TablePatientsWithNestedStudies
                                patients={this.state.orthancContent}
                                onClickStudy={this.onClickStudy}
                                rowStyle={this.rowStyleStudies}
                                onDeletePatient={this.onDeletePatient}
                                onDeleteStudy={this.onDeleteStudy}
                                setSelectedStudies={this.setSelectedStudies}
                                onModify={this.sendSearch}
                                refresh={this.sendSearch}
                                hiddenRemoveRow={true}
                                openLabelModal={this.modalRef.open}
                            />
                        </Col>
                        <Col sm>
                            <TableSeries series={this.state.series} onDelete={this.onDelete} hiddenRemoveRow/>
                        </Col>
                    </Row>

                </Row>
            </div>
        )
    }

}
//connect redux fonctionnal componnent
const mapDispatchToProps = {
    addStudiesToDeleteList,
    addStudiesToAnonList,
    addStudiesToExportList
}

export default connect(null, mapDispatchToProps)(ContentRootPanel)