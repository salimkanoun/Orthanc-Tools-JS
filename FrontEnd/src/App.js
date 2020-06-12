import React, { Component } from 'react'
import {
  Switch,
  Route,
  withRouter, 
  BrowserRouter
} from 'react-router-dom'
import { toast } from 'react-toastify'
import { TransitionGroup, CSSTransition } from "react-transition-group";


import Footer from './components/Main/Footer'
import NavBar from './components/Main/NavBar'
import Query from './components/Query/Components/Query'
import AutoQueryRoot from './components/AutoQuery/Component/AutoQueryRoot'
import RobotView from './components/AutoQuery/Component/RobotView'
import Authentication from './components/Authentication'
import AdminRootPanel from './components/Admin/AdminRootPanel'
import Import from './components/Import/Import'
import ContentRootPanel from './components/OrthancContent/ContentRootPanel'
import ExportPanel from './components/Export/ExportPanel'
import AnonRootPanel from './components/Anonymize/AnonRootPanel'

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
  
  setAuthPanel(location){
    this.setState({
      auth: location === '/'
    })
  }

  AnimatedSwitch = withRouter(({location}) => (
    <>
      <TransitionGroup>
        <CSSTransition key={location.key} classNames={location.pathname === '/' ? 'auth' : 'slide'} timeout={500} onEnter={() => this.setAuthPanel(location.pathname)}>
          <Switch location={location}>
            <Route exact path='/' component={Authentication} />
            <Route exact path='/import' component={Import} />
            <Route exact path='/query' component={Query} />
            <Route exact path='/auto-query' component={AutoQueryRoot} />
            <Route exact path='/options' component={AdminRootPanel} />
            <Route exact path='/orthanc-content' component={ContentRootPanel} />
            <Route exact path='/robot/:username' render = { (props) => <RobotView username={props.match.params.username} /> } />
            <Route exact path='/export' component={ExportPanel} />
            <Route exact path='/anonymize' component={AnonRootPanel} />
          </Switch>
        </CSSTransition>
      </TransitionGroup>
    </>
  ))

  render() {
    return (
      <div className={this.state.auth ? 'authentification' : 'app'}>
        <BrowserRouter>
          {this.state.auth ? null : <NavBar />}
          <this.AnimatedSwitch />
          {this.state.auth ? null : <Footer />}
        </BrowserRouter>
      </div>
    );
  }
}

export default App;

