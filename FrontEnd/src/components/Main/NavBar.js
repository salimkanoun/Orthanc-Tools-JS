import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import ToolsPanel from './ToolsPanel'
import apis from '../../services/apis'


export default class NavBar extends Component {

  state  = {
    navBackground : '#11ffee00',
    location: '/'
  }
  
  async logout(){
    await apis.authentication.logOut()
  }

  componentDidMount(){
    document.addEventListener("scroll", () => {
      const backgroundcolor = window.scrollY < 50 ? "#11ffee00" : "#0275d8";

      this.setState({ navBackground: backgroundcolor });
    });
  }
  

  render () {
    return (
        <nav className='navbar navbar-expand-lg mb-5 fixed-top' style={ {backgroundColor : this.state.navBackground} } >
          <ul className='navbar-nav mr-auto'>
            <li className='nav-item'>
              <Link className='nav-link' to='/orthanc-content'>Orthanc Content</Link>
            </li>
            <li className='nav-item'>
              <Link className='nav-link' to='/import'>Import</Link>
            </li>
            <li className='nav-item'>
              <Link className='nav-link' to='/query'>Query</Link>
            </li>
            <li className='nav-item'>
              <Link className='nav-link' to='/auto-query'>Auto-Retrieve</Link>
            </li>
            <li className='nav-item'>
              <Link className='nav-link' to='/options'>Administration</Link>
            </li>
            <li className='nav-item float-right'>
              <Link className='nav-link' onClick={this.logout} to='/'>Log out</Link>
            </li>
          </ul>
          <ToolsPanel />
        </nav>
      
    )
  }
  
}
