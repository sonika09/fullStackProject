import MaterializeCSS from 'materialize-css/dist/css/materialize.min.css'
import reduxThunk from 'redux-thunk'
import ReactDOM from "react-dom/client";
import {Provider} from 'react-redux';
import {createStore, applyMiddleware} from 'redux'
import App from './components/App';
import reducers from './reducers'
import axios from 'axios';
window.axios=axios

const el = document.getElementById("root");
const root = ReactDOM.createRoot(el);
 const store = createStore(reducers, {}, applyMiddleware(reduxThunk))
root.render(<Provider store={store}><App/> </Provider> );
