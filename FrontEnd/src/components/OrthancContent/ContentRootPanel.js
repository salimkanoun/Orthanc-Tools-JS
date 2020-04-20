import React, { Fragment, Component } from 'react'
import SearchForm from './SearchForm'
import apis from '../../services/apis'

import TableSeriesFillFromParent from '../CommonComponents/RessourcesDisplay/TableSeriesFillFromParent'
import TablePatientsWithNestedStudies from '../CommonComponents/RessourcesDisplay/TablePatientsWithNestedStudies'


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
    onSelect: this.handleRowSelect
  }

  async handleRowSelect(row){
      
      console.log("Selected row : ", row)
  }

   rowEventsStudies = {
      onClick: (e, row, rowIndex) => {
            this.setState({
              currentSelectedStudyId : row.StudyOrthancID
            })
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
          <div >
            <SearchForm onSubmit={this.sendSearch}/>
          </div>
          <div className='row'>
              <div className='col-sm'>
                  <TablePatientsWithNestedStudies patients={this.state.studies} selectRow={ this.selectRow } rowEventsStudies={ this.rowEventsStudies } onDeletePatient={this.onDeletePatient} onDeleteStudy={this.onDeleteStudy} rowStyleStudies={this.rowStyleStudies} />
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

export default ContentRootPanel