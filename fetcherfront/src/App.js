import React, {Fragment} from 'react';
import './style.css';
import 'bootstrap/dist/css/bootstrap.css';
import FormInput from './components/form_input'
import CsvLoader from './components/csv_loader'

function App () {
  return (
    
    <Fragment>
      <FormInput ></FormInput>
      <CsvLoader></CsvLoader>
    </Fragment>

  );

  
}

export default App;
