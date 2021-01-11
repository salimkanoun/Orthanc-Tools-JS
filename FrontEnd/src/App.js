import React, { Component } from 'react'
import {
  BrowserRouter
} from 'react-router-dom'
import { toast } from 'react-toastify'

import NavBar from './components/Main/NavBar'
import Authentication from './components/Authentication'

import { resetReducer } from './actions/LogOut'
import { saveUsername } from './actions/Username'
import { connect } from 'react-redux'
import apis from './services/apis'

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
    authentified: false,
    roles : {}
  }
  

  login = (logInAnwser) => {
    console.log(logInAnwser)
    this.setState({
      authentified: true,
      roles : logInAnwser
    })
    this.props.saveUsername(logInAnwser.username)

  }

  logout = async() => {
    this.setState({
      authentified: false
    })
    this.props.resetReducer() //empty all reducer
    await apis.authentication.logOut() //ask backend to reset cookie http only

  }

  

  render() {
    return (
        <BrowserRouter>
          {this.state.authentified ? <NavBar onLogout = {this.logout} token = {this.state.roles} onLogout = {this.logout}/> : <Authentication onLogin = {this.login}/>  }
        </BrowserRouter>
    );
  }
}


const mapsDispatchToProps = {
  resetReducer,
  saveUsername
}

export default connect(null, mapsDispatchToProps)(App)

