import React, {Component} from "react";
import Button from "react-bootstrap/esm/Button";
import apis from "../../services/apis";
import DicomRouterTable from './DicomRouterTable'
import ModifyDicomRouterModal from './DicomRouterModal'

class DicomRouterPanel extends Component {
  state = {
    routers:[],
    showModal:false,
    showModify:false,
    modify:{id:null,rules:[],destination:[],name:""}
  }
  
  componentDidMount= async () => {
    await this.refreshData()
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
    let routers = await apis.autorouter.getAutorouters()
    routers = await routers.sort(this._compareRouters)
    this.setState({
      routers:routers,
      modify:{id:null,rules:[],destination:[],name:""}
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
    this.setState({modify:{id:null,rules:[],destination:[],name:""},showModal:false})
  }

  render (){
    return(
      <div className='jumbotron'>
        <h2>Dicom Router</h2> <i>(to apply changes to routing system, restart the server)</i> 
        <Button className='btn btn-warning float-right' onClick={() => this.handleOpenModal()}>Create Router</Button>
        <DicomRouterTable data={this.state.routers} refresh={() => this.refreshData()} modify={this.handleOpenModal}/>
        <ModifyDicomRouterModal data={this.state.modify} showModal={this.state.showModal} close={()=> this.handleCloseModal()} refresh={() => this.refreshData()}/>
      </div>
    )
  }
}

export default DicomRouterPanel