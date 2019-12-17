import React, {Fragment} from 'react';
import './style.css';
import 'bootstrap/dist/css/bootstrap.css';
import Helmet from "react-helmet";

import NavBar from './components/nav_bar'

function App () {
  return (
    
    <Fragment>
      <Helmet>
        <meta charSet="utf-8" />
        <title>Auto-Retrieve</title>
      </Helmet>
      <h1 className="text-center mb-5">Auto Retrieve</h1>
      <NavBar />
    </Fragment>

  );

  
}

export default App;
