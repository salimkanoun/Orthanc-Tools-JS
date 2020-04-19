import React from 'react'
import {
  Switch,
  Route
} from 'react-router-dom'
import './style.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import Helmet from 'react-helmet'

import Query from './components/Query/Components/Query'
import AutoQueryRoot from './components/AutoQuery/Component/AutoQueryRoot'
import RobotView from './components/AutoQuery/Component/RobotView'
import Authentication from './components/Authentication'
import AdminRootPanel from './components/Admin/AdminRootPanel'
import Import from './components/Import/Import'
import ContentRootPanel from './components/OrthancContent/ContentRootPanel'

import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import NavBar from './components/Main/NavBar'

//Css for boostrap table
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import 'react-bootstrap-table2-filter/dist/react-bootstrap-table2-filter.min.css';
//Css for uppy
import '@uppy/core/dist/style.css'
import '@uppy/drag-drop/dist/style.css'
import '@uppy/status-bar/dist/style.css'

// Configuring Toastify params that will be used all over the app
toast.configure({
  position: 'top-right',
  autoClose: 5000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true
})

function App () {
  return (

    <>
      <Helmet>
        <meta charSet='utf-8' />
        <title>Orthanc Tools</title>
      </Helmet>
      <NavBar />
      <Switch>
        <Route exact path='/' component={Authentication} />
        <Route exact path='/import' component={Import} />
        <Route exact path='/query' component={Query} />
        <Route exact path='/auto-query' component={AutoQueryRoot} />
        <Route exact path='/options' component={AdminRootPanel} />
        <Route exact path='/OrthancContent' component={ContentRootPanel} />
        <Route exact path='/robot/:username' component={RobotView} />
      </Switch>
    </>
  )
}

export default (App)
