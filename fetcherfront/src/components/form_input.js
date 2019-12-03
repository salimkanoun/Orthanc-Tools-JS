import React, { Component } from 'react';
import AetButton from './aet_button'

class FormInput extends Component {
  
  constructor(props){
    super(props)
    this.state = {
      aets : []
    }
    
  }

  async componentDidMount() {
    await this.getAets ()
  }

  async getAets () {
    let aets= await fetch('/aets');
    this.setState( {
      aets : [aets]
    } )
  }

  render(){
    
    let aetButtons=null
    if( ! this.state.aets.length){
      aetButtons=this.buildAetButtons()
    }else{
      aetButtons=null
    }
    return (
      <div class="jumbotron" style={this.props.style}>
          <h2 class="card-title">Manual Input</h2>
          <div class="row">
            <div class="col-sm">
              <label for="lastName">Last Name</label>
              <input type="text" name="lastName" id="lastName" class="form-control" placeholder="last name"/>
            </div>
            <div class="col-sm">
              <label for="firstName">First Name</label>
              <input type="text" name="firstName" id="firstName" class="form-control" placeholder="first name"/>
            </div>
            <div class="col-sm">
              <label for="patientID">Patient ID</label>
              <input type="text" name="patientID" id="patientID" class="form-control" placeholder="Patient ID"/>
            </div>
        </div>
        <div class="row">
            <div class="col-sm">
                <label for="accessionNumber">Accession Number</label>
                <input type="text" name="accessionNumber" id="accessionNumber" class="form-control" placeholder="Accession Number"/>
            </div>
            <div class="col-sm">
                <label for="studyDescription">Study Description</label>
                <input type="text" name="studyDescription" id="studyDescription" class="form-control" placeholder="Study Description"/>
            </div>
            <div class="col-sm">
              <label for="modality">Modality</label>
              <select class="form-control" name="modality" id="modality" multiple>
                <option value="CT">CT</option>
                <option value="PT">PT</option>
                <option value="NM">NM</option>
                <option value="MR">MR</option>
                <option value="US">US</option>
                <option value="MG">MG</option>
              </select>
            </div>

        </div>
        <div class="row">
          <div class="col-sm">
              <label for="dateFrom">Date From</label>
              <input type="date" name="dateFrom" id="dateFrom" class="form-control" placeholder="Date From"/>
            </div>
            <div class="col-sm">
              <label for="dateTo">Date To</label>
              <input type="date" name="dateTo" id="dateTo" class="form-control" placeholder="Date To"/>
            </div>
        </div>
        
        <div class="row text-center mt-5">
          { aetButtons }
        </div>
      </div>
    )
  };

  buildAetButtons(){
    return( this.state.aets.map((item, key) =>
    <AetButton aetName={item} />
    ))
  }
}

export default FormInput;
