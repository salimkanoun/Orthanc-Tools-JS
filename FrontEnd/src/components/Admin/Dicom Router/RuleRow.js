import React,{Component} from 'react'
import Select from 'react-select'
import {Button} from 'react-bootstrap'

class RuleRow extends Component{
  state={
    value:"",
    operator:"",
    target:""
  }

  operators = [
    {value:"==",label:"=="},
    {value:"IN",label:"IN"}
  ]

  targets = [
    {value:"AccessionNumber",label:"AccessionNumber"},
    {value:"InstitutionName",label:"InstitutionName"},
    {value:"ReferringPhysicianName",label:"ReferringPhysicianName"},
    {value:"RequestedProcedureDescription",label:"RequestedProcedureDescription"},
    {value:"StudyDate",label:"StudyDate"},
    {value:"StudyDescription",label:"StudyDescription"},
    {value:"StudyID",label:"StudyID"},
    {value:"StudyInstanceUID",label:"StudyInstanceUID"},
    {value:"StudyTime",label:"StudyTime"},
  ]

  generateRule = () => {
    console.log(this.state)
    if(!this.state.operator || !this.operators.includes(this.state.operator)){
      throw new Error('Missing or incorrect operator!')
    }
    if(!this.state.target || !this.targets.includes(this.state.target)){
      throw new Error('Missing or incorrect target')
    }
    if(!this.name){
      throw new Error('Missing name !')
    }
    return {id:this.props.id,value:this.state.value, operator:this.state.operator, target:this.state.target}
  }

  handleChangeValue = (e) => {
    this.setState({
      value:e.target.value
    })
  }

  handleChangeOperator = (e) => {
    this.setState({
      operator:e
    })
  }

  handleChangeTarget = (e) => {
    this.setState({
      target:e
    })
  }

  render(){
    return(
      <div className='row mb-1'>
        <div className='col'>
          <input type='text' name='value' className='form-control' value={this.state.value} onChange={(e) => this.handleChangeValue(e)} />
        </div>
        <div className='col'>
          <Select
            name='operator'
            closeMenuOnSelect={true}
            options={this.operators}
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
          <Button className='btn btn-danger' onClick={() => this.generateRule()} >X</Button>
        </div>
      </div>
    )
  }
}
export default RuleRow