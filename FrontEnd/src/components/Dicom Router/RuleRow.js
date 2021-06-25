import React,{Component} from 'react'
import Select from 'react-select'
import {Button} from 'react-bootstrap'

class RuleRow extends Component{

  state={
    value:"",
    operator:"",
    target:"",
  }

  /**
   * Check if data propertie is pass when creating the row
   * If this a modification of an existing Rule, check if the target is StudyDate to place the good operators on select menu
   */
  componentDidMount = () => {
    if(this.props.rule){
      this.setState({
        value:this.props.rule.value,
        operator:{value:this.props.rule.operator,label:this.props.rule.operator},
        target:{value:this.props.rule.target,label:this.props.rule.target},
        operators:this.classic_operators,
      })
      if(this.props.rule.target==="StudyDate"){
        this.setState({
          operators:this.date_operators,
        })
      }
    }
    else{
      this.setState({
        value:"",
        operator:"",
        target:"",
        operators:this.classic_operators,
      })
    }
  }

  classic_operators = [
    {value:"==",label:"=="},
    {value:"IN",label:"IN"}
  ]

  date_operators = [
    {value:">=",label:">= (value over or equal StudyDate)"},
    {value:"<=",label:"<= (value under or equal StudyDate)"}
  ]


  targets = [
    {value:"AccessionNumber",label:"AccessionNumber"},
    {value:"InstitutionName",label:"InstitutionName"},
    {value:"ReferringPhysicianName",label:"ReferringPhysicianName"},
    {value:"RequestedProcedureDescription",label:"RequestedProcedureDescription"},
    {value:"StudyDate",label:"StudyDate"},
    {value:"StudyDescription",label:"StudyDescription"},
  ]

  /**
   * generate from the state a rule with the format for the database
   * @returns {JSON} rule with the format of the database
   */
  generateRule = () => {
    if(!this.state.operator){
      throw new Error('Missing operator!')
    }
    if(!this.state.target){
      throw new Error('Missing target')
    }
    if(this.state.value===""){
      throw new Error('Missing value !')
    }
    let rule = {
      id:this.props.id,
      value:this.state.value, 
      operator:this.state.operator.value,
      target:this.state.target.value
    }
    return rule
  }

  /**
   * Change the state of the value when the field is modified
   * @param {JSON} e Value to catch
   */
  handleChangeValue = async (e) => {
    await this.setState({
      value:e.target.value
    })
    this.refreshRule()
  }

  /**
   * Change the state of the operator when an other one is selected
   * @param {JSON} e Operator to catch
   */
  handleChangeOperator = async (e) => {
    await this.setState({
      operator:e
    })
    this.refreshRule()
  }

  /**
   * Change the state of the target when an other one is selected
   * @param {JSON} e target to catch
   */
  handleChangeTarget = async (e) => {
    if(e.value==="StudyDate" && this.state.target.value!=="StudyDate"){
      this.setState({
        value:"",
        operator:"",
        operators:this.date_operators
      })
    }else{
      if(this.state.target.value==="StudyDate"){
        this.setState({
          value:"",
          operator:"",
          operators:this.classic_operators
        })
      }
    }
    await this.setState({
      target:e
    })
    this.refreshRule()
  }

  /**
   * Refresh the rule, with a formatted rule, on the parent component
   */
  refreshRule = async () => {
    try{
      let rule = await this.generateRule()
      this.props.refresh(rule)
    }catch(err){}
  }

  render(){
    return(
      <div className='row mb-1'>
        <div className='col'>
          {this.state.target.value==="StudyDate" ? 
            <input type='date' name='value' className='form-control' placeholder='Date To' onChange={(e)=>{this.handleChangeValue(e)}} value={this.state.value}/> :
            <input type='text' name='value' className='form-control' value={this.state.value} onChange={(e) => this.handleChangeValue(e)} />}
          
        </div>
        <div className='col'>
          <Select
            name='operator'
            closeMenuOnSelect={true}
            options={this.state.operators}
            onChange={(e) => this.handleChangeOperator(e)}
            value={this.state.operator}
          />
        </div>
        <div className='col'>
          <Select
            name='target'
            closeMenuOnSelect={true}
            options={this.targets}
            onChange={(e) => this.handleChangeTarget(e)}
            value={this.state.target}
          />
        </div>
        <div className='col d-flex justify-content-left'>
          <Button className='btn btn-danger' onClick={() => this.props.delete(this.props.id)} >X</Button>
        </div>
      </div>
    )
  }
}
export default RuleRow