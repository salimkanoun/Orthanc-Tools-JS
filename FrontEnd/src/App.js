import React, { Component } from 'react'

import { toast } from 'react-toastify'
import fetchIntercept from 'fetch-intercept'

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
import './assets/styles/orthancToolsJs.css'
import { BrowserRouter } from 'react-router-dom'
import { toastifyError } from './services/toastify'

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
    roles: {}
  }

  constructor(props){
    super(props)

    fetchIntercept.register({
      request: function (url, config) {
        // Modify the url or config here
        return [url, config];
      },
    
      requestError: function (error) {
        // Called when an error occured during another 'request' interceptor call
        return Promise.reject(error);
      },
    
      response: async (response) => {
        if (response.status === 401 && !response.url.includes('session')) {
          this.setState({
            authentified: false
          })
          toastifyError('Session exprired, please re-identify')
        }
        return response;
      },
    
      responseError: function (error) {
        return Promise.reject(error);
      }
    });

  }


  login = (logInAnwser) => {
    console.log(logInAnwser)
    this.setState({
      authentified: true,
      roles: logInAnwser
    })
    this.props.saveUsername(logInAnwser.username)

  }

  logout = async () => {
    this.setState({
      authentified: false
    })
    this.props.resetReducer() //empty all reducer
    await apis.authentication.logOut() //ask backend to reset cookie http only

  }



  render() {
    return (
      <BrowserRouter>
        {this.state.authentified ? <NavBar onLogout={this.logout} token={this.state.roles} /> : <Authentication onLogin={this.login} />}
      </BrowserRouter>
    );
  }
}


const mapsDispatchToProps = {
  resetReducer,
  saveUsername
}

export default connect(null, mapsDispatchToProps)(App)

