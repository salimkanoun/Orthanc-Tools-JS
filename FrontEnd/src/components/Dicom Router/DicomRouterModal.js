import React, {Component} from "react";
import apis from "../../services/apis";
import {Modal,Button, Alert} from "react-bootstrap";
import { toast } from 'react-toastify'
import AETSelect from './AETSelect'
import RuleRow from './RuleRow'
import Select from 'react-select'

class DicomRouterModal extends Component {

  state={
    id:this.props.data.id,
    name:this.props.data.name,
    condition:this.props.data.condition,
    rules:this.props.data.rules,
    destination:this.props.data.destination,
    ruleList:[],
    data_load:false,
    message:false
  }
  
  componentDidMount = () => {
    switch(this.props.data.condition){
      case "OR":
        this.setState({
          condition_selected:{value:"OR",label:"OR (check one rule)"},
        })
        break
      case "AND":
        this.setState({
          condition_selected:{value:"AND",label:"AND (check all rules)"}
        })
        break
      default:
        this.setState({
          condition_selected:""
        })
        break
    }
    this.handleAddRule()
  }

  componentDidUpdate = async () => {
    await this.updateData()
  }

  /**
   * Update from props and add RuleRow for each Rule
   */
  updateData = async () => {
    if(this.state.name==="" && this.props.data.name!=="" && this.state.data_load===false){
      await this.setState({
        id:this.props.data.id,
        name:this.props.data.name,
        condition:this.props.data.condition,
        rules:this.props.data.rules,
        destination:this.props.data.destination,
        ruleList:[],
        data_load:true,
        message:false
      })
      switch(this.props.data.condition){
        case "OR":
          this.setState({
            condition_selected:{value:"OR",label:"OR (check one rule)"},
          })
          break
        case "AND":
          this.setState({
            condition_selected:{value:"AND",label:"AND (check all rules)"}
          })
          break
        default:
          this.setState({
            condition_selected:""
          })
          break
      }
      await this.checkConflict()
      this.updateRuleList()
    }
  }

  /**
   * Create a RuleRow for each rule
   */
  updateRuleList = () => {
    let rules = this.state.rules
    for(var i = 0;i<rules.length;i++){
      let ruleList = this.state.ruleList
      this.setState({
        ruleList:ruleList.concat(<RuleRow key={rules[i].id} id={rules[i].id} delete={this.onDeleteRule} refresh={this.refreshRules} rule={rules[i]}/>)
      })
    }
  }

  /**
   * Saving the current Dicom router if all state parameters are correct
   */
  handleSave= async () => {
    if(this.state.name==="" || this.state.rules.length===0 || this.state.destination.length===0 || this.state.condition===""){
      toast.error('Arguments missing to create a router')
    }else if(this.state.rules.length!==this.state.ruleList.length){
      toast.error('Invalid rule, arguments missing')
    }else if(this.state.message){
      toast.error("Rule conflict!")
    }
    else{
      if(this.state.id){
        await apis.autorouting.modifyAutorouter(this.state.id,this.state.name,this.state.condition,this.state.rules,this.state.destination)
      }else{
        await apis.autorouting.createAutorouter(this.state.name,this.state.condition,this.state.rules,this.state.destination)
      }
      this.props.refresh()
      this.props.close()
      this.resetOnClose()
      this.props.showMessage()
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
   * Change the condition value to save, and the one that is select on the select menu
   * @param {JSON} e condition to catch
   */
  handleChangeCondition = async (e) => {
    await this.setState({
      condition:e.value,
      condition_selected:e
    })
    await this.checkConflict()
  }

  condition = [ 
    {value:"OR",label:"OR (check one rule)"},
    {value:"AND",label:"AND (check all rules)"}
  ]

  /**
   * Reset the modal state and component with empty components
   */
  resetOnClose= async () => {
    await this.setState({
      id:null,
      name:"",
      condition:"",
      condition_selected:"",
      rules:[],
      destination:[],
      ruleList:[],
      data_load:false,
      message:false
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
    await this.checkConflict()
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
    await this.checkConflict()
  }

  /**
   * Check if there is a conflict between 2 date rules
   */
  checkConflict = async () => {
    if(this.state.condition==="AND"){
      let rules = this.state.rules
      let date_rules = []
      for(let i = 0 ; i < rules.length ; i++){
        if(rules[i].target==="StudyDate"){date_rules.push(rules[i])}
      }

      if(date_rules.length<2){
        this.setState({message:false})
      }
      else if(date_rules.length===2){
        let conflict = false
        for(let i = 0;i<date_rules.length;i++){
          for(let j = 0;j<date_rules.length;j++){
            if(i!==j && !(conflict)){
              conflict = await this._checkDate(date_rules[i],date_rules[j])
            }
          }
        }
        await this.setState({message:conflict})
      }
      else{
        this.setState({message:true})
      }
    }else{
      this.setState({message:false})
    }
  }

  /**
   * Check if two dates rules are in conflict
   * @param {JSON} rule1 first rule
   * @param {JSON} rule2 second rule
   * @returns 
   */
  _checkDate= async (rule1,rule2) => {
    let value1 = Date.parse(rule1.value)
    let value2 = Date.parse(rule2.value)

    if(rule1.operator === ">="){
      if(rule2.operator==="<="){
        if(value1>=value2){
          return false
        }else{
          return true
        }
      }
    }else{
      if(rule2.operator===">="){
        if(value2>=value1){
          return false
        }else{
          return true
        }
      }
    }
    
    if(value1===value2){
      return false
    }else{
      return true
    }
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
        <h3>{this.state.id ? 'Modify an autorouter' : 'Create an autorouter'}</h3>
      </Modal.Header>

      <Modal.Body>
        <div>
          <h5>Name</h5>
          <input type='text' name="name" value={this.state.name} className="form-control" onChange={(e) => this.handleChange(e)} />
        </div>

        <div>
          <h5>Condition</h5>
          <Select
            name='condition'
            closeMenuOnSelect={true}
            options={this.condition}
            onChange={(e) => this.handleChangeCondition(e)}
            value={this.state.condition_selected}
          />
        </div>

        <div>
          <h5>Rules</h5>
          <Alert show={this.state.message} variant='danger'>Conflict between date rules!</Alert>
          <Button className='btn btn-secondary mb-1' onClick={()=>{this.handleAddRule()}}>+</Button>
          {this.state.ruleList}
        </div>

        <div>
          <h5>Destination</h5>
          <AETSelect refresh={this.refreshDestination} aets={this.state.destination}/>
        </div>
      </Modal.Body>

      <Modal.Footer>
        <button className="otjs-button otjs-button-green me-2" onClick={() => this.handleSave()}>
          {this.state.id ? 'Save changes' : 'Create'}
        </button>

        <button className="otjs-button otjs-button-red" onClick={() => this.onHide() }>
          Cancel
        </button>
      </Modal.Footer>

    </Modal>
    )
  }
}

export default DicomRouterModal