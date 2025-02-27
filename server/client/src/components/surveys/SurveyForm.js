import React, { Component } from "react";
import map from "lodash/map";
import each from "lodash/each";
import { reduxForm, Field } from "redux-form";
import SurveyField from "./SurveyField";
import validateEmails from "../../utils/validateEmails";
import { Link } from "react-router-dom";
import { FIELDS } from "./formField";

class SurveyForm extends Component {
  renderField() {
    return map(FIELDS, ({ name, label }) => {
      return (
        <Field component={SurveyField} type="text" name={name} label={label} />
      );
    });
  }
  render() {
    return (
      <div>
        <form
          onSubmit={this.props.handleSubmit(this.props.onSurveySubmit)}
        >
          {this.renderField()}
          <Link to="/surveys" className="red btn-flat white-text">
            Cancel
          </Link>
          <button type="submit" className="teal btn-flat right white-text">
            Submit
            <i className="material-icons right">done</i>
          </button>
        </form>
      </div>
    );
  }
}
function validate(values) {
  const errors = {};

  each(FIELDS, ({ name }) => {
    console.log(name);
    if (!values[name]) {
      errors[name] = `you must provide a value`;
    }
  });
  errors.recipients = validateEmails(values.recipients || "");

  return errors;
}

export default reduxForm({
  validate,
  form: "surveyForm",
  destroyOnUnmount:false
})(SurveyForm);
