import React, { Component } from 'react';

class FormInput extends Component {
  render(){
    return (
      <div class="jumbotron">
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
  {/*             <% availableAets.forEach(aetName => { 
                %> <div class="col-sm">
                  <input type="button" class="btn btn-info btn-large queryAET" value="<%= aetName%>">
                </div> 
              <%  
              }); %>  */}
        </div>
      </div>
    )
  };
}

export default FormInput;
