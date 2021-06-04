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

  /**
   * Saving the current Dicom router if all state parameters are correct
   */
  handleSave= async () => {
    //console.log(this.state)
    if(this.state.name==="" || this.state.rules.length===0 || this.state.destination.length===0){
      toast.error('Arguments missing to create a router')
    }else if(this.state.rules.length!==this.state.ruleList.length){
      toast.error('Invalid rule, arguments missing')
    }
    else{
      await apis.autorouter.createAutorouter(this.state.name,this.state.rules,this.state.destination)
      this.props.refresh()
      this.props.close()
      this.resetOnClose()
    }
  }

  /**
   * Reset the state from the target of the event
   * @param {*} e event to catch
   */
  handleChange = (e) => {
    const target = e.target
    const name = target.name
    const value = target.value

    this.setState({
      [name]:value
    })
  }

  /**
   * Reset the modal state and component with empty components
   */
  resetOnClose= async () => {
    await this.setState({
      name:"",
      rules:[],
      destination:[],
      ruleList:[]
    })

    this.handleAddRule()
  }

  /**
   * Refresh the destination array with the current selected Destination
   * @param {Array.<String>} selected 
   */
  refreshDestination = (selected) => {
    let destination = []
    for(let i =0;i<selected.length;i++){
      destination.push(selected[i].value)
    }
    this.setState({
      destination:destination
    })
  }

  refreshRules = async (rule) => {
    let rules = [...this.state.rules]
    for(let i=0;i<rules.length;i++){
      if(rules[i].id===rule.id){
        rules.splice(i,1)
        break
      }
    }
    rules.push(rule)
    await this.setState({rules:rules})
  }

  /**
   * Add a rule to the ruleList and generate a RuleRow component to display
   * Create an identifier with a random string
   */
  handleAddRule = () => {
    const ruleList = this.state.ruleList
    let randomString = this._makeKey(8)
    this.setState({
      ruleList:ruleList.concat(<RuleRow key={randomString} id={randomString} delete={this.onDeleteRule} refresh={this.refreshRules} />)
    })
  }

  /**
   * Create a random string of hte length assigned in parameter
   * @param {number} length 
   * @returns {String} a random string of the length in parameter
   */
  _makeKey = (length) => {
    var result           = [];
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
      result.push(characters.charAt(Math.floor(Math.random() *  charactersLength)));
    }
    return result.join('');
  }

  /**
   * Delete the rule on the ruleList according to his id
   * @param {String} id random id given in props identify the rule on the rule list
   */
  onDeleteRule = async (id) => {
    let ruleList = [...this.state.ruleList]
    let rules = [...this.state.rules]
    for(var i = 0;i<ruleList.length;i++){
      if(ruleList[i].props.id===id){
        ruleList.splice(i,1)
        break
      }
    }
    for(let j=0;j<rules.length;j++){
      if(rules[j].id===id){
        rules.splice(j,1)
        break
      }
    }
    await this.setState(({
      ruleList:ruleList,
      rules:rules
    }))
  }

  /**
   * Function to close the modal and reset all the state parameters (name, rules, destination)
   */
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