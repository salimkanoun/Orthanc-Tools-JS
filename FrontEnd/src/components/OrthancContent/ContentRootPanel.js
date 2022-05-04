import React, { Component, createRef, useState } from 'react'
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

export function ContentRootPanel(props) {

    /*state = {
        currentSelectedStudyId: '',
        dataForm: {},
        orthancContent: [],
        selectedStudies: [],
        resultVisible: false,
        series: []
    }

    modalRef = { open: null }; */

    const [currentSelectedStudyId, setCurrentSelectedStudyId] = useState('');
    const [dataForm, setDataForm] = useState({});
    const [orthancContent, setOrthancContent] = useState([]);
    const [selectedStudies, setSelectedStudies] = useState([]);
    const [resultVisible, setResultVisible] = useState(false);
    const [series, setSeries] = useState([]);

    const [modalRefOpen, setModalRefOpen] = useState(null);

    const sendSearch = async (dataForm) => {
        //Show result
        setResultVisible(true);
        if (dataForm) {
            //Store new form find value and send request to back
            setDataForm(dataForm)
            setCurrentSelectedStudyId('')
            sendFindRequest(dataForm)
        } else {
            //refresh value using the same current form search value
            sendFindRequest(dataForm)
        }
    }


    const sendFindRequest = async (dataForm) => {
        try {
            let answer = await apis.content.getOrthancFind(dataForm)
            console.log(answer)
            setOrthancContent(nestStudiesByPatient(answer))
        } catch (error) {
            toast.error(error.statusText)
        }

    }

    const refreshSerie = () => {
        let id = currentSelectedStudyId
        setCurrentSelectedStudyId('')
        setCurrentSelectedStudyId(id)
    }

    //Rappelé par le dropdown lors du delete de Patietn sur Orthanc
    const onDeletePatient = (idDeleted) => {
        sendSearch()
        setCurrentSelectedStudyId('')
    }

    //rappelé par le dropdow lors du delete de study sur Orthanc
    const onDeleteStudy = (idDeleted) => {
        sendSearch()
        setCurrentSelectedStudyId('')
    }

    const onClickStudy = (StudyOrthancID) => {
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

            setSeries(seriesData)
            setCurrentSelectedStudyId(StudyOrthancID)
        })

    }

    const rowStyleStudies = (row) => {
        console.log(row)
        const style = {};
        if (row.StudyOrthancID === currentSelectedStudyId) {
            style.backgroundColor = 'rgba(255,153,51)'
        }
        style.borderTop = 'none';

        return style;
    }

    const nestStudiesByPatient = (studies) => {
        let nestedData = studyArrayToNestedData(studies)
        console.log(nestedData)
        return Object.values(nestedData)
    }


    const setSelectedStudie = (resources) => {
        let selectedIds = resources
        let studiesOfSelectedPatients = []
        //Add all studies of selected patient
        selectedIds.selectedPatients.forEach(orthancPatientId => {
            //loop the redux and add all studies that had one of the selected patient ID
            let studyArray = orthancContent.filter(study => study.ParentPatient === orthancPatientId);
            //Add to the global list of selected studies
            studiesOfSelectedPatients.push(...studyArray)
        })

        //add selected level studies
        selectedIds.selectedStudies.forEach(element => {
            orthancContent.forEach(study => {
                if (element === study.ID)
                    studiesOfSelectedPatients.push(study)
            });
        });
        //Get only unique study ids
        let uniqueSelectedOrthancStudyId = [...new Set(studiesOfSelectedPatients)];
        setSelectedStudies(uniqueSelectedOrthancStudyId);
    }


    return (
        <div>
            <SearchForm onSubmit={sendSearch} />
            <Row id="showResult" className={'mt-5' + (resultVisible ? ' show-result-opened' : '')}>
                <Row>
                    <Col sm={6}>
                        <div className='d-flex flex-row justify-content-between mt-4'>
                            <LabelDropdown studies={selectedStudies} />
                            <SendTo
                                studiesFull={selectedStudies}
                            />
                        </div>
                    </Col>
                </Row>
                <Row>
                    <Col sm>
                        <LabelModal fwRef={modalRefOpen} />
                        <TablePatientsWithNestedStudies
                            patients={orthancContent}
                            onClickStudy={onClickStudy}
                            rowStyle={rowStyleStudies}
                            onDeletePatient={onDeletePatient}
                            onDeleteStudy={onDeleteStudy}
                            setSelectedStudies={setSelectedStudies}
                            onModify={sendSearch}
                            refresh={sendSearch}
                            hiddenRemoveRow={true}
                            openLabelModal={modalRefOpen}
                        />
                    </Col>
                    <Col sm>
                        <TableSeries series={series} /*onDelete={onDelete}*/ hiddenRemoveRow />
                    </Col>
                </Row>

            </Row>
        </div>
    )

}

//connect redux fonctionnal componnent
const mapDispatchToProps = {
    addStudiesToDeleteList,
    addStudiesToAnonList,
    addStudiesToExportList
}


export default connect(null, mapDispatchToProps)(ContentRootPanel)