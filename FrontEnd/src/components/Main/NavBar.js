import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import ToolsPanel from './ToolsPanel'

export default class NavBar extends Component {

  render () {
    return (
      <nav className='navbar navbar-expand-lg navbar-light mb-5 fixed-top'>
        <ul className='navbar-nav mr-auto'>
          <li className='nav-item'>
            <Link className='nav-link text-white' to='/'>Authentication</Link>
          </li>
          <li className='nav-item'>
            <Link className='nav-link text-white' to='/orthanc-content'>Orthanc Content</Link>
          </li>
          <li className='nav-item'>
            <Link className='nav-link text-white' to='/import'>Import</Link>
          </li>
          <li className='nav-item'>
            <Link className='nav-link text-white' to='/query'>Query</Link>
          </li>
          <li className='nav-item'>
            <Link className='nav-link text-white' to='/auto-query'>Auto-Retrieve</Link>
          </li>
          <li className='nav-item'>
            <Link className='nav-link text-white' to='/options'>Administration</Link>
          </li>
        </ul>
        <ToolsPanel />
      </nav>
    )
  }
  
}
