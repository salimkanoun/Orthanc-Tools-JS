import React, { Fragment } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import './style.css';
import 'bootstrap/dist/css/bootstrap.css';
import Helmet from "react-helmet";

import Query from './components/query'

function App() {
  return (
    <Fragment>
      <Helmet>
      <meta charSet="utf-8" />
      <title>Auto-Retrieve</title>
      </Helmet>
      <Router>
        <div>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/query">Query</Link>
            </li>
          </ul>

          <hr />

          <Switch>
            <Route exact path="/">
            </Route>
            <Route path="/query">
              <Query />
            </Route>
          </Switch>
        </div>
      </Router>
     
    </Fragment>

  );


}

export default App;
