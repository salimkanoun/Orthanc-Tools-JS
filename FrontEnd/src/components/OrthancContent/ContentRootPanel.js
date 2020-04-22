import React, { Fragment, Component } from 'react'
import SearchForm from './SearchForm'
import apis from '../../services/apis'

import TableSeriesFillFromParent from '../CommonComponents/RessourcesDisplay/TableSeriesFillFromParent'
import TablePatientsWithNestedStudies from '../CommonComponents/RessourcesDisplay/TablePatientsWithNestedStudies'

import { connect } from 'react-redux'
import { deleteContent, addContent, removeContent } from '../../actions/OrthancContent'


class ContentRootPanel extends Component {

  state = {
    studies: [], 
    currentSelectedStudyId : ""
  } 

  constructor(props){
    super(props)
    this.sendSearch = this.sendSearch.bind(this)
    this.onDeletePatient = this.onDeletePatient.bind(this)
    this.onDeleteStudy = this.onDeleteStudy.bind(this)
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
              responseMap[element.ParentPatient] = {
                  ...element.PatientMainDicomTags, 
                  studies: { 
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

  selectRow={
    mode: 'checkbox', 
    clickToExpand: true,
    onSelect: (row, isSelected) => { //Je le fais directement depuis là parce que j'ai une erreur 'this is undefined' quand je passe par un handleRowSelected
      let level = ''
      let id = ''
      if (row.PatientOrthancID !== undefined){
        level = 'patients'
        id = row.PatientOrthancID
      }
      if (row.StudyOrthancID !== undefined){
        level = 'studies'
        id = row.StudyOrthancID
      }
      if (row.SerieOrthancID !== undefined){
        level = 'series'
        id = row.SerieOrthancID
      }
      console.log("level : " + level + "; id : " + id)
      if (isSelected)
        this.props.addContent({level: level, id: id}) //ajoute le level et l'id au state global 
      else
        this.props.removeContent({level: level, id: id}) //le supprime du state global mais fonctionne pas 
    },
    onSelectAll: (isSelected, rows, e) => {
      rows.forEach((row) => this.handleRowSelect(row, isSelected))
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
      return (
      <Fragment>
        <div className='jumbotron'>
          <SearchForm onSubmit={this.sendSearch}/>
          <div className='row'>
              <div className='col-sm'>
                  <TablePatientsWithNestedStudies patients={this.state.studies} selectRow={ this.selectRow } rowEventsStudies={ this.rowEventsStudies } onDeletePatient={this.onDeletePatient} onDeleteStudy={this.onDeleteStudy} rowStyleStudies={this.rowStyleStudies} />
              </div>
              <div className='col-sm'>
                  <TableSeriesFillFromParent studyID={this.state.currentSelectedStudyId} onEmptySeries={() => console.log('Plus de Series faire Refresh?')} selectRow={this.selectRow} />
              </div>
          </div>
        </div>
      </Fragment>
    )
  }

}

const mapStateToProps = state => {
  return {
    listContent: state.listContent
  }
}

const mapDispatchToProps = {
    addContent, 
    removeContent, 
    deleteContent
}

export default connect(mapStateToProps, mapDispatchToProps)(ContentRootPanel)