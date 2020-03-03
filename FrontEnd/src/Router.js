import React from 'react'
import { Route, BrowserRouter as Router } from 'react-router-dom'

function createRoutes () {
  return (
      <Router>
            <Route exact path='/'>
              <Authentication />
            </Route>
            <Route exact path='/query'>
              <Query />
            </Route>
            <Route exact path='/options'>
              <AdminPanel />
            </Route>
      </Router>
  )
}

export default createRoutes
