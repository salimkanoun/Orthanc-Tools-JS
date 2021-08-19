import React, {Component} from "react";
import {Alert, Col, Row} from "react-bootstrap/";
import Toggle from 'react-toggle'
import apis from "../../services/apis";
import DicomRouterTable from './DicomRouterTable'
import DicomRouterModal from './DicomRouterModal'

class DicomRouterPanel extends Component {
  state = {
    message:false,
    routers:[],
    showModal:false,
    showModify:false,
    modify:{id:null,condition:"",rules:[],destination:[],name:""}
  }
  
  componentDidMount= async () => {
    this.refreshData()
    this.refreshServiceState()
  }

  /**
   * Compare method for sorting routers by ID
   * @param {number} a ID from router A
   * @param {number} b ID from router B
   * @returns {number} 1 if A more recent than b, -1 if B more recent thant A
   */
  _compareRouters =  (a,b) => {
    if(a.id<b.id){ 
      return -1
    }else{
      return 1
    }
  }

  /**
   * Refresh the data needed for the table of routers
   * They get sorted by old to recent
   */
  refreshData = async () => {
    let routers = await apis.autorouting.getAutorouters()
    routers = await routers.sort(this._compareRouters)
    this.setState({
      routers:routers,
      modify:{id:null,condition:"",rules:[],destination:[],name:""}
    })
  }

  /**
   * Refresh the status of the router for the toggle button value
   */
  refreshServiceState = async () => {
    let service = await apis.autorouter.getAutorouter()
    this.setState({
      service_running:service.AutorouterService
    })
  }

  /**
   * Open the modal dialog that permit to create or modify routers when a router is selected or not
   * if selected, the router could be modified
   * else permit to creare a new router
   * @param {JSON} router router that could be modified with the modal
   */
  handleOpenModal = (router=null) => {
    if(router){
      this.setState({modify:router})
    }
    this.setState({showModal:true})
  }

  /**
   * Close the modal dialog that permit to create or modify routers
   */
  handleCloseModal = () => {
    this.setState({modify:{id:null,condition:"",rules:[],destination:[],name:""},showModal:false})
  }

  /**
   * Catch the event on the toggle to Start or Stop the dicom router
   * @param {JSON} e Toggle button to catch
   */
  handleAutorouterService = async (e) => {
    if(e.target.checked){
      await apis.autorouter.startAutorouterService()
      this.setState({message:false})
    }else{
      await apis.autorouter.stopAutorouterService()
    }

    this.refreshServiceState()
  }

  /**
   * Show the information message on top of the screen
   */
  showMessage = () => {
    if(!this.state.message){
      this.setState({
        message:true
      })
    }
  }

  render (){
    return(
      <div>
        <div><Alert show={this.state.message} variant='info'>To apply changes on the router (re)start it !</Alert></div>
        <Row className="border-bottom border-2 pb-3">
            <Col className="d-flex justify-content-start align-items-center">
                <i className="fas fa-broadcast-tower ico me-3"></i><h2 className="card-title">Dicom Router</h2>
            </Col>
            <Col className="text-center">
              <Toggle checked={this.state.service_running} onChange={(e) => this.handleAutorouterService(e)} />
            </Col>
        </Row>
        <Row className="mt-5">
          <button type="button" className="otjs-button otjs-button-blue w-10" onClick={() => this.handleOpenModal()}>Create Router</button>
        </Row>
        <Row className="mt-5 text-center">
          <Col>
            <DicomRouterTable data={this.state.routers} refresh={() => this.refreshData()} modify={this.handleOpenModal} showMessage={this.showMessage} />
            <DicomRouterModal data={this.state.modify} showModal={this.state.showModal} close={()=> this.handleCloseModal()} refresh={() => this.refreshData()} showMessage={this.showMessage}/>
          </Col>
        </Row>
        
      </div>
    )
  }
}

export default DicomRouterPanel