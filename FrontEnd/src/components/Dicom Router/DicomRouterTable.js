import React, {Component} from "react";
import {Modal} from 'react-bootstrap'
import apis from "../../services/apis";
import Table from '../CommonComponents/RessourcesDisplay/ReactTable/CommonTable'
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
      Header:'Condition',
      accessor:'condition',
    },
    {
      Header: 'Rules',
      accessor:'rules',
      Cell: (row) => {
        let rules = row.row.values.rules
        return(
          <div className='container'>
            {rules.map(rule => (<div key={rule.id} className='row m-1 p-2 border border-dark rounded justify-content-center' style={{'backgroundColor':'rgb(88,220,124)'}}>
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
          <Toggle key={row.row.values.id} checked={row.row.values.running} onChange={()=>{this.handleSwitch(row.row.original.id,row.row.values.running)}}/>
        </span>
        )
      }
    },
    {
      Header :'',
      accessor:'modify and delete',
      Cell:(row)=>{
        return(
        <span>
          <button className='otjs-button otjs-button-orange me-1' onClick={()=>{this.props.modify(row.row.values)}}>Modify</button>
          <button className='otjs-button otjs-button-red' onClick={()=>{this.showDeleteConfirmation(row.row.values.id)}}>Delete</button>
        </span>
        )
      }
    }
  ]

  /**
   * Switch ON/OFF the running button by updating the database
   * @param {number} id id of the autorouter to switch
   * @param {boolean} running current value of the switch
   */
  handleSwitch= async (id,running) => {
    await apis.autorouting.switchOnOff(id,!running)
    await this.props.refresh()
    this.props.showMessage()
  }

  /**
   * Show the modal dialog that confirm the delete process
   * @param {number} id id of the autorouter to delete
   */
  showDeleteConfirmation = (id) => {
    this.setState({
      delete:true,
      id_delete:id
    })
  }

  /**
   * Close the modal dialog made for deleting
   */
  onHide = () => {
    this.setState({
      delete:false,
      id_delete:-1
    })
  }

  /**
   * Remove the router after deleting was confirmed on the opened modal dialog
   */
  removeRouter = async () => {
    await apis.autorouting.deleteAutorouter(this.state.id_delete)
    this.onHide()
    this.props.refresh()
    this.props.showMessage()
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
          <button className='otjs-button otjs-button-orange me-1' onClick={()=>{this.onHide()}}>Cancel</button>
          <button className='otjs-button otjs-button-red' onClick={()=>{this.removeRouter()}}>Delete</button>
        </Modal.Footer>
      </Modal>
      <Table columns={this.columns} tableData={this.props.data}/>
      </>
    )
  }
}

export default DicomRouterTable