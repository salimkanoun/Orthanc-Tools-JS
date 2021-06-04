import React, {Component} from "react";
import {Button,Modal} from 'react-bootstrap'
import apis from "../../../services/apis";
import Table from '../../CommonComponents/RessourcesDisplay/ReactTable/CommonTable'
import Toggle from 'react-toggle'

class DicomRouterTable extends Component {
  state={
    delete:false,
    id_delete:-1
  }

  columns = [
    {
      Header: 'ID',
      accessor : 'id',
      hidden:true
    },
    {
      Header: 'Router\'s Name',
      accessor : 'name',
    },
    {
      Header: 'Rules',
      accessor:'rules',
      Cell: (row) => {
        let rules = row.row.values.rules
        return(
          <div className='container'>
            {rules.map(rule => (<div className='row m-1 p-2 border border-dark rounded justify-content-center' style={{'background-color':'rgb(88,220,124)'}}>
              <div className='col justify-content-center'>{rule.value}</div>
              <div className='col justify-content-center'>{rule.operator}</div>
              <div className='col justify-content-center'>{rule.target}</div>
            </div>))}
          </div>
        )
      },
    },
    {
      Header: 'Target',
      accessor: 'target',
      hidden:true
    },
    {
      Header :'AET Destination',
      accessor:'destination',
    },
    {
      Header: 'Running ?',
      accessor:'running',
      Cell:(row)=>{
        return(
        <span>
          <Toggle checked={row.row.values.running} onChange={()=>{this.handleSwitch(row.row.original.id,row.row.values.running)}}/>
        </span>
        )
      }
    },
    {
      Header :'',
      accessor:'modify and delte',
      Cell:(row)=>{
        return(
          <span>
          <Button className='btn btn-primary mr-1' onClick={()=>{console.log('modify')}}>Modify</Button>
          <Button className='btn btn-danger' onClick={()=>{this.showDeleteConfirmation(row.row.values.id)}}>Delete</Button>
        </span>
        )
      }
    }
  ]

  handleSwitch= async (id,running) => {
    await apis.autorouter.switchOnOff(id,!running)
    await this.props.refresh()
  }

  showDeleteConfirmation = (id) => {
    this.setState({
      delete:true,
      id_delete:id
    })
  }

  onHide = () => {
    this.setState({
      delete:false,
      id_delete:-1
    })
  }

   removeRouter = async () => {
    await apis.autorouter.deleteAutorouter(this.state.id_delete)
    this.onHide()
    this.props.refresh()
   }

  render = () => {
    return(<>
      <Modal 
        show={this.state.delete}
        keyboard={true} 
        animation={true} 
        onHide={() => this.onHide()} 
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton><h5>Delete Router</h5></Modal.Header>
        <Modal.Body>Are you sure you want to delete this router ?</Modal.Body>
        <Modal.Footer>
          <Button className='btn btn-secondary' onClick={()=>{this.onHide()}}>Cancel</Button>
          <Button className='btn btn-danger' onClick={()=>{this.removeRouter()}}>Delete</Button>
        </Modal.Footer>
      </Modal>
      <Table columns={this.columns} tableData={this.props.data}/>
      </>
    )
  }
}

export default DicomRouterTable