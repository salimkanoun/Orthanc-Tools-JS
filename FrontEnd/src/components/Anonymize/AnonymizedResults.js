import React, { Component } from "react"
import { connect } from "react-redux"

import TableStudy from "../CommonComponents/RessourcesDisplay/TableStudy"

import { emptyAnonymizedList, removeStudyFromAnonymizedList } from '../../actions/AnonList'
import { addStudiesToDeleteList } from '../../actions/DeleteList'
import { addStudiesToExportList } from '../../actions/ExportList'
import apis from "../../services/apis"


class AnonymizedResults extends Component {
    
    constructor(props) {
        super(props)
        this.removeStudyAnonymized = this.removeStudyAnonymized.bind(this)
        this.emptyAnonymizedList = this.emptyAnonymizedList.bind(this)
        this.deleteList = this.deleteList.bind(this)
        this.exportList = this.exportList.bind(this)
    }

    getStudiesAnonymized(){
        let studies = []
        this.props.anonymizedList.forEach(study => {
            studies.push({
                StudyOrthancID: study.ID, 
                ...study.MainDicomTags, 
                ...study.PatientMainDicomTags,
                AnonymizedFrom: study.AnonymizedFrom,
                newStudyDescription: study.MainDicomTags.newStudyDescription ? study.MainDicomTags.newStudyDescription : '', 
                newAccessionNumber: study.MainDicomTags.newAccessionNumber ? study.MainDicomTags.newAccessionNumber : ''
            })
        })
        return studies
    }

    emptyAnonymizedList(){
        this.props.emptyAnonymizedList()
    }

    removeStudyAnonymized(studyID){
        this.props.removeStudyFromAnonymizedList(studyID)
        apis.content.deleteStudies(studyID)
    }

    exportList(){
        this.props.addStudiesToExportList(this.props.anonymizedList)
    }

    deleteList(){
        this.props.addStudiesToDeleteList(this.props.anonymizedList)
    }


    render() {
        return (
            <div className='jumbotron' hidden={this.props.anonymizedList && this.props.anonymizedList.length === 0}>
                    <h2 className='card-title mb-3'>Anonymized studies</h2>
                    <div className='row'>
                        <div className='col-sm mb-3'>
                            <button type='button' className="btn btn-warning float-right" onClick={this.emptyAnonymizedList}>Empty List</button>
                            <TableStudy
                                data={this.getStudiesAnonymized()}
                                hiddenActionBouton={true} 
                                hiddenRemoveRow={false} 
                                onDelete={this.removeStudyAnonymized}
                                hiddenName={false}
                                hiddenID={false}
                                pagination={true}
                                hiddenCSV={false}
                                />
                        </div>
                    </div>
                    <div className='text-center'>
                        <button type='button' className='btn btn-primary mr-3' onClick={this.exportList} >To Export List</button>
                        <button type='button' className='btn btn-danger' onClick={this.deleteList} >To Delete List</button>
                    </div>
                </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        anonymizedList: state.AnonList.anonymizedList
    }
}
const mapDispatchToProps = {
    emptyAnonymizedList,
    removeStudyFromAnonymizedList,
    addStudiesToDeleteList, 
    addStudiesToExportList
}

export default connect(mapStateToProps, mapDispatchToProps)(AnonymizedResults)