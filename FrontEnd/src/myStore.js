import { applyMiddleware, createStore } from "redux";
import thunk from "redux-thunk";
import reducers from './reducers'


const createStoreWithMiddelware = applyMiddleware(thunk)(createStore)
const store = createStoreWithMiddelware(reducers, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__())

export default store