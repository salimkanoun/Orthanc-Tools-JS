import React, {Fragment} from 'react'
import {
  Switch,
  Route
} from 'react-router-dom'
import './style.css'
import 'bootstrap/dist/css/bootstrap.css'
import Helmet from 'react-helmet'

import Query from './components/Query/Query'
import AutoQuery from './components/AutoQuery/Connected_Component/AutoQuery'
import RobotView from './components/AutoQuery/Component/RobotView'
import Authentication from './components/Authentication'
import AdminPanel from './components/Admin/AdminPanel'


import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import NavBar from './components/Main/NavBar'

// Call it once in your app. At the root of your app is the best place
toast.configure()

function App () {
  return (
    
    <Fragment>
      <Helmet>
        <meta charSet='utf-8' />
        <title>Orthanc Tools</title>
      </Helmet>
      <NavBar/>
      <Switch>
          <Route exact path='/' component={Authentication}>
          </Route>
          <Route exact path='/query' component = {Query}>
          </Route>
          <Route exact path='/auto-query' component = {AutoQuery}>
          </Route>
          <Route exact path='/options' component = {AdminPanel}>
          </Route>
          <Route exact path='/robot/:username' component = {RobotView}>
          </Route>
      </Switch>
    </Fragment>
  )
}

export default (App)
