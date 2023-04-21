import React, { useEffect, useState } from 'react'
import Select from 'react-select'
import { Button } from 'react-bootstrap'

export default ({ rule, id, refresh, onDelete }) => {

  const [state, setState] = useState({
    value: "",
    operator: "",
    target: "",
    operators: undefined
  })

  /**
   * Check if data propertie is pass when creating the row
   * If this a modification of an existing Rule, check if the target is StudyDate to place the good operators on select menu
   */
  useEffect(() => {
    if (rule) {
      setState((state) => ({
        ...state,
        ['value']: rule.value,
        ['operator']: { value: rule.operator, label: rule.operator },
        ['target']: { value: rule.target, label: rule.target },
        ['operators']: classic_operators,
      }))
      if (rule.target === "StudyDate") {
        setState((state) => ({
          operators: date_operators
        }))
      }
    }
    else {
      setState((state) => ({
        ...state,
        ['value']: "",
        ['operator']: "",
        ['target']: "",
        ['operators']: classic_operators,
      }))
    }
  }, [])


  const classic_operators = [
    { value: "==", label: "==" },
    { value: "IN", label: "IN" }
  ]

  const date_operators = [
    { value: ">=", label: ">= (value over or equal StudyDate)" },
    { value: "<=", label: "<= (value under or equal StudyDate)" }
  ]


  const targets = [
    { value: "AccessionNumber", label: "AccessionNumber" },
    { value: "InstitutionName", label: "InstitutionName" },
    { value: "ReferringPhysicianName", label: "ReferringPhysicianName" },
    { value: "RequestedProcedureDescription", label: "RequestedProcedureDescription" },
    { value: "StudyDate", label: "StudyDate" },
    { value: "StudyDescription", label: "StudyDescription" },
  ]

  /**
   * generate from the state a rule with the format for the database
   * @returns {JSON} rule with the format of the database
   */
  const generateRule = () => {
    if (!state.operator) {
      throw new Error('Missing operator!')
    }
    if (!state.target) {
      throw new Error('Missing target')
    }
    if (state.value === "") {
      throw new Error('Missing value !')
    }
    let rule = {
      id: id,
      value: state.value,
      operator: state.operator.value,
      target: state.target.value
    }
    return rule
  }

  /**
   * Change the state of the value when the field is modified
   * @param {JSON} e Value to catch
   */
  const handleChangeValue = async (e) => {
    await setState((state) => ({
      ...state,
      ['value']: e.target.value
    }))
    refreshRule()
  }

  /**
   * Change the state of the operator when an other one is selected
   * @param {JSON} e Operator to catch
   */
  const handleChangeOperator = async (e) => {
    await setState((state) => ({
      ...state,
      ['operator']: e
    }))
    refreshRule()
  }

  /**
   * Change the state of the target when an other one is selected
   * @param {JSON} e target to catch
   */
  const handleChangeTarget = async (e) => {
    if (e.value === "StudyDate" && state.target.value !== "StudyDate") {
      setState((state) => ({
        ...state,
        ['value']: "",
        ['operator']: "",
        ['operators']: date_operators
      }))
    } else {
      if (state.target.value === "StudyDate") {
        setState((state) => ({
          ...state,
          ['value']: "",
          ['operator']: "",
          ['operators']: classic_operators
        }))
      }
    }
    await setState((state) => ({
      ...state,
      target: e
    }))
    refreshRule()
  }

  /**
   * Refresh the rule, with a formatted rule, on the parent component
   */
  const refreshRule = async () => {
    try {
      let rule = await generateRule()
      refresh(rule)
    } catch (err) { }
  }

  return (
    <div className='row mb-1'>
      <div className='col'>
        {state.target.value === "StudyDate" ?
          <input type='date' name='value' className='form-control' placeholder='Date To' onChange={(e) => { handleChangeValue(e) }} value={state.value} /> :
          <input type='text' name='value' className='form-control' value={state.value} onChange={(e) => handleChangeValue(e)} />}

      </div>
      <div className='col'>
        <Select
          name='operator'
          closeMenuOnSelect={true}
          options={state.operators}
          onChange={(e) => handleChangeOperator(e)}
          value={state.operator}
        />
      </div>
      <div className='col'>
        <Select
          name='target'
          closeMenuOnSelect={true}
          options={targets}
          onChange={(e) => handleChangeTarget(e)}
          value={state.target}
        />
      </div>
      <div className='col d-flex justify-content-left'>
        <Button className='btn btn-danger' onClick={() => onDelete(id)} >X</Button>
      </div>
    </div>
  )

}