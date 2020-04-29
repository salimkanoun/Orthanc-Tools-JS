import React, { Fragment, Component } from 'react'
import SearchForm from './SearchForm'
import apis from '../../services/apis'

import TableSeriesFillFromParent from '../CommonComponents/RessourcesDisplay/TableSeriesFillFromParent'
import TablePatientsWithNestedStudies from '../CommonComponents/RessourcesDisplay/TablePatientsWithNestedStudies'

import { connect } from 'react-redux'
import { addToDeleteList } from '../../actions/DeleteList'


class ContentRootPanel extends Component {

  state = {
    studies: [], 
    currentSelectedStudyId : "", 
    listToDelete : '', //list will be send to deleteTool
    selectedPatient: [] //list of all studyID of patient selected 
  } 

  constructor(props){
    super(props)
    this.sendSearch = this.sendSearch.bind(this)
    this.onDeletePatient = this.onDeletePatient.bind(this)
    this.onDeleteStudy = this.onDeleteStudy.bind(this)
    this.handleRowSelect = this.handleRowSelect.bind(this)
    this.sendToDeleteList = this.sendToDeleteList.bind(this)
  }


  async sendSearch(dataFrom){
    let studies = await apis.content.getContent(dataFrom)
    let hirachicalAnswer = this.traitementStudies(studies)
    let dataForPatientTable = this.prepareDataForTable(hirachicalAnswer)
    this.setState({ studies: dataForPatientTable })
  }


  prepareDataForTable(responseArray){
    let answer = []
    for(let patient in responseArray) {
        answer.push( {
            PatientOrthancID  : patient,
            ...responseArray[patient]
        })
    }
    return answer

  }

  traitementStudies(studies){
      let responseMap = []
      studies.forEach(element => {
        let previewStudies = {}
        try {
          previewStudies = responseMap[element.ParentPatient].studies
        }
        catch (error) { }
          responseMap[element.ParentPatient] = {
            ...element.PatientMainDicomTags, 
            studies: {
              ...previewStudies,
              [element.ID]: {
                  ...element.MainDicomTags
              }
            }

          } 
              
          })
      return responseMap
      
  }

  onDeletePatient(idDeleted){


  }

  onDeleteStudy(idDeleted){
    this.setState({
      currentSelectedStudyId : ''
    })

  }

  sendToDeleteList(){
    if(this.state.listToDelete !== '')
      this.state.listToDelete.forEach(element => this.props.addToDeleteList(element)) //send listToDelete to the redux store
    else
      console.log("empty");
      
  }
  
  handleRowSelect = (row, isSelected) => {
    let studies = {}
    if (row.StudyOrthancID === undefined){
      
        if (isSelected){
          this.setState({selectedPatient: [...this.state.selectedPatient, ...Object.keys(row.studies)]})
          this.setState({listToDelete: [...this.state.listToDelete, {id: row.PatientOrthancID, PatientName: row.PatientName, PatientID: row.PatientID, studies: row.studies}]}) //add Patient on deleteList 
        }else {
          this.setState({selectedPatient: this.state.selectedPatient.filter(studyID => !Object.keys(row.studies).includes(studyID))})
          this.setState({listToDelete: this.state.listToDelete.filter(obj => obj.id !== row.PatientOrthancID)})
        }
    } else {
        if (isSelected){
          studies = { [row.StudyOrthancID]: {
            AccessionNumber: row.AccessionNumber,
            StudyDate: row.StudyDate,
            StudyDescription: row.StudyDescription,
            StudyInstanceUID: row.StudyInstanceUID,
            StudyTime: row.StudyTime
          }}
          if (this.state.listToDelete !== ''){
            let find = false
            this.state.listToDelete.forEach(element => {
              if(element.id === row.PatientOrthancID){
                  let newList = this.state.listToDelete
                  let newStudies = {...element.studies, ...studies}
                  newList[newList.indexOf(element)].studies = newStudies
                  this.setState({listToDelete: newList})
                  find = true
              }
            })
            if (!find)
            this.setState({listToDelete: [...this.state.listToDelete, {id: row.PatientOrthancID, PatientName: row.PatientName, PatientID: row.PatientID, studies: studies}]})
          } else {
            this.setState({listToDelete: [{id: row.PatientOrthancID, PatientName: row.PatientName, PatientID: row.PatientID, studies: studies}]})
          }
        } else {
          let newList = this.state.listToDelete
          newList.forEach(element => {
            if(element.id === row.PatientOrthancID){
              let studiesID = Object.keys(element.studies)
              let newStudies
              studiesID.forEach(id => {
                if (id !== row.StudyOrthancID){
                  newStudies = {...newStudies, [id]: {...element.studies[id]}}
                }
              })
              element.studies = newStudies
            }
          })
          newList = newList.filter(obj => obj.studies !== undefined) //Enlève les patients sans studies
          this.setState({listToDelete: newList})
        }
    }
  }

   rowEventsStudies = {
      onClick: (e, row, rowIndex) => {
        if (this.state.currentSelectedStudyId !== row.StudyOrthancID){
            this.setState({
              currentSelectedStudyId : row.StudyOrthancID
            })
        } else {
          this.setState({
            currentSelectedStudyId : ''
          })
        }
      } 
  }

  rowStyleStudies = (row, rowIndex) => {
    const style = {};
    if (row.StudyOrthancID === this.state.currentSelectedStudyId){
      style.backgroundColor = 'rgba(255,153,51)'
    }
    style.borderTop = 'none';

    return style;
  }
  
  render() {
    const selectRow={
      mode: 'checkbox', 
      clickToExpand: true,
      nonSelectable: this.state.selectedPatient,
      onSelect: (row, isSelected) => this.handleRowSelect(row, isSelected),
      onSelectAll:  (isSelected, rows, e) => {
        rows.forEach((row) => this.handleRowSelect(row, isSelected))
      }
    }
      return (
      <Fragment>
        <div className='jumbotron'>
          <SearchForm onSubmit={this.sendSearch} />
          <input type='button' className='btn btn-danger mb-3' onClick={this.sendToDeleteList} value='To Delete List' />   
          <div className='row'>
              <div className='col-sm'>
                   <TablePatientsWithNestedStudies 
                    patients={this.state.studies} 
                    selectRow={selectRow }
                    selectedPatient={this.state.selectedPatient}
                    rowEventsStudies={ this.rowEventsStudies } 
                    onDeletePatient={this.onDeletePatient} 
                    onDeleteStudy={this.onDeleteStudy} 
                    rowStyleStudies={this.rowStyleStudies} 
                  />
              </div>
              <div className='col-sm'>
                  <TableSeriesFillFromParent studyID={this.state.currentSelectedStudyId} onEmptySeries={() => console.log('Plus de Series faire Refresh?')} />
              </div>
          </div>
        </div>
      </Fragment>
    )
  }

}

const mapStateToProps = state => {
  return {
    deleteList: state.deleteList
  }
}

const mapDispatchToProps = {
  addToDeleteList
}

export default connect(mapStateToProps, mapDispatchToProps)(ContentRootPanel)