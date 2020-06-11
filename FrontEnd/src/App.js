import React, { Component } from 'react'
import {
  BrowserRouter
} from 'react-router-dom'
import { toast } from 'react-toastify'


import Footer from './components/Main/Footer'
import NavBar from './components/Main/NavBar'

//CSS Boostrap
import 'bootstrap/dist/css/bootstrap.min.css'
//CSS Toastify
import 'react-toastify/dist/ReactToastify.css'
//Css for Boostrap table
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import 'react-bootstrap-table2-filter/dist/react-bootstrap-table2-filter.min.css';
//Css for uppy
import '@uppy/core/dist/style.css'
import '@uppy/drag-drop/dist/style.css'
import '@uppy/status-bar/dist/style.css'
//Custom CSS
import './style.css'

// Configuring Toastify params that will be used all over the app
toast.configure({
  position: 'top-right',
  autoClose: 5000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true
})

class App extends Component {

  state = {
    auth: true
  }

  constructor (props) {
    super(props)
    this.setAuthPanel = this.setAuthPanel.bind(this)
  }
  
  setAuthPanel(bool){
    this.setState({
      auth: bool
    })
  }

  render() {
    return (
      <div className={this.state.auth ? 'authentification' : 'app'}>
        <BrowserRouter>
          <NavBar setAuthPanel={this.setAuthPanel}/>
          <Footer/>
        </BrowserRouter>
      </div>
    );
  }
}

export default App;

