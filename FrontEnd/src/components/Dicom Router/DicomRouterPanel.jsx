import React, { useEffect, useState } from "react";
import { Alert, Button, Col, Row } from "react-bootstrap/";
import Toggle from 'react-toggle'

import apis from "../../services/apis";
import DicomRouterTable from './DicomRouterTable'
import DicomRouterModal from './DicomRouterModal'

export default () => {

  const [state, setState] = useState({
    message: false,
    routers: [],
    showModal: false,
    showModify: false,
    modify: { id: null, condition: "", rules: [], destination: [], name: "" }
  })

  useEffect(() => {
    refreshData()
    refreshServiceState()
  }, [])

  /**
   * Compare method for sorting routers by ID
   * @param {number} a ID from router A
   * @param {number} b ID from router B
   * @returns {number} 1 if A more recent than b, -1 if B more recent thant A
   */
  const _compareRouters = (a, b) => {
    if (a.id < b.id) {
      return -1
    } else {
      return 1
    }
  }

  /**
   * Refresh the data needed for the table of routers
   * They get sorted by old to recent
   */
  const refreshData = async () => {
    let routers = await apis.autorouting.getAutorouters()
    routers = await routers.sort(_compareRouters)
    setState((state) => ({
      ...state,
      ['routers']: routers,
      ['modify']: { id: null, condition: "", rules: [], destination: [], name: "" }
    }))
  }

  /**
   * Refresh the status of the router for the toggle button value
   */
  const refreshServiceState = async () => {
    let service = await apis.autorouter.getAutorouter()
    setState((state) => ({
      ...state,
      ['service_running']: service.AutorouterService
    }))
  }

  /**
   * Open the modal dialog that permit to create or modify routers when a router is selected or not
   * if selected, the router could be modified
   * else permit to creare a new router
   * @param {JSON} router router that could be modified with the modal
   */
  const handleOpenModal = (router = null) => {
    if (router) {
      setState((state) => ({
        ...state,
        ['modify']: router
      }))
    }
    setState((state) => ({
      ...state,
      ['showModal']: true
    }))
  }

  /**
   * Close the modal dialog that permit to create or modify routers
   */
  const handleCloseModal = () => {
    setState((state) => ({
      ...state,
      ['modify']: { id: null, condition: "", rules: [], destination: [], name: "" },
      ['showModal']: false
    }))
  }

  /**
   * Catch the event on the toggle to Start or Stop the dicom router
   * @param {JSON} e Toggle button to catch
   */
  const handleAutorouterService = async (e) => {
    if (e.target.checked) {
      await apis.autorouter.startAutorouterService()
      setState((state) => ({
        ...state,
        ['message']: false
      }))
    } else {
      await apis.autorouter.stopAutorouterService()
    }
    refreshServiceState()
  }

  /**
   * Show the information message on top of the screen
   */
  const showMessage = () => {
    if (!state.message) {
      setState((state) => ({
        ...state,
        ['message']: true
      }))
    }
  }

  return (
    <div>
      <div><Alert show={state.message} variant='info'>To apply changes on the router (re)start it !</Alert></div>
      <Row className="border-bottom border-2 pb-3">
        <Col className="d-flex justify-content-start align-items-center">
          <i className="fas fa-broadcast-tower ico me-3"></i><h2 className="card-title">Dicom Router</h2>
        </Col>
        <Col className="text-center">
          <Toggle checked={state.service_running} onChange={(e) => handleAutorouterService(e)} />
        </Col>
      </Row>
      <Row className="mt-5">
        <Button className="otjs-button otjs-button-blue w-10" onClick={() => handleOpenModal()}>Create Router</Button>
      </Row>
      <Row className="mt-5 text-center">
        <Col>
          <DicomRouterTable data={state.routers} refresh={() => refreshData()} modify={handleOpenModal} showMessage={showMessage} />
          <DicomRouterModal data={state.modify} showModal={state.showModal} close={() => handleCloseModal()} refresh={() => refreshData()} showMessage={showMessage} />
        </Col>
      </Row>

    </div>
  )
}
