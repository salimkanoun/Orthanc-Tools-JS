import React from 'react'
import {
  Switch,
  Route
} from 'react-router-dom'
import Helmet from 'react-helmet'
import { toast } from 'react-toastify'

import Query from './components/Query/Components/Query'
import AutoQueryRoot from './components/AutoQuery/Component/AutoQueryRoot'
import RobotView from './components/AutoQuery/Component/RobotView'
import Authentication from './components/Authentication'
import AdminRootPanel from './components/Admin/AdminRootPanel'
import Import from './components/Import/Import'
import ContentRootPanel from './components/OrthancContent/ContentRootPanel'
import Footer from './components/Main/Footer'
import ExportPanel from './components/Export/ExportPanel'
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
import AnonRootPanel from './components/Anonymize/AnonRootPanel'

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
        <Route exact path='/orthanc-content' component={ContentRootPanel} />
        <Route exact path='/robot/:username' component={RobotView} />
        <Route exact path='/export' component={ExportPanel} />
        <Route exact path='/anonymize' component={AnonRootPanel} />
      </Switch>
      <Footer/>
    </>
  )
}

export default (App)
