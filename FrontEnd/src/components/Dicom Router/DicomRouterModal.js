import React, { useEffect, useState } from "react";
import { Modal, Button, Alert } from "react-bootstrap";
import { toast } from 'react-toastify'
import Select from 'react-select'

import apis from "../../services/apis";

import AETSelect from './AETSelect'
import RuleRow from './RuleRow'

export default ({ data, refresh, close, showMessage, showModal }) => {

  const [state, setState] = useState({
    id: data.id,
    name: data.name,
    condition: data.condition,
    rules: data.rules,
    destination: data.destination,
    ruleList: [],
    data_load: false,
    message: false,
    condition_selected: { value: '', label: '' }
  })

  useEffect(() => {
    updateData()
    switch (data.condition) {
      case "OR":
        setState((state) => ({
          ...state,
          ['condition_selected']: { value: "OR", label: "OR (check one rule)" }
        })
        )
        break
      case "AND":
        setState((state) => ({
          ...state,
          ['condition_selected']: { value: "AND", label: "AND (check all rules)" }
        })
        )
        break
      default:
        setState((state) => ({
          ...state,
          ['condition_selected']: ""
        })
        )
        break
    }
    handleAddRule()
  }, [])

  /**
   * Update from props and add RuleRow for each Rule
   */
  const updateData = async () => {
    if (state.name === "" && data.name !== "" && state.data_load === false) {
      await setState((state) => ({
        ...state,
        ['id']: data.id,
        ['name']: data.name,
        ['condition']: data.condition,
        ['rules']: data.rules,
        ['destination']: data.destination,
        ['ruleList']: [],
        ['data_load']: true,
        ['message']: false
      })
      )
      switch (data.condition) {
        case "OR":
          setState((state) => ({
            ...state,
            ['condition_selected']: { value: "OR", label: "OR (check one rule)" }
          })
          )
          break
        case "AND":
          setState((state) => ({
            ...state,
            ['condition_selected']: { value: "AND", label: "AND (check all rules)" }
          })
          )
          break
        default:
          setState((state) => ({
            ...state,
            ['condition_selected']: ""
          })
          )
          break
      }
      await checkConflict()
      updateRuleList()
    }
  }

  /**
   * Create a RuleRow for each rule
   */
  const updateRuleList = () => {
    let rules = state.rules
    for (var i = 0; i < rules.length; i++) {
      let ruleList = state.ruleList
      setState((state) => ({
        ...state,
        ['ruleList']: ruleList.concat(<RuleRow key={rules[i].id} id={rules[i].id} onDelete={onDeleteRule} refresh={refreshRules} rule={rules[i]} />)
      })
      )
    }
  }

  /**
   * Saving the current Dicom router if all state parameters are correct
   */
  const handleSave = async () => {
    if (state.name === "" || state.rules.length === 0 || state.destination.length === 0 || state.condition === "") {
      toast.error('Arguments missing to create a router', { data: { type: 'notification' } })
    } else if (state.rules.length !== state.ruleList.length) {
      toast.error('Invalid rule, arguments missing', { data: { type: 'notification' } })
    } else if (state.message) {
      toast.error("Rule conflict!", { data: { type: 'notification' } })
    }
    else {
      if (state.id) {
        await apis.autorouting.modifyAutorouter(state.id, state.name, state.condition, state.rules, state.destination)
      } else {
        await apis.autorouting.createAutorouter(state.name, state.condition, state.rules, state.destination)
      }
      refresh()
      close()
      resetOnClose()
      showMessage()
    }
  }

  /**
   * Reset the state from the target of the event
   * @param {*} e event to catch
   */
  const handleChange = (e) => {
    const target = e.target
    const name = target.name
    const value = target.value

    setState((state) => ({
      ...state,
      [name]: value
    })
    )
  }

  /**
   * Change the condition value to save, and the one that is select on the select menu
   * @param {JSON} e condition to catch
   */
  const handleChangeCondition = async (e) => {
    await setState((state) => ({
      ...state,
      ['condition']: e.value,
      ['condition_selected']: e
    })
    )
    await checkConflict()
  }

  const condition = [
    { value: "OR", label: "OR (check one rule)" },
    { value: "AND", label: "AND (check all rules)" }
  ]

  /**
   * Reset the modal state and component with empty components
   */
  const resetOnClose = async () => {
    await setState((state) => ({
      ...state,
      ['id']: null,
      ['name']: "",
      ['condition']: "",
      ['condition_selected']: "",
      ['rules']: [],
      ['destination']: [],
      ['ruleList']: [],
      ['data_load']: false,
      ['message']: false,
    })
    )

    handleAddRule()
  }

  /**
   * Refresh the destination array with the current selected Destination
   * @param {Array.<String>} selected 
   */
  const refreshDestination = (selected) => {
    let destination = []
    for (let i = 0; i < selected.length; i++) {
      destination.push(selected[i].value)
    }
    setState((state) => ({
      ...state,
      ['destination']: destination,
    }))
  }

  const refreshRules = async (rule) => {
    let rules = [...state.rules]
    for (let i = 0; i < rules.length; i++) {
      if (rules[i].id === rule.id) {
        rules.splice(i, 1)
        break
      }
    }
    rules.push(rule)
    await setState((state) => ({
      ...state,
      ['rules']: rules
    }))
    await checkConflict()
  }

  /**
   * Add a rule to the ruleList and generate a RuleRow component to display
   * Create an identifier with a random string
   */
  const handleAddRule = () => {
    const ruleList = state.ruleList
    let randomString = _makeKey(8)
    setState((state) => ({
      ...state,
      ['ruleList']: ruleList.concat(<RuleRow key={randomString} id={randomString} onDelete={onDeleteRule} refresh={refreshRules} />)
    }))
  }

  /**
   * Create a random string of hte length assigned in parameter
   * @param {number} length 
   * @returns {String} a random string of the length in parameter
   */
  const _makeKey = (length) => {
    var result = [];
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
      result.push(characters.charAt(Math.floor(Math.random() * charactersLength)));
    }
    return result.join('');
  }

  /**
   * Delete the rule on the ruleList according to his id
   * @param {String} id random id given in props identify the rule on the rule list
   */
  const onDeleteRule = async (id) => {
    let ruleList = [...state.ruleList]
    let rules = [...state.rules]
    for (var i = 0; i < ruleList.length; i++) {
      if (ruleList[i].props.id === id) {
        ruleList.splice(i, 1)
        break
      }
    }
    for (let j = 0; j < rules.length; j++) {
      if (rules[j].id === id) {
        rules.splice(j, 1)
        break
      }
    }
    await setState((state) => ({
      ...state,
      ['ruleList']: ruleList,
      ['rules']: rules
    }))
    await checkConflict()
  }

  /**
   * Check if there is a conflict between 2 date rules
   */
  const checkConflict = async () => {
    if (state.condition === "AND") {
      let rules = state.rules
      let date_rules = []
      for (let i = 0; i < rules.length; i++) {
        if (rules[i].target === "StudyDate") { date_rules.push(rules[i]) }
      }

      if (date_rules.length < 2) {
        setState((state) => ({
          ...state,
          ['message']: false
        }))
      }
      else if (date_rules.length === 2) {
        let conflict = false
        for (let i = 0; i < date_rules.length; i++) {
          for (let j = 0; j < date_rules.length; j++) {
            if (i !== j && !(conflict)) {
              conflict = await _checkDate(date_rules[i], date_rules[j])
            }
          }
        }
        await setState((state) => ({
          ...state,
          ['message']: conflict
        }))
      }
      else {
        setState((state) => ({
          ...state,
          ['message']: true
        }))
      }
    } else {
      setState((state) => ({
        ...state,
        ['message']: false
      }))
    }
  }

  /**
   * Check if two dates rules are in conflict
   * @param {JSON} rule1 first rule
   * @param {JSON} rule2 second rule
   * @returns 
   */
  const _checkDate = async (rule1, rule2) => {
    let value1 = Date.parse(rule1.value)
    let value2 = Date.parse(rule2.value)

    if (rule1.operator === ">=") {
      if (rule2.operator === "<=") {
        if (value1 >= value2) {
          return false
        } else {
          return true
        }
      }
    } else {
      if (rule2.operator === ">=") {
        if (value2 >= value1) {
          return false
        } else {
          return true
        }
      }
    }

    if (value1 === value2) {
      return false
    } else {
      return true
    }
  }

  /**
   * Function to close the modal and reset all the state parameters (name, rules, destination)
   */
  const onHide = () => {
    close()
    resetOnClose()
  }

  return (
    <Modal
      show={showModal}
      keyboard={true}
      backdrop="static"
      animation={true}
      onHide={() => onHide()}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <h3>{state.id ? 'Modify an autorouter' : 'Create an autorouter'}</h3>
      </Modal.Header>

      <Modal.Body>
        <div>
          <h5>Name</h5>
          <input type='text' name="name" value={state.name} className="form-control" onChange={(e) => handleChange(e)} />
        </div>

        <div>
          <h5>Condition</h5>
          <Select
            name='condition'
            closeMenuOnSelect={true}
            options={condition}
            onChange={(e) => handleChangeCondition(e)}
            value={state.condition_selected}
          />
        </div>

        <div>
          <h5>Rules</h5>
          <Alert show={state.message} variant='danger'>Conflict between date rules!</Alert>
          <Button className='btn btn-secondary mb-1' onClick={() => { handleAddRule() }}>+</Button>
          {state.ruleList}
        </div>

        <div>
          <h5>Destination</h5>
          <AETSelect refresh={refreshDestination} aets={state.destination} />
        </div>
      </Modal.Body>

      <Modal.Footer>
        <Button className="otjs-button otjs-button-green me-2" onClick={() => handleSave()}>
          {state.id ? 'Save changes' : 'Create'}
        </Button>

        <Button className="otjs-button otjs-button-red" onClick={() => onHide()}>
          Cancel
        </Button>
      </Modal.Footer>

    </Modal>
  )
}