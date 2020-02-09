import React from 'react'
import { Route, BrowserRouter as Router } from 'react-router-dom'

function createRoutes () {
  return (
      <Router>
            <Route exact path='/'>
              <Authentication />
            </Route>
            <Route path='/query'>
              <Query />
            </Route>
            <Route path='/options'>
              <AdminPanel />
            </Route>
      </Router>
  )
}

export default createRoutes
