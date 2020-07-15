import React, { Component } from 'react'
import {
  BrowserRouter
} from 'react-router-dom'
import { toast } from 'react-toastify'


import Footer from './components/Main/Footer'
import NavBar from './components/Main/NavBar'
import Authentication from './components/Authentication'

//CSS Boostrap
import 'bootstrap/dist/css/bootstrap.min.css'
//CSS Toastify
import 'react-toastify/dist/ReactToastify.css'
//Css for Boostrap table
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import 'react-bootstrap-table2-filter/dist/react-bootstrap-table2-filter.min.css';

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
  
  setAuthPanel(location){
    this.setState({
      auth: location === '/'
    })
  }

  

  render() {
    return (
      <div className={this.state.auth ? 'authentification' : 'app'}>
        <BrowserRouter>
          {!this.state.auth ? <NavBar setLocation={this.setAuthPanel}/> : <Authentication setLocation={this.setAuthPanel}/>}
          {this.state.auth ? null : <Footer />}
        </BrowserRouter>
      </div>
    );
  }
}

export default App;

