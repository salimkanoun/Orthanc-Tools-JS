import React, {Component} from "react";
import Button from "react-bootstrap/esm/Button";
import apis from "../../../services/apis";
import DicomRouterTable from './DicomRouterTable'
import CreateDicomRouterModal from './CreateDicomRouterModal'

class DicomRouterPanel extends Component {
    state={
      routers:null,
      createMode:false
    }
    
    async componentDidMount(){
      let routers = await apis.autorouter.getAutorouters()
      this.setState({
        routers:routers
      })
    }

    render (){
      return(
        <div>
          <h2>Dicom Router</h2>
          <Button className='btn btn-primary float-right' onClick={this.setState({createMode:true})}>Create Router</Button>
          <DicomRouterTable data={this.state.routers||[]}/>
          
        </div>
      )
    }
}

export default DicomRouterPanel