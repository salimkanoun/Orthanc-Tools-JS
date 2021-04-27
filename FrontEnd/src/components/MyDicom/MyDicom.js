import React, { Component } from 'react'
import apis from '../../services/apis'
import { connect } from 'react-redux'
//import { SHA1 } from 'crypto-js/sha1'

class MyDicom extends Component{
  state = {
    user:null,
    labels:null,
    username:this.props.username,
    studies:[]
  }

  constructor(props){
    super(props)
    this.initializeState()
  }

  getUser = async () => {
    let users = await apis.User.getUsers()
    for(var i = 0;i<users.length;i++){
      if(users[i].username===this.props.username){
        this.setState({
          user:users[i]
        })
        break
      }
    }
  }

  getUserLabels = async () => {
    if(this.state.user!==null){
      let label_tab = await apis.userlabel.getUserLabels(this.state.user.id)
      this.setState({
        labels:label_tab
      })
      console.log(this.state)
    }else{
      throw new Error('Undefined user')
    }
  }

  initializeState = async () => {
    await this.getUser()
    await this.getUserLabels()
  }

  getStudiesByLabel = async (name) => {
    return await apis.studylabel.getStudiesLabel(name)
  }
/*
  _getOrthancStudyID = () => {
    let hash = SHA1( this.getPatientID() + '|' + this.getStudyInstanceUID() ).toString()
    return `${hash.substring(0, 8)}-${hash.substring(8, 16)}-${hash.substring(16, 24)}-${hash.substring(24, 32)}-${hash.substring(32, 40)}`
  }*/

  handleClick = async (e) => {
    var label = e.target.name
    var studies = await this.getStudiesByLabel(label)
    console.log(studies)

    for(var i = 0;i<studies.length;i++){
      //study instance uid to orthanc id ??? (need patientID but how do we do ???)
      //get informations for a study
    }
  }



  render = () => {
//just to test buttons
    let labels = null
    if(this.state.labels!=null){
      labels = this.state.labels
    }
    else{
      labels = []
    }
    labels.push('pancrea' , 'mic', 'radio', 'fracture')

    return (
      <div>
        <div className='jumbotron' name='buttons'>
          <h1>Labels</h1> 
          {labels.map(label => (
            <button name={label} key={label} type='button' className='btn btn-primary' onClick={this.handleClick}> {label} </button>
          ))}
        </div>
        
        <div className='jumbotron' name='studies'>
        </div>
      </div>
    )
  }

}

const mapStateToProps = (state) => {
  return {
    username: state.OrthancTools.username
  }
}

export default connect(mapStateToProps)(MyDicom)