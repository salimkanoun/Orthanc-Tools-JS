import React, {Component} from "react";
import apis from "../../../services/apis";
import {Modal,Button} from "react-bootstrap";
import { toast } from 'react-toastify'
import AETSelect from './AETSelect'
import RuleRow from './RuleRow'

class CreateDicomRouterModal extends Component {

  state={
    name:"",
    rules:[],
    destination:[],
    ruleList:[]
  }
  
  componentDidMount = () => {
    this.handleAddRule()
  }

  handleSave= ()=> {
    //console.log(this.state)
    if(this.state.name==="" || this.state.rules.length===0 || this.state.destination.length===0){
      toast.error('Arguments missing to create a router')
    }
    else{
      //await apis.autorouter.createAutorouter(this.state.name,this.state.rules,this.state.destination)
      this.props.refresh()
      this.resetOnClose()
      this.props.close()
    }
  }

  handleChange = (e) => {
    const target = e.target
    const name = target.name
    const value = target.value

    this.setState({
      [name]:value
    })
  }

  resetOnClose= () => {
    console.log('first')
    this.setState({
      name:"",
      rules:[],
      destination:[],
      ruleList:[]
    })
    console.log(this.state)
    this.handleAddRule()
  }

  refreshDestination = (selected) => {
    let destination = []
    for(let i =0;i<selected.length;i++){
      destination.push(selected[i].value)
    }
    this.setState({
      destination:destination
    })
  }

  refreshRules = (rules) => {
    
  }

  handleAddRule = () => {
    console.log(this.state.ruleList)
    const ruleList = this.state.ruleList
    let randomString = this.makeKey(8)
    this.setState({
      ruleList:ruleList.concat(<RuleRow key={randomString} id={randomString} delete={this.onDeleteRule}/>)
    })
  }

  makeKey = (length) => {
    var result           = [];
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
      result.push(characters.charAt(Math.floor(Math.random() *  charactersLength)));
    }
    return result.join('');
  }

  onDeleteRule = (id) => {
    let ruleList = [...this.state.ruleList]
    for(var i = 0;i<ruleList.length;i++){
      if(ruleList[i].props.id===id){
        ruleList.splice(i,1)
        break
      }
    }
    this.setState(({
      ruleList:ruleList
    }))
  }

  onHide = () => {
    this.props.close()
    this.resetOnClose()
  }

  render(){
    return(
    <Modal 
      show={this.props.showModal} 
      keyboard={true} 
      backdrop="static" 
      animation={true} 
      onHide={() => this.onHide()} 
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <h3>Create an autorouter</h3>
      </Modal.Header>

      <Modal.Body>
        <div>
          <h5>Name</h5>
          <input type='text' name="name" value={this.state.name} className="form-control" onChange={(e) => this.handleChange(e)} />
        </div>

        <div>
          <h5>Rules</h5>
          <Button className='btn btn-secondary mb-1' onClick={()=>{this.handleAddRule()}}>+</Button>
          {this.state.ruleList}
        </div>

        <div>
          <h5>Destination</h5>
          <AETSelect refresh={this.refreshDestination}/>
        </div>
      </Modal.Body>

      <Modal.Footer>
        <Button className="btn btn-danger" onClick={() => this.onHide() }>
          Cancel
        </Button>
        <Button className="btn btn-success" onClick={() => this.handleSave()}>
          Save Changes
        </Button>
      </Modal.Footer>

    </Modal>
    )
  }
}



export default CreateDicomRouterModal