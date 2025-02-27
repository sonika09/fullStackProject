import { combineReducers } from "redux";
import {reducer as reduxForm} from 'redux-form'
import authReducers from "./authReducers";
import surveysReducers from "./surveysReducers";

export default combineReducers ({
    auth: authReducers,
    surveys:surveysReducers,
    form:reduxForm
})