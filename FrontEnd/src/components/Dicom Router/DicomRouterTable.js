import React, { useState } from "react";
import { Button, Modal } from 'react-bootstrap'
import Toggle from 'react-toggle'

import apis from "../../services/apis";
import CommonTableV8 from "../CommonComponents/RessourcesDisplay/ReactTableV8/CommonTableV8";

export default ({ modify, refresh, showMessage, data }) => {

  const [deletes, setDeletes] = useState(false)
  const [id_delete, setId_delete] = useState(-1)

  const columns = [
    {
      header: 'ID',
      accessorKey: 'id',
      enableHidding: true
    },
    {
      header: 'Router\'s Name',
      accessorKey: 'name',
      enableHidding:true
    },
    {
      header: 'Condition',
      accessorKey: 'condition',
    },
    {
      header: 'Rules',
      accessorKey: 'rules',
      cell: (row) => {
        let rules = row.original.rules
        return (
          <div className='container'>
            {rules.map(rule => (<div key={rule.id} className='row m-1 p-2 border border-dark rounded justify-content-center' style={{ 'backgroundColor': 'rgb(88,220,124)' }}>
              <div className='col justify-content-center'>{rule.value}</div>
              <div className='col justify-content-center'>{rule.operator}</div>
              <div className='col justify-content-center'>{rule.target}</div>
            </div>))}
          </div>
        )
      },
    },
    {
      header: 'Target',
      accessorKey: 'target',
      enableHidding: true
    },
    {
      header: 'AET Destination',
      accessorKey: 'destination',
    },
    {
      header: 'Running ?',
      accessorKey: 'running',
      cell: (row) => {
        return (
          <span>
            <Toggle key={row.original.id} checked={row.original.running} onChange={() => { handleSwitch(row.original.id, row.original.running) }} />
          </span>
        )
      }
    },
    {
      header: '',
      accessorKey: 'modify and delete',
      cell: (row) => {
        return (
          <span>
            <Button className='otjs-button otjs-button-orange me-1' onClick={() => { modify(row.original.id) }}>Modify</Button>
            <Button className='otjs-button otjs-button-red' onClick={() => { showDeleteConfirmation(row.original.id) }}>Delete</Button>
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
  const handleSwitch = async (id, running) => {
    await apis.autorouting.switchOnOff(id, !running)
    await refresh()
    showMessage()
  }

  /**
   * Show the modal dialog that confirm the delete process
   * @param {number} id id of the autorouter to delete
   */
  const showDeleteConfirmation = (id) => {
    setDeletes(true)
    setId_delete(id)
  }

  /**
   * Close the modal dialog made for deleting
   */
  const onHide = () => {
    setDeletes(false)
    setId_delete(-1)
  }

  /**
   * Remove the router after deleting was confirmed on the opened modal dialog
   */
  const removeRouter = async () => {
    await apis.autorouting.deleteAutorouter(id_delete)
    onHide()
    refresh()
    showMessage()
  }

  return (<>
    <Modal
      show={deletes}
      keyboard={true}
      animation={true}
      onHide={() => onHide()}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton><h5>Delete Router</h5></Modal.Header>
      <Modal.Body>Are you sure you want to delete this router ?</Modal.Body>
      <Modal.Footer>
        <Button className='otjs-button otjs-button-orange me-1' onClick={() => { onHide() }}>Cancel</Button>
        <Button className='otjs-button otjs-button-red' onClick={() => { removeRouter() }}>Delete</Button>
      </Modal.Footer>
    </Modal>
    <CommonTableV8 columns={columns} tableData={data} />
  </>
  )
}