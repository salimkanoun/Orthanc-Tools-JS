import React, {fragment} from 'react';
import './style.css';
import 'bootstrap/dist/css/bootstrap.css';
import FormInput from './components/form_input'
import CsvLoader from './components/csv_loader'

function App() {
  return (
    <fragment>
      <FormInput></FormInput>
      <CsvLoader></CsvLoader>
    </fragment>

  );
}

export default App;
