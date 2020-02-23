import React, {Fragment} from 'react'
import {
  Switch,
  Route,
  Link
} from 'react-router-dom'
import './style.css'
import 'bootstrap/dist/css/bootstrap.css'
import Helmet from 'react-helmet'

import Query from './components/Query/Connected_Component/Query'
import Authentication from './components/Authentication'
import AdminPanel from './components/Admin/AdminPanel'
import RobotView from './components/Query/Component/RobotView'

import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Call it once in your app. At the root of your app is the best place
toast.configure()

function App () {
  return (
    
    <Fragment>
      <Helmet>
        <meta charSet='utf-8' />
        <title>Orthanc Tools</title>
      </Helmet>
      <Fragment>
        <div className='navbar navbar-expand-lg navbar-light bg-light mb-5'>
            <ul className='navbar-nav mr-auto'>
            <li className='nav-item'>
                <Link className='nav-link' to='/'>Authentication</Link>
            </li>
            <li className='nav-item'>
                <Link className='nav-link' to='/query'>Query</Link>
            </li>
            <li className='nav-item'>
                <Link className='nav-link' to='/options'>Options</Link>
            </li>
            </ul>
            <hr />
        </div>
      </Fragment>
        <div >
          <Switch>
              <Route exact path='/' component={Authentication}>
              </Route>
              <Route exact path='/query' component = {Query}>
              </Route>
              <Route exact path='/options' component = {AdminPanel}>
              </Route>
              <Route exact path='/robot/:username' component = {RobotView}>
              </Route>
          </Switch>
        </div>
    </Fragment>
  )
}

export default (App)
