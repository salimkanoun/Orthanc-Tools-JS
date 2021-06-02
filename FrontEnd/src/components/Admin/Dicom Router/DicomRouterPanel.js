import React, {Component} from "react";
import Button from "react-bootstrap/esm/Button";
import apis from "../../../services/apis";
import DicomRouterTable from './DicomRouterTable'
import CreateDicomRouterModal from './CreateDicomRouterModal'

class DicomRouterPanel extends Component {
    state = {
      routers:[],
      createMode:false
    }
    
    componentDidMount= async () => {
      await this.refreshData()
    }

    refreshData = async () => {
      let routers = await apis.autorouter.getAutorouters()
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
          <h2>Dicom Router</h2>
          <Button className='btn btn-warning float-right' onClick={() => this.handleOpenModal()}>Create Router</Button>
          <DicomRouterTable data={this.state.routers} refresh={() => this.refreshData()}/>
          <CreateDicomRouterModal showModal={this.state.createMode} close={() => this.handleCloseModal()} refresh={() => this.refreshData()} />
        </div>
      )
    }
}

export default DicomRouterPanel