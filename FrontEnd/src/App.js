import React, { Component } from 'react'

import { toast } from 'react-toastify'
import fetchIntercept from 'fetch-intercept'

import NavBar from './components/Main/NavBar'
import Authentication from './components/Authentication'

import { login, logout } from './actions/login'
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
        if (response.status === 401 && !response.url.includes('authentication')) {
          this.setState({
            authentified: false
          })
          toast.error('Session exprired, please re-identify')
        }
        return response;
      },
    
      responseError: function (error) {
        return Promise.reject(error);
      }
    });

  }


  login = (logInAnwser) => {
    this.props.login(logInAnwser)
  }

  logout = async () => {
    this.props.logout() //empty all reducer
    await apis.authentication.logOut() //ask backend to reset cookie http only
  }



  render() {
    return (
      <BrowserRouter>
        {this.props.username ? <NavBar onLogout={this.logout} roles={this.props.roles} /> : <Authentication onLogin={this.login} />}
      </BrowserRouter>
    );
  }
}


const mapsDispatchToProps = {
  logout,
  login
}

const mapStateToProps = (state) => {
  return {
    username: state.OrthancTools.username,
    roles: state.OrthancTools.roles
  }
}

export default connect(mapStateToProps, mapsDispatchToProps)(App)

