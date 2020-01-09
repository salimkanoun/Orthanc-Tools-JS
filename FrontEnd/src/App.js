import React from 'react'
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from 'react-router-dom'
import './style.css'
import 'bootstrap/dist/css/bootstrap.css'
import Helmet from 'react-helmet'

import Query from './components/query'
import Authentication from './components/Authentication'
import Options from './components/Options'

function App () {
  return (
    <>
      <Helmet>
        <meta charSet='utf-8' />
        <title>Orthanc Tools</title>
      </Helmet>
      <Router>
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
        <div>
          <Switch>
            <Route exact path='/'>
              <Authentication />
            </Route>
            <Route path='/query'>
              <Query />
            </Route>
            <Route path='/options'>
              <Options />
            </Route>
          </Switch>
        </div>
      </Router>

    </>

  )
}

export default App
