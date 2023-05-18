import * as  ReactDOMClient from 'react-dom/client'
import App from './App'

import * as serviceWorker from './serviceWorker'

import { Provider } from 'react-redux'
import store from './myStore'
import { BrowserRouter } from 'react-router-dom'

const container = document.getElementById('root');
const root = ReactDOMClient.createRoot(container);

root.render(
    <BrowserRouter>
      <Provider store={store}>
        <App />
      </Provider>
    </BrowserRouter>
)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister()
