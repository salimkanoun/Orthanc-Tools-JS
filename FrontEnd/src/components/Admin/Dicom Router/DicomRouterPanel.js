import React, {Component} from "react";
import Button from "react-bootstrap/esm/Button";
import apis from "../../../services/apis";
import DicomRouterTable from './DicomRouterTable'
import CreateDicomRouterModal from './DicomRouterModal'

class DicomRouterPanel extends Component {
    state = {
      routers:[],
      createMode:false
    }
    
    componentDidMount= async () => {
      await this.refreshData()
    }

    _compareRouters =  (a,b) => {
      if(a.id<b.id){
        return -1
      }else{
        return 1
      }
    }

    refreshData = async () => {
      let routers = await apis.autorouter.getAutorouters()
      routers = await routers.sort(this._compareRouters)
      this.setState({
        routers:routers
      })
    }

    handleCloseModal = () => {
      this.setState({createMode:false})
    }

    handleOpenModal = () => {
      this.setState({createMode:true})
    }

    render (){
      return(
        <div>
          <h2>Dicom Router</h2> <i>(to apply changes to routing system, restart the server)</i> 
          <Button className='btn btn-warning float-right' onClick={() => this.handleOpenModal()}>Create Router</Button>
          <DicomRouterTable data={this.state.routers} refresh={() => this.refreshData()}/>
          <CreateDicomRouterModal showModal={this.state.createMode} close={() => this.handleCloseModal()} refresh={() => this.refreshData()} />
        </div>
      )
    }
}

export default DicomRouterPanel