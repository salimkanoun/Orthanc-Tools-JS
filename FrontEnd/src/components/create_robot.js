import React, { Component } from 'react';

import { connect } from 'react-redux'
import * as actions from '../actions/FormInput'

class CreateRobot extends Component {

    constructor(props) {
        super(props)
        this.createRobot=this.createRobot.bind(this)
    }

    async createRobot(){

        //SK ICI TRAITER QUE LES RESULTS SELECTIONNES ?
        let results=this.props.results

        let retrieveArray=[]

        results.forEach(result =>{

            let resultToRobot={
                "patientName": result.patientName,
                "patientID": result.patientID,
                "studyDate": result.studyDate,
                "modality": result.modalitiesInStudy,
                "studyDescription": result.studyDescription,
                "accessionNb": result.accessionNumber,
                "aet" : result.originAET
              }
        
            retrieveArray.push(resultToRobot)

        })


        let createAnswer = await fetch("/create_robot",
        {
        method: "POST",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({studyArray : retrieveArray})
        }).then((answer)=>{
            return(answer.json())
        })

        console.log(createAnswer)


    }

    render() {
        return (
            <div className="row">
                Project Name : 
                <input type="text" className="form-control col" />
                <input type="button" className="btn btn-success col" onClick={this.createRobot} value="Create Robot"/>
            </div>
        )
    }
}

const mapStateToProps = ( state )=>{
    return {
      results : state.ResultList.results
    }
  }
  
export default connect(mapStateToProps, actions)(CreateRobot);